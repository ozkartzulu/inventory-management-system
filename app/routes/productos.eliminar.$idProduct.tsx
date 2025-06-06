import { brand, category, madein, model, product, variant } from "@prisma/client";
import { ActionFunction, LoaderFunction, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getUserIdName } from "~/utils/auth.server";
import { deleteProduct, getAllProducts, getProduct } from "~/utils/product.server";

type ActionLoader = {
    product: product | null;
}

type ProductCategory = {
    id: number;
    name: string;
    description: string;
    number: number;
    url: string;
    madeinId: number;
    categoryId: number;
    category: category;
    madein: madein;
    brand: brand;
    model: model;
    variant: variant;
}

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const productId: number = Number(formData.get("idProduct"));

    const product = await deleteProduct(productId);

    if(!product) {
        return 'No pudo eliminar Producto';
    }

    return redirect("/productos");
};

export const loader: LoaderFunction = async ({ request, params, }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    let idProduct: number = Number(params.idProduct);
    const product = await getProduct(idProduct);
    if(!product) {
        return null;
    }
    return product;
}


export default function DeleteProducto() {

    const product: ProductCategory = useLoaderData();
    const resError: string | undefined = useActionData();
    
    const [errorText, setErrorText] = useState(resError);

    useEffect(() => {
        setErrorText(resError);
    }, [resError])
    
    return (
        <div className="container max-w-md m-auto p-4">
            <h2 className='text-3xl text-yellow-300 font-bold text-center mb-7 capitalize'>Eliminar Producto</h2>

            <div className=" font-semibold text-center tracking-wide text-red-700 w-full mb-4">
                {errorText || ''}
            </div>

            <div className=" py-4 px-6 bg-red-500 bg-opacity-50 rounded">
                <p>
                ¿Estás seguro de que deseas eliminar el producto <strong>{product.name}</strong> de la categoría{" "}
                <strong>{product.category.name}</strong>?
                </p>

                <Form method="post">
                    <input type="hidden" name="idProduct" value={product.id} />
                    <div className="flex justify-center gap-5 mt-7 mb-3">
                        <button 
                            type="submit"
                            className="bg-red-700 text-white px-2 py-1 text-sm rounded"
                        >Confirmar 
                        </button>
                        <a 
                            href="/productos"
                            className="bg-green-700 text-white px-2 py-1 text-sm rounded" 
                        >Cancelar
                        </a>
                    </div>
                </Form>
            </div>
        </div>
    )
}
