import { category } from "@prisma/client";
import { useNavigate } from "@remix-run/react";

interface FormFieldProps {
    category: category
}

export default function ItemCustomer({category}: FormFieldProps) {
    
    const navigation = useNavigate();

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize">{category?.name}</td>
            <td className="p-2 capitalize">{category?.description}</td>
            <td className="">
                <div className="flex gap-2 items-center">
                    <button 
                        className="bg-yellow-600 text-white px-2 py-1 text-sm rounded"
                        onClick={ () => navigation(`/categorias/editar/${category?.id}`) }
                    >Editar</button>
                </div>
            </td>
        </tr>
    )
}