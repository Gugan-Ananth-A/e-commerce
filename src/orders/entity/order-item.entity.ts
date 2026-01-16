import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/products/entity/product.entity";

@Entity({name: 'order-item'})
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.orderItems, {onDelete: 'CASCADE'})
    order: Order;

    @ManyToOne(() => Product, (product) => product.orderItems, {onDelete: 'CASCADE'})
    product: Product;

    @Column()
    quantity: number;

    @Column()
    price: number;
}