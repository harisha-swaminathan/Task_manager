const express=require('express')
const Task=require('../models/tasks')
const auth=require ('../middleware/auth')
const router =new express.Router()

router.post('/tasks',auth,async(req,res)=>{
    const task= new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(error)
    }
    
})

router.get('/tasks',auth, async (req,res)=>{
    const match={}
    const sort={}

    if(req.query.completed){
        match.completed=req.query.completed==='true'
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]= parts[1]==='desc'?-1:1
    }
    try{
       // const task =await Task.find({owner:req.user._id})
       await req.user.populate({
           path:'tasks',
           match,
           options:{
               limit: parseInt(req.query.limit),
               skip:parseInt(req.query.skip),
               sort
           }
       }).execPopulate()

        res.send(req.user.tasks)
        
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
   
})

router.get('/tasks/:id',auth, async (req,res)=>{

    const id=req.params.id
    try{    
        const task=await Task.findOne({_id:id,owner:req.user._id})
        //const task= await Task.findById(id)
        if(!task)
            return res.status(404).send()
        res.status(201).send(task)
    }catch(e){
        res.status(500).send()
    }
   
})

router.patch('/tasks/:id',auth, async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed']

    const isValid=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValid)
        return res.status(400).send('Invalid update')
    try{  
        const task= await Task.findOne({_id:req.params.id, owner:req.user._id})  
        
        
        if(!task)
            return res.status(404).send()
        updates.forEach((update)=>{
             task[update]=req.body[update]
         })
        await task.save()
        res.status(200).send(task)
    }catch(e){
        console.log(e)
        res.status(400).send()
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})
       
        if(!task)
            return res.status(404).send('No task with given id found to delete')

        res.status(200).send(task)
        
    }catch(e){
        console.log(e)
        res.status(400).send()
    }
})

module.exports=router