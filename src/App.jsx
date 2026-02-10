import './App.css'
import React from 'react';
import { RouterProvider, Routes } from "react-router-dom"
import router from './Components/Routes';
import Snowfall from 'react-snowfall'
import { ToastContainer } from "react-toastify";


function App() {

  return (
    <>
    <Snowfall color="black"/>
    <RouterProvider router={router}/>
    <ToastContainer/>
    </>
  )
}

export default App;
