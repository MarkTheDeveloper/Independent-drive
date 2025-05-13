<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['courseName'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing course name']);
    exit;
}

$pendingFile = 'pending_edits.json';
$pending = [];

if (file_exists($pendingFile)) {
    $pending = json_decode(file_get_contents($pendingFile), true);
    if (!is_array($pending)) $pending = [];
}

$pending[] = $input;

file_put_contents($pendingFile, json_encode($pending, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(['status' => 'pending', 'message' => 'Edit saved for review']);
?>
