const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");


if(process.env.DATABASE_URL !== 'production'){
 require('dotenv').config({path:('config/config.env')})  //* <-- Yah Pagckage  (dotenv) .env file create karne ka option deta hai
}



//* Using Middlewares
app.use(fileUpload({useTempFiles:true}));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())



const post = require('./routes/post');  //* import post routes
const user = require("./routes/user");  //* import user routes



//* Using Routes
app.use("/api/v1", post )
app.use("/api/v1", user )




module.exports = app;

