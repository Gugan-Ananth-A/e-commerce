import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { Product } from 'src/products/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, OrderItem, Product])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
