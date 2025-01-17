import React, { useState, useEffect } from "react";
import useEcomStore from "../../store/ecom_store";
import { createProduct, editProduct } from "../../api/Product";
import { toast } from "react-toastify";
import { getAllCategory } from "../../api/category";

const FormProduct = ({ currentEditProduct, fetchProduct}) => {
    const productForm = { name: "", description: "", price: "", stock: "", categoryId: "" }; //สร้างค่าในฟอร์ม
    const token = useEcomStore((state) => state.token); //เรียกใช้โทเคน
    const [form, setForm] = useState(productForm); //สร้างฟอร์มสำหรับส่งไปยัง backend
    const [pictureFile, setPictureFile] = useState(null); //ตัวแปรสำหรับเก็บภาพ
    const [categories, setCategories] = useState([]); //ตัวแปรเก็บหมวดหมู่
    const categoriesNotBanner = categories.filter(category => category.name !== 'banner'); //เอาหมวดหมู่ทุกอันยกเว้น แบนเนอร์
    const [previewImage, setPreviewImage] = useState(null); // URL ของภาพตัวอย่าง

    // ดึงข้อมูลหมวดหมู่
    const fetchCategories = async ()=>{
        try{
            const res = await getAllCategory();
            setCategories(res.data);
        }catch(err){
            console.error(err)
        }
    }   
  
    useEffect(() => {
        fetchCategories();
    }, [categories]);

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

    //สำหรับสร้างสินค้า
    const handleCreateSubmit = async e => {
        e.preventDefault(); //กันรีเฟรช
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key])); //เอาข้อมูล ฟอร์มแต่ละตัวเข้าไปใน formdata
        if (pictureFile) formData.append("picture", pictureFile); //ยัดรูปเข้าไปอย่างสุดท้าย
        try {
            await createProduct(token, formData); //เรียกใช้ createProduct จากเส้น API
            toast.success(`เพิ่มสินค้าสำเร็จ`);
            setForm(productForm); //เมื่อแก้ไขเสร็จให้เป็นค่าฟอร์มเดิม
            setPictureFile(null); //เมื่อแก้ไขเสร็จให้เป็นค่าว่าง
            fetchProduct(); //เรียกใช้งาน fetch เพื่ออัพเดทข้อมูลใหม่ที่เพิ่งเข้าไป 
        } catch (err) {
            console.error(err);
            toast.error("ไม่สามารถเพิ่มสินค้าได้");
        }
    };

    //สำหรับแก้ไขสินค้า
    const handleEditSubmit = async e => {
        e.preventDefault(); //กันรีเฟรช
        if (!currentEditProduct) return;
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key])); //เอาข้อมูล ฟอร์มแต่ละตัวเข้าไปใน formdata
        if (pictureFile) formData.append("picture", pictureFile); //ยัดรูปเข้าไปอย่างสุดท้าย
        try {
            await editProduct(token, currentEditProduct.id, formData); //เรียกใช้ editProduct จากเส้น API
            toast.success(`แก้ไขสินค้าสำเร็จ`);
            setForm(productForm); //เมื่อแก้ไขเสร็จให้เป็นค่าฟอร์มเดิม
            setPictureFile(null); //เมื่อแก้ไขเสร็จให้เป็นค่าว่าง
            fetchProduct(); //เรียกใช้งาน fetch เพื่ออัพเดทข้อมูลใหม่ที่เพิ่งเข้าไป 
        } catch (err) {
            console.error(err);
            toast.error("ไม่สามารถแก้ไขสินค้าได้");
        }
    };

    //สำหรับการสร้างฟอร์ม popup
    const renderForm = (isEdit = false) => ( //เช็คว่าเป็น edit รึป่าว
        <form onSubmit={isEdit ? handleEditSubmit : handleCreateSubmit} encType="multipart/form-data">
            <div className="mb-3">
                <label htmlFor="name" className="form-label">ชื่อสินค้า</label>
                <input type="text" className="form-control" id="name" name="name" value={form.name} onChange={handleOnChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">รายละเอียด</label>
                <textarea className="form-control" id="description" name="description" value={form.description} onChange={handleOnChange} rows="3" required></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="price" className="form-label">ราคา</label>
                <input type="number" className="form-control" id="price" name="price" value={form.price} onChange={handleOnChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="stock" className="form-label">จำนวนสินค้าในสต็อก</label>
                <input type="number" className="form-control" id="stock" name="stock" value={form.stock} onChange={handleOnChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="categoryId" className="form-label">หมวดหมู่</label>
                <select className="form-select" id="categoryId" name="categoryId" value={form.categoryId} onChange={handleOnChange} required>
                    <option value="" disabled>เลือกหมวดหมู่</option>
                    {categoriesNotBanner.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="picture" className="form-label">รูปภาพ</label>
                <input type="file" className="form-control" id="picture" onChange={handleFileChange} />
                {/* สำหรับแสดงภาพตัวอย่าง */}
                {previewImage && (<img src={previewImage} alt="Preview" className="img-thumbnail mt-3 " style={{ maxWidth: '300px' }}/>)}

            </div>
            <button type="submit" className="btn btn-primary">{isEdit ? "บันทึกการเปลี่ยนแปลง" : "บันทึก"}</button>
        </form>
    );

    return (
        <>
            <div className="modal fade" id="formCreateProductModal" tabIndex="-1" aria-labelledby="formProductModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="formProductModalLabel">เพิ่มสินค้าใหม่</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">{renderForm()}</div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="formEditProductModal" tabIndex="-1" aria-labelledby="formEditProductModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="formEditProductModalLabel">แก้ไขสินค้า</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">{renderForm(true)}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormProduct;
