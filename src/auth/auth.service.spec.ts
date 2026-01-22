import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { RefreshToken } from './entity/refresh_token.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

const mockUserRepository = {
  increment: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn()
}

const mockRefreshRepository = {
  findOne: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  save: jest.fn()
}

const mockJwtService = {
  signAsync: jest.fn()
}

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersRepository: Repository<User>;
  let refreshRepository: Repository<RefreshToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshRepository
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    refreshRepository = module.get<Repository<RefreshToken>>(getRepositoryToken(RefreshToken));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Login', () => {
    it('should login the user, return access & refresh Tokens', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserRepository.findOne.mockReturnValue({
        id: 1,
        firstName: 'Test',
        lastName: 'A',
        email: 'test@gmail.com',
        hash: 'password-hash',
        role: 'CUSTOMER',
      });
  
      mockJwtService.signAsync.mockReturnValue({
        token: 'access-token'
      });
  
      mockRefreshRepository.findOne.mockReturnValue({
        token: 'refresh-token',
        user: 'user',
        expiresAt: 'expiry-date',
      });
  
      const dto: LoginDto = {
        email: 'test@gmail.com',
        password: 'Password@123',
      }
  
      const result = await service.login(dto);
      const findUser = jest.spyOn(usersRepository, 'findOne');
      expect(findUser).toHaveBeenCalled();
      const generatedToken = jest.spyOn(jwtService, 'signAsync');
      expect(generatedToken).toHaveBeenCalled();
      const findRefreshToken = jest.spyOn(refreshRepository, 'findOne');
      expect(findRefreshToken).toHaveBeenCalled();
      expect(result.refreshToken).toBe('refresh-token');
      expect(result).toMatchObject({
        id: 1,
        firstName: 'Test',
        lastName: 'A',
        email: 'test@gmail.com',
        role: 'CUSTOMER'
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
