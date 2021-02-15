require('dotenv').config({ path: "./config.env" });

const express = require('express');
const connectDB = require('./config/db');
const app = express();
const errorHandler = require('./middleware/error')

connectDB();

app.use(express.json())
app.use("/api/auth", require("./routes/auth"));

// error handler should be last piece of middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000;


const server = app.listen(PORT, () => console.log(`server running on port ${PORT}`))

process.on("unhandledRejection", (err, promise) => {
    console.log("logged Error : ", err)
    server.close(() => process.exit(1))
})