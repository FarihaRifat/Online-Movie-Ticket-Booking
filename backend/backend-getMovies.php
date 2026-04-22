<?php
// ============================================
// GET MOVIES API - Supabase PostgreSQL
// ============================================
require_once "backend-config.php";

try {
    $query = "SELECT id, title, description, poster_url as posterUrl, price, created_at FROM movies ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $movies = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "data" => $movies,
        "count" => count($movies)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error fetching movies: " . $e->getMessage()
    ]);
}

$conn = null;
?>
