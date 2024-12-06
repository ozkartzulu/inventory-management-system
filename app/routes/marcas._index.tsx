import { Category, Model } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { getAllBrands } from "~/utils/brand.server";
import ItemModel from '~/components/item-model';


export const loader: LoaderFunction = async ({ request }) => {
    const brands = await getAllBrands();
    if(!brands) {
        return null;
    }
    return brands;
}

export default function Index() {

    const brands:[Model] = useLoaderData();

    return (
        <div className="container">
            { brands.length ? brands.map( (item, index) => <ItemModel item={item} key={index} />) : (<p>No hay Marcas registrados</p>)}
        </div>
    )
}