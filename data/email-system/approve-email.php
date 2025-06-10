<?php
// ============================
// Handle Approve/Decline Clicks from Email
// ============================

$reqId = $_GET['id'] ?? null;
$action = $_GET['action'] ?? null;

$pendingPath = __DIR__ . '/../data/pending_requests.json';
$reservationPath = __DIR__ . '/../data/reservations.json';

if (!$reqId || !$action) {
    die("<h2>❌ Missing request ID or action.</h2>");
}

$pending = json_decode(file_get_contents($pendingPath), true);
$reservations = json_decode(file_get_contents($reservationPath), true);

if (!isset($pending[$reqId])) {
    die("<h2>❌ Request not found or already processed.</h2>");
}

$request = $pending[$reqId];
$park = $request['park'];

// ✅ APPROVE
if ($action === 'approve') {
    $entry = [
        'start_date' => $request['start_date'],
        'end_date' => $request['end_date'] ?? $request['start_date'],
        'client_name' => $request['client_name'],
        'event_name' => $request['event_name'],
        'status' => 'approved'
    ];

    if (!isset($reservations[$park])) {
        $reservations[$park] = [];
    }

    $reservations[$park][] = $entry;

    file_put_contents($reservationPath, json_encode($reservations, JSON_PRETTY_PRINT));
    unset($pending[$reqId]);
    file_put_contents($pendingPath, json_encode($pending, JSON_PRETTY_PRINT));

    echo "<h2>✅ Reservation approved and added to the calendar for <u>$park</u>.</h2>";
    echo "<p>The reservation has been saved and will now show on the form calendar as <b style='color:green;'>green</b>.</p>";
}

// ❌ DECLINE
elseif ($action === 'decline') {
    unset($pending[$reqId]);
    file_put_contents($pendingPath, json_encode($pending, JSON_PRETTY_PRINT));

    echo "<h2>❌ Reservation was declined and removed from pending.</h2>";
    echo "<p>You may notify the requestor if needed.</p>";
}

// 🛑 INVALID ACTION
else {
    echo "<h2>⚠️ Unknown action type. Use 'approve' or 'decline'.</h2>";
}
?>
