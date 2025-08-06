<?php
session_start();
include 'returnText.php';
include_once 'config.php';

if (!isset($_SESSION['context'])) {
    $_SESSION['context'] = [];
}

// Handle model selection
if (isset($_POST['model'])) {
    $_SESSION['current_model'] = $_POST['model'];
}

$currentModel = getCurrentModel();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatBot</title>
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/generating-animation.css">
    <link rel="stylesheet" href="styles/modal.css">
    <link rel="stylesheet" href="styles/back.css">
    <script src="https://cdn.jsdelivr.net/npm/marked@4.0.17/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/lib/highlight.min.js"></script>
    <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/github-dark.min.css"> -->
</head>
<body>
<div class="gradient"></div>

<!-- Header with model selector -->
<header class="header">
    <h1>
    <svg width="20" height="20" viewBox="0 0 20 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="icon-lg -m-1 group-hover/tiny-bar:hidden group-focus-visible:hidden"><path d="M11.2475 18.25C10.6975 18.25 10.175 18.1455 9.67999 17.9365C9.18499 17.7275 8.74499 17.436 8.35999 17.062C7.94199 17.205 7.50749 17.2765 7.05649 17.2765C6.31949 17.2765 5.63749 17.095 5.01049 16.732C4.38349 16.369 3.87749 15.874 3.49249 15.247C3.11849 14.62 2.93149 13.9215 2.93149 13.1515C2.93149 12.8325 2.97549 12.486 3.06349 12.112C2.62349 11.705 2.28249 11.2375 2.04049 10.7095C1.79849 10.1705 1.67749 9.6095 1.67749 9.0265C1.67749 8.4325 1.80399 7.8605 2.05699 7.3105C2.30999 6.7605 2.66199 6.2875 3.11299 5.8915C3.57499 5.4845 4.10849 5.204 4.71349 5.05C4.83449 4.423 5.08749 3.862 5.47249 3.367C5.86849 2.861 6.35249 2.465 6.92449 2.179C7.49649 1.893 8.10699 1.75 8.75599 1.75C9.30599 1.75 9.82849 1.8545 10.3235 2.0635C10.8185 2.2725 11.2585 2.564 11.6435 2.938C12.0615 2.795 12.496 2.7235 12.947 2.7235C13.684 2.7235 14.366 2.905 14.993 3.268C15.62 3.631 16.1205 4.126 16.4945 4.753C16.8795 5.38 17.072 6.0785 17.072 6.8485C17.072 7.1675 17.028 7.514 16.94 7.888C17.38 8.295 17.721 8.768 17.963 9.307C18.205 9.835 18.326 10.3905 18.326 10.9735C18.326 11.5675 18.1995 12.1395 17.9465 12.6895C17.6935 13.2395 17.336 13.718 16.874 14.125C16.423 14.521 15.895 14.796 15.29 14.95C15.169 15.577 14.9105 16.138 14.5145 16.633C14.1295 17.139 13.651 17.535 13.079 17.821C12.507 18.107 11.8965 18.25 11.2475 18.25ZM7.17199 16.1875C7.72199 16.1875 8.20049 16.072 8.60749 15.841L11.7095 14.059C11.8195 13.982 11.8745 13.8775 11.8745 13.7455V12.3265L7.88149 14.62C7.63949 14.763 7.39749 14.763 7.15549 14.62L4.03699 12.8215C4.03699 12.8545 4.03149 12.893 4.02049 12.937C4.02049 12.981 4.02049 13.047 4.02049 13.135C4.02049 13.696 4.15249 14.213 4.41649 14.686C4.69149 15.148 5.07099 15.511 5.55499 15.775C6.03899 16.05 6.57799 16.1875 7.17199 16.1875ZM7.33699 13.498C7.40299 13.531 7.46349 13.5475 7.51849 13.5475C7.57349 13.5475 7.62849 13.531 7.68349 13.498L8.92099 12.7885L4.94449 10.4785C4.70249 10.3355 4.58149 10.121 4.58149 9.835V6.2545C4.03149 6.4965 3.59149 6.8705 3.26149 7.3765C2.93149 7.8715 2.76649 8.4215 2.76649 9.0265C2.76649 9.5655 2.90399 10.0825 3.17899 10.5775C3.45399 11.0725 3.81149 11.4465 4.25149 11.6995L7.33699 13.498ZM11.2475 17.161C11.8305 17.161 12.3585 17.029 12.8315 16.765C13.3045 16.501 13.6785 16.138 13.9535 15.676C14.2285 15.214 14.366 14.697 14.366 14.125V10.561C14.366 10.429 14.311 10.33 14.201 10.264L12.947 9.538V14.1415C12.947 14.4275 12.826 14.642 12.584 14.785L9.46549 16.5835C10.0045 16.9685 10.5985 17.161 11.2475 17.161ZM11.8745 11.122V8.878L10.01 7.822L8.12899 8.878V11.122L10.01 12.178L11.8745 11.122ZM7.05649 5.8585C7.05649 5.5725 7.17749 5.358 7.41949 5.215L10.538 3.4165C9.99899 3.0315 9.40499 2.839 8.75599 2.839C8.17299 2.839 7.64499 2.971 7.17199 3.235C6.69899 3.499 6.32499 3.862 6.04999 4.324C5.78599 4.786 5.65399 5.303 5.65399 5.875V9.4225C5.65399 9.5545 5.70899 9.659 5.81899 9.736L7.05649 10.462V5.8585ZM15.4385 13.7455C15.9885 13.5035 16.423 13.1295 16.742 12.6235C17.072 12.1175 17.237 11.5675 17.237 10.9735C17.237 10.4345 17.0995 9.9175 16.8245 9.4225C16.5495 8.9275 16.192 8.5535 15.752 8.3005L12.6665 6.5185C12.6005 6.4745 12.54 6.458 12.485 6.469C12.43 6.469 12.375 6.4855 12.32 6.5185L11.0825 7.2115L15.0755 9.538C15.1965 9.604 15.2845 9.692 15.3395 9.802C15.4055 9.901 15.4385 10.022 15.4385 10.165V13.7455ZM12.122 5.3635C12.364 5.2095 12.606 5.2095 12.848 5.3635L15.983 7.195C15.983 7.118 15.983 7.019 15.983 6.898C15.983 6.37 15.851 5.8695 15.587 5.3965C15.334 4.9125 14.9655 4.5275 14.4815 4.2415C14.0085 3.9555 13.4585 3.8125 12.8315 3.8125C12.2815 3.8125 11.803 3.928 11.396 4.159L8.29399 5.941C8.18399 6.018 8.12899 6.1225 8.12899 6.2545V7.6735L12.122 5.3635Z"></path></svg>    
    ChatBot</h1>
    <div class="model-selector">
        <button type="button" id="model-switcher" class="model-switcher-btn" aria-haspopup="menu" aria-expanded="false">
            <div><?php echo models[$currentModel]; ?></div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="dropdown-icon">
                <path d="M12.1338 5.94433C12.3919 5.77382 12.7434 5.80202 12.9707 6.02929C13.1979 6.25656 13.2261 6.60807 13.0556 6.8662L12.9707 6.9707L8.47067 11.4707C8.21097 11.7304 7.78896 11.7304 7.52926 11.4707L3.02926 6.9707L2.9443 6.8662C2.77379 6.60807 2.80199 6.25656 3.02926 6.02929C3.25653 5.80202 3.60804 5.77382 3.86617 5.94433L3.97067 6.02929L7.99996 10.0586L12.0293 6.02929L12.1338 5.94433Z"></path>
            </svg>
        </button>
        <button type="button" id="gemini-api-key-btn" class="model-switcher-btn">Set Gemini API Key</button>
        <div id="model-dropdown" class="model-dropdown">
            <?php foreach (models as $modelKey => $modelName): ?>
                <div class="model-option <?php echo ($modelKey === $currentModel) ? 'selected' : ''; ?>" 
                     data-model="<?php echo $modelKey; ?>">
                    <?php echo $modelName; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</header>

<div class="chat-container" id="chatContainer">
        <h1 id="intro">Where should we begin?</h1>
        <div class="generating-indicator" style="display: none;">
            <span class="C2Yw4Cux1FcFGObGPRc2 wZ4JdaHxSAhGy1HoNVja yPVtygfW3yi77pB7G6Se">Generating response...</span>
        </div>
        <?php returnText(); ?>
        <script>
            // Configure marked for syntax highlighting
            

            window.parseMarkdown = function() {
                const markdownElements = document.querySelectorAll('.bot-markdown:not(.parsed)');
                markdownElements.forEach(element => {
                    const contentDiv = element.querySelector('.content');
                    if (contentDiv) {
                        const rawMarkdown = contentDiv.textContent.replace('ChatBot: ', '');
                        const parsedHTML = marked.parse(rawMarkdown);
                        contentDiv.innerHTML = parsedHTML;
                        element.classList.add('parsed');
                    }
                });
            };
            
            document.addEventListener('DOMContentLoaded', window.parseMarkdown);
        </script>
    </div>
    
    <div>
        <form method="post" class="form" id="chatForm">
            <input type="text" name="message" id="messageInput" placeholder="Chat with ChatBot" required>
            <button type="submit" name="submit">Send</button>
            <button type="button" id="searchBtn" class="search-btn" title=" Web Search" disabled> 
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="icon" aria-label=""><path d="M10 2.125C14.3492 2.125 17.875 5.65076 17.875 10C17.875 14.3492 14.3492 17.875 10 17.875C5.65076 17.875 2.125 14.3492 2.125 10C2.125 5.65076 5.65076 2.125 10 2.125ZM7.88672 10.625C7.94334 12.3161 8.22547 13.8134 8.63965 14.9053C8.87263 15.5194 9.1351 15.9733 9.39453 16.2627C9.65437 16.5524 9.86039 16.625 10 16.625C10.1396 16.625 10.3456 16.5524 10.6055 16.2627C10.8649 15.9733 11.1274 15.5194 11.3604 14.9053C11.7745 13.8134 12.0567 12.3161 12.1133 10.625H7.88672ZM3.40527 10.625C3.65313 13.2734 5.45957 15.4667 7.89844 16.2822C7.7409 15.997 7.5977 15.6834 7.4707 15.3486C6.99415 14.0923 6.69362 12.439 6.63672 10.625H3.40527ZM13.3633 10.625C13.3064 12.439 13.0059 14.0923 12.5293 15.3486C12.4022 15.6836 12.2582 15.9969 12.1006 16.2822C14.5399 15.467 16.3468 13.2737 16.5947 10.625H13.3633ZM12.1006 3.7168C12.2584 4.00235 12.4021 4.31613 12.5293 4.65137C13.0059 5.90775 13.3064 7.56102 13.3633 9.375H16.5947C16.3468 6.72615 14.54 4.53199 12.1006 3.7168ZM10 3.375C9.86039 3.375 9.65437 3.44756 9.39453 3.7373C9.1351 4.02672 8.87263 4.48057 8.63965 5.09473C8.22547 6.18664 7.94334 7.68388 7.88672 9.375H12.1133C12.0567 7.68388 11.7745 6.18664 11.3604 5.09473C11.1274 4.48057 10.8649 4.02672 10.6055 3.7373C10.3456 3.44756 10.1396 3.375 10 3.375ZM7.89844 3.7168C5.45942 4.53222 3.65314 6.72647 3.40527 9.375H6.63672C6.69362 7.56102 6.99415 5.90775 7.4707 4.65137C7.59781 4.31629 7.74073 4.00224 7.89844 3.7168Z"></path></svg>
            Web Search
            </button>
            <button type="button" class="clearChat" onclick="clearChat()" >
         <svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M6.498.03a.625.625 0 0 1 .536.075l.074.05c.756.533 1.148 1.26 1.394 1.983.126.37.218.75.299 1.107.083.368.152.703.24 1.03l.008.026c.025.074.096.245.235.398.142.157.356.301.716.301.34 0 .537-.111.66-.222a1.05 1.05 0 0 0 .26-.385l.012-.036c.03-.094.063-.263.101-.478.018-.1.04-.221.063-.312.009-.035.03-.123.075-.208.013-.026.082-.166.242-.263a.634.634 0 0 1 .727.047l.028.023.049.046C12.6 3.575 15 5.996 15 10c0 2.516-1.796 4.569-4.16 5.477a.625.625 0 0 1-.698-.99c.395-.459.608-1.08.608-1.768 0-.565-.342-1.223-.981-1.996-.513-.62-1.139-1.225-1.77-1.846-.637.617-1.256 1.193-1.771 1.803-.63.747-.978 1.407-.978 2.039 0 .688.213 1.31.608 1.767a.625.625 0 0 1-.673 1l-.025-.009C2.796 14.57 1 12.516 1 10c0-2.22.957-3.611 2.039-4.941C4.119 3.73 5.305 2.473 6.104.4l.014-.033a.625.625 0 0 1 .38-.338Z"></path></svg>
         Clear All</button>
        </form>
    </div>
    <script src="./scripts/formSubmit.js"></script>
    <script src="./scripts/modelSelector.js"></script>
    <div id="gemini-api-key-modal" class="modal" style="display: none;">
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>Configure Gemini API Key</h2>
            <label for="gemini-api-key-input">Enter Your Gemini API Key</label>
            <input type="password" id="gemini-api-key-input" placeholder="Enter your API key...">
            <div class="modal-buttons">
                <button id="save-gemini-api-key-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20" fill="currentColor"><path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM404.4 276.7L324.4 404.7C320.2 411.4 313 415.6 305.1 416C297.2 416.4 289.6 412.8 284.9 406.4L236.9 342.4C228.9 331.8 231.1 316.8 241.7 308.8C252.3 300.8 267.3 303 275.3 313.6L302.3 349.6L363.7 251.3C370.7 240.1 385.5 236.6 396.8 243.7C408.1 250.8 411.5 265.5 404.4 276.8z"/></svg>
                    Save
                </button>
                <button id="cancel-gemini-api-key-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20" fill="currentColor"><path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z"/></svg>
                    Cancel
                </button>
            </div>
        </div>
    </div>
    <div id="success-message" class="success-message" style="display: none;">Saved successfully</div>
</body>
</html>