import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { changeStatusOrder } from '../../api/Admin';
import useEcomStore from '../../store/ecom_store';
import { toast } from 'react-toastify';

const OrderDetails = () => {
    const location = useLocation();
    const order = location.state;//ดึงข้อมูลออเดอร์เมื่อกด รายละเอียดดูเพิ่มเติม
    const token = useEcomStore((state)=>state.token) //เรียกใช้ token
    const navigate = useNavigate();
    
    const formatDate = (dateString) => { //สำหรับอัพเดทข้อมูลของเวลา
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = (date.getFullYear() + 543);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };
    // การอนุมัติคำสั่งซื้อ
    const approveOrder = async (statusOrder) =>{
        if(statusOrder == 'ไม่อนุมัติคำสั่งซื้อ'){ //ถ้าไม่อนุมัติคำสั่งซื้อ
            try{
                await changeStatusOrder(token, order.id, {status:statusOrder}) //ให้อัพเดทผ่าน changeStatusOrder จากเส้น API
                toast.success('ไม่อนุมัติคำสั่งซื้อสำเร็จ')
                navigate('../orderuser', { state: { orderStatus: "รอการตรวจสอบ" }}) //พาไปหน้าหลักของรายการที่ลูกค้าสั่ง
            }catch(err){
                console.error(err)
                toast.error('ทำรายการไม่สำเร็จ')
                navigate('../orderuser', { state: { orderStatus: "รอการตรวจสอบ" }}) //พาไปหน้าหลักของรายการที่ลูกค้าสั่ง
            }
        }
        else{ //ถ้าอนุมัติคำสั่งซื้อ
            try{
                await changeStatusOrder(token, order.id, {status:statusOrder}) //ให้อัพเดทผ่าน changeStatusOrder จากเส้น API
                toast.success('อนุมัติคำสั่งซื้อสำเร็จ')
                navigate('../orderuser', { state: { orderStatus: "รอการตรวจสอบ" }}) //พาไปหน้าหลักของรายการที่ลูกค้าสั่ง
            }catch(err){
                console.error(err)
                toast.error('ทำรายการไม่สำเร็จ')
                navigate('../orderuser', { state: { orderStatus: "รอการตรวจสอบ" }}) //พาไปหน้าหลักของรายการที่ลูกค้าสั่ง
            }
        }
        
    }
    // ฟังก์ชันสำหรับ render สินค้า
    const renderProductItem = (cartInOrder) => {
        return cartInOrder.map((item) => (
            <div className="row" key={item.id}>
                <div className="col-3">
                    <img src={item.product?.picture} alt={item.product?.name} className="img-fluid custom-cart-img" />
                </div>
                <div className="col-4 mt-4">
                    <h5 className="card-title mt-3">{item.product?.name}</h5>
                </div>
                <div className="col-2 mt-4">
                    <h5 className="card-title mt-3">จำนวน: {item.quantity}</h5>
                </div>
                <div className="col-3 mt-5 text-end">
                    <h5 className="card-title">{(item.product?.price || 0) * item.quantity}฿</h5>
                </div>
                <hr />
            </div>
        ));
    };



    return (
        <div className="container">
            {order == '' ? (<p>ไม่พบข้อมูลคำสั่งซื้อ</p>) : ''}
            <h1 className="mt-5">ประวัติการสั่งซื้อ</h1>
            <div className="row">
                <div className="col-1"></div>

                <div className="col-10">
                    <div className="card card-bill card-order mb-5 mt-5">
                        <div className="card-body me-4">
                            <h1 className="card-title mt-3 mb-5">ใบเสร็จ</h1>
                            <h5 className="ms-4 mb-4">
                                ชื่อลูกค้าที่สั่ง: {order.userBy?.fName} {order.userBy?.lName}
                            </h5>
                            <h5 className="ms-4 mb-4">ที่อยู่ลูกค้า: {order.userBy?.address || "ไม่มีข้อมูลที่อยู่"}</h5>
                            <h5 className="ms-4 mb-4">เบอร์โทรลูกค้า: {order.userBy?.telNo}</h5>
                            <h5 className="ms-4 mb-4">วันที่ลูกค้าสั่งซื้อ: {formatDate(order.buyDate)}</h5>
                            <h5 className="ms-4 mb-4">
                                วันที่ลูกค้าชำระเงิน: {order.transferDate ? order.transferDate : ("ยังไม่ได้ระบุวันที่")}
                            </h5>


                            <h5 className="ms-4 mb-4">สถานะ: {order.status}</h5>

                            {/* โซนแสดงสินค้า */}
                            <div className="card card-bill mt-5">
                                <div className="card-body me-5">
                                    {renderProductItem(order.cart)}
                                </div>
                            </div>

                            {/* โซนแสดงราคา */}
                            <div className="d-flex justify-content-between ms-5 me-5 mt-5">
                                <h5>รวมสุทธิ :</h5>
                                <h5 className="me-3">{order.netPrice || 0}฿</h5>
                            </div>
                        </div>
                    </div>
                    <hr className="mb-5" />
                    {order.proofPicture == null ? "" : (
                        <div className="card card-bill card-order mb-5 mt-5">
                            <div className="card-body ms-4 me-4">
                                <h2 className="card-title mt-3 mb-5">หลักฐานการชำระเงิน</h2>
                                <div className="row">
                                    <img className='col-12' src={order.proofPicture} alt="not image" style={{width:"600px"}}/>
                                    <hr className='mt-5' />
                                    <h5 className="ms-4 mt-5 mb-4 col-12">
                                        วันที่โอนตามสลิป: {order.proofDate ? formatDate(order.proofDate) : "ยังไม่ได้ระบุวันที่"}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="d-flex justify-content-between mb-5">
                        <Link to="../orderuser" state={{ orderStatus: "รอการตรวจสอบ"}}>
                            <button className="btn btn-custom">ย้อนกลับ</button>
                        </Link>
                        {
                            order.status === 'รอการตรวจสอบ'?( //ถ้าเป็นคำสั่งซื้อที่ต้องรอการตรวจสอบ จะให้แสดงปุ่ม อนุมัติกับไม่อนุมัติ
                            <div> 
                                <button className="btn btn-danger me-3" onClick={()=> approveOrder('ไม่อนุมัติการสั่งซื้อ')}>ไม่อนุมัติ</button>
                                <button className="btn btn-success" onClick={()=> approveOrder('อนุมัติการสั่งซื้อ')}>อนุมัติ</button>
                            </div>
                            ):'' // แต่ถ้าไม่ใช่สถานะ รอการตรวจสอบ แอดมินจะได้แค่ดูเฉยๆ
                        }
                       
                    </div>
                </div>

                
            </div>
        </div>
    );
};

export default OrderDetails;
