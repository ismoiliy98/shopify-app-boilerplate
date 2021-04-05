import { Shopify, ApiVersion } from '@shopify/shopify-api'
import { ISettings } from '@interfaces/Settings'
import { deleteSession, loadSession, saveSession } from '@database/session'

const configureShopifyContext = (settings: ISettings) => {
  Shopify.Context.initialize({
    API_KEY: settings.SHOPIFY_API_KEY,
    API_SECRET_KEY: settings.SHOPIFY_API_SECRET,
    SCOPES: settings.SHOPIFY_API_SCOPES.split(','),
    HOST_NAME: settings.HOST.replace(/https:\/\//, ''),
    API_VERSION: ApiVersion.October20,
    IS_EMBEDDED_APP: true,
    SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
      saveSession,
      loadSession,
      deleteSession
    )
  })
}

export default configureShopifyContext
