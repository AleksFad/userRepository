import React, { useState } from "react";
import instance from '../../config/axiosConfig';
import { useTranslation } from 'react-i18next';

const Registration: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await instance.post<{ message: string }>("/auth/register", {
                email,  // Update to use 'email' instead of 'username'
                password,
            });
            setMessage(response.data.message);
        } catch (error: any) { // Explicitly type 'error' as 'any'
            console.error("Registration failed:", error.response?.data.error);
            setMessage(error.response?.data.error || "An unexpected error occurred.");
        }
    };


    return (
        <div>
            <h2>{t('register')}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email')}
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password')}
                    required
                />
                <button type="submit">{t('register')}</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Registration;
