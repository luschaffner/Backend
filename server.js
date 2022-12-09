const server = app.listen(PORT, () =>{
    console.log(`Servidor HTTP escuchando en puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor, ${error}`))

const routeProducts = express.Router()

app.use('/api/productos', routeProducts)
app.use(express.static('/public'))
routeProducts.use(express.urlencoded({ extended: true }))
routeProducts.use(express.json())

const products = new Container('products.txt')

routeProducts.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

// devuelve todos los productos
routeProducts.get('/listProducts', async (req, res) => {
    const productsList = await products.getAll()
    res.json(productsList)
})

routeProducts.get('/:id', async (req, res) =>{
    const productById = await products.getById(parseInt(req.params.id))
    productById === null ? res.json({ Error:  'Producto no encontrado' }) : res.json(productById)
})

routeProducts.post('/addProduct', async (req, res) =>{
    const savedProduct = await products.save(req.body)
    res.json(savedProduct)
})

routeProducts.put('/:id', async (req, res) =>{
    const updateInfo = req.body
    const productsList = await products.getAll()
    regToUpdate = productsList.findIndex(product => product.id === parseInt(req.params.id))
    if (regToUpdate === -1) {
        return res.send({ Error:  'Producto no encontrado' })
    }
    productsList[regToUpdate] = { ...updateInfo, id: parseInt(req.params.id) }
    await products.saveData(productsList)
    res.json({ ...updateInfo, id: parseInt(req.params.id) })
})

routeProducts.delete('/:id', async (req, res) =>{
    const deletedId = await products.getById(parseInt(req.params.id))
    await products.deleteById(parseInt(req.params.id))
    deletedId === null
        ? res.json( {'Producto con ID': `${parseInt(req.params.id)} no encontrado`} )
        : res.json( {'Producto eliminado': deletedId} )
})