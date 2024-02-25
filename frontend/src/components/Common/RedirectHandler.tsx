import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleRedirectToLogin = (event: Event) => {
            const customEvent = event as CustomEvent<any>;
            navigate('/login', { state: { message: customEvent.detail.message } });
        };

        window.addEventListener('redirectToLogin', handleRedirectToLogin);
        return () => {
            window.removeEventListener('redirectToLogin', handleRedirectToLogin);
        };
    }, [navigate]);

    return null;
};
