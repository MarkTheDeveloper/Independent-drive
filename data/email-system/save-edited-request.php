<?php
// ============================
// Save Edits to Reservation + Notify TD
// ============================

$pendingPath = __DIR__ . "/../pending_requests.json";

// Validate input
if (!isset($_POST['id'])) {
    exit("❌ Missing ID.");
}

$id = $_POST['id'];
$pending = file_exists($pendingPath) ? json_decode(file_get_contents($pendingPath), true) : [];

if (!isset($pending[$id])) {
    exit("❌ Reservation not found.");
}

// Safely pull and sanitize values
function clean($value) {
    return htmlspecialchars(trim($value));
}

$clientName = clean($_POST['client_name']);
$email      = clean($_POST['email']);
$org        = clean($_POST['organization']);
$phone      = clean($_POST['phone']);
$park       = clean($_POST['park']);
$eventName  = clean($_POST['event_name']);
$days       = clean($_POST['days']);
$holes      = clean($_POST['holes']);
$vendor     = clean($_POST['vendor']);
$utilities  = clean($_POST['utilities']);
$notes      = clean($_POST['notes']);

// Update JSON
$pending[$id] = [
    "client_name" => $clientName,
    "email" => $email,
    "organization" => $org,
    "phone" => $phone,
    "park" => $park,
    "event_name" => $eventName,
    "days" => $days,
    "holes" => $holes,
    "vendor" => $vendor,
    "utilities" => $utilities,
    "notes" => $notes,
    "status" => "pending"
];

file_put_contents($pendingPath, json_encode($pending, JSON_PRETTY_PRINT));

// Email TD confirmation
$subject = "Your Reservation Request for $park Was Updated";
$headers = "From: reservations@independentdrive.greenriverdev.com\r\n";
$headers .= "Reply-To: no-reply@independentdrive.greenriverdev.com\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$body = <<<EOT
Hello $clientName,

Your reservation request for $park has been updated by the park staff.

Event: $eventName
Date(s): $days
Number of Holes: $holes
Vendor Booths: $vendor
Utility Needs: $utilities

Notes from park:
$notes

If anything looks incorrect, you may follow up directly with the park.

Thank you,
Independent Drive Reservation System
EOT;

mail($email, $subject, $body, $headers);

// Show success confirmation
echo "<h2 style='text-align:center;font-family:sans-serif;color:green;'>✅ Changes saved and confirmation email sent to TD.</h2>";
?>
