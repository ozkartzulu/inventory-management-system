
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Customer } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";

import { getAllCustomers } from "~/utils/customer.server";
import Button from "~/components/button";
import ItemCustomer from "~/components/item-customer";

export const loader: LoaderFunction = async ({ request }) => {
    // let user = await getUserIdName(request);
    // if(!user) {
    //     return redirect('/login');
    // }
    const customers = await getAllCustomers();
    if(!customers) {
        return null;
    }

    return customers;
}

export default function Customers() {
    const customers:[Customer] = useLoaderData();
    
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="container max-w-screen-xl m-auto px-4">
        <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Lista de Clientes</h2>
        <div className='flex gap-5 mb-3'>
            <input 
                type="text"
                className='py-1 px-3 shadow-sm w-1/3 rounded'
                onChange={ e => setSearchTerm(e.target.value) } 
                placeholder="Buscar por Nombre..." 
            />
            <Button label="Nuevo" href="/clientes/crear" />
        </div>
        { customers.length ? (
            <>
            <div className="list-customers">
                <table className='w-full'> 
                    <thead className='bg-indigo-600 text-white text-left'>
                        <tr>
                            <th className='p-2'>Nombre</th>
                            <th className='p-2'>N° de teléfono</th>
                            <th className='p-2'>Dirección</th>
                            <th className='p-2'>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-thin'>
                        { customers?.filter( (customer) => {
                            if(searchTerm == ''){
                                return customer
                            }else if( customer.name.toLowerCase().includes( searchTerm.toLowerCase() ) ){
                                return customer
                            }
                        } ).map( customer => (
                            <ItemCustomer customer={customer} key={customer.id} />
                        ) ) }
                    </tbody>
                </table>
            </div>
            </>
            ) : (<p>No hay clientes</p>)}
        </div>
    )
}