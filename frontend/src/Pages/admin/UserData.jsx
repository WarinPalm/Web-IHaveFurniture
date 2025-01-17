import React, { useState, useEffect } from 'react';
import { fetchAllUser } from '../../api/Admin';
import useEcomStore from '../../store/ecom_store';

function UserData() {
  const [customers, setCustomers] = useState([]); //ตัวแปรเก็บข้อมูลลูกค้า
  const [filteredCustomers, setFilteredCustomers] = useState([]); //ตัวแปรเก็บลูกค้าที่ค้นหา
  const [searchTerm, setSearchTerm] = useState(''); //เก็บค่าค้นหา
  const token = useEcomStore((state) => state.token); //เรียกใช้ token

  const [currentPage, setCurrentPage] = useState(1); //ใช้กำหนดหน้าปัจจุบัน
  const [itemsPerPage] = useState(20); //แสดง 20 ข้อมูล / หน้า
  const [totalPages, setTotalPages] = useState(0); //จำนวนหน้าทั้งหมดที่ต้องมี

  // ฟิลเตอร์ลูกค้าตามคำค้นหา
  useEffect(() => {
    const filterCustomer = customers.filter((customer) =>
      (customer.id && customer.id.toString().includes(searchTerm.toLowerCase())) || // ตรวจสอบ id ก่อนใช้ toString
      (customer.fName && customer.fName.toLowerCase().includes(searchTerm.toLowerCase())) || // ตรวจสอบ fName ก่อนใช้ toLowerCase
      (customer.lName && customer.lName.toLowerCase().includes(searchTerm.toLowerCase())) // ตรวจสอบ lName ก่อนใช้ toLowerCase
    );
  
    setFilteredCustomers(filterCustomer);
    setTotalPages(Math.ceil(filterCustomer.length / itemsPerPage));
    // รีเซ็ตไปหน้าแรกเมื่อกรองเสร็จ
    setCurrentPage(1);
  }, [searchTerm, customers, itemsPerPage]);
  
  
  // ดึงข้อมูลลูกค้า
  const customerInfo = async () => {
    try {
      const res = await fetchAllUser(token); //ดึงข้อมูลลูกค้า โดยต้องเป็นแอดมินเท่านั้นถึงจะดูได้ โดยใช้ token ในการเช็ค admin
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  useEffect(() => {
    customerInfo();
  }, []);

  //คำนวณจำนวนหน้า
  useEffect(() => {
    const pages = Math.ceil(customers.length / itemsPerPage);
    setTotalPages(pages);
  }, [customers, itemsPerPage]);//จะทำใหม่อีกรอบหากจำนวนผู้ใช้มีการเปลี่ยนแปลง

  //สำหรับการแสดงข้อมูลผู้ใช้
  const renderCustomers = () => {
    if (filteredCustomers.length === 0) { //ถ้าไม่มีผู้ใช้ 
      return (
        <tr>
          <td colSpan="6" className="text-center">
            ไม่พบผู้ใช้
          </td>
        </tr>
      );
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, customers.length);

    return filteredCustomers.slice(startIndex, endIndex).map((customer) => (
      <tr key={customer.id}>
        <td>{customer.id}</td>
        <td>{customer.fName}</td>
        <td>{customer.lName}</td>
        <td>{customer.telNo}</td>
        <td>{customer.email}</td>
        <td>{customer.address}</td>
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
    <div className="container mt-5">
      <h1 className="fw-bold">ข้อมูลลูกค้า</h1>

      {/* ช่องค้นหา */}
      <div className="my-3">
        <input
          type="text"
          className="form-control"
          placeholder="ค้นหารหัสหรือชื่อของลูกค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ตาราง */}
      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>รหัสลูกค้า</th>
            <th>ชื่อจริง</th>
            <th>นามสกุล</th>
            <th>เบอร์โทร</th>
            <th>อีเมล</th>
            <th>ที่อยู่</th>
          </tr>
        </thead>
        <tbody>{renderCustomers()}</tbody>
      </table>

      {/* Pagination */}
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
  );
}

export default UserData;
