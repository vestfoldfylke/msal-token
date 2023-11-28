(async () => {
  const { getAccessToken } = require('./index')
  const { readFileSync } = require('fs')
  require('dotenv').config()

  const { PFX_PATH, PFX_PRIVATE_KEY_PASSPHRASE, THUMBPRINT, CLIENT_ID, TENANT_ID, CLIENT_SECRET, TENANT_NAME } = process.env

  const pfxcert = readFileSync(PFX_PATH).toString('base64')
  
  const authConfigSecret = {
    tenantId: TENANT_ID,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    scopes: ['https://graph.microsoft.com/.default']
  }

  const authConfigPfx = {
    tenantId: TENANT_ID,
    clientId: CLIENT_ID,
    thumbprint: THUMBPRINT,
    pfxcert,
    pfxPassphrase: PFX_PRIVATE_KEY_PASSPHRASE || null,
    scopes: [`https://${TENANT_NAME}.sharepoint.com/.default`]
  }

  const tokenFromSecret = await getAccessToken(authConfigSecret)
  const tokenFromPfx = await getAccessToken(authConfigPfx)

  console.log(tokenFromSecret)
  console.log(tokenFromPfx)
})()