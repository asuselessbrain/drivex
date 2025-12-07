import express from 'express';
import { userController } from './user.controller';

const router = express.Router();

router.get('/', userController.getAllUser)
router.patch('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

export const userRoutes = router;