import * as express from 'express'
import { Request, Response } from 'express'
import { AppDataSource } from './data-source'
import { UserController } from './controller/UserController'
import { PostController } from './controller/PostController'
import * as jwt from 'jsonwebtoken';
import RequestWithUser from './types'

AppDataSource.initialize().then(async (appDataSource) => {

    // __ Create app __

    const app = express()
    app.use(express.json())

    // __ Middleware authorization __

    const auth = (request: RequestWithUser, response: Response, next: Function) => {
        const token = request.body.access_token

        if (!token) {
            return response.sendStatus(403)
        }

        const isAccess = jwt.verify(token, process.env.SECRET ?? 'TEST APP!!!')

        if (isAccess) {
            const payload = jwt.decode(token) as { id: number }
            request.user_id = payload.id
            next()
        } else {
            return response.sendStatus(403)
        }
    }

    // __ Register users routes __

    const userConstroller = new UserController(appDataSource);

    app.post('/sigin', userConstroller.signIn.bind(userConstroller))
    app.post('/users', userConstroller.save.bind(userConstroller))
    app.delete('/users/:id', userConstroller.remove.bind(userConstroller))

    // __ Register post routes __

    const postConstroller = new PostController(appDataSource);

    app.get('/posts', postConstroller.all.bind(postConstroller))
    app.put('/posts', auth, postConstroller.save.bind(postConstroller))
    app.delete('/posts/:id', auth, postConstroller.remove.bind(postConstroller))

    // __ Errors from MariaDB __

    app.use((error: any, request: Request, response: Response, next: Function) => {
        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(400).json({ message: 'Already exists' })
        } else if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
            return response.status(400).json({ message: 'Incorrect format' })
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return response.status(400).json({ message: 'Reference not found' })
        } else {
            console.error(`[${+new Date()}] ${error.message}`)
            return response.status(400).json({ message: 'Bad gateway' })
        }

        next()
    })

    app.listen(3000)

    console.log(`[${+new Date()}] server has started on port 3000`)

}).catch(error => console.log(error))

// __ Graceful shutdown __

process.on('SIGINT', async () => {
    AppDataSource.destroy()
    process.exit(0);
});