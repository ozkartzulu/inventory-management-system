import { category, model } from "@prisma/client";
import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllCategories } from "~/utils/category.server";
import ItemModel from '~/components/item-model';
import Button from "~/components/button";
import { getAllModels } from "~/utils/model.server";
import styles from '../styles.module.css';
import { getUserIdName } from "~/utils/auth.server";

type ModelCategory = {
    id: number;
    name: string; 
    category: category;
}

export const loader: LoaderFunction = async ({ request }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    const models = await getAllModels();
    if(!models) {
        return null;
    }
    return models;
}

export default function Index() {

    const models:ModelCategory[] = useLoaderData();

    return (
            <div className="container max-w-screen-xl m-auto px-4">
                <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Lista de Modelos</h2>
                <div className='flex gap-5 mb-3'>
                    <Button label="Nuevo Modelo" href="/modelos/crear" />
                </div>
            { models.length ? (
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
                            { models?.map( model => (
                                <ItemModel model={model} key={model.id} />
                            ) ) }
                        </tbody>
                    </table>
                </div>
                </>
                ) : (<p>No hay Modelos</p>)}
            </div>
        )
}