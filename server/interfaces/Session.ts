import { OnlineAccessInfo } from '@shopify/shopify-api'

export interface IOnlineSession {
  primary_id: string
  secondary_id?: string
  state: string
  isOnline: boolean | undefined
  scope: string
  expires?: Date | undefined
  accessToken: string | undefined
  onlineAccessInfo?: OnlineAccessInfo | undefined
}

export interface IOfflineSession {
  primary_id: string
  state: string
  isOnline: boolean | undefined
  scope: string
  accessToken: string | undefined
}
