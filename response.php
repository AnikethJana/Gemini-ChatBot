<?php
session_start();
require_once 'config.php';

if (isset($_POST['action']) && $_POST['action'] === 'clear') {
    $_SESSION['context'] = [];
    echo json_encode(['status' => 'success', 'message' => 'Chat cleared']);
    exit;
}

// Ensure context exists
if (!isset($_SESSION['context'])) {
    $_SESSION['context'] = [];
}

if (!empty($_POST['message'])) {
    $message = trim($_POST['message']);
    
    // Create user message
    $userContext = [
        "role" => "user",
        "parts" => [
            ["text" => $message]
        ]
    ];
    
    // Add user message to context
    $_SESSION['context'][] = $userContext;
    
    // Get web search parameter
    $webSearch = isset($_POST['webSearch']) && $_POST['webSearch'] === 'true';
    
    // Get response from API
    $response = getResponse($webSearch);
    
    // Return the response as JSON
    echo json_encode([
        'status' => 'success',
        'userMessage' => htmlspecialchars($message),
        'botResponse' => $response
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'No message provided'
    ]);
}

function getResponse($webSearch = false) {
    $api_key = api_key; 
    $url = buildModelUrl(getCurrentModel());
    $system_instruction = system_instruction;
    $data = [
        'system_instruction' => [
            'parts' => [
                [
                    'text' => $system_instruction
                ]
            ]
        ],
        'contents' => $_SESSION['context'],
        'generationConfig' => [
            'temperature' => 0.4,
            'topP' => 0.5,
            'topK' => 20,
            'maxOutputTokens' => 10000
        ]
    ];
    /*
    // Add web search tools if enabled
    if ($webSearch) {
        $data['tools'] = [
            [
                'url_context' => []
            ],
            [
                'google_search' => []
            ]
        ];
    }
    
    */ 
    
    // Make the API request
    $options = [
        'http' => [
            'header' => [
                'Content-Type: application/json',
                'x-goog-api-key: ' . $api_key
            ],
            'method' => 'POST',
            'content' => json_encode($data),
            'timeout' => 30
        ]
    ];

    $context = stream_context_create($options);
    $response = @file_get_contents($url, false, $context);

    if ($response === false) {
        return "Error: Unable to get response from API. Please check your API key and connection.";
    }

    $responseData = json_decode($response, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        return "Error: Invalid JSON response from API.";
    }

    // Extract the response text
    if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
        $responseText = $responseData['candidates'][0]['content']['parts'][0]['text'];
        
        // Add bot response to context
        $_SESSION['context'][] = [
            'role' => 'model',
            'parts' => [
                ['text' => $responseText]
            ]
        ];
        
        return $responseText;
    } else {
        // Log the full response for debugging
        error_log('API Response: ' . print_r($responseData, true));
        return "Error: Unable to parse response from API. Check server logs for details.";
    }
}
?>