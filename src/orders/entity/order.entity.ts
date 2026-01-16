import { User } from "src/users/entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity({name: 'order'})
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.orders, {cascade: true})
    user: User;

    @Column()
    status: string;

    @Column({name: 'total_price'})
    totalPrice: number;

    @Column({name: 'created_at', type: 'timestamptz'})
    createdAt: Date;

    @OneToMany(() => OrderItem, (item) => item.order, {cascade: true})
    orderItems: OrderItem[]
}
