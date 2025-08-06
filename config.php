<?php
// Load environment variables - works both locally (.env file) and on cloud platforms
function loadEnvironmentVariables() {
    $env = [];
    
    // Try to load from .env file first (for local development)
    if (file_exists('.env')) {
        $envFile = parse_ini_file('.env');
        if ($envFile !== false) {
            $env = $envFile;
        }
    }
    
    // Override with system environment variables (for cloud deployment)
    // This ensures cloud env vars take precedence over local .env file
    if (getenv('API_KEY') !== false) {
        $env['API_KEY'] = getenv('API_KEY');
    }
    if (getenv('SYSTEM_INSTRUCTION') !== false) {
        $env['SYSTEM_INSTRUCTION'] = getenv('SYSTEM_INSTRUCTION');
    }
    
    return $env;
}

// Load environment variables
$env = loadEnvironmentVariables();

// Define API key with fallback
if (isset($env['API_KEY']) && !empty($env['API_KEY'])) {
    define('api_key', $env['API_KEY']);
} else {
    // Throw an error if API key is not found
    throw new Exception('API_KEY environment variable is required but not found. Please set it in your .env file (local) or environment variables (cloud).');
}

const models = [
    'gemini-2.5-pro' => 'Gemini 2.5 Pro',
    'gemini-2.5-flash' => 'Gemini 2.5 Flash', 
    'gemini-2.5-flash-lite' => 'Gemini 2.5 Flash-Lite',
    'gemini-2.0-flash' => 'Gemini 2.0 Flash',
];

const default_model = 'gemini-2.5-flash-lite';

define('system_instruction', $env['SYSTEM_INSTRUCTION'] ?? 'You are a helpful assistant.');

function buildModelUrl($modelName) {
    return 'https://generativelanguage.googleapis.com/v1beta/models/' . $modelName . ':generateContent';
}

function getCurrentModel() {
    if (isset($_SESSION['current_model'])) {
        return $_SESSION['current_model'];
    }
    return default_model;
}
?>

