import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, JoinColumn } from 'typeorm'
import { User } from './User'

@Entity({ name: 'posts' })
export class Post {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id' })
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