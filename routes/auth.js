const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const router = express.Router();
const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));

// Login route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = bcrypt.compareSync(password, user.password);
  console.log("isMatch........",isMatch);
  
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  res.json({ token });
});

// Protected route
router.get("/profile", require("../middleware/authMiddleware"), (req, res) => {
  res.json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = router;
