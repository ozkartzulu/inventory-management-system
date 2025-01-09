import {Document, Page, Text, View, Image, PDFViewer} from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
import { ActionFunctionArgs, json, LoaderFunction, redirect } from '@remix-run/node';
import { useEffect, useState } from 'react';
import useCart from '~/hooks/useCart';
import Documento from '~/components/invoice/document';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { getCustomer } from '~/utils/customer.server';
import { getInvoice, setStateInvoice } from '~/utils/invoice.server';
import { getUser } from '~/utils/auth.server';
import { formatDateUnSpace, generateRandomDigits, removeSpace } from '~/utils/utils';
import { Customer, InvoiceOrder } from '@prisma/client';
import SharePdf from '~/components/share-button';
import { log } from 'node:console';

type LoaderData = {
    customer: Customer | null, 
    invoice: {id: number, date: string, total: number, debt: number, state: boolean, userId: number, customerId: number} | null, 
    user: {id: number, firstName: string, lastName: string, email: string} | null,
    sold: boolean
}

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const customerId = Number(url.searchParams.get('customer'));
    const invoiceId = Number(url.searchParams.get('invoice'));
    const user = await getUser(request);

    if(!customerId || !invoiceId || !user) {
        console.log('No hay datos suficientes para emitir la factura');
        return redirect('/productos');
    }

    const customer = await getCustomer(customerId);
    const invoice = await getInvoice(invoiceId);
    // console.log(invoice);
    
    // change type data of date to string
    const invoiceNew = invoice ? {...invoice, date: invoice?.date + ''} : null;
    
    return json<LoaderData>({customer: customer, invoice: invoiceNew, user: user, sold: true});
}

export async function action({ request}: ActionFunctionArgs) {

    const url = new URL(request.url);
    const customerId = Number(url.searchParams.get('customer'));
    const invoiceId = Number(url.searchParams.get('invoice'));
    const user = await getUser(request);

    if(!customerId || !invoiceId || !user) {
        console.log('No hay datos suficientes para emitir la factura');
        return redirect('/productos');
    }

    const customer = await getCustomer(customerId);
    const invoice = await getInvoice(invoiceId);
    // change type data of date to string
    const invoiceNew = invoice ? {...invoice, date: invoice?.date + ''} : null;
    
    const formData = await request.formData();
    const data = formData.get('data');
    if (!data) {
        console.log('No hay productos para la factura');
        return redirect('/productos');
    }

    const dataObj = JSON.parse(data as string);
    // console.log(dataObj);
    // return null;
    
    if(dataObj.hasOwnProperty('state')) {
        await setStateInvoice(invoiceId, dataObj.state);
        console.log('se cambio el state de la factura');
        return redirect('/productos');
    }

    

    // const { products } = JSON.parse(data as string);
    if(dataObj.hasOwnProperty('products')) {
        if(dataObj.products.length == 0) {
            console.log('no hay productos para generar la factura')
            return redirect('/products');
        }
    }
    

    let customerName = customer ? removeSpace(customer.name) : ''; 
    let invoiceDate = invoiceNew ? formatDateUnSpace(invoiceNew.date) : ''; 
    let nameFile = customerName +'_factura_'+invoiceDate+generateRandomDigits()+'.pdf';

    ReactPDF.render(<Documento products={dataObj.products} customer={customer} invoice={invoiceNew} user={user} />, `public/invoices/${nameFile}`);
    
    
    return null; 
}

export default function Invoice() {

    const fetcher = useFetcher();

    const navigate = useNavigate();

    const cartLStorage = useCart();
    const products = cartLStorage?.cartItems ? cartLStorage?.cartItems : [];

    const loader = useLoaderData<LoaderData>();

    const [isClient, setIsClient] = useState(false);

    const [invoiceState, setInvoiceState] = useState(loader.invoice?.state);

    useEffect(() => {
        setIsClient(true);
        handleSubmit();

        if(products.length == 0 ) {
            navigate('/productos');
        }

        if(!invoiceState) {
            navigate('/productos');
        }
        // window.addEventListener("beforeunload", handleEnd);

        // return () => {
        //     window.removeEventListener("beforeunload", handleEnd);
        // };
    }, []);

    useEffect(() => {
        if(products.length == 0 ) {
            navigate('/productos');
        }
    }, [products]);

    useEffect(() => {
        if(!invoiceState) {
            navigate('/productos');
        }
    }, [invoiceState]);


    const handleSubmit = () => {
        const data = { products: products}
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

        cartLStorage?.resetCart();
        setInvoiceState(false);
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
                <Documento products={products} customer={loader.customer} invoice={loader.invoice} user={loader.user}/>
            </PDFViewer>
        ) : (
            <p>no hay factura</p>
        )}

        </div>
        </>
    )
}