import React, { useState, useEffect } from "react";
import useEcomStore from "../../store/ecom_store";
import { createProduct, editProduct } from "../../api/Product";
import { toast } from "react-toastify";
import { getAllCategory } from "../../api/category";

const FormBanner = ({ currentEditProduct, fetchBanner }) => {
    const token = useEcomStore((state) => state.token); //เรียกใช้โทเคน
    const [pictureFile, setPictureFile] = useState(null); //ตัวแปรสำหรับเก็บภาพ
    const [previewImage, setPreviewImage] = useState(null); // URL ของภาพตัวอย่าง
    const [bannerCategoryId, setBannerCategoryId] = useState(null); // เก็บ id ของหมวดหมู่ banner

    // ดึงข้อมูลหมวดหมู่
    const fetchCategories = async () => {
        try {
            const res = await getAllCategory();
            // ค้นหา category ที่ชื่อว่า "banner"
            const bannerCategory = res.data.find(category => category.name.toLowerCase() === 'banner');
            if (bannerCategory) {
                setBannerCategoryId(bannerCategory.id); // ตั้งค่า id ของ banner
            } else {
                console.error("ไม่พบหมวดหมู่ banner");
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };
    useEffect(() => {
        if (bannerCategoryId) {
            setForm((prevForm) => ({ ...prevForm, categoryId: bannerCategoryId }));
        }
    }, [bannerCategoryId]); //อัพเดทค่าให้ categoryId ให้ไปตรงกับหมวดหมู่ banner

    // สร้างค่าเริ่มต้นของฟอร์ม (ใช้ bannerCategoryId ที่ตั้งไว้)
    const productForm = { name: "", description: "", price: "", stock: "", categoryId:bannerCategoryId};
    
    useEffect(() => {
        fetchCategories();
    }, []);


    const [form, setForm] = useState(productForm); //สร้างฟอร์มสำหรับส่งไปยัง backend


    useEffect(() => {
        if (currentEditProduct) { //ตอนคลิ๊ก edit ให้มีข้อมูลก่อนหน้า
            setForm({
                name: currentEditProduct.name,
                description: currentEditProduct.description,
                price: currentEditProduct.price,
                stock: currentEditProduct.stock,
                categoryId: currentEditProduct.categoryId,
            });
        } else {
            setForm(productForm);
            setPictureFile(null);
        }
    }, [currentEditProduct]);

    const handleOnChange = e => setForm({ ...form, [e.target.name]: e.target.value }); //ให้ข้อมูลอัพเดทตาม ข้อมูลที่ใส่

    // จัดการอัปโหลดไฟล์และแสดงภาพตัวอย่าง
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPictureFile(file);

        // สร้าง URL ของภาพตัวอย่าง
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        } else {
            setPreviewImage(null);
        }
    };

    //สำหรับสร้างแบนเนอร์
    const handleCreateSubmit = async e => {
        e.preventDefault(); //กันรีเฟรช
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key])); //เอาข้อมูล ฟอร์มแต่ละตัวเข้าไปใน formdata
        if (pictureFile) formData.append("picture", pictureFile); //ยัดรูปเข้าไปอย่างสุดท้าย
        try {
            await createProduct(token, formData); //เรียกใช้ createProduct จากเส้น API
            toast.success(`เพิ่มแบนเนอร์สำเร็จ`);
            setForm(productForm); //เมื่อแก้ไขเสร็จให้เป็นค่าฟอร์มเดิม
            setPictureFile(null); //เมื่อแก้ไขเสร็จให้เป็นค่าว่าง
            fetchBanner(); //เรียกใช้งาน fetch เพื่ออัพเดทข้อมูลใหม่ที่เพิ่งเข้าไป 
        } catch (err) {
            console.error(err);
            toast.error("ไม่สามารถเพิ่มแบนเนอร์ได้");
        }
    };

    //สำหรับแก้ไขแบนเนอร์
    const handleEditSubmit = async e => {
        e.preventDefault(); //กันรีเฟรช
        if (!currentEditProduct) return;
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key])); //เอาข้อมูล ฟอร์มแต่ละตัวเข้าไปใน formdata
        if (pictureFile) formData.append("picture", pictureFile); //ยัดรูปเข้าไปอย่างสุดท้าย

        try {
            await editProduct(token, currentEditProduct.id, formData);  //เรียกใช้ editProduct จากเส้น API
            toast.success(`แก้ไขสินค้า ${form.name} สำเร็จ`);
            setForm(productForm); //เมื่อแก้ไขเสร็จให้เป็นค่าฟอร์มเดิม
            setPictureFile(null); //เมื่อแก้ไขเสร็จให้เป็นค่าว่าง
            fetchBanner();//เรียกใช้งาน fetch เพื่ออัพเดทข้อมูลใหม่ที่เพิ่งเข้าไป 
        } catch (err) {
            console.error(err);
            toast.error("ไม่สามารถแก้ไขสินค้าได้");
        }
    };

    //สำหรับการสร้างฟอร์ม popup
    const renderForm = (isEdit = false) => ( //เช็คว่าเป็น edit รึป่าว
        <form onSubmit={isEdit ? handleEditSubmit : handleCreateSubmit} encType="multipart/form-data">
            <div className="mb-3">
                <label htmlFor="name" className="form-label">ชื่อแบนเนอร์</label>
                <input type="text" className="form-control" id="name" name="name" value={form.name} onChange={handleOnChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="picture" className="form-label">รูปภาพ</label>
                <input type="file" className="form-control" id="picture" onChange={handleFileChange} />
                {/* สำหรับแสดงภาพตัวอย่าง} */}
                {previewImage && (<img src={previewImage} alt="Preview" className="img-thumbnail mt-3" style={{ maxWidth: '300px' }} />)}
            </div>
            <button type="submit" className="btn btn-primary">{isEdit ? "บันทึกการเปลี่ยนแปลง" : "บันทึก"}</button>
        </form>
    );

    return (
        <>
            <div className="modal fade" id="formCreateBanner" tabIndex="-1" aria-labelledby="formProductModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="formProductModalLabel">เพิ่มแบนเนอร์ใหม่</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">{renderForm()}</div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="formEditBanner" tabIndex="-1" aria-labelledby="formEditProductModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="formEditProductModalLabel">แก้ไขแบนเนอร์</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">{renderForm(true)}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormBanner;
