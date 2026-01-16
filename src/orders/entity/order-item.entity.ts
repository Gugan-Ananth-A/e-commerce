import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/products/entity/product.entity";

@Entity({name: 'order-item'})
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Order, (order) => order.orderItems, {cascade: true})
    order: Order;

    @OneToMany(() => Product, (product) => product.orderItems, {cascade: true})
    product: Product;

    @Column()
    quantity: number;

    @Column()
    price: number;
}