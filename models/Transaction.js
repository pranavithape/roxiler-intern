const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  sold: { type: Boolean, required: true },
  dateOfSale: { type: Date, required: true },
});

// Create a model from the schema
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
