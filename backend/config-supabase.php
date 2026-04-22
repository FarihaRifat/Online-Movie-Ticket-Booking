<?php
// Legacy reference — use DATABASE_URL / backend-config.php for production.
// Do not commit real credentials; configure Railway variables instead.

$db_host = getenv("SUPABASE_POOLER_HOST") ?: getenv("SUPABASE_DB_HOST") ?: "";
$db_port = (int) (getenv("SUPABASE_POOLER_PORT") ?: 5432);
$db_name = getenv("SUPABASE_DB_NAME") ?: "postgres";
$db_user = getenv("SUPABASE_DB_USER") ?: "";
$db_password = getenv("SUPABASE_DB_PASSWORD") ?: "";

if ($db_host === "" || $db_user === "") {
    die(json_encode(["error" => "Set DATABASE_URL or pooler env vars (see DEPLOYMENT_README.md)"]));
}

$conn = pg_connect(
    "host=" . $db_host .
    " port=" . $db_port .
    " dbname=" . $db_name .
    " user=" . $db_user .
    " password=" . $db_password .
    " sslmode=require"
);

if (!$conn) {
    die(json_encode(["error" => "Connection failed"]));
}

pg_set_client_encoding($conn, "UTF8");
