<?php
session_start();

// === Load JSON safely ===
$userFile = "users.json";
$parkFile = "../data/data.json";

// Nếu file không tồn tại, tạo file rỗng
if (!file_exists($userFile)) {
    file_put_contents($userFile, "[]");
}
if (!file_exists($parkFile)) {
    file_put_contents($parkFile, "[]");
}

$users = json_decode(file_get_contents($userFile), true);
$parks = json_decode(file_get_contents($parkFile), true);

// Kiểm tra định dạng
if (!is_array($users)) {
    die("❌ users.json is not valid JSON.");
}
if (!is_array($parks)) {
    die("❌ data.json is not valid JSON.");
}

// === Get form data ===
$email = $_POST['email'];
$password = $_POST['password'];
$park_id = (int) $_POST['park_id'];

// === Check if email already exists ===
foreach ($users as $u) {
    if ($u['email'] === $email) {
        die("❌ This email is already registered.");
    }
}

// === Create new user ===
$new_id = count($users) + 1;
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$users[] = [
    "id" => $new_id,
    "email" => $email,
    "password" => $hashed_password,
    "role" => "park_owner"
];

// === Assign park ownership ===
$park_found = false;
foreach ($parks as &$p) {
    if ((int)$p['id'] === $park_id) {
        if (isset($p['owner_id']) && $p['owner_id'] !== null) {
            die("⛔ This park is already claimed by another owner.");
        }
        $p['owner_id'] = $new_id;
        $park_found = true;
        break;
    }
}

if (!$park_found) {
    die("❌ Park not found.");
}

// === Save updated data ===
file_put_contents($userFile, json_encode($users, JSON_PRETTY_PRINT));
file_put_contents($parkFile, json_encode($parks, JSON_PRETTY_PRINT));

// === Auto login ===
$_SESSION['user_id'] = $new_id;
$_SESSION['role'] = "park_owner";

header("Location: dashboard.php");
exit;
?>
