document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('chatForm');
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const searchBtn = document.getElementById('searchBtn');
    const intro = document.querySelector('.chat-container #intro');
    let webSearchEnabled = false;
    
    // Mobile viewport height fix
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Update viewport height on load and resize
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', function() {
        setTimeout(setViewportHeight, 100);
    });
    
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Improved scrolling for mobile
    function smoothScrollToBottom() {
        if (chatContainer) {
            setTimeout(() => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 50);
        }
    }
    
    scrollToBottom();

    // Mobile-specific improvements
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Prevent zoom on input focus for iOS
    if (isMobile) {
        messageInput.addEventListener('touchstart', function() {
            // Prevent zoom on iOS when focusing input
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no');
                setTimeout(() => {
                    viewport.setAttribute('content', 'width=device-width,initial-scale=1');
                }, 500);
            }
        });
    }

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

        // Create and position the generating indicator after the user message
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
        
        // Move the indicator to appear after the user message
        const userMessage = chatContainer.lastElementChild;
        if (userMessage && userMessage.classList.contains('user-message')) {
            userMessage.insertAdjacentElement('afterend', indicator);
        }
        
        // Scroll to show the indicator with mobile optimization
        smoothScrollToBottom();

        const formData = new FormData();
        formData.append('message', message);
        formData.append('webSearch', webSearchEnabled);
        
        // Add user's API key if available
        const userApiKey = localStorage.getItem('gemini_api_key');
        if (userApiKey) {
            formData.append('user_api_key', userApiKey);
        }

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

    smoothScrollToBottom();

    if (className === 'bot-message') {
        setTimeout(() => {
            if (typeof parseMarkdown === 'function') {
                parseMarkdown();
            }
            // Scroll again after markdown parsing with mobile optimization
            smoothScrollToBottom();
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
                const chatContainer = document.getElementById('chatContainer');
                chatContainer.innerHTML = '';
                
                // Reset intro message
                const intro = document.createElement('h1');
                intro.id = 'intro';
                intro.textContent = 'Where should we begin?';
                intro.style.color = 'rgb(255, 255, 255)';
                intro.style.display = 'block';
                intro.style.fontFamily = 'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"';
                intro.style.fontSize = '28px';
                intro.style.fontWeight = '400';
                intro.style.letterSpacing = '0.38px';
                intro.style.lineHeight = '34px';
                intro.style.paddingInlineEnd = '4px';
                intro.style.paddingInlinestart = '4px';
                intro.style.textAlign = 'center';
                intro.style.textWrapStyle = 'pretty';
                intro.style.whiteSpaceCollapse = 'preserve';
                intro.style.width = '321.288px';
                intro.style.height = '34px';
                
                chatContainer.appendChild(intro);
                chatContainer.scrollTop = 0;
            }
        })
        .catch(error => {
            console.error('Error clearing chat:', error);
        });
}

