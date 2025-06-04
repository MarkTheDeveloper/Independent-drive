<?php
// ============================
// Reservation Email Handler (LIVE TO DEV EMAIL ONLY)
// ============================

$defaultEmail = "parkreservationfourm@gmail.com";

$name         = $_POST['td_name'] ?? 'N/A';
$email        = $_POST['td_email'] ?? 'N/A';
$organization = $_POST['organization_name'] ?? 'N/A';
$phone        = $_POST['phone_number'] ?? 'N/A';
$park         = $_POST['park_selection'] ?? 'N/A';
$eventName    = $_POST['event_name'] ?? 'N/A';
$days         = $_POST['days_selection'] ?? 'N/A';
$holes        = $_POST['number_of_holes'] ?? 'N/A';
$vendor       = $_POST['vendorBooths'] ?? 'N/A';
$utilities    = $_POST['utilities'] ?? 'N/A';
$notes        = $_POST['notes'] ?? 'None';

// Generate a unique request ID
$requestId = uniqid("req_");

// Save to pending_requests.json
$pendingPath = __DIR__ . "/pending_requests.json";
$pending = file_exists($pendingPath) ? json_decode(file_get_contents($pendingPath), true) : [];

$pending[$requestId] = [
    "park" => $park,
    "client_name" => $name,
    "email" => $email,
    "organization" => $organization,
    "phone" => $phone,
    "event_name" => $eventName,
    "days" => $days,
    "holes" => $holes,
    "vendor" => $vendor,
    "utilities" => $utilities,
    "notes" => $notes,
    "status" => "pending"
];

file_put_contents($pendingPath, json_encode($pending, JSON_PRETTY_PRINT));

// Email content
$subject = "New Reservation Request – $park from $name";
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$message = "Reservation Request\n\n";
$message .= "From: $name ($organization)\n";
$message .= "Contact Email: $email\n";
$message .= "Contact Phone: $phone\n\n";
$message .= "Requested Park: $park\n";
$message .= "Event Name: $eventName\n";
$message .= "Number of Days: $days\n";
$message .= "Number of Holes/Tees: $holes\n";
$message .= "Vendor Booths: $vendor\n";
$message .= "Utility Needs: $utilities\n";
$message .= "Additional Notes: $notes\n\n";

$message .= "Actions:\n";
$message .= "✅ Approve: https://yourdomain.com/email-system/approve-email.php?id=$requestId&action=approve\n";
$message .= "❌ Decline: https://yourdomain.com/email-system/approve-email.php?id=$requestId&action=decline\n";
$message .= "✏️ Edit: https://yourdomain.com/email-system/edit-request.php?id=$requestId\n";

// Actually send it now
$sent = mail($defaultEmail, $subject, $message, $headers);

// Show confirmation or error
if ($sent) {
    echo "ok";
} else {
    http_response_code(500);
    echo "fail";
}
?>
