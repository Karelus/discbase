const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  username: { type: String, required: true, maxLength: 50 },
  passwordHash: String,
  isAdmin: Boolean,
  bags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bag",
    },
  ],
})

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model("User", userSchema)

module.exports = User