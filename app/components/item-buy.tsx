import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import useCart from "~/hooks/useCart";

type productType = {
    venta : {
        id: number;
        name: string;
        url: string;
        quantity: number;
        stock: number;
    }
}

export default function ItemVenta({venta}: productType) {
    
    const navigation = useNavigate();

    const cartLStorage = useCart();

    let [counter, setCounter] = useState(1);

    let [price, setPrice] = useState("0");

    useEffect(() => {
        setCounter( prev => {
            const found = cartLStorage?.cartItems.buy.find(item => item.id === venta.id);
            if(found) {
                return found.quantity;
            }
            return 1;
        });

        setPrice( prev => {
            const found = cartLStorage?.cartItems.buy.find(item => item.id === venta.id);
            if(found) {
                return found.price;
            }
            return "0";
        });
        
    }, [])

    const handleClickPlus = () => {
        if(counter < 100) {
            setCounter(++counter);
            cartLStorage?.setQuantity(venta.id, counter, 'buy');
        }
    }
    const handleClickMinus = () => {
        if(counter > 1) {
            setCounter(--counter);
            cartLStorage?.setQuantity(venta.id, counter, 'buy');
        }
    }

    const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = event.target.value;
        setPrice(newPrice);
        cartLStorage?.setPrice(venta.id, newPrice, 'buy');
    }

    const handleRemove = () => {
        cartLStorage?.removeVenta(venta.id, 'buy');
    }

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize min-w-24">{venta?.name}</td>
            <td className="p-2 capitalize">
                <img src={venta?.url} className="w-7 h-7 object-cover rounded-sm" alt="product image" />
            </td>
            <td className="p-2 capitalize">{venta?.stock}</td>
            <td className="p-4 capitalize flex gap-1">
                <span className="border w-7 rounded-md flex items-center justify-center">{counter} </span>
                <button 
                    className="w-7 rounded-md border border-opacity-30 border-gray" 
                    style={{padding: 4}}
                    onClick={handleClickPlus}
                >
                    <img src="/icons/plus.svg" alt="plus icon" />
                </button>
                <button 
                    className="w-7 rounded-md border border-opacity-30 border-gray" 
                    style={{padding: 4}}
                    onClick={handleClickMinus}
                >
                    <img src="/icons/minus.svg" alt="minus icon" />
                </button>
            </td>
            <td className="p-1 capitalize">
                <input 
                    type="number" 
                    value={price} 
                    placeholder="30"
                    pattern="^[0-9]*$"
                    className="bg-transparent border rounded-md py-1 pl-2 pr-1 w-20"
                    onChange={handlePrice}
                />
            </td>
            <td className="p-2">
                <button 
                    className="w-7 h-auto rounded-md border-opacity-30 border-gray bg-red-600" 
                    style={{paddingLeft: 7, paddingRight: 7, paddingTop: 3, paddingBottom: 3}}
                    onClick={handleRemove}
                >
                    <img src="/icons/xmark.svg" alt="close icon" />
                </button>
            </td>
        </tr>
    )
}