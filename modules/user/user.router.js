import { Router } from 'express'
import * as userController from './controller/user.js';
import { auth } from './../../middleware/auth.js';

const router = Router();

router.get('/', userController.getUsers)
router.get('/signout', auth(), userController.SignOut)
router.patch('/updateUser', auth(), userController.updateUser)
router.patch('/deleteUser', auth(), userController.deleteUser)
router.get('/shareProfile/:id', userController.shareProfile)
router.patch('/password', auth(), userController.updatePassword)
router.get('/getProfile', auth(), userController.getProfile)
router.get('/messages', auth(), userController.getMessages)

export default router;