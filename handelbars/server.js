const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const apiProducts = require('./api/contenedor.js')

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts'
    })
)

app.set('view engine', 'hbs')
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
    res.render('main', {
        allProducts: allProducts,
        productsQty: allProducts.length
    })
})

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor, ${error}`))