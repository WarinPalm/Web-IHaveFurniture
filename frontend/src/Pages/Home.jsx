import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroImage from "./HeroImage";
import Category from './Category';
import ProductModal from '../components/user/ProductModal';
import axios from "axios";
import { toast } from "react-toastify";
import { getAllProducts } from "../api/Product";
const Home = () => {

    const [currentCategory, setCurrentCategory] = useState('โซฟา'); // เริ่มต้นที่หมวดหมู่โซฟา
    const [products, setProducts] = useState([]); //ตัวแปรเก็บสินค้า
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); //ให้สินค้าแสดง 6 ชิ้น

    //ส่งค่าไปให้ popup show product
    const [currentImage, setCurrentImage] = useState('');
    const [currentName, setCurrentName] = useState('');
    const [currentDetail, setCurrentDetail] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');
    const [currentId, setCurrentId] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');

    //ดึงข้อมูลสินค้า
    const fetchProducts = async () => {
        try {
            const res = await getAllProducts();
            setProducts(res.data.products);
        } catch (err) {
            console.error(err)
        }
    }
    useEffect(() => {
        fetchProducts();
    }, []);

    //เซ็ตชื่อหมวดหมู่สินค้าตอนคลิก 
    const handleCategoryClick = (name) => {
        setCurrentCategory(name);
    };

    //สำหรับเรียกตัวสินค้าให้มาแสดง 
    const renderProducts = () => {
        const filterProducts = products.filter(product => product.category?.name === currentCategory);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filterProducts.length);
        if (filterProducts.length === 0) { //ถ้าไม่มีสินค้า
            return (
                <h2 className="text-center mt-5 mb-5">ไม่พบสินค้าในหมวดหมู่ "{currentCategory}"</h2>
            );
        }
        return filterProducts.slice(startIndex, endIndex).map(product => (
            <div className="col-4 mb-4 text-center" key={product.id}>
                {product.stock === 0 ? ( //ถ้าสินค้าชิ้นนั้นหมด
                    <div className="card card-hover" onClick={() => { toast.error('สินค้าหมด'); }}>
                        <div className="image-soldout">
                            <img src={product.fullpath} className="product-image card-img-top" alt={product.name} />
                            <img src="/image/Other/soldout.png" className="sold-out-image" alt="Sold Out" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="mt-4 card-text text-muted">{product.description}</p>
                            <h5 className="mt-4 text-start" style={{ marginLeft: '-20px' }}>฿{product.price}</h5>
                        </div>
                    </div>
                ) : ( //ถ้าสินค้ายังไม่หมด
                    <div className="card card-hover" data-bs-toggle="modal" data-bs-target="#product-detail"
                        onClick={() => {
                            setCurrentImage(product.fullpath);
                            setCurrentName(product.name);
                            setCurrentDetail(product.description);
                            setCurrentPrice(product.price);
                            setCurrentId(product.id);
                            setCurrentAmount(product.stock);
                        }}>
                        <img src={product.fullpath} className="card-img-top" alt={product.name} />
                        <div className="card-body">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="mt-4 card-text text-muted">{product.description}</p>
                            <h5 className="mt-4 text-start" style={{ marginLeft: '-20px' }}>฿{product.price}</h5>
                        </div>
                    </div>
                )}
            </div>
        ));
    };

    //สำหรับเรียกตัวสินค้าแนะนำให้มาแสดง 
    const renderRecommendedProducts = () => {
        // กรองแล้วเลือกเฉพาะ 4 รายการแรกที่ไม่ใช่ category banner
        const recomProduct = products.slice().reverse().filter(product => product.category?.name !== 'banner').slice(0, 4);
        
        if (recomProduct.length === 0) { //ถ้าไม่มีสินค้าแนะนำ
            return (
                <h2 className="text-center mt-5 mb-5">ไม่พบสินค้าแนะนำ</h2>
            );
        }
        return recomProduct.map((product, index) => (
            <div className="col-3 mb-4 text-center" key={product.id}>
                {product.stock === 0 ? ( //ถ้าสินค้าชิ้นนั้นหมด
                    <div className="card card-hover" onClick={() => { toast.error('สินค้าหมด'); }}>
                        <div className="image-soldout">
                            <img src={product.fullpath} className="product-image card-img-top" alt={product.name} />
                            <img src="/image/Other/soldout.png" className="sold-out-image" alt="Sold Out" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="mt-4 card-text text-muted">{product.description}</p>
                            <h5 className="mt-4 text-start" style={{ marginLeft: '-20px' }}>฿{product.price}</h5>
                        </div>
                    </div>
                ) : ( //ถ้าสินค้ายังไม่หมด
                    <div className="card card-hover" data-bs-toggle="modal" data-bs-target="#product-detail"
                        onClick={() => {
                            setCurrentImage(product.fullpath);
                            setCurrentName(product.name);
                            setCurrentDetail(product.description);
                            setCurrentPrice(product.price);
                            setCurrentId(product.id);
                            setCurrentAmount(product.stock);
                        }}>
                        <img src={product.fullpath} className="card-img-top" alt={product.name} />
                        <div className="card-body">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="mt-4 card-text text-muted">{product.description}</p>
                            <h5 className="mt-4 text-start" style={{ marginLeft: '-20px' }}>฿{product.price}</h5>
                        </div>
                    </div>
                )}
            </div>
        ));
    };

    return (
        <>
            <ProductModal currentImage={currentImage} currentName={currentName} currentDetail={currentDetail} currentPrice={currentPrice} currentId={currentId} currentAmount={currentAmount} />
            <HeroImage />

            <section className="list-product">
                <div className="container">
                    <div className="col-2 pt-5 mb-5">
                        <h1>สินค้าแนะนำ</h1>
                    </div>
                    <div className="row recom-Product">
                        <div className="row">
                            {renderRecommendedProducts()}
                        </div>
                    </div>
                    <div className="col-12 pt-5">
                        <h1>หมวดหมู่สินค้า</h1>
                    </div>

                    <div className="row mt-2 pt-5">
                        <Category activeCategory={currentCategory} onCategoryClick={handleCategoryClick} />
                        <div className="col-1"></div>
                        <div className="col-9 row-gap-2">


                            <div className="row" id="show-product">
                                {renderProducts()}
                            </div>
                            <div className="row mb-4 mt-3">
                                <Link to="/viewall" className="btn btn-custom" id="seeall-btn" state={{ categoryId: currentCategory }}>
                                    แสดงเพิ่มเติม
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
