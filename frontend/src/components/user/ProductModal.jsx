import React, { useState, useEffect } from 'react';
import useEcomStore from '../../store/ecom_store';
import { addProductToCart } from '../../api/Cart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductModal = ({ currentImage, currentName, currentDetail, currentPrice, currentId , currentAmount}) => {
    const [quantity, setQuantity] = useState(1); //เซ็ตจำนวนเริ่มต้นให้เท่ากับ 1
    const navigate = useNavigate();
    const token = useEcomStore((state) => state.token);
    
    useEffect(() => {
        const modal = document.getElementById('product-detail');
        modal.addEventListener('shown.bs.modal', () => {
            setQuantity(1); // รีเซ็ตจำนวนสินค้าเมื่อ modal แสดง
        });

        return () => {
            modal.removeEventListener('shown.bs.modal', () => {});
        };
    }, []);

    const handleQuantityChange = (type) => {
        if (type === 'add') {
            if (quantity >= currentAmount) {
                toast.error('สินค้ามีจำนวนไม่พอ');
            } else {
                setQuantity(quantity + 1);
            }
        } else if (type === 'sub' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    
    const handleAddToCart = async () => {
        if (quantity > currentAmount) {
            toast.error('สินค้ามีจำนวนไม่พอ');
            return;
        }
    
        const form = { productId: currentId, quantity };
    
        try {
            await addProductToCart(token, form);
            toast.success('เพิ่มสินค้าลงในรถเข็นสำเร็จ!');
        } catch (err) {
            if (!token) {
                toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าในรถเข็น');
                navigate('../login');
            } else {
                toast.error('ไม่สามารถเพิ่มสินค้าในรถเข็นได้');
            }
        }
    };
    

    return (
        <div className="modal fade" tabIndex="-1" id="product-detail">
            <div className="modal-dialog modal-dialog-centered custom-modal-dialog">
                <div className="modal-content custom-modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-1"></div>
                            <div className="col-4">
                                <img
                                    src={currentImage}
                                    className="img-fluid custom-modal-img mt-5 mb-5"
                                    alt="Product"
                                />
                            </div>
                            <div className="col-1"></div>
                            <div className="col-6 d-flex flex-column">
                                <div style={{ fontSize: '40px', fontWeight: '500' }} className="col-12 mb-4 mt-2">
                                    {currentName}
                                </div>
                                <div style={{ fontSize: '15px' }} className="col-12 mb-5">
                                    {currentDetail}
                                </div>
                                <div style={{ fontSize: '30px', fontWeight: '500' }} className="col-12 mb-5">
                                    ฿{currentPrice}
                                </div>
                                <div className="col-12">
                                    จำนวนสินค้าภายในร้าน : {currentAmount} ชิ้น
                                </div>

                                <div className="mt-5 pb-5 row align-items-center">
                                    <div className="col-3 d-flex justify-content-start align-items-center">
                                        <button
                                            className="btn btn-custom me-2"
                                            onClick={() => handleQuantityChange('sub')}
                                        >
                                            -
                                        </button>
                                        <span style={{ width: '40px', textAlign: 'center' }}>{quantity}</span>
                                        <button
                                            className="btn btn-custom ms-2"
                                            onClick={() => handleQuantityChange('add')}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="col-3">
                                        <button
                                            type="button"
                                            className="btn btn-custom w-100"
                                            onClick={handleAddToCart}
                                            data-bs-dismiss="modal"
                                        >
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
