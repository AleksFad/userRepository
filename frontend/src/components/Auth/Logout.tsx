import React, { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Logout = () => {
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    });

    return (
        <div>{t('logout')}</div>
    );
};

export default Logout;