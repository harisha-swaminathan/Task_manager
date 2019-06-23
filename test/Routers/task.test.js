const request=require('supertest')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const app=require('../../src/app')
const Task=require('../../src/models/tasks')
const {user1Id, user1, beforeEachTest, user2Id, user2, task1, task2, task3} =require('../fixtures/db')

beforeEach(beforeEachTest)

test('Create task for user', async ()=>{
   const response= await request(app).post('/tasks')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        description:'Go sleep'
    })
    .expect(201)

    const task=await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    
})

test('Fetch tasks of a user', async ()=>{
    const response= await request(app).get('/tasks')
     .set('Authorization',`Bearer ${user1.tokens[0].token}`)
     .send()
     .expect(200)
 
     expect(response.body.length).toBe(1)
     
 })

 test('Unsuccessfully delete different users task',async ()=>{
    const response= await request(app).delete('/tasks/:id')
    .set('Authorization',`Bearer ${user2.tokens[0].token}`)
    .send({
        _id:task1._id
    })
    .expect(400)
    const task=await Task.findById(task1._id)
    expect(task).not.toBeNull()
 })