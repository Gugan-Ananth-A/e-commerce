import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
 
const mockUserService = {
  getAllUsers: jest.fn(),
  changePassword: jest.fn(),
  update: jest.fn()
}

const mockAuthGuard = {
  canActivate: jest.fn(() => true)
}

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {provide: UsersService, useValue: mockUserService}
      ]
    })
    .overrideGuard(AuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('update the information of the users', async () => {
      const dto: UpdateUserDto = {
        firstName: 'test',
        lastName: 'A',
        email: 'test@gmail.com',
        role: 'CUSTOMER'
      }

      mockUserService.update.mockResolvedValue({
        id: '1',
        firstName: 'test',
        lastName: 'A',
        email: 'test@gmail.com',
        role: 'CUSTOMER'
      });

      const updateSpy = jest.spyOn(service, 'update');
      const result = await controller.update(dto, '1');
      expect(updateSpy).toHaveBeenCalledWith(dto, '1');
      expect(result?.firstName).toBe('test');
      expect(result?.lastName).toBe('A');
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
