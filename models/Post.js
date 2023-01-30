const mongoose = require('mongoose');




//TODO Yah Hai Iski Mein define Karne Ka Tarika   ( define user Post schema)
const postSchema = new mongoose.Schema({            //* <-- Yah hai Database Obj & instance

    caption:String,

    image:{
      public_id:String,
      url:String
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

    createdAt:{
        type:Date,
        default:Date.now
    },

    likes: [
       
         {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
                 
         },

    ],




    comments:[

        
        { 
         
         user:{
 
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"   

         },
         comment:{
            type:String,
            required:true
         },
         commentdate:{ 
            type: Date, 
            default:Date.now
        },
     
      }
     ],
    
    
});

                     //*collection name Post
const postModel = mongoose.model("Post",postSchema);


module.exports = postModel