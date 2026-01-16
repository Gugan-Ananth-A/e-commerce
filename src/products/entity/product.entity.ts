import { OrderItem } from "src/orders/entity/order-item.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { ProductImage } from "./product-image.entity";

@Entity({name: 'product'})
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    stock: number;

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category[];

    @Column({type: 'timestamptz', name: 'updated_at'})
    updatedAt: Date;

    @Column({type: 'timestamptz', name: 'created_at'})
    createdAt: Date;

    @OneToMany(() => ProductImage, (image) => image.product, {cascade: true})
    productImages: ProductImage[]
}