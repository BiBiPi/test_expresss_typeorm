import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE', nullable: false })
    user_id: number

    @Column()
    title: string

    @Column()
    content: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date

}