import React, { useState } from 'react';
import instance from '../../config/axiosConfig';

const UserAdd: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await instance.post<{ message: string }>('/users/register', {
                email,
                password,
            });
            setMessage(response.data.message);
        } catch (error: any) {
            console.error('Registration failed:', error.response?.data.error);
            setMessage(error.response?.data.error || 'An unexpected error occurred.');
        }
    };


    return (
        <div>
            <h2>Add User</h2>
            <form onSubmit={handleSubmit}>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UserAdd;
