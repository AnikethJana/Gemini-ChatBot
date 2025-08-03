<?php
$env = parse_ini_file('.env');
define('api_key', $env['API_KEY']);

const models = [
    'gemini-2.5-pro' => 'Gemini 2.5 Pro',
    'gemini-2.5-flash' => 'Gemini 2.5 Flash', 
    'gemini-2.5-flash-lite' => 'Gemini 2.5 Flash-Lite',
    'gemini-2.0-flash' => 'Gemini 2.0 Flash',
];

const default_model = 'gemini-2.5-flash-lite';

define ('system_instruction', $env['SYSTEM_INSTRUCTION']??'You are a helpful assistant.');

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

