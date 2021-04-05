import { removeShop, shopExists } from '@database/shop'
import Shopify from '@shopify/shopify-api'
import { createLogger } from './logger'
import { NextFunction, Request, Response } from 'express'
import { topLevelRedirect } from './naviagtion'

const log = createLogger('UTILS:SHOP')

export const validateShopParam = () => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { shop } = req.query

  if (typeof shop !== 'string' || !Shopify.Utils.validateShop(shop)) {
    res.status(400).send('Invalid shop parameter')
  } else {
    next()
  }
}

export const validateShopInstall = () => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const shop = req.query.shop as string

  try {
    const exist = await shopExists(shop)

    if (!exist) {
      topLevelRedirect(res, shop, `/auth?shop${shop}`, Shopify.Context.API_KEY)
    } else {
      next()
    }
  } catch (error) {
    log.error(error)
    topLevelRedirect(res, shop, `/auth?shop${shop}`, Shopify.Context.API_KEY)
  }
}

export const validateShopAuth = () => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, true)

    if (
      session &&
      Shopify.Context.SCOPES.equals(session.scope) &&
      session.accessToken &&
      (!session.expires || session.expires >= new Date())
    ) {
      next()
    } else {
      res.status(401).send('Unauthorized')
    }
  } catch (error) {
    log.error(error)
    res.status(401).send('Unauthorized')
  }
}

export const deleteAppFromShop = async (
  _: string,
  shop: string,
  __: string
) => {
  if (!Shopify.Utils.validateShop(shop)) {
    log.error('Invalid shop parameter provided')
    return
  }

  log.info(`Unistalling app from shop: ${shop}`)

  try {
    await removeShop(shop)
    log.info(`App successfully uninstalled from shop: ${shop}`)
  } catch (error) {
    log.error(error)
    log.info(
      `Unexpected error occured while uninstalling app from shop: ${shop}`
    )
  }
}
