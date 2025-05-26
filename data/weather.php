<?php
// Get latitude and longitude from URL query
$lat = $_GET['lat'] ?? null;
$lon = $_GET['lon'] ?? null;

// the  OpenWeatherMap API key
$apiKey = "23ed6fda6e1225a0d470d9dd395edc26";

// If coordinates are missing, return error
if (!$lat || !$lon) {
    echo json_encode(["error" => "Missing coordinates."]);
    exit;
}

// Build OpenWeatherMap API URL
$url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&units=imperial&appid=$apiKey";

// Call the API
$response = file_get_contents($url);

// Forward response directly to browser
header('Content-Type: application/json');
echo $response;
