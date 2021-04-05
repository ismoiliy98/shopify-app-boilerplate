import { useState, useContext } from 'react'
import { Card, Layout, Page, Stack, TextStyle } from '@shopify/polaris'
import { TitleBar } from '@shopify/app-bridge-react'
import { AxiosContext } from '@contexts/AxiosContext'

const SamplePage = () => {
  const coreInstace = useContext(AxiosContext)
  const [sampleData, setSampleData] = useState<any>({})

  const loadSampleData = () => {
    coreInstace
      ?.get('/api/sample')
      .then((res) => {
        if (res.data) {
          setSampleData(res.data)
        }
      })
      .catch(console.error)
  }

  return (
    <Page title="Hello From Sample Page!">
      <TitleBar title="Page #2" />
      <Layout sectioned>
        <Card
          title="Test sample API"
          sectioned
          primaryFooterAction={{
            content: 'Load sample data',
            onAction: loadSampleData
          }}
        >
          {sampleData && (
            <Stack spacing="loose" distribution="center">
              <TextStyle variation="code">
                <pre
                  style={{
                    padding: '1rem'
                  }}
                >
                  {JSON.stringify(sampleData, null, 2)}
                </pre>
              </TextStyle>
            </Stack>
          )}
        </Card>
      </Layout>
    </Page>
  )
}

export default SamplePage
