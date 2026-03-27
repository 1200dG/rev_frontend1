'use client';

import { useEffect, useState } from 'react';
type Product = {
    id: number;
    title: string;
    price: number;
    category: string;
    inStock: boolean;
    description: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}   

export default function Test() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading,setLoading] = useState(false);
    const [favouriteProducts, setFavouriteProducts] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);
    async function fetchProducts() {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
        setProducts(data);
        setLoading(false);
        const productsWithStock = data.map((product: Product) => ({
            ...product,
            inStock: Math.random() < 10
        }));
        setProducts(productsWithStock);
    }
    fetchProducts();
    const storedFavourites = localStorage.getItem('favouriteProducts');
    if (storedFavourites) {
        setFavouriteProducts(JSON.parse(storedFavourites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favouriteProducts', JSON.stringify(favouriteProducts));
  }, [favouriteProducts]);

  const handleToggleStock = (product: Product) => { 
    const updatedProducts = products.map((p: Product) => {
        if (p.id === product.id) {
            return {
                ...p,
                inStock: !p.inStock
            };
        }
        return p;
    });
    setProducts(updatedProducts);
}

  const handleToggleFavourite = (product: Product) => {
    if (favouriteProducts.includes(product.id)) {
        setFavouriteProducts(favouriteProducts.filter((id) => id !== product.id));
    } else {
        setFavouriteProducts([...favouriteProducts, product.id]);
        alert("Added to favourites!");
    }
  }


    return (
    <div>
        {
            loading ? <p>Loading...</p> : (
                <ol>
                    {products.map((product) => (
                        <li key={product?.id}>
                            <p>
                            {product?.title} - {product?.price} - {product?.category} - {product?.inStock ? 'In Stock' : 'Out of Stock'}
                        </p>
                        <button onClick={() => handleToggleStock(product)}>
                            Toggle Stock
                        </button>
                        <button onClick={() => handleToggleFavourite(product)}>
                            {favouriteProducts.includes(product?.id) ? 'Remove from Favourites' : 'Add to Favourites'}
                        </button>
                        </li>
                    ))}
                </ol>
            )
        }
    </div>
  );
}
