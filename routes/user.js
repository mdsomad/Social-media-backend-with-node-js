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
     resetPassword,
     updateAvaterProfile,
     FetchAllFollowersById,
     FetchAllFollowingById,
     changePassowrd,
    } = require("../controllers/userController");

const { isAuthenticated } = require("../middlewares/auth");          //* Cookies Token Add & Save    (Work Web Then use this --> isAuthenticated )
const {checkUserAuth}  = require("../middlewares/auth-middleware");  //* Bearer Token Send then use  (Work Apps Then use this --> checkUserAuth )
const routes = express.Router()





routes.route("/register").post(register);

routes.route("/login").post(login);

routes.route("/logout").get(logout);

routes.route("/follow/:id",).get(checkUserAuth,followUser);

routes.route("/Fetch/followers/:id",).get(FetchAllFollowersById);

routes.route("/Fetch/following/:id",).get(FetchAllFollowingById);

routes.route("/change/password",).put(checkUserAuth,changePassowrd);

routes.route("/update/profile",).put(checkUserAuth,updateProfile);

routes.route("/update/avater",).put(isAuthenticated,updateAvaterProfile);

routes.route("/delete/me",).delete(isAuthenticated,deleteMyProfile);

routes.route("/me",).get(checkUserAuth,myProfile);

routes.route("/user/:_id",).get(checkUserAuth,getUserProfile);

routes.route("/users",).get(checkUserAuth,getAllUsers);

routes.route("/forgot/password").post(forgotPassword);

routes.route("/password/reset/:token").put(resetPassword);



module.exports = routes