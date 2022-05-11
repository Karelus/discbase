const Disc = require("../models/disc")
const User = require("../models/user")
const Bag = require("../models/bag")

const initialDiscs = [
  {
    name: "Raptor",
    manufacturer: "Discraft",
    type: "fairway driver",
    speed: 9,
    glide: 4,
    turn: 0,
    fade: 3,
  },
  {
    name: "Luna",
    manufacturer: "Discraft",
    type: "putter",
    speed: 3,
    glide: 3,
    turn: 0,
    fade: 3,
  },
  {
    name: "Force",
    manufacturer: "Discraft",
    type: "distance driver",
    speed: 12,
    glide: 5,
    turn: 0,
    fade: 3,
  },
]

const nonExistingId = async () => {
  const disc = new Disc({
    name: "Removable disc",
    manufacturer: "Discraft",
    type: "distance driver",
    speed: 12,
    glide: 5,
    turn: 0,
    fade: 3,
  })
  await disc.save()
  await disc.remove()

  return disc._id.toString()
}

const initialBags = [
  {
    name: "bag 1",
    model: {
      name: "bagmodel",
      manufacturer: "Prodigy",
    },
  },
  {
    name: "bag 2",
    model: {
      name: "bagmodel2",
      manufacturer: "Prodigy",
    },
  },
]

const discsInDb = async () => {
  const discs = await Disc.find({})
  return discs.map((disc) => disc.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const bagsInDb = async () => {
  const bags = await Bag.find({})
  return bags.map((bag) => bag.toJSON())
}

module.exports = {
  initialDiscs,
  initialBags,
  nonExistingId,
  discsInDb,
  usersInDb,
  bagsInDb,
}
