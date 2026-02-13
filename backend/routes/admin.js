import express from "express";
import bcrypt from "bcrypt";
import db from "../db.js"; // Import database connection

const router = express.Router();

// Admin Login Route
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const sql = "SELECT * FROM ADMIN WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const admin = results[0];

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ Login successful
        res.status(200).json({
            message: "Login successful",
            loggedIn: true
        });
    });
});

// Admin Dashboard Route
router.get("/dashboard", (req, res) => {
    if (req.query.loggedIn === "true") {
        res.json({ message: "Welcome to the Dashboard!" });
    } else {
        res.status(401).json({ message: "Unauthorized. Please log in." });
    }
});

// Admin Logout Route
router.get("/logout", (req, res) => {
    res.json({ message: "Logged out successfully. Redirect to login." });
});

export default router;