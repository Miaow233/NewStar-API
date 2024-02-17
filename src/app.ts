import config from './config'
import logger from './logger'
import ExpressServer from './expressServer'

const launchServer = async () => {
    const expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML)
    try {
        expressServer.launch()
        logger.info('Express server running')
    } catch (error: any) {
        logger.error('Express Server failure', error.message)
        console.error(error.stack)
        await expressServer.close()
    }
}

launchServer().catch((e) => logger.error(e))
