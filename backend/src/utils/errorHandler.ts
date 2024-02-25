import { Response } from 'express';
import i18n from '../i18n';

export const sendErrorResponse = (res: Response, statusCode: number, i18nKey: string, fallbackMessage: string) => {
    const message = i18n.exists(i18nKey) ? i18n.t(i18nKey) : fallbackMessage;
    res.status(statusCode).json({ error: message });
};