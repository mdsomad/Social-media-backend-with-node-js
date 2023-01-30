const mongoose = require('mongoose');
const bcrypt = require("bcrypt");       //* <-- Yah Package Password hash karta hai    
const jwt = require("jsonwebtoken");    //* <-- Yah Package Toket GenerateT karta hai    
const crypto = require("crypto");





//TODO Yah Hai Iski Mein define Karne Ka Tarika       ( define User schema)
const userSchema = new mongoose.Schema({            //* <-- Yah hai Database Obj & instance

    name:{
        type:String, 
        required:[true,"Please enter a name"],
    },


    avater:{
         public_id: String,
         url:String    
      },


    email:{
        type:String, 
        required:[true,"Please enter a email"],
        unique:[true,"Email already exists"]
    },


    password:{
        type:String, 
        required:[true,"Please enter a password"],
        minlength:[6,"Password must be at least 6 characters"],
        select:false,
    },
     

   
     posts:[
       {  
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post" 
       }
     ],
    


     followers:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"  
        }
    ],


     following:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"  
        }
    ],
    
    userverify:{
       type:Boolean,
       default:false
    },
    
    createdAt:{ 
        type: Date, 
        default:Date.now
    },
    

    resetPasswordToken:String,
    resetPasswordExpire:Date,

});






//TODO yah userSchema.Pre function user Save Hone Se Pahle ran Hota Hai
userSchema.pre("save",async function(next){
    if(this.isModified("password")){     //* <-- Password Modified hai Tu Hi yah condition chalega Nahin To Nahin chalega
       this.password = await bcrypt.hash(this.password,10)  //* <-- User Save Hone Se Pahle Password hash this code
    }
    next()
});





//TODO Create password compare & match Function 
userSchema.methods.matchPassword = async function(password){
   return await bcrypt.compare(password,this.password);
};




//TODO Create GenerateToken Function 
userSchema.methods.generateToken = function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET_KEY)
} 





//TODO Create getResetPasswordToken Functon
userSchema.methods.getResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(20).toString("hex");   //* Generate Reset Token

    console.log(resetToken);
         
         //* High Hashing then save database
    this.resetPasswordToken = crypto.
    createHash("sha256")
    .update(resetToken)  //* <-- resetToken Use & call
    .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    
    return resetToken;  //* <-- Normal Generate Reset Token return
  
}




 

                        //*collection name User
const userModel = mongoose.model("User",userSchema);



module.exports = userModel