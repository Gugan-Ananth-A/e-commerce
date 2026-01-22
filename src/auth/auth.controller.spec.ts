import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn(),
  signup: jest.fn()
}

const mockJwtService = {
  signAsync: jest.fn()
}

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {provide: AuthService, useValue: mockAuthService},
        {provide: JwtService, useValue: mockJwtService}
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SignUp', () => {
    it('should signup the user & return both tokens', async () => {
      const dto: SignUpDto = {
        firstName: 'test',
        lastName: 'A',
        email: 'test@gmail.com',
        password: 'Password@123',
        role: 'CUSTOMER'
      }

      mockAuthService.signup.mockResolvedValue({
        authToken: 'jwt-token',
        refreshToken: 'refresh-token'
      });

      const signupSpy = jest.spyOn(service, 'signup');
      const result = await controller.signup(dto);
      expect(signupSpy).toHaveBeenCalledWith(dto);
      expect(result.authToken).toBe('jwt-token');
      expect(result.refreshToken).toBe('refresh-token');
    });
  });

  describe('Logout', () => {
    it('should logout the user & return success message', async () => {
      const userID = '1';

      mockAuthService.logout.mockResolvedValue({
        message: 'Logout success!'
      });

      const logoutSpy = jest.spyOn(service, 'logout');
      const result = await controller.logout(userID);
      expect(logoutSpy).toHaveBeenCalledWith(userID);
      expect(result.message).toBe('Logout success!');
    });
  });

  describe('RefreshToken', () => {
    it('Returns new Access & Refresh Token', async () => {
      const uuid = randomUUID();
      const dto = {
        refreshToken: uuid
      };

      mockAuthService.refreshToken.mockResolvedValue({
        authToken: 'jwt-token',
        refreshToken: 'refresh-token'
      });

      const refreshTokenSpy = jest.spyOn(service, 'refreshToken');
      const result = await controller.refreshToken(dto);
      expect(refreshTokenSpy).toHaveBeenCalledWith(dto);
      expect(result.authToken).toBe('jwt-token');
      expect(result.refreshToken).toBe('refresh-token');
    });
  });

  describe('Login', () => {
    it('Login & returns Access & Refresh Token', async () => {
      const dto: LoginDto = {
        email: 'test@gmail.com',
        password: 'Password@123'
      }

      mockAuthService.login.mockResolvedValue({
        authToken: 'jwt-token',
        refreshToken: 'refresh-token'
      });

      const loginSpy = jest.spyOn(service, 'login');
      const result = await controller.login(dto);
      expect(loginSpy).toHaveBeenCalledWith(dto);
      expect(result.authToken).toBe('jwt-token');
      expect(result.refreshToken).toBe('refresh-token');
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
