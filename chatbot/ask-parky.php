<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$userMsg = $input['message'] ?? '';

if (!$userMsg) {
    echo json_encode(['reply' => "Please ask a question."]);
    exit;
}

$apiKey = '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"'; 

// Load parks data to provide context
$parksData = file_get_contents(__DIR__ . '/../data/data.json');

$systemPrompt = "You are Parky, a helpful assistant for disc golf tournament directors. Use the following park data to answer questions accurately:\n\n$parksData";

$data = [
    'model' => 'gpt-4',
    'messages' => [
        ['role' => 'system', 'content' => $systemPrompt],
        ['role' => 'user', 'content' => $userMsg]
    ],
    'max_tokens' => 300,
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(['reply' => "Error: " . curl_error($ch)]);
    exit;
}
curl_close($ch);

$result = json_decode($response, true);
$reply = $result['choices'][0]['message']['content'] ?? "Sorry, I didn't understand that.";

echo json_encode(['reply' => $reply]);
