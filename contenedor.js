const fs = require("fs")

class Contenedor {
    constructor(fileName) {
        this.newFile = fileName
    }
saveData = async (data) => {
    try {
        await fs.promises.writeFile(this.newFile, JSON.stringify(data, null, 2))
    } catch (err) {
        console.log("error escritura en archivo!", err)
    }
}

save = async (item) => {
    const productsArray = (await this.getAll()) || [];
    try {
        let id = 0;
        productsArray.length === 0 ? (id = 1) : (id = productsArray[productsArray.length - 1].id + 1)
        const newItem = { ...item, id: id }
        productsArray.push(newItem)
        await this.saveData(productsArray)
        console.log(`producto ${item.product} ingresado ok!`)
        return newItem} catch (err) {
            console.log("error escritura en archivo!", err)
    }
}

getById = async (id) => {
    const productsArray = (await this.getAll()) || [];
    try {
        const productById = productsArray.find((product) => product.id === id)
        return productById || null
    } catch (err) {
        console.log("Error, ", err)
    }
}

getAll = async () => {
    try {
        const content = await fs.promises.readFile(this.newFile)
        const contentArray = JSON.parse(content)
        return contentArray
    } catch (err) {
        console.log("Archivo vacío")
    }}

deleteById = async (id) => {
    const productsArray = (await this.getAll()) || [];
    try {
        const filteredProducts = productsArray.filter((product) => product.id !== id)
        this.saveData(filteredProducts)
    } catch (err) {
        console.log("Error, ", err)
    }
}

deleteAll = async () => {
    try {
        this.saveData([]);
        console.log("Productos eliminados!");
    } catch (err) {
        console.log("Error, productos no eliminados!", err)
    }
}
}

module.exports = Contenedor

