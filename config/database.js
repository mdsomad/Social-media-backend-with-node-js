const mongoose = require('mongoose');



exports.connectDatabase = async(DATABASE_URL) => {


    try{
      
        const DB_OPTIONS = {
            dbName:"SocialMedia"    //* <-- Database Name 
        }

        
        mongoose.set('strictQuery', false);
        await mongoose.connect( DATABASE_URL, DB_OPTIONS,{    //* <-- Connect Database
            useNewUrlParser: true,
            useCreateIndex:true,
            useUnifiedTopology: true,
            useFindAndModify : false
        }).then(()=>{
            console.log("Connected Successfully...");
        });
          

    }catch(err){
      console.log("MongoDB Atlas Connection Failed:"+ err);
    }




     //! Not Use this code
    // mongoose.set('strictQuery', false);
    // mongoose.connect(process.env.DATABASE_URL).then((con)=> 
    //  console.log(`Database Connected:${con.connection.host}`)
    // ).catch((err)=> console.log(err));
    
    
}
