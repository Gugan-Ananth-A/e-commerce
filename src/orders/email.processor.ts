import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { OrdersService } from "./orders.service";

@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
    constructor(private readonly orderService: OrdersService) {
        super();
    }

    async process(job: Job) {
      if(job.name === 'order-confirmation'){
        const { userEmail, orderId, totalPrice } = job.data;
        await this.orderService.sendOrderConfirmation(userEmail, orderId, totalPrice);
      }
    }
}