const jwt=require('jsonwebtoken')
const User=require('../models/users')

const auth= async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer','').trim()
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user= await User.findOne({_id:decoded.id,'tokens.token':token})
        
        if(!user){
            throw new Error('No user')
        }
        req.token=token
        req.user=user
        next()
    }catch(e){
        res.send('Please aunthenticate')
    }
}

module.exports=auth