import { customer } from "@prisma/client";
import { useNavigate } from "@remix-run/react";

interface FormFieldProps {
    customer: customer
}

export default function ItemCustomer({customer}: FormFieldProps) {
    
    const navigation = useNavigate();

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize">{customer?.name}</td>
            <td className="p-2 capitalize">{customer?.phone}</td>
            <td className="p-2 capitalize">{customer?.address}</td>
            <td className="p-2 capitalize">
                <img src="/icons/deuda.svg" className="mr-2 w-7 h-auto cursor-pointer inline" alt="icon deuda" 
                    onClick={ () => navigation(`/deuda/${customer?.id}`) }
                />
                <span>{customer?.debt} Bs.</span>
            </td>
            <td className="">
                <div className="flex gap-2 items-center">
                    <button 
                        className="bg-green-700 text-white px-2 py-1 text-sm rounded" 
                        onClick={ () => navigation(`/clientes/ver/${customer?.id}`) }
                    >Ver</button>
                    <button 
                        className="bg-yellow-600 text-white px-2 py-1 text-sm rounded"
                        onClick={ () => navigation(`/clientes/editar/${customer?.id}`) }
                    >Editar</button>
                    <button 
                        className="bg-red-700 text-white px-2 py-1 text-sm rounded"
                        onClick={ () => navigation(`/clientes/eliminar/${customer?.id}`) }
                    >Eliminar</button>
                </div>
            </td>
        </tr>
    )
}