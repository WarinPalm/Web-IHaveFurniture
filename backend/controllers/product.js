const prisma = require('../config/prisma');
const fs = require('fs');
const { host , port } = require('../config/connectENV');


exports.create = async (req, res) => {
    try{
        const { name, description, price, stock, categoryId } = req.body;

        // ตรวจสอบว่าชื่อสินค้าซ้ำหรือไม่
        const checkName = await prisma.product.findFirst({
            where:{ 
                name:name,
                categoryId: parseInt(categoryId)
            } 
        });
        if(checkName){
           return res.status(400).json({ message: 'สินค้านี้มีอยู่แล้ว'});
        };

        const product = await prisma.product.create({
            data:{
                name:name,
                description: description,
                price:parseFloat(Math.abs(price)), // แปลงเป็นค่าบวกหากเป็นค่าลบ
                picture: req.file.filename, // เก็บชื่อไฟล์ภาพ
                stock:parseInt(Math.abs(stock)), // แปลงเป็นค่าบวกหากเป็นค่าลบ
                categoryId:parseInt(categoryId)
            }
        });
        res.json({product });

    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Server Error'});
    }
}

exports.getAll = async (req, res) => {
    try{
        const products = await prisma.product.findMany({
            include:{
                category: true
            },
        });

        // เพิ่มฟิลด์ fullPathImage ภายใน object ของแต่ละ product
        products.forEach((product) =>{
            // เพิ่ม fullPathImage เข้าไปภายใน object ของแต่ละ product 
            product.fullpath = `${host}${port}/uploads/` + product.picture
        });
 
        res.json({products});
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Server Error'});
    }
}

exports.update = async (req, res) => {
    try{
        
        // ค้นหาสินค้าที่ต้องการแก้ไข
        const product = await prisma.product.findUnique({
            where:{ id: Number(req.params.id)}
        });
        // ถ้าไม่พบสินค้า
        if(!product){
            return res.status(404).json({ message: 'Product not found'});
        };
        
        const { name, description, price, stock, categoryId } = {
            ...product,  // ค่าเดิม
            ...req.body // ค่าใหม่
        };

        // ตรวจสอบว่าชื่อสินค้าซ้ำหรือไม่
        const checkName = await prisma.product.findFirst({
            where:{ 
                AND:[
                    { id: { not: Number(req.params.id)} },
                    { name:name }, 
                    { categoryId: parseInt(categoryId) }
                ]
            } 
        });

        if(checkName){
           return res.status(400).json({ message: 'สินค้านี้มีอยู่แล้ว'});
        };
        
        let pictureFilename = product.picture; // ตั้งค่าภาพเป็นค่าปัจจุบัน
        

        if (req.file) {
            // ลบไฟล์ภาพเก่า (ถ้ามีอยู่)
            if(product.picture){
                fs.unlink(`uploads/${product.picture}`, (err) => {
                    if (err) console.log("not found image", err);
                });
            }
            pictureFilename = req.file.filename; // ตั้งค่าภาพเป็นไฟล์ใหม่
        };

        // อัพเดทข้อมูลสินค้า
        await prisma.product.update({
            where:{
                id: Number(req.params.id)
            },
            data:{
                name:name,
                description: description,
                price:parseFloat(Math.abs(price)), // แปลงเป็นค่าบวกหากเป็นค่าลบ
                picture: pictureFilename, // เก็บชื่อไฟล์ภาพ
                stock:parseInt(Math.abs(stock)), // แปลงเป็นค่าบวกหากเป็นค่าลบ
                categoryId:parseInt(categoryId)
            }
        });
        res.status(200).json({ message: 'Product updated successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Server Error'});
    }
}

exports.remove = async (req,res) => {
    try{
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where:{ id: Number(id)}
        })
        if(!product){
            return res.status(404).json({ message: 'Product not found'});
        }

        if(product.picture){
            fs.unlink(`uploads/${product.picture}`, (err) => {
                if (err) console.log("not found image", err);
            });
        }

        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        })
        res.send({ message: 'Product deleted successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Server Error'});
    }
}