import { Brand, Category, Madein, Model, Product, Variant } from "@prisma/client";
import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Button from "~/components/button";
import { getAllProducts, getProduct } from "~/utils/product.server";

type ActionLoader = {
    product: Product | null;
}

type ProductCategory = {
    id: number;
    name: string;
    description: string;
    number: number;
    url: string;
    madeinId: number;
    categoryId: number;
    category: Category;
    madein: Madein;
    brand: Brand;
    model: Model;
    variant: Variant;
}

export const loader: LoaderFunction = async ({ params, }) => {
    let idProduct: number = Number(params.idProduct);
    const product = await getProduct(idProduct);
    if(!product) {
        return null;
    }
    return product;
}


export default function VerProducto() {
    const product: ProductCategory = useLoaderData();
    
    return (
        <div className="container max-w-screen-xl m-auto px-4">
            <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5 capitalize'>{product?.name}</h2>
            <div className='flex gap-5 mb-3'>
                <Button label="Nuevo" href="/productos/crear" />
                <Button label="Editar" href={`/productos/editar/${product?.id}`} />
                <Button label="Cancelar" href="/productos" />
            </div>
            <div className="flex gap-4">
                <div className="basis-1/2 sm:basis-1/2 md:basis-2/5 relative rounded">
                    <img src={ product?.url} alt={product?.name} className="w-full h-96 object-cover rounded" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded"></div>
                </div>
                <div className="basis-1/2 sm:basis-1/2 md:basis-3/5 py-4 px-6 bg-gray-300 bg-opacity-40 rounded">
                    <ul>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Nombre: </span><span className="font-thin text-gray-300">{product?.name}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Descripción: </span><span className="font-thin text-gray-300">{product?.description}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Número de Producto: </span><span className="font-thin text-gray-300">{product?.number}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Nombre Categoría: </span><span className="font-thin text-gray-300">{product?.category.name}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Descripción Categoría: </span><span className="font-thin text-gray-300">{product?.category.description}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Fabricado en: </span><span className="font-thin text-gray-300">{product?.madein.name}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Marca: </span><span className="font-thin text-gray-300">{product?.brand.name}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Model: </span><span className="font-thin text-gray-300">{product?.model.name}</span></li>
                        <li className="mb-2"><span className="text-indigo-950 font-bold ">Variante: </span><span className="font-thin text-gray-300">{product?.variant.unit +" - "+ product?.variant.medida}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
