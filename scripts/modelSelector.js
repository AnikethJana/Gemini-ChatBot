document.addEventListener('DOMContentLoaded', function() {
    const modelSwitcher = document.getElementById('model-switcher');
    const modelDropdown = document.getElementById('model-dropdown');
    const modelOptions = document.querySelectorAll('.model-option');
    const geminiApiKeyBtn = document.getElementById('gemini-api-key-btn');
    const geminiModal = document.getElementById('gemini-api-key-modal');
    const closeBtn = document.querySelector('.close-btn');
    const saveBtn = document.getElementById('save-gemini-api-key-btn');
    const cancelBtn = document.getElementById('cancel-gemini-api-key-btn');
    const apiKeyInput = document.getElementById('gemini-api-key-input');
    const successMessage = document.getElementById('success-message');

    // Toggle dropdown
    modelSwitcher.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = modelSwitcher.getAttribute('aria-expanded') === 'true';
        
        modelSwitcher.setAttribute('aria-expanded', !isExpanded);
        modelDropdown.classList.toggle('show');
    });

    // Handle model selection
    modelOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedModel = this.getAttribute('data-model');
            
            // Update visual selection
            modelOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Update button text
            modelSwitcher.querySelector('div').textContent = this.textContent;
            
            // Close dropdown
            modelSwitcher.setAttribute('aria-expanded', 'false');
            modelDropdown.classList.remove('show');
            
            // Send model selection to server
            changeModel(selectedModel);
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!modelSwitcher.contains(e.target) && !modelDropdown.contains(e.target)) {
            modelSwitcher.setAttribute('aria-expanded', 'false');
            modelDropdown.classList.remove('show');
        }
    });

    // Handle keyboard navigation
    modelSwitcher.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            modelSwitcher.click();
        }
    });

    modelDropdown.addEventListener('keydown', function(e) {
        const options = Array.from(modelOptions);
        const currentIndex = options.findIndex(option => option.classList.contains('selected'));
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % options.length;
                options[currentIndex].classList.remove('selected');
                options[nextIndex].classList.add('selected');
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? options.length - 1 : currentIndex - 1;
                options[currentIndex].classList.remove('selected');
                options[prevIndex].classList.add('selected');
                break;
            case 'Enter':
                e.preventDefault();
                const selectedOption = options.find(option => option.classList.contains('selected'));
                if (selectedOption) {
                    selectedOption.click();
                }
                break;
            case 'Escape':
                modelSwitcher.setAttribute('aria-expanded', 'false');
                modelDropdown.classList.remove('show');
                break;
        }
    });

    // Gemini API Key Modal Logic
    geminiApiKeyBtn.addEventListener('click', () => {
        geminiModal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        geminiModal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        geminiModal.style.display = 'none';
    });

    saveBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('gemini_api_key', apiKey);
            geminiModal.style.display = 'none';
            apiKeyInput.value = '';
            showSuccessMessage();
        } else {
            alert('API key cannot be empty.');
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === geminiModal) {
            geminiModal.style.display = 'none';
        }
    });

    function showSuccessMessage() {
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
});

// Function to change model via AJAX
function changeModel(modelName) {
    const formData = new FormData();
    formData.append('model', modelName);
    
    fetch(window.location.href, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log('Model changed to:', modelName);
            // Optionally show a success message or update UI
        } else {
            console.error('Failed to change model');
        }
    })
    .catch(error => {
        console.error('Error changing model:', error);
    });
} 