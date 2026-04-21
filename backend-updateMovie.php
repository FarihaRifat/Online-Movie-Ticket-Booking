<?php
// ============================================
// UPDATE MOVIE API
// Update an existing movie in Supabase
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
    $title = $data['title'] ?? null;
    $description = $data['description'] ?? null;
    $posterUrl = $data['posterUrl'] ?? null;
    $price = $data['price'] ?? null;

    // Build dynamic update query
    $updates = [];
    $params = [];
    $param_count = 1;

    if ($title !== null) {
        $updates[] = "title = \$" . $param_count;
        $params[] = $title;
        $param_count++;
    }
    if ($description !== null) {
        $updates[] = "description = \$" . $param_count;
        $params[] = $description;
        $param_count++;
    }
    if ($posterUrl !== null) {
        $updates[] = "\"posterUrl\" = \$" . $param_count;
        $params[] = $posterUrl;
        $param_count++;
    }
    if ($price !== null) {
        $updates[] = "price = \$" . $param_count;
        $params[] = $price;
        $param_count++;
    }

    if (empty($updates)) {
        throw new Exception("No fields to update");
    }

    $params[] = $id;
    $update_string = implode(", ", $updates);

    $query = "UPDATE movies SET " . $update_string . " WHERE id = \$" . $param_count . " RETURNING *";
    
    $result = pg_query_params($conn, $query, $params);

    if (!$result) {
        throw new Exception("Error updating movie: " . pg_last_error($conn));
    }

    $movie = pg_fetch_assoc($result);

    if (!$movie) {
        throw new Exception("Movie not found");
    }

    echo json_encode([
        "success" => true,
        "message" => "Movie updated successfully",
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
