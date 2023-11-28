# msal-token
Small wrapper around msal-node for getting tokens from Microsoft (with certificate or secret)

# Install
```bash
npm i @vestfoldfylke/msal-token
```

# Prerequisities
- An app registration with permissions to whatever your scope is
- A secret or a certificate with in PFX format (can e.g. be created in an azure keyvault) added on the app registration (secrets and certificates tab)

## Create a secret
- Go to app registrations "secrets and certificates"
- Create a new secret
- Store the secret somewhere safe (you won't see it again after creation)

## Add certificate to app registration
- Go to app registrations "secrets and certificates"
- Upload the certficate
- Copy the thumbprint of the certificate

# Usage
```js
const { getAccessToken } = require('@vestfoldfylke/msal-token')

// Secret version
const authConfigSecret = {
    clientId: CLIENT_ID, // app reg client id
    tenantId: TENANT_ID,  // tenant id
    clientSecret: CLIENT_SECRET, // client secret
    scopes: TOKEN_SCOPES // scopes for the token, e.g ["https://graph.microsoft.com/.default"]
}

// PFX-certificate version
const authConfigPfx = {
    clientId: CLIENT_ID, // app reg client id
    tenantId: TENANT_ID,  // tenant id
    thumbprint: THUMBPRINT, // Certificate thumbprint
    pfxcert: PFX_CERT_AS_BASE64, // PFX cert as base64
    privateKeyPassphrase: PFX_PRIVATE_KEY_PASSPHRASE || null, // password for private key if needed
    scopes: TOKEN_SCOPES // scopes for the token, e.g ["https://graph.microsoft.com/.default"]
}

const token = await getAccessToken(authConfigSecret || authConfigPfx)
```


