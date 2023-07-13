import { Router } from 'express'
import * as messageController from './controller/message.js';
import { auth } from './../../middleware/auth.js';

const router = Router();

router.post('/sendMessage', messageController.sendMessage);
router.patch('/deleteMessage/:id', auth(), messageController.deleteMessage);

export default router;