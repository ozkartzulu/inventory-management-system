
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ActionFunction, ActionFunctionArgs, json, LoaderFunction, redirect } from "@remix-run/node";
import { getUser, getUserIdName, requireUserId } from "~/utils/auth.server";
import { getAllProducts } from "~/utils/product.server";
import ItemTotalVentas from "~/components/report/item-total-ventas";
import Button from "~/components/button";
import { getAllInventories, getAllInventoriesProduct } from "~/utils/inventory.server";
import { getAllOrders, getAllOrdersProduct, getAllSalesProduct } from "~/utils/order.server";
import { getAllCustomers, getCustomer } from "~/utils/customer.server";
import { getAllSuppliers } from "~/utils/supplier.server";
import { getAllUsers } from "~/utils/user.server";
import { getAllCategories } from "~/utils/category.server";
import { buildBuy, buildSell } from "~/utils/utils";
import { OrderType, TotalVenta } from "~/utils/types.server";
import { log } from "node:console";

type Data = {
    totalCompras: TotalVenta[];
}

type ActionData = {
    totalCompras: TotalVenta[] | undefined;
}

export const loader: LoaderFunction = async ({ request }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    const dateCurrent = new Date();
    dateCurrent.setHours(0,0,0,0);
    
    const orders = await getAllOrdersProduct(dateCurrent, null);
    const compras = await getAllSalesProduct(dateCurrent, null);

    if(!orders) {
        return null;
    }

    let totalVentas:TotalVenta[] = [];
    let totalCompras:TotalVenta[] = [];

    totalVentas = buildSell(orders, totalVentas );
    totalCompras = buildBuy(compras, totalVentas );

    totalCompras = Object.values(totalCompras);
    return {totalCompras};
}

export const action:ActionFunction = async ({ request}) => {

    const formData = await request.formData();
    const startDate = formData.get('start-date');
    const endDate = formData.get('end-date');

    const selectStart = typeof startDate === 'string' ? startDate  : new Date().toISOString();
    let selectEnd = '';
    if(typeof endDate === 'string') {
        selectEnd = endDate;
    } else {
        selectEnd = selectStart;
    }

    const dateStart = new Date(selectStart);
    dateStart.setHours(23, 59, 59, 999);

    const dateEnd = new Date(selectEnd);
    dateEnd.setDate(dateEnd.getDate() + 1);
    dateEnd.setHours(23, 59, 59, 999);

    // console.log(dateStart)
    // console.log(dateEnd)
    const orders = await getAllOrdersProduct(dateStart, dateEnd);
    const compras = await getAllSalesProduct(dateStart, dateEnd);
    // console.log(orders)
    // console.log(compras)

    if(!orders) {
        return null;
    }

    let totalVentas:TotalVenta[] = [];
    let totalCompras:TotalVenta[] = [];

    totalVentas = buildSell(orders, totalVentas );
    totalCompras = buildBuy(compras, totalVentas );

    totalCompras = Object.values(totalCompras);
    return {totalCompras};
}

export default function ReporteTotalVentas() {

    const submit = useSubmit();

    const action = useActionData<ActionData>();

    const data:Data = useLoaderData();

    const ordersData = data.totalCompras;

    const [start, setStart] = useState('');

    const [totales, setTotales] = useState(() => {

        const amountSell = ordersData.reduce( (total, order) => total + order.amountSell, 0 );
        const amountBuy = ordersData.reduce( (total, order) => total + order.amountBuy, 0 );
        const quantitySell = ordersData.reduce( (total, order) => total + order.quantitySell, 0 );
        const quantityBuy = ordersData.reduce( (total, order) => total + order.quantityBuy, 0 );

        return {
            amountSell: amountSell,
            amountBuy: amountBuy,
            quantitySell: quantitySell,
            quantityBuy: quantityBuy
        }
    })

    const [orders, setOrders] = useState( () => {
        return ordersData;
    } );

    useEffect(() => {
        if(action?.totalCompras) {

            const amountSell = action.totalCompras.reduce( (total, order) => total + order.amountSell, 0 );
            const amountBuy = action.totalCompras.reduce( (total, order) => total + order.amountBuy, 0 );
            const quantitySell = action.totalCompras.reduce( (total, order) => total + order.quantitySell, 0 );
            const quantityBuy = action.totalCompras.reduce( (total, order) => total + order.quantityBuy, 0 );

            setTotales({
                amountSell: amountSell,
                amountBuy: amountBuy,
                quantitySell: quantitySell,
                quantityBuy: quantityBuy
            });

            setOrders(action.totalCompras);
        }
        
    }, [action?.totalCompras])


    const handleStart = (e: React.ChangeEvent<HTMLInputElement>) => {

        setStart(e.target.value);

        let formData = new FormData();
        formData.append("start-date", e.target.value);
        submit(formData, { method: "post",});
    }

    const handleEnd = (e: React.ChangeEvent<HTMLInputElement>) => {

        let formData = new FormData();
        formData.append("end-date", e.target.value);
        formData.append("start-date", start);
        submit(formData, { method: "post",});
    }

    return (
        <div className="container max-w-screen-xl m-auto px-4">
            <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Total Ventas</h2>
            <form method="post">
            <div className='flex flex-wrap gap-5 mb-3'>
                <div className="flex gap-3 md:gap-6 items-center md:mr-7">
                    <label htmlFor="start" className="text-yellow-300 text-lg md:text-lg font-bold w-2/5 ">Seleccionar Fecha Inicio</label>
                    <input type="date" id="start" name="start" className="py-2 px-3 rounded-md w-3/5" onChange={handleStart}/>
                </div>
                <div className="flex gap-3 md:gap-6 items-center">
                    <label htmlFor="end" className="text-yellow-300 text-lg md:text-lg font-bold w-2/5" >Seleccionar Fecha Fin</label>
                    <input type="date" id="end" name="end" className="py-2 px-3 rounded-md w-3/5" onChange={handleEnd} />
                </div>
            </div>
            </form>
        { orders?.length ? (
            <>
            <div className="list-products overflow-auto">
                <table className='w-full'> 
                    <thead className='bg-indigo-600 text-white text-left'>
                        <tr>
                            <th className='p-2'>Nombre</th>
                            <th className='p-2'>Imagen</th>
                            <th className='p-2'>Cantidad Comprados</th>
                            <th className='p-2'>Monto Comprados</th>
                            <th className='p-2'>Cantidad Vendidas</th>
                            <th className='p-2'>Monto Vendidas</th>
                        </tr>
                    </thead>
                    <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-thin'>
                        { orders.map( (order, index) => (
                            <ItemTotalVentas order={order} key={index} />
                        ) ) }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td className='p-2 border border-pink-200 border-opacity-30 text-yellow-300 font-bold text-left'>Total</td>
                            <td className='p-2 border border-pink-200 border-opacity-30 text-yellow-300 font-bold text-left'>{totales.quantityBuy}</td>
                            <td className='p-2 border border-pink-200 border-opacity-30 text-yellow-300 font-bold text-left'>{totales.amountBuy}</td>
                            <th className='p-2 border border-pink-200 border-opacity-30 text-yellow-300 font-bold text-left'>{totales.quantitySell}</th>
                            <td className="p-2 border border-pink-200 border-opacity-30 text-yellow-300 font-bold">{totales.amountSell}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            </>
            ) : (<p>No hay registro de Ventas</p>)}
        </div>
    )
}