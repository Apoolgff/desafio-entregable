// chat.js
const socket = io();
document.addEventListener('DOMContentLoaded', function () {

    // Función para actualizar la lista de mensajes en la vista
    function updateMessages(messages) {
        const messageList = document.getElementById('message-list');
        messageList.innerHTML = ""; // Limpiar la lista antes de actualizar

        messages.forEach((message) => {
            const li = document.createElement('li');
            li.textContent = `${message.user}: ${message.message}`;
            messageList.appendChild(li);
        });
    }

    // Escucha eventos de actualización de mensajes
    socket.on('updateMessages', updateMessages);

    // Función para enviar un mensaje
    function sendMessage() {
        const user = document.getElementById('user-input').value;
        const message = document.getElementById('message-input').value;

        // Emite el evento 'sendMessage' con los datos del nuevo mensaje
        socket.emit('sendMessage', { user, message });

        // Limpia los campos del formulario después de enviar el mensaje
        document.getElementById('user-input').value = '';
        document.getElementById('message-input').value = '';
    }

    // Llama a la función updateMessages para mostrar los mensajes existentes al cargar la página
    updateMessages(initialMessages); // Asegúrate de tener `initialMessages` disponible con los mensajes existentes

    // Asigna la función sendMessage al hacer clic en el botón
    document.getElementById('send-button').addEventListener('click', sendMessage);
});
