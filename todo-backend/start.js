const app = require("./server")
const connectDB = require("./db")

const PORT = process.env.PORT || 3001;
connectDB()
app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`)
})