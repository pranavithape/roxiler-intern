const axios = require("axios");
const express = require("express");
const Transaction = require("./models/Transaction");
const mongoose = require("mongoose");
const cors = require("cors");
//routes
const transactionRoutes = require("./routes/transactionRoutes");

//port configuration
const app = express();
const PORT = process.env.PORT || 3000;

//cors 
app.use(cors());

// Function to save data to the database
const saveDataToDatabase = async (data) => {
  try {
  
    await mongoose.connect(
      "mongodb+srv://studyraptorbio:saymyname@cluster0.0nitg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

   
    for (const item of data) {
      const transaction = new Transaction(item);
      await transaction.save();
    }
    console.log('Data saved successfully!');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Basic function to fetch data
// Function to fetch data
const fetchData = async () => {
  try {
    const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
    const data = response.data;
    console.log(typeof data); // Print the type of data for personal test
    console.log(data); // Print the data

    // Now, save the fetched data to the database
    await saveDataToDatabase(data);
  } catch (error) {
    console.error("There is something :", error);
  }
};

// Call the fetchData function
fetchData();

// Use the transaction routes
app.use('/api', transactionRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



