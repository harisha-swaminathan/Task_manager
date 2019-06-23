const request=require('supertest')
const app=require('../../src/app')
const User=require('../../src/models/users')
const {user1Id, user1, beforeEachTest} =require('../fixtures/db')

beforeEach(beforeEachTest)

test('Signup a new user',async ()=>{
   const response= await request(app).post('/users').send({
        name:'Harisha',
        email:'h@h.com',
        password:'Qwerty1234!h'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
})

test('Login user',async ()=>{
    const response=  await request(app).post('/user/login').send({
        email:user1.email,
        password:user1.password
    }).expect(200)
    const user = await User.findById(user1Id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Login fail for user with wrong credentials',async ()=>{
    await request(app).post('/user/login')
    .send({
        email:user1.email,
        password:'wrongpassword'
    }).expect(400)
})

test('Get user profile', async ()=>{
    await request(app).get('/users/me')
       .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Error for user profile w/o auth', async ()=>{
    await request(app).get('/users/me')
   
    .send()
    .expect(401)
})

test('Delete user account successfully', async ()=>{
  await request(app).delete('/user/Delete')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    const user=await User.findById(user1Id)
    expect(user).toBeNull()
})

test(' Unsuccesfull Delete w/o authrization', async ()=>{
    await request(app).delete('/user/Delete')
    .send()
    .expect(401)
})

test('Add user profile picture', async()=>{
    await request(app).post('/users/me/avatar')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .attach('avatar','test/fixtures/robot.jpg')
    .expect(200)
    const user=await User.findById(user1Id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Accept valid updates', async ()=>{
    await request(app).patch('/user/update')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        age:5
    })
    .expect(200)
    const user=await User.findById(user1Id)
    expect(user.age).toBe(5)
})

test('Reject invalid updates', async ()=>{
    await request(app).patch('/user/update')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        location:'90nnkd '
    })
    .expect(400)
    
})