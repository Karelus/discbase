const config = require("./utils/config")
const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")
const bagsRouter = require("./controllers/bags")
const discsRouter = require("./controllers/discs")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const mongoose = require("mongoose")

logger.info("connecting to", config.MONGODB_URI)

// connecting to database
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message)
  })

morgan.token("data", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
})

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
)

app.use("/api/bags", bagsRouter)
app.use("/api/discs", discsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
