const pfxToPem = require('./lib/pfx-to-pem')
const msal = require('@azure/msal-node')

/**
 * Gets a token for sharepoint rest api
 *
 * @param {Object} config
 * @param {string} config.tenantId app reg tenant id
 * @param {string} config.clientId app reg client id
 * @param {string[]} config.scopes token scopes
 * @param {string} [config.clientSecret] app reg client id
 * @param {string} [config.pfxcert] PFX-cert as base64
 * @param {string} [config.pfxPassphrase=null] passphrase for decrypting cert privateKey (if needed)
 * @param {string} [config.thumbprint] can be obtained from app registration, or inspecting cert
 *
 * @return {Object} accessToken
 */
const getAccessToken = async config => {
  if (!config) {
    throw Error('Missing required input: config')
  }
  if (!config.tenantId) {
    throw Error('Missing required input: config.tenantId')
  }
  if (!config.clientId) {
    throw Error('Missing required input: config.tenantId')
  }
  if (!config.scopes) {
    throw Error('Missing required input: config.scopes')
  }
  if (!config.clientSecret && !config.pfxcert) {
    throw Error('Either config.clientSecret or config.pxfcert is required!')
  }
  if (config.pfxcert) {
    if (!config.thumbprint) {
      throw Error('Missing required input: config.thumbprint')
    }
  }
  
  let authConfig
  if (config.clientSecret) {
    authConfig = {
      auth: {
        clientId: config.clientId,
        authority: `https://login.microsoftonline.com/${config.tenantId}/`,
        clientSecret: config.clientSecret
      }
    }
  } else if (config.pfxcert) {
    // Må konverte internt her
    const cert = pfxToPem(config.pfxcert, config.pfxPassphrase || null)

    const certificate = {
      cert: cert.certificate,
      key: cert.key
    }

    authConfig = {
      auth: {
        clientId: config.clientId,
        authority: `https://login.microsoftonline.com/${config.tenantId}/`,
        clientCertificate: {
          thumbprint: config.thumbprint,
          privateKey: certificate.key
        }
      }
    }
  }

  if (!authConfig) throw new Error('What, something is wrong in the package - create issue on github')

  // Create msal application object
  const cca = new msal.ConfidentialClientApplication(authConfig)
  const clientCredentials = {
    scopes: config.scopes
  }

  const token = await cca.acquireTokenByClientCredential(clientCredentials)
  return token
}

module.exports = { getAccessToken }
