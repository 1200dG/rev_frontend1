"use client";

import React from "react";
import { ProductCardProps } from "@/lib/types/common/types";

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isSelected, 
  onSelect 
}) => {
  const handleClick = () => {
    onSelect(product);
  };

  const getIconForType = (type: string) => {
    if (type === 'CREDITS') {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4">
          <span className="text-white font-bold text-lg">C</span>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-4">
          <span className="text-white font-bold text-lg">♥</span>
        </div>
      );
    }
  };

  const getBadgeText = (type: string, quantity: number) => {
    if (type === 'CREDITS') {
      if (quantity >= 500) return 'BEST VALUE';
      if (quantity >= 250) return 'POPULAR';
      return '';
    } else {
      if (quantity >= 25) return 'BEST VALUE';
      if (quantity >= 10) return 'POPULAR';
      return '';
    }
  };

  const badgeText = getBadgeText(product.type, product.quantity);

  return (
    <div
      onClick={handleClick}
      className={`
        relative cursor-pointer transition-all duration-300 transform hover:scale-105
        ${isSelected 
          ? 'bg-[#6C5C434D] border-2 border-[#FFCE96] shadow-lg shadow-[#FFCE96]/20' 
          : 'bg-[#534741] border border-[#FFCE96B2] hover:border-[#FFCE96] hover:shadow-md'
        }
        rounded-2xl p-6 text-center min-h-[200px] flex flex-col justify-between
      `}
    >
      {badgeText && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {badgeText}
        </div>
      )}
      
      <div className="flex flex-col items-center">
        {getIconForType(product.type)}
        
        <h3 className="text-white font-bold text-xl mb-2">
          {product.name}
        </h3>
        
        <p className="text-[#D4B588] text-sm mb-4 min-h-[40px] flex items-center">
          {product.description}
        </p>
      </div>
      
      <div className="mt-auto">
        <div className="text-3xl font-bold text-[#FFCE96] mb-2">
          ${product.price}
        </div>

        <div className="text-[#D4B588] text-sm">
          {product.quantity} {product.type.toLowerCase()}
        </div>

        {product.type === 'CREDITS' && product.quantity >= 100 && (
          <div className="text-green-400 text-xs mt-1">
            Save ${((product.quantity * 0.08) - parseFloat(product.price)).toFixed(2)}
          </div>
        )}
      </div>
      
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl border-2 border-[#FFCE96] pointer-events-none">
          <div className="absolute top-2 right-2 w-6 h-6 bg-[#FFCE96] rounded-full flex items-center justify-center">
            <span className="text-black text-sm font-bold">✓</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
