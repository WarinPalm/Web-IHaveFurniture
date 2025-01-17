import React from 'react'
import { Outlet } from "react-router-dom";
import MainNavbar from '../components/MainNavbar';

function Layout() {
  return (
    <div>
        <MainNavbar/>
        <main>
            <Outlet/>
        </main>
        
    </div>
  )
}

export default Layout