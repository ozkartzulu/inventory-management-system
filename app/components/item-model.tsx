import { model } from "@prisma/client";
import { useNavigate } from "@remix-run/react";

interface FormFieldProps {
    model: model
}

export default function ItemCustomer({model}: FormFieldProps) {
    
    const navigation = useNavigate();

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize">{model?.name}</td>
            {/* <td className="p-2 capitalize">{model?.description}</td> */}
            <td className="">
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