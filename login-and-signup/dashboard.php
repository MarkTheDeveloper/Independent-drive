<?php
session_start();


// Redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit;
}

$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['role'];

// Load park data
$parks = json_decode(file_get_contents("../data/data.json"), true);

// Find the park owned by this user
$owned_park = null;
foreach ($parks as $park) {
    if (isset($park['owner_id']) && $park['owner_id'] == $user_id) {
        $owned_park = $park;
        break;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Park Owner Dashboard</title>
    <link rel="stylesheet" href="login.css" />
  <link rel="icon" type="image/x-icon" href="../images/Logo-NO-BG.png">
  <style>
    body { font-family: Arial, sans-serif; padding: 2rem; }
    h2 { color: #2c3e50; }
    .park-info {
      margin:2.5rem 2.5rem 0rem 2.5rem;
      background-color: #ffffff;
      border-radius: 10px;
      padding: 2rem 2rem;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      line-height: 1.6;
    }

    .park-info h3 {
      margin-top: 0;
      font-size: 20px;
      color: #014134;
    }

    .park-info p {
      margin: 0.4rem 0;
    }

  </style>
</head>
<body>
  <header class="main-header">
    <div>
      <a href="../index.html"><img id="logo" src="../images/Logo-NO-BG.png" alt="Our Logo"></a> 
    <h1>Disc Golf Reservation</h1>
    <nav>
      <ul class="nav-links">
        <li><a href="../index.html">Home</a></li>
        <li><a href="courses.html">Courses</a></li>
        <li><a href="../Contact/contact.html">Contact</a></li>
      </ul>
    </nav>
    <a class="logout-link" href="logout.php"><button>Logout</button></a>

    </div>
  </header>
  <main class="main-content">
  <h2>Welcome, Park Owner</h2>

  <?php if ($owned_park): ?>
    <div class="park-info">
      <h3><?php echo $owned_park['course_name']; ?></h3>
      <p><strong>Location:</strong> <?php echo $owned_park['contact_info']['address']; ?></p>
      <p><strong>Reservation Policy:</strong> <?php echo $owned_park['reservation_requirements']; ?></p>
      <p><strong>Open Dates:</strong> <?php echo $owned_park['policies_rules_dates_open']; ?></p>
      <p><strong>Holes:</strong> <?php echo $owned_park['holes']; ?></p>
      <p><strong>Type:</strong> <?php echo $owned_park['course_type']; ?></p>
    </div>
    <iframe 
      src="edit-td-form-by-parkowner.php?park_id=<?= $owned_park['id'] ?>" 
      style="width:100%; height:1200px; border:none; margin-top: 2rem;">
    </iframe>

  <?php else: ?>
    <p>⛔ You are not assigned to any park yet.</p>
  <?php endif; ?>

  </main>
</body>
</html>
