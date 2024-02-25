import React, { useState, useEffect, Fragment } from 'react';
import instance from '../../config/axiosConfig';

const DetailUser = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [lastLogins, setLastLogins] = useState<string[] | null>(null);

    useEffect(() => {
        fetchUserDataAndLogins();
    }, []);

    const fetchUserDataAndLogins = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await instance.get(`/users/detail`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setEmail(response.data.email);
            setLastLogins(response.data.lastLogins);
        } catch (error) {
            console.error('Error fetching user data and logins:', error);
        }
    };

    return (
        <div>
            {email && (
                <Fragment>
                    <div>
                        <h2>User Data</h2>
                        <p>Email: {email}</p>
                    </div>
                    <h2>User Login History</h2>
                    <ul>
                        {lastLogins && lastLogins.map((login: string, index: number) => (
                            <li key={index}>{login}</li>
                        ))}
                    </ul>
                </Fragment>
            )}
        </div>
    );
};

export default DetailUser;
