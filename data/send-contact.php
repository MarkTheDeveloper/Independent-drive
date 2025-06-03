<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $to = "parkreservationfourm@gmail.com";  
    $subject = "New Contact Message from Park Reservation Site";

    $name = htmlspecialchars($_POST["name"]);
    $email = filter_var($_POST["email"], FILTER_VALIDATE_EMAIL);
    $message = htmlspecialchars($_POST["message"]);

    if (!$email) {
        http_response_code(400);
        echo "Invalid email address.";
        exit;
    }

    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "ok";
    } else {
        http_response_code(500);
        echo "Email failed to send.";
    }
}
?>
