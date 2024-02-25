import { User } from '../models/User';
import fs from 'fs';
import path from 'path';
import i18n from '../i18n';

export class UserService {
    private static readonly usersFilePath = path.resolve(__dirname, '../../db/', 'users.json');

    static async getPaginatedUsers(page: number, pageSize: number): Promise<{ users: User[], totalPages: number }> {
        try {
            const allUsers: User[] = JSON.parse(fs.readFileSync(this.usersFilePath, 'utf8'));
            const startIndex = (page - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, allUsers.length);
            const users = allUsers.slice(startIndex, endIndex);
            const totalPages = Math.ceil(allUsers.length / pageSize);

            return { users, totalPages };
        } catch (error) {
            console.error('Error fetching paginated users:', error);
            throw new Error(i18n.t('user.fetchError' as string));
        }
    }

    static async getUserById(userId: string): Promise<{ user: User | null }> {
        try {
            const userData = fs.readFileSync(this.usersFilePath, 'utf8');
            const users: User[] = JSON.parse(userData);

            const user = users.find(u => u.id === userId);
            if (!user) {
                return { user: null };
            }

            return { user };
        } catch (error) {
            console.error('Error fetching paginated users:', error);
            throw new Error(i18n.t('user.fetchIdError' as string));
        }
    }

    static async deleteUser(userId: string): Promise<boolean> {
        try {
            const userData = fs.readFileSync(this.usersFilePath, 'utf8');
            const users: User[] = JSON.parse(userData);

            const updatedUsers = users.filter(user => user.id !== userId);
            if (users.length === updatedUsers.length) {
                return false;
            }

            fs.writeFileSync(this.usersFilePath, JSON.stringify(updatedUsers, null, 2));
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error(i18n.t('user.fetchIdError'));
        }
    }
}