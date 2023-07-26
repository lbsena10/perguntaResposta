const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")
//database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados")
  })
  .catch((msgErro) => {
    console.log(msgErro)
  })

app.set("view engine", "ejs")
app.use(express.static("public"))
// configuração do bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//rotas
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((perguntas) => {
    //SELECT * FROM perguntas - lista os dados em ordem decrescente
    res.render("index", {
      perguntas: perguntas,
    })
  })
})

app.get("/perguntar", (req, res) => {
  res.render("perguntar")
})

app.post("/salvarpergunta", (req, res) => {
  let titulo = req.body.titulo
  let descricao = req.body.descricao
  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect("/")
  })
})

app.get("/pergunta/:id", (req, res) => {
  let id = req.params.id
  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta != undefined) {
      Resposta.findAll({
        where: { perguntaId: pergunta.id },
        order: [["id", "DESC"]],
      }).then((respostas) => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas,
        })
      })
    } else {
      res.redirect("/")
    }
  })
})

app.post("/responder", (req, res) => {
  let corpo = req.body.corpo
  let perguntaId = req.body.pergunta

  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId)
  })
})

app.listen(8080, () => {
  console.log("App rodando!")
})
