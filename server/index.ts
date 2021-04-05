import './utils/bootstrap'
import { getSettings } from '@utils/settings'
import { createLogger } from '@utils/logger'
import Server from './server'
import { connectToDataBase, disconnectFromDataBase } from '@database/connection'
import getRootRouter from '@routes/root'
import configureShopifyContext from '@utils/Shopify'
import { IServerSettings } from '@interfaces/Settings'

const log = createLogger('INDEX')

log.info('Starting application')

const settings = getSettings()
configureShopifyContext(settings)

const serverSettings: IServerSettings = {
  onServerClose: disconnectFromDataBase,
  serverPort: settings.PORT,
  isDevelopment: settings.NODE_ENV !== 'production',
  clientPath: settings.CLIENT_PATH
}

const server = new Server(serverSettings)

server
  .init()
  .then(async (nextServer) => {
    await connectToDataBase(settings.MONGODB_URL)

    const requestHandler = nextServer.getRequestHandler()

    // Not recommended, accessing private variable! TODO: replace with better solution
    // @ts-ignore
    const staticRoutes = (nextServer.server.sortedRoutes as string[]) || []
    const rootRouter = getRootRouter(requestHandler, staticRoutes)

    server.configureRouters(rootRouter)
    log.info('Server is ready to launch')
    server.launch()
  })
  .catch(log.error)
