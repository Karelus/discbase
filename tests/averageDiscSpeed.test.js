const discSpeedAverage = require("../utils/for_testing").discSpeedAverage

const discs = [
  {
    name: "Raptor",
    speed: 9,
  },
  {
    name: "Luna",
    speed: 3,
  },
  {
    name: "Force",
    speed: 12,
  },
]

describe("average", () => {
  test("of many discs", () => {
    expect(discSpeedAverage(discs)).toBe(8)
  })

  test("of empty discs array", () => {
    expect(discSpeedAverage([])).toBe(0)
  })
})
