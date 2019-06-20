const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const Task =require('./tasks')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0)
            throw new Error('Age cannot be negative')
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('Invalid email')
        } 
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.length<7)
                throw new Error('Password must contain 7 or more characters')
            else if(value.toLowerCase().includes('password'))
                throw new Error('Password cannot contain the work password')
        },

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
       
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON= function(){
    const user= this.toObject()

    delete user.password
    delete user.token
    delete user.avatar
    return user
}

userSchema.methods.generateToken= async function(){
    // const user=this
    // const token = jwt.sign({id:user.id.toString()},'something')
    
    const token = jwt.sign({id:this.id.toString()},process.env.JWT_SECRET)
    this.tokens=this.tokens.concat({token})
    await this.save()
    return token
}


//
userSchema.statics.findByIdPassword =async(email,password)=>{

    const user=await User.findOne({email})
    
    if(!user){
        throw new Error('Unable to login')
    }
    
    
    const isMatch= await bcrypt.compare(password,user.password)
    
    if(!isMatch)
        throw new Error('Unable to login')

    
    return user
}

// hash password before saving
userSchema.pre('save', async function(next){

    if(this.isModified('password')){

        this.password= await bcrypt.hash(this.password,8)
    }
    next()
})

// Remove user tasks when user is removed

userSchema.pre('remove', async function(next){
    await Task.deleteMany({owner:this._id})
    
    next()
})


const User=mongoose.model('User', userSchema)

// const me=new User({
//     name:'Harisha Swaminathan   ',
//     age:25,
//     email:'h@gmail.COm  ',
//     password:'qwerty1234'
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })

module.exports=User