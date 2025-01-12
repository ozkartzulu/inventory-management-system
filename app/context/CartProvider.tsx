
import { Category, Product } from '@prisma/client';
import { createContext, useEffect, useState } from 'react'
import { productCart, productProp } from '~/utils/types.server';

interface CartContextType {
    cartItems: productCart;
    addToCart: (product: productProp, property: string) => void;
    setQuantity: (id: number, quantity: number, property: string) => void;
    setPrice: (id: number, price: string, property: string) => void;
    removeVenta: (id:number, property: string) => void;
    resetCart: (property: string) => void;
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
    
    const [cartItems, setCartItems] = useState<productCart>({
        sell: [],
        buy: []
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedCart = localStorage.getItem("cart");
            setCartItems(storedCart ? JSON.parse(storedCart) : []);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: productProp, property: string) => {
        setCartItems((prev) => {
            const existingItem = prev[property as keyof productCart].find((item: productProp) => item.id === product.id);
            if (existingItem) {
                return {
                    ...prev,
                    [property]: prev[property as keyof productCart].filter((item: productProp) => item.id !== product.id),
                };
            }
            return {
                ...prev,
                [property]: [...prev[property as keyof productCart], product]
            };
        });
    };

    const setQuantity = (id: number, quantity: number, property: string) => {
        setCartItems((prev) => {
            let existingItem = prev[property as keyof productCart].find((item: productProp) => item.id === id);
            if (existingItem) {
                // return prev.map(item => {
                //     if(item.id === id) {
                //         return {...item, quantity: quantity}
                //     }
                //     return item;
                // });
                return {
                    ...prev,
                    [property]: prev[property as keyof productCart].map((item: productProp) => {
                        if(item.id === id) {
                            return {...item, quantity: quantity}
                        }
                        return item;
                    }),
                };
            }
            return {...prev}
        })
    }

    const setPrice = (id: number, price: string, property: string) => {
        setCartItems((prev) => {
            let existingItem = prev[property as keyof productCart].find((item: productProp) => item.id === id);
            if (existingItem) {
                return {
                    ...prev,
                    [property]: prev[property as keyof productCart].map((item: productProp) => {
                        if(item.id === id) {
                            return {...item, price: price}
                        }
                        return item;
                    }),
                };
            }
            return {...prev}
        })
    }

    const removeVenta = (id: number, property: string) => {
        setCartItems((prev) => {
            let existingItem = prev[property as keyof productCart].find((item: productProp) => item.id === id);
            if (existingItem) {
                return {
                    ...prev,
                    [property]: prev[property as keyof productCart].filter( (item: productProp) => item.id !== id),
                }
            }
            return {...prev}
        })
    }

    const resetCart = (property: string) => {
        setCartItems((prev) => {
            return {
                ...prev,
                [property]: []
            }
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