import { Request, Response, NextFunction } from 'express'
import { User } from '../entity/User'
import { DataSource, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class UserController {
    private repository: Repository<User>

    constructor(appDataSource: DataSource) {
        this.repository = appDataSource.getRepository(User)
    }

    async signIn(request: Request, response: Response, next: NextFunction) {
        const { username, password } = request.body as Pick<User, 'username' | 'password'>;

        const user = await this.repository.findOne({
            where: { username: username }
        }).catch(next)

        if (!user) {
            return response.status(403)
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return response.status(403)
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET ?? 'TEST APP!!!', { expiresIn: '7d' })
        return response.json({ access_token: token })
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { username, password } = request.body as Pick<User, 'username' | 'password'>;

        const salt = await bcrypt.genSalt();
        const hashPass = await bcrypt.hash(password, salt);

        const newUser = new User()
        newUser.username = username
        newUser.password = hashPass

        const user = await this.repository.save(newUser).catch(next)
        if (user) {
            const token = jwt.sign({ id: user.id }, process.env.SECRET ?? 'TEST APP!!!', { expiresIn: '7d' })
            return response.json({ access_token: token })
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.repository.findOneBy({ id: id }).catch(next)

        if (!userToRemove) {
            return 'User not found'
        }

        const isDelete = await this.repository.remove(userToRemove).catch(next)
        if (isDelete) {
            return response.json({ message: 'User has been removed' })
        }
    }
}