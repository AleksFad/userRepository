import React, { useState } from 'react';
import instance from '../../config/axiosConfig';

interface UserFormProps {
    isRegistration?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ isRegistration = false }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const endpoint = isRegistration ? '/auth/register' : '/users/register';

        try {
            const response = await instance.post<{ message: string }>(endpoint, {
                email,
                password,
            });
            setMessage(response.data.message);
        } catch (error: any) {
            console.error(`${isRegistration ? "Registration" : "Adding user"} failed:`, error.response?.data.error);
            setMessage(error.response?.data.error || "An unexpected error occurred.");
        }
    };

    return (
        <div>
            <h2>{isRegistration ? "Register" : "Add User"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
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
                <button type="submit">{isRegistration ? "Register" : "Add User"}</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UserForm;
