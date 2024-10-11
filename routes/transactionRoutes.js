const express = require("express");
const Transaction = require("../models/Transaction");
const router = express.Router();
const moment = require("moment");
const axios = require("axios");

// Transactions route
router.get("/transactions", async (req, res) => {
  const { page = 1, limit = 10, search = "", minPrice, maxPrice } = req.query;

  try {
    // Create a search query based on user input
    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } }, // Search in title
        { description: { $regex: search, $options: "i" } }, // Search in description
      ],
    };

    // Add price range to the query if provided
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice); // Greater than or equal to minPrice
      if (maxPrice) query.price.$lte = Number(maxPrice); // Less than or equal to maxPrice
    }

    // Fetch transactions
    const transactions = await Transaction.find(query)
      .limit(Number(limit)) // Convert limit to a number
      .skip((page - 1) * limit) // Calculate skip for pagination
      .exec();

    // Count total transactions matching the query
    const count = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//get statistics
router.get("/transactions/statistics", async (req, res) => {
  const { month = "January" } = req.query;

  try {
    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    // Get the month number from the month name
    const monthNumber = moment().month(month).format("M"); // 'M' gives month number without leading zero

    // Fetch transactions for the given month using aggregation
    const transactions = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, Number(monthNumber)], // Compare the month part
          },
        },
      },
    ]);

    // Log transactions to verify results
    console.log("Fetched Transactions for Month:", transactions);

    // Calculate statistics
    const totalSales = transactions.reduce((sum, transaction) => {
      return transaction.sold ? sum + transaction.price : sum;
    }, 0);

    const totalSoldItems = transactions.filter(
      (transaction) => transaction.sold
    ).length;

    const totalUnsoldItems = transactions.filter(
      (transaction) => !transaction.sold
    ).length;

    res.json({
      totalSales,
      totalSoldItems,
      totalUnsoldItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//bar chart
router.get("/transactions/bar-chart", async (req, res) => {
  const { month="January" } = req.query;

  try {
    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    // Get the month number from the month name
    const monthNumber = moment().month(month).format("M");

    // Fetch transactions for the given month
    const transactions = await Transaction.find({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, Number(monthNumber)], // Filter by month
      },
    });

    // Initialize the ranges and counts
    const ranges = [
      { range: "0-100", count: 0 },
      { range: "101-200", count: 0 },
      { range: "201-300", count: 0 },
      { range: "301-400", count: 0 },
      { range: "401-500", count: 0 },
      { range: "501-600", count: 0 },
      { range: "601-700", count: 0 },
      { range: "701-800", count: 0 },
      { range: "801-900", count: 0 },
      { range: "901-above", count: 0 },
    ];

    // Count items in each price range
    transactions.forEach((transaction) => {
      const price = transaction.price;

      if (price <= 100) {
        ranges[0].count++;
      } else if (price <= 200) {
        ranges[1].count++;
      } else if (price <= 300) {
        ranges[2].count++;
      } else if (price <= 400) {
        ranges[3].count++;
      } else if (price <= 500) {
        ranges[4].count++;
      } else if (price <= 600) {
        ranges[5].count++;
      } else if (price <= 700) {
        ranges[6].count++;
      } else if (price <= 800) {
        ranges[7].count++;
      } else if (price <= 900) {
        ranges[8].count++;
      } else {
        ranges[9].count++;
      }
    });

    // Respond with the price range counts
    res.json(ranges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//pie chart
router.get("/transactions/pie-chart", async (req, res) => {
  const { month="January" } = req.query;

  try {
    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    // Convert month name to number (1-12)
    const monthNumber = moment().month(month).format("M");

    // Fetch transactions for the specified month, regardless of the year
    const transactions = await Transaction.find({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, Number(monthNumber)],
      },
    });

    // Count items by category
    const categoryCount = {};

    transactions.forEach((transaction) => {
      const category = transaction.category;
      if (categoryCount[category]) {
        categoryCount[category]++;
      } else {
        categoryCount[category] = 1;
      }
    });

    // Format the response
    const result = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
    }));

    // Respond with the data
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//combined data by using axios
router.get("/combined-data", async (req, res) => {
  const { month="January" } = req.query; // Get the month from query parameters

  if (!month) {
    return res.status(400).json({ message: "Month is required" }); // Validate the month parameter
  }

  try {
    // Fetch data from three APIs, passing the month as a query parameter
    const [api1Response, api2Response, api3Response] = await Promise.all([
      axios.get(
        `http://localhost:3000/api/transactions/statistics?month=${month}`
      ),
      axios.get(
        `http://localhost:3000/api/transactions/bar-chart?month=${month}`
      ),
      axios.get(
        `http://localhost:3000/api/transactions/pie-chart?month=${month}`
      ),
    ]);

    // Combine the responses
    const combinedResponse = {
      api1Data: api1Response.data,
      api2Data: api2Response.data,
      api3Data: api3Response.data,
    };

    res.json(combinedResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



//There No Defaults Given In Data So I Added January As Default Month And In Quary You Can Send Your Required Month


module.exports = router;
