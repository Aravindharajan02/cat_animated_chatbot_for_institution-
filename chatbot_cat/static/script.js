document.addEventListener("DOMContentLoaded", function() {
    const cat = document.getElementById("cat");
    const chatbox = document.getElementById("chatbox");
    const closeChat = document.getElementById("close-chat");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatContent = document.getElementById("chat-content");

    // Cat sound effect
    const catSound = new Audio("static/cat_sound.mp3");

    // Open chat when cat is clicked
    cat.addEventListener("click", function() {
        chatbox.style.display = "block";
        catSound.play();
    });

    // Close chat window
    closeChat.addEventListener("click", function() {
        chatbox.style.display = "none";
    });

    // Handle message sending
    sendBtn.addEventListener("click", function() {
        sendMessage();
    });

    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        // Display user message
        chatContent.innerHTML += `<div class="user-message">${message}</div>`;
        userInput.value = "";

        // Bot Typing effect
        chatContent.innerHTML += `<div class="bot-message typing">Typing...</div>`;

        // Send request to backend
        fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            document.querySelector(".typing").remove();
            chatContent.innerHTML += `<div class="bot-message">${data.response}</div>`;
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }
});
