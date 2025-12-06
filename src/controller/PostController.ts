import { NextFunction, Request, Response } from 'express'
import { Post } from '../entity/Post'
import { DataSource, Repository } from 'typeorm'
import RequestWithUser from '../types'

export class PostController {
    private repository: Repository<Post>

    constructor(appDataSource: DataSource) {
        this.repository = appDataSource.getRepository(Post)
    }

    async all(request: Request, response: Response, next: NextFunction) {
        const page = parseInt(request.params.page)
        const limit = parseInt(request.params.limit)

        console.log(page, limit)

        try {
            const posts = await this.repository.createQueryBuilder()
                .limit(limit)
                .skip(page * limit)
                .getMany()

            return response.json(posts)
        } catch (error: any) {
            next(error)
        }
    }

    async save(request: RequestWithUser, response: Response, next: NextFunction) {
        const { title, content } = request.body as Pick<Post, 'title' | 'content'>;

        const newPost = new Post()
        newPost.user_id = request.user_id!
        newPost.title = title
        newPost.content = content

        const user = await this.repository.save(newPost).catch(next)
        if (user) {
            return response.json(user)
        }
    }

    async edit(request: RequestWithUser, response: Response, next: NextFunction) {
        const { id, title, content } = request.body as Omit<Post, 'created_at' | 'updated_at' | 'user_id'>;

        const isUpdate = await this.repository.update({ id: id, user_id: request.user_id! }, { title: title, content: content }).catch(next)
        if (isUpdate) {
            return response.json({ message: 'Post has been edit' })
        }
    }

    async remove(request: RequestWithUser, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let postToRemove = await this.repository.findOneBy({ id: id, user_id: request.user_id! }).catch(next)

        if (!postToRemove) {
            return 'Post not found'
        }

        const isDelete = await this.repository.remove(postToRemove).catch(next)
        if (isDelete) {
            return response.json({ message: 'Post has been removed' })
        }
    }
}