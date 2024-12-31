
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Supplier } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";

import { getAllSuppliers } from "~/utils/supplier.server";
import ItemSupplier from "~/components/item-supplier";
import Button from "~/components/button";

export const loader: LoaderFunction = async ({ request }) => {
    // let user = await getUserIdName(request);
    // if(!user) {
    //     return redirect('/login');
    // }
    const suppliers = await getAllSuppliers();
    if(!suppliers) {
        return null;
    }

    return suppliers;
}

export default function Proveedores() {
    const suppliers:[Supplier] = useLoaderData();
    
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="container max-w-screen-xl m-auto px-4">
        { suppliers.length ? (
            <>
            <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Lista de Proveedores</h2>
            <div className='flex gap-5 mb-3'>
                <input 
                    type="text"
                    className='py-1 px-3 shadow-sm w-1/3 rounded'
                    onChange={ e => setSearchTerm(e.target.value) } 
                    placeholder="Buscar por Nombre..." 
                />
                <Button label="Nuevo" href="/proveedores/crear" />
            </div>
            <div className="list-suppliers">
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
                        { suppliers?.filter( (supplier) => {
                            if(searchTerm == ''){
                                return supplier
                            }else if( supplier.name.toLowerCase().includes( searchTerm.toLowerCase() ) ){
                                return supplier
                            }
                        } ).map( supplier => (
                            <ItemSupplier supplier={supplier} key={supplier.id} />
                        ) ) }
                    </tbody>
                </table>
            </div>
            </>
            ) : (<p>No hay proveedores</p>)}
        </div>
    )
}