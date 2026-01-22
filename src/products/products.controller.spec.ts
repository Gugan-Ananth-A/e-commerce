import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

const mockProductsService = {
  getProducts: jest.fn(),
  getProductByID: jest.fn(),
  createProduct: jest.fn(),
  createCategory: jest.fn(),
  uploadProductImage: jest.fn(),
  getPresignedURL: jest.fn()
}

const mockAuthGuard = {
  canActivate: jest.fn(() => true)
}

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {provide: ProductsService, useValue: mockProductsService }
      ]
    }).overrideGuard(AuthGuard).useValue(mockAuthGuard).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });


  afterEach(() => {
    jest.clearAllMocks();
  });
 
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
