import { Processor, WorkerHost } from "@nestjs/bullmq";
import { OrdersService } from "./orders.service";
import { Job } from "bullmq";

@Processor('orders-queue')
export class OrdersProcessor extends WorkerHost {
  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  sleep = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

  async process(job: Job) {
    if (job.name === 'process-order') {
      const { orderID, userID } = job.data;
      await this.ordersService.updateOrderStatus(orderID, 'PROCESSING', userID);
      await this.sleep(2000);
      await this.ordersService.updateOrderStatus(orderID, 'CONFIRMED', userID);
    }
  }
}
