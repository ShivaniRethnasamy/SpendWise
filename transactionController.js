

const TransactionModel = require("../models/Transaction");

// Add new transaction
// Route: POST /api/transactions
exports.addTransaction = async (req, res) => {

  try {

    const { amount, type, category, note, date } = req.body;

    // Basic validation
    if (!amount || !type) {
      return res.status(400).json({
        message: "Transaction amount and type must be provided"
      });
    }

    const newTransaction = await TransactionModel.create({
      user: req.user._id,
      amount: amount,
      type: type,
      category: category,
      note: note,
      date: date
    });

    res.status(201).json({
      message: "Transaction created successfully",
      data: newTransaction
    });

  } catch (err) {

    console.log("Transaction creation error:", err);

    res.status(500).json({
      message: "Unable to create transaction"
    });

  }

};


// Get transactions of logged in user
// Route: GET /api/transactions
exports.fetchTransactions = async (req, res) => {

  try {

    const userTransactions = await TransactionModel
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      count: userTransactions.length,
      transactions: userTransactions
    });

  } catch (err) {

    console.log("Fetch transaction error:", err);

    res.status(500).json({
      message: "Failed to retrieve transactions"
    });

  }

};


// Modify transaction
// Route: PUT /api/transactions/:id
exports.modifyTransaction = async (req, res) => {

  try {

    const transactionId = req.params.id;

    const existingTransaction = await TransactionModel.findById(transactionId);

    if (!existingTransaction) {
      return res.status(404).json({
        message: "Transaction record not found"
      });
    }

    // Check if logged in user owns the transaction
    if (existingTransaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this transaction"
      });
    }

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
      transactionId,
      req.body,
      { new: true }
    );

    res.json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction
    });

  } catch (err) {

    console.log("Update error:", err);

    res.status(500).json({
      message: "Error updating transaction"
    });

  }

};


// Remove transaction
// Route: DELETE /api/transactions/:id
exports.removeTransaction = async (req, res) => {

  try {

    const transactionId = req.params.id;

    const transaction = await TransactionModel.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    // Verify ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot delete this transaction"
      });
    }

    await transaction.deleteOne();

    res.json({
      message: "Transaction deleted successfully"
    });

  } catch (err) {

    console.log("Delete transaction error:", err);

    res.status(500).json({
      message: "Failed to delete transaction"
    });

  }

};