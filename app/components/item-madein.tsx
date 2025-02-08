import { Brand, Category, Madein, Model } from "@prisma/client";
import { useNavigate } from "@remix-run/react";

interface FormFieldProps {
    madein: Madein
}

export default function ItemMadein({madein}: FormFieldProps) {
    
    const navigation = useNavigate();

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize">{madein?.name}</td>
            {/* <td className="p-2 capitalize">{madein?.description}</td> */}
            <td className="">
                <div className="flex gap-2 items-center">
                    <button 
                        className="bg-yellow-600 text-white px-2 py-1 text-sm rounded"
                        onClick={ () => navigation(`/fabricados/editar/${madein?.id}`) }
                    >Editar</button>
                </div>
            </td>
        </tr>
    )
}