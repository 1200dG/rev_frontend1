import { loadStripe } from "@stripe/stripe-js";
import { StripeProduct, StripeCheckoutRequest, StripeCheckoutResponse, ProductsApiResponse } from "../types/common/types";
import { envVars } from "../../../config";
import api from "../axios";

const stripePromise = loadStripe(envVars.stripePublishableKey || '');

export async function fetchProducts(): Promise<StripeProduct[]> {
  try {
    const response = await api.get<ProductsApiResponse>('product/');

    if (response.data.status === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch products');
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch products');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch products');
  }
}

export async function createStripeCheckoutSession(
  product: StripeProduct,
  email?: string
): Promise<void> {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    const checkoutRequest: StripeCheckoutRequest = {
      product_id: product.id,
      success_url: `${window.location.origin}/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/payments?success=false`,
      email,
    };

    const response = await api.post<StripeCheckoutResponse>('stripe/checkout/', checkoutRequest);

    if (response.data.status === 201 && response.data.data.session_id) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.data.session_id,
      });

      if (error) {
        throw new Error(error.message || 'Failed to redirect to Stripe checkout');
      }
    } else {
      throw new Error(response.data.message || 'Failed to create checkout session');
    }

  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      throw new Error(axiosError.response?.data?.message || 'Failed to create checkout session. Please try again.');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to create checkout session. Please try again.');
  }
}

export function getProductsByType(products: StripeProduct[], type: 'credits' | 'lives'): StripeProduct[] {
  const typeFilter = type === 'credits' ? 'CREDITS' : 'LIVES';
  return products.filter(product => product.type === typeFilter);
}
