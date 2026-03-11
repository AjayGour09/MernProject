import mongoose from 'mongoose';
import bcrypt, { genSalt } from 'bcryptjs'

const adminSchema=new mongoose.Schema(
    {
    name:{
         type:String,
        required:true,
        trim:true,
        default:admin,
    },email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    },
    {timestamps:true}
   
)

adminSchema.pre("save",async function(next) {
    try {
        if(!this.isModified("password")) return next();
        const salt = await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(e);
    }
    
})

adminSchema.methods.comparePassword = async function(plainPassword){
    return bcrypt.compare(plainPassword,this.password)
}

export default mongoose.model("Admin",adminSchema)