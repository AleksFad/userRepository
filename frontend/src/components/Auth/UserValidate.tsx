import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import instance from '../../config/axiosConfig';
import { useTranslation } from 'react-i18next';

const UserValidate = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('validating');
    const { t } = useTranslation();

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            return;
        }

        instance.get(`/auth/validate?token=${token}`)
            .then(response => {
                setStatus('success');
            })
            .catch(error => {
                setStatus('error');
            });
    }, [searchParams]);

    return (
        <div>
            {status === 'validating' && <p>{t('validatingEmail')}</p>}
            {status === 'success' && <p>{t('validateSuccess')}</p>}
            {status === 'error' && <p>{t('validateFail')}</p>}
        </div>
    );
};

export default UserValidate;
