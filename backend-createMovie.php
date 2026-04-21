<?php
// ============================================
// CREATE MOVIE API
// Add a new movie to Supabase
// ============================================
require_once 'backend-config.php';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Get POST data
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate required fields
    if (!isset($data['title']) || !isset($data['description']) || !isset($data['posterUrl']) || !isset($data['price'])) {
        throw new Exception("Missing required fields: title, description, posterUrl, price");
    }

    $title = $data['title'];
    $description = $data['description'];
    $posterUrl = $data['posterUrl'];
    $price = $data['price'];

    // Insert into database
    $query = "INSERT INTO movies (title, description, \"posterUrl\", price) 
              VALUES ($1, $2, $3, $4)
              RETURNING *";
    
    $result = pg_query_params($conn, $query, array($title, $description, $posterUrl, $price));

    if (!$result) {
        throw new Exception("Error creating movie: " . pg_last_error($conn));
    }

    $movie = pg_fetch_assoc($result);

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Movie created successfully",
        "data" => $movie
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

pg_close($conn);
?>
