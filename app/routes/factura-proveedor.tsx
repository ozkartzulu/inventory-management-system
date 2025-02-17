import {Document, Page, Text, View, Image, PDFViewer} from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
import { ActionFunctionArgs, json, LoaderFunction, redirect } from '@remix-run/node';
import { useEffect, useState } from 'react';
import useCart from '~/hooks/useCart';
import Documento from '~/components/invoice/document';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { getCustomer } from '~/utils/customer.server';
import { getInvoice, getInvoiceBuy, setStateInvoice, setStateInvoiceBuy } from '~/utils/invoice.server';
import { getUser } from '~/utils/auth.server';
import { formatDateUnSpace, generateRandomDigits, removeSpace } from '~/utils/utils';
import { customer, invoiceorder, supplier } from '@prisma/client';
import SharePdf from '~/components/share-button';
import { log } from 'node:console';
import { productProp } from '~/utils/types.server';
import { getSupplier } from '~/utils/supplier.server';

type LoaderData = {
    supplier: supplier | null, 
    invoice: {id: number, date: string, total: number, debt: number, state: boolean, userId: number, supplierId: number} | null, 
    user: {id: number, firstName: string, lastName: string, email: string} | null,
    sold: boolean
}

export const loader: LoaderFunction = async ({ request }) => {

    try {
        const url = new URL(request.url);
        const supplierId = Number(url.searchParams.get('supplier'));
        const invoiceId = Number(url.searchParams.get('invoice'));
        const user = await getUser(request);

        if(!supplierId || !invoiceId || !user) {
            console.log('No hay datos suficientes para emitir la factura');
            return redirect('/productos');
        }

        const supplier = await getSupplier(supplierId);
        const invoice = await getInvoiceBuy(invoiceId);
        if(!supplier || !invoice) {
            return redirect('/productos');
        }

        if(!invoice.state) {
            console.log('la factura ya fué emitida');
            return redirect('/productos');
        }
        
        // change type data of date to string
        const invoiceNew = invoice ? {...invoice, date: invoice?.date + ''} : null;
        
        return json<LoaderData>({supplier: supplier, invoice: invoiceNew, user: user, sold: true});
    } catch (error) {
        console.log('error en el loader'+ error);
        return redirect('/productos');
    }
}

export async function action({ request}: ActionFunctionArgs) {

    try {
        const url = new URL(request.url);
        const supplierId = Number(url.searchParams.get('supplier'));
        const invoiceId = Number(url.searchParams.get('invoice'));
        const user = await getUser(request);

        if(!supplierId || !invoiceId || !user) {
            console.log('No hay datos suficientes para emitir la factura');
            return redirect('/productos');
        }

        const supplier = await getSupplier(supplierId);
        const invoice = await getInvoiceBuy(invoiceId);
        if(!supplier || !invoice) {
            console.log('No existe la factura o el cliente');
            return redirect('/productos');
        }
        // change type data of date to string
        const invoiceNew = invoice ? {...invoice, date: invoice?.date + ''} : null;
        
        const formData = await request.formData();
        const data = formData.get('data');
        if(!data) {
            console.log('No existe data del formulario');
            return redirect('/productos');
        }

        const dataObj = JSON.parse(data as string);
        
        if(dataObj.hasOwnProperty('state')) {
            await setStateInvoiceBuy(invoiceId, dataObj.state);
            console.log('se cambio el state de la factura');
            return redirect('/productos');
        } 

        if(dataObj.hasOwnProperty('products')) {
            if(dataObj.products.length == 0) {
                console.log('no hay productos para generar la factura')
                return redirect('/products');
            }
        }
        

        let supplierName = supplier ? removeSpace(supplier.name) : ''; 
        let invoiceDate = invoiceNew ? formatDateUnSpace(invoiceNew.date) : ''; 
        let nameFile = supplierName +'_factura_'+invoiceDate+generateRandomDigits()+'.pdf';

        const isVercel = process.env.VERCEL === "1";
        if (!isVercel) {
            console.log('En el entorno local se almacena el pdf');
            await ReactPDF.render(<Documento products={dataObj.products} supplier={supplier} invoice={invoiceNew} user={user} type="buy"/>, process.cwd()+`/public/invoicesSupplier/${nameFile}`);
        } else {
            console.log('En el entorno Vercel no se puede escribir archivos');
        }
        
        return null; 
    } catch (error) {
        console.log('error en el action'+ error);
        return redirect('/productos');
    }
}

export default function InvoiceSupplier() {

    const fetcher = useFetcher();

    const navigate = useNavigate();

    const cartLStorage = useCart();
    
    const loader = useLoaderData<LoaderData>();
    
    const [products, setProducts] = useState<productProp[]>([]);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        // console.log(cartLStorage?.cartItems);
        setProducts(cartLStorage?.cartItems.buy ? cartLStorage.cartItems.buy : [] );
        if(cartLStorage?.cartItems.buy.length != 0 ) {
            handleSubmit();
        }
    }, [cartLStorage?.cartItems]);



    const handleSubmit = () => {
        const data = { products: cartLStorage?.cartItems.buy}
        // console.log(cartLStorage?.cartItems);
        
        fetcher.submit(
            { data: JSON.stringify(data) },
            { method: "post"}
        );
    }

    const handleEnd = () => {
        
        // envio al backend data para que modifique la tabla factura
        const data = { state: false}
        fetcher.submit(
            { data: JSON.stringify(data) },
            { method: "post"}
        );

        cartLStorage?.resetCart('buy');
    }

    if (!isClient) {
        return <p>Cargando visor de PDF...</p>;
    }

    return (
        <>
        <div className='container max-w-screen-lg m-auto'>
        <button
            type="button" 
            className="mb-5 rounded-xl mt-3 bg-yellow-300 px-6 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            onClick={handleEnd}
        >Finalizar</button>
        { loader ? (
            <PDFViewer style={{ width: "100%", height: "70vh", margin: "0 auto"}}>
                <Documento products={products} supplier={loader.supplier} invoice={loader.invoice} user={loader.user} type="buy"/>
            </PDFViewer>
        ) : (
            <p>no hay factura</p>
        )}

        </div>
        </>
    )
}