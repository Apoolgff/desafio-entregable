const socket = io();

document.addEventListener('DOMContentLoaded', function () {
    function updateMessages(data) {
        try {
            console.log(data);
            const messages = data || [];
            const messageList = document.getElementById('message-list');
            messageList.innerHTML = "";

            const allMessages = messages.reduce((accumulator, currentValue) => {
                return accumulator.concat(currentValue.messages.map(msg => ({ user: currentValue.user, ...msg })));
            }, []);


            allMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            allMessages.forEach((message) => {
                const user = message.user;
                const messageText = message.message;

                const li = document.createElement('li');
                li.textContent = `${user}: ${messageText}`;
                messageList.appendChild(li);
            });
        } catch (error) {
            console.error('Error al procesar mensajes:', error.message);
        }
    }

    socket.on('updateMessages', updateMessages);

    function sendMessage() {
        const userElement = document.getElementById('chat-container');
        const message = document.getElementById('message-input').value;
        const email = userElement.getAttribute('data-user-email');
        socket.emit('sendMessage', email, message);

        document.getElementById('message-input').value = '';
    }

    document.getElementById('send-button').addEventListener('click', sendMessage);
});
