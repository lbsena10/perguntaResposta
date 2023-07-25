const sequelize = require("sequelize")
const connection = new sequelize("guiaperguntas", "root", "H@oluk10", {
  host: "localhost",
  dialect: "mysql",
})

module.exports = connection
