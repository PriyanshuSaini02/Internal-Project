const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./db/db");
const adminRoutes = require("./routes/adminRoute");
const userRoutes = require("./routes/userRoute");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Serve static files (profile pictures)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Snabbtech Backend API is running!",
        version: "1.0.0",
        endpoints: {
            admin: "/api/admin",
            users: "/api/users"
        }
    });
});

const startServer = async () => {
    await db();
    app.listen(PORT, () => {
        console.log("Listening on port:", PORT);
    });
};

startServer();