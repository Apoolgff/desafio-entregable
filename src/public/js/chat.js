// chat.js
const socket = io();

document.addEventListener('DOMContentLoaded', function () {
    // Función para actualizar la lista de mensajes en la vista
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

    // Escucha eventos de actualización de mensajes
    socket.on('updateMessages', updateMessages);

    // Función para enviar un mensaje
    function sendMessage() {
        const user = document.getElementById('user-input').value;
        const message = document.getElementById('message-input').value;

        // Asegúrate de que user y message sean cadenas antes de enviar al servidor
        socket.emit('sendMessage', user, message);

        // Limpia los campos del formulario después de enviar el mensaje
        document.getElementById('user-input').value = '';
        document.getElementById('message-input').value = '';
    }

    // Asigna la función sendMessage al hacer clic en el botón
    document.getElementById('send-button').addEventListener('click', sendMessage);

   
});
