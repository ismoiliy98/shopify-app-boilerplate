import { ISettings } from '@interfaces/Settings'
import { createLogger } from '@utils/logger'
import path from 'path'

const log = createLogger('SETTINGS')

export const getSettings = (): ISettings => {
  const {
    NODE_ENV,
    HOST,
    PORT,
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET,
    SHOPIFY_API_SCOPES,
    MONGODB_URL,
    CLIENT_PATH
  } = process.env

  if (
    !HOST ||
    !SHOPIFY_API_KEY ||
    !SHOPIFY_API_SECRET ||
    !SHOPIFY_API_SCOPES ||
    !MONGODB_URL
  ) {
    log.error('Invalid / Missing parameter(s). Please, check .env file')
    process.exit(1)
  }

  const clientRelativePath = path.resolve(
    __dirname,
    path.relative(
      __dirname,
      path.resolve(__dirname, '..', '..', CLIENT_PATH || 'client')
    )
  )

  return {
    NODE_ENV: NODE_ENV || 'development',
    PORT: parseInt(PORT || '', 10) || 3000,
    HOST,
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET,
    SHOPIFY_API_SCOPES,
    MONGODB_URL,
    CLIENT_PATH: clientRelativePath
  }
}
