"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import UserLayout from "@/components/layouts/userLayout";
import ProductSelection from "@/components/payments/ProductSelection";
import { StripeProduct } from "@/lib/types/common/types";
import { toast } from "react-toastify";
import { createStripeCheckoutSession } from "@/lib/services/stripeActions";
import { useSession } from "next-auth/react";

const PurchasePageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<StripeProduct | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session } = useSession();

  const type = (searchParams.get('type') as 'credits' | 'lives') || 'credits';

  const handleProductSelect = (product: StripeProduct) => {
    setSelectedProduct(product);
  };

  const handlePurchase = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    setIsProcessing(true);

    try {
      await createStripeCheckoutSession(selectedProduct, session?.user?.email);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto py-8">
        <ProductSelection
          type={type}
          onProductSelect={handleProductSelect}
          selectedProduct={selectedProduct}
        />

        {selectedProduct && (
          <div className="mt-8 flex justify-center">
            <div className="bg-[#534741] border border-[#FFCE96B2] rounded-2xl p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <h3 className="text-white font-bold text-xl mb-2">
                  Ready to Purchase?
                </h3>
                <p className="text-[#D4B588]">
                  Secure payment powered by Stripe
                </p>
              </div>

              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#FFCE96] to-[#D4B588] text-black font-bold py-4 px-6 rounded-lg hover:from-[#D4B588] hover:to-[#FFCE96] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Purchase ${selectedProduct.price}</span>
                )}
              </button>

              <div className="mt-4 text-center text-[#D4B588] text-sm">
                <p>✓ Secure 256-bit SSL encryption</p>
                <p>✓ Instant delivery</p>
                <p>✓ 24/7 customer support</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

const LoadingFallback: React.FC = () => (
  <UserLayout>
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFCE96] mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  </UserLayout>
);

const PurchasePage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PurchasePageContent />
    </Suspense>
  );
};

export default PurchasePage;
