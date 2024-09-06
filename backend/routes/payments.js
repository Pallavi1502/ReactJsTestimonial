// Import the required modules
const express = require("express")
const router = express.Router()

const { getTotalAmount, enrollStudents} = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/getTotalAmount", auth, isStudent, getTotalAmount)
router.post("/enrollStudents", auth, isStudent, enrollStudents)


module.exports = router