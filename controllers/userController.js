const User = require("../models/userSchema");
const postSchema = require("../models/Post");
const jwt = require("jsonwebtoken");    //* <-- Yah Package Toket GenerateT karta hai 
const {sendEmail} = require("../middlewares/sendEmail");  
const crypto = require("crypto");
const cloudinary = require('cloudinary').v2;








//TODO Register function Create
exports.register = async (req,resp)=>{

  try {
    
    const {name,email,password} = req.body




    let user = await User.findOne({email});  //* <-- User Find

    if(user){
      return resp.
      status(400).json({ status:false, message:"User already exists"})
    }
   

   

    user = await User.create(      //* <-- User Register & Craete
      {
        name,
        email,
        password,
        avater:{public_id:"sample_id",
        url:""
      }})
    
    //! Not use this generateToken() function
    // const token = await user.generateToken();  //* <-- Call generateToken() Function    (Function define this directory controller/userController.js )

    //* generate JWT token     user _id           SECRET_KEY
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY);
 
    const options = {    //* <-- cookie  expires date
       expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
       httpOnly: true 
      }
    
                                    
    resp.status(201).cookie("token",token,options).json({status:true, message:"Register Successfully",token:token})
    
  } catch (error) {
    resp.status(500).json({ status:false, message:`Server Error ${error.message}`})
  }

  
} 










//TODO login function Create
exports.login = async (req,resp)=>{

  try {
    
    const {email,password} = req.body


    const user = await User.findOne({email}).select("+password");  //* Find User
     
    if(!user){
      return resp.status(400).json({ status:false, message:"User does not exist"})
    }
    


    const isMatch = await user.matchPassword(password);    //* <-- Call matchPassword() Function    (Function define this directory --> controller/userController.js )


     
    if(!isMatch){
     return resp.json({status:false, message:"Incorrect password"})
    }
    

     //! Not use this generateToken() function
    // const token = await user.generateToken();     //* <-- Call generateToken() Function    (Function define this directory --> controller/userController.js )
    

     //* generate JWT token     user _id           SECRET_KEY
     const token = jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY);
 

    const options = {
       expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
       httpOnly: true 
      }
    

    resp.status(200).cookie("token",token,options).json({status:true,message:"Login Successfully",token:token,userId:user._id})
    
  } catch (error) {
    resp.status(500).json({ status:false, message:`Server Error ${error.message}`})
  }
  
  
}












//TODO logout function Create
exports.logout = async (req,resp)=>{

  try {
                                           
    resp.status(200).cookie("token",null,{expires: new Date(Date.now()),httpOnly:true}).json({
      status:true,message:"Logged out"
    })
    
    
    
    
  } catch (error) {

    resp.status(500).json({ status:false, message:`Server Error ${error.message}`})
    
  }
  
  
  
}















//TODO followUser & UnfollowUser function Create
exports.followUser = async (req,resp)=>{

  try {
    
     const userToFollow = await User.findById(req.params.id);  //* <-- userToFollow find user (loggedInUser provide _id)
     const loggedInUser = await User.findById(req.user._id);   //* <-- loggedInUser Find token base id
 
    
    
    
    if(!userToFollow){
      return resp.status(404).json({ success:false, message: "User not found "})
    }


  if(loggedInUser.following.includes(userToFollow._id)){

     const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);  //* <-- get userToFollow _id index
     const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);  //* <-- get loggedInUser _id index 


     loggedInUser.following.splice(indexfollowing,1);  //* <-- loggedInUser following arrey userToFollow _id Remove _id
     userToFollow.followers.splice(indexfollowers,1);  //* <-- userToFollow followers arrey loggedInUser _id Remove _id


     await loggedInUser.save() //* then save
     await userToFollow.save() //* then save
     
    //  resp.status(200).json({ status:true, message:"User Unfollowed",userToFollow})
    resp.status(200).json({ success:true,userToFollow})
     
  }else{

     
    loggedInUser.following.push(userToFollow._id); //* loggedInUser following arrey userToFollow _id add & push
    userToFollow.followers.push(loggedInUser._id); //* userToFollow followers arrey loggedInUser _id add & push 
     
    await loggedInUser.save(); //* then save
    await userToFollow.save(); //* then save

    console.log(loggedInUser)
    console.log(userToFollow)
    
    // resp.status(200).json({ status:true, message:"User followed",userToFollow})
    resp.status(200).json({ success:true,userToFollow})
    
  }
    
    

   
    
  } catch (error) {
    resp.status(500).json({ success:false, message:`Server Error ${error.message}`})
  }

  
  }
  




//TODO Create FetchAllFollowersById Function  
exports.FetchAllFollowersById = async (req,resp)=>{
  try {

    const post = await User.findById(req.params.id).populate("followers");
     let followers = post.followers.reverse();
     resp.status(200).json({success:true, followers})
    
  } catch (error) {
    resp.status(500).json({ success:false, message:`Server Error : ${error.message}`})
  }
}






//TODO Create FetchAllFollowingById Function  
exports.FetchAllFollowingById = async (req,resp)=>{
  try {

    const post = await User.findById(req.params.id).populate("following");
     let following = post.following.reverse();
     resp.status(200).json({success:true, following})
    
  } catch (error) {
    resp.status(500).json({ success:false, message:`Server Error : ${error.message}`})
  }
}






 //TODO Change Passowrd function Create
  exports.changePassowrd = async (req,resp)=>{
    
    try {

       const user = await User.findById(req.user._id).select("+password");  //* Find loggedInUser User
        

       const {oldPassword,newPassword} = req.body



       if(!oldPassword || !newPassword){
        return resp.status(400).json({success:false, message: "Please provide old and new password"})
       }
       
        
       const isMatch = await user.matchPassword(oldPassword);  //* <-- Call matchPassword() Function    (Function define this directory controller/userController.js )

       if(!isMatch){
        return resp.json({success:false, message: "Incorrect Old Password"})
       }


       user.password = newPassword;  //* Update newPassword

       await user.save();  //* <-- then save
       
       resp.status(200).json({success:true, message: "Password successfully update"})
      
    } catch (error) {
      resp.status(500).json({ success:false, message:`Server Error ${error.message}`})
    }
  }













 //TODO updateProfile function Create
  exports.updateProfile = async (req,resp)=>{

    try {

      //  const user = await User.findById(req.user._id);  //* <--Find loggedInUser

      //  const {name,email} = req.body
      
      //  if(name){
      //    user.name = name;  //* <-- Name Update
      //  }

      //  if(email){

      //   const checkEmail = await User.findOne({email}); //* Find User Provide Email

      //   if(checkEmail){
      //     return resp.status(400).json({ success:false, message:"Email id already exists"})
      //   }
      //    user.email = email;  //* <-- Email Update 
      //  }

    

      //  //TODO User Avatar:TODO
        
      
      //  await user.save();
      //  resp.status(200).json({success:true, message: "Profile Updated"})





      const updateData = req.body;

      const user = await User.findById(req.user._id);

      console.log(user.email);
      console.log(updateData.email);


      let updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        updateData,
        { new: true }
      );

        if(!updatedUser) {
            throw "user not found!";
        }

      return resp.json({success: true, user: updatedUser});
      



      

     
      
      
      
    } catch (error) {

        //* Mongoose duplicate key error
      if (error.code === 11000) {
        return resp.json({ success:false, message:`Email already exists`})
      }
      
         resp.status(500).json({ success:false, message:`Server Error ${message}`})
    }
  }








  

 //TODO updateAvaterProfile function Create
  exports.updateAvaterProfile = async (req,resp)=>{


    const file =  req.files.avater;   //* Use cloudinary Image upload

        cloudinary.uploader.upload(file.tempFilePath,
          {folder: 'UserProfileImages'},
          async(error,result)=>{
           

            try {
              
              const user = await User.findById(req.user._id);  //* <--Find loggedInUse

                // const imageUrl = user.avater.url;    //* <-- url sa image ka name find code
                // const urlArray = imageUrl.split('/');
                // const image = urlArray[urlArray.length -1];
                // const imageName = image.split('.')[0]

  
              
              if(user.avater.url === "" || user.avater.url === null){

                console.log("Database main Url Nahi hai");

                user.avater.public_id = result.public_id
                user.avater.url = result.url

                await user.save();

                return resp.status(200).json({success:true, message: "Profile pic set",user})
                 
              }else{

                

                console.log(`Database Mine Url hai --> ${imageName}`);
                
                user.avater.public_id = result.public_id
                user.avater.url = result.url

                await user.save();

                // cloudinary.uploader.destroy(imageName,(error,result)=>{    //* <-- cloudinary Delete image
                //   console.log(error,result);
                // })

                await cloudinary.uploader.destroy(user.avater.public_id);

                return resp.status(200).json({success:true, message: "Profile pic Update",user})

              }

              //TODO User Avatar:TODO
              
             
           } catch (error) {
              resp.status(500).json({ success:false, message:`Server Error : ${error.message}`})
           }
            
            
          }) 
    
    

    
  }
  
  
















//TODO User Delete Profile function create
exports.deleteMyProfile = async (req,resp)=>{

  try {

    const user = await User.findById(req.user._id);
    const posts = user.posts;          //* <-- Store User post array element        ( UserProfile delete hone se pahle Store element)
    const followers = user.followers   //* <-- Store User followers array element   ( UserProfile delete hone se pahle Store element)
    const following = user.following   //* <-- Store User following array element   ( UserProfile delete hone se pahle Store element)
    const userId = user._id            //* <-- Store User userId array element      ( UserProfile delete hone se pahle Store element)



      //! Not Use
      // const imageUrl = user.avater.url;            //* <-- User Profile pic url store 
      // const urlArray = imageUrl.split('/');        //* <-- url / remove this line
      // const image = urlArray[urlArray.length -1]; 
      // const imageName = image.split('.')[0]        //* <-- User Profile pic url sa image ka name find code 
    

      user.deleteOne()    //* <-- User Remove 

     //! Not Use
    //* Check image available
    // if(imageName !== ""){  
    //   cloudinary.uploader.destroy(imageName,(error,result)=>{    //* <-- cloudinary sa Delete profile pic code
    //     console.log(error,result);
    //   });

    // }


    await cloudinary.uploader.destroy(user.avater.public_id);




    //* Logout user after deleting profile
    resp.cookie("token",null,{
      expires: new Date(Date.now()),
      httpOnly:true
    })
    


    //! Rhis Method Not use
     //* delete all posts of the user 
    //  for (let i = 0; i < posts.length; i++) {

    //   const post = await postSchema.findById(posts[i]);

    //   const imageUrl = post.image.url;             //* <-- User Post url store 
    //   const urlArray = imageUrl.split('/');        //* <-- url / remove and convert array
    //   const image = urlArray[urlArray.length -1];
    //   const imageName = image.split('.')[0]        //* <-- User Post remove .then name find code 
      
      
    //   await post.remove()
        
    //    cloudinary.uploader.destroy(imageName,(error,result)=>{    //* <-- cloudinary Delete All Post Images
    //      console.log(error,result);
    //    })
      
    //}
    
    
    
    
   

    //* delete all posts of the user 
    for (let i = 0; i < posts.length; i++) {

      const post = await postSchema.findById(posts[i]);
  
      
      await post.deleteOne()
        
      await cloudinary.uploader.destroy(post.images.public_id);
      
    }
    



    //* Removing User from Followers Following
    for (let i = 0; i < followers.length; i++) {
      const follower = await User.findById(followers[i]);  //* Find
      const index = follower.followers.indexOf(userId);
      follower.followers.splice(index,1);
      await follower.save()
    }
    



    //* Removing User from following's Followers
    for (let i = 0; i < following.length; i++) {
      const follows = await User.findById(following[i]);
      const index = follows.followers.indexOf(userId);
      follows.following.splice(index,1);
      await follows.save()
    }


    
    resp.status(200).json({ success:true, message:"Profile deleted"});


    
  } catch (error) {
    resp.status(500).json({ status:false, message:`Server Error ${error.message}`})
  }
  
  
}












//TODO myProfile function Create
exports.myProfile = async (req,resp) => {
   try {

      const user = await User.findById(req.user._id);  //* <-- Find loggedInUser

      resp.status(200).json({ 
        success:true,
         user,
        })
    
      
   } catch (error) {
     resp.status(500).json({ status:false, message:`Server Error ${error.message}`})
   }
}











//TODO getUserProfile function Create
exports.getUserProfile = async (req,resp) => {
   try {


    const user = await User.findById(req.params._id);

      if(!user){
        return resp.status(404).json({success:false, message:"User not found"})  
      }

      resp.status(200).json({ 
        success:true,
         user,
        })
    
      
   } catch (error) {
     resp.status(500).json({ success:false, message:`Server Error ${error.message}`})
   }
}













//TODO getAllUsers function Create
exports.getAllUsers = async (req,resp) => {
   try {
    
    const {name} = req.query;
      // const users = await User.find({}).populate("posts").populate("following") //* <-- Find All Users

      const queryObject = {};

      if(name){
        queryObject.name = {$regex:name, $options: "i"};
      }

      const users = await User.find(queryObject);
     

     

      resp.status(200).json({ success:true, users,})
    
      
   } catch (error) {
    resp.status(500).json({ success:false, message:`Server Error : ${error.message}`})
   }
}













//TODO Create Forgot Password Function
exports.forgotPassword = async (req,resp)=>{

  try {

    const user = await User.findOne({email:req.body.email});

    if(!user){
       return resp.status(404).json({ success:false, message:"Email does not exist"})
    }

  //* receive Normal GenerateResetToken     ( yah function to kar return karta hai )
    const resetPasswordToken = user.getResetPasswordToken();    //* <-- Call getResetPasswordToken() Function    (Function define this directory controller/userController.js ) 

    await user.save();


   const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`;

   const message = `Reset Your Password by clicking on the link below:\n\n ${resetUrl}`;


   try {

    await sendEmail({        //* <-- sendEmail (Function define this directory this --> middlewares/sendEmail.js ) 
      email:user.email,
      subject:"Reset Password",
      message
      
    })

    resp.status(200).json({ success:true, message:`Email send to ${user.email}`})
    
    
   } catch (error) {
     user.resetPasswordToken = undefined
     user.resetPasswordExpire = undefined
     await user.save();
       
     resp.status(500).json({ success:false, message:`Server Error : ${error.message}`})
     
     
   }
    
    
  } catch (error) {
    resp.status(500).json({ success:false, message:`Server Error : ${error.message}`})
  }
  
  
}








//TODO Create Reset Password Function
exports.resetPassword = async(req,resp)=>{

  try {

    const resetPasswordToken = crypto.
    createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({      //* <-- Find User resetPasswordToken
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
  
    if(!user){
       return resp.status(401).json({ success:false, message:"Token is invalid or has expired"})
    }
  

    user.password = req.body.password;
    
    user.resetPasswordToken = undefined;  //* <-- Database sa Existing resetPasswordToken undefined & Remove
    user.resetPasswordExpire = undefined  //* <-- Database sa Existing resetPasswordExpire undefined & Remove
  
    await user.save()   //* <-- Then Save
    
    resp.status(200).json({ success:true, message:`Password Reset Successfully`})
    
    
    
    
  } catch (error) {
     resp.status(500).json({ success:false, message:`Server Error this : ${error.message}`})
  }
  
 
}