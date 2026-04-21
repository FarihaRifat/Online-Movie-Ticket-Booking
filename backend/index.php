<?php
// ============================================
// Movie Ticket Booking API - Backend Entry Point
// ============================================

require_once 'backend-config.php';

// Handle preflight requests (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the request method and path
$method = $_SERVER['REQUEST_METHOD'];
$request = $_SERVER['REQUEST_URI'];

// Remove query string from request URI
$request = explode('?', $request)[0];

// Remove leading slash and split by /
$path = trim($request, '/');
$pathParts = explode('/', $path);

// Route the request
if ($pathParts[0] === 'api') {
    $endpoint = $pathParts[1] ?? '';

    switch ($endpoint) {
        case 'movies':
            if ($method === 'GET') {
                require_once 'backend-getMovies.php';
            } elseif ($method === 'POST') {
                require_once 'backend-createMovie.php';
            } elseif ($method === 'PUT') {
                // Handle PUT request for updates
                require_once 'backend-updateMovie.php';
            } elseif ($method === 'DELETE') {
                require_once 'backend-deleteMovie.php';
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        case 'bookings':
            if ($method === 'POST') {
                require_once 'backend-bookSeats.php';
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
            break;
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'API endpoint not found']);
}
?>