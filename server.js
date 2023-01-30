const app = require("./app");
const  {connectDatabase}  = require("./config/database");






const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017"
const PORT = process.env.PORT || 3000

connectDatabase(DATABASE_URL);




app.listen(PORT,()=>{
    console.log(`Server Running at http://localhost:${PORT}`);
});
