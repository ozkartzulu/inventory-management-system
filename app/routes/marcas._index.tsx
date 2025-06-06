import { brand, category, model } from "@prisma/client";
import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllCategories } from "~/utils/category.server";
import ItemBrand from '~/components/item-brand';
import Button from "~/components/button";
import { getAllModels } from "~/utils/model.server";
import { getAllBrands } from "~/utils/brand.server";
import styles from '../styles.module.css';
import { getUserIdName } from "~/utils/auth.server";

type VariantBrand = {
    id: number;
    name: string; 
    category: category;
}

export const loader: LoaderFunction = async ({ request }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    const brands = await getAllBrands();
    if(!brands) {
        return null;
    }
    return brands;
}

export default function Index() {

    const brands:VariantBrand[] = useLoaderData();

    return (
            <div className="container max-w-screen-xl m-auto px-4">
                <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Lista de Marcas</h2>
                <div className='flex gap-5 mb-3'>
                    <Button label="Nueva Marca" href="/marcas/crear" />
                </div>
            { brands.length ? (
                <>
                <div className="list-products">
                    <table className={`${styles.tableZebra} w-full`}> 
                        <thead className='bg-indigo-600 text-white text-left'>
                            <tr>
                                <th className='p-2'>Nombre</th>
                                <th className='p-2'>Categoría</th>
                                <th className='p-2'>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-normal'>
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