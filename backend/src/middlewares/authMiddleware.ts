import { Request, Response, NextFunction } from 'express';
import i18n from '../i18n';
const jwt = require('jsonwebtoken');

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export class AuthMiddleware {
    static verifyToken(req: Request, res: Response, next: NextFunction): void {
        const bearerToken = req.header('Authorization');
        if (!bearerToken) {
            return AuthMiddleware.sendUnauthorizedResponse(res, i18n.t('auth.accessDenied'));
        }

        const token = bearerToken.split(' ')[1];
        if (!token) {
            return AuthMiddleware.sendUnauthorizedResponse(res, i18n.t('auth.noTokenProvided'));
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.userId = decoded.userId;
            next();
        } catch (error) {
            AuthMiddleware.sendUnauthorizedResponse(res, i18n.t('auth.invalidToken'));
        }
    }

    private static sendUnauthorizedResponse(res: Response, message: string): void {
        res.status(401).json({
            error: message,
            unauthorized: true,
        });
    }
}

