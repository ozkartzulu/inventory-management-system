
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Category, Product } from "@prisma/client";
import { LoaderFunction, redirect } from "@remix-run/node";
import { getUser, getUserIdName, requireUserId } from "~/utils/auth.server";
import { getAllProducts } from "~/utils/product.server";
import ItemProduct from "~/components/item-product";
import Button from "~/components/button";
import { getAllInventories } from "~/utils/inventory.server";


type ProductCategory = {
    id: number;
    name: string;
    description: string;
    number: number;
    url: string;
    madeinId: number;
    categoryId: number;
    category: Category;
    stock: number;
}

export const loader: LoaderFunction = async ({ request }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    const products = await getAllProducts();
    const inventories = await getAllInventories();

    if(!products) {
        return null;
    }

    const productsAndStock = products.map( product => {
        const inventory = inventories?.find( inv => inv.productId === product.id);
        if(inventory) {
            return {...product, stock: inventory.productsBought - inventory.productsSold};
        }
        return {...product, stock: 0};
    })
    
    return productsAndStock;
}

export default function Productos() {
    const products:[ProductCategory] = useLoaderData();
    // console.log(products);
    
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="container max-w-screen-xl m-auto px-4">
            <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Lista de Productos</h2>
            <div className='flex flex-wrap gap-4 mb-4'>
                <Button label="Nuevo Producto" href="/productos/crear" />
                <input 
                    type="text"
                    className='py-1 px-3 shadow-sm w-full md:w-1/3 rounded'
                    onChange={ e => setSearchTerm(e.target.value) } 
                    placeholder="Buscar por Nombre..." 
                />
            </div>
        { products.length ? (
            <>
            <div className="list-products overflow-auto">
                <table className='w-full'> 
                    <thead className='bg-indigo-600 text-white text-left'>
                        <tr>
                            <th className='p-2'>Nombre</th>
                            <th className='p-2'>Descripción</th>
                            <th className='p-2'>Categoría</th>
                            <th className='p-2'>Número</th>
                            <th className='p-2'>Imagen</th>
                            <th className='p-2'>Stock</th>
                            <th className='p-2'>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-thin'>
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
            </>
            ) : (<p>No hay productos</p>)}
        </div>
    )
}