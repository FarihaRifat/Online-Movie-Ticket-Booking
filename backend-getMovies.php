<?php
// ============================================
// GET MOVIES API
// Fetch all movies from Supabase
// ============================================
require_once 'backend-config.php';

try {
    $query = "SELECT * FROM movies ORDER BY created_at DESC";
    $result = pg_query($conn, $query);

    if (!$result) {
        throw new Exception("Error fetching movies: " . pg_last_error($conn));
    }

    $movies = [];
    while ($row = pg_fetch_assoc($result)) {
        $movies[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $movies,
        "count" => count($movies)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

pg_close($conn);
?>
