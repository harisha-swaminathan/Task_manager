const express=require('express')
require('./db/mongoose')

const user_router = require('./Routers/users')
const Task_router=require('./Routers/tasks')

const app=express()
const port=process.env.PORT

// app.use((req,res,next)=>{

//     res.status(503).send("App is under maintainence. Please try again later")

// })

// parse incoming requests  to JSON

app.use(express.json())

app.use(user_router)
app.use(Task_router)

app.listen(port,()=>{
    console.log('Express Server')
})

