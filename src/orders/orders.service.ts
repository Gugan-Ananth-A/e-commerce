import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { User } from 'src/users/entity/user.entity';
import { Product } from 'src/products/entity/product.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectQueue('email-queue') private readonly emailQueue: Queue,
    ) {}

    async sendOrderConfirmation(email: string, orderID: number, totalPrice: number) {
        console.log('Order Cofirmation Mail Sent!');
    }

    async removeOrderItem(orderItemID: string, userID: string){
        const user = await this.userRepository.findOne({ where: { id: +userID } });
        if (!user) throw new UnauthorizedException('Invalid Token');
        const orderItem = await this.orderItemRepository.findOne({
            where: { id: +orderItemID },
            relations: ['order', 'order.user', 'product'],
        });
        if (!orderItem) throw new NotFoundException('Order item not found');
        if (orderItem.order.status !== 'PENDING') throw new BadRequestException('Cannot modify checked-out order');
        if (user.role !== 'ADMIN' && orderItem.order.user.id !== +userID) throw new UnauthorizedException('Not your order');
        orderItem.product.stock += orderItem.quantity;
        await this.productRepository.save(orderItem.product);
        orderItem.order.totalPrice -= orderItem.quantity * orderItem.price;
        await this.orderRepository.save(orderItem.order);
        await this.orderItemRepository.remove(orderItem);
        return { message: 'Order item removed successfully' };
    }

    async checkout(orderID: string, userID: string){
        const user = await this.userRepository.findOne({ where: { id: +userID } });
        if (!user) throw new UnauthorizedException('Invalid Token');
        const order = await this.orderRepository.findOne({ where: { id: +orderID }, relations: ['orderItems', 'user']});
        if (!order) throw new NotFoundException('Order not found');
        if (order.status !== 'PENDING') throw new BadRequestException('Already checked out');
        if (order.orderItems.length === 0) throw new BadRequestException('Cannot checkout empty order');
        if (user.role !== 'ADMIN' && order.user.id !== +userID) throw new UnauthorizedException('Not your order');
        order.status = 'PAID'; // needs to be updated
        await this.orderRepository.save(order);
        await this.emailQueue.add('order-confirmation', 
            {
                orderID: order.id,
                userEmail: order.user.email,
                totalPrice: order.totalPrice
            }, 
            {
                jobId: `order-confirmation-${order.id}`,
                attempts: 3
            },
        );
        return { message: 'Order checked out successfully', orderID: order.id};
    }

    async createOrderItem(dto: CreateOrderItemDto, userID: string) {
        const user = await this.userRepository.findOne({where: {id: +userID}});
        if(!user) throw new UnauthorizedException('Invalid Token!');
        const order = await this.orderRepository.findOne({
            where: { id: dto.orderId },
            relations: ['orderItems'],
        });
        if(!order) throw new NotFoundException('Order Not Found');
        if (order.status !== 'PENDING') {
           throw new BadRequestException('Cannot modify this order');
        }
        const product = await this.productRepository.findOne({
            where: { id: dto.productId }
        });
        if(!product) throw new NotFoundException('Product Not Found');
        if(product.stock < dto.quantity){
            throw new BadRequestException('Insufficient Stock');
        }
        const orderItem = this.orderItemRepository.create({
            order,
            product,
            quantity: dto.quantity,
            price: product.price
        });
        product.stock -= dto.quantity;
        order.totalPrice += product.price * dto.quantity;
        await this.productRepository.save(product);
        await this.orderRepository.save(order);
        return this.orderItemRepository.save(orderItem);
    }

    async createOrder(userID: string) {
        const user = await this.userRepository.findOne({where: {id: +userID}});
        if(!user) throw new UnauthorizedException('Invalid Token!');
        const order = this.orderRepository.create({
            user,
            status: 'PENDING',
            totalPrice: 0,
            createdAt: new Date()
        });
        return this.orderRepository.save(order);
    }

    async getOrders(userID: string) {
        const user = await this.userRepository.findOne({where: {id: +userID}});
        if(!user) throw new UnauthorizedException('Invalid Token!');
        if(user.role === 'ADMIN') {
            return this.orderRepository.find({
                relations: ['user', 'orderItems', 'orderItems.product'],
            });
        }
        return this.orderRepository.find({
            where: { user: { id: +userID } },
            relations: ['orderItems', 'orderItems.product'],
        });
    }
}
