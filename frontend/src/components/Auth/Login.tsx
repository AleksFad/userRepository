import React, {useContext, useEffect, useState} from 'react';
import instance from '../../config/axiosConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { t } = useTranslation();
    const { setToken } = useContext(AuthContext);

    useEffect(() => {
        if (location.state && (location.state as any).message) {
            setErrorMessage((location.state as any).message);
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await instance.post<{ token: string }>('/auth/login', {
                email,
                password,
            });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            navigate('/user-list');
        } catch (error: any) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2>{t('login')}</h2>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
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
                <button type="submit">{t('login')}</button>
            </form>
        </div>
    );
};

export default Login;
