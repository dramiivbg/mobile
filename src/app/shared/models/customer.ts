/**
 * Customer User session
 */
 export interface ICustomer {
    accountEmail: string,
    crmContactId: string,
    crmCustomerId: string,
    id: string,
    name: string,
    platforms: Array<ICustomerPlatForms>,
    stripeSettings: IStripeSettings,
    webhooks: IWebhooks
}

/**
 * Get Platforms
 */
export interface ICustomerPlatForms {
    id: string,
    description: string,
    noSandbox: number,
    noLive: number,
    parameters: Array<ICustomerPlatFormsParameters>,
}

/**
 * get platform parameters { Environment, TenantId, UserId, UserToken }
 */
export interface ICustomerPlatFormsParameters {
    name: string
}

/**
 * Stripe Settings
 */
export interface IStripeSettings {
    publishableKey: string,
    secretKey: string,
    webhookSecret: string
}

/**
 * Webhooks
 */
export interface IWebhooks {
    apiKey: string,
    endpointUrl: string
}