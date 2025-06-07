<?php
session_start();

// Load user data
$users = json_decode(file_get_contents("users.json"), true);

// Get form input
$email = $_POST['email'];
$password = $_POST['password'];

$found_user = null;

foreach ($users as $user) {
    if ($user['email'] === $email) {
        $found_user = $user;
        break;
    }
}

if (!$found_user) {
    die("❌ Email not found.");
}

// Optional: check if email is verified
if (isset($found_user['verified']) && !$found_user['verified']) {
    die("❌ Please verify your email before logging in.");
}

// Check password
if (!password_verify($password, $found_user['password'])) {
    die("❌ Incorrect password.");
}

// Save login session
$_SESSION['user_id'] = $found_user['id'];
$_SESSION['role'] = $found_user['role']; // park_owner or admin

// Redirect to dashboard
header("Location: dashboard.php");
exit;
?>
