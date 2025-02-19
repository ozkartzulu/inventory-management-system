import { PDFViewer, pdf} from '@react-pdf/renderer';
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
import { customer } from '@prisma/client';
import { productProp } from '~/utils/types.server';

type LoaderData = {
    customer: customer | null, 
    invoice: {id: number, date: string, total: number, debt: number, state: boolean, userId: number, customerId: number} | null, 
    user: {id: number, firstName: string, lastName: string, email: string} | null,
    sold: boolean
}

export const loader: LoaderFunction = async ({ request }) => {

    try {
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
        if(!customer || !invoice) {
            console.log('No hay datos de cliente y factura');
            return redirect('/productos');
        }

        if(!invoice.state) {
            console.log('la factura ya fué emitida');
            return redirect('/productos');
        }
        
        // change type data of date to string
        const invoiceNew = invoice ? {...invoice, date: invoice?.date + ''} : null;
        
        return json<LoaderData>({customer: customer, invoice: invoiceNew, user: user, sold: true});
    } catch (error) {
        console.log('error en el loader'+ error);
        return redirect('/productos');
    }
}

export async function action({ request}: ActionFunctionArgs) {
    try {
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
        if(!customer || !invoice) {
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
            await setStateInvoice(invoiceId, dataObj.state);
            console.log('se cambio el state de la factura');
            return redirect('/productos');
        } 

        if(dataObj.hasOwnProperty('products')) {
            if(dataObj.products.length == 0) {
                console.log('no hay productos para generar la factura')
                return redirect('/products');
            }
        }

        let customerName = customer ? removeSpace(customer.name) : ''; 
        let invoiceDate = invoiceNew ? formatDateUnSpace(invoiceNew.date) : ''; 
        let nameFile = customerName +'_factura_'+invoiceDate+generateRandomDigits()+'.pdf';

        const isVercel = process.env.VERCEL === "1";
        if (!isVercel) {
            console.log('En el entorno local se almacena el pdf');
            await ReactPDF.render(<Documento products={dataObj.products} customer={customer} invoice={invoiceNew} user={user} type="sell"/>, process.cwd()+`/public/invoices/${nameFile}`);
        } else {
            console.log('En el entorno Vercel no se puede escribir archivos');
        }
        
        return null; 
    } catch (error) {
        console.log('error en el action'+ error);
        return redirect('/productos');
    }
}

export default function Invoice() {

    const fetcher = useFetcher();

    const navigate = useNavigate();

    const cartLStorage = useCart();
    
    const loader = useLoaderData<LoaderData>();
    
    const [products, setProducts] = useState<productProp[]>([]);

    const [isClient, setIsClient] = useState(false);

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        // console.log(cartLStorage?.cartItems);
        setProducts(cartLStorage?.cartItems.sell ? cartLStorage.cartItems.sell : [] );
        if(cartLStorage?.cartItems.sell.length != 0 ) {
            handleSubmit();
        }
    }, [cartLStorage?.cartItems]);



    const handleSubmit = () => {
        const data = { products: cartLStorage?.cartItems.sell}
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

        cartLStorage?.resetCart('sell');
    }

    const isMobile = () => {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return regex.test(navigator.userAgent);
    }

    const handleDownload = async () => {
        const blob = await pdf(<Documento products={products} customer={loader.customer} invoice={loader.invoice} user={loader.user} type="sell"/>).toBlob(); // Genera el PDF como Blob
        const url = URL.createObjectURL(blob); // Crea una URL para descargar
        setPdfUrl(url);
    };
    
    if (!isClient) {
        return <p>Cargando visor de PDF...</p>;
    }

    return (
        <>
        <div className='container max-w-screen-lg m-auto'>
        <div className='px-6 flex flex-col gap-5'>
            <button
                type="button" 
                className="min-w-36 mb-5 font-bold rounded-xl mt-3 bg-yellow-300 px-6 py-3 text-blue-600 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                onClick={handleEnd}
            >Finalizar</button>
            { loader && !isMobile() ? (
                <PDFViewer style={{ width: "100%", height: "70vh", margin: "0 auto"}}>
                    <Documento products={products} customer={loader.customer} invoice={loader.invoice} user={loader.user} type="sell"/>
                </PDFViewer>
            ) : (
                loader ? (
                    <>
                        <button
                            onClick={handleDownload}
                            className="min-w-36 mb-5 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold"
                        >
                            Descargar PDF
                        </button>
                        {pdfUrl && (
                            <a className="min-w-36 mb-5 px-4 py-3 text-center bg-gray-500 text-white rounded-xl font-bold" href={pdfUrl} download={loader.customer?.name + "_factura_"+loader.invoice?.date+".pdf"}>
                            Haz clic aquí para descargar
                            </a>
                    )}
                    </>
                ) : (
                    <p>no hay factura</p>
                ) 
            )}

        </div>
        </div>
        </>
    )
}