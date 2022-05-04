const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./testHelper")
const app = require("../app")
const api = supertest(app)
const Bag = require("../models/bag")

describe("when there are already bags in db", () => {
    beforeEach(async () => {
        await Bag.deleteMany({})
        await Bag.insertMany(helper.initialBags)
    })

    test("all discs are returned", async () => {
        const response = await api.get("/api/bags")
      
        expect(response.body).toHaveLength(helper.initialBags.length)
      })
      

    afterAll(() => {
        mongoose.connection.close()
      })
})