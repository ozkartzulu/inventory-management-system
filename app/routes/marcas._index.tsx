import { Brand, Category, Model } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllCategories } from "~/utils/category.server";
import ItemBrand from '~/components/item-brand';
import Button from "~/components/button";
import { getAllModels } from "~/utils/model.server";
import { getAllBrands } from "~/utils/brand.server";


export const loader: LoaderFunction = async ({ request }) => {
    const brands = await getAllBrands();
    if(!brands) {
        return null;
    }
    return brands;
}

export default function Index() {

    const brands:[Brand] = useLoaderData();

    return (
            <div className="container max-w-screen-xl m-auto px-4">
                <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Lista de Marcas</h2>
                <div className='flex gap-5 mb-3'>
                    <Button label="Nuevo" href="/marcas/crear" />
                </div>
            { brands.length ? (
                <>
                <div className="list-products">
                    <table className='w-full'> 
                        <thead className='bg-indigo-600 text-white text-left'>
                            <tr>
                                <th className='p-2'>Nombre</th>
                                <th className='p-2'>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-thin'>
                            { brands?.map( brand => (
                                <ItemBrand brand={brand} key={brand.id} />
                            ) ) }
                        </tbody>
                    </table>
                </div>
                </>
                ) : (<p>No hay Marcas registradas</p>)}
            </div>
        )
}