const { Shopify } = require('@shopify/shopify-api')

module.exports = {
  env: {
    API_KEY: Shopify.Context.API_KEY
  }
}
