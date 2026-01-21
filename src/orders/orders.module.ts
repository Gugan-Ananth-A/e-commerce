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
import { OrdersGateway } from './orders.gateway';

@Module({
  exports: [OrdersGateway],
  imports: [
    TypeOrmModule.forFeature([User, Order, OrderItem, Product]), 
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, EmailProcessor, OrdersGateway, OrdersGateway]
})
export class OrdersModule {}
