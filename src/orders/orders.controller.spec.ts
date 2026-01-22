import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { OrdersService } from './orders.service';

const mockOrderService = {
  createOrderItem: jest.fn(),
  createOrder: jest.fn(),
  getOrders: jest.fn()
}

const mockAuthGuard = {
  canActivate: jest.fn(() => true)
}

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {provide: OrdersService, useValue: mockOrderService}
      ]
    }).overrideGuard(AuthGuard).useValue(mockAuthGuard).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
