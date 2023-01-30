const express = require("express")
const {
     register,
     login, 
     followUser, 
     logout, 
     updatePassowrd, 
     updateProfile, 
     deleteMyProfile, 
     myProfile,
     getUserProfile,
     getAllUsers,
     forgotPassword,
     resetPassword
    } = require("../controllers/userController");

const { isAuthenticated } = require("../middlewares/auth");          //* Cookies Token Add & Save    (Work Web Then use this --> isAuthenticated )
const {checkUserAuth}  = require("../middlewares/auth-middleware");  //* Bearer Token Send then use  (Work Apps Then use this --> checkUserAuth )
const routes = express.Router()





routes.route("/register").post(register);

routes.route("/login").post(login);

routes.route("/logout").get(logout);

routes.route("/follow/:id",).get(isAuthenticated,followUser);

routes.route("/update/password",).put(isAuthenticated,updatePassowrd);

routes.route("/update/profile",).put(isAuthenticated,updateProfile);

routes.route("/delete/me",).delete(isAuthenticated,deleteMyProfile);

routes.route("/me",).get(isAuthenticated,myProfile);

routes.route("/user/:id",).get(isAuthenticated,getUserProfile);

routes.route("/users",).get(isAuthenticated,getAllUsers);

routes.route("/forgot/password").post(forgotPassword);

routes.route("/password/reset/:token").put(resetPassword);



module.exports = routes