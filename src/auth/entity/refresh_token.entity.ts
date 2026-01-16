import { User } from "src/users/entity/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'refresh_token'})
export class RefreshToken {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @OneToOne(() => User, (user) => user.id, {cascade: true})
    @JoinColumn({name: 'user_id'})
    userID: number;

    @Column({type: 'timestamptz', name: 'expires_at'})
    expiresAt: Date;

    @Column({type: 'timestamptz', name: 'updated_at'})
    updatedAt: Date;
}