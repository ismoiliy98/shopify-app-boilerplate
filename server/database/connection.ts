import mongoose, { ConnectOptions } from 'mongoose'
import { createLogger } from '@utils/logger'

const log = createLogger('DB:INDEX')

export const connectToDataBase = async (
  uri: string,
  options: ConnectOptions = {}
) => {
  if (!uri) {
    throw new Error('Invalid connection URI provided')
  }

  const CONNECTION_OPTIONS: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ...options
  }

  log.info('Connecting to MongoDB')
  await mongoose.connect(uri, CONNECTION_OPTIONS)
  log.info('Connection to MongoDB established')
}

export const disconnectFromDataBase = async () => {
  log.info('Disconnecting from MongoDB')
  await mongoose.disconnect()
  log.info('MongoDB disconnected')
}
