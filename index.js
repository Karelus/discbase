require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Disc = require("./models/disc");
const { response } = require("express");

const app = express();

morgan.token("data", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});

// use middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.get("/api/discs", (request, response) => {
  Disc.find({}).then((discs) => {
    response.json(discs);
  });
});

app.post("/api/discs", (request, response, next) => {
  const body = request.body;

  if (body.name === undefined || body.name === "") {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (body.manufacturer === undefined) {
    return response.status(400).json({
      error: "manufacturer missing",
    });
  }

  if (body.type === undefined) {
    return response.status(400).json({
      error: "type missing",
    });
  }

  const disc = new Disc({
    name: body.name,
    manufacturer: body.manufacturer,
    type: body.type,
    speed: body.speed,
    glide: body.glide,
    turn: body.turn,
    fade: body.fade,
  });

  disc
    .save()
    .then((savedDisc) => response.json(savedDisc))
    .catch((error) => next(error));
});

app.delete("/api/discs/:id", (request, response, next) => {
  Disc.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/discs/:id", (request, response, next) => {
  const { name, manufacturer, type, speed, glide, turn, fade } = request.body;

  Disc.findByIdAndUpdate(
    request.params.id,
    { name, manufacturer, type, speed, glide, turn, fade },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedDisc) => {
      response.json(updatedDisc);
    })
    .catch((error) => next(error));
});

app.get("/api/discs/:id", (request, response) => {
  Disc.findById(request.params.id)
    .then((disc) => {
      if (disc) {
        response.json(disc);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

// unknown endpoint handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// error handler
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
