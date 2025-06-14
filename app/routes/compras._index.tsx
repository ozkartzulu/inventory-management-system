
import { useActionData, useFetcher, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { customer, supplier } from "@prisma/client";
import { ActionFunctionArgs, json, LoaderFunction, redirect } from "@remix-run/node";

import { getAllCustomers } from "~/utils/customer.server";
import Button from "~/components/button";
import ItemBuy from "~/components/item-buy";
import useCart from "~/hooks/useCart";
import { validateName, validateNumber } from "~/utils/validators";
import { getUser, getUserIdName } from "~/utils/auth.server";
import { registerInvoice, registerInvoiceBuy } from "~/utils/invoice.server";
import { productCart, productProp } from "~/utils/types.server";
import { getAllSuppliers } from "~/utils/supplier.server";
import LoaderButton from '~/components/loader-button';

import styles from '../styles.module.css';

type ActionLoader = {
    suppliers: supplier[] | null;
}

type ActionData = {
    error?: string;
    fields?: { 
        supplier: string;
    };
    errors?: {
        supplier: string;
    };
    success?: boolean;
    message?: string;
    supplierId: number;
    invoiceId: number;
};

export async function action({ request}: ActionFunctionArgs) {

    const formData = await request.formData();
    const data = formData.get('data');

    const user = await getUser(request);

    if (!data) {
        return {error: 'No hay data suficiente'};
    }
    
    const { products, supplierId } = JSON.parse(data as string);

    const errors = {
        supplier: validateName(supplierId),
    }

    if (Object.values(errors).some(Boolean)) {  
        return json({ errors, fields: { supplierId }, form: action }, { status: 400 })
    }

    const emptyPrice = products.find( (product:productProp) => {
        if(product.type != 1) {
            if(typeof Number(product.price) !== 'number' || +product.price < 1) {
                return product;
            }
        } 
    });
    
    if(user && !emptyPrice) {
        return await registerInvoiceBuy(products, supplierId, user.id );
    }
    
    return json({ success: false, message: "Ingresar valor válido al campo precio" }); 
}

export const loader: LoaderFunction = async ({ request }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    const suppliers = await getAllSuppliers();
    return json<ActionLoader>({suppliers});
}

export default function Compras() {

    const navigate = useNavigate();
    const cartLStorage = useCart();
    // console.log(cartLStorage?.cartItems);
    

    const cartItems = cartLStorage ? cartLStorage.cartItems : [];

    const loader = useLoaderData<ActionLoader>();

    const submit = useSubmit();
    
    const fetcher = useFetcher<ActionData>();
    
    let [total, setTotal] = useState('');

    const [loaderButton, setLoaderButton] = useState(false);

    let [supplier, setSupplier] = useState('');

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
            return total+'';
        });
    }, [products])

    useEffect(() => {
        setProducts(cartLStorage?.cartItems.buy ? cartLStorage.cartItems.buy : [] );
        // if(cartLStorage?.cartItems.sell.length == 0) {
            
        //     navigate('/productos');
        // }
        // setTotal(prev => {
        //     const total = cartLStorage?.cartItems.sell.reduce( (total, row) => total + (row.quantity * +row.price) , 0 );
        //     return total+'';
        // });
    }, [cartLStorage?.cartItems.buy])

    useEffect(() => {
        setLoaderButton(false);

        if (fetcher.data?.success) {
            // navigate(`/factura/${fetcher.data.facturaId}`);
            setTimeout( () => {
                navigate(`/factura-proveedor?supplier=${fetcher.data?.supplierId}&invoice=${fetcher.data?.invoiceId}`);
            }, 1000 );
        }
    }, [fetcher.data]);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {

        let form: any = e.currentTarget.form;
        const supplierId = form.supplier.value;

        const data = { products: products, supplierId }

        fetcher.submit(
            { data: JSON.stringify(data) },
            { method: "post"}
        );

        setLoaderButton(true);
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
                            <th className='p-2 w-28'>Nombre</th>
                            <th className='p-2'>Imagen</th>
                            <th className='p-2'>Stock</th>
                            <th className='p-2'>Cantidad</th>
                            <th className='p-2'>Precio</th>
                            <th className='p-2'>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-normal'>
                        { products.map( venta => (
                            <ItemBuy venta={venta} key={venta.id} />
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
                <div className="text-base font-semibold text-right tracking-wide text-red-500 w-full">
                    {fetcher.data?.message}
                </div>
            </div>
            </>
            ) : (<p>No hay productos seleccionados aún</p>)}

        
        <form action="" className="mt-10">
            <div className="row flex flex-wrap items-center">
                <label htmlFor='supplier' className="text-xl text-yellow-300 font-bold w-full md:w-1/4">
                    Seleccionar Proveedor:
                </label>
                <select onChange={e => {
                    setSupplier(e.target.value);
                    }} id='supplier' name='supplier' value={supplier} className="w-full md:w-3/4 p-2 rounded-lg my-2" >
                    <option value={''} hidden>Seleccione Proveedor</option>
                    {loader.suppliers?.map( (supplier, index) => (
                        <option value={supplier.id} key={supplier.id}>{ supplier.name }</option>
                    ) )}
                </select>
            </div>
            <div className="text-base font-semibold text-right tracking-wide text-red-500 w-full">
                {fetcher.data?.errors?.supplier}
            </div>
            <div className="row flex justify-start md:justify-end">
                <button 
                    type="button" 
                    onClick={handleSubmit}
                    disabled={loaderButton ? true : false}
                    className="relative min-w-44 min-h-12 rounded-xl mt-3 bg-yellow-300 px-6 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1 cursor-pointer" 
                >{ loaderButton ? <LoaderButton/> : 'Realizar Compra'}</button>
            </div>
        </form>
        </div>
    )
}