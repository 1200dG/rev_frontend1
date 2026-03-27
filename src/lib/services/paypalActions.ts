import api from "../axios";
import { routes } from "../routes";
import { PayPalCapture, PayPalCaptureResponse, PayPalCheckoutRequest, PayPalCheckoutResponse, PayPalProduct } from "../types/common/types";

export async function createPayPalCheckoutSession( product: PayPalProduct ): Promise<PayPalCheckoutResponse> {
  try {
    const checkoutRequest: PayPalCheckoutRequest = {
      product_id: product.id,
      success_url: `${window.location.origin}/payments?success=true`,
      cancel_url: `${window.location.origin}/payments?success=false`,
    };

    const response = await api.post<PayPalCheckoutResponse>( routes.api.payment.paypal, checkoutRequest );

    if (response.status === 201 && response.data) {
      return response.data;
    }

    throw new Error("Invalid response from PayPal checkout");
  } catch (error: unknown) {
    throw new Error( error instanceof Error ? error.message : "Failed to create checkout session. Please try again." );
  }
}

export async function capturePayPalPayment( order_id: string ): Promise<PayPalCaptureResponse> {
  try {
    const captureRequest: PayPalCapture = {
      order_id: order_id,
    };

    const response = await api.post<PayPalCaptureResponse>( routes.api.payment.paypalCapture, captureRequest );
    if (response.status === 200 && response.data) {
      return response.data;
    }
    throw new Error("Invalid response from PayPal checkout");
  } catch (error: unknown) {
    throw new Error( error instanceof Error ? error.message : "Failed to create checkout session. Please try again." );
  }
}
