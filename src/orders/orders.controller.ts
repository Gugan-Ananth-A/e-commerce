import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
    
    @Get()
    @UseGuards(AuthGuard)
    getOrders(@Req() req: Request) {
      const payload = req['payload'];
      return this.ordersService.getOrders(payload.sub);
    }

    @Post('item')
    @UseGuards(AuthGuard)
    createOrderItem(@Req() req: Request, @Body() dto: CreateOrderItemDto){
        const payload = req['payload'];
        return this.ordersService.createOrderItem(dto, payload.sub);
    }

    @Post()
    @UseGuards(AuthGuard)
    createOrder(@Req() req: Request) {
      const payload = req['payload'];
      return this.ordersService.createOrder(payload.sub);
    }
}
