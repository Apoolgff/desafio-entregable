// chat.js
const socket = io();

document.addEventListener('DOMContentLoaded', function () {

    function updateMessages(data) {
        const messages = data || [];
        const messageList = document.getElementById('message-list');
        messageList.innerHTML = "";

        messages.forEach((userMessages) => {
            userMessages.messages.forEach((message) => {
                const li = document.createElement('li');
                li.textContent = `${userMessages.user}: ${message.message}`;
                messageList.appendChild(li);
            });
        });
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
