import { brand, category, model } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllCategories } from "~/utils/category.server";
import ItemMadein from '~/components/item-madein';
import Button from "~/components/button";
import { getAllModels } from "~/utils/model.server";
import { getAllBrands } from "~/utils/brand.server";
import { getAllMadeins } from "~/utils/madein.server";
import styles from '../styles.module.css';


export const loader: LoaderFunction = async ({ request }) => {
    const brands = await getAllMadeins();
    if(!brands) {
        return null;
    }
    return brands;
}

export default function Index() {

    const brands:[brand] = useLoaderData();

    return (
            <div className="container max-w-screen-xl m-auto px-4">
                <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Lista de Fabricados</h2>
                <div className='flex gap-5 mb-3'>
                    <Button label="Nuevo" href="/fabricados/crear" />
                </div>
            { brands.length ? (
                <>
                <div className="list-products">
                    <table className={`${styles.tableZebra} w-full`}> 
                        <thead className='bg-indigo-600 text-white text-left'>
                            <tr>
                                <th className='p-2'>Nombre</th>
                                <th className='p-2'>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-thin'>
                            { brands?.map( brand => (
                                <ItemMadein madein={brand} key={brand.id} />
                            ) ) }
                        </tbody>
                    </table>
                </div>
                </>
                ) : (<p>No hay Fabricados registradas</p>)}
            </div>
        )
}