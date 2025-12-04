import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"

AppDataSource.initialize().then(async () => {

    // __ Create app __
    
    const app = express()
    app.use(bodyParser.json())

    // __ Register routes __
    
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            console.log(`[${+new Date()}] ${req.method} ${req.url}`)
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)
            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    app.listen(3000)

    console.log(`[${+new Date()}] server has started on port 3000`)

}).catch(error => console.log(error))
