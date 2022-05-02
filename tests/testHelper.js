const Disc = require("../models/disc")

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

const discsInDb = async () => {
  const discs = await Disc.find({})
  return discs.map((disc) => disc.toJSON())
}

module.exports = {
  initialDiscs,
  nonExistingId,
  discsInDb,
}
