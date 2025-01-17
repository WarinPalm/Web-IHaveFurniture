const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/connectENV').secret;

exports.register = async (req,res)=>{
    try{
        const { email, password } = req.body;

        // validate body
        if(!email){
            return res.status(400).json({message: 'Email is required!!!'})
        }else if (!password){
            return res.status(400).json({message: 'Password is required!!!'})
        }

        // check email in DB already?
        const user = await prisma.user.findFirst({
            where:{
                email: email 
            }
        })
        if (user){
            return res.status(400).json({message: 'Email is already exits!!!'})
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10)

        // Register
        await prisma.user.create({
            data:{
                email: email,
                password: hashPassword
            }
        })

        res.send('Register Success');
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Server Error'});
    }
}

exports.login = async (req,res) => {
    try{
        const { email, password } = req.body;

        // Check Email
        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(!user){
            return res.status(400).json({ message: 'User Not Found' })
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(400).json({ message: 'Password is not match'});
        }

        // Create payload สำหรับการเก็บข้อมูลไว้ใน token
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        // Create Token
        jwt.sign(payload, secret , {expiresIn: '1d'}, (err, token) => {
            if(err){
                return res.status(500).json({message: 'Server Error'})
            }
            res.json({payload, token})
        })

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Server Error'});
    }
}

exports.currentUser = async (req,res) => {
    try{
        const user = await prisma.user.findFirst({
            where: { email: req.user.email },
            select:{
                id: true,
                email: true,
                role: true
            }
        })
        res.json({ user })
    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Server Error'});
    }
}