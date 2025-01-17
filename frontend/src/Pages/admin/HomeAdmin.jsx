import React, { useState, useEffect } from "react";
import HeroImage from "../HeroImage";
import axios from 'axios';
import { deleteProduct, getAllProducts } from '../../api/Product';
import FormBanner from "../../components/admin/FormBanner";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom_store";

const HomeAdmin = () => {
    const token = useEcomStore((state) => { state.token }) //เรียกใช้ token
    const [banner, setBanner] = useState([]) //ตัวแปรเก็บแบนเนอร์
    const [editBanner, setEditBanner] = useState(null); //ตัวแปรกำหนดแบนเนอร์ที่กำลังจะแก้ไข

    // ดึงข้อมูลแบบเนอร์
    const fetchBanner = async () => {
        try {
            const res = await getAllProducts();
            setBanner(res.data.products.filter(product => product.category?.name.toLowerCase() === 'banner')); //เอาเฉพาะสินค้าที่มีหมวดหมู่แบนเนอร์
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBanner();
    }, []);

    // ลบ banner
    const handleDeleteBanner = async (id) => {
        try {
            await deleteProduct(token, id);
            toast.success("ลบแบนเนอร์เรียบร้อยแล้ว");
            fetchBanner();
        } catch (err) {
            toast.error(err)
        }
    };
    return (
        <>
            <HeroImage />
            <div className="container mt-5">
                <button className="btn btn-primary mb-4" data-bs-toggle="modal"
                    data-bs-target="#formCreateBanner">เพิ่มแบนเนอร​์</button>

                <table className="table table-bordered text-center mb-5">
                    <thead>
                        <tr>
                            <th scope="col">ลำดับ</th>
                            <th scope="col">ภาพแบนเนอร์</th>
                            <th scope="col">แก้ไข</th>
                            <th scope="col">ลบ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banner.length === 0 ? (<tr><td colSpan="4">ไม่มีแบนเนอร์ที่ใช้ ณ ตอนนี้</td></tr>) 
                        : banner.map((banner, index) => (
                            <tr key={banner.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={banner.fullpath} alt={banner.name}
                                        style={{
                                            width: "300px",
                                            height: "auto",
                                            borderRadius: "5px",
                                        }} />
                                </td>
                                <td>
                                    <button className="btn btn-link text-primary" data-bs-toggle="modal"
                                        data-bs-target="#formEditBanner"
                                        onClick={() => setEditBanner(banner)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                </td>
                                <td>
                                    <button className="btn btn-link text-danger" onClick={() => { handleDeleteBanner(banner.id) }}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
            <FormBanner currentEditProduct={editBanner} fetchBanner={fetchBanner} />
        </>
    );
};

export default HomeAdmin;
