import { useEffect, createContext, ReactNode, FunctionComponent } from 'react'
import { Redirect } from '@shopify/app-bridge/actions'
import { getSessionToken } from '@shopify/app-bridge-utils'
import { useAppBridge } from '@shopify/app-bridge-react'
import axios, { AxiosError, AxiosInstance } from 'axios'

interface IAxiosProviderProps {
  apiKey: string
  shopOrigin: string
  children: ReactNode
}

const coreInstace = axios.create()

export const AxiosContext = createContext<AxiosInstance>(coreInstace)

export const AxiosProvider: FunctionComponent<IAxiosProviderProps> = (
  props
) => {
  const { apiKey, shopOrigin, children } = props
  const app = useAppBridge()
  const redirect = Redirect.create(app)

  useEffect(() => {
    coreInstace.defaults.params = {
      shop: shopOrigin
    }

    coreInstace.interceptors.request.use((config) =>
      getSessionToken(app).then((token) => {
        config.headers['Authorization'] = `Bearer ${token}`
        return config
      })
    )

    coreInstace.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          redirect.dispatch(
            Redirect.Action.REMOTE,
            `https://${shopOrigin}/admin/apps/${apiKey}/auth?shop=${shopOrigin}`
          )
        }

        throw error
      }
    )
  }, [])

  return (
    <AxiosContext.Provider value={coreInstace}>
      {children}
    </AxiosContext.Provider>
  )
}
