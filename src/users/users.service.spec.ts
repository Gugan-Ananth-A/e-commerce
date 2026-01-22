import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { RefreshToken } from 'src/auth/entity/refresh_token.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUserRepository = {
  update: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn()
}

const mockRefreshRepository = {
  delete: jest.fn()
}

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  let refreshRepository: Repository<RefreshToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshRepository
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    refreshRepository = module.get<Repository<RefreshToken>>(getRepositoryToken(RefreshToken));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Update', () => {
    it('should update user details', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserRepository.update.mockReturnValue({
        id: 1,
        firstName: 'Test',
        lastName: 'A',
        email: 'test@gmail.com',
        hash: 'password-hash',
        role: 'CUSTOMER',
      });
  
      mockUserRepository.findOneBy.mockReturnValue({
        id: 1,
        firstName: 'Test',
        lastName: 'A',
        email: 'test@gmail.com',
        hash: 'password-hash',
        role: 'CUSTOMER',
      });
  
      const dto: UpdateUserDto = {
        email: 'test@gmail.com',
      }
  
      const result = await service.update(dto, '1');
      const updateUser = jest.spyOn(usersRepository, 'update');
      expect(updateUser).toHaveBeenCalled();
      const getUpdatedUser = jest.spyOn(usersRepository, 'findOneBy');
      expect(getUpdatedUser).toHaveBeenCalled();
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
