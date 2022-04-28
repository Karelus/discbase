const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const discSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 200,
    required: true,
  },
  manufacturer: {
    type: String,
    maxlength: 100,
    required: true,
  },
  type: {
    type: String,
    maxlength: 50,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
    min: 1,
    max: 14,
  },
  glide: {
    type: Number,
    required: true,
    min: 0,
    max: 8,
  },
  turn: {
    type: Number,
    required: true,
    min: -5,
    max: 5,
  },
  fade: {
    type: Number,
    required: true,
    min: 0,
    max: 6,
  },
});

discSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Disc", discSchema);
