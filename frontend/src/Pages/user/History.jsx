import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHistory } from '../../api/Order';
import useEcomStore from '../../store/ecom_store';


const History = () => {

    const navigate = useNavigate();

    const token = useEcomStore((state) => state.token);
    const [orderHistory, setOrderHistory] = useState([]);

    const fetchOrderHistory = async () => {
        try {
            const res = await fetchHistory(token);
            setOrderHistory(res.data.order);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrderHistory();
    }, []);
    const goToOrderDetail = (history) => {
        navigate(`../orderDetail`,{state: {history} }); // ส่ง order ไปยัง OrderDetail
    };

    return (
        <div className="container">
            <div className="row">
                <h1 className="mt-5 mb-5">ประวัติการสั่งซื้อ</h1>
                {orderHistory.length ===0?(<h2>ไม่มีรายการชำระเงิน</h2>):''}
                {orderHistory.slice().reverse().map((history, index) => (
                    <div
                        className="card mb-5 card-bill card-hover"
                        key={index}
                        onClick={() => goToOrderDetail(history)} // ส่ง order เมื่อคลิก
                    >
                        <div className="row">
                            <div className="col-3">
                                <img
                                    src={history.cart[0]?.product?.fullPathImage || 'image'}
                                    className="img-fluid custom-cart-img rounded-start"
                                    alt={history.cart[0]?.product?.name || 'No Image'}
                                />
                            </div>
                            <div className="col-4">
                                <div className="card-body">
                                    <h5 className="card-title">หมายเลขคำสั่งซื้อ: {history.id}</h5>
                                    <p className="card-title">สถานะคำสั่งซื้อ: {history.status}</p>
                                </div>
                            </div>
                            <div className="col-5">
                                <div className="card-body">
                                    <h5 className="card-title">ที่อยู่</h5>
                                    <p className="card-title">{history.userBy.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <hr className='mb-5'/>
            </div>
        </div>
    );
}
export default History;
