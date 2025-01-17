import React from 'react'
import { Outlet } from "react-router-dom";
import NavbarAdmin from '../components/admin/NavbarAdmin';

function AdminLayout() {
  return (
    <div>
        <NavbarAdmin/>
        <main>
          <Outlet/>

        </main>
    </div>
  )
}

export default AdminLayout