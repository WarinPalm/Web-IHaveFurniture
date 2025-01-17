const prisma = require('../config/prisma');
const { host , port } = require('../config/connectENV');

exports.readOrder = async (req,res) => {
    try{
        const order = await prisma.order.findMany({
            where: { userById: req.user.id , status: 'รอการชำระเงิน'},
            select: {
                id: true,
                status: true,
                netPrice: true,
                buyDate : true,
                userBy: {
                    select: {
                        fName: true,
                        lName: true,
                        email: true,
                        telNo: true,
                        address: true
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
                                picture: true
                            }
                        }
                    }
                }
            }
            
        });

        // ตรวจสอบว่ามีรายการสั่งซื้อหรือไม่ !!หาก order เป็น array จะตรวจสอบด้วย order.length ใช้กับ findmany
        if(order.length === 0){
            return res.status(400).json({ message : 'ไม่มีรายการสั่งซื้อ' });
        }

        
        
        // เพิ่ม fullPathImage ให้กับสินค้าแต่ละรายการ
        const orderWithImages = order.map(orderItem => ({
            ...orderItem,
            cart: orderItem.cart.map(item => ({
                ...item,
                product: {
                    ...item.product,
                    fullPathImage: `${host}${port}/uploads/${item.product.picture}`
                }
            }))
        }));


        res.json({order : orderWithImages});
    }catch(err){
        console.log(err);
        res.status(500).json({ message : 'server error' });
    }
}

exports.orderPayment = async (req,res) =>{
    try{
        const { transferDate , proofDate } = req.body;
        const { id } = req.params;

        // ตรวจสอบว่ามีรายการสั่งซื้อหรือไม่
        const order = await prisma.order.findFirst({
            where: { id: Number(id) , status: 'รอการชำระเงิน' },
        });
        if(!order){
            return res.status(400).json({ message : 'ไม่พบรายการสั่งซื้อ' });
        };

        // ตรวจสอบว่ามีการอัปโหลดไฟล์หลักฐานการโอนหรือไม่
        if (!req.file) {
            return res.status(400).json({ message: 'กรุณาอัปโหลดไฟล์หลักฐานการโอน' });
        };

        // อัปเดตสถานะการชำระเงินเป็น รอการตรวจสอบ
        const payment = await prisma.order.update({
            where: { id: Number(id) },
            data:{
                status: 'รอการตรวจสอบ',
                transferDate: transferDate,
                proofPicture: req.file.filename,
                proofDate: proofDate
            }
        });

        res.json({ message : 'ชำระเงินเสร็จสิ้น รอการตรวจสอบ' , payment});

    }catch(err){
        console.log(err);
        res.status(500).json({ message : 'server error' });
    }
}

exports.historyOrder = async (req,res) => {
    try{
        const order = await prisma.order.findMany({
            where: { userById: req.user.id },
            select: {
                id: true,
                status: true,
                netPrice: true,
                buyDate : true,
                userBy: {
                    select: {
                        fName: true,
                        lName: true,
                        email: true,
                        telNo: true,
                        address: true
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
                                picture: true
                            }
                        }
                    }
                }
            }
        });
        // เพิ่ม fullPathImage ให้กับสินค้าแต่ละรายการ
        const orderWithImages = order.map(orderItem => ({
            ...orderItem,
            cart: orderItem.cart.map(item => ({
                ...item,
                product: {
                    ...item.product,
                    fullPathImage: `${host}${port}/uploads/${item.product.picture}`
                }
            }))
        }));

        res.json({order : orderWithImages});
    }catch(err){
        console.log(err);
        res.status(500).json({ message : 'server error' });
    }
}

exports.cancelOrder = async (req,res) => {
    try{
        const { id } = req.params;
        const order = await prisma.order.findFirst({
            where: { id: Number(id) , status: { in: ['รอการชำระเงิน', 'รอการตรวจสอบ'] }},
            select:{
                id: true,
                status: true,
                cart:{
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

        // ตรวจสอบว่ามีรายการสั่งซื้อหรือไม่ !!หาก  !order จะตรวจสอบด้วย order ใช้กับ findfirst 
        if(!order){
            return res.status(404).json({ message : 'ไม่พบรายการสั่งซื้อ' });
        };

        
        for(let item of order.cart){
            await prisma.product.update({
                where: { id: item.product.id },
                data:{
                    stock: item.product.stock + item.quantity, // คืนสินค้าที่ยกเลิก
                    sold: item.product.sold - item.quantity // ลดจำนวนสินค้าที่ขายไป
                }
            });
        }

        const cancel = await prisma.order.update({
            where: { id: Number(id) },
            data: { 
                status: 'ยกเลิกรายการสั่งซื้อ' 
            },
            
        });

        res.json({ message : 'ยกเลิกรายการสั่งซื้อเรียบร้อย' , cancel });
    }catch(err){
        console.log(err);
        res.status(500).json({ message : 'server error' });
    }
}