const bagsRouter = require("express").Router()
const Bag = require("../models/bag")
const User = require("../models/user")

bagsRouter.get("/", async (request, response, next) => {
  try {
    const bags = await Bag.find({}).populate("user", { username: 1 })
    response.json(bags)
  } catch (exception) {
    next(exception)
  }
})

bagsRouter.post("/", async (request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const bag = new Bag({
    name: body.name,
    model: {
      name: body.model.name,
      manufacturer: body.model.manufacturer,
    },
    user: user._id,
    maxDiscs: body.model.maxDiscs,
    discs: body.model.discs,
  })

  try {
    const savedBag = await bag.save()
    user.bags = user.bags.concat(savedBag._id)
    await user.save()
    response.status(201).json(savedBag)
  } catch (exception) {
    next(exception)
  }
})

module.exports = bagsRouter
