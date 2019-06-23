const express=require('express')
require('./db/mongoose')

const user_router = require('./Routers/users')
const Task_router=require('./Routers/tasks')

const app=express()

// parse incoming requests  to JSON

app.use(express.json())

app.use(user_router)
app.use(Task_router)

module.exports=app
