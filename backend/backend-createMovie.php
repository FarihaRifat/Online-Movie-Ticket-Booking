<?php
// ============================================
// CREATE MOVIE API - Supabase PostgreSQL
// ============================================
require_once "backend-config.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["title"]) || !isset($data["description"]) || !isset($data["posterUrl"]) || !isset($data["price"])) {
        throw new Exception("Missing required fields: title, description, posterUrl, price");
    }

    $query = "INSERT INTO movies (title, description, poster_url, price) 
              VALUES (:title, :description, :poster_url, :price)
              RETURNING id, title, description, poster_url as posterUrl, price, created_at";
    
    $stmt = $conn->prepare($query);
    $stmt->execute([
        ":title" => $data["title"],
        ":description" => $data["description"],
        ":poster_url" => $data["posterUrl"],
        ":price" => $data["price"]
    ]);
    
    $movie = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "data" => $movie,
        "message" => "Movie created successfully"
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

$conn = null;
?>
