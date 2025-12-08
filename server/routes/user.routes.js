import express from 'express';
import { getCurrentUserController, loginController, sendRegisterOtpController, updatePasswordController, updateProfileController, verifyRegisterOtpController } from '../controller/user.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();


//public route
// router.post('/register',registerController);
router.post('/send-otp-register', sendRegisterOtpController);
router.post('/verify-otp-register', verifyRegisterOtpController);


router.post('/login',loginController);

// if also wanted to send otp for login verification
// router.post('/send-otp', sendOtpController);
// router.post('/verify-otp', verifyOtpController);    


//private route and protect also
router.get('/me',authMiddleware,getCurrentUserController)
router.put('/profile',authMiddleware,updateProfileController)
router.put('/password',authMiddleware,updatePasswordController)


export default router;