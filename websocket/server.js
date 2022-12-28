const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const apiProducts = require('./api/contenedor.js')
const apiMessages = require('./api/messages.js')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const products = new apiProducts('products.txt')
const messages = new apiMessages('messages.txt')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!')
    // Envío listado completo de productos a todos los clientes conectados
    io.sockets.emit('productsTable', await products.getAll())
    // Escuchando y guardando ingreso nuevos productos
    socket.on('newProduct', async data => {
        await products.save(data)
        io.sockets.emit('productsTable', await products.getAll())
    })

    // ------------------------------------------- //

    // Envío listado completo de mensajes a todos los clientes conectados
    io.sockets.emit('allMessages', await messages.getAll())

    // Escuchando y guardando nuevos mensajes
    socket.on('newMessage', async data => {
        data.date = new Date().toLocaleString()
        console.log(data)
        await messages.save(data)
        io.sockets.emit('allMessages', await messages.getAll())
    })

})

const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))