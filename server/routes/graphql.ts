import Shopify from '@shopify/shopify-api'
import { createLogger } from '@utils/logger'
import { validateShopAuth, validateShopParam } from '@utils/shop'
import { Router } from 'express'

const log = createLogger('ROUTES:GRAPHQL')

export const getGraphQLRoutes = () => {
  log.info('Configuring GraphQL routes')

  const router = Router()

  router.all('*', validateShopParam(), validateShopAuth())

  router.post('/', async (req, res) => {
    res.status(304)
    await Shopify.Utils.graphqlProxy(req, res)
  })

  return router
}
