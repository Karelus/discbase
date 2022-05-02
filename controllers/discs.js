const discsRouter = require("express").Router()
const Disc = require("../models/disc")

discsRouter.get("/", async (request, response, next) => {
  try {
    const discs = await Disc.find({})
    response.json(discs)
  } catch (exception) {
    next(exception)
  }
})

discsRouter.get("/:id", async (request, response, next) => {
  try {
    const disc = await Disc.findById(request.params.id)
    if (disc) {
      response.json(disc)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

discsRouter.post("/", async (request, response, next) => {
  const body = request.body

  const disc = new Disc({
    name: body.name,
    manufacturer: body.manufacturer,
    type: body.type,
    speed: body.speed,
    glide: body.glide,
    turn: body.turn,
    fade: body.fade,
  })

  try {
    const savedDisc = await disc.save()
    response.status(201).json(savedDisc)
  } catch (exception) {
    next(exception)
  }
})

discsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Disc.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

discsRouter.put("/:id", async (request, response, next) => {
  try {
    const updatedDisc = await Disc.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    )
    response.json(updatedDisc)
  } catch (exception) {
    next(exception)
  }

  // Disc.findByIdAndUpdate(
  //   request.params.id,
  //   { name, manufacturer, type, speed, glide, turn, fade },
  //   { new: true, runValidators: true, context: "query" }
  // )
  //   .then((updatedDisc) => {
  //     response.json(updatedDisc)
  //   })
  //   .catch((error) => next(error))
})

module.exports = discsRouter
