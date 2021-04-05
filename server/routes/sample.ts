import { createLogger } from '@utils/logger'
import { Router } from 'express'

const log = createLogger('ROUTES:SAMPLE')

export const getSampleApiRoutes = () => {
  log.info('Configuring sample routes')

  const router = Router()

  router.get('/', async (req, res) => {
    const shop = req.query.shop as string

    res.send({
      shop,
      result: {
        success: true,
        title: 'The app is working correctly',
        message:
          'Congratulations! You have successfully installed the application to your store!'
      }
    })
  })

  return router
}
