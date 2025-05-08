
import { useActionData, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { customer } from "@prisma/client";
import { ActionFunctionArgs, json, LoaderFunction } from "@remix-run/node";

import { getAllCustomers } from "~/utils/customer.server";
import Button from "~/components/button";
import ItemVenta from "~/components/item-venta";
import useCart from "~/hooks/useCart";
import { validateName, validateNumber } from "~/utils/validators";
import { getUser } from "~/utils/auth.server";
import { registerInvoice } from "~/utils/invoice.server";
import { productCart, productProp } from "~/utils/types.server";
import LoaderButton from '~/components/loader-button';

import styles from '../styles.module.css';

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

export async function action({ request}: ActionFunctionArgs) {

    const formData = await request.formData();
    const data = formData.get('data');

    const user = await getUser(request);

    if (!data) {
        return {error: 'No hay data suficiente'};
    }
    
    const { products, deuda, total, customerId } = JSON.parse(data as string);

    const errors = {
        customer: validateName(customerId),
    }

    if (Object.values(errors).some(Boolean)) {  
        return json({ errors, fields: { customerId }, form: action }, { status: 400 })
    }

    // check if same product there are not stock
    const stockEmpty = products.find( (product:productProp) => product.stock == 0);
    const emptyPrice = products.find( (product:productProp) => typeof Number(product.price) !== 'number' || +product.price < 1);
    const totalReal = products.reduce( (total:number, product:productProp) => total + ( product.quantity * +product.price) , 0 );
    if(user && !stockEmpty && !emptyPrice && totalReal >= Number(deuda)) {
        // console.log(products)
        return await registerInvoice(products, customerId, user.id, Number(deuda), Number(total) );
    }

    return json({ success: false, message: "Revisar campo precio o si hay stock suficiente o Deuda mayor del valor total." }); 
}

export const loader: LoaderFunction = async ({ request }) => {
    const customers = await getAllCustomers();
    return json<ActionLoader>({customers});
}

export default function Ventas() {

    const navigate = useNavigate();
    const cartLStorage = useCart();
    // console.log(cartLStorage?.cartItems);
    

    const cartItems = cartLStorage ? cartLStorage.cartItems : [];

    const loader = useLoaderData<ActionLoader>();
    
    const fetcher = useFetcher<ActionData>();
    
    let [total, setTotal] = useState('');

    let [deuda, setDeuda] = useState('0');

    const [loaderButton, setLoaderButton] = useState(false);

    let [customer, setCustomer] = useState('');

    const [products, setProducts] = useState<productProp[]>([]);
    // console.log(products);
    
    // useEffect(() => {
        
    //     setTotal(prev => {
    //         const total = cartLStorage?.cartItems.sell.reduce( (total, row) => total + ( row.quantity * +row.price) , 0 );
    //         return total+'';
    //     });
    // }, [])

    useEffect(() => {
        
        setTotal(prev => {
            const total = products.reduce( (total, row) => total + ( row.quantity * +row.price) , 0 );
            let newTotal = total - Number(deuda);
            return newTotal+'';
        });
    }, [products])

    useEffect(() => {
        setProducts(cartLStorage?.cartItems.sell ? cartLStorage.cartItems.sell : [] );
        // if(cartLStorage?.cartItems.sell.length == 0) {
            
        //     navigate('/productos');
        // }
        // setTotal(prev => {
        //     const total = cartLStorage?.cartItems.sell.reduce( (total, row) => total + (row.quantity * +row.price) , 0 );
        //     return total+'';
        // });
    }, [cartLStorage?.cartItems.sell])

    useEffect(() => {
        
        setLoaderButton(false);

        if (fetcher.data?.success) {
            // navigate(`/factura/${fetcher.data.facturaId}`);
            setTimeout( () => {
                navigate(`/factura?customer=${fetcher.data?.customerId}&invoice=${fetcher.data?.invoiceId}&tipo=product`);
            }, 1000 );
        } else {
            console.log("retorna false del action:  "+fetcher.data?.message);
        }
    }, [fetcher.data]);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {

        let form: any = e.currentTarget.form;
        const customerId = form.customer.value;

        const data = { products: products, deuda: deuda, total: total, customerId }

        fetcher.submit(
            { data: JSON.stringify(data) },
            { method: "post"}
        );

        setLoaderButton(true);
    }

    const handleDeuda = (event: React.ChangeEvent<HTMLInputElement>) => {
        const deuda = event.target.value;
        const newTotal = products.reduce( (total, row) => total + ( row.quantity * +row.price) , 0 );
        // not to allow input more than total price
        if(+deuda > newTotal) {
            return;
        }
        setDeuda(deuda);
        let totales = Number(newTotal) - Number(deuda);
        setTotal(String(totales)); 
    }

    return (
        <div className="container max-w-screen-xl m-auto px-4">
        <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Revisar Productos</h2>
        { products ? (
            <>
            <div className="list-customers overflow-auto">
                <table className={`${styles.tableZebra} w-full`}> 
                    <thead className='bg-indigo-600 text-white text-left'>
                        <tr>
                            <th className='p-2'>Nombre</th>
                            <th className='p-2'>Imagen</th>
                            <th className='p-2'>Cantidad</th>
                            <th className='p-2'>Stock</th>
                            <th className='p-2'>Precio</th>
                            <th className='p-2'>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-normal'>
                        { products.map( venta => (
                            <ItemVenta venta={venta} key={venta.id} />
                        ) ) }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <th className='p-2 border border-pink-200 border-opacity-30 text-yellow-300 font-bold text-left'>Deuda Bs.</th>
                            <td className="p-2 border border-pink-200 border-opacity-30 text-yellow-300 font-bold">
                                <input 
                                    type="number" 
                                    value={deuda} 
                                    placeholder="30"
                                    pattern="^[0-9]*$"
                                    className="bg-transparent border rounded-md py-1 pl-2 pr-1 w-20"
                                    onChange={handleDeuda}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <th className='p-2 border border-pink-200 border-opacity-30 text-yellow-300 font-bold text-left'>Total Bs.</th>
                            <td className="p-2 border border-pink-200 border-opacity-30 text-yellow-300 font-bold">{total}</td>
                        </tr>
                        
                    </tfoot>
                </table>
                <div className="text-base font-semibold text-right tracking-wide text-red-500 w-full">
                    {fetcher.data?.message}
                </div>
            </div>
            </>
            ) : (<p>No hay productos seleccionados aún</p>)}

        
        <form action="" className="mt-10">
            <div className="row flex flex-wrap items-center">
                <label htmlFor='customer' className="text-xl text-yellow-300 font-bold w-full md:w-1/4">
                    Seleccionar Cliente:
                </label>
                <select onChange={e => {
                    setCustomer(e.target.value);
                    }} id='customer' name='customer' value={customer} className="w-full md:w-3/4 p-2 rounded-lg my-2" >
                    <option value={''} hidden>Seleccione Cliente</option>
                    {loader.customers?.map( (customer, index) => (
                        <option value={customer.id} key={customer.id}>{ customer.name }</option>
                    ) )}
                </select>
            </div>
            <div className="text-base font-semibold text-right tracking-wide text-red-500 w-full">
                {fetcher.data?.errors?.customer}
            </div>
            <div className="row flex justify-start md:justify-end">
                <button 
                    type="button" 
                    onClick={handleSubmit}
                    disabled={loaderButton ? true : false}
                    className="relative min-w-44 min-h-12 rounded-xl mt-3 bg-yellow-300 px-6 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1 cursor-pointer" 
                >{ loaderButton ? <LoaderButton/> : 'Realizar Venta'} </button>
            </div>
        </form>
        </div>
    )
}