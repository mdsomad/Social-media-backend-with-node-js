const express = require("express")
const { createPost, likeAndunlikePost, deletePost, getPostOfFollowing, updateCaption, addComment, updateComment, yourCommentDelete, GetPostDetalis, postOwnerdeleteComment } = require( "../controllers/postController");
const { isAuthenticated } = require("../middlewares/auth");             //* Cookies Token Add & Save    (Work Web Then use this --> isAuthenticated )
const { checkUserAuth } = require("../middlewares/auth-middleware");    //* Bearer Token Send then use  (Work Apps Then use this --> checkUserAuth )
const cloudinary = require('cloudinary').v2;
const routes = express.Router()


cloudinary.config({    //* cloudinary Image store (config)
    cloud_name: 'ddx68nuvc', 
    api_key: '471269946544427', 
    api_secret: 'sCFvZRzFLcVI1SvP5Id3flD9eTA',
    secure: true
  });




routes.route("/post/upload",).post(isAuthenticated,createPost)

routes.route("/post/:id",).get(isAuthenticated,likeAndunlikePost).put(isAuthenticated,updateCaption);  //* single route  multiple use  post get & chenge put & work updateCaption

routes.route("/post/delete/:id",).delete(isAuthenticated,deletePost);

routes.route("/posts",).get(isAuthenticated,getPostOfFollowing);

routes.route("/post/comment/:id",).put(isAuthenticated,addComment);

routes.route("/your/commentdelete/:id",).delete(isAuthenticated,yourCommentDelete);

routes.route("/postownerdelete/comment/:id",).delete(isAuthenticated,postOwnerdeleteComment);

routes.route("/postupdate/comment/:id",).put(isAuthenticated,updateComment);

routes.route("/getpost/detalis/:id",).get(isAuthenticated,GetPostDetalis);


module.exports = routes