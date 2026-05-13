import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

/**
 * Initializes and returns a singleton instance of the Stripe SDK.
 * Note: This module must only be executed on the server side.
 */
export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    // Using a typed but safely generic API version setup
    stripeClient = new Stripe(key, {
      apiVersion: '2026-04-22.dahlia', // Updated to match expected type
    });
  }
  return stripeClient;
}

/**
 * Initiates an instant payout to a connected Stripe Custom or Express account.
 * Note: This is designed for server-side usage.
 * 
 * @param connectedAccountId The Stripe Connect account ID (starts with 'acct_')
 * @param amountInCents The amount to payout in cents (e.g., 5000 for $50.00)
 * @param currency The 3-letter currency code (e.g., 'usd')
 * @param description A description for the payout
 * @returns The created Payout object
 */
export async function initiateInstantPayout(
  connectedAccountId: string,
  amountInCents: number,
  currency: string = 'usd',
  description?: string
) {
  const stripe = getStripe();
  
  try {
    // We create a payout directly on the connected account.
    // The connected account needs to have a valid debit card attached and 'instant' payouts enabled.
    const payout = await stripe.payouts.create(
      {
        amount: amountInCents,
        currency,
        method: 'instant',
        description: description || 'Instant payout from AntiGravity distribution platform',
      },
      {
        // This makes the API request on behalf of the connected account
        stripeAccount: connectedAccountId, 
      }
    );

    return payout;
  } catch (error) {
    console.error(`Failed to initiate instant payout for account ${connectedAccountId}:`, error);
    throw error;
  }
}
