import { Request, Response } from 'express';
import {
  createOrUpdateAuth,
  getAuthByProviderId,
  AuthRequestParams,
} from '../../src/features/auth/authController';
import Auth, { IAuth } from '../../src/features/auth/authModel';
import Player from '../../src/features/players/playerModel';
import mongoose from 'mongoose';

jest.mock('../../src/features/auth/authModel');
jest.mock('../../src/features/players/playerModel');

describe('Auth Controller', () => {
  let mockReq: Partial<Request<AuthRequestParams>>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {
        providerId: '123',
        provider: 'google',
        playerId: new mongoose.Types.ObjectId(), // Initialize all required params
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrUpdateAuth', () => {
    it('should create a new auth record and player if auth record does not exist', async () => {
      (Auth.findOne as jest.Mock).mockResolvedValue(null);
      (Player.prototype.save as jest.Mock).mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
      });
      (Auth.prototype.save as jest.Mock).mockResolvedValue({});

      mockReq.body = {
        provider: 'google',
        providerId: '123',
        accessToken: 'testAccessToken',
        refreshToken: 'testRefreshToken',
      };

      await createOrUpdateAuth(
        mockReq as Request<AuthRequestParams>,
        mockRes as Response,
        mockNext,
      );

      expect(Auth.findOne).toHaveBeenCalledWith({
        providerId: '123',
        provider: 'google',
      });
      expect(Player.prototype.save).toHaveBeenCalled();
      expect(Auth.prototype.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should update an existing auth record if it exists', async () => {
      const mockAuthRecord = {
        save: jest.fn().mockResolvedValue({}),
        accessToken: '',
        refreshToken: '',
      };

      (Auth.findOne as jest.Mock).mockResolvedValue(mockAuthRecord);

      mockReq.body = {
        provider: 'google',
        providerId: '123',
        accessToken: 'updatedAccessToken',
        refreshToken: 'updatedRefreshToken',
      };

      await createOrUpdateAuth(
        mockReq as Request<AuthRequestParams>,
        mockRes as Response,
        mockNext,
      );

      expect(Auth.findOne).toHaveBeenCalledWith({
        providerId: '123',
        provider: 'google',
      });
      expect(mockAuthRecord.save).toHaveBeenCalled();
      expect(mockAuthRecord.accessToken).toBe('updatedAccessToken');
      expect(mockAuthRecord.refreshToken).toBe('updatedRefreshToken');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe('getAuthByProviderId', () => {
    it('should return the auth record if it exists', async () => {
      const mockAuthRecord = { playerId: new mongoose.Types.ObjectId() };

      (Auth.findOne as jest.Mock).mockResolvedValue(mockAuthRecord);

      await getAuthByProviderId(
        mockReq as Request<AuthRequestParams>,
        mockRes as Response,
        mockNext,
      );

      expect(Auth.findOne).toHaveBeenCalledWith({
        providerId: '123',
        provider: 'google',
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockAuthRecord);
    });

    it('should return 404 if the auth record does not exist', async () => {
      (Auth.findOne as jest.Mock).mockResolvedValue(null);

      await getAuthByProviderId(
        mockReq as Request<AuthRequestParams>,
        mockRes as Response,
        mockNext,
      );

      expect(Auth.findOne).toHaveBeenCalledWith({
        providerId: '123',
        provider: 'google',
      });
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Auth record not found',
      });
    });
  });
});
