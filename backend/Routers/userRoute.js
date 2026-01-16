const express=require('express')
const userRouter=express.Router();
const userController=require('../Controllers/userController')
const {auth}=require('../Middleware/auth')

userRouter.post('/signup',userController.signup)
userRouter.post('/login',userController.loginWithOtp);
userRouter.post('/resendOtp',auth,userController.resendOtp);
userRouter.post('/verifyotp',auth,userController.verifyOtp);

module.exports=userRouter;