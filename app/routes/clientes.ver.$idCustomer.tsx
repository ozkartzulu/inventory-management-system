import { Customer, Supplier} from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Button from "~/components/button";
import { getCustomer } from "~/utils/customer.server";


export const loader: LoaderFunction = async ({ params }) => {
    let idCustomer: number = Number(params.idCustomer);
   
    const customer = await getCustomer(idCustomer);
    return customer;
}


export default function VerCliente() {
    const customer = useLoaderData<Customer>();
    
    return (
        <div className="container max-w-screen-xl m-auto px-4">
            <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5 capitalize'>{customer?.name}</h2>
            <div className='flex gap-5 mb-3'>
                <Button label="Nuevo" href="/clientes/crear" />
                <Button label="Editar" href={`/clientes/editar/${customer?.id}`} />
                <Button label="Cancelar" href="/clientes" />
            </div>
            <div className="container mx-auto">
                <div className="py-4 px-6 bg-gray-300 bg-opacity-40 rounded">
                    <ul>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Nombre: </span><span className="font-thin text-gray-300">{customer?.name}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Dirección: </span><span className="font-thin text-gray-300">{customer?.address}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Teléfono: </span><span className="font-thin text-gray-300">{customer?.phone}</span></li>
                       
                    </ul>
                </div>
            </div>
        </div>
    )
}