import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { generateNewPassword } from '../utils/passwordGenerator';
import { EmailService } from '../services/emailService';
import jwt from 'jsonwebtoken';
import i18n from '../i18n';
import { sendErrorResponse } from '../utils/errorHandler';

export class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body as { email: string; password: string };
            const { error } = await AuthService.createUser(email, password);

            if (error) {
                res.status(error === 'User with this email already exists' ? 409 : 400).json({ error });
                return;
            }

            res.status(201).json({ message: i18n.t('register.success') });
            return;
        } catch (error) {
            console.error('Error registering user:', error);
            sendErrorResponse(res, 500, 'register.internalServerError', 'Internal Server Error');
        }
    }

    static async login(req: Request, res: any): Promise<void> {
        try {
            const { email, password } = req.body as { email: string; password: string };
            const token = await AuthService.authenticate(email, password);

            if (!token) {
                res.status(401).json({ error: i18n.t('login.failed') });
                return;
            }

            res.status(200).json({ token });
        } catch (error) {
            console.error('Error logging in user:', error);
            sendErrorResponse(res, 500, 'login.internalServerError', 'Internal Server Error');
        }
    }

    static async recoverPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body as { email: string };

            const user = await AuthService.isExistingUser(email);
            if (!user) {
                res.status(404).json({ error: i18n.t('recover.notfound') });
                return;
            }

            const newPassword = generateNewPassword();
            await AuthService.updatePassword(email, newPassword);

            await EmailService.sendPasswordRecoveryEmail(email, newPassword);

            res.status(200).json({ message: i18n.t('recover.sent') });
        } catch (error) {
            console.error('Error recovering password:', error);
            sendErrorResponse(res, 500, 'recover.internal', 'Internal Server Error');
        }
    }

    static async validate(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.query as { token?: string };
            if (!token) {
                res.status(400).json({error: i18n.t('validate.tokenrequired')});
                return;
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY || 'default_secret');
            if (typeof decoded !== 'object' || !decoded.userId) {
                throw new Error('Invalid token');
            }
            const userId = decoded.userId;
            await AuthService.validate(userId);
            res.json({ message: i18n.t('validate.success') });
        } catch (error) {
            console.error('Validation error:', error);
            sendErrorResponse(res, 500, 'recover.internal', 'Internal Server Error');
        }
    }
}
