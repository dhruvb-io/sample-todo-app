const mongoose = require("mongoose")
const connectDB = require("../db")

jest.mock("mongoose", () => ({
  connect: jest.fn()
}))

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn()
}))

describe("connectDB", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.MONGO_URI = "mongodb://127.0.0.1:27017/todo-app"
  })

  afterEach(() => {
    delete process.env.MONGO_URI
  })

  it("should rethrow database connection errors so startup can fail fast", async () => {
    const error = new Error("Mongo connection failed")
    mongoose.connect.mockRejectedValue(error)

    await expect(connectDB()).rejects.toThrow("Mongo connection failed")
  })
})
