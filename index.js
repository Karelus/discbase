const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

let discs = [
  {
    name: "Warden",
    manufacturer: "Dynamic Discs",
    type: "putter",
    speed: 2,
    glide: "4",
    turn: "0",
    fade: "1",
    id: 1,
  },
  {
    name: "Buzzz",
    manufacturer: "Discraft",
    type: "midrange",
    speed: "5",
    glide: "4",
    turn: "-1",
    fade: "1",
    id: 2,
  },
];

const app = express();

// use middlewares
app.use(express.json());
app.use(cors());

morgan.token("data", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

const generateID = () => {
  const maxId = discs.length > 0 ? Math.max(...discs.map((d) => d.id)) : 0;
  return maxId + 1;
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/discs", (request, response) => {
  response.json(discs);
});

app.get("/api/discs/:id", (request, response) => {
  const id = Number(request.params.id);
  const disc = discs.find((disc) => disc.id === id);

  if (disc) {
    response.json(disc);
  } else {
    response.status(404).end();
  }
});

app.post("/api/discs", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.manufacturer) {
    return response.status(400).json({
      error: "manufacturer missing",
    });
  }

  if (!body.type) {
    return response.status(400).json({
      error: "type missing",
    });
  }

  if (discs.some((disc) => disc.name === body.name)) {
    return response.status(400).json({
      error: "name already exists",
    });
  }

  const disc = {
    name: body.name,
    manufacturer: body.manufacturer,
    type: body.type,
    speed: body.speed,
    glide: body.glide,
    turn: body.turn,
    fade: body.fade,
    id: generateID(),
  };

  discs = discs.concat(disc);

  response.json(disc);
});

app.delete("/api/discs/:id", (request, response) => {
  const id = Number(request.params.id);
  discs = discs.filter((disc) => disc.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
