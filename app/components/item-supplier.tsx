import { Supplier } from "@prisma/client";
import { useNavigate } from "@remix-run/react";

interface FormFieldProps {
    supplier: Supplier
}

export default function ItemSupplier({supplier}: FormFieldProps) {
    
    const navigation = useNavigate();

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize">{supplier?.name}</td>
            <td className="p-2 capitalize">{supplier?.phone}</td>
            <td className="p-2 capitalize">{supplier?.address}</td>
            <td className="">
                <div className="flex gap-2 items-center">
                    <button 
                        className="bg-green-700 text-white px-2 py-1 text-sm rounded" 
                        onClick={ () => navigation(`/proveedores/ver/${supplier?.id}`) }
                    >Ver</button>
                    <button 
                        className="bg-yellow-600 text-white px-2 py-1 text-sm rounded"
                        onClick={ () => navigation(`/proveedores/editar/${supplier?.id}`) }
                    >Editar</button>
                    <button 
                        className="bg-red-700 text-white px-2 py-1 text-sm rounded"
                        onClick={ () => navigation(`/proveedores/eliminar/${supplier?.id}`) }
                    >Eliminar</button>
                </div>
            </td>
        </tr>
    )
}