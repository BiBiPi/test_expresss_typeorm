import { NextFunction, Request, Response } from 'express'
import { Post } from '../entity/Post'
import { DataSource, Repository } from 'typeorm'

export class PostController {
    private repository: Repository<Post>

    constructor(appDataSource: DataSource) {
        this.repository = appDataSource.getRepository(Post)
    }

    async all(request: Request, response: Response, next: NextFunction) {
        response.json(await this.repository.find().catch(next))
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const post = await this.repository.findOne({
            where: { id: id }
        }).catch(next)

        if (!post) {
            return 'Post not found'
        }

        response.json(post)
    }

    async byUser(request: Request, response: Response, next: NextFunction) {
        const userId = parseInt(request.params.user_id)

        const posts = await this.repository.find({
            where: { user_id: userId }
        }).catch(next)

        if (!posts) {
            return 'Posts not found'
        }

        response.json(posts)
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { user_id, title, content } = request.body;

        const post = Object.assign(new Post(), {
            user_id: user_id,
            title: title,
            content: content,
        })

        const user = await this.repository.save(post).catch(next)

        response.json(user)
    }

    async edit(request: Request, response: Response, next: NextFunction) {
        const post = request.body as Partial<Post>;

        await this.repository.update({ id: post.id }, post).catch(next)

        response.json({ message: 'Post has been edit' })
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let postToRemove = await this.repository.findOneBy({ id }).catch(next)

        if (!postToRemove) {
            return 'Post not found'
        }

        await this.repository.remove(postToRemove).catch(next)

        response.json({ message: 'Post has been removed' })
    }
}