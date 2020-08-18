const express = require("express")
const cors = require("cors")

const { v4, validate } = require('uuid')

const app = express()

function validateId(request, response, next) {

  const { id } = request.params

  if (!validate(id))
    return response.status(400).json({ error: 'ID inválido!' })

  next()
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateId)

const repositories = []

app.get("/repositories", (request, response) => {
  return response.json(repositories)
})

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repositorie = {
    id: v4(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repositorie)

  return response.json(repositorie)
})

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const index = repositories.findIndex(repo => repo.id == id)
  const { likes } = repositories[index]

  if (index < 0)
    return response.status(404).send()

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[index] = repositorie

  return response.json(repositorie)
})

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const index = repositories.findIndex(repo => repo.id == id)

  if (index < 0)
    return response.status(404).send()

  repositories.splice(index, 1)

  return response.status(204).send()
})

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const index = repositories.findIndex(repo => repo.id == id)

  if (index < 0)
    return response.status(404).send()

  repositories[index].likes++

  return response.json(repositories[index])
})

module.exports = app
