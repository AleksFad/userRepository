import { UserService } from '../services/userService';
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { EmailService } from '../services/emailService';
import i18n from '../i18n';

export class UserController {
    static async getUserList(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(400).json({error: i18n.t('user.idMissing')});
                return;
            }

            const page = parseInt(req.query.page?.toString() || '1');

            const pageSize = parseInt(String(process.env.ITEMS_PER_PAGE || 4));
            const { users, totalPages } = await UserService.getPaginatedUsers(page, pageSize);

            res.status(200).json({ users, totalPages, userId });
        } catch (error) {
            console.error('Error fetching paginated users:', error);
            res.status(500).json({ error: i18n.t('user.internalServerError') });
        }
    }

    static async addUser(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const { error } = await AuthService.createUser(email, password);

            if (error) {
                res.status(error === 'User with this email already exists' ? 409 : 400)
                    .json({ error: i18n.t(error === 'User with this email already exists' ? 'user.userWithEmailExists' : 'user.internalServerError') });
                return;
            }

            res.status(201).json({ message: i18n.t('user.userAddedSuccessfully') });
            return;
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: i18n.t('user.internalServerError') });
        }
    }

    static async getUserDataAndLogins(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(400).json({ error: i18n.t('user.idMissing') });
                return;
            }
            const result = await UserService.getUserById(userId);
            if (!result.user) {
                res.status(404).json({ error: i18n.t('user.userNotFound') });
                return;
            }

            res.status(200).json({ email: result.user.email, lastLogins: result.user.lastLogins });
        } catch (error) {
            console.error('Error fetching user data and logins:', error);
            res.status(500).json({ error: i18n.t('user.internalServerError') });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const result = await UserService.getUserById(userId);

            if (!result.user) {
                return res.status(404).send({ message: i18n.t('user.userNotFound') });
            }

            const userDeleted = await UserService.deleteUser(userId);
            if (!userDeleted) {
                return res.status(404).send({ message: i18n.t('user.userNotFound') });
            }

            await EmailService.sendDeletionEmail(result.user.email);

            res.status(200).send({ message: i18n.t('user.userDeletedSuccessfully') });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send({ message: i18n.t('user.internalServerError') });
        }
    }
}