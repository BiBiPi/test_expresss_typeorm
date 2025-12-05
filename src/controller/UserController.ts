import { Request, Response, NextFunction } from 'express'
import { User } from '../entity/User'
import { DataSource, Repository } from 'typeorm'

export class UserController {
    private repository: Repository<User>

    constructor(appDataSource: DataSource) {
        this.repository = appDataSource.getRepository(User)
    }

    async all(request: Request, response: Response, next: NextFunction) {
        response.json(await this.repository.find().catch(next))
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const user = await this.repository.findOne({
            where: { id: id }
        }).catch(next)

        if (!user) {
            return response.status(400).json({ error: 'User' })
        }

        response.json(user)
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { username, password } = request.body;

        const user = Object.assign(new User(), {
            username: username,
            password: password,
        })

        response.json(await this.repository.save(user).catch(next))
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.repository.findOneBy({ id: id }).catch(next)

        if (!userToRemove) {
            return 'User not found'
        }

        await this.repository.remove(userToRemove).catch(next)

        response.json({ message: 'User has been removed' })
    }
}