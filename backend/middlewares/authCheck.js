const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');


exports.authCheck = async (req, res , next) => {
    try{
        const headersToken = req.headers.authorization;
        if(!headersToken){
            return res.status(401).json({ message: 'No token, Authorization'});
        }

        const token = headersToken.split(" ")[1];
        const decode = jwt.verify(token, process.env.SECRET);

        req.user = decode;

        await prisma.user.findFirst({
            where:{
                email: req.user.email
            }
        })
        next();
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Token Invalid'});
    }
}

exports.adminCheck = async (req,res,next) => {
    try{
        const { email } = req.user;
        const adminUser = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(!adminUser || adminUser.role !== 'admin'){
            return res.status(403).json({ message: 'access denied: Admin only'});
        }

        next();

    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Admin access denied'});
    }
}