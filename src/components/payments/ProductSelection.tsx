"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { StripeProduct } from "@/lib/types/common/types";
import { fetchProducts, getProductsByType } from "@/lib/services/stripeActions";

interface ProductSelectionProps {
  type: 'credits' | 'lives';
  onProductSelect: (product: StripeProduct) => void;
  selectedProduct: StripeProduct | null;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
  type,
  onProductSelect,
  selectedProduct
}) => {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const allProducts = await fetchProducts();
        const filteredProducts = getProductsByType(allProducts, type);
        setProducts(filteredProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [type]);

  const getTitle = () => {
    return type === 'credits' ? 'Purchase Credits' : 'Purchase Lives';
  };

  const getDescription = () => {
    if (type === 'credits') {
      return 'Credits are used to unlock hints and special features. Choose the package that best fits your playing style.';
    } else {
      return 'Lives give you extra attempts to solve riddles. Get more lives to continue your puzzle-solving journey.';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {getTitle()}
          </h2>
          <p className="text-[#D4B588] text-lg max-w-2xl mx-auto">
            {getDescription()}
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFCE96]"></div>
          <span className="ml-4 text-[#D4B588]">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {getTitle()}
          </h2>
          <p className="text-[#D4B588] text-lg max-w-2xl mx-auto">
            {getDescription()}
          </p>
        </div>
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <p className="text-lg font-semibold">Failed to load products</p>
            <p className="text-sm text-[#D4B588] mt-2">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#FFCE96] to-[#D4B588] text-black font-bold py-2 px-6 rounded-lg hover:from-[#D4B588] hover:to-[#FFCE96] transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          {getTitle()}
        </h2>
        <p className="text-[#D4B588] text-lg max-w-2xl mx-auto">
          {getDescription()}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#D4B588] text-lg">No {type} products available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onSelect={onProductSelect}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="mt-8 p-6 bg-[#534741] border border-[#FFCE96B2] rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">
                Selected: {selectedProduct.name}
              </h3>
              <p className="text-[#D4B588]">
                {selectedProduct.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#FFCE96]">
                ${selectedProduct.price}
              </div>
              <div className="text-[#D4B588] text-sm">
                {selectedProduct.price} {selectedProduct.type}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelection;
