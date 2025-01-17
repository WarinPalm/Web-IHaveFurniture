import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// สำหรับ User ที่ยังไม่ได้ล็อคอิน
import Layout from '../Layouts/Layout'
import Home from '../Pages/Home'
import Register from '../Pages/auth/register'
import Login from '../Pages/auth/Login'
import ViewAll from '../Pages/ViewAll'
import QandA from '../Pages/QandA'
import AboutUs from '../Pages/AboutUs'
import SearchProduct from '../Pages/SearchProduct'

// สำหรับ USER
import ProtectRouteUser from './ProtectRouteUser'
import UserLayout from '../Layouts/UserLayout'
import HomeUser from '../Pages/user/HomeUser'
import Cart from '../Pages/user/Cart'
import BillOrder from '../Pages/user/BillOrder'
import OrderDetail from '../Pages/user/OrderDetail'
import PaymentDetail from '../Pages/user/PaymentDetail'
import History from '../Pages/user/History'
import UserInfo from '../Pages/user/UserInfo'
import UserEdit from '../Pages/user/UserEdit'

// สำหรับ Admin
import AdminLayout from '../Layouts/AdminLayout'
import HomeAdmin from '../Pages/admin/HomeAdmin'
import AdminProduct from '../Pages/admin/AdminProduct'
import AdminInfo from '../Pages/admin/AdminInfo'
import OrderUser from '../Pages/admin/OrderUser'
import AdminEdit from '../Pages/admin/AdminEdit'
import OrderDetails from '../Pages/admin/OrderDetails'
import UserData from '../Pages/admin/UserData'

const router = createBrowserRouter([
    {  
        path: '/', 
        element: <Layout />, 
        children: [
            { index: true, element: <Home /> },
            { path: 'login', element: <Login />},
            { path: 'register', element: <Register />},
            { path: 'viewall', element: <ViewAll />},
            { path: 'q&a', element: <QandA />},
            { path: 'aboutus', element: <AboutUs />},
            { path: 'searchProduct', element: <SearchProduct />}
        ] 
    },
    {
        path: '/user',
        element: <ProtectRouteUser element={<UserLayout />} />,
        children: [
            
            { index: true, element: <HomeUser /> },
            { path: 'viewall', element: <ViewAll />},
            { path: 'billorder', element: <BillOrder />},
            { path: 'cart', element: <Cart />},
            { path: 'history', element: <History />},
            { path: 'orderdetail', element: <OrderDetail />},
            { path: 'paymentdetail', element: <PaymentDetail />},
            { path: 'q&a', element: <QandA />},
            { path: 'aboutus', element: <AboutUs />},
            { path: 'searchProduct', element: <SearchProduct />},
            { path: 'userinfo', element: <UserInfo />},
            { path: 'useredit', element: <UserEdit />}
        ]
    },
    {
        path: '/admin',
        element: <ProtectRouteUser element={<AdminLayout />} />,
        children: [
            { index: true, element: <HomeAdmin /> },
            { path: 'adminproduct', element: <AdminProduct />},
            { path: 'admininfo', element: <AdminInfo />},
            { path: 'orderuser', element: <OrderUser />},
            { path: 'adminedit', element: <AdminEdit />},
            { path: 'userdata', element: <UserData />},
            { path: 'orderdetails', element: <OrderDetails />},
        ]
    },
])

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default AppRoutes
