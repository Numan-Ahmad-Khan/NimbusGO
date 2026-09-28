require('dotenv').config();
const cors = require("cors");
const express = require("express");
const app = express();
const errorHandler = require("./middleware/errorHandler");
const db = require("./database/Postgres");
const port = process.env.PORT ||3000;

const redis = require("./config/redis");

const payment = require("./routes/payment");
const rawBody = express.raw({ type: "application/json" });

app.use(
    cors({
        origin: "https://nimbus-go.vercel.app"
        // // origin: "http://localhost:5173"
    })
);
app.use("/payment", rawBody, payment);

app.use(express.json());

async function startServer() {
    try {
        await db.sync({ alter: true });
        console.log('PostgreSQL database tables synchronized successfully.');

        await redis.connect();
        console.log("Redis connected successfully.");

        app.listen(port, () => {
            console.log(`Running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to sync database or start server:', error);
        process.exit(1);
    }
}

app.get("/", (req, res) => {
    res.send("<h1>Hello, Gabravo mat ye chal raha ha bas frontend nahi ha wo b aajayai ga</h1>");
});

const auth = require("./routes/auth");
app.use("/", auth);

const user = require("./routes/user");
app.use("/", user);

const admin = require("./routes/admin");
app.use("/", admin);

const otp = require("./routes/otp");
app.use("/", otp);

const rider = require("./routes/rider");
app.use("/", rider);

app.use(errorHandler);
startServer();

module.exports = app;