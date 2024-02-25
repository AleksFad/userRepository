import * as fs from 'fs';
import * as path from 'path';
import jwt, { Secret } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { validateEmail, validatePassword } from '../validators/userValidator';
import { EmailService } from './emailService';
import i18n from '../i18n';

interface RegisterUser {
    email: string;
    password: string;
}

export class AuthService {
    private static readonly usersFilePath = path.resolve(__dirname, '../../db/', 'users.json');

    static async authenticate(email: string, password: string): Promise<string | null> {
        try {
            const users: User[] = JSON.parse(fs.readFileSync(this.usersFilePath, 'utf8'));

            const user = users.find(u => u.email === email);
            if (!user) {
                return null;
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return null;
            }

            if (!user.isValidated) {
                return null;
            }

            const loginDate = new Date().toISOString();
            if (!user.lastLogins) {
                user.lastLogins = [];
            }
            user.lastLogins.push(loginDate);

            fs.writeFileSync(this.usersFilePath, JSON.stringify(users, null, 2));
            const secretKey: Secret = process.env.SECRET_KEY || 'defaultSecret';
            return jwt.sign({
                userId: user.id
            }, secretKey, { expiresIn: '1h' });
        } catch (error) {
            console.error('Error authenticating user:', error);
            return null;
        }
    }

    static async isExistingUser(email: string): Promise<boolean> {
        try {
            const users: User[] = JSON.parse(fs.readFileSync(this.usersFilePath, 'utf8'));

            const user = users.find(u => u.email === email);
            if (!user) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error authenticating user:', error);
            return false;
        }
    }

    static async register(user: RegisterUser): Promise<User | null> {
        try {
            const users: User[] = JSON.parse(fs.readFileSync(this.usersFilePath, 'utf8'));

            const userId = uuidv4();
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const newUser: User = { id: userId, email: user.email, password: hashedPassword, lastLogins: [], isValidated: false };
            users.push(newUser);

            fs.writeFileSync(this.usersFilePath, JSON.stringify(users, null, 2));

            return newUser;
        } catch (error) {
            console.error('Error registering user:', error);
            return null;
        }
    }

    static async updatePassword(email: string, newPassword: string): Promise<void> {
        try {
            const userData = fs.readFileSync(this.usersFilePath, 'utf8');
            const users: User[] = JSON.parse(userData);

            const userIndex = users.findIndex(user => user.email === email);
            users[userIndex].password = await bcrypt.hash(newPassword, 10);

            fs.writeFileSync(this.usersFilePath, JSON.stringify(users, null, 2));
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }

    static async validate(userId: string): Promise<void> {
        const userData = fs.readFileSync(this.usersFilePath, 'utf8');
        const users: User[] = JSON.parse(userData);

        const userIndex = users.findIndex(user => user.id === userId);
        users[userIndex].isValidated = true;
        fs.writeFileSync(this.usersFilePath, JSON.stringify(users, null, 2));
    }

    static async createUser(email: string, password: string): Promise<{ newUser: User | null, error?: string }> {
        if (!validateEmail(email)) {
            return { newUser: null, error: i18n.t('auth.invalidEmailFormat') };
        }

        if (!validatePassword(password)) {
            return { newUser: null, error: i18n.t('auth.passwordShort') };
        }

        const existingUser = await this.isExistingUser(email);
        if (existingUser) {
            return { newUser: null, error: i18n.t('auth.emailExist') };
        }

        const newUser = await this.register({ email, password });
        if (!newUser) {
            return { newUser: null, error: i18n.t('auth.failedCreate') };
        }

        await EmailService.sendGreetingEmail(newUser);
        return { newUser };
    }
}

