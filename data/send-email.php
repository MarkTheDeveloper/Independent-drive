<?php
// ============================
// Reservation Email Handler (TEST MODE)
// Currently only sends to default dev inbox
// ============================

// Default email to use for all test submissions
$defaultEmail = "parkreservationfourm@gmail.com";

// Collect form inputs
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

// Simulated park contact info (email would be pulled from data.json later)
$parkContact = [
    "email" => "",  // Empty = simulate park with no email yet
];

// Build message body
$message = "New Reservation Request\n\n";
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
$message .= "[TEST MODE] This message is not being sent yet.\n";

// Determine where to send (default if park email is missing)
$to = !empty($parkContact['email']) ? $parkContact['email'] : $defaultEmail;

// Email headers
$subject = "Reservation Request (TEST) – $name";
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Disabled for now — uncomment when ready to send
/*
mail($to, $subject, $message, $headers);
*/

// Output for dev confirmation
echo "DEV TEST — Email would be sent to: $to\n\n";
echo nl2br(htmlspecialchars($message));
?>
