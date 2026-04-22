<?php
/**
 * Supabase PostgreSQL — production config is environment variables only (Railway).
 *
 * Set ONE of:
 *   DATABASE_URL — Supabase Dashboard → Connect → Session pooler → URI (encode @ in password as %40)
 * OR these together:
 *   SUPABASE_POOLER_HOST, SUPABASE_DB_PASSWORD
 *   optional: SUPABASE_POOLER_PORT (default 5432), SUPABASE_DB_USER (default postgres.<SUPABASE_PROJECT_REF>),
 *             SUPABASE_DB_NAME (default postgres), SUPABASE_PROJECT_REF (default matches your Supabase project ref)
 */

if (!headers_sent()) {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

function respond_db_not_configured(): void
{
    http_response_code(503);
    echo json_encode([
        "success" => false,
        "error" => "database_not_configured",
        "message" => "Railway: add variable DATABASE_URL (Supabase → Connect → Session pooler URI). If your password contains @, use %40 instead of @. Alternative: SUPABASE_POOLER_HOST + SUPABASE_DB_PASSWORD (+ optional SUPABASE_DB_USER).",
    ]);
    exit;
}

/**
 * @return array{host:string,port:int,dbname:string,user:string,password:string}|null
 */
function parse_postgres_url(string $url): ?array
{
    $url = preg_replace('#^postgresql:#i', "postgres:", trim($url));
    $parts = parse_url($url);
    if ($parts === false || empty($parts["host"])) {
        return null;
    }

    return [
        "host" => (string) $parts["host"],
        "port" => isset($parts["port"]) ? (int) $parts["port"] : 5432,
        "dbname" => isset($parts["path"]) ? ltrim((string) $parts["path"], "/") ?: "postgres" : "postgres",
        "user" => isset($parts["user"]) ? rawurldecode((string) $parts["user"]) : "",
        "password" => isset($parts["pass"]) ? rawurldecode((string) $parts["pass"]) : "",
    ];
}

$projectRef = getenv("SUPABASE_PROJECT_REF") ?: "bxlwxucefflxeiyqeoew";

$db_config = null;

$dbUrl = getenv("DATABASE_URL");
if (is_string($dbUrl) && trim($dbUrl) !== "") {
    $db_config = parse_postgres_url($dbUrl);
    if ($db_config === null || $db_config["user"] === "" || $db_config["password"] === "") {
        respond_db_not_configured();
    }
} else {
    $poolHost = getenv("SUPABASE_POOLER_HOST");
    $password = getenv("SUPABASE_DB_PASSWORD");
    if (!is_string($poolHost) || $poolHost === "" || $password === false || $password === "") {
        respond_db_not_configured();
    }
    $db_config = [
        "host" => $poolHost,
        "port" => (int) (getenv("SUPABASE_POOLER_PORT") ?: 5432),
        "dbname" => getenv("SUPABASE_DB_NAME") ?: "postgres",
        "user" => getenv("SUPABASE_DB_USER") ?: ("postgres." . $projectRef),
        "password" => (string) $password,
    ];
}

$host = $db_config["host"];
$port = (int) $db_config["port"];
$dbname = $db_config["dbname"];
$user = $db_config["user"];
$password = $db_config["password"];

$dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";

try {
    $conn = new PDO(
        $dsn,
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => true,
        ]
    );
    $conn->setAttribute(PDO::ATTR_TIMEOUT, 15);
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
