import { Order } from "src/orders/entity/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'user'})
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({name: 'first_name'})
    firstName: string;

    @Column({name: 'last_name', nullable: true})
    lastName: string;

    @Column()
    role: string;

    @Column({type: 'timestamptz', name: 'created_at'})
    createdAt: Date;

    @Column({type: 'timestamptz', name: 'updated_at'})
    updatedAt: Date;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]
}