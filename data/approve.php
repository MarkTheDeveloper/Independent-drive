<?php

$dataFile = 'data.json';
$pendingFile = 'pending_edits.json';

if (!file_exists($pendingFile)) {
    echo "No pending edits.";
    exit;
}

$data = json_decode(file_get_contents($dataFile), true);
$pending = json_decode(file_get_contents($pendingFile), true);

foreach ($pending as $edit) {
    foreach ($data as &$course) {
        if ($course['course_name'] === $edit['courseName']) {
            $course['contact_info']['email'] = $edit['email'];
            $course['contact_info']['phone'] = $edit['phone'];
            $course['contact_info']['address'] = $edit['address'];
            $course['holes'] = $edit['holes'];
            $course['reservation_requirements'] = $edit['reservation_requirements'];
            $course['course_type'] = $edit['course_type'];
            break;
        }
    }
}

file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
unlink($pendingFile); 

echo "Approved all pending edits.";
?>
