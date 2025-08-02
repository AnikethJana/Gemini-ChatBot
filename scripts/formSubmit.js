document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('chatForm');
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const searchBtn = document.getElementById('searchBtn');

    if (!form) {
        console.error('Form element not found!');
        return;
    }

    // Search state
    let webSearchEnabled = false;

    // Auto-scroll function
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Initial scroll to bottom
    scrollToBottom();

    // Toggle search functionality
    searchBtn.addEventListener('click', function() {
        webSearchEnabled = !webSearchEnabled;
        searchBtn.classList.toggle('active', webSearchEnabled);
        
        // Update tooltip
        searchBtn.title = webSearchEnabled ? 'Disable web search' : 'Enable web search';
        
        // Show feedback
        const status = webSearchEnabled ? 'enabled' : 'disabled';
        console.log(`Web search ${status}`);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (!message) return;

        // Clear input immediately
        messageInput.value = '';

        // Add user message to chat UI
        addMessageToChat(message, 'user-message');

        // Create form data
        const formData = new FormData();
        formData.append('message', message);
        formData.append('webSearch', webSearchEnabled);

        try {
            const response = await fetch('response.php', {
                method: 'POST',
                body: formData,
                credentials: 'include' // Important for session cookies
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.status === 'success') {
                // Add bot response to chat UI
                addMessageToChat('ChatBot: ' + data.botResponse, 'bot-message');
                
            } else {
                addMessageToChat('Error: ' + data.message, 'bot-message');
            }

        } catch (error) {
            console.error('Error:', error);
            addMessageToChat('Error: Failed to get response. Please try again.', 'bot-message');
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
        // Add bot-markdown class for markdown parsing
        messageDiv.classList.add('bot-markdown');
        contentDiv.textContent = message;
    } else {
        contentDiv.textContent = message;
    }
    
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);
    
    // Simple auto-scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Parse markdown for bot messages
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
                    // Clear the chat container
                    document.getElementById('chatContainer').innerHTML = '';
                    // Scroll to top after clearing
                    chatContainer.scrollTop = 0;
                }
            })
            .catch(error => {
                console.error('Error clearing chat:', error);
                alert('Failed to clear chat history.');
            });
}

