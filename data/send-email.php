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

// Send to dev email for now — not real park yet
$to = $defaultEmail;

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
$message .= "Additional Notes: $notes\n";

// Actually send it now
$sent = mail($to, $subject, $message, $headers);

// Show confirmation or error
if ($sent) {
    echo "ok";
} else {
    http_response_code(500);
    echo "fail";
}

?>
