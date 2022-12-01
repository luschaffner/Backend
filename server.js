const express = require('express')
const Container = require('./contenedor')

const app = express()

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`servidor http escuchando en puerto ${server.address().port}`)
})

server.on('error', error => console.log(`Error en servidor, ${error}`))

const products = new Container('products.txt')

app.get('/productos', async (req, res) => {
    const productsList = await products.getAll()
    res.send(productsList)
})

app.get('/productoRandom', async (req, res) => {
    const productsList = await products.getAll()
    const randomProduct = Math.floor(Math.random() * productsList.length)
    res.send(productsList[randomProduct])
})