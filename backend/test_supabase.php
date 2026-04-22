<?php
// Optional CLI test: DATABASE_URL must be set (same as Railway).
$url = getenv("DATABASE_URL");
if (!$url) {
    fwrite(STDERR, "Set DATABASE_URL (Session pooler URI from Supabase).\n");
    exit(1);
}

$url = preg_replace('#^postgresql:#i', "postgres:", trim($url));
$parts = parse_url($url);
if ($parts === false || empty($parts["host"])) {
    fwrite(STDERR, "Invalid DATABASE_URL.\n");
    exit(1);
}

$host = $parts["host"];
$port = isset($parts["port"]) ? (int) $parts["port"] : 5432;
$dbname = isset($parts["path"]) ? ltrim((string) $parts["path"], "/") : "postgres";
$user = isset($parts["user"]) ? rawurldecode((string) $parts["user"]) : "";
$pass = isset($parts["pass"]) ? rawurldecode((string) $parts["pass"]) : "";

$dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";
$pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
echo "Connected.\n";
