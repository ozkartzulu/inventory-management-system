import { Category } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { getAllCategories } from "~/utils/category.server";
import Item from '~/components/item';


export const loader: LoaderFunction = async ({ request }) => {
    const categories = await getAllCategories();
    if(!categories) {
        return null;
    }
    // console.log(categories)
    return categories;
}

export default function Index() {

    const categories:[Category] = useLoaderData();
    console.log(categories)

    return (
        <div className="container">
            {categories.map( (item, index) => <Item item={item} key={index} />)}
        </div>
    )
}