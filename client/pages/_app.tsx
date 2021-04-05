import { NextPageContext } from 'next'
import { useCallback, useState } from 'react'
import { Provider, Loading } from '@shopify/app-bridge-react'

import ClientRouter from '@components/ClientRouter'
import { AxiosProvider } from '@contexts/AxiosContext'

import { AppProvider } from '@shopify/polaris'
import translations from '@shopify/polaris/locales/en.json'
import '@shopify/polaris/dist/styles.css'

interface IMyAppProps {
  Component: React.FunctionComponent
  pageProps: any
  shopOrigin: string
}

const MyApp = (props: IMyAppProps) => {
  const { Component, pageProps, shopOrigin } = props
  const API_KEY = process.env.API_KEY || ''

  const [isRouteLoading, setRouteLoading] = useState<boolean>(false)

  const onRouteStateChange = useCallback(
    (isLoading: boolean) => {
      setRouteLoading(isLoading)
    },
    [setRouteLoading]
  )

  return (
    <Provider config={{ apiKey: API_KEY, shopOrigin, forceRedirect: true }}>
      <AppProvider i18n={translations} features={{ newDesignLanguage: true }}>
        <ClientRouter onRouteStateChange={onRouteStateChange} />
        {isRouteLoading && <Loading />}
        <AxiosProvider apiKey={API_KEY} shopOrigin={shopOrigin}>
          <Component {...pageProps} />
        </AxiosProvider>
      </AppProvider>
    </Provider>
  )
}

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  return {
    shopOrigin: ctx.query.shop
  }
}

export default MyApp
