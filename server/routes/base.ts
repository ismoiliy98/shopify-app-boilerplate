import { Router } from 'express'
import { createLogger } from '@utils/logger'
import { validateShopInstall, validateShopParam } from '@utils/shop'

const log = createLogger('ROUTES:BASE')

const getBaseRoutes = (requestHandler: any, staticRoutes: string[]) => {
  log.info('Configuring base routes')
  const router = Router()

  router.get(['/_next/static*', '/_next/webpack-hmr'], requestHandler)

  router.get(
    staticRoutes,
    validateShopParam(),
    validateShopInstall(),
    requestHandler
  )

  return router
}

export default getBaseRoutes
