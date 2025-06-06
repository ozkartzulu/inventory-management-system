import { category, model } from "@prisma/client";
import { useNavigate } from "@remix-run/react";

interface FormFieldProps {
    model: {
        id: number
        name: string
        category: category
    }
}

export default function ItemCustomer({model}: FormFieldProps) {
    
    const navigation = useNavigate();

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize">{model?.name}</td>
            <td className="p-2 capitalize">{model?.category.name}</td>
            <td className="pr-2">
                <div className="flex gap-2 items-center">
                    <button 
                        className="bg-yellow-600 text-white px-2 py-1 text-sm rounded"
                        onClick={ () => navigation(`/modelos/editar/${model?.id}`) }
                    >Editar</button>
                </div>
            </td>
        </tr>
    )
}