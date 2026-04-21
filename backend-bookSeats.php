<?php
// ============================================
// BOOK SEATS API
// Create a booking in Supabase
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
    if (!isset($data['movie_id']) || !isset($data['showtime']) || !isset($data['seats']) || !isset($data['total_amount']) || !isset($data['contact_number'])) {
        throw new Exception("Missing required fields: movie_id, showtime, seats, total_amount, contact_number");
    }

    $movie_id = $data['movie_id'];
    $showtime = $data['showtime'];
    $seats = $data['seats']; // Should be comma-separated like "A1,A2,A3"
    $total_amount = $data['total_amount'];
    $contact_number = $data['contact_number'];

    // Validate movie exists
    $movie_check = pg_query_params($conn, "SELECT id FROM movies WHERE id = $1", array($movie_id));
    if (!pg_fetch_assoc($movie_check)) {
        throw new Exception("Movie not found");
    }

    // Insert booking into database
    $query = "INSERT INTO bookings (movie_id, showtime, seats, total_amount, contact_number) 
              VALUES ($1, $2, $3, $4, $5)
              RETURNING *";
    
    $result = pg_query_params($conn, $query, array($movie_id, $showtime, $seats, $total_amount, $contact_number));

    if (!$result) {
        throw new Exception("Error creating booking: " . pg_last_error($conn));
    }

    $booking = pg_fetch_assoc($result);

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Booking created successfully",
        "data" => $booking
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
