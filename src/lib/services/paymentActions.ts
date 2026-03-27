import api from "../axios";
import { routes } from "../routes";
import { ApiResponse, ApiResponseUser, TransactionApiResponse } from "../types/common/types";
import { loadStripe } from "@stripe/stripe-js";
import { envVars } from "../../../config";

export interface Product {
  id: number;
  type: "CREDITS" | "LIVES";
  quantity: number;
  price: number;
}

export interface CheckoutRequest {
  product_id: number;
  success_url: string;
  cancel_url: string;
}

export interface CheckoutResponse {
  session_id: string;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await api.get<ApiResponse<Product[]>>(routes.api.payment.products);
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch products");
  } catch (error) {
    throw error;
  }
}

export async function getCheckoutData(session: string): Promise<{amount: number}> {
  try {
    const response = await api.post(routes.api.payment.stripeData(session));
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch products");
  } catch (error) {
    throw error;
  }
}

export async function createCheckoutSession(productId: number): Promise<CheckoutResponse> {
  try {
    const checkoutRequest: CheckoutRequest = {
      product_id: productId,
      success_url: `${window.location.origin}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/payments/cancel`,
    };

    const response = await api.post<ApiResponse<CheckoutResponse>>(
      routes.api.payment.checkout,
      checkoutRequest,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to create checkout session");
  } catch (error) {
    throw error;
  }
}

export async function redirectToStripe(sessionId: string) {
  try {
    const stripe = await loadStripe(envVars.stripePublishableKey || '');
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (error) {
      throw new Error(error.message || 'Failed to redirect to Stripe checkout');
    }
  } catch (error) {
    throw error;
  }
}


export async function transactionHistoryApi(): Promise<TransactionApiResponse[]> {
  try {
    const response = await api.get<ApiResponseUser<TransactionApiResponse[]>>( routes.api.payment.transactionHistory );

    if (response.data && response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data?.detail || "Failed to fetch transaction history");
  } catch (err) {
    console.error("Error fetching transaction history:", err);
    throw err;
  }
}

