import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/stat.css"; 
function Stat() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalSoldItems, setTotalSoldItems] = useState(0);
  const [totalNotSoldItems, setTotalNotSoldItems] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(
    localStorage.getItem("selectedMonth") || "March" 
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchTransactionStatistics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/transactions/statistics?month=${selectedMonth}`
        );

        console.log("Fetched data:", response.data);

        const { totalSales, totalSoldItems, totalUnsoldItems } = response.data;

        
        setTotalSales(totalSales !== undefined ? totalSales : 0);
        setTotalSoldItems(totalSoldItems !== undefined ? totalSoldItems : 0);
        setTotalNotSoldItems(
          totalUnsoldItems !== undefined ? totalUnsoldItems : 0
        );

        
        console.log("Updated State - Total Sales:", totalSales);
        console.log("Updated State - Total Sold Items:", totalSoldItems);
        console.log("Updated State - Total Not Sold Items:", totalNotSoldItems);
      } catch (error) {
        console.error("Error fetching transaction statistics:", error);
      }
    };

    fetchTransactionStatistics();
  }, [selectedMonth]); 

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    localStorage.setItem("selectedMonth", month);
  };

  return (
    <div className="stat-container">
      <h2>Transaction Statistics</h2>
      <select value={selectedMonth} onChange={handleMonthChange}>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <div className="statistic-box">
        <div className="statistic">
          <strong>Total Sales:</strong> ${totalSales?.toFixed(2) ?? "0.00"}
        </div>
        <div className="statistic">
          <strong>Total Sold Items:</strong> {totalSoldItems ?? 0}
        </div>
        <div className="statistic">
          <strong>Total Not Sold Items:</strong> {totalNotSoldItems ?? 0}
        </div>
      </div>
    </div>
  );
}

export default Stat;
