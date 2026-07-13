const upload = require("../middleware/uploadMiddleware");
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

router.post("/register", upload.single("profilePic"), registerUser);

router.post("/login", loginUser);

module.exports = router;