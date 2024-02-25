import { Router } from 'express';
const { AuthController } = require('../controllers/authController');

const router = Router();
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/recover-password', AuthController.recoverPassword);

router.get('/validate', AuthController.validate);
module.exports = router;
