const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./testHelper")
const app = require("../app")
const api = supertest(app)
const bgcrypt = require("bcrypt")
const User = require("../models/user")

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bgcrypt.hash("sektret", 10)
    const newUser = new User({ username: "admin", passwordHash })

    await newUser.save()
  })

  test("creationg succeess with fresh username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "newuser123",
      password: "secret",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test("creationg fails with the same username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "admin",
      password: "verysecret",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("username must be unique")

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
