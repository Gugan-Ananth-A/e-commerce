import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { Product } from 'src/products/entity/product.entity';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { OrdersGateway } from './orders.gateway';

const mockUserRepository = {
  findOne: jest.fn()
}

const mockProductRepository = {
  findOne: jest.fn(),
  save: jest.fn()
}

const mockOrdersGateway = {
  emitOrderStatus: jest.fn(),
};

const mockOrderRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn()
}

const mockOrderItemRepository = {
  create: jest.fn(),
  save: jest.fn()
}

const mockEmailQueue = {
  add: jest.fn()
}

const mockOrderQueue = {
  add: jest.fn()
}

describe('OrdersService', () => {
  let service: OrdersService;
  let usersRepository: Repository<User>
  let productRepository: Repository<Product>
  let orderRepository: Repository<Order>
  let orderItemRepository: Repository<OrderItem>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository
        },
        {
          provide: getQueueToken('email-queue'),
          useValue: mockEmailQueue,
        },
        {
          provide: getQueueToken('orders-queue'),
          useValue: mockOrderQueue,
        },
        {
          provide: OrdersGateway,
          useValue: mockOrdersGateway,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
