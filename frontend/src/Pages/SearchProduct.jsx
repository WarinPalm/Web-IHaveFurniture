import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

import ProductModal from '../components/user/ProductModal';
import axios from "axios";
import { getAllProducts } from "../api/Product";

const SearchProduct = () => {

    const [products, setProducts] = useState([]); // สถานะสำหรับผลิตภัณฑ์ทั้งหมด
    const [filteredProducts, setFilteredProducts] = useState([]); // สถานะสำหรับผลิตภัณฑ์ที่กรองแล้ว

    // ส่งค่าไปให้ popup show product
    const [currentImage, setCurrentImage] = useState('');
    const [currentName, setCurrentName] = useState('');
    const [currentDetail, setCurrentDetail] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');

    // ตั้งค่าการค้นหา 
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [totalPages, setTotalPages] = useState(0);

    const location = useLocation();
    //ดึงข้อมูลสินค้า
    const fetchProducts = async ()=>{
        try{
            const res = await getAllProducts();
            setProducts(res.data.products);
        }catch(err){
            console.error(err)
        }
    }
    useEffect(() => {     
        fetchProducts();
    }, [])

    useEffect(() => { // สำหรับการค้นหา
        const query = new URLSearchParams(location.search).get('query') || '';
        setSearchTerm(query);

        // คัดตัว product ที่สามารถเอามาใกล้เคียงกับคำค้นหา
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered); // ตั้งค่าผลิตภัณฑ์ที่กรองด้วย
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
    }, [location.search, products, itemsPerPage]);

    const renderProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);

        if (filteredProducts.length === 0) {
            return (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <h3>No results found for "{searchTerm}"</h3>
                    <span className="material-symbols-outlined">sick</span>
                </div>
            );
        }

        return filteredProducts.slice(startIndex, endIndex).map((product, index) => (
            <div className="col-3 mb-4" key={index}>
                <div className="card card-hover" data-bs-toggle="modal" data-bs-target="#product-detail"
                    onClick={() => {
                        setCurrentImage(product.fullpath);
                        setCurrentName(product.name);
                        setCurrentDetail(product.description);
                        setCurrentPrice(product.price);
                    }} >
                    <img src={product.fullpath} className="card-img-top" alt={product.name} />
                    <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text text-muted">{product.description}</p>
                        <h5 className="mt-4 text-start" style={{ marginLeft: '-20px' }}>฿{product.price}</h5>
                    </div>              
                </div>
            </div>
        ));
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        let startPage = Math.max(1, currentPage - 1); // เริ่มที่หน้าปัจจุบัน - 1
        let endPage = Math.min(totalPages, currentPage + 1); // สิ้นสุดที่หน้าปัจจุบัน + 1
    
        if (currentPage === 1) { // กรณีอยู่หน้าแรก
            endPage = Math.min(totalPages, 3); // แสดง 1, 2, 3
        } else if (currentPage === totalPages) { // กรณีอยู่หน้าสุดท้าย
            startPage = Math.max(1, totalPages - 2); // แสดง totalPages - 2, totalPages - 1, totalPages
        }
    
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button key={i} className={`btn ${i === currentPage ? 'btn-custom2' : 'btn-custom'} mx-1`} 
                onClick={() => setCurrentPage(i)}>
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };


    return (
        <>

            <ProductModal currentImage={currentImage} currentName={currentName} currentDetail={currentDetail} currentPrice={currentPrice} /> 

            <section className="list-product">
                <div className="container text-center">
                    <div className="col-12 pt-5">
                        <h1>ผลการค้นหาของ: "{searchTerm}"</h1>
                    </div>
                    <div className="row mt-3 pt-5">
                        <div className="col-12 row-gap-2">
                            <div className="row" id="show-product">
                                {renderProducts()}
                            </div>
                        </div>
                    </div>
                    <div id="pagination" className="mt-4 mb-4">
                        <div className="d-flex justify-content-end">
                            {totalPages > 1 && (
                                <>
                                    <button className="btn btn-custom mx-2" 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}>
                                        Previous Page
                                    </button>

                                    {renderPageNumbers()}

                                    <button className="btn btn-custom mx-2" 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                     disabled={currentPage === totalPages}>
                                        Next Page
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SearchProduct;
