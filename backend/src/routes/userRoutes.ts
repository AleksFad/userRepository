import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();
router.get('/list', AuthMiddleware.verifyToken, UserController.getUserList);
router.get('/detail', AuthMiddleware.verifyToken, UserController.getUserDataAndLogins);
router.post('/register', AuthMiddleware.verifyToken, UserController.addUser);
router.delete('/delete/:userId', AuthMiddleware.verifyToken, UserController.deleteUser);

export default router;
