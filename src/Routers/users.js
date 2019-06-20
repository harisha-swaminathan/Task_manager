const express=require('express')
const User=require('../models/users')
const router =new express.Router()
const multer=require('multer');
const auth=require('../middleware/auth')
const sharp= require('sharp')
const {welcomeMail, goodByeMail}=require('../email/account')


router.post('/users', async(req,res)=>{
    const user= new User(req.body)
    try{
        await user.save()
        welcomeMail(user.email,user.name)
        const token= await user.generateToken()
         res.status(201).send({user,token})
    }
    catch(error){
        
        res.status(400).send(error)
    }
})

router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
})

router.patch('/user/update',auth, async (req,res)=>{
    const updates= Object.keys(req.body)

    const allowedUpdates=['name', 'age', 'email', 'password']

    const validUpdate= updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
   
    if(!validUpdate)
        return res.status(400).send('Invalid update')
    
try{
    

    updates.forEach(update => {
        req.user[update]= req.body[update]
    });
    
    await req.user.save()

    res.send(req.user)
}catch(e){
    res.status(400).send()
}
})

router.delete('/user/Delete',auth, async(req,res)=>{
    try{
        await req.user.remove()
        goodByeMail(req.user.email,req.user.name)
        res.status(200).send(req.user)
    }catch(e){
       console.log(e)
        res.status(400).send()
    }
})

router.post('/user/login',async (req,res)=>{

    try{
        const user= await User.findByIdPassword(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({user, token})
    }catch(e){
        console.log(e)
        res.status(400).send()
    }

})

router.post('/users/logout',auth, async(req,res)=>{
    try{
        req.user.tokens= req.user.tokens.filter((token)=>{
            return token.token!==req.token

        })
        await req.user.save()
        res.send()
    }catch(e){
        
        res.status(500).send()
    }
})
router.post('/user/logoutAll',auth, async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})
const upload=multer({
    //dest:'avatar',
    limits:{
        fileSize:1000000
    },
    fileFilter(res,file,cb){
        if(!file.originalname.match(/\.png|jpeg|jpg/)){
            return cb(new Error('Please upload a Jpeg, Png or Jpg'))
        }
        cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer= await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({
        error:error.message
    })
})
router.delete('/Users/me/delete_avatar',auth,upload.single('avatar'),async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.status(200).send()
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)

        if(!user|| !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
      
        res.status(404).send()
    }
})
module.exports=router