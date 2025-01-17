const prisma = require('../config/prisma');
const { host , port } = require('../config/connectENV');


exports.addItemToCart = async (req, res) => {
    try{
        const { productId , quantity } = req.body;

        // ตรวจสอบ quantity ว่ามีค่าน้อยกว่า 0 หรือไม่
        if(quantity <= 0){
            return res.status(400).json({ message: 'จำนวนสินค้าต้องมากกว่า 0' });
        };

        // ดูว่า user ที่ login อยู่ในขณะนี้เป็นใคร
        const userData = await prisma.user.findFirst({
            where: { id: Number(req.user.id) }
        });
        
        // ดึงข้อมูลราคาสินค้า
        const productPrice = await prisma.product.findUnique({
            where: { id: Number(productId)},
        });

        // ตรวจสอบว่า user มี order ที่ status อยู่ในตะกร้าหรือไม่
        let order = await prisma.order.findFirst({
            where: { 
                userById: Number(userData.id),
                status : 'อยู่ในตะกร้า'
            }
        });

        // ถ้าไม่มี order ให้สร้าง order ใหม่
        if(!order){
            order = await prisma.order.create({
                data:{
                    userById : Number(userData.id),
                    netPrice: 0,
                    status : 'อยู่ในตะกร้า'
                }
            });
        };

        // ตรวจสอบว่าสินค้าที่เพิ่มลงในตะกร้ามีอยู่แล้วหรือไม่
        const checkCartItem = await prisma.cartitem.findMany({
            where:{
                userById: userData.id,
                status: 'อยู่ในตะกร้า'
            }
        });

        const checkProductInCart = checkCartItem.find((item) => item.prodId === parseInt(productId));
        
        // ตรวจสอบว่าสินค้ามีจำนวนพอหรือไม่
        const checkItem = await prisma.cartitem.findFirst({
            where: {
                userById: userData.id,
                prodId: parseInt(productId),
                status: 'อยู่ในตะกร้า'
            }
        });
        
        // ตรวจสอบว่ามีสินค้าอยู่ในตะกร้าหรือไม่
        if (checkItem) {
            // ตรวจสอบจำนวนสินค้า
            if (checkItem.quantity > productPrice.stock || 
                (checkItem.quantity + quantity > productPrice.stock) || 
                quantity > productPrice.stock) {
                return res.status(400).json({ 
                    message: 'สินค้ามีจำนวนไม่พอ'
                });
            }
        } else {
            // ตรวจสอบกรณีไม่มีสินค้าในตะกร้า
            if (quantity > productPrice.stock) {
                return res.status(400).json({ 
                    message: 'สินค้ามีจำนวนไม่พอ'
                });
            }
        };

        let item;

        // ถ้ามีสินค้าอยู่ในตะกร้าแล้วให้เพิ่มจำนวนสินค้า ถ้าไม่มีให้เพิ่มสินค้าใหม่ในตะกร้า
        if(checkProductInCart){
            item = await prisma.cartitem.update({
                where: { id : checkProductInCart.id},
                data: {
                    quantity: checkProductInCart.quantity + parseInt(quantity),
                    totalPrice: parseFloat((checkProductInCart.quantity + parseInt(quantity)) * productPrice.price)
                }
            });
        }else{
            
            item = await prisma.cartitem.create({
                data:{
                    prodId : parseInt(productId),
                    quantity : parseInt(quantity),
                    totalPrice : parseFloat(quantity * productPrice.price),
                    status: 'อยู่ในตะกร้า',
                    orderId: order.id,
                    userById: userData.id
                }
            });
        };
       
        // ดึงข้อมูลราคาสินค้าที่อยู่ในตะกร้า
        const listCartItem = await prisma.cartitem.findMany({
            where:{
                userById: userData.id,
                status: 'อยู่ในตะกร้า'
            },
            select: { totalPrice: true }
        });

        // คำนวนราคาสินค้าที่อยู่ในตะกร้า โดยเช็คว่ามีสินค้าอยู่ในตะกร้าหรือไม่ ถ้ามีให้คำนวนราคาสินค้าทั้งหมด ถ้าไม่มีให้เป็น 0
        let cartTotal = listCartItem.length > 0 ? listCartItem.map(item => item.totalPrice).reduce((sum, price) => sum + price, 0): 0;

        // อัพเดทราคาสินค้ารวมสุทธิที่อยู่ในตะกร้า
        order = await prisma.order.update({
            where: { id: order.id},
            data: { netPrice: parseFloat(cartTotal)}
        });

        res.json({item , message: 'เพิ่มสินค้าลงในตะกร้าสำเร็จ'});

    }catch(err){
        console.log(err);
        res.status(500).json({message: 'server error'});
    };
}

exports.listItemCart = async (req,res) => {
    try{
        // ลิสรายการสินค้าในตะกร้าทั้งหมดของผู้ใช้
        const cart = await prisma.cartitem.findMany({
            where: { userById: Number(req.user.id) , status: 'อยู่ในตะกร้า'},
            include: {
                product: {
                    select: {
                        name: true,
                        description: true,
                        price: true,
                        picture: true 
                    }
                }
            }
        });

        if(cart.length <= 0){
            return res.status(400).json({message: 'ไม่มีสินค้าในตะกร้าของคุณ'});
        };

        // เพิ่ม fullPathImage ให้กับสินค้าแต่ละรายการ
        const cartWithImages = cart.map(item => ({
            ...item,
            product: {
                ...item.product,
                fullPathImage: `${host}${port}/uploads/${item.product.picture}`
            }
        }));

        res.json({cart : cartWithImages});
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'server error'});
    }
}

exports.removeItemCart = async (req,res) => {
    try{
        const { id } = req.params;
        
        // ค้นหาสินค้าในตะกร้าที่ต้องการลบ
        const findItem = await prisma.cartitem.findFirst({
            where: { id: Number(id) , userById: Number(req.user.id)}
        });
        if(!findItem){
            return res.status(404).json({ message : 'ไม่มีสินค้าชิ้นนี้ในตะกร้าของคุณ' });
        };

        // ลบสินค้าออกจากตะกร้า
        await prisma.cartitem.delete({
            where: { id: Number(id)}
        });

        // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
        const countItem = await prisma.cartitem.findFirst({
            where: { userById: Number(req.user.id) , status: 'อยู่ในตะกร้า'}
        });

        // ถ้าไม่มีสินค้าในตะกร้าให้ลบ order ที่อยู่ในตะกร้า
        if (!countItem) {
            // ค้นหาหมายเลข order ของผู้ใช้
            const order = await prisma.order.findFirst({
                where: { userById: Number(req.user.id), status: 'อยู่ในตะกร้า' }
            });
        
            // ถ้ามี order ที่ตรงกับเงื่อนไข
            if (order) {
                // เซ็ตเป็นค่าเริ่มต้น
                // await prisma.order.update({
                //     where: { id: order.id },  // ใช้ id ของ order ที่ค้นพบ
                //     data: { netPrice: 0 }      // อัพเดท netPrice เป็น 0
                // });

                // ลบ order ที่อยู่ในตะกร้า
                await prisma.order.delete({
                    where: { id: order.id, status: 'อยู่ในตะกร้า' }
                });
            };
        };

        res.json({message: 'ลบสินค้าออกจากตะกร้าสำเร็จ' });
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'server error'});
    }
}

exports.submitCart = async (req,res) => {
    try{
        // เช็คข้อมูลส่วนตัวว่ากรอกครบถ้วนหรือไม่ ก่อนที่จะสั่งซื้อ
        const checkUser = await prisma.user.findFirst({
            where: { id: Number(req.user.id) }
        });
        if(checkUser.address == null || checkUser.fName == null || checkUser.lName == null || checkUser.telNo == null){
            return res.status(400).json({message: 'ยังไม่ได้กรอกข้อมูลส่วนตัวครบถ้วน'});
        };

        //  Get user cart
        const userCart = await prisma.cartitem.findMany({
            where: { userById: Number(req.user.id) , status: 'อยู่ในตะกร้า'},
            include:{ product: true }
        });
        // check count of product
        if(!userCart || userCart.length <= 0){
            return res.status(400).json({message: 'ไม่มีสินค้าในตะกร้าของคุณ'});
        };

        // ตรวจสอบ quantity สินค้าในตะกร้าหมดสต็อกหมดหรือยัง
        for(const item of userCart){
            const prod = await prisma.product.findFirst({
                where: { id: item.prodId },
                select: { stock: true , name: true }
            });

            // check stock
            if(!prod || item.quantity > prod.stock){
                return res.status(400).json({ message: `ขออภัยสินค้า ${prod?.name || prod} หมด` })
            };
        };


        await prisma.cartitem.updateMany({
            where: { userById: Number(req.user.id), status: 'อยู่ในตะกร้า' },
            data: { status: 'สั่งซื้อสำเร็จ' }
        });

        // Update order status 
        // ใช้ updateMany เนื่องจากไม่มีการเช็ค where ที่ไอดีของ order จึงต้องใช้ updateMany เพื่อเลือก order ทั้งหมดที่ตรงกับเงื่อนไขของ where
        await prisma.order.updateMany({
            where: { userById: Number(req.user.id), status: 'อยู่ในตะกร้า' },
            data: { 
                status: 'รอการชำระเงิน' ,
                buyDate: new Date().toISOString(), // toISOString() ใช้เพื่อเปลี่ยนวันที่ให้อยู่ในรูปแบบของ ISO YYYY-MM-DDTHH:mm:ss.sssZ
            }
        });

        // Update product stock and sold 
        // ใช้ Promise.all เพื่อทำการรอให้ทุกๆ product ทำการ update สำเร็จ
        await Promise.all(userCart.map(async (item) => {
            // ตรวจสอบว่ามี product หรือไม่
            if (!item.product?.id) {
                return res.status(404).json({ message: "ไม่มีสินค้านี้ในตะกร้า" });
            };
            
            // อัพเดทจำนวนสินค้าที่ขายไปและจำนวนสินค้าที่เหลือ
            await prisma.product.update({
                where: {
                    id: item.product.id
                },
                data: {
                    stock: {
                        decrement: item.quantity  // ลดจำนวนสินค้าที่เหลือ
                    },
                    sold: {
                        increment: item.quantity // เพิ่มจำนวนสินค้าที่ขายไป
                    }
                }
            });
        }));
        
        res.json({ message: 'สั่งซื้อสำเร็จ' });

    }catch(err){
        console.log(err);
        res.status(500).json({message: 'server error'});
    }
}