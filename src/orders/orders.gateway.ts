import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@WebSocketGateway({namespace: '/orders'})
export class OrdersGateway {

  @WebSocketServer()
  server: Server;

  private orderSubscriptions = new Map<string, Set<string>>();

  handleDisconnection(client: Socket){
    this.orderSubscriptions.forEach((clients, orderID) => {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.orderSubscriptions.delete(orderID);
      }
    });
  }

  @SubscribeMessage('joinOrder')
  @UseGuards(AuthGuard)
  joinOrder(@MessageBody() data: {orderID: string}, @ConnectedSocket() client: Socket){
    const { orderID } = data;
    const roomName = `order-${orderID}`;
    client.join(roomName);
    if (!this.orderSubscriptions.has(orderID)) {
      this.orderSubscriptions.set(orderID, new Set());
    }
    this.orderSubscriptions.get(orderID)?.add(client.id);
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
    client.join(roomName);
    const subscribers = this.orderSubscriptions.get(orderID);
    if (subscribers) {
      subscribers.delete(client.id);
      if (subscribers.size === 0) {
        this.orderSubscriptions.delete(orderID);
      }
    }
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
