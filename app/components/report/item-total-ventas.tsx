import { useNavigate, Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import useCart from "~/hooks/useCart";
import { formatDateBol } from "~/utils/utils";

interface FormFieldProps {
    order: {
        productId: number;
        quantitySell: number;
        amountSell: number;
        quantityBuy: number;
        amountBuy: number;
        product: {id: number, url: string, name: string};
    }
}

export default function ItemTotalVentas({order}: FormFieldProps) {
    const navigation = useNavigate();

    const [activeSell, setActiveSell] = useState( false );
    const [activeBuy, setActiveBuy] = useState( false );
    const [stock, setStock] = useState( true );

    const cartLStorage = useCart();
    const cartItems = cartLStorage?.cartItems;

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize">{order?.product.name}</td>
            <td className="p-2"> <img src={order?.product.url} className="w-10 h-10 object-cover rounded-sm" alt="" /> </td>
            <td className="p-2">{order?.quantityBuy}</td>
            <td className="p-2 ">{order?.amountBuy}</td>
            <td className="p-2">{order?.quantitySell}</td>
            <td className="p-2 ">{order?.amountSell}</td>
        </tr>
    )
}