import debug from 'debug'

export const createLogger = (loggerName: string) => {
  const info = debug(`INFO:${loggerName.toUpperCase()}`)
  const error = debug(`ERROR:${loggerName.toUpperCase()}`)

  info.color = '4'
  error.color = '1'

  return {
    info,
    error
  }
}
