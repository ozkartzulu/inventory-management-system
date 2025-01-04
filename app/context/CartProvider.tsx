
import { Category, Product } from '@prisma/client';
import { createContext, useEffect, useState } from 'react'

interface CartContextType {
    cartItems: {id: number, name: string, url: string}[];
    addToCart: (product: productType) => void;
}

type productType = {
    id: number;
    name: string;
    url: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<{ children: React.ReactNode }>  = ({children}) => {

    const [cartItems, setCartItems] = useState<{id: number, name: string, url: string}[]>(
        () => {
            if (typeof window !== "undefined") {
                const storedCart = localStorage.getItem("cart");
                return storedCart ? JSON.parse(storedCart) : [];
            }
        }
      );

    useEffect(() => {
        
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: productType) => {
        setCartItems((prev) => {
          const existingItem = prev.find((item) => item.id === product.id);
          if (existingItem) {
            return prev.filter((item) => item.id !== product.id);
          }
          return [...prev, product];
        });
    };


    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export {
    CartProvider
}

export default CartContext