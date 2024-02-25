import { AuthController } from '../controllers/authController';
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

jest.mock('../services/authService');
jest.mock('../utils/errorHandler');

const mockRequest = (body: any): Partial<Request> => ({
    body,
});

const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('AuthController', () => {
    describe('register', () => {
        it('should create a user successfully', async () => {
            const req = mockRequest({ email: 'test@example.com', password: 'password123' });
            const res = mockResponse();
            (AuthService.createUser as jest.Mock).mockResolvedValue({ error: null });

            await AuthController.register(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
        });

        it('should return an error if user creation fails', async () => {
            const req = mockRequest({ email: 'test@example.com', password: 'password123' });
            const res = mockResponse();
            (AuthService.createUser as jest.Mock).mockResolvedValue({ error: 'User with this email already exists' });

            await AuthController.register(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
        });
    });

    describe('login', () => {
        it('should authenticate and return a token for valid credentials', async () => {
            const req = mockRequest({ email: 'test@example.com', password: 'password123' });
            const res = mockResponse();
            (AuthService.authenticate as jest.Mock).mockResolvedValue('fakeToken');

            await AuthController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'fakeToken' });
            expect(AuthService.authenticate).toHaveBeenCalledWith('test@example.com', 'password123');
        });

        it('should return an error for invalid credentials', async () => {
            const req = mockRequest({ email: 'wrong@example.com', password: 'password123' });
            const res = mockResponse();
            (AuthService.authenticate as jest.Mock).mockResolvedValue(null);

            await AuthController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
            expect(AuthService.authenticate).toHaveBeenCalledWith('wrong@example.com', 'password123');
        });
    });
});
