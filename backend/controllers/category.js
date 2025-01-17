const prisma = require("../config/prisma");


exports.create = async (req, res) => {
    try{
        const { name } = req.body;
        const checkCategory = await prisma.category.findFirst({
            where:{
                name: name
            }
        });

        if(checkCategory){
            return res.status(400).json({ message: "ชื่อหมวดหมู่นี้มีอยู่แล้ว"});
        };
        await prisma.category.create({
            data: {
                name:name
            }
        });
        res.send({ message: "Create category successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Server Error"});
    }
}

exports.getAll = async (req,res) => {
    try{
        const category = await prisma.category.findMany();
        res.json(category);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server Error"});
    }
}

exports.editCategory = async (req,res) => {
    try{
        // ค้นหาหมวดหมู่ที่ต้องการแก้ไข
        const { id } = req.params;
        const cate = await prisma.category.findUnique({
            where:{
                id: Number(id)
            }
        });
        if(!cate){
            return res.status(404).json({ message: "ไม่มีหมวดหมู่นี้อยู่"});
        }

        // ตรวจสอบว่าถ้ามีการส่งค่าใหม่มาหรือไม่ ถ้าไม่มีให้ใช้ค่าเดิม
        const { name } = req.body;
        const updatedName = name || cate.name;
        

        // ตรวจสอบว่าชื่อหมวดหมู่ซ้ำหรือไม่
        const checkCategory = await prisma.category.findFirst({
            where:{
                id: { not : Number(id)},
                name: updatedName,
            }
        });
        if(checkCategory){
            return res.status(400).json({ message: "ชื่อหมวดหมู่นี้มีอยู่แล้ว" });

        };

        // แก้ไขหมวดหมู่
        await prisma.category.update({
            where:{
                id: Number(req.params.id)
            },
            data:{
                name: updatedName 
            }
        });
        res.send({ message: "Edit category successfully" });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server Error"});
    }
}

exports.remove = async (req,res) => {
    try{
        const { id } = req.params;

        // ตรวจสอบว่าหมวดหมู่ที่ต้องการลบมีอยู่หรือไม่
        const checkCategory = await prisma.category.findFirst({
            where:{
                id: Number(id)
            }
        });
        if(!checkCategory){
            return res.status(404).json({ message: "Category not found"})
        };

        // ลบหมวดหมู่
        await prisma.category.delete({
            where:{
                id: Number(id)
            }
        });
        res.send({ message: "Delete category successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server Error"});
    }
}