<?php
// ============================
// Handle Approve/Decline Clicks from Email
// ============================

$pendingPath = __DIR__ . "/pending_requests.json";
$reservationPath = __DIR__ . "/../reservations.json";

if (!isset($_GET['id']) || !isset($_GET['action'])) {
    http_response_code(400);
    exit("Missing reservation ID or action.");
}

$id = $_GET['id'];
$action = $_GET['action'];

$pending = file_exists($pendingPath) ? json_decode(file_get_contents($pendingPath), true) : [];

if (!isset($pending[$id])) {
    http_response_code(404);
    exit("Reservation not found or already processed.");
}

$request = $pending[$id];

// Process action
if ($action === "approve") {
    // Add to reservations.json
    $reservations = file_exists($reservationPath) ? json_decode(file_get_contents($reservationPath), true) : [];

    $park = $request["park"];
    $entry = [
        "start_date" => date("Y-m-d"), // You can change this if original date is stored
        "end_date" => date("Y-m-d"),
        "client_name" => $request["client_name"]
    ];

    if (!isset($reservations[$park])) {
        $reservations[$park] = [];
    }
    $reservations[$park][] = $entry;
    file_put_contents($reservationPath, json_encode($reservations, JSON_PRETTY_PRINT));

    $statusMessage = "✅ Reservation has been approved and added to the calendar.";
    $result = "approved";
} else if ($action === "decline") {
    $statusMessage = "❌ Reservation has been declined.";
    $result = "declined";
} else {
    http_response_code(400);
    exit("Invalid action.");
}

// Remove from pending
unset($pending[$id]);
file_put_contents($pendingPath, json_encode($pending, JSON_PRETTY_PRINT));

// Send email back to the original requester
$to = $request["email"];
$subject = "Reservation $result for {$request['park']}";
$body = "Hello {$request['client_name']},\n\nYour reservation request for {$request['park']} has been $result.\n\n- Reservation System";
$headers = "From: noreply@yourdomain.com\r\n";

mail($to, $subject, $body, $headers);

// Confirmation on screen
echo $statusMessage;
?>
