<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$apiKey = $input['api_key'] ?? '';

if (empty($apiKey)) {
    echo json_encode(['status' => 'error', 'message' => 'API key is required']);
    exit;
}

$url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

$testData = [
    'contents' => [
        [
            'role' => 'user',
            'parts' => [
                ['text' => 'Hello, respond with just "API key valid"']
            ]
        ]
    ],
    'generationConfig' => [
        'temperature' => 0.1,
        'maxOutputTokens' => 10
    ]
];

$options = [
    'http' => [
        'header' => [
            'Content-Type: application/json',
            'x-goog-api-key: ' . $apiKey
        ],
        'method' => 'POST',
        'content' => json_encode($testData),
        'timeout' => 15
    ]
];

$context = stream_context_create($options);
$response = @file_get_contents($url, false, $context);

if ($response === false) {
    $error = error_get_last();
    echo json_encode([
        'status' => 'error', 
        'message' => 'Failed to connect to Gemini API. Please check your internet connection.'
    ]);
    exit;
}

$responseData = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Invalid response from Gemini API'
    ]);
    exit;
}

// Check if the response indicates an error (invalid API key, etc.)
if (isset($responseData['error'])) {
    $errorMessage = $responseData['error']['message'] ?? 'Invalid API key';
    
    // Common error messages and user-friendly versions
    if (strpos($errorMessage, 'API_KEY_INVALID') !== false || 
        strpos($errorMessage, 'invalid') !== false) {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Invalid API key. Please check your Gemini API key.'
        ]);
    } elseif (strpos($errorMessage, 'quota') !== false || 
              strpos($errorMessage, 'QUOTA_EXCEEDED') !== false) {
        echo json_encode([
            'status' => 'error', 
            'message' => 'API quota exceeded. Please check your Gemini API usage.'
        ]);
    } else {
        echo json_encode([
            'status' => 'error', 
            'message' => 'API Error: ' . $errorMessage
        ]);
    }
    exit;
}

// Check if we got a valid response
if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
    echo json_encode([
        'status' => 'success', 
        'message' => 'API key is valid and working!'
    ]);
} else {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Unexpected response format from Gemini API'
    ]);
}
?>