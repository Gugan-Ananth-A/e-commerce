import { Test, TestingModule } from '@nestjs/testing';
import { OrdersGateway } from './orders.gateway';
import { AuthGuard } from 'src/auth/guard/auth.guard';

const mockAuthGuard = {
  canActivate: jest.fn(() => true)
}

describe('OrdersGateway', () => {
  let gateway: OrdersGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersGateway],
    }).overrideGuard(AuthGuard).useValue(mockAuthGuard).compile();

    gateway = module.get<OrdersGateway>(OrdersGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
