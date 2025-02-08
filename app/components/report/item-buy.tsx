import { Category, Customer, InvoiceOrder, Product, User } from "@prisma/client";
import { useNavigate, Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import useCart from "~/hooks/useCart";
import { formatDateBol } from "~/utils/utils";

interface FormFieldProps {
    order: {
        id: number;
        quantity: number;
        price: number;
        date: string;
        productId: number;
        invoiceSalesId: number;
        product: {id: number, url: string, name: string, categoryId: number, category: Category};
        invoiceSales: {
            id: number;
            date: string;
            total: number;
            debt: number; 
            state: boolean; 
            userId: number; 
            supplierId: number;
            user: {firstName: string}; 
            supplier: {name: string};
        };
    }
}

export default function ItemBuy({order}: FormFieldProps) {
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
            <td className="p-2">{order?.product.category.name}</td>
            <td className="p-2"> <img src={order?.product.url} className="w-10 h-10 object-cover rounded-sm" alt="" /> </td>
            <td className="p-2">{order?.invoiceSales.user.firstName}</td>
            <td className="p-2">{order?.invoiceSales.supplier.name}</td>

        </tr>
    )
}