<?php
if (ob_get_level() === 0) {
    ob_start();
}

$rawUri = $_SERVER["REQUEST_URI"] ?? "/";
$requestPath = explode("?", $rawUri, 2)[0];
$path = trim($requestPath, "/");
$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

// Health check without database (Railway + monitoring)
if ($path === "api/health" && $method === "GET") {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    echo json_encode(["ok" => true, "service" => "movie-ticket-api"]);
    exit;
}

require_once "backend-config.php";

if ($method === "OPTIONS") {
    http_response_code(200);
    exit();
}

$pathParts = $path === "" ? [] : explode("/", $path);

if (($pathParts[0] ?? "") !== "api") {
    http_response_code(404);
    echo json_encode(["error" => "API endpoint not found"]);
    exit();
}

$endpoint = $pathParts[1] ?? "";
$sub = $pathParts[2] ?? "";

switch ($endpoint) {
    case "movies":
        if ($method === "GET") {
            require_once "backend-getMovies.php";
            break;
        }
        if ($method === "POST") {
            if ($sub === "update") {
                require_once "backend-updateMovie.php";
            } elseif ($sub === "delete") {
                require_once "backend-deleteMovie.php";
            } elseif ($sub === "") {
                require_once "backend-createMovie.php";
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Unknown movies subpath"]);
            }
            break;
        }
        if ($method === "PUT") {
            require_once "backend-updateMovie.php";
            break;
        }
        if ($method === "DELETE") {
            require_once "backend-deleteMovie.php";
            break;
        }
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;

    case "bookings":
        if ($method === "POST") {
            require_once "backend-bookSeats.php";
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found"]);
}
