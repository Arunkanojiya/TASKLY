import express from 'express';
import { getCurrentUserController, loginController, registerController, updatePasswordController, updateProfileController } from '../controller/user.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { User } from '../model/user.model.js';

const router = express.Router();


//public route
router.post('/register',registerController);
router.post('/login',loginController);





//private route and protect also
router.get('/me',authMiddleware,getCurrentUserController)
router.put('/profile',authMiddleware,updateProfileController)
router.put('/password',authMiddleware,updatePasswordController)


export default router;