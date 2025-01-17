import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import FormCategory from '../../components/admin/FormCategory';
import { deleteProduct, getAllProducts } from '../../api/Product';
import useEcomStore from '../../store/ecom_store';
import FormProduct from '../../components/admin/FormProduct';

function AdminProduct() {
  const token = useEcomStore((state) => state.token); //เรียกใช้ token

  const location = useLocation();
  const categoryNow = location.state?.categoryName || 0; //ดึงค่าหมวดหมู่ล่าสุดที่มาจาก navbar แต่ถ้าไม่่มีให้ 0 หรือก็คือ all product 

  const [currentCategory, setCurrentCategory] = useState(categoryNow); //หากคลิ้กที่หมวดหมู่ไหน ให้แสดงแค่หมวดหมู่นั้น
  const [products, setProducts] = useState([]); //ตัวแปรเก็บสินค้า
  const [filteredProducts, setFilteredProducts] = useState([]); //ตัวแปรเก็บสินค้าที่มีการกรอง
  const [searchTerm, setSearchTerm] = useState(''); //สำหรับเก็บค่าที่ค้นหา
  const [currentPage, setCurrentPage] = useState(1); //ตัวแปรกำหนดหน้าปัจจุุบัน (ให้เริ่มต้นที่หน้า 1)
  const [totalPages, setTotalPages] = useState(0); //ตัวแปรจำนวนหน้า
  const [itemsPerPage] = useState(10); //ให้มีหน้าละ 10 ชิ้น

  const [editProduct, setEditProduct] = useState(null); //ตัวแปรกำหนดสินค้าที่กำลังจะแก้ไข

  // ดึงข้อมูลสินค้า
  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data.products.filter(product => product.category?.name.toLowerCase() !== 'banner')); //เอาสินค้าทุกชิ้น ยกเว้น ตัวแบนเนอร์
      setFilteredProducts(res.data.products.filter(product => product.category?.name === currentCategory)); // สำหรับสินค้าที่เฉพาะเจาะจงหมวดหมู่
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // อัปเดต currentCategory เมื่อ categoryNow เปลี่ยน
  useEffect(() => {
    setCurrentCategory(categoryNow);
    setCurrentPage(1);
  }, [categoryNow]);

  // ฟิลเตอร์สินค้าตามคำค้นหา
  useEffect(() => {
    const filterProducts = () => {
      const matchesSearch = (product) =>
        product.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) || // ค้นหา id
        product.name.toLowerCase().includes(searchTerm.toLowerCase()); // ค้นหาชื่อ

      if (currentCategory === 0) {
        // กรณีแสดงสินค้าทั้งหมด
        const allFiltered = products.filter((product) => matchesSearch(product));
        setFilteredProducts(allFiltered);
        setTotalPages(Math.ceil(allFiltered.length / itemsPerPage)); //คำนวณจำนวนหน้า
      } else {
        // กรณีแสดงสินค้าตามหมวดหมู่
        const categoryFiltered = products.filter((product) => product.category?.name === currentCategory && matchesSearch(product));
        setFilteredProducts(categoryFiltered);
        setTotalPages(Math.ceil(categoryFiltered.length / itemsPerPage));
      }
      // รีเซ็ตไปหน้าแรกเมื่อกรองเสร็จ
      setCurrentPage(1);
    };

    filterProducts();
  }, [searchTerm, products, currentCategory, itemsPerPage]);

  // ลบสินค้า
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(token, id);
      toast.success("ลบสินค้าเรียบร้อยแล้ว");
      fetchProducts();
    } catch (err) {
      toast.error(err)
    }
  };

  //แสดงสินค้า
  const renderProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);

    if (filteredProducts.length === 0) { //ถ้าไม่มีสินค้าในหมวดหมู่นั้น ให้แสดงว่าไม่มีสินค้า
      return (
        <tr>
          <td colSpan="7" className="text-center">
            ไม่พบสินค้าในหมวดหมู่ "{currentCategory}"
          </td>
        </tr>
      );
    }

    return filteredProducts.slice(startIndex, endIndex).map((product) => ( //ถ้่ามีสินค้าให้แสดงออกมา
      <tr key={product.id}>
        <td>{product.id}</td>
        <td>{product.name}</td>
        <td>{product.description}</td>
        <td>฿{product.price}</td>
        <td>
          <img
            src={product.fullpath}
            alt={product.name}
            style={{ width: '50px', height: 'auto', objectFit: 'cover' }}
          />
        </td>
        <td className="text-center">
          {product.stock === 0 ? (
            <p style={{ color: "red" }}>สินค้าหมด</p>
          ) : (product.stock)} </td>

        <td>
          <button className="btn btn-link text-primary w-100" data-bs-toggle="modal" data-bs-target="#formEditProductModal"
            onClick={() => setEditProduct(product)}>
            <i className="bi bi-pencil-square"></i>
          </button>
        </td>
        <td>
          <button className="btn btn-link text-danger w-100" onClick={() => handleDeleteProduct(product.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    ));
  };

  //สำหรับแสดงเลขหน้า
  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 1); // เริ่มต้นที่หน้าปัจจุบัน - 1
    let endPage = Math.min(totalPages, currentPage + 1); // สิ้นสุดที่หน้าปัจจุบัน + 1

    if (currentPage === 1) {
      // ถ้าหน้าปัจจุบันคือหน้าแรก แสดง 1, 2, 3 (หรือถึง totalPages ถ้า < 3)
      endPage = Math.min(totalPages, 3);
    } else if (currentPage === totalPages) {
      // ถ้าหน้าปัจจุบันคือหน้าสุดท้าย แสดง totalPages-2, totalPages-1, totalPages
      startPage = Math.max(1, totalPages - 2);
    }

    // สร้างปุ่มเลขหน้า
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
    <div>
      <div className="container mt-5">

        <div className="d-flex justify-content-between align-items-center mb-4">
          {currentCategory === 0 ? <h1 className="fw-bold">สินค้า | สินค้าทั้งหมด </h1> : //ถ้าคลิกสินค้าทั้งหมดให้แสดงคำว่า สินค้าทั้งหมด
            <h1 className="fw-bold">สินค้า | {currentCategory}</h1>}
          <input type="text" className="form-control w-25" placeholder="ค้นหารหัสหรือชื่อสินค้า..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-start mb-3">

          <button className="btn btn-custom" data-bs-toggle="modal" data-bs-target="#formShowCategoriesModal">
            จัดการหมวดหมู่สินค้า
          </button>
          <button className='btn btn-custom ms-3' data-bs-toggle="modal" data-bs-target="#formCreateCategoryModal">
            เพิ่มหมวดหมู่
          </button>
          <button className='btn btn-custom ms-3' data-bs-toggle="modal" data-bs-target="#formCreateProductModal">
            เพิ่มสินค้า
          </button>
        </div>

        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <th>รหัสสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th>รายละเอียด</th>
              <th>ราคา (บาท)</th>
              <th>รูปภาพ</th>
              <th>จำนวนสินค้าในร้าน</th>
              <th>แก้ไข</th>
              <th>ลบ</th>
            </tr>
          </thead>
          <tbody>
            {renderProducts()}
          </tbody>
        </table>

        <div id="pagination" className="mt-4 mb-4">
          <div className="d-flex justify-content-end">
            {totalPages > 1 && (
              <>
                {/* ปุ่ม Previous จะไม่มีผลเมื่ออยู่หน้าแรก */}
                <button className="btn btn-custom mx-2"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}>
                  ก่อนหน้า
                </button>

                {renderPageNumbers()}

                {/* ปุ่ม Next จะไม่มีผลเมื่ออยู่หน้าสุดท้าย */}
                <button className="btn btn-custom mx-2"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}>
                  ถัดไป
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <FormCategory />
      <FormProduct currentEditProduct={editProduct} fetchProduct={fetchProducts} />

    </div>
  );
}

export default AdminProduct;
