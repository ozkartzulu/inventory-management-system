import { Product } from "@prisma/client";
import { useNavigate, Form } from "@remix-run/react";

export default function ItemProduct({product}) {
    const navigation = useNavigate();

    return (
        <tr className="border-b">
            <td className="p-2 capitalize">{product?.name}</td>
            <td className="p-2 capitalize">{product?.description}</td>
            <td className="p-2 capitalize">{product?.categoryId}</td>
            <td className="p-2">{product?.number}</td>
            <td className="p-2"> <img src={product?.url} className="w-20 h-20 object-cover" alt="" /> </td>
            <td className="">
                <div className="flex gap-2 items-center">
                    <button 
                        className="bg-green-700 text-white px-2 py-1 rounded-sm text-sm" 
                        onClick={ () => navigation(`/socio-view/${product?.id}`) }
                    >Ver</button>
                    <button 
                        className="bg-yellow-600 text-white px-2 py-1 rounded-sm text-sm"
                        onClick={ () => navigation(`/socio-edit/${product?.id}`) }
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
                        <button type='submit' className="bg-red-700 text-white px-2 py-1 rounded-sm text-sm">Eliminar</button>
                    </Form>
                    
                </div>
            </td>
        </tr>
    )
}