import { Category, Madein, Model, Variant } from "@prisma/client";
import { useState, useEffect } from "react";
import useCart from "~/hooks/useCart";
  
export default function CartBuy() {

  const [number, setNumber] = useState(0);

  const cartLStorage = useCart();


  useEffect(() => {
    const sizeCart = cartLStorage?.cartItems ? cartLStorage?.cartItems.buy.length : 0;
    setNumber(sizeCart);
  }, [cartLStorage?.cartItems])


  return (
    <>
        <div className={`w-6 h-auto cursor-pointer relative`}>
            <img 
                src="/icons/truck-fast.svg" 
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