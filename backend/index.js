const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db/db");
const adminRoutes = require("./routes/adminRoute");

const userRoutes = require("./routes/userRoute");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

const startServer = async () => {
    await db();
    app.listen(PORT, () => {
        console.log("Listening on port:", PORT);
    });
};

startServer();
