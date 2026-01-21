import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('product-image')
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.productImages, {onDelete: 'CASCADE'})
    product: Product;

    @Column({name: 'image_url'})
    imageUrl: string;

    @CreateDateColumn({name: 'created_at', type: 'timestamptz'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at', type: 'timestamptz'})
    updatedAt: Date;
}