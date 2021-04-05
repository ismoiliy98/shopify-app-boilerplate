export interface ISettings {
  NODE_ENV: string
  PORT: number
  HOST: string
  SHOPIFY_API_KEY: string
  SHOPIFY_API_SECRET: string
  SHOPIFY_API_SCOPES: string
  MONGODB_URL: string
  CLIENT_PATH: string
}

export interface IServerSettings {
  onServerClose?: Function | undefined
  serverPort: number
  isDevelopment: boolean
  clientPath: string
}
