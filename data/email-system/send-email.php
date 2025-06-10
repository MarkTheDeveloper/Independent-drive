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

// Build action links (REAL DOMAIN)
$base = "https://independentdrive.greenriverdev.com/Independent-drive";
$approveURL = "$base/email-system/approve-email.php?id=$requestId&action=approve";
$declineURL = "$base/email-system/approve-email.php?id=$requestId&action=decline";
$editURL    = "$base/edit.html?id=$requestId";

// Email content
$subject = "New Reservation Request – $park from $name";
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/html;charset=UTF-8\r\n";
$headers .= "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

$message = "
<h2>🎯 New Reservation Request Submitted</h2>
<p><strong>From:</strong> $name ($organization)<br>
<strong>Email:</strong> $email<br>
<strong>Phone:</strong> $phone</p>

<p><strong>Requested Park:</strong> $park<br>
<strong>Event Name:</strong> $eventName<br>
<strong>Number of Days:</strong> $days<br>
<strong>Number of Holes/Tees:</strong> $holes<br>
<strong>Vendor Booths:</strong> $vendor<br>
<strong>Utility Needs:</strong> $utilities<br>
<strong>Additional Notes:</strong> $notes</p>

<hr>
<h3>📩 Quick Actions:</h3>
<p>
✅ <a href='$approveURL'>Approve Reservation</a><br>
❌ <a href='$declineURL'>Decline Reservation</a><br>
✏️ <a href='$editURL'>Edit Reservation</a>
</p>
<p>Don’t have an account yet? <a href='https://independentdrive.greenriverdev.com/Independent-drive/login-and-signup/register.html'>Sign up here now</a> — it’s fast and lets you track, edit, and submit future requests in seconds.

</p>
";

// Send email
$sent = mail($defaultEmail, $subject, $message, $headers);

// Return status
if ($sent) {
    echo "ok";
} else {
    http_response_code(500);
    echo "fail";
}
?>
