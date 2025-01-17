import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAllProducts } from "../api/Product";

const HeroImage = () => {
    const [banners, setBanners] = useState([]); // ตัวแปรเก็บภาพแบนเนอร์
    const [currentIndex, setCurrentIndex] = useState(0); //ให้ภาพที่ 1 แสดง

    const fetchBanners = async () => {
        try {
            const res = await getAllProducts();
            //เอาแค่ product ที่มีหมวดหมู่เป็น banner
            const bannerProducts = res.data.products.filter(product => product.category?.name.toLowerCase() == 'banner');

            setBanners(bannerProducts);
        } catch (error) {
            console.error("Error fetching banners:", error);
        }
    };
    useEffect(() => {
        fetchBanners();
    }, []);

    // เปลี่ยนภาพทุกๆ 3 วิ
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length);
        }, 3000);
        return () => clearInterval(interval); 
    }, [banners.length]);

    // ตอนกดคลิ้กเพื่อเปลี่ยนภาพ
    const handleButtonClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <section className="cover">
            <div className="container">
                <div
                    className="col-12 hero-image"
                    style={{
                        backgroundImage: banners.length > 0 ? `url('${banners[currentIndex]?.fullpath}')` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "70vh",
                        borderRadius: "3%",
                    }}
                >
                    
                </div>
                <div className="btn-hero-image mt-3">
                    {banners.map((_, index) => (
                        <button key={index}className={`btn btn-dark btn-banner mx-1 ${index === currentIndex ? "active" : ""}`}
                            onClick={() => handleButtonClick(index)}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroImage;
