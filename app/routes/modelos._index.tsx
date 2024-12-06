import { Category, Model } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { getAllModels } from "~/utils/model.server";
import ItemModel from '~/components/item-model';


export const loader: LoaderFunction = async ({ request }) => {
    const models = await getAllModels();
    if(!models) {
        return null;
    }
    return models;
}

export default function Index() {

    const models:[Model] = useLoaderData();

    return (
        <div className="container">
            { models.length ? models.map( (item, index) => <ItemModel item={item} key={index} />) : (<p>No hay Modelos registrados</p>)}
        </div>
    )
}