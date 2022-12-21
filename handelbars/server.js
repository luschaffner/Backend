const express = require('express')
const app = express()
const apiProducts = require('./api/contenedor.js')

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const products = new apiProducts('products.txt')

app.post('/productos', (req, res) => {
    const newProduct = req.body
    products.save(newProduct)
    res.redirect('/')
})

app.get('/productos', async (req, res) => {
    const allProducts = await products.getAll()
    res.render('index', {
        allProducts: allProducts,
        productsQty: allProducts.length
    })
})

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor, ${error}`)) 