import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/table.css"; 

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

function Table() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  


  const fetchTransactions = async (month, page = 1, search = "") => {
    try {
      console.log(
        `Fetching transactions for month: ${month}, page: ${page}, search: ${search}`
      ); 
      const response = await axios.get(
        `http://localhost:3000/api/transactions?month=${month}&page=${page}&search=${search}`
      );
      console.log("API Response:", response.data);
      setTransactions(response.data.transactions || []); 
      setTotalPages(response.data.totalPages || 1); 
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  
  useEffect(() => {
    fetchTransactions(selectedMonth, currentPage, searchTerm);
  }, [selectedMonth, currentPage, searchTerm]);

  // Handle month change
 const handleMonthChange = (e) => {
   const month = e.target.value;
   setSelectedMonth(month);
   setCurrentPage(1); 
   localStorage.setItem("selectedMonth", month); 
 };


  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    fetchTransactions(selectedMonth, currentPage, e.target.value);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="table-container">
      <h1>Transactions</h1>

      <label htmlFor="month">Select Month:</label>
      <select id="month" value={selectedMonth} onChange={handleMonthChange}>
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search transactions"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Sold</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.price}</td>
                <td>{transaction.description}</td>
                <td>{transaction.sold ? "Yes" : "No"}</td>
                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          {" "}
          Page {currentPage} of {totalPages}{" "}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Table;
