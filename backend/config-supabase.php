<?php
// ============================================
// Supabase Database Connection Configuration
// ============================================

// Supabase Connection Details
$db_host = "db.bxlwxucefflxeiyqeoew.supabase.co";
$db_port = 5432;
$db_name = "postgres";
$db_user = "postgres";
$db_password = "Fariha@8827"; // Note: Keep this secure, consider environment variables for production

// PostgreSQL Connection String (for reference)
// postgresql://postgres:Fariha@8827@db.bxlwxucefflxeiyqeoew.supabase.co:5432/postgres

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
    die(json_encode(["error" => "Connection failed to Supabase database"]));
}

// Set encoding to UTF-8
pg_set_client_encoding($conn, "UTF8");

// Return connection for use in other files
// Example usage in other files:
// require_once 'config.php';
// $result = pg_query($conn, "SELECT * FROM movies");

?>
