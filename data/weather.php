<?php
header('Content-Type: application/json');

// Get lat/lon from URL parameters
$lat = $_GET['lat'] ?? null;
$lon = $_GET['lon'] ?? null;

// Basic check
if (!$lat || !$lon) {
  echo json_encode(["error" => "Missing coordinates"]);
  exit;
}

//  OpenWeatherMap API key
$apiKey = '72b6890a494e94bc8a816f6a5a77504e'; // demo key 
$url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$apiKey&units=imperial";

// Fetch and return
$response = file_get_contents($url);
echo $response;
?>
