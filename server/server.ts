import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router
} from 'express'
import { createLogger } from '@utils/logger'
import next from 'next'
import { NextServer } from 'next/dist/server/next'
import { IServerSettings } from '@interfaces/Settings'

const log = createLogger('SERVER')

class Server {
  private port: number
  private app: Express
  private isReady = false
  private nextServer: NextServer
  private onServerClose: Function | undefined

  constructor(serverSettings: IServerSettings) {
    this.port = serverSettings.serverPort
    this.app = express()

    this.nextServer = next({
      dev: serverSettings.isDevelopment,
      dir: serverSettings.clientPath
    })
    this.onServerClose = serverSettings.onServerClose

    process.on('SIGINT', () => this.shutDownGracefully())
    process.on('SIGTERM', () => this.shutDownGracefully())
  }

  private async shutDownGracefully() {
    const forceTimer = setTimeout(() => {
      log.error('Time is out for gracefull shutdown. Using force exit')
      process.exit(1)
    }, 8000)

    try {
      console.log('\n')
      log.info('Gracefully shutting down')

      if (this.onServerClose) {
        await this.onServerClose()
      }

      log.info('Stopping Next.js server')
      await this.nextServer.close()
      log.info('Next.js server has been stopped')
    } catch (error) {
      log.error(error)
    } finally {
      clearTimeout(forceTimer)

      log.info('Exiting...')
      process.exit(0)
    }
  }

  public async init() {
    log.info('Initializng server')
    this.app = express()

    this.app.use((req: Request, _: Response, next: NextFunction) => {
      if (!req.url.startsWith('/_next/')) {
        log.info(`${req.method}:${req.url}`)
      }
      next()
    })

    await this.nextServer.prepare()
    this.isReady = true

    return this.nextServer
  }

  public configureRouters(rootRouter: Router) {
    this.app.use('/', rootRouter)
    log.info('All routers configured')
  }

  public launch() {
    if (!this.isReady) {
      log.error('Server is not initialized. Please, use init method first')
      process.exit(1)
    }

    this.app.listen(this.port, () =>
      log.info(`Server is ready on the http://localhost:${this.port}`)
    )
  }
}

export default Server
