import { useState } from 'react'
import Navbar from './components/Navbar'
import BarChart from "./components/BarChart";
import Pie from './components/Pie';
import Table from './components/Table';
import Stat from './components/Stat';

import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Table />,
    },
    {
      path: "/bar-chart",
      element: <BarChart />,
    },
    {
      path: "/pie-chart",
      element: <Pie />,
    },
    {
      path: "/statistics",
      element: <Stat />,
    },
  ]);


  return (
    <>
      <Navbar /> 
      <RouterProvider router={router} />
    </>
  );
}

export default App
