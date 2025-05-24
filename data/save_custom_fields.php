<?php
header('Content-Type: application/json'); // để trình duyệt hiểu là JSON

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No input received"]);
    exit;
}

$courseName = $data['course_name'] ?? 'unknown_course';
$customFields = $data['custom_fields'] ?? [];

$file = '../data/park-req.json';
$all = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

$all[$courseName] = $customFields;

file_put_contents($file, json_encode($all, JSON_PRETTY_PRINT));

echo json_encode(["status" => "ok", "message" => "Saved for $courseName"]);
