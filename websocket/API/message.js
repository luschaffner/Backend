const fs = require("fs")

class messagesContainer {
  constructor(fileName) {
    this.newFile = fileName
  }

  // método adicional para guardar datos
  saveData = async (data) => {
    try {
      await fs.promises.writeFile(this.newFile, JSON.stringify(data, null, 2))
    } catch (err) {
      console.log("error escritura en archivo!", err)
    }
  }

  save = async (item) => {
    // Traer todos los mensajes usando el método getAll
    const messagesArray = await this.getAll() || []
    try {
      messagesArray.push(item)
      await this.saveData(messagesArray)
    } catch (err) {
      console.log("error escritura en archivo!", err)
    }
  }

  getAll = async () => {
    try {
      const content = await fs.promises.readFile(this.newFile)
      const contentArray = JSON.parse(content)
      return contentArray
    } catch (err) {
      console.log("Archivo vacío")
      return []
    }
  }

}

module.exports = messagesContainer