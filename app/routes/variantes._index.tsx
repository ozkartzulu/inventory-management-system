import { Category, Model, Variant } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { getAllModels } from "~/utils/model.server";
import ItemModel from '~/components/item-model';
import { getAllVariants } from "~/utils/variant.server";
import ItemVariant from "~/components/item-variant";


export const loader: LoaderFunction = async ({ request }) => {
    const variants = await getAllVariants();
    if(!variants) {
        return null;
    }
    return variants;
}

export default function Index() {

    const variants:[Variant] = useLoaderData();
    // console.log(variants)
    return (
        <div className="container">
            { variants.length ? variants.map( (item, index) => <ItemVariant item={item} key={index} />) : (<p>No hay Variantes registrados</p>)}
        </div>
    )
}