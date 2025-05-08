
import { useActionData, useFetcher, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { customer } from "@prisma/client";
import { ActionFunctionArgs, json, LoaderFunction } from "@remix-run/node";

import { getCustomer, registerInvoiceDeuda } from "~/utils/customer.server";
import { validateName, validateNumber } from "~/utils/validators";
import { getUser } from "~/utils/auth.server";
import { registerInvoice } from "~/utils/invoice.server";
import { productCart, productProp } from "~/utils/types.server";
import LoaderButton from '~/components/loader-button';

import styles from '../styles.module.css';
import FormField from "~/components/form-field";
import SelectField from "~/components/select-field";

type ActionLoader = {
    customers: customer[] | null;
}

type ActionData = {
    error?: string;
    fields?: { 
        customer: string;
    };
    errors?: {
        customer: string;
    };
    success?: boolean;
    message?: string;
    customerId: number;
    invoiceId: number;
};

export async function action({ request, params}: ActionFunctionArgs) {

    const formData = await request.formData();
    const data = formData.get('data');

    const user = await getUser(request);
    const idCustomer: number = Number(params.idCustomer);

    if (!data) {
        return {error: 'No hay data suficiente'};
    }
    
    const { deuda, total } = JSON.parse(data as string);

    // check if same product there are not stock
    if(user && idCustomer && Number(deuda) > 0 ) {
        // console.log(products)
        return await registerInvoiceDeuda(idCustomer, user.id, Number(deuda), Number(total) );
    }

    return json({ success: false, message: "Revisar campo precio o si hay stock suficiente o Deuda mayor del valor total." }); 
}

export const loader: LoaderFunction = async ({ params }) => {
    let idCustomer: number = Number(params.idCustomer);     
    const customer = await getCustomer(idCustomer);
    return customer;
}

export default function Ventas() {

    const navigate = useNavigate();

    const loader = useLoaderData<customer>();

    const submit = useSubmit();
    
    const fetcher = useFetcher<ActionData>();
    
    let [deudaTotal, setDeudaTotal] = useState(String(loader?.debt));

    let [deudaPagar, setDeudaPagar] = useState('0');

    const [loaderButton, setLoaderButton] = useState(false);

    let [error, setError] = useState('');

    useEffect(() => {
        
        setLoaderButton(false);

        if (fetcher.data?.success) {
            setTimeout( () => {
                navigate(`/factura?customer=${fetcher.data?.customerId}&invoice=${fetcher.data?.invoiceId}&tipo=deuda`);
            }, 1000 );
        } else {
            console.log("retorna false del action:  "+fetcher.data?.message);
        }
    }, [fetcher.data]);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {

        let form: any = e.currentTarget.form;
        const deuda = form.deuda.value;
        const total = form.total.value;

        if( isNaN(deuda) || isNaN(total) ) {
            setError('Ingrese números válidos por favor');
            return;
        }

        const data = { deuda: deuda, total: total }

        fetcher.submit(
            { data: JSON.stringify(data) },
            { method: "post"}
        );

        setLoaderButton(true);
    }

    const updateDeuda = (event: React.ChangeEvent<HTMLInputElement>) => {
        const deuda = event.target.value;
        const totalDeuda = loader.debt;

        if(+deuda > totalDeuda || +deuda < 0) {
            return;
        }

        setDeudaPagar(deuda);
        let totales = totalDeuda - Number(deuda);
        setDeudaTotal(String(totales)); 
    }

    return (
        <div className="h-full justify-center items-center flex flex-col gap-y-4">
            <p className="text-2xl font-extrabold text-yellow-300 mb-6">Pago de Deuda</p>
            <form method="post" className="rounded-2xl bg-gray-200 p-6 w-11/12 max-w-xl mb-12">

                <label htmlFor="name" className="text-blue-600 font-semibold">
                    Nombre
                </label>
                <input 
                    type="text"
                    readOnly 
                    id="name" name="name" 
                    className="w-full p-2 rounded-xl my-2" 
                    value={loader.name} 
                />

                <label htmlFor="deuda" className="text-blue-600 font-semibold">
                    Ingrese deuda a pagar
                </label>
                <input 
                    onChange={updateDeuda}
                    type="text"
                    id="deuda" name="deuda" 
                    className="w-full p-2 rounded-xl my-2" 
                    value={deudaPagar} 
                />

                <label htmlFor="total" className="text-blue-600 font-semibold">
                    Deuda Total
                </label>
                <input 
                    type="text"
                    readOnly 
                    id="total" name="total" 
                    className="w-full p-2 rounded-xl my-2" 
                    value={deudaTotal} 
                />
                
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
                    {error || ''}
                </div>

                <div className="w-full flex justify-center gap-5">
                    <button 
                        type="button" 
                        onClick={handleSubmit}
                        disabled={loaderButton ? true : false}
                        className="relative min-w-44 min-h-12 rounded-xl mt-3 bg-yellow-300 px-6 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1 cursor-pointer" 
                    >{ loaderButton ? <LoaderButton/> : 'Realizar Pago'} </button>
                    <button
                        type="button" 
                        className="rounded-xl mt-3 bg-yellow-300 px-6 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                        onClick={() => navigate(`/clientes`)}
                    >Cancelar</button>
                </div>
            </form>
        </div>
    )
}