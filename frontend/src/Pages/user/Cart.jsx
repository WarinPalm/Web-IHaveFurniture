import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCart, addProductToCart, deleteProduct, buyProducts } from '../../api/Cart'; // ใช้ addProductToCart สำหรับเพิ่มจำนวน
import useEcomStore from '../../store/ecom_store';
import { toast } from 'react-toastify';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]); //ตัวแปรเก็บข้อมูลสินค้าตะกร้า
    const cartItemInCart = cartItems.filter(item=> item.status === 'อยู่ในตะกร้า') //กรองแค่สินค้าที่มีสถานะ อยู่ในตะกร้า
    const token = useEcomStore((state) => state.token); //เรียกใช้ token
    const navigate = useNavigate();

    // ดึงข้อมูลสินค้าในตะกร้า
    const fetchCartItems = async () => {
        try {
            const res = await getAllCart(token);
            setCartItems(res.data.cart);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };
    //สำหรับการสั่งซื้อเพื่อชำระเงิน
    const buyProduct = async () => {
        if(cartItems.length ===0){ //ในกรณ๊ที่ไม่มีสินค้าในตะกร้า
            toast.error('ยังไม่มีสินค้าในตะกร้า');
            return;
        }
        //หากมีสินค้าอยู่ในตะกร้าแล้ว ให้สามารถกด buy ได้
        try {
            await buyProducts(token); //เรียกใช้ buyproducts จากเส้น API
            toast.success('สั่งซื้อสินค้าสำเร็จ');
            navigate('../billorder');
        } catch (err) {
            toast.error('ไม่สามารถสั่งซื้อสินค้าได้ โปรดใส่ข้อมูลให้ครบ');
            navigate('../userinfo');
        }
    };
    
    useEffect(() => {
        fetchCartItems(); 
    }, [cartItems]); //ให้เ

    const handleQuantityChange = async (id, action) => {
        // หา item ปัจจุบัน
        const currentItem = cartItems.find((item) => item.id === id);
        if (!currentItem) return;
    
        const quantityChange = action === 'increase' ? 1 : -1;
        const newQuantity = currentItem.quantity + quantityChange;
    
        if (newQuantity < 1) {
            toast.warning('ไม่สามารถลดจำนวนต่ำกว่า 1 ได้');
            return;
        }
    
        try {
            await addProductToCart(token, { productId: currentItem.prodId, quantity: quantityChange });
            fetchCartItems();
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('ไม่สามารถอัปเดตจำนวนสินค้าได้');
        }
    };
    

    const handleRemoveItem = async (id) => {
        try{
            await deleteProduct(token, id);
            await fetchCartItems();
            toast.success('ลบสินค้าสำเร็จแล้ว')
        }catch(err){
            console.error(err)
            toast.error('ลบสินค้าไม่สำเร็จ')
        }
    };

    const renderCartItems = () => {
        if (!Array.isArray(cartItemInCart) || cartItemInCart.length === 0) {
            return <div className="col-12">ตะกร้าของคุณไม่มีสินค้า</div>;
        }

        return cartItemInCart.map((item, index) => (
            <div key={index} className="card mb-3">
                <div className="row">
                    <div className="col-4">
                        <img src={item.product.fullPathImage} className="img-fluid custom-cart-img" alt={item.product.name}/>
                    </div>
                    <div className="col-8">
                        <div className="card-body">
                            <h5 className="card-title">{item.product.name}</h5>
                            <p className="card-text">{item.product.description}</p>
                            <p className="card-text text-muted">ราคา: ฿{item.product.price}</p>
                            <div className="d-flex align-items-center mb-3 justify-content-between">
                                <div className="col-6 d-flex align-items-center">
                                    <button className="btn btn-custom me-2" onClick={() => handleQuantityChange(item.id, 'decrease')}>
                                        -
                                    </button>
                                    <span className="m-2">{item.quantity}</span>
                                    <button className="btn btn-custom ms-2" onClick={() => handleQuantityChange(item.id, 'increase')}>
                                        +
                                    </button>
                                </div>
                                <div className="col-4 text-end me-4">
                                    <button className="btn btn-danger" onClick={() => handleRemoveItem(item.id)}>
                                        เอาออก
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="container">
            <h1 className="mt-5 mb-5">ตะกร้าของคุณ</h1>
            <div className="row">
                <div className="col-8">{renderCartItems()}</div>
                <div className="col-4">
                    <div className="card" style={{ position: 'sticky', top: '10px' }}>
                        <div className="card-body">
                            <h4 className="mb-4">ราคา</h4>
                        
                            <hr />
                            <div className="d-flex justify-content-between mb-3">
                                <span>รวมสุทธิ:</span>
                                <span>
                                    ฿{cartItemInCart.reduce((sum, item) => sum + item.totalPrice, 0)}
                                </span>
                            </div>
                            <button className="col-12 mt-3 btn btn-custom" onClick={buyProduct}>ดำเนินการสั่งซื้อ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
