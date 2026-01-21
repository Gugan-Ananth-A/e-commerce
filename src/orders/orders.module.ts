import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { Product } from 'src/products/entity/product.entity';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, OrderItem, Product]), 
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, EmailProcessor]
})
export class OrdersModule {}
