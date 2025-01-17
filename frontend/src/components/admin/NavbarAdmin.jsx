import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import useEcomStore from '../../store/ecom_store';
import { getAllCategory } from '../../api/category';

const NavbarAdmin = () => {
    const navigate = useNavigate(); 
    
    const [categories, setCategories] = useState([]); //ตัวแปรเก็บหมวดหมู่
    const categoriesNotBanner = categories.filter(category => category.name !== 'banner'); //เอาหมวดหมู่ทุกหมวดหมู่ที่ไม่ใช่ แบนเนอร์

    const Logout = useEcomStore((state) => state.actionLogout);

    const handleLogout = () => {
        Logout();
        navigate('/');
    };
     //ดึงหมวดหมู่
     const fetchCategories = async () => {
        try{
            const res = await getAllCategory();
            setCategories(res.data);
        }catch(err){
            console.error(err)
        }
    };
    useEffect(() => {
        fetchCategories();
    }, [categories]);

    return (
        <div style={{ position: 'sticky', top: "0", zIndex: "100"}}>
            <nav className="my-nav">
            <div className="container nav-content">
                <h1 className="h1-text m-0">iHAVEFurniture</h1>

                {/* Profile and Cart Buttons */}
                <div className="d-flex align-items-center ms-3">

                    <div className="dropdown">
                        <button
                            className="circle-button-admin me-3 dropdown-toggle"
                            id="profileDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                          
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                            <li><Link className="dropdown-item" to="../admin/admininfo">ข้อมูลแอดมิน</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" onClick={handleLogout}>ออกจากระบบ</button></li>                        </ul>
                    </div>
                    
                </div>
            </div>

            </nav>

            <nav className="my-nav2" style={{height:"5vh"}}>
                <div className="container nav-content">
                    <div>
                        <span className="material-symbols-outlined">storefront</span>
                    </div>
                    <ul className="nav justify-content-center">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="../admin/userdata">ข้อมูลลูกค้า</Link>
                        </li>
                        <li className="nav-item">   
                            <Link className="nav-link active" aria-current="page" to="../admin">จัดการแบนเนอร์</Link>
                        </li>
                        
                        
                        <li className="nav-item dropdown">
                            <a
                                className={`nav-link dropdown-toggle`}
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                สินค้า
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <Link
                                to='../admin/adminproduct'
                                
                                className={`dropdown-item`}
                                state={{ categoryId: 0 }}
                                >
                                    <li>สินค้าทั้งหมด</li>
                                </Link>
                                {categoriesNotBanner.map(category => (
                                    <Link
                                        to='../admin/adminproduct'
                                        key={category.id}
                                        className={`dropdown-item `}
                                        state={{ categoryName: category.name }}
                                    >
                                        <li>{category.name}</li>
                                    </Link>
                                ))}
                            </ul>
                        </li>
                       
                        <li className="nav-item dropdown">
                            <a
                                className={`nav-link dropdown-toggle`}
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                คำสั่งซื้อ
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <Link to='../admin/orderuser' className={`dropdown-item`} state={{orderStatus:"รอการตรวจสอบ"}} ><li>รอการตรวจสอบ</li></Link>
                                <Link to='../admin/orderuser' className={`dropdown-item`} state={{orderStatus:"รอการชำระเงิน"}}><li>รอการชำระเงิน</li></Link>
                                <Link to='../admin/orderuser' className={`dropdown-item`} state={{orderStatus:"อนุมัติการสั่งซื้อ"}}><li>อนุมัติการสั่งซื้อ</li></Link>
                                <Link to='../admin/orderuser' className={`dropdown-item`} state={{orderStatus:"ไม่อนุมัติการสั่งซื้อ"}}><li>ไม่อนุมัติการสั่งซื้อ</li></Link>
                                <Link to='../admin/orderuser' className={`dropdown-item`} state={{orderStatus:"ยกเลิกรายการสั่งซื้อ"}}><li>ยกเลิกรายการสั่งซื้อ</li></Link>   
                            </ul>
                        </li>
                        
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default NavbarAdmin;
