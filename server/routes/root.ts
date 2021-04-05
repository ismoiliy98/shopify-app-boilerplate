import { createLogger } from '@utils/logger'
import { Router } from 'express'
import getBaseRoutes from './base'
import getAuthRoutes from './auth'
import { getWebhookRoutes } from './webhook'
import { getGraphQLRoutes } from './graphql'
import { validateShopAuth, validateShopParam } from '@utils/shop'
import { getSampleApiRoutes } from './sample'

const log = createLogger('ROUTES:ROOT')
const getRootRouter = (requestHandler: any, staticRoutes: string[]) => {
  log.info('Configuring root router')
  const rootRouter = Router()

  log.info('Merging all routers')
  rootRouter.use('/', getBaseRoutes(requestHandler, staticRoutes))
  rootRouter.use('/auth', getAuthRoutes())
  rootRouter.use('/webhook', getWebhookRoutes())
  rootRouter.use('/graphql', getGraphQLRoutes())
  rootRouter.use('/api*', validateShopParam(), validateShopAuth())
  rootRouter.use('/api/sample', getSampleApiRoutes())

  return rootRouter
}

export default getRootRouter
