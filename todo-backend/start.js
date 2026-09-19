const app = require("./server")
const connectDB = require("./db")

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server is running on the port ${PORT}`)
        })
    } catch (error) {
        console.error("Failed to start server because MongoDB connection failed.")
        console.error(error.message)
        process.exit(1)
    }
}

startServer()