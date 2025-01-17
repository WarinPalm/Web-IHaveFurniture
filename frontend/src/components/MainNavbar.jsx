import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getAllCategory } from '../api/category';
const MainNavbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    

    const handleSearch = (e) => {
        e.preventDefault(); // ป้องกันการส่งแบบฟอร์ม
        if (searchTerm) {
            navigate(`/searchProduct?query=${searchTerm}`); // เปลี่ยน path ไปที่หน้า searchProduct
            setSearchTerm(''); // ล้างค่าใน input หลังค้นหา
        }
    };

    const [categories, setCategories] = useState([]);
    const categoriesNotBanner = categories.filter(category => category.name !== 'banner')
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
                            onChange={(event) => setSearchTerm(event.target.value)} // อัปเดตค่าเมื่อมีการพิมพ์
                        />
                        <button className="btn search-btn" type="submit">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                    </form>


                    <span className="button-login">
                        <Link to="../login">
                            <button style={{ marginRight: '10px', marginLeft: '20px' }} className="circle-button" data-bs-toggle="modal" data-bs-target="#user-login">
                                <span className="material-symbols-outlined pt-1">person</span>
                            </button>
                        </Link>
                        <Link to="../login">
                            <button className="circle-button" data-bs-toggle="modal" data-bs-target="#user-login">
                                <span style={{ color: 'black' }} className="material-symbols-outlined pt-1">shopping_cart</span>
                            </button>
                        </Link>
                    </span>
                </div>
            </nav>




            <nav className="my-nav2" style={{height:"5vh"}}>
                <div className="container nav-content">
                    <div>
                        <span className="material-symbols-outlined">storefront</span>
                    </div>
                    <ul className="nav justify-content-center">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="../">หน้าแรก</Link>
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
                                        to='../viewall'
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
                            <Link to='../q&a'className="nav-link">คำถามที่พบบ่อย</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="../aboutus" className="nav-link">เกี่ยวกับเรา</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>


    );
};

export default MainNavbar;
