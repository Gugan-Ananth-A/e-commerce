import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@WebSocketGateway({namespace: '/orders', cors: true})
export class OrdersGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinOrder')
  @UseGuards(AuthGuard)
  joinOrder(@MessageBody() data: {orderID: string}, @ConnectedSocket() client: Socket){
    const { orderID } = data;
    const roomName = `order-${orderID}`;
    client.join(roomName);
    client.emit('joinedOrder', {
      orderID,
      message: 'Successfully subscribed to order updates'
    });
  }

  @SubscribeMessage('leaveOrder')
  @UseGuards(AuthGuard)
  handleLeaveOrder(@MessageBody() data: {orderID: string}, @ConnectedSocket() client: Socket){
    const { orderID } = data;
    const roomName = `order-${orderID}`;
    client.leave(roomName);
    client.emit('leftOrder', {
      orderID,
      message: 'Unsubscribed from order updates'
    });
  }

  emitOrderStatus(orderID: string, status: string){
    const roomName = `order-${orderID}`;
    this.server.to(roomName).emit('orderStatusUpdate', {
      orderID,
      status,
      timestamp: new Date().toISOString()
    });
  }
}
