# Chatbot Application

## Introduction

This repository contains the source code for a sophisticated chatbot application powered by the Google Gemini family of large language models. The application is designed with a focus on providing a seamless and interactive user experience, featuring a dynamic user interface and a robust backend for processing and responding to user queries. The system is architected to be modular and extensible, allowing for straightforward customization and the integration of new features.

## Features

The chatbot boasts a range of features designed to enhance its functionality and user engagement:

### 🤖 Multiple Model Support
The application supports various models from the Gemini family, including:
- `gemini-2.5-pro`
- `gemini-2.5-flash`
- `gemini-2.5-flash-lite`
- `gemini-2.0-flash`

Users are provided with the ability to dynamically switch between these models through a user-friendly dropdown menu in the user interface.

### 🎯 System Instructions
The chatbot operates under a set of system instructions that define its personality and response style. These instructions are configurable and can be modified to suit different use cases.

### 💬 Chat History
The application maintains a session-based chat history, allowing the chatbot to retain context within a conversation.

### 🎨 Dynamic UI
The user interface is designed to be responsive and visually appealing, with features such as:
- Animated gradient background
- Floating chat form
- Responsive design

### 📝 Markdown Rendering
The chatbot's responses are rendered as markdown, allowing for formatted text, code blocks, and other rich text elements.

### 🌐 Web Search Capability
The application includes a commented-out feature for enabling web search, which can be activated to allow the chatbot to retrieve real-time information from the internet.

## Technologies Used

The application is built using a combination of frontend and backend technologies:

### Backend
- **PHP**: The backend is implemented in PHP and is responsible for handling user requests, interacting with the Google Gemini API, and managing the chat session.

### Frontend
- **HTML**: Structure and layout
- **CSS**: Styling and responsive design
- **JavaScript**: Interactive functionality, model selector, and chat history display

### External Libraries
- **marked.js**: Markdown rendering
- **highlight.js**: Syntax highlighting

## Setup and Usage

### Prerequisites
- Web server with PHP support (e.g., XAMPP, WAMP, or similar)
- Google Gemini API key

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnikethJana/Gemini-ChatBot
   cd chatbot
   ```

2. **Configure API Key**
   - Obtain an API key for the Google Gemini API
   - Insert it into the `config.php` file

3. **Set up Web Server**
   - Place the project files in your web server's document root
   - Ensure PHP is enabled on your server

4. **Access the Application**
   - Open your web browser
   - Navigate to `http://localhost/chatbot` (or your server URL)

### Usage

Once the application is set up, you can:

1. **Select a Model**: Choose from the available Gemini models using the dropdown menu
2. **Start Chatting**: Type your message in the chat input field
3. **View Responses**: The chatbot will respond with formatted markdown content
4. **Maintain Context**: The conversation history is preserved during your session

## File Structure

```
chatbot/
├── index.php          # Main application file
├── response.php       # Backend response handler
├── returnText.php     # Text processing utilities
├── README.md          # This file
├── scripts/
│   ├── formSubmit.js  # Form submission handling
│   └── modelSelector.js # Model selection functionality
└── styles/
    ├── back.css       # Background styling
    └── style.css      # Main stylesheet
```

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests

