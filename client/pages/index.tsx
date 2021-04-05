import { Layout, Page } from '@shopify/polaris'
import { TitleBar } from '@shopify/app-bridge-react'

const IndexPage = () => {
  return (
    <Page>
      <TitleBar title="Page #1" />
      <Layout>
        <h1>Hello From Main Page!</h1>
      </Layout>
    </Page>
  )
}

export default IndexPage
