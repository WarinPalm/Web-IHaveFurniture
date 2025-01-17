import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cancleOrder, submitPayment } from '../../api/Order'; // เพิ่ม submitPayment
import { toast } from 'react-toastify';
import useEcomStore from '../../store/ecom_store';

const PaymentDetail = () => {
    const [notificationDateTime, setNotificationDateTime] = useState('');//วันที่แจ้งโอน
    const [proofDate, setProofDate] = useState(''); // วันที่โอน
    const [proofPicture, setProofPicture] = useState(null); // ไฟล์แนบ
    const [previewImage, setPreviewImage] = useState(null); // URL ของภาพตัวอย่าง

    const token = useEcomStore((state) => state.token);
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    // Update เวลาปัจจุบัน
    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            const formattedDateTime = now.toLocaleString('th-TH', {
                timeZone: 'Asia/Bangkok',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            setNotificationDateTime(formattedDateTime);
        };

        const intervalId = setInterval(updateCurrentTime, 1000);

        return () => clearInterval(intervalId); // ล้าง interval
    }, []);

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
    // จัดการอัปโหลดไฟล์และแสดงภาพตัวอย่าง
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProofPicture(file);

        // สร้าง URL ของภาพตัวอย่าง
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        } else {
            setPreviewImage(null);
        }
    };

    // ฟังก์ชันยกเลิกคำสั่งซื้อ
    const handleCancleOrder = async (id) => {
        try {
            await cancleOrder(token, id);
            toast.success('ยกเลิกคำสั่งซื้อสำเร็จ');
            navigate('../billorder');
        } catch (err) {
            console.error(err);
            toast.error('ยกเลิกคำสั่งซื้อไม่สำเร็จ');
        }
    };

    // ส่งข้อมูลการชำระเงิน
    const handleSubmitPayment = async () => {

        if (!notificationDateTime || !proofDate || !proofPicture) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        const formData = new FormData();
        formData.append('transferDate', notificationDateTime);
        formData.append('proofDate', proofDate);
        formData.append('proofPicture', proofPicture);

        try {
            await submitPayment(token, order.id, formData);
            toast.success('ส่งข้อมูลการชำระเงินสำเร็จ');
            navigate('../history');
        } catch (err) {
            console.error(err);
            toast.error('ส่งข้อมูลการชำระเงินไม่สำเร็จ');
        }
    };


    if (!order) {
        return <h1>ไม่พบข้อมูลคำสั่งซื้อ</h1>;
    }

    const renderBillItems = (cartInOrder) =>
        cartInOrder.map((item, index) => (
            <div className="row" key={index} >
                <div className="col-3">
                    <img src={item.product?.fullPathImage} alt="img" className="img-fluid custom-cart-img" />
                </div>
                <div className="col-4 mt-4">
                    <h5 className="card-title mt-3">{item.product?.name}</h5>

                </div>
                <div className="col-2 mt-4">
                    <h5 className="card-title mt-3">{item.quantity}</h5>

                </div>
                <div className="col-3 mt-5 text-end">
                    <h5 className="card-title">{item.totalPrice}฿</h5>
                </div>
                <hr />
            </div>
        ));

    return (
        <section className="bill-order mt-5">
            <div className="container">

                <div className="row">
                    <div className="col-12 mb-3">
                        <h1>สรุปคำสั่งซื้อ</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-10">
                        <div className="card card-bill card-order mb-5 mt-5 ">
                            <div className="card-body me-4">

                                <h1 className="card-title mt-3 mb-5">ใบเสร็จ</h1>
                                <h5 className="ms-4 mb-4">
                                    ชื่อลูกค้า: {order.userBy?.fName} {order.userBy?.lName}
                                </h5>
                                <h5 className="ms-4 mb-4">ที่อยู่: {order.userBy?.address}</h5>
                                <h5 className="ms-4 mb-4">เบอร์โทร: {order.userBy?.telNo}</h5>
                                <h5 className="ms-4 mb-4">
                                    วันที่สั่งซื้อ: {formatDate(order.buyDate)}
                                </h5>
                                <h5 className="ms-4 mb-4">สถานะ: {order.status}</h5>
                                
                                {/* โซนแสดงสินค้า */}
                                <div className="card card-bill mt-5">
                                    <div className="card-body me-5">
                                        {renderBillItems(order.cart)}
                                    </div>
                                </div>

                                {/* โซนแสดงราคา */}
                                <div className='d-flex justify-content-between ms-5 me-5 mt-5'>
                                    <h5>รวมสุทธิ :</h5>
                                    <h5 className='me-3'>{order.netPrice}฿</h5>
                                </div>
                            </div>
                        </div>
                        <hr className='mb-5' />
                        <div className="card card-bill mt-5 mb-5 pe-4">
                            <div className="card-body ms-4 me-4">
                                {/* ข้อมูลบัญชี */}
                                <div className="card mt-3 mb-5 card-kbank">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col-2 ms-4 me-4 kbank-img ">

                                            </div>
                                            <div className="col-8">
                                                <h4>082-8-06385-5</h4>
                                                <h4>นายวฤณ พรหมวรานนท์</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* วันที่แจ้งโอน */}
                                <div className="mb-3 mt-2">
                                    <div className="row align-items-center">
                                        <div className="col-3">
                                            <h5 className="card-title">วันที่ชำระ:</h5>
                                        </div>
                                        <div className="col-9">
                                            <h5 className="card-title">
                                                {notificationDateTime.replace('T', ', ')} {/* ลบตัว T และแทนด้วยช่องว่าง */}
                                            </h5>
                                        </div>
                                    </div>
                                </div>



                                {/* วันที่โอน */}
                                <div className="mb-3 mt-2">
                                    <div className="row align-items-center">
                                        <div className="col-3">
                                            <h5 className="card-title">วันที่โอน (ตามสลิป):</h5>
                                        </div>
                                        <div className="col-9">
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                onChange={(e) => setProofDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* แนบสลิป */}
                                <div className="mb-3 mt-2">
                                    <div className="row">
                                        <div className="col-3">
                                            <h5 className="card-title">แนบสลิป (ไฟล์รูปภาพ):</h5>
                                        </div>
                                        <div className="col-9">
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                            {previewImage && (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="img-thumbnail mt-3"
                                                    style={{ maxWidth: '500px' }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ปุ่ม */}
                        <hr className="mb-5" />
                        <div className="d-flex justify-content-between mb-5">
                            <button
                                className="btn btn-danger me-5"
                                onClick={() => handleCancleOrder(order.id)}
                            >
                                ยกเลิกคำสั่งซื้อ
                            </button>
                            <button
                                type="button"
                                className="btn btn-custom"
                                onClick={handleSubmitPayment}
                            >
                                ดำเนินการต่อ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentDetail;
