<?php
function returnText()
{
    if (!empty($_SESSION['context'])) {
        foreach ($_SESSION['context'] as $message) {
            if ($message['role'] === 'user') {
                echo '<div class="message user-message"><div class="content">' . htmlspecialchars($message['parts'][0]['text']) . '</div></div>';
            } elseif ($message['role'] === 'model') {
                $parsed = $message['parts'][0]['text'];
                echo '<div class="message bot-message bot-markdown"><div class="content">' . $parsed . '</div></div>';
            }
        }
    }
}

?>