
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Product } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { getAllProducts } from "~/utils/product.server";
import ItemProduct from "~/components/item-product";


export const loader: LoaderFunction = async ({ request }) => {
    const products = await getAllProducts();
    if(!products) {
        return null;
    }
    return products;
}

export default function Productos() {
    const products:[Product] = useLoaderData();
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="container">
            <h2 className='text-3xl text-indigo-900 font-bold text-center mb-5'>Lista de Productos</h2>
            <div className='flex gap-5 mb-3'>
                <input 
                    type="text"
                    className='py-1 px-3 shadow-sm w-1/3'
                    onChange={ e => setSearchTerm(e.target.value) } 
                    placeholder="Buscar por Nombre..." 
                />
            </div>
            <div className="list-products">
                <table className='w-full'> 
                    <thead className='bg-indigo-600 text-white text-left'>
                        <tr>
                            <th className='p-2'>Nombre</th>
                            <th className='p-2'>Descripción</th>
                            <th className='p-2'>Categoría</th>
                            <th className='p-2'>Número</th>
                            <th className='p-2'>Imagen</th>
                            <th className='p-2'>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody className='border-l border-r'>
                        { products?.filter( (product) => {
                            if(searchTerm == ''){
                                return product
                            }else if( product.name.toLowerCase().includes( searchTerm.toLowerCase() ) ){
                                return product
                            }
                        } ).map( product => (
                            <ItemProduct product={product} key={product.id} />
                        ) ) }
                    </tbody>
                </table>
            </div>
        </div>
    )
}