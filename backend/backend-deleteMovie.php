<?php
// ============================================
// DELETE MOVIE API - Supabase PostgreSQL
// ============================================
require_once "backend-config.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["id"])) {
        throw new Exception("Movie ID is required");
    }

    $query = "DELETE FROM movies WHERE id = :id RETURNING id";
    $stmt = $conn->prepare($query);
    $stmt->execute([":id" => $data["id"]]);
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$result) {
        throw new Exception("Movie not found");
    }

    echo json_encode([
        "success" => true,
        "message" => "Movie deleted successfully"
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
