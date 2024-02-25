import React from 'react';
import { AxiosError } from 'axios';
import instance from '../../config/axiosConfig';
import { useTranslation } from 'react-i18next';

interface DeleteUserButtonProps {
    userId: number;
    onUserDeleted: (userId: number) => void;
    disabled: boolean;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userId, onUserDeleted, disabled }) => {
    const { t } = useTranslation();
    const token = localStorage.getItem('token');
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await instance.delete(`/users/delete/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                onUserDeleted(userId);
                alert('User deleted successfully');
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error('Failed to delete user:', axiosError);
                alert('Failed to delete user');
            }
        }
    };

    return (
        <button onClick={handleDelete} disabled={disabled}>{t('deleteUser')}</button>
    );
};

export default DeleteUserButton;
