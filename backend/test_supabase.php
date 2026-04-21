<?php
// Test Supabase PostgreSQL connection
$db_host = "db.bxlwxucefflxeiyqeoew.supabase.co";
$db_port = 5432;
$db_name = "postgres";
$db_user = "postgres";
$db_password = "Fariha@8827";

try {
    $pdo = new PDO(
        "pgsql:host=$db_host;port=$db_port;dbname=$db_name;sslmode=require",
        $db_user,
        $db_password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "✓ Connected to Supabase PostgreSQL successfully!\n";
    
    // Check if bookings table exists
    $stmt = $pdo->query("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'bookings'");
    $table_exists = (int)$stmt->fetchColumn() > 0;
    
    echo $table_exists ? "✓ Bookings table exists\n" : "✗ Bookings table does not exist\n";
    
} catch (PDOException $e) {
    echo "✗ Connection failed: " . $e->getMessage() . "\n";
}
?>
