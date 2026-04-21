<?php
// ============================================
// BOOK SEATS API - Supabase PostgreSQL
// ============================================
require_once "backend-config.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["movie_id"]) || !isset($data["showtime"]) || !isset($data["seats"]) || 
        !isset($data["total_amount"]) || !isset($data["contact_number"])) {
        throw new Exception("Missing required fields");
    }

    $movie_id = (int)$data["movie_id"];
    $showtime = $data["showtime"];
    $seats = is_array($data["seats"]) ? implode(",", $data["seats"]) : $data["seats"];
    $total_amount = (float)$data["total_amount"];
    $contact_number = $data["contact_number"];

    // Validate movie exists
    $stmt = $conn->prepare("SELECT id FROM movies WHERE id = :id");
    $stmt->execute([":id" => $movie_id]);
    if (!$stmt->fetch(PDO::FETCH_ASSOC)) {
        throw new Exception("Movie not found");
    }

    // Insert booking
    $query = "INSERT INTO bookings (movie_id, showtime, seats, total_amount, contact_number) 
              VALUES (:movie_id, :showtime, :seats, :total_amount, :contact_number)
              RETURNING id, movie_id, showtime, seats, total_amount, contact_number, created_at";
    
    $stmt = $conn->prepare($query);
    $stmt->execute([
        ":movie_id" => $movie_id,
        ":showtime" => $showtime,
        ":seats" => $seats,
        ":total_amount" => $total_amount,
        ":contact_number" => $contact_number
    ]);
    
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "data" => $booking,
        "message" => "Booking created successfully in Supabase!"
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
