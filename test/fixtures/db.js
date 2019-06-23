const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=require('../../src/models/users')
const Task=require('../../src/models/tasks')
const user1Id=new mongoose.Types.ObjectId()
const user1={
    _id:user1Id,
    name:'Harisha',
    email:'h@gmail.com.com',
    password:'Qwerty1234!h',
    tokens:[{
        token: jwt.sign({_id:user1Id},process.env.JWT_SECRET)
    }]
}
const user2Id=new mongoose.Types.ObjectId()
const user2={
    _id:user2Id,
    name:'hswa',
    email:'hswa@gmail.com.com',
    password:'Qwerty1234!hswa',
    tokens:[{
        token: jwt.sign({_id:user2Id},process.env.JWT_SECRET)
    }]
}

const task1={
    _id:new mongoose. Types.ObjectId,
    description:'Finish resume',
    completed:false,
    owner:user1._id
}
const task2={
    _id:new mongoose. Types.ObjectId,
    description:'Get a job ',
    completed:true,
    owner:user2._id
}
const task3={
    _id:new mongoose. Types.ObjectId,
    description:'unblah ',
    completed:true,
    owner:user2._id
}

const beforeEachTest= async ()=>{
    await  User.deleteMany()
    await  Task.deleteMany()
    await new User(user1).save()
    await new User(user2).save()
    await new Task(task1).save()
    await new Task(task2).save()
    await new Task(task3).save()
}

module.exports={
    user1Id,
    user1,
    beforeEachTest,
    user2Id,
    user2,
    task1,
    task2,
    task3
}