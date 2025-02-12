import { Category } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllCategories } from "~/utils/category.server";
import ItemCategory from '~/components/item-category';
import Button from "~/components/button";


export const loader: LoaderFunction = async ({ request }) => {
    const categories = await getAllCategories();
    if(!categories) {
        return null;
    }
    return categories;
}

export default function Index() {

    const categories:[Category] = useLoaderData();

    return (
            <div className="container max-w-screen-xl m-auto px-4">
                <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Lista de Categorías</h2>
                <div className='flex gap-5 mb-3'>
                    <Button label="Nueva Categoría" href="/categorias/crear" />
                </div>
            { categories.length ? (
                <>
                <div className="list-products overflow-auto">
                    <table className='w-full'> 
                        <thead className='bg-indigo-600 text-white text-left'>
                            <tr>
                                <th className='p-2'>Nombre</th>
                                <th className='p-2'>Descripción</th>
                                <th className='p-2'>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-thin'>
                            { categories?.map( category => (
                                <ItemCategory category={category} key={category.id} />
                            ) ) }
                        </tbody>
                    </table>
                </div>
                </>
                ) : (<p>No hay Categorías</p>)}
            </div>
        )
}