<?php
// ============================================
// Supabase PostgreSQL Configuration
// ============================================

if (!headers_sent()) {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type");
}

/**
 * IPv4 for hostname when local DNS only returns AAAA (Railway has no IPv6 to Supabase).
 */
function resolve_ipv4_for_host(string $hostname): ?string
{
    $ip = @gethostbyname($hostname);
    if ($ip !== $hostname && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
        return $ip;
    }

    if (function_exists("dns_get_record")) {
        $records = @dns_get_record($hostname, DNS_A);
        if (is_array($records)) {
            foreach ($records as $r) {
                if (!empty($r["ip"]) && filter_var($r["ip"], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
                    return $r["ip"];
                }
            }
        }
    }

    $url = "https://dns.google/resolve?name=" . rawurlencode($hostname) . "&type=A";
    $ctx = stream_context_create([
        "http" => [
            "timeout" => 5,
            "header" => "Accept: application/dns-json\r\n",
        ],
    ]);
    $json = @file_get_contents($url, false, $ctx);
    if ($json === false) {
        return null;
    }
    $data = json_decode($json, true);
    if (!empty($data["Answer"]) && is_array($data["Answer"])) {
        foreach ($data["Answer"] as $ans) {
            if (($ans["type"] ?? null) === 1 && !empty($ans["data"])) {
                $a = trim($ans["data"], '"');
                if (filter_var($a, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
                    return $a;
                }
            }
        }
    }

    return null;
}

$projectRef = "bxlwxucefflxeiyqeoew";

$db_config = [
    "host" => "db.{$projectRef}.supabase.co",
    "port" => 5432,
    "dbname" => "postgres",
    "user" => "postgres",
    "password" => "Fariha@8827",
];

// Paste full URI from Supabase → Connect → Session pooler (IPv4) or Transaction pooler. URL-encode @ in password (e.g. %40).
$dbUrl = getenv("DATABASE_URL");
if (is_string($dbUrl) && $dbUrl !== "") {
    $parts = parse_url($dbUrl);
    if ($parts !== false && !empty($parts["host"])) {
        $db_config["host"] = $parts["host"];
        $db_config["port"] = isset($parts["port"]) ? (int) $parts["port"] : 5432;
        $db_config["dbname"] = isset($parts["path"]) ? ltrim((string) $parts["path"], "/") : "postgres";
        $db_config["user"] = isset($parts["user"]) ? rawurldecode((string) $parts["user"]) : $db_config["user"];
        $db_config["password"] = isset($parts["pass"]) ? rawurldecode((string) $parts["pass"]) : $db_config["password"];
    }
} elseif (getenv("RAILWAY_ENVIRONMENT") !== false) {
    // Direct db.* is "Not IPv4 compatible" per Supabase; Railway is IPv4-only. Use Session pooler (port 5432, user postgres.<ref>).
    // Set SUPABASE_REGION in Railway to match Supabase → Project Settings → Infrastructure → Region (e.g. ap-south-1, us-east-1).
    $region = getenv("SUPABASE_REGION") ?: "ap-south-1";
    $db_config["host"] = "aws-0-{$region}.pooler.supabase.com";
    $db_config["port"] = 5432;
    $db_config["user"] = "postgres.{$projectRef}";
}

try {
    $host = $db_config["host"];
    $port = (int) $db_config["port"];
    $dbname = $db_config["dbname"];

    $ipv4 = resolve_ipv4_for_host($host);
    if ($ipv4 !== null) {
        $dsn = "pgsql:hostaddr={$ipv4};host={$host};port={$port};dbname={$dbname};sslmode=require";
    } else {
        $dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";
    }

    $conn = new PDO(
        $dsn,
        $db_config["user"],
        $db_config["password"],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    $conn->setAttribute(PDO::ATTR_TIMEOUT, 10);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        "success" => false,
        "error" => "Database connection failed",
        "message" => $e->getMessage(),
    ]));
}

try {
    $conn->exec("SET search_path = public");

    $conn->exec("
        CREATE TABLE IF NOT EXISTS movies (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            poster_url VARCHAR(500) NOT NULL,
            price DECIMAL(10, 2) DEFAULT 0.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    $conn->exec("
        CREATE TABLE IF NOT EXISTS times (
            id SERIAL PRIMARY KEY,
            movie_id INT NOT NULL,
            time VARCHAR(10) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
        )
    ");

    $conn->exec("
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            movie_id INT NOT NULL,
            showtime VARCHAR(255) NOT NULL,
            seats VARCHAR(255) NOT NULL,
            total_amount DECIMAL(10, 2) NOT NULL,
            contact_number VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
        )
    ");

    $conn->exec("CREATE INDEX IF NOT EXISTS idx_times_movie_id ON times(movie_id)");
    $conn->exec("CREATE INDEX IF NOT EXISTS idx_bookings_movie_id ON bookings(movie_id)");

} catch (PDOException $e) {
    error_log("Table creation error: " . $e->getMessage());
}
