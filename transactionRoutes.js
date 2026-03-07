

const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");
const verifyUser = require("../middleware/authMiddleware");

// Add new transaction
router.post("/add", verifyUser, transactionController.addTransaction);

// Fetch all transactions of logged-in user
router.get("/list", verifyUser, transactionController.fetchTransactions);

// Update existing transaction
router.put("/update/:id", verifyUser, transactionController.modifyTransaction);

// Delete transaction
router.delete("/remove/:id", verifyUser, transactionController.removeTransaction);

module.exports = router;