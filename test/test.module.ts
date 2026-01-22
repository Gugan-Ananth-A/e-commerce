import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';
import { OrdersModule } from 'src/orders/orders.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/entity/user.entity';
import { Order } from 'src/orders/entity/order.entity';
import { Product } from 'src/products/entity/product.entity';
import { ProductImage } from 'src/products/entity/product-image.entity';
import { OrderItem } from 'src/orders/entity/order-item.entity';
import { RefreshToken } from 'src/auth/entity/refresh_token.entity';
import { Category } from 'src/products/entity/category.entity';

@Module({
  imports: [
    UsersModule, ConfigModule.forRoot({isGlobal: true}), 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'gugan',
      password: 'root',
      database: 'ecommerce_test',
      entities: [User, Order, Product, ProductImage, OrderItem, RefreshToken, Category],
      synchronize: true,
      dropSchema: true,
    }),
    AuthModule, 
    ProductsModule, 
    OrdersModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
})
export class AppTestModule {}