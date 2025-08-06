document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('chatForm');
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const searchBtn = document.getElementById('searchBtn');
    const intro = document.querySelector('.chat-container #intro');
    let webSearchEnabled = false;
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    scrollToBottom();

    searchBtn.addEventListener('click', function () {
        webSearchEnabled = !webSearchEnabled;
        // searchBtn.classList.toggle('active', webSearchEnabled);

        // // Update tooltip
        // searchBtn.title = webSearchEnabled ? 'Disable web search' : 'Enable web search';

        // // Show feedback
        // const status = webSearchEnabled ? 'enabled' : 'disabled';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        intro.style.display = 'none';
        const message = messageInput.value.trim();
        if (!message) return;

        messageInput.value = '';

        addMessageToChat(message, 'user-message');

        const indicator = document.querySelector('.generating-indicator');
        indicator.style.display = 'flex';
        indicator.innerHTML = `
            <span>Generating response...</span>
            <div class="dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;

        const formData = new FormData();
        formData.append('message', message);
        formData.append('webSearch', webSearchEnabled);

        try {
            const response = await fetch('response.php', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.status === 'success') {
                addMessageToChat(data.botResponse, 'bot-message');

            } else {
                addMessageToChat('Error: ' + data.message, 'bot-message');
            }

        } catch (error) {
            addMessageToChat('Error: Failed to get response. Please try again.', 'bot-message');
        } finally {
            indicator.style.display = 'none';
        }
    });
});

function addMessageToChat(message, className) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + className;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';

    if (className === 'bot-message') {
        messageDiv.classList.add('bot-markdown');
        contentDiv.textContent = message;
    } else {
        contentDiv.textContent = message;
    }

    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (className === 'bot-message') {
        setTimeout(() => {
            if (typeof parseMarkdown === 'function') {
                parseMarkdown();
            }
            // Scroll again after markdown parsing
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
    }
}
function AddHeader() {        

    const intro = document.querySelector('.chat-container #intro');

        intro.innerHTML = 'Where should we begin?';
        intro.style.display = 'inline';
        intro.style.visibility = 'visible';
        intro.style.opacity = '1';
        intro.style.fontSize = '28px';
        intro.style.fontWeight = '400';
        intro.style.letterSpacing = '0.38px';
        intro.style.lineHeight = '34px';
        intro.style.paddingInlineEnd = '4px';
        intro.style.paddingInlineStart = '4px';
        intro.style.textAlign = 'center';
        intro.style.textWrapStyle = 'pretty';
    
};
function clearChat() {
    const formData = new FormData();
    formData.append('action', 'clear');

    fetch('response.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('chatContainer').innerHTML = '';
                chatContainer.scrollTop = 0;
            }
        })
        .catch(error => {
            console.error('Error clearing chat:', error);
        });
}

