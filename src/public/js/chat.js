// chat.js
const socket = io();

document.addEventListener('DOMContentLoaded', function () {
    function updateMessages(data) {
        try {
            const messages = data || [];
            const messageList = document.getElementById('message-list');
            messageList.innerHTML = "";
    
            messages.reverse().forEach((message) => {
                const li = document.createElement('li');
                li.textContent = `${message.user}: ${message.message}`;
                messageList.appendChild(li);
            });
        } catch (error) {
            console.error('Error al procesar mensajes:', error.message);
        }
    }
    
    

    socket.on('updateMessages', updateMessages);

    function sendMessage() {
        const user = document.getElementById('user-input').value;
        const message = document.getElementById('message-input').value;

        socket.emit('sendMessage', user, message);

        document.getElementById('user-input').value = '';
        document.getElementById('message-input').value = '';
    }

    document.getElementById('send-button').addEventListener('click', sendMessage);
});
