import { Category } from "@prisma/client";
import { useNavigate, Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import useCart from "~/hooks/useCart";

interface FormFieldProps {
    product: {
        id: number;
        name: string;
        description: string;
        number: number;
        url: string;
        madeinId: number;
        categoryId: number;
        category: Category;
    }
}

export default function ItemProduct({product}: FormFieldProps) {
    const navigation = useNavigate();

    const [active, setActive] = useState( false );

    const cartLStorage = useCart();
    const cartItems = cartLStorage?.cartItems;

    useEffect(() => {
        
        if (typeof window !== "undefined") {
            
            setTimeout(() => {
                let productInCart = cartItems?.find( (item) => item.id === product.id );
                // console.log(cartLStorage?.cartItems);
                if(productInCart) {
                    setActive(true);
                }
            }, 100);
            
        }
     
    }, []);

    const handleClick = () => {
        const productCart = {id: product.id, name: product.name, url: product.url, quantity: 1, price: "50"}
        cartLStorage?.addToCart(productCart);
        setActive( prev => !prev);
    }

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize">{product?.name}</td>
            <td className="p-2 capitalize">{product?.description}</td>
            <td className="p-2 capitalize">{product?.category.name}</td>
            <td className="p-2">{product?.number}</td>
            <td className="p-2"> <img src={product?.url} className="w-10 h-10 object-cover rounded-sm" alt="" /> </td>
            <td className="">
                <div className="flex gap-2 items-center">
                   
                    <button 
                        className="bg-green-700 text-white px-2 py-1 text-sm rounded" 
                        onClick={ () => navigation(`/productos/ver/${product?.id}`) }
                    >Ver</button>
                    <button 
                        className="bg-yellow-600 text-white px-2 py-1 text-sm rounded"
                        onClick={ () => navigation(`/productos/editar/${product?.id}`) }
                    >Editar</button>
                    {/* <Form 
                        method='post'
                        action={`/productos/eliminar/${product?.id}`}
                        onSubmit={ e => {
                            if(!confirm('Estas seguro de eliminar?')){
                                e.preventDefault()
                            }
                        } }
                    >
                        <button type='submit' className="bg-red-700 text-white px-2 py-1 text-sm rounded">Eliminar</button>
                    </Form> */}
                    <button 
                        className="bg-red-700 text-white px-2 py-1 text-sm rounded"
                        onClick={ () => navigation(`/productos/eliminar/${product?.id}`) }
                    >Eliminar</button>

                     <div className={`w-7 h-auto cursor-pointer`}>
                        <img 
                            src="/icons/cart-shopping-gray.svg" 
                            alt="cart icon"
                            style={{
                                filter: active ? "invert(26%) sepia(58%) saturate(1537%) hue-rotate(112deg) brightness(96%) contrast(93%)" : 'none',
                            }}
                            onClick={handleClick} 
                        />
                    </div>
                    
                </div>
            </td>
        </tr>
    )
}