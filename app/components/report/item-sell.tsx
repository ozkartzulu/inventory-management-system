import { category } from "@prisma/client";
import { useNavigate, Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import useCart from "~/hooks/useCart";
import { capitalizeWords, formatDateBol } from "~/utils/utils";

interface FormFieldProps {
    order: {
        id: number;
        quantity: number;
        price: number;
        date: string;
        productId: number;
        invoiceOrderId: number;
        product: {id: number, url: string, name: string, categoryId: number, category: category};
        invoiceOrder: {
            id: number;
            date: string;
            total: number;
            debt: number; 
            state: boolean; 
            userId: number; 
            customerId: number;
            user: {firstName: string}; 
            customer: {name: string};
        };
    }
}

export default function ItemSell({order}: FormFieldProps) {
    const navigation = useNavigate();

    const [activeSell, setActiveSell] = useState( false );
    const [activeBuy, setActiveBuy] = useState( false );
    const [stock, setStock] = useState( true );

    const cartLStorage = useCart();
    const cartItems = cartLStorage?.cartItems;

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize">{formatDateBol(order?.date)}</td>
            <td className="p-2 capitalize">{order?.product.name}</td>
            <td className="p-2 capitalize">{order?.quantity}</td>
            <td className="p-2 capitalize">{order?.price}</td>
            <td className="p-2">{capitalizeWords(order?.product.category.name)}</td>
            <td className="p-2"> <img src={order?.product.url} className="w-10 h-10 object-cover rounded-sm" alt="" /> </td>
            <td className="p-2">{capitalizeWords(order?.invoiceOrder.user.firstName)}</td>
            <td className="p-2">{capitalizeWords(order?.invoiceOrder.customer.name)}</td>

        </tr>
    )
}