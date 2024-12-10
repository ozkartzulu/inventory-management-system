import { Category, Product } from "@prisma/client";
import { useNavigate, Form } from "@remix-run/react";

interface FormFieldProps {
    product: {
        id: number;
        name: string;
        description: string;
        number: number;
        url: string;
        madeinId: number;
        categoryId: number;
        category: Category
    }
}

export default function ItemProduct({product}: FormFieldProps) {
    const navigation = useNavigate();

    return (
        <tr className="border-b border-b-pink-200 border-opacity-30">
            <td className="p-2 capitalize">{product?.name}</td>
            <td className="p-2 capitalize">{product?.description}</td>
            <td className="p-2 capitalize">{product?.category.name}</td>
            <td className="p-2">{product?.number}</td>
            <td className="p-2"> <img src={product?.url} className="w-10 h-10 object-cover" alt="" /> </td>
            <td className="">
                <div className="flex gap-2 items-center">
                    <button 
                        className="bg-green-700 text-white px-2 py-1 text-sm rounded" 
                        onClick={ () => navigation(`/productos/ver/${product?.id}`) }
                    >Ver</button>
                    <button 
                        className="bg-yellow-600 text-white px-2 py-1 text-sm rounded"
                        onClick={ () => navigation(`/productos/editar/${product?.id}`) }
                    >Editar</button>
                    <Form 
                        method='post'
                        action={`/socio-delete/${product?.id}`}
                        onSubmit={ e => {
                            if(!confirm('Estas seguro de eliminar?')){
                                e.preventDefault()
                            }
                        } }
                    >
                        <button type='submit' className="bg-red-700 text-white px-2 py-1 text-sm rounded">Eliminar</button>
                    </Form>
                    
                </div>
            </td>
        </tr>
    )
}