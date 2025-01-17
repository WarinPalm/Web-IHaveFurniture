const prisma = require('../config/prisma');
const { host , port } = require('../config/connectENV');


exports.listUser = async (req, res) => {
    try{
        // หา user ทั้งหมดที่มี role เป็น user
        const users = await prisma.user.findMany({
            where:{ role: 'user' },
            select:{
                id: true,
                fName: true,
                lName: true,
                email: true,
                telNo: true,
                address: true,
            }
        });
        res.json(users);
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}
exports.listOrder = async (req, res) => {
    try{
        // หา order ทั้งหมดที่มีการสั่งซื้อ
        const oders = await prisma.order.findMany({
            select:{
                id: true,
                netPrice: true,
                transferDate: true,
                proofPicture: true,
                proofDate: true,
                status: true,
                buyDate: true,
                userBy: {
                    select: {
                        id: true,
                        fName: true,
                        lName: true,
                        email: true,
                        telNo: true,
                        address: true,
                    }
                },
                cart: {
                    select: {
                        id: true,
                        quantity: true,
                        totalPrice: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                picture: true,
                            }
                        }
                    }
                }
            }
        });
        // ตรวจสอบว่ามี order หรือไม่
        if(oders.length === 0){
            return res.status(400).json({ message : 'ไม่พบรายการสั่งซื้อเข้ามา' });
        };

        // สร้าง path รูปภาพสำหรับแสดงผลให้กับ frontend
        const imageOrder = oders.map(orderItem => ({
            ...orderItem,
            // รูปภาพของสลีปการโอน
            proofPicture: orderItem.proofPicture ? `${host}${port}/uploads/slip/${orderItem.proofPicture}` : null  ,
            cart: orderItem.cart.map(item => ({
                ...item,
                product: {
                    ...item.product,
                    picture: `${host}${port}/uploads/${item.product.picture}`
                }
            }))
        }));

        res.json({ orders: imageOrder });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}
exports.changeStatusOrder = async (req, res) => {
    try{
        
        // ตรวจสอบว่า id ที่รับมานั้นมีสถานะการสั่งซื้อเป็นรอการตรวจสอบหรือไม่
        const checkStatusOrder = await prisma.order.findFirst({
            where: { id: Number(req.params.id)}
        });
        if(!checkStatusOrder){
            return res.status(404).json({ message: 'ไม่พบรายการที่ต้องตรวจสอบ'});
        }
        else if(checkStatusOrder.status !== 'รอการตรวจสอบ'){
            return res.status(400).json({ message: 'ไม่สามารถอนุมัติการสั่งซื้อได้' });
        };
        
        
        const { status } = req.body;

        // ถ้าสถานะการสั่งซื้อเป็น ไม่อนุมัติการสั่งซื้อ
        if(status == 'ไม่อนุมัติการสั่งซื้อ'){
            // หา product ที่ต้องการจะไม่อนุมัติการสั่งซื้อ เพื่อจะคืนสต็อกสินค้า
            const productOfoder = await prisma.order.findFirst({
                where: { id: Number(req.params.id) , status: 'รอการตรวจสอบ'},
                select:{
                    id: true,
                    status: true,
                    cart: {
                        select:{
                            id: true,
                            prodId: true,
                            quantity: true,
                            product:{
                                select:{
                                    id: true,
                                    stock: true,
                                    sold: true
                                }
                            }
                        }
                    }
                }
            });

            // ทำการวนลูปเพื่อเพิ่มสต็อกสินค้าที่ถูกยกเลิกการสั่งซื้อ
            for( let i of productOfoder.cart){
                await prisma.product.update({
                    where: { id: i.product.id},
                    data: { 
                        stock: i.product.stock + i.quantity,
                        sold: i.product.sold - i.quantity
                    }
                });
            };
        };

        // อัพเดทสถานะการสั่งซื้อ
        const order = await prisma.order.update({
            where: { id: Number(req.params.id) , status: 'รอการตรวจสอบ'},
            data: { status: status }
        });
        res.json({ message: `${order.status}` });
        
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}