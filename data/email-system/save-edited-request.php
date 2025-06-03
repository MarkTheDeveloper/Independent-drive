<?php
// ============================
// Save Edits to Reservation + Notify TD
// ============================
// Receives updated reservation fields from edit-request.php
// Updates pending_requests.json with new data
// Sends confirmation email back to Tournament Director (TD)

$pendingPath = __DIR__ . "/pending_requests.json";

if (!isset($_POST['id'])) {
    exit("Missing ID.");
}

$id = $_POST['id'];
$pending = file_exists($pendingPath) ? json_decode(file_get_contents($pendingPath), true) : [];

if (!isset($pending[$id])) {
    exit("Reservation not found.");
}

// Update request
$pending[$id] = [
    "client_name" => $_POST['client_name'],
    "email" => $_POST['email'],
    "organization" => $_POST['organization'],
    "phone" => $_POST['phone'],
    "park" => $_POST['park'],
    "event_name" => $_POST['event_name'],
    "days" => $_POST['days'],
    "holes" => $_POST['holes'],
    "vendor" => $_POST['vendor'],
    "utilities" => $_POST['utilities'],
    "notes" => $_POST['notes'],
    "status" => "pending"
];

file_put_contents($pendingPath, json_encode($pending, JSON_PRETTY_PRINT));

// Send email to tournament director
$to = $_POST['email'];
$subject = "Edited Reservation Request for {$_POST['park']}";
$headers = "From: noreply@yourdomain.com\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$body = "Hello {$_POST['client_name']},\n\nYour reservation request for {$_POST['park']} has been edited by the park.\n\nPlease review it if needed or contact the park directly.\n\n- Reservation System";

mail($to, $subject, $body, $headers);

// Show confirmation
echo "<h2 style='text-align:center;font-family:sans-serif;color:green;'>✅ Changes saved and TD notified.</h2>";
?>
