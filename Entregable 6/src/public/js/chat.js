const socket = io();
let chatBox = document.getElementById('chatBox');
let sendMessageButton = document.getElementById('sendMessageButton');

let user

// Falta cambiar el login por el nuevo


if (!user) {
    Swal.fire({
        title: "Identificate",
        input: "text",
        text: "Ingresa tu email para identificarte",
        inputValidator: (value) => {
            if (!value) {
                return 'Necesitas escribir un email'
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                return 'Por favor, ingresa un email válido';
            }
        },
        allowOutsideClick: false,
    }).then(result => {
        user = result.value
        socket.emit('authenticated', user);
    })
}

sendMessageButton.addEventListener('click', evt => {

    if (chatBox.value.trim().length > 0) {
        socket.emit('message', { user, message: chatBox.value })
        chatBox.value = "";
    }

})

socket.on('messageLogs', data => {
    if (!user) return;
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(message => {
        messages = messages + `${message.user.first_name} dice: ${message.message} </br>`
    })
    log.innerHTML = messages;
})
socket.on('newUserConnected', user => {
    if (!user) return
    Swal.fire({
        toast: true,
        position: "top-right",
        text: "Nuevo usuario conectado",
        title: `${user.first_name} se ha unido al chat`,
        timer: 5000,
        showConfirmButton: false
    })
})

socket.on('error', error => {

    Swal.fire({
        toast: true,
        position: "top-right",
        text: "Error",
        title: `${error}`,
        timer: 5000,
        showConfirmButton: false
    })
})