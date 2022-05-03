const bagsRouter = require("express").Router()
const Bag = require("../models/bag")

bagsRouter.get("/", async (request, response, next) => {
    try {
        const bags = await Bag.find({})
        response.json(bags)
    } catch(exception) {
        next(exception)
    }
})

bagsRouter.post("/", async (request,response, next) => {
    const body = request.body

    const bag = new Bag({
      name: body.name,
      model: {
          name: body.model.name,
          manufacturer: body.model.manufacturer
      },
      maxDiscs: body.model.maxDiscs,
      discs: body.model.discs
    })

    try {
        const savedBag = await bag.save()
        response.status(201).json(savedBag)
    } catch(exception) {
        next(exception)
    }
})

module.exports = bagsRouter