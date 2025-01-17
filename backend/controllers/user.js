const prisma = require('../config/prisma');


exports.userData = async (req,res) => {
    try{
        const user = await prisma.user.findFirst({
            where:{ id: req.user.id },
            select: {
                fName: true,
                lName: true,
                email: true,
                password: true,
                telNo: true,
                address: true,
            }
        });
        res.send(user);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Server error'});
    }
}
exports.editProfile = async (req,res) => {
    try{
        const myuser = await prisma.user.findFirst({
            where:{ id: req.user.id }
        });

        

        const { fName , lName  , password , telNo , address } = {
            ...myuser,
            ...req.body
        };

        const user = await prisma.user.update({
            where:{ id: req.user.id },
            data: {
                fName: fName,
                lName: lName,
                password: password,
                telNo: telNo,
                address: address,
            }
        });
        res.send({user , message : 'Update success'});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Server error'});
    }
}

