import React from 'react'
import AppRouter from "./routes/AppRouter"
// ให้วางไว้ที่ทุกๆ component เข้าถึง
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {


  return (
    <>
      <div>
        <ToastContainer />
        <AppRouter />
      </div>
    </>
  )
}

export default App
