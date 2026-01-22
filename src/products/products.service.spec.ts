import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { Product } from './entity/product.entity';
import { Category } from './entity/category.entity';
import { ProductImage } from './entity/product-image.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';

const mockUserRepository = {
  update: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn()
}

const mockConfigService = {
  getOrThrow: jest.fn(),
};

const mockProductRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn()
}

const mockCategoryRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
}

const mockImageRepository = {
  create: jest.fn(),
  save: jest.fn(),
}

describe('ProductsService', () => {
  let service: ProductsService;
  let usersRepository: Repository<User>;
  let productRepository: Repository<Product>;
  let categoryRepository: Repository<Category>;
  let imageRepository: Repository<ProductImage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        S3Service,
        {
          provide: ConfigService,
          useValue: mockConfigService
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository
        },
        {
          provide: getRepositoryToken(ProductImage),
          useValue: mockImageRepository
        }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
    imageRepository = module.get<Repository<ProductImage>>(getRepositoryToken(ProductImage));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
