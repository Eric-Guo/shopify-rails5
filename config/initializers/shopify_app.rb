ShopifyApp.configure do |config|
  config.application_name = "SH Hackathon No.21"
  config.api_key = Rails.application.credentials.shopify_api_key
  config.secret = Rails.application.credentials.shopify_api_secret
  config.old_secret = ""
  config.scope = "read_products, write_script_tags" # Consult this page for more scope options:
                                 # https://help.shopify.com/en/api/getting-started/authentication/oauth/scopes
  config.embedded_app = true
  config.after_authenticate_job = false
  config.api_version = "2019-07"
  config.session_repository = ShopifyApp::InMemorySessionStore
  config.scripttags = [{
    event: 'onload',
    src: "https://ericguo.ggrok.com/jquery.slotmachine.js"
  },{
    event: 'onload',
    src: "https://ericguo.ggrok.com/welcome_bar.js"
  }]
end

# ShopifyApp::Utils.fetch_known_api_versions                        # Uncomment to fetch known api versions from shopify servers on boot
# ShopifyAPI::ApiVersion.version_lookup_mode = :raise_on_unknown    # Uncomment to raise an error if attempting to use an api version that was not previously known
