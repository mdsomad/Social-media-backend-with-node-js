const Post = require("../models/Post");
const User = require("../models/userSchema");
const cloudinary = require('cloudinary').v2;








//TODO Craete Post function
exports.createPost = async(req,resp) => {

 
  const file = req.files.photo;   //* Use cloudinary Image upload
  cloudinary.uploader.upload(file.tempFilePath,
   //!  {folder: 'PostImages'},   // not use Wajah Hai file delete nahi hota folder ka
    async(error,result)=>{

  //! console.log(result);

      try {

        const newPostData = {
            caption:req.body.caption,
            image:{
                public_id:"req.body.public_id",
                url:result.url
            },
            owner:req.user._id
        };

        const post = await  Post.create(newPostData);      //* <-- Post Craete
  
        const user = await User.findById(req.user._id);    //* <-- Find created post user

        user.posts.push(post._id);                         //* <-- User posts arrey add & push post _id

        await user.save()
        

        resp.status(201).json({status: true,post:`Post Created Successfully ${post}`});
        
        
        
    } catch (error) {
       resp.status(500).json({ status:false, message:`Server Error ${error.message}`})
    }
      
      
  })
  
    
    
    
    
}








//TODO Post Delete function create
exports.deletePost = async (req,resp)=>{

    try {


     const post = await Post.findById(req.params.id);
      

     if(!post){
        return resp.status(404).json({ status:false, message: "Post not found "})
      }
        
      if(post.owner.toString() !== req.user._id.toString()){

        return resp.status(404).json({status:false, message: "User Unauthorized"})
        
      }


        
      
       const imageUrl = post.image.url;    //* <-- url sa image ka name find code
       const urlArray = imageUrl.split('/');
       const image = urlArray[urlArray.length -1];
       const imageName = image.split('.')[0]

      //! console.log(imageName);


        await post.remove();
   

        cloudinary.uploader.destroy(imageName,(error,result)=>{    //* <-- cloudinary Delete image
          console.log(error,result);
        })
       
        
        const user = await User.findById(req.user._id);   //* Find isAuth User id 
    
        const index = user.posts.indexOf(req.params.id);  //*  User Posts in array find post RemoveIndex 
    
        user.posts.splice(index,1);    //* <-- Post id Remove User Array
    
        await user.save()
        
        
        resp.status(200).json({ status:true, message: "Post deleted "});
        
          
    
        
   

        
    } catch (error) {
      resp.status(500).json({ status:false, message:`Server Error: ${error.message}`})
    }
    
    
}



















//TODO Create LikeAndUnlikePost Function 
exports.likeAndunlikePost = async(req,resp)=>{

    try {

        const post = await Post.findById(req.params.id);


        if(!post){
          return resp.status(404).json({status:false, message: "Post not found "})
        }
        
        
        
        //* Post Unlike code
        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id);

            post.likes.splice(index,1);  

            await post.save()
            
          return resp.status(200).json({ status:true, message: "Post Unliked "})
            
        }else{

            //* Post like code
            post.likes.push(req.user._id);

            await post.save();

            return resp.status(200).json({ status:true, message: "Post Liked "})
        }
        
        
      
        
    } catch (error) {
      resp.status(500).json({ status:false, message:`Server Error : ${error.message}`})
    }
    
    
}









//TODO Create GetPostOfFollowing function
exports.getPostOfFollowing = async (req,resp)=>{

    try {
        
        const user = await User.findById(req.user._id);

        const posts = await Post.find({
            owner:{
                $in: user.following
            }
        })
        
        

       resp.status(200).json({status:true,posts})
        
        
        
    } catch (error) {
      resp.status(500).json({ status:false, message:`Server Error ${error.message}`})
    }
    
    
}

















//TODO Update Caption Function create
exports.updateCaption = async (req,resp)=>{
    try {

       const post = await Post.findById(req.params.id);


       const { caption } = req.body
        
       if(!post){
        return resp.status(404).json({ status:false, message: "Post not found"})
       }
       
       
         //* Check Post owner
       if(post.owner.toString() !== req.user._id.toString()){

        return resp.status(404).json({ status:false, message: "User Unauthorized"})
        
      }


      post.caption = caption   //* <-- Update caption

       await post.save();
       
       resp.status(200).json({status:true, message: "Post updated"})
      
    } catch (error) {
      resp.status(500).json({ status:false, message:`Server Error : ${error.message}`})
    }
  }









//TODO addOnUpdateComment Function create
//   exports.addOnUpdateComment = async (req,resp)=>{

//     try {

//         const post = await Post.findById(req.params.id);

//         if(!post){
//             return  resp.status(500).json({ status:false, message:"Post not found"});
//         }
        
        
//         let commentIndex = -1;
        
//         post.comments.forEach((iten,index)=>{
//             if(iten.user.toString() === req.user._id.toString()){
//                 commentIndex = index;
//             }
//         })
        
        
//         if(commentIndex !== -1){
             
//             post.comments[commentIndex].comment = req.body.comment

//             await post.save();
//             return resp.status(200).json({ status:true, message:"comment updated"})
//         }else{
//            post.comments.push({
//                 user:req.user._id,
//                 comment:req.body.comment
//            })

//            await post.save();

//            return resp.status(200).json({ status:true, message:"comment added"})
//         }

        



        
        
//     } catch (error) {
//        resp.status(500).json({ status:false, message:`Server Error ${error.message}`})
//     }
    
    
//   }














  //TODO addComment Function Create (Me changes & modify code)
  exports.addComment = async (req,resp)=>{

    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return  resp.status(404).json({ success:false, message:"Post not found"});
        }
        
           post.comments.push({     //* <-- add comment 
                user:req.user._id,
                comment:req.body.comment
           })

           await post.save();

           return resp.status(200).json({ success:true, message:"Comment added"})
        

        

        
    } catch (error) {
      resp.status(500).json({ status:false, message:`Server Error : ${error.message}`})
    }
    
    
  }









  //TODO updateComment Function my logic implement this code
  exports.updateComment = async (req,resp)=>{

    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return  resp.status(404).json({ status:false, message:"Post not found"});
        }
       

        //* Pull out comment
        const comment = post.comments.find(
          comment => comment._id.toString() === req.body.comment_id.toString()
        );
        


          //* Check user
          if (comment.user.toString() !== req.user._id.toString()) {
            return resp.status(401).json({ success:false, message:"User not authorized"});
          }


           //* Get remove index & Find index 
          //! Not use this code ( yah selected comment delete nahin karta hai Comment id provide karne ke bad bhi)
          // const updateIndex = post.comments
          // .map(comment => comment.user.toString())
          // .indexOf(req.user._id);
        


          //* Get & find comment index (provide Comment id)
          post.comments.forEach((iten,index)=>{
           if(iten._id.toString() === req.body.comment_id.toString()){
                 return post.comments[index].comment = req.body.comment    //* <-- Comment Update this code
              }
            });
    



          await post.save();

          return resp.status(200).json({ status:true, message:"Your comment updated"})

       
        
    } catch (error) {
      resp.status(500).json({ status:false, message:` Server Error ${error.message}`})
    }
    
    
  }








 

  //TODO Create Delete Comment Function   ( only Post Owner comments Selected Comment Delete )
  exports.postOwnerdeleteComment = async (req,resp)=>{

    try {


        const post = await Post.findById(req.params.id);   //* <-- Find Post

        if(!post){
            return resp.status(404).json({ status:false, message:"Post not found"});
        }



        //* Checking If owner wants to delete
        if(post.owner.toString() === req.user._id.toString()){
             
            if(req.body.commentId==undefined){
              return resp.status(400).json({status:false, message:"Comment id is required"});
            }
            
            
            

            //* Get comment index  (Provide Comment _id)
            post.comments.forEach((iten,index)=>{
                if(iten._id.toString() === req.body.commentId.toString()){
                  return post.comments.splice(index,1)  //* <-- Delete comment
                }
            });


            await post.save();

            return resp.status(200).json({ status:true, message:"Selected Comment has deleted"});
            
            
        }else{
          return resp.status(404).json({ status:false, message: "User not authorized"})
        }
        
        
    } catch (error) {
       resp.status(500).json({ status:false, message:`Server Error : ${error.message}`})
    }
    
    

  }












  //TODO Create Your Comment Delete Function 
  exports.yourCommentDelete = async (req,resp)=>{

    try {

        const post = await Post.findById(req.params.id);   //* <-- Post Find   (Provide Post _id)
         

        //* Pull out & baahar kheenchen comment
        const comment = post.comments.find(
          comment => comment._id.toString() === req.body.comment_id.toString()
        );
        
         
        if(!post){
            return resp.status(404).json({status:false, message:"Post not found"});
        } 


          //* Check user authorized     (yah check kar raha hai comment user ka or login user ka id match kar raha hai kya Nahin)
          if (comment.user.toString() !== req.user._id.toString()) {
              return resp.status(401).json({ status:true, message:"User not authorized"});
          }

          
          //* Get comment intex
          post.comments.forEach((iten,index)=>{
            if(iten._id.toString() === req.body.comment_id.toString()){
              return post.comments.splice(index,1)    //* <-- Remove Comment 
            }
        });
          

        await post.save();

        resp.status(200).json({ status:true, message:"Your Comment has deleted"});
        
        
    } catch (error) {
      console.log(error);
      resp.status(500).json({ status:false, message:` Server Error ${error.message}`})
    }
    
    
  }


 








  //TODO Get Post Detalis   (provide id)
  exports.GetPostDetalis = async (req,resp)=>{
      
      try {

        const post = await Post.findById(req.params.id);   //* <-- Find Post
        
        if(!post){
          return resp.status(404).json({ status:false, message: "Post not found"});
        }
        
        resp.status(200).json({ status:true, post:post});
        
        
      } catch (error) {
        resp.status(500).json({ status:false, message:` Server Error : ${error.message}`})
      }
    
    
  }
