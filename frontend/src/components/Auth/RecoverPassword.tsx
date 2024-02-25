import React, { useState, FormEvent } from 'react';
import instance from '../../config/axiosConfig';
import { useTranslation } from 'react-i18next';

const RecoverPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const { t } = useTranslation();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await instance.post('/auth/recover-password', { email });
            setMessage('If an account with that email exists, a password recovery message has been sent.');
        } catch (error) {
            console.error('Error during password recovery:', error);
            setMessage('An error occurred while attempting to recover the password. Please try again later.');
        }
    };

    return (
        <div>
            <h2>{t('recover')}</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">{t('email')}</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">{t('recover')}</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RecoverPassword;
