import { Category, Madein, Model, Variant } from "@prisma/client";
import { useState, useEffect } from "react";
import useCart from "~/hooks/useCart";
  
export default function Cart() {

  const [number, setNumber] = useState(0);

  const cartLStorage = useCart();
  const cartItems = cartLStorage?.cartItems;


  useEffect(() => {
    const sizeCart = cartItems ? cartItems.length : 0;
    setNumber(sizeCart);
  }, [cartItems])


  return (
    <>
        <div className={`w-6 h-auto cursor-pointer relative`}>
            <img 
                src="/icons/cart-shopping-gray.svg" 
                alt="cart icon"
            />
            <span 
                className="absolute -top-3 -right-2 w-4 h-4 rounded-full flex justify-center items-center bg-blue-700"
                style={{fontSize: 10}}
            >{number ? number : "0"}</span>
        </div>
    </>
  )
}