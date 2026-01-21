import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'category'})
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({type: 'timestamptz', name: 'created_at'})
    createdAt: Date;
}