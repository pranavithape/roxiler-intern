import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js"; 
import './css/barchart.css'

Chart.register(...registerables); 

function BarChart() {
  const [chartData, setChartData] = useState(null); 
  const [chartInstance, setChartInstance] = useState(null); 
  const [selectedMonth, setSelectedMonth] = useState(
    localStorage.getItem("selectedMonth") || "March"
  ); // Get selected month from local storage

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
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/transactions/bar-chart?month=${selectedMonth}`
        );

        
        const priceRanges = response.data;
        const labels = priceRanges.map((range) => range.range);
        const counts = priceRanges.map((range) => range.count);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Number of Items",
              data: counts,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };

    fetchBarChartData();
  }, [selectedMonth]); 

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }

   
    if (chartData) {
      const ctx = document.getElementById("myBarChart").getContext("2d");
      const newChartInstance = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              type: "linear",
              beginAtZero: true,
            },
          },
        },
      });
      setChartInstance(newChartInstance);
    }

    
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartData]); 

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    localStorage.setItem("selectedMonth", month);
  };

  return (
    <div>
      <h2>
        Bar Chart{" "}
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </h2>
      <canvas id="myBarChart" /> 
      {!chartData && <p>Loading...</p>}{" "}
    </div>
  );
}

export default BarChart;
