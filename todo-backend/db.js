const mongoose = require("mongoose")
const logger = require("./utils/logger")

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined")
        }

        await mongoose.connect(process.env.MONGO_URI)
        logger.info("Mongo DB Connected!")
        return true
    } catch (error) {
        logger.error("MongoDB connection failed", error)
        throw error
    }
}

module.exports = connectDB;