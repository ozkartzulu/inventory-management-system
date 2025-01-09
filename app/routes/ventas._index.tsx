
import { useActionData, useFetcher, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Customer } from "@prisma/client";
import { ActionFunctionArgs, json, LoaderFunction } from "@remix-run/node";

import { getAllCustomers } from "~/utils/customer.server";
import Button from "~/components/button";
import ItemVenta from "~/components/item-venta";
import useCart from "~/hooks/useCart";
import { validateName, validateNumber } from "~/utils/validators";
import { getUser } from "~/utils/auth.server";
import { registerInvoice } from "~/utils/invoice.server";

type ActionLoader = {
    customers: Customer[] | null;
}

type ActionData = {
    error?: string;
    fields?: { 
        customer: string;
    };
    errors?: {
        customer: string;
    };
};

export async function action({ request}: ActionFunctionArgs) {

    const formData = await request.formData();
    const data = formData.get('data');

    const user = await getUser(request);

    if (!data) {
        return {error: 'No hay data suficiente'};
    }
    
    const { products, customerId } = JSON.parse(data as string);

    const errors = {
        customer: validateName(customerId),
    }

    if (Object.values(errors).some(Boolean)) {  
        return json({ errors, fields: { customerId }, form: action }, { status: 400 })
    }

    if(user) {
        return await registerInvoice(products, customerId, user.id );
    }
    
    return json({ success: false, message: "No se pudo crear la factura." }); 
}

export const loader: LoaderFunction = async ({ request }) => {
    const customers = await getAllCustomers();
    return json<ActionLoader>({customers});
}

export default function Ventas() {

    const navigate = useNavigate();
    const cartLStorage = useCart();

    const cartItems = cartLStorage ? cartLStorage.cartItems : [];

    const loader = useLoaderData<ActionLoader>();

    const submit = useSubmit();
    
    const fetcher = useFetcher<ActionData>();
    
    let [total, setTotal] = useState('');

    let [customer, setCustomer] = useState('');

    useEffect(() => {
        setTotal(prev => {
            const total = cartItems?.reduce( (total, row) => total + ( row.quantity * +row.price) , 0 );
            return total+'';
        });
    }, [])

    useEffect(() => {
        setTotal(prev => {
            const total = cartItems?.reduce( (total, row) => total + (row.quantity * +row.price) , 0 );
            return total+'';
        });
    }, [cartItems])

    useEffect(() => {
        if (fetcher.data?.success) {
            // navigate(`/factura/${fetcher.data.facturaId}`);
            setTimeout( () => {
                navigate(`/factura?customer=${fetcher.data.customerId}&invoice=${fetcher.data.invoiceId}`);
            }, 1000 );
        }
    }, [fetcher.data]);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {

        let form: any = e.currentTarget.form;
        const customerId = form.customer.value;

        const data = { products: cartItems, customerId }

        fetcher.submit(
            { data: JSON.stringify(data) },
            { method: "post"}
        );
    }

    return (
        <div className="container max-w-screen-xl m-auto px-4">
        <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Revisar Productos</h2>
        { cartItems ? (
            <>
            <div className="list-customers">
                <table className='w-full'> 
                    <thead className='bg-indigo-600 text-white text-left'>
                        <tr>
                            <th className='p-2'>Nombre</th>
                            <th className='p-2'>Imagen</th>
                            <th className='p-2'>Cantidad</th>
                            <th className='p-2'>Precio</th>
                            <th className='p-2'>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-thin'>
                        { cartItems?.map( venta => (
                            <ItemVenta venta={venta} key={venta.id} />
                        ) ) }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <th className='p-2 border border-pink-200 border-opacity-30 text-yellow-300 font-bold text-left'>Total</th>
                            <td className="p-2 border border-pink-200 border-opacity-30 text-yellow-300 font-bold">{total} Bs.</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            </>
            ) : (<p>No hay productos seleccionados aún</p>)}

        
        <form action="" className="mt-10">
            <div className="row flex items-center">
                <label htmlFor='customer' className="text-xl text-yellow-300 font-bold w-1/4">
                    Seleccionar Cliente:
                </label>
                <select onChange={e => {
                    setCustomer(e.target.value);
                    }} id='customer' name='customer' value={customer} className="w-full p-2 rounded-lg my-2" >
                    <option value={''} hidden>Seleccione Cliente</option>
                    {loader.customers?.map( (customer, index) => (
                        <option value={customer.id} key={customer.id}>{ customer.name }</option>
                    ) )}
                </select>
            </div>
            <div className="text-base font-semibold text-right tracking-wide text-red-500 w-full">
                {fetcher.data?.errors?.customer}
            </div>
            <div className="row flex justify-end">
                <button 
                    type="button" 
                    onClick={handleSubmit}
                    className="rounded-xl mt-3 bg-yellow-300 px-6 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1 cursor-pointer" 
                >Realizar Venta</button>
            </div>
        </form>
        </div>
    )
}