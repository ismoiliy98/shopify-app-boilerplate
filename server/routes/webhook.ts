import Shopify from '@shopify/shopify-api'
import { createLogger } from '@utils/logger'
import { Router } from 'express'

const log = createLogger('ROUTES:WEBHOOK')

export const getWebhookRoutes = () => {
  log.info('Configuring webhook routes')

  const router = Router()

  router.post('/uninstall', async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res)
    } catch (error) {
      log.error(error)
    }
  })

  return router
}
