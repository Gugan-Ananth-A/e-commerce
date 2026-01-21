import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { ProductImage } from './entity/product-image.entity';
import { Product } from './entity/product.entity';
import { User } from 'src/users/entity/user.entity';
import { S3Service } from './s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Category, ProductImage])],
  controllers: [ProductsController],
  providers: [ProductsService, S3Service]
})
export class ProductsModule {}
