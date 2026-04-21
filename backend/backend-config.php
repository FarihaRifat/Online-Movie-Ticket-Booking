<?php
// ============================================
// Supabase PostgreSQL Configuration
// ============================================

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Supabase Database Connection Details
$db_config = [
    "host" => "db.bxlwxucefflxeiyqeoew.supabase.co",
    "port" => 5432,
    "dbname" => "postgres",
    "user" => "postgres",
    "password" => "Fariha@8827"
];

// Connect to Supabase PostgreSQL
try {
    $dsn = "pgsql:host={$db_config['host']};port={$db_config['port']};dbname={$db_config['dbname']}";
    
    $conn = new PDO(
        $dsn,
        $db_config['user'],
        $db_config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    
    // Set SSL mode
    $conn->setAttribute(PDO::ATTR_TIMEOUT, 10);
    
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        "success" => false,
        "error" => "Database connection failed",
        "message" => $e->getMessage()
    ]));
}

// Set default schema and enable extensions
try {
    $conn->exec("SET search_path = public");
    
    // Create required tables if they don'\''t exist
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
    
    // Create indexes if they don'\''t exist
    $conn->exec("CREATE INDEX IF NOT EXISTS idx_times_movie_id ON times(movie_id)");
    $conn->exec("CREATE INDEX IF NOT EXISTS idx_bookings_movie_id ON bookings(movie_id)");
    
} catch (PDOException $e) {
    error_log("Table creation error: " . $e->getMessage());
    // Continue - tables might already exist
}

?>
