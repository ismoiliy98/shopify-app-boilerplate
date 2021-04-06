import ShopModel from '@database/models/Shop'
import { createLogger } from '@utils/logger'
import { registerUninstallWebhook } from '@utils/webhooks'

const log = createLogger('DB:SESSION')

export const getExistingShop = async (name: string) => {
  try {
    const result = await ShopModel.findOne({
      name
    })

    return result
  } catch (error) {
    log.error(error)
    return null
  }
}

export const createShop = async (name: string) => {
  try {
    const newShop = new ShopModel({
      name
    })

    await newShop.save()
    return newShop
  } catch (error) {
    log.error(error)
    return null
  }
}

export const activateShop = async (shop: string) => {
  try {
    const shopData = await getExistingShop(shop)

    if (shopData) {
      shopData.installed = true
      await shopData.save()
    }

    await registerUninstallWebhook(shop)
  } catch (error) {
    log.error(error)
  }
}

export const removeShop = async (name: string) => {
  try {
    log.info(`Removing shop: ${name} from DataBase`)
    await ShopModel.deleteOne({
      name
    })
  } catch (error) {
    log.error(error)
    throw error
  }
}
