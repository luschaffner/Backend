const socket = io.connect()

const productsForm = document.getElementById('productsForm')
const productsList = document.getElementById('productsList')

//Envio nuevo ingreso de producto al servidor
productsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    newProduct = { product: productsForm[0].value, price: productsForm[1].value, thumbnail: productsForm[2].value }
    socket.emit('newProduct', newProduct)
    // Reset del form luego del ingreso
    productsForm.reset()
})

// Escuchando listado productos enviado por el servidor
socket.on('productsTable', data => {
    // Fetch plantilla handlebars
    fetch('views/productsTemplate.hbs')
    .then(res => res.text())
    .then(htmlCode => {
        // Variables para plantilla
        const productsQty = data.length
        const allProducts = data
        // Compilado del template
        const template = Handlebars.compile(htmlCode)
        const productsTemplate = template({ productsQty, allProducts })
        // Volcando la plantila al html
        productsList.innerHTML = productsTemplate
    })
})

// ---------------------- //

const messagesForm = document.getElementById('messagesForm')
const userEmail = document.getElementById('userEmail')
const messageContent = document.getElementById('messageContent')
const messagesContainer = document.getElementById('messagesContainer')
const msgBtn = document.getElementsByClassName('msgBtn')

//Envio nuevo mensaje al servidor
messagesForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // Validando email para habilitar envío de mensajes
    if (validateUserEmail()) {
        newMessage = { author: userEmail.value, body: messagesForm[0].value }
        socket.emit('newMessage', newMessage)
        messagesForm.reset()
    } else {
        // Muestra error de validación de email en el input de envío de mensajes
        messageContent.style.color = 'red'
        messageContent.style.fontWeight = 'bold'
        messageContent.style.textAlign = 'center'
        messageContent.value = 'Por favor ingrese un email válido'
    }

})

// Reset del mensaje error validación en el campo de envío de mensajes
userEmail.addEventListener('click', () => {
    messageContent.style.color = 'black'
    messageContent.style.fontWeight = 'normal'
    messageContent.style.textAlign = 'left'
    messageContent.value = ''
})

// Escuchando listado mensajes enviado por el servidor
socket.on('allMessages', data => {
    const msgMapping = data.map(message => {
        return `<div>
                    <b style="color: blue" class='msgAuthor'>${message.author}</b>
                    <span style="color: brown">[ ${message.date} ]</span>
                    <i style="color: green">=>  ${message.body}</i>
                </div>`
    })
    messagesContainer.innerHTML = msgMapping.join(' ')
})

// Función validadora de email
const validateUserEmail = () => {
    const emailPattern =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    let validEmail
    emailPattern.test(userEmail.value) ? validEmail = true : validEmail = false
    return validEmail
}