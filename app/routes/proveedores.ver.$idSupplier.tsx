import { Supplier} from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Button from "~/components/button";
import { getSupplier } from "~/utils/supplier.server";


export const loader: LoaderFunction = async ({ params }) => {
    let idSupplier: number = Number(params.idSupplier);
   
    const supplier = await getSupplier(idSupplier);
    return supplier;
}


export default function VerProducto() {
    const supplier = useLoaderData<Supplier>();
    
    return (
        <div className="container max-w-screen-xl m-auto px-4">
            <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5 capitalize'>{supplier?.name}</h2>
            <div className='flex gap-5 mb-3'>
                <Button label="Nuevo" href="/proveedores/crear" />
                <Button label="Editar" href={`/proveedores/editar/${supplier?.id}`} />
                <Button label="Cancelar" href="/proveedores" />
            </div>
            <div className="container mx-auto">
                <div className="py-4 px-6 bg-gray-300 bg-opacity-40 rounded">
                    <ul>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Nombre: </span><span className="font-thin text-gray-300">{supplier?.name}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Dirección: </span><span className="font-thin text-gray-300">{supplier?.address}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Teléfono: </span><span className="font-thin text-gray-300">{supplier?.phone}</span></li>
                       
                    </ul>
                </div>
            </div>
        </div>
    )
}
