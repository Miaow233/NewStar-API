import http, { Server } from 'http'
import fs from 'fs'
import path from 'path'
import swaggerUI from 'swagger-ui-express'
import jsYaml from 'js-yaml'
import compression from 'compression'
import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { middleware as OpenAPIValidatorMiddleware } from 'express-openapi-validator'
import { rateLimit } from 'express-rate-limit'
import logger from './logger'
import config from './config'

export default class ExpressServer {
    port: number
    app: Application
    openApiPath: any
    schema: any
    server!: Server
    constructor(port: number, openApiYaml: string) {
        this.port = port
        this.app = express()
        this.openApiPath = openApiYaml
        try {
            //@ts-ignore
            this.schema = jsYaml.safeLoad(fs.readFileSync(openApiYaml))
        } catch (e: any) {
            logger.error('failed to start Express Server', e.message)
        }
        this.setupMiddleware()
    }

    setupMiddleware() {
        this.app.use(cors())
        this.app.use(bodyParser.json({ limit: '14MB' }))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(cookieParser())
        this.app.use(compression())

        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
            standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
            // store: ... , // Use an external store for consistency across multiple server instances.
        })

        this.app.use(limiter)

        // 页面渲染引擎: pug
        this.app.set('views', path.join(__dirname, 'views'))
        this.app.set('view engine', 'pug')

        this.app.use(express.static(path.join(__dirname, 'public')))

        /** OpenAPI相关组件 */
        //Simple test to see that the server is up and responding
        this.app.get('/hello', (req, res) => res.send(`Hello World. path: ${this.openApiPath}`))
        //Send the openapi document *AS GENERATED BY THE GENERATOR*
        this.app.get('/openapi', (req, res) => res.sendFile(path.join(__dirname, 'openapi.yaml')))
        //View the openapi document in a visual interface. Should be able to test from this page
        this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(this.schema))
        this.app.get('/login-redirect', (req, res) => {
            res.status(200)
            res.json(req.query)
        })
        this.app.get('/oauth2-redirect.html', (req, res) => {
            res.status(200)
            res.json(req.query)
        })

        /** 自定义路由 */
        this.app.get('/', (req, res) => {
            res.render('index', { title: 'Express' })
        })
    }

    launch() {
        // Install the OpenApiValidator onto your express app
        this.app.use(
            OpenAPIValidatorMiddleware({
                apiSpec: this.openApiPath,
                validateResponses: false,
                validateRequests: false,
                operationHandlers: path.join(__dirname),
                fileUploader: { dest: config.FILE_UPLOAD_PATH },
            })
        )

        this.server = http.createServer(this.app)
        this.server.listen(this.port)
        console.log(`Listening on port ${this.port}`)
    }

    async close() {
        if (this.server !== undefined) {
            await this.server.close()
            console.log(`Server on port ${this.port} shut down`)
        }
    }
}
