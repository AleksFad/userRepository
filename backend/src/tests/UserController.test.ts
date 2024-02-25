import { Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import { sendErrorResponse } from '../utils/errorHandler';

jest.mock('../services/UserService');
jest.mock('../utils/errorHandler');

const mockRequest = (options: { userId?: string; query?: any }): Partial<Request> => ({
    userId: options.userId,
    query: options.query,
});

const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('UserController', () => {
    describe('getUserList', () => {
        it('should return user list successfully', async () => {
            const req = mockRequest({ userId: '123', query: { page: '1' } });
            const res = mockResponse();
            (UserService.getPaginatedUsers as jest.Mock).mockResolvedValue({
                users: [{ id: '123', email: 'test@example.com' }],
                totalPages: 1,
            });

            await UserController.getUserList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                users: expect.any(Array),
                totalPages: 1,
                userId: '123',
            });
            expect(UserService.getPaginatedUsers).toHaveBeenCalledWith(1, 4);
        });

        it('should return error if userId is missing', async () => {
            const req = mockRequest({ query: { page: '1' } });
            const res = mockResponse();

            await UserController.getUserList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'user.idMissing',
            });
        });

        it('should handle unexpected errors', async () => {
            const req = mockRequest({ userId: '123', query: { page: '1' } });
            const res = mockResponse();
            const errorMessage = 'Unexpected error';
            (UserService.getPaginatedUsers as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await UserController.getUserList(req as Request, res as Response);

            expect(sendErrorResponse).toHaveBeenCalledWith(res, 500, 'user.internalServerError', 'Internal Server Error');
        });
    });

    describe('getUserDataAndLogins', () => {
        it('should return user data and logins successfully', async () => {
            const req = mockRequest({ userId: '123' });
            const res = mockResponse();
            (UserService.getUserById as jest.Mock).mockResolvedValue({
                user: { email: 'user@example.com', lastLogins: ['2023-01-01T00:00:00.000Z'] }
            });

            await UserController.getUserDataAndLogins(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                email: 'user@example.com',
                lastLogins: ['2023-01-01T00:00:00.000Z']
            });
        });

        it('should return error if userId is missing', async () => {
            const req = mockRequest({});
            const res = mockResponse();

            await UserController.getUserDataAndLogins(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'user.idMissing' });
        });

        it('should return error if user is not found', async () => {
            const req = mockRequest({ userId: 'nonexistent' });
            const res = mockResponse();
            (UserService.getUserById as jest.Mock).mockResolvedValue({ user: null });

            await UserController.getUserDataAndLogins(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'user.userNotFound' });
        });
    });

    describe('deleteUser', () => {
        it('should handle unexpected errors during deletion', async () => {
            const req = mockRequest({ userId: '123' });
            const res = mockResponse();
            (UserService.deleteUser as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

            await UserController.deleteUser(req as Request, res as Response);

            expect(sendErrorResponse).toHaveBeenCalledWith(res, 500, 'user.internalServerError', 'Internal Server Error');
        });
    });

});
