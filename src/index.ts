import * as express from 'express'
import { Request, Response } from 'express'
import { AppDataSource } from './data-source'
import { UserController } from './controller/UserController'
import { PostController } from './controller/PostController'

AppDataSource.initialize().then(async (appDataSource) => {

    // __ Create app __

    const app = express()
    app.use(express.json())

    // __ Register none autorization route __


    // __ Middleware authorization __

    app.use((request: Request, response: Response, next: Function) => {
       next()
    })

    // __ Register users routes __

    const userConstroller = new UserController(appDataSource);

    app.get('/users/:id', userConstroller.one.bind(userConstroller))
    app.put('/users', userConstroller.save.bind(userConstroller))
    app.delete('/users/:id', userConstroller.remove.bind(userConstroller))

    // __ Register post routes __

    const postConstroller = new PostController(appDataSource);

    app.get('/posts', postConstroller.all.bind(postConstroller))
    app.get('/posts/:id', postConstroller.one.bind(postConstroller))
    app.put('/posts', postConstroller.save.bind(postConstroller))
    app.put('/posts/user/:user_id', postConstroller.byUser.bind(postConstroller))
    app.delete('/posts/:id', postConstroller.remove.bind(postConstroller))

    
    // __ Errors from MariaDB __
    
    app.use((error: any, request: Request, response: Response, next: Function) => {
        if (error.code === 'ER_DUP_ENTRY') {
            response.status(400).json({ message: 'Already exists' })
        } else if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
            response.status(400).json({ message: 'Incorrect format' })
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            response.status(400).json({ message: 'Reference not found' })
        } else {
            console.error(`[${+new Date()}] ${error.message}`)
            response.status(400).json({ message: 'Bad gateway' })
        }
    })


    app.listen(3000)

    console.log(`[${+new Date()}] server has started on port 3000`)

}).catch(error => console.log(error))

// __ Graceful shutdown __

process.on('SIGINT', async () => {
    AppDataSource.destroy()
    process.exit(0);
});

