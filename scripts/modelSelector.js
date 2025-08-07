document.addEventListener('DOMContentLoaded', function() {
    const modelSwitcher = document.getElementById('model-switcher');
    const modelDropdown = document.getElementById('model-dropdown');
    const modelOptions = document.querySelectorAll('.model-option');
    const geminiApiKeyBtn = document.getElementById('gemini-api-key-btn');
    const geminiModal = document.getElementById('gemini-api-key-modal');
    const saveBtn = document.getElementById('save-gemini-api-key-btn');
    const cancelBtn = document.getElementById('cancel-gemini-api-key-btn');
    const apiKeyInput = document.getElementById('gemini-api-key-input');
    const successMessage = document.getElementById('success-message');
    const validationMessage = document.getElementById('api-key-validation-message');

    // Debug: Check if all elements are found
    console.log('Elements found:', {
        modelSwitcher: !!modelSwitcher,
        modelDropdown: !!modelDropdown,
        geminiApiKeyBtn: !!geminiApiKeyBtn,
        geminiModal: !!geminiModal,
        saveBtn: !!saveBtn,
        cancelBtn: !!cancelBtn,
        apiKeyInput: !!apiKeyInput,
        successMessage: !!successMessage,
        validationMessage: !!validationMessage
    });

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
    if (geminiApiKeyBtn && geminiModal && saveBtn && cancelBtn && apiKeyInput && successMessage && validationMessage) {
        geminiApiKeyBtn.addEventListener('click', () => {
            console.log('Gemini API key button clicked');
            geminiModal.style.display = 'flex';
            apiKeyInput.focus();
            hideValidationMessage();
        });

        cancelBtn.addEventListener('click', () => {
            console.log('Cancel button clicked');
            geminiModal.style.display = 'none';
            hideValidationMessage();
        });

        saveBtn.addEventListener('click', async () => {
            console.log('Save button clicked');
            const apiKey = apiKeyInput.value.trim();
            
            if (!apiKey) {
                showValidationMessage('API key cannot be empty.', 'error');
                return;
            }

            // Show loading message
            showValidationMessage('Validating API key...', 'loading');
            saveBtn.disabled = true;

            try {
                const response = await fetch('validate_api_key.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ api_key: apiKey })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    // API key is valid, save it
                    localStorage.setItem('gemini_api_key', apiKey);
                    console.log('API key validated and saved to localStorage');
                    showValidationMessage(data.message, 'success');
                    
                    // Close modal after a brief delay
                    setTimeout(() => {
                        geminiModal.style.display = 'none';
                        apiKeyInput.value = '';
                        hideValidationMessage();
                        showSuccessMessage();
                    }, 1500);
                } else {
                    // API key is invalid
                    showValidationMessage(data.message, 'error');
                }
            } catch (error) {
                console.error('Error validating API key:', error);
                showValidationMessage('Failed to validate API key. Please check your connection.', 'error');
            } finally {
                saveBtn.disabled = false;
            }
        });

        window.addEventListener('click', (e) => {
            if (e.target === geminiModal) {
                console.log('Clicked outside modal');
                geminiModal.style.display = 'none';
                hideValidationMessage();
            }
        });

        // Add keyboard support for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && geminiModal.style.display === 'flex') {
                console.log('Escape key pressed');
                geminiModal.style.display = 'none';
                hideValidationMessage();
            }
        });

        // Add Enter key support for saving
        apiKeyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveBtn.click();
            }
        });
    } else {
        console.error('Some Gemini API key modal elements are missing');
    }

    function showSuccessMessage() {
        console.log('Showing success message');
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }

    function showValidationMessage(message, type) {
        validationMessage.textContent = message;
        validationMessage.className = `validation-message ${type}`;
        validationMessage.style.display = 'block';
    }

    function hideValidationMessage() {
        validationMessage.style.display = 'none';
        validationMessage.className = 'validation-message';
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