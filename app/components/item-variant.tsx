import { Category, Model, Variant } from "@prisma/client";
import { useNavigate } from "@remix-run/react";

interface FormFieldProps {
    variant: {
        id: number
        categoryId: number 
        medida: string 
        unit: number 
        category: Category
    }
}



export default function ItemVariant({variant}: FormFieldProps) {
    
    const navigation = useNavigate();

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize">{variant?.medida}</td>
            <td className="p-2 capitalize">{variant?.unit}</td>
            <td className="p-2 capitalize">{variant?.category.name}</td>
            <td className="">
                <div className="flex gap-2 items-center">
                    <button 
                        className="bg-yellow-600 text-white px-2 py-1 text-sm rounded"
                        onClick={ () => navigation(`/variantes/editar/${variant?.id}`) }
                    >Editar</button>
                </div>
            </td>
        </tr>
    )
}