const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./testHelper")
const app = require("../app")
const api = supertest(app)
const Disc = require("../models/disc")

describe("when there are discs already in db", () => {
  beforeEach(async () => {
    await Disc.deleteMany({})
    await Disc.insertMany(helper.initialDiscs)
  })

  test("all discs are returned", async () => {
    const response = await api.get("/api/discs")
  
    expect(response.body).toHaveLength(helper.initialDiscs.length)
  })
  
  test("discs are returned as json", async () => {
    await api
      .get("/api/discs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })
  
  test("a specific disc is within discs", async () => {
    const response = await api.get("/api/discs")
  
    const contents = response.body.map((disc) => disc.name)
  
    expect(contents).toContain("Raptor")
  })

  test("a valid disc can be added", async () => {
    const newDisc = {
      name: "Nuke",
      manufacturer: "Discraft",
      type: "distance driver",
      speed: 13,
      glide: 5,
      turn: -1,
      fade: 3,
    }
  
    await api
      .post("/api/discs")
      .send(newDisc)
      .expect(201)
      .expect("Content-Type", /application\/json/)
  
    const discsAtEnd = await helper.discsInDb()
    expect(discsAtEnd).toHaveLength(helper.initialDiscs.length + 1)
  
    const contents = discsAtEnd.map((disc) => disc.name)
    expect(contents).toContain("Nuke")
  })
  
  test("existing disc can be updated", async () => {
    const discsAtStart = await helper.discsInDb()
    const discToUpdate = discsAtStart[1]
    discToUpdate.name = "Luna updated"
  
    await api.put(`/api/discs/${discToUpdate.id}`).send(discToUpdate).expect(200)
  
    const discsAtEnd = await helper.discsInDb()
    const contents = discsAtEnd.map((disc) => disc.name)
  
    expect(contents).toContain("Luna updated")
    expect(discsAtStart.length).toEqual(discsAtEnd.length)
  })
  
  test("disc without name is not added", async () => {
    const newDisc = {
      manufacturer: "Discraft",
      type: "distance driver",
      speed: 13,
      glide: 5,
      turn: -1,
      fade: 3,
    }
  
    await api.post("/api/discs").send(newDisc).expect(400)
  
    const discsAtEnd = await helper.discsInDb()
    expect(discsAtEnd).toHaveLength(helper.initialDiscs.length)
  })
  
  test("a specific disc can be viewed", async () => {
    const discsInStart = await helper.discsInDb()
  
    const discToView = discsInStart[0]
  
    const resultDisc = await api
      .get(`/api/discs/${discToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  
    const processedDiscToView = JSON.parse(JSON.stringify(discToView))
  
    expect(resultDisc.body).toEqual(processedDiscToView)
  })
  
  test("a disc can be deleted", async () => {
    const discsAtStart = await helper.discsInDb()
    const discToDelete = discsAtStart[0]
  
    await api.delete(`/api/discs/${discToDelete.id}`).expect(204)
  
    const discsAtEnd = await helper.discsInDb()
    expect(discsAtEnd).toHaveLength(helper.initialDiscs.length - 1)
  
    const contents = discsAtEnd.map((d) => d.name)
    expect(contents).not.toContain(discToDelete.name)
  })
  
  afterAll(() => {
    mongoose.connection.close()
  })
})
