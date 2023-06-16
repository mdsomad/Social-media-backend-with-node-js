const mongoose = require('mongoose');
const colors = require('colors');



exports.connectDatabase = async() => {


    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        console.log(
          `Conneted To Mongodb Databse Successfully... ${conn.connection.host}`.bgMagenta.white
        );
      } catch (error) {
        console.log(`Connection Errro in Mongodb ${error}`.bgRed.red);
      }

    



     //! Not Use this code
    // mongoose.set('strictQuery', false);
    // mongoose.connect(process.env.DATABASE_URL).then((con)=> 
    //  console.log(`Database Connected:${con.connection.host}`)
    // ).catch((err)=> console.log(err));
    
    
}
