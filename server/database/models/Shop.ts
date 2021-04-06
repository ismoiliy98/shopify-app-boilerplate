import { IOfflineSession, IOnlineSession } from '@interfaces/Session'
import { Schema, model, Document } from 'mongoose'

export interface IShopModel extends Document {
  _id: string
  name: string
  installed: boolean
  offlineSession: IOfflineSession | undefined
  onlineSession: IOnlineSession | undefined
}

export const OnlineSessionSchema = new Schema({
  primary_id: String,
  secondary_id: String,
  state: String,
  isOnline: Boolean,
  scope: String,
  expires: Date,
  accessToken: String,
  onlineAccessInfo: Schema.Types.Mixed
})

export const OfflineSessionSchema = new Schema({
  primary_id: String,
  state: String,
  isOnline: Boolean,
  scope: String,
  accessToken: String
})

const ShopSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  installed: {
    type: Boolean,
    default: false
  },
  offlineSession: {
    type: OfflineSessionSchema,
    default: undefined
  },
  onlineSession: {
    type: OnlineSessionSchema,
    default: undefined
  }
})

export default model<IShopModel>('shop', ShopSchema)
