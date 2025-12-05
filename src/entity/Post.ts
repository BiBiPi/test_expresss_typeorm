import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    user_id: number

    @Column()
    title: string

    @Column()
    content: string

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date

}
