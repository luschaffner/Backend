const fs = require("fs");

class Contenedor {
    constructor(fileName) {
        this.newFile = fileName;
    }

saveData = async (data) => {
    try {
        await fs.promises.writeFile(this.newFile, JSON.stringify(data, null, 2));
    } catch (err) {
        console.log("error escritura en archivo!", err);
    }
};

save = async (item) => {
    const productsArray = (await this.getAll()) || [];
    try {
        let id = 0;
        productsArray.length === 0 ? (id = 1) : (id = productsArray[productsArray.length - 1].id + 1);
        const newItem = { ...item, id: id };
        productsArray.push(newItem);
        await this.saveData(productsArray);
        console.log(`producto ${item.title} ingresado ok!`);
        return newItem.id;
    } catch (err) {
        console.log("error escritura en archivo!", err);
    }
};

getById = async (id) => {
    const productsArray = (await this.getAll()) || [];
    try {
        const productById = productsArray.find((product) => product.id === id);
        console.log("Producto encontrado: \n", productById || "No existe id");
        return productById || null;
    } catch (err) {
        console.log("Error, ", err);
    }
};

getAll = async () => {
    try {
        const content = await fs.promises.readFile(this.newFile);
        const contentArray = JSON.parse(content);
        console.log("Productos: \n", contentArray);
        return contentArray;
    } catch (err) {
        console.log("Archivo vacío");
    }
};

deleteById = async (id) => {
    const productsArray = (await this.getAll()) || [];
    try {
        const filteredProducts = productsArray.filter((product) => product.id !== id);
        this.saveData(filteredProducts);
    } catch (err) {
        console.log("Error, ", err);
    }
};

deleteAll = async () => {
    try {
        this.saveData([]);
        console.log("Productos eliminados!");
    } catch (err) {
        console.log("Error, productos no eliminados!", err);
    }
};
}

const item = {
    title: "Caipiriña",
    price: 650,
    thumbnail:"https://pixabay.com/get/g760cf7cd61b812ca6ad1ff8fe028aa1d2d1e0dcf26808873c4f8ebf64a1f208403787f75b937155bd0f9b6c571d980b6446a6b4a83c525c43c713f3f0d158efc7de38220d34fd8172845a5d941d9dbf4_1920.jpg",
};

const item1 = {
    title: "Gin tonic",
    price: 780,
    thumbnail:"https://pixabay.com/get/g11928134471bc5d6d146265e8be7dac97b4bcf1325cf1e494bb8c7f50c3197476aa933d606ea4d5193c7db2bc027b99c97ca6b26ebd8abea4459436a14ccd5b5d2d4f7a24776c608d2588026d1384dcf_1920.jpg",
};

const item2 = {
    title: "Martini",
    price: 700,
    thumbnail:"https://pixabay.com/get/gd63aaced90250e462afc0922562a69f7424ef2597133f2c36617cb2114a38754739069ef7fe2771e82b1ce8a64a92d56b151cee492e5eea5c89f199bf461b8edc947fef6824f7ce9050b2004f7055581_1920.jpg",
};

const productos = new Contenedor("productos.txt");

productos.save(item1)

