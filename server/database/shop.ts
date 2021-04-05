import ShopModel from '@database/models/Shop'
import { createLogger } from '@utils/logger'

const log = createLogger('DB:SESSION')

export const shopExists = async (shop: string) => {
  try {
    const result = await ShopModel.exists({
      name: shop
    })

    return result
  } catch (error) {
    log.error(error)
    return false
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
