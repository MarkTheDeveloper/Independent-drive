<?php
$data = json_decode(file_get_contents("php://input"), true);

if (
    !$data || 
    !isset($data['course']) || 
    !isset($data['start_date']) || 
    !isset($data['end_date']) ||
    !isset($data['client_name'])
) {
    http_response_code(400);
    echo "Invalid reservation data.";
    exit;
}

$course = $data['course'];
$reservation = [
    "start_date" => $data['start_date'],
    "end_date" => $data['end_date'],
    "client_name" => $data['client_name']
];

$file = '../data/reservations.json';
$reservations = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

// Ensure park array exists
if (!isset($reservations[$course])) {
    $reservations[$course] = [];
}

// Append the new reservation to the specific course
$reservations[$course][] = $reservation;

// Save back to JSON
file_put_contents($file, json_encode($reservations, JSON_PRETTY_PRINT));

echo "Reservation saved under {$course}.";
?>
