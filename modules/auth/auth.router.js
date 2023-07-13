import { Router } from 'express'
import * as authController from './controller/auth.js';

const router = Router();

router.post('/signup', authController.SignUp);
router.get('/confirmEmail/:token', authController.confirmEmail);
router.post('/signin', authController.SignIn);
router.patch('/sendCode', authController.sendCode);
router.patch('/forgetPassword', authController.forgetPassword);

export default router;