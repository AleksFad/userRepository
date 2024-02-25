import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { token } = useContext(AuthContext);
    const isAuthenticated = !!token;
    const { t } = useTranslation();

    return (
        <nav>
            <ul>
                {isAuthenticated ? (
                    <>
                        <li><Link to="/user-list">{t('userList')}</Link></li>
                        <li><Link to="/user-add">{t('addUser')}</Link></li>
                        <li><Link to="/detail">{t('myDetails')}</Link></li>
                        <li><Link to="/logout">{t('logoutMenu')}</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">{t('login')}</Link></li>
                        <li><Link to="/register">{t('register')}</Link></li>
                        <li><Link to="/recover-password">{t('recover')}</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
