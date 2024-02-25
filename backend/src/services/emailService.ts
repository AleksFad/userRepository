import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/User';
import { renderEmailTemplate } from '../utils/emailTemplate';
import i18n from '../i18n';


export class EmailService {
    private static getPostmarkClient() {
        const postmark = require('postmark');
        return new postmark.Client(process.env.POSTMARK_API_TOKEN || '');
    }

    private static async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
        if (!process.env.POSTMARK_EMAIL_FROM) {
            throw new Error('POSTMARK_EMAIL_FROM is not set');
        }

        try {
            const client = this.getPostmarkClient();
            await client.sendEmail({
                From: process.env.POSTMARK_EMAIL_FROM,
                To: to,
                Subject: subject,
                HtmlBody: htmlContent,
            });
        } catch (error) {
            console.error(`Error sending ${subject.toLowerCase()} email:`, error);
            throw error;
        }
    }

    static async sendGreetingEmail(user: User): Promise<void> {
        const secretKey: Secret = process.env.SECRET_KEY || 'defaultSecret';
        const validationToken = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1d' });
        const validationUrl = `${process.env.FRONTEND_URL}/validate?token=${validationToken}`;
        const htmlContent = renderEmailTemplate({ text: `Please validate your email by clicking on the link: ${validationUrl}` });

        await this.sendEmail(user.email, i18n.t('email.register'), htmlContent);
    }

    static async sendPasswordRecoveryEmail(email: string, newPassword: string): Promise<void> {
        const htmlContent = renderEmailTemplate({ text: `Please use your new password: ${newPassword}` });
        await this.sendEmail(email, i18n.t('email.recovery'), htmlContent);
    }

    static async sendDeletionEmail(email: string): Promise<void> {
        const htmlContent = renderEmailTemplate({ text: 'Your account is now deleted.' });
        await this.sendEmail(email, i18n.t('email.delete'), htmlContent);
    }
}
