<?php
// ============================================
// Enable CORS for frontend requests
// ============================================
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Supabase Connection Details
$db_host = "db.bxlwxucefflxeiyqeoew.supabase.co";
$db_port = 5432;
$db_name = "postgres";
$db_user = "postgres";
$db_password = "Fariha@8827";

// Connect to PostgreSQL Database
$conn = pg_connect(
    "host=" . $db_host . 
    " port=" . $db_port . 
    " dbname=" . $db_name . 
    " user=" . $db_user . 
    " password=" . $db_password .
    " sslmode=require"
);

// Check connection
if (!$conn) {
    die(json_encode(["error" => "Connection failed to Supabase database: " . pg_last_error()]));
}

// Set encoding to UTF-8
pg_set_client_encoding($conn, "UTF8");

?>
