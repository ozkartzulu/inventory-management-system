import { supplier } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getUserIdName } from "~/utils/auth.server";
import { deleteSupplier, getSupplier } from "~/utils/supplier.server";


export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const supplierId: number = Number(formData.get("idSupplier"));

    const supplier = await deleteSupplier(supplierId);

    if(!supplier) {
        return 'No pudo eliminar Proveedor';
    }

    return redirect("/proveedores");
};

export const loader: LoaderFunction = async ({ request, params }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    let idSupplier: number = Number(params.idSupplier);
   
    const supplier = await getSupplier(idSupplier);
    return supplier;
}


export default function DeleteSupplier() {

    const supplier = useLoaderData<supplier>();
    const resError: string | undefined = useActionData();
    
    const [errorText, setErrorText] = useState(resError);

    useEffect(() => {
        setErrorText(resError);
    }, [resError])
    
    return (
        <div className="container max-w-md m-auto p-4">
            <h2 className='text-3xl text-yellow-300 font-bold text-center mb-7 capitalize'>Eliminar Proveedor</h2>

            <div className=" font-semibold text-center tracking-wide text-red-700 w-full mb-4">
                {errorText || ''}
            </div>

            <div className=" py-4 px-6 bg-red-500 bg-opacity-50 rounded">
                <p>
                ¿Estás seguro de que deseas eliminar el proveedor <strong>{supplier.name}</strong>
                </p>

                <Form method="post">
                    <input type="hidden" name="idSupplier" value={supplier.id} />
                    <div className="flex justify-center gap-5 mt-7 mb-3">
                        <button 
                            type="submit"
                            className="bg-red-700 text-white px-2 py-1 text-sm rounded"
                        >Confirmar 
                        </button>
                        <a 
                            href="/proveedores"
                            className="bg-green-700 text-white px-2 py-1 text-sm rounded" 
                        >Cancelar
                        </a>
                    </div>
                </Form>
            </div>
        </div>
    )
}
