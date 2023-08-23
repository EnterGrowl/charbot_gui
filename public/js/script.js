const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

function getVals() {
   const apiUrl = localStorage.getItem('apiUrl');
   const authKey = localStorage.getItem('authKey');
   return [apiUrl, authKey];
}

socket.emit('joinRoom', localStorage.getItem('authKey').slice(-4));

// Message from server
socket.on('message', (message) => {
   outputMessage(message.username, message.text);

   // Scroll down
   chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit
chatForm.addEventListener('submit', (e) => {
   e.preventDefault();

   // Get message text
   const msg = e.target.elements.msg.value;

   // Emit message to server along with API URL and Key
   const vals = getVals();
   socket.emit('chatMessage', { msg: msg, apiUrl: vals[0], authKey: vals[1] });

   // Clear input
   e.target.elements.msg.value = '';
   e.target.elements.msg.focus();
});


// Output message to DOM
function outputMessage(username, messageText) {
    const chatMessagesContainer = document.querySelector('.chat-messages');
    const lastMessage = chatMessagesContainer.querySelector('.message:last-child .text');
    
    // Check if the message contains the '\r\n' sequence, indicating it's from the API
    const isApiResponse = messageText.includes('\r\n');
    
    if (lastMessage && lastMessage.previousElementSibling.textContent.startsWith('CharBot') && isApiResponse) {
        // Remove the '\r\n' sequence and append to the last CharBot message
        lastMessage.innerHTML += messageText.replace(/\r\n/g, ' ');
    } else {
        // Create a new message div
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `
            <p class="meta">${username} <span>${new Date().toLocaleTimeString()}</span></p>
            <p class="text">${messageText.replace(/\r\n/g, ' ')}</p>
        `;
        chatMessagesContainer.appendChild(div);
    }
}


