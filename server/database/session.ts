import ShopModel, { IShopModel } from '@database/models/Shop'
import { IOfflineSession, IOnlineSession } from '@interfaces/Session'
import { Session } from '@shopify/shopify-api/dist/auth/session'
import { createLogger } from '@utils/logger'
import { FilterQuery } from 'mongoose'
import { createShop, shopExists } from './shop'

const log = createLogger('DB:SESSION')

export const saveSession = async (session: Session) => {
  const {
    shop,
    id,
    state,
    isOnline,
    scope,
    expires: defaultExpires,
    accessToken,
    onlineAccessInfo
  } = session

  const cursor = (isOnline && 'onlineSession') || 'offlineSession'

  try {
    const exists = await shopExists(shop)
    const shopData = await (!exists
      ? createShop(shop)
      : ShopModel.findOne({
          name: shop
        }))

    if (!shopData) {
      throw new Error(`Unable to create / find shop: ${shop}`)
    }

    let primary_id = id
    let secondary_id = ''
    let expires: Date | undefined = defaultExpires || new Date()

    if (cursor === 'onlineSession') {
      primary_id =
        (id.includes(shop) && id) || shopData[cursor]?.primary_id || ''
      secondary_id =
        (!id.includes(shop) && id) || shopData[cursor]?.secondary_id || ''
      expires =
        expires >= (shopData[cursor]?.expires || new Date())
          ? expires
          : shopData[cursor]?.expires
    }

    shopData[cursor] = {
      primary_id,
      state,
      isOnline,
      scope,
      accessToken,
      ...(isOnline && { expires, onlineAccessInfo, secondary_id })
    }
    await shopData.save()

    return true
  } catch (error) {
    log.error(error)
    return false
  }
}

export const loadSession = async (sessionId: string) => {
  const cursor =
    (sessionId.startsWith('offline_') && 'offlineSession') || 'onlineSession'

  const filterQuery: FilterQuery<IShopModel> =
    cursor === 'onlineSession'
      ? {
          $or: [
            { [cursor + '.primary_id']: sessionId },
            { [cursor + '.secondary_id']: sessionId }
          ]
        }
      : {
          [cursor + '.primary_id']: sessionId
        }

  try {
    const shopData = await ShopModel.findOne(filterQuery)

    const sessionData: (IOnlineSession & IOfflineSession) | undefined =
      shopData?.[cursor] || undefined

    if (!shopData || !sessionData) {
      return undefined
    }

    const session = new Session(sessionId)
    session.shop = shopData.name
    session.state = sessionData.state
    session.isOnline = sessionData.isOnline
    session.accessToken = sessionData.accessToken
    session.expires = sessionData.expires
    session.scope = sessionData.scope
    session.onlineAccessInfo = sessionData.onlineAccessInfo
    return session
  } catch (error) {
    log.error(error)
    return undefined
  }
}

export const deleteSession = async (sessionId: string) => {
  const cursor =
    (sessionId.startsWith('offline_') && 'offlineSession') || 'onlineSession'

  try {
    const shopData = await ShopModel.findOne({
      $or: [
        { [cursor + '.primary_id']: sessionId },
        { [cursor + '.secondary_id']: sessionId }
      ]
    })

    const sessionData: (IOnlineSession & IOfflineSession) | undefined =
      shopData?.[cursor] || undefined

    if (!shopData || !sessionData) {
      throw new Error(`Unable to find session ${sessionId}`)
    }

    shopData[cursor] = undefined
    await shopData.save()
    return true
  } catch (error) {
    log.error(error)
    return false
  }
}
