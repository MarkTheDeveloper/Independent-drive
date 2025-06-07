<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    die("⛔ Access denied. Please log in.");
}

$user_id = $_SESSION['user_id'];
$park_id = isset($_GET['park_id']) ? (int) $_GET['park_id'] : 0;

$parks = json_decode(file_get_contents("../data/data.json"), true);
$can_edit = false;
$park_name = '';

foreach ($parks as $p) {
    if ((int)$p['id'] === $park_id && (int)$p['owner_id'] === $user_id) {
        $can_edit = true;
        $park_name = $p['course_name'];
        break;
    }
}

if (!$can_edit) {
    die("⛔ You are not authorized to edit this park.");
}

// ✅ Redirect to the HTML editor page with query param
$encodedName = urlencode($park_name);
header("Location: ../form/edit-td-form-by-parkowner.html?course_name=$encodedName");
exit;
?>
