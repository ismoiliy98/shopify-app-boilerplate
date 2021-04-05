import Shopify from '@shopify/shopify-api'
import { createLogger } from './logger'
import { deleteAppFromShop } from './shop'

const log = createLogger('UTILS:WEBHOOK')

export const registerUninstallWebhook = async (shop: string) => {
  try {
    log.info(`Registring webhook with topic APP_UNISTALLED for shop: ${shop}`)

    const offlineSession = await Shopify.Utils.loadOfflineSession(shop)

    if (!offlineSession || !offlineSession.accessToken) {
      throw new Error(`Unable to load offline session for shop: ${shop}`)
    }

    const webhookResponse = await Shopify.Webhooks.Registry.register({
      shop,
      accessToken: offlineSession.accessToken,
      path: '/webhook/uninstall',
      topic: 'APP_UNINSTALLED',
      webhookHandler: deleteAppFromShop
    })

    if (!webhookResponse.success) {
      throw new Error(
        `Unable to register webhook with topic APP_UNISTALLED for shop: ${shop}`
      )
    }

    log.info(
      `Webhook with topic APP_UNISTALLED registred successfully for shop: ${shop}`
    )
  } catch (error) {
    log.error(error)
  }
}
