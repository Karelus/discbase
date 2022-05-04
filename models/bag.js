const mongoose = require("mongoose")

const bagSchema = new mongoose.Schema({
    name: {
        type: String,
        default: `Bag ${new Date().toString()}`
    },
    model: {
        name: {type: String},
        manufacturer: {type: String}
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    maxDiscs: {
        type: Number,
        required: true,
        default: 20,
    },
    discs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Disc",
        }
    ]
})

bagSchema.set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    },
  })

const Bag = mongoose.model("Bag", bagSchema)

module.exports = Bag