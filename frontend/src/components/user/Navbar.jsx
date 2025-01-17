import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import useEcomStore from '../../store/ecom_store';
import { getAllCategory } from '../../api/category';

const Navbar = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    
    const [categories, setCategories] = useState([]);
    const categoriesNotBanner = categories.filter(category => category.name !== 'banner')

    //สำหรับ search bar
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm) {
            navigate(`../user/searchProduct?query=${searchTerm}`);
            setSearchTerm('');
        }
    };
    const Logout = useEcomStore((state) => state.actionLogout);

    //สำหรับ logout 
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
    }, []);

    return (
        <div style={{ position: 'sticky', top: "0", zIndex: "100"}}>
            <nav className="my-nav">
            <div className="container nav-content">
                <h1 className="h1-text m-0">iHAVEFurniture</h1>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="input-group w-25 ms-auto">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="ค้นหาสินค้า..."
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <button className="btn search-btn" type="submit">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                </form>

                {/* Profile and Cart Buttons */}
                <div className="d-flex align-items-center ms-3">

                    <div className="dropdown">
                        <button
                            className="circle-button-user me-3 dropdown-toggle"
                            id="profileDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                          
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                            <li><Link className="dropdown-item" to="../user/history">ประวัติการสั่งซื้อ</Link></li>
                            <li><Link className="dropdown-item" to="../user/userinfo">ข้อมูลผู้ใช้</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" onClick={handleLogout}>ออกจากระบบ</button></li>                        </ul>
                    </div>
                    <Link to="../user/cart">
                        <button className="circle-button">
                            <span className="material-symbols-outlined">shopping_cart</span>
                        </button>
                    </Link>
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
                            <Link className="nav-link active" aria-current="page" to="../user">หน้าแรก</Link>
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
                                {categoriesNotBanner.map(category => (
                                    <Link
                                        to='../user/viewall'                   
                                        key={category.id}
                                        className={`dropdown-item`}
                                        state={{ categoryName: category.name }}
                                    >
                                        <li>{category.name}</li>
                                    </Link>
                                ))}
                            </ul>
                        </li>
                        
                        <li className="nav-item">
                            <Link to="../user/billOrder" className="nav-link">ธุรกรรม</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="../user/q&a" className="nav-link">คำถามที่พบบ่อย</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="../user/aboutus" className="nav-link">เกี่ยวกับเรา</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
