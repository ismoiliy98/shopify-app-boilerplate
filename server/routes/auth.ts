import { Request, Response, Router } from 'express'
import { createLogger } from '@utils/logger'
import Shopify, { AuthQuery } from '@shopify/shopify-api'
import { topLevelRedirect } from '@utils/naviagtion'
import querystring from 'querystring'
import sha256 from 'crypto-js/sha256'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'
import { activateShop, getExistingShop } from '@database/shop'
import { validateShopParam } from '@utils/shop'

const log = createLogger('ROUTES:AUTH')

const redirected: { [id: string]: boolean } = {}

const getEncryptionForShop = (shop: string) => {
  const date = new Date()
  const nonce =
    date.getFullYear() + date.getMonth() + date.getDay() + date.getHours()
  const hashDigest = sha256(`${shop}_${Shopify.Context.API_KEY}_${nonce}`)
  const hmacDigest = Base64.stringify(
    hmacSHA512('/offline' + hashDigest, Shopify.Context.API_SECRET_KEY)
  )
  return hmacDigest
}

const getAuthRedirectRoute = async (
  req: Request,
  res: Response,
  shop: string,
  isOnline: boolean = true
) => {
  const authRoute = await Shopify.Auth.beginAuth(
    req,
    res,
    shop,
    isOnline ? '/auth/callback' : '/auth/offline/callback',
    isOnline
  )

  return authRoute
}

const redirectToOfflineAuth = (req: Request, res: Response, shop: string) => {
  const redSec = getEncryptionForShop(shop)
  const query = querystring.stringify({
    ...req.query,
    redSec
  })

  return res.redirect('/auth/offline?' + query)
}

const getAuthRoutes = () => {
  log.info('Configuring auth routes')
  const router = Router()

  router.all('*', validateShopParam())

  router
    .get('/', async (req, res) => {
      const shop = req.query.shop as string

      if (!redirected[shop]) {
        redirected[shop] = true
        return topLevelRedirect(
          res,
          shop,
          `https://${Shopify.Context.HOST_NAME}${req.originalUrl}`,
          Shopify.Context.API_KEY
        )
      }

      delete redirected[shop]

      try {
        if (req.query.updateOfflineToken) {
          delete req.query.updateOfflineToken
          return redirectToOfflineAuth(req, res, shop)
        }

        const exists = await getExistingShop(shop)

        if (!exists?.installed) {
          return redirectToOfflineAuth(req, res, shop)
        }

        const authRoute = await getAuthRedirectRoute(req, res, shop)
        return res.redirect(authRoute)
      } catch (error) {
        log.error(error)
        return res.status(500).send('Unexpected error occured')
      }
    })
    .get('/callback', async (req, res) => {
      const shop = req.query.shop as string
      const query = (req.query as unknown) as AuthQuery
      const { API_KEY } = Shopify.Context

      try {
        await Shopify.Auth.validateAuthCallback(req, res, query)
        return res.redirect(`https://${shop}/admin/apps/${API_KEY}`)
      } catch (error) {
        log.error(error)
        return res.status(500).send('Unexpected error occured')
      }
    })
    .get('/offline', async (req, res) => {
      const { redSec } = req.query
      const shop = req.query.shop as string

      if (typeof redSec !== 'string' || getEncryptionForShop(shop) !== redSec) {
        return res.status(403).send('Access denied')
      }

      try {
        const authRoute = await getAuthRedirectRoute(req, res, shop, false)
        return res.redirect(authRoute)
      } catch (error) {
        log.error(error)
        return res.status(500).send('Unexpected error occured')
      }
    })
    .get('/offline/callback', async (req, res) => {
      const shop = req.query.shop as string
      const query = (req.query as unknown) as AuthQuery

      try {
        await Shopify.Auth.validateAuthCallback(req, res, query)

        const shopData = await getExistingShop(shop)

        if (shopData && !shopData.installed) {
          await activateShop(shop)
        }

        const authRoute = await getAuthRedirectRoute(req, res, shop)
        return res.redirect(authRoute)
      } catch (error) {
        log.error(error)
        return res.status(500).send('Unexpected error occured')
      }
    })

  return router
}

export default getAuthRoutes
