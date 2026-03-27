export const envVars = {
  allowedDomain: process.env.NEXT_PUBLIC_ALLOWED_DOMAIN ?? "localhost",
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  nextAuthUrl: process.env.NEXTAUTH_URL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  backendApiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
}
