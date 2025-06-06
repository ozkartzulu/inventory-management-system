import { customer } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getUserIdName } from "~/utils/auth.server";
import { deleteCustomer, getCustomer } from "~/utils/customer.server";


export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const customerId: number = Number(formData.get("idCustomer"));

    const customer = await deleteCustomer(customerId);

    if(!customer) {
        return 'No pudo eliminar Proveedor';
    }

    return redirect("/clientes");
};

export const loader: LoaderFunction = async ({ request, params }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    let idCustomer: number = Number(params.idCustomer);
   
    const customer = await getCustomer(idCustomer);
    return customer;
}


export default function DeleteClient() {

    const customer = useLoaderData<customer>();
    const resError: string | undefined = useActionData();
    
    const [errorText, setErrorText] = useState(resError);

    useEffect(() => {
        setErrorText(resError);
    }, [resError])
    
    return (
        <div className="container max-w-md m-auto p-4">
            <h2 className='text-3xl text-yellow-300 font-bold text-center mb-7 capitalize'>Eliminar Cliente</h2>

            <div className=" font-semibold text-center tracking-wide text-red-700 w-full mb-4">
                {errorText || ''}
            </div>

            <div className=" py-4 px-6 bg-red-500 bg-opacity-50 rounded">
                <p>
                ¿Estás seguro de que deseas eliminar el cliente <strong>{customer.name}</strong>
                </p>

                <Form method="post">
                    <input type="hidden" name="idCustomer" value={customer.id} />
                    <div className="flex justify-center gap-5 mt-7 mb-3">
                        <button 
                            type="submit"
                            className="bg-red-700 text-white px-2 py-1 text-sm rounded"
                        >Confirmar 
                        </button>
                        <a 
                            href="/clientes"
                            className="bg-green-700 text-white px-2 py-1 text-sm rounded" 
                        >Cancelar
                        </a>
                    </div>
                </Form>
            </div>
        </div>
    )
}
