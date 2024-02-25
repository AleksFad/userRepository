import React, { useState, useEffect } from 'react';
import DeleteUserButton from './DeleteUserButton';
import instance from '../../config/axiosConfig';

export interface User {
    id: number;
    name: string;
    email: string;
    lastLogins: string[];
    isValidated: boolean;
}

interface UserListResponse {
    users: User[];
    totalPages: number;
    userId: number;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState<number>(1);
    const [currentId, setCurrentId] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const itemsPerPage = parseInt(String(process.env.ITEMS_PER_PAGE || 4));

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        try {
            const response = await instance.get<UserListResponse>(`/users/list?page=${page}`);
            console.log(response.data);
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
            setCurrentId(response.data.userId);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handlePreviousPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handleUserDeleted = async (userId: number) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    return (
        <div>
            <h2>User List</h2>
            <ol start={(page - 1) * itemsPerPage + 1}>
                {users.map((user, index) => (
                    <li key={user.id}>
                        {user.email}
                        <DeleteUserButton disabled={user.id === currentId} userId={user.id} onUserDeleted={handleUserDeleted} />
                    </li>
                ))}
            </ol>
            <div>
                <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
                <span>{`Page ${page} of ${totalPages}`}</span>
                <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default UserList;
