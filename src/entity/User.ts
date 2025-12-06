import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm'
import { Post } from './Post'

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column({ unique: true })
    username: string

    @Column()
    password: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date

    @OneToMany(() => Post, (post) => post.user_id)
    posts: Post[];

}