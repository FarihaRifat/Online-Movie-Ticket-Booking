<?php
// ============================================
// DELETE MOVIE API
// Delete a movie from Supabase
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
    if (!isset($data['id'])) {
        throw new Exception("Missing required field: id");
    }

    $id = $data['id'];

    // Delete from database
    $query = "DELETE FROM movies WHERE id = $1 RETURNING *";
    
    $result = pg_query_params($conn, $query, array($id));

    if (!$result) {
        throw new Exception("Error deleting movie: " . pg_last_error($conn));
    }

    $deleted_movie = pg_fetch_assoc($result);

    if (!$deleted_movie) {
        throw new Exception("Movie not found");
    }

    echo json_encode([
        "success" => true,
        "message" => "Movie deleted successfully",
        "data" => $deleted_movie
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
