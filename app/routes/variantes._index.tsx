import { category } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllCategories } from "~/utils/category.server";
import ItemVariant from '~/components/item-variant';
import Button from "~/components/button";
import { getAllModels } from "~/utils/model.server";
import { getAllVariants } from "~/utils/variant.server";

type VariantCategory = {
    id: number;
    categoryId: number; 
    medida: string; 
    unit: number; 
    category: category;
}

export const loader: LoaderFunction = async ({ request }) => {
    const variants = await getAllVariants();
    if(!variants) {
        return null;
    }
    return variants;
}

export default function Index() {

    const variants:VariantCategory[] = useLoaderData();

    return (
            <div className="container max-w-screen-xl m-auto px-4">
                <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Lista de Variantes</h2>
                <div className='flex gap-5 mb-3'>
                    <Button label="Nueva Variante" href="/variantes/crear" />
                </div>
            { variants.length ? (
                <>
                <div className="list-products overflow-auto">
                    <table className='w-full'> 
                        <thead className='bg-indigo-600 text-white text-left'>
                            <tr>
                                <th className='p-2'>Medida</th>
                                <th className='p-2'>Unidad</th>
                                <th className='p-2'>Categoría</th>
                                <th className='p-2'>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-thin'>
                            { variants?.map( variant => (
                                <ItemVariant variant={variant} key={variant.id} />
                            ) ) }
                        </tbody>
                    </table>
                </div>
                </>
                ) : (<p>No hay Variantes Registrados</p>)}
            </div>
        )
}