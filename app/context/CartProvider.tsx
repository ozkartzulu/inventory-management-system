
import { Category, Product } from '@prisma/client';
import { createContext, useEffect, useState } from 'react'

interface CartContextType {
    cartItems: {id: number, name: string, url: string, quantity: number, price: string}[];
    addToCart: (product: productType) => void;
    setQuantity: (id: number, quantity: number) => void;
    setPrice: (id: number, price: string) => void;
    removeVenta: (id:number) => void;
    resetCart: () => void;
}

type productType = {
    id: number;
    name: string;
    url: string;
    quantity: number;
    price: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<{ children: React.ReactNode }>  = ({children}) => {

    // solo para desarrollo
    // const [cartItems, setCartItems] = useState<{id: number, name: string, url: string, quantity: number, price: string}[]>(
    //     () => {
    //         if (typeof window !== "undefined") {
    //             const storedCart = localStorage.getItem("cart");
    //             return storedCart ? JSON.parse(storedCart) : [];
    //         }
    //     }
    // );

    // habilitar para produccion
    const [cartItems, setCartItems] = useState<{id: number, name: string, url: string, quantity: number, price: string}[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedCart = localStorage.getItem("cart");
            setCartItems(storedCart ? JSON.parse(storedCart) : []);
        }
    }, []);

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

    const setQuantity = (id: number, quantity: number) => {
        setCartItems((prev) => {
            let existingItem = prev.find((item) => item.id === id);
            if (existingItem) {
                return prev.map(item => {
                    if(item.id === id) {
                        return {...item, quantity: quantity}
                    }
                    return item;
                });
            }
            return [...prev]
        })
    }

    const setPrice = (id: number, price: string) => {
        setCartItems((prev) => {
            let existingItem = prev.find((item) => item.id === id);
            if (existingItem) {
                return prev.map(item => {
                    if(item.id === id) {
                        return {...item, price: price}
                    }
                    return item;
                });
            }
            return [...prev]
        })
    }

    const removeVenta = (id: number) => {
        setCartItems((prev) => {
            let existingItem = prev.find((item) => item.id === id);
            if (existingItem) {
                return prev.filter(item => item.id !== id);
            }
            return [...prev]
        })
    }

    const resetCart = () => {
        setCartItems((prev) => {
            return []
        })
    }


    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                setQuantity,
                setPrice,
                removeVenta,
                resetCart,
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