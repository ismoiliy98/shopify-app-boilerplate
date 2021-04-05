import { useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import { ClientRouter as AppBridgeClientRouter } from '@shopify/app-bridge-react'

interface IClientRouterProps {
  onRouteStateChange: Function
}

const ClientRouter = memo<IClientRouterProps>((props) => {
  const { onRouteStateChange } = props

  const router = useRouter()

  useEffect(() => {
    let isSubscribed = true

    if (router.events) {
      router.events.on(
        'routeChangeStart',
        () => isSubscribed && onRouteStateChange(true)
      )
      router.events.on(
        'routeChangeComplete',
        () => isSubscribed && onRouteStateChange(false)
      )
      router.events.on(
        'routeChangeError',
        () => isSubscribed && onRouteStateChange(false)
      )
    }

    return () => {
      isSubscribed = false
    }
  }, [])

  return <AppBridgeClientRouter history={router} />
})

export default ClientRouter
