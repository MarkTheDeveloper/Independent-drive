<?php
// ============================
// Park Manager Edit Page (PHP Rendered)
// ============================

$pendingPath = __DIR__ . "/../pending_requests.json";

if (!isset($_GET['id'])) {
    exit("❌ Missing reservation ID.");
}

$id = $_GET['id'];
$pending = file_exists($pendingPath) ? json_decode(file_get_contents($pendingPath), true) : [];

if (!isset($pending[$id])) {
    exit("❌ Reservation not found.");
}

$request = $pending[$id];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Edit Reservation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f0f2f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .form-container {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      max-width: 600px;
      width: 100%;
    }
    h2 {
      margin-bottom: 20px;
      text-align: center;
    }
    label {
      display: block;
      margin-top: 12px;
      font-weight: bold;
    }
    input, textarea {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    textarea {
      resize: vertical;
    }
    button {
      margin-top: 20px;
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
      font-size: 16px;
    }
    button:hover {
      background: #0056b3;
    }
  </style>
</head>
<body>
  <div class="form-container">
    <h2>Edit Reservation</h2>
    <form method="POST" action="save-edited-request.php">
      <input type="hidden" name="id" value="<?= htmlspecialchars($id) ?>">

      <label>Name</label>
      <input name="client_name" value="<?= htmlspecialchars($request['client_name']) ?>" required>

      <label>Email</label>
      <input name="email" value="<?= htmlspecialchars($request['email']) ?>" required>

      <label>Organization</label>
      <input name="organization" value="<?= htmlspecialchars($request['organization']) ?>">

      <label>Phone</label>
      <input name="phone" value="<?= htmlspecialchars($request['phone']) ?>">

      <label>Park</label>
      <input name="park" value="<?= htmlspecialchars($request['park']) ?>" required>

      <label>Event Name</label>
      <input name="event_name" value="<?= htmlspecialchars($request['event_name']) ?>">

      <label>Days</label>
      <input name="days" value="<?= htmlspecialchars($request['days']) ?>">

      <label>Holes</label>
      <input name="holes" value="<?= htmlspecialchars($request['holes']) ?>">

      <label>Vendor Booths</label>
      <input name="vendor" value="<?= htmlspecialchars($request['vendor']) ?>">

      <label>Utility Needs</label>
      <input name="utilities" value="<?= htmlspecialchars($request['utilities']) ?>">

      <label>Notes</label>
      <textarea name="notes" rows="4"><?= htmlspecialchars($request['notes']) ?></textarea>

      <button type="submit">Save Changes & Notify TD</button>
    </form>
  </div>
</body>
</html>
