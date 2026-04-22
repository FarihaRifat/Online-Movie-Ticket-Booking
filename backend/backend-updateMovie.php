<?php
// ============================================
// UPDATE MOVIE API - Supabase PostgreSQL
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

    $id = (int)$data["id"];
    $title = $data["title"] ?? null;
    $description = $data["description"] ?? null;
    $posterUrl = $data["posterUrl"] ?? null;
    $price = $data["price"] ?? null;

    // Build update query dynamically
    $updates = [];
    $params = [":id" => $id];

    if ($title !== null) {
        $updates[] = "title = :title";
        $params[":title"] = $title;
    }
    if ($description !== null) {
        $updates[] = "description = :description";
        $params[":description"] = $description;
    }
    if ($posterUrl !== null) {
        $updates[] = "poster_url = :poster_url";
        $params[":poster_url"] = $posterUrl;
    }
    if ($price !== null) {
        $updates[] = "price = :price";
        $params[":price"] = $price;
    }

    if (empty($updates)) {
        throw new Exception("No fields to update");
    }

    $query = "UPDATE movies SET " . implode(", ", $updates) . " WHERE id = :id RETURNING id, title, description, poster_url as posterUrl, price, created_at";
    
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    
    $movie = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$movie) {
        throw new Exception("Movie not found");
    }

    echo json_encode([
        "success" => true,
        "data" => $movie,
        "message" => "Movie updated successfully"
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
