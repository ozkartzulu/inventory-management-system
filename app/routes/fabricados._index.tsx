import { Category, Model } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import ItemModel from '~/components/item-model';
import { getAllMadeins } from "~/utils/madein.server";


export const loader: LoaderFunction = async ({ request }) => {
    const madeins = await getAllMadeins();
    if(!madeins) {
        return null;
    }
    return madeins;
}

export default function Index() {

    const madeins:[Model] = useLoaderData();

    return (
        <div className="container">
            { madeins.length ? madeins.map( (item, index) => <ItemModel item={item} key={index} />) : (<p>No hay Fabricados registrados</p>)}
        </div>
    )
}