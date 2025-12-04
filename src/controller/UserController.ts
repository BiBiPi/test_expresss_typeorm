import { AppDataSource } from "../data-source"
import { Request } from "express"
import { User } from "../entity/User"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async all() {
        return this.userRepository.find()
    }

    async one(request: Request) {
        const id = parseInt(request.params.id)

        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "Unregistered user"
        }

        return user
    }

    async save(request: Request) {

        const { name } = request.body;

        const user = Object.assign(new User(), {
            name: name
        })

        return this.userRepository.save(user)
    }

    async remove(request: Request) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "This user not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "User has been removed"
    }

}