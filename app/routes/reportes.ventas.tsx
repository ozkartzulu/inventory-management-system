
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { category, customer} from "@prisma/client";
import { ActionFunction, ActionFunctionArgs, json, LoaderFunction, redirect } from "@remix-run/node";
import { getUser, getUserIdName, requireUserId } from "~/utils/auth.server";
import { getAllProducts } from "~/utils/product.server";
import ItemSell from "~/components/report/item-sell";
import Button from "~/components/button";
import { getAllInventories } from "~/utils/inventory.server";
import { getAllOrders } from "~/utils/order.server";
import { getAllCustomers, getCustomer } from "~/utils/customer.server";
import { getAllSuppliers } from "~/utils/supplier.server";
import { getAllUsers } from "~/utils/user.server";
import { getAllCategories } from "~/utils/category.server";
import { capitalizeWords } from "~/utils/utils";

import styles from '../styles.module.css';

type OrderType = {
    id: number;
    quantity: number;
    price: number;
    date: string;
    productId: number;
    invoiceOrderId: number;
    product: {id: number, url: string, name: string, categoryId: number, category: category};
    invoiceOrder: {
        id: number;
        date: string;
        total: number;
        debt: number; 
        state: boolean; 
        userId: number; 
        customerId: number;
        user: {id: number, firstName: string}; 
        customer: {id: number, name: string}; 
    };
}
type Data = {
    orderList: OrderType[];
    customers: customer[];
    users: {id: number, firstName: string, lastName: string}[];
    categories: category[];
}

export const loader: LoaderFunction = async ({ request }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    const orders = await getAllOrders();
    const customers = await getAllCustomers();
    const users = await getAllUsers();
    const categories = await getAllCategories();
    // const inventories = await getAllInventories();

    if(!orders) {
        return null;
    }
    const orderList = orders.map( order => ({...order, date: order.date.toISOString(), invoiceOrder: {...order.invoiceorder, date: order.invoiceorder.date.toISOString()}}))
    return {orderList, customers, users, categories};

}

// export const action:ActionFunction = async ({ request}) => {

//     const formData = await request.formData();
//     const selectClient = formData.get('select-client');
    
//     return null;
// }

export default function ReporteVentas() {
    const data:Data = useLoaderData();

    const ordersData = data?.orderList;
    
    const [searchTerm, setSearchTerm] = useState('');

    const [client, setClient] = useState(0);
    const [user, setUser] = useState(0);
    const [category, setCategory] = useState(0);
    const [date, setDate] = useState('2');

    const [orders, setOrders] = useState( () => {
        return ordersData?.sort((a:OrderType, b:OrderType) => new Date(b.date).getTime() - new Date(a.date).getTime() );
    } );

    useEffect( () => {

        let ordersFilter:OrderType[] = ordersData;

        if(client) {
            ordersFilter = ordersData?.filter( (order) => {
                if(order.invoiceOrder.customer.id === client) {
                    return order;
                }
            } );
        }

        if(user) {
            ordersFilter = ordersFilter?.filter( (order) => {
                if(order.invoiceOrder.user.id === user) {
                    return order;
                }
            } );
        }

        if(category) {
            ordersFilter = ordersFilter?.filter( (order) => {
                if(order.product.categoryId === category) {
                    return order;
                }
            } );
        }

        if(searchTerm) {
            ordersFilter = ordersFilter?.filter( (order) => {
                if(order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ) {
                    return order;
                }
            } );
        }

        if(date == '2') {
            ordersFilter = ordersFilter?.sort((a:OrderType, b:OrderType) => new Date(a.date).getTime() - new Date(b.date).getTime() );
        } else {
            ordersFilter = ordersFilter?.sort((a:OrderType, b:OrderType) => new Date(b.date).getTime() - new Date(a.date).getTime() );
        }

        setOrders(ordersFilter);

    },[client, user, category, searchTerm, date])

    const handleClient = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setClient(+e.target.value);
    }

    const handleUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUser(+e.target.value);
    }

    const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(+e.target.value);
    }

    const handleDate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDate(e.target.value);
    }

    return (
        <div className="container max-w-screen-xl m-auto px-4">
            <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Lista de Ventas</h2>
            <div className='flex flex-wrap gap-5 mb-4'>
                <input 
                    type="text"
                    className='py-2 px-3 shadow-sm w-full md:w-1/3 rounded'
                    onChange={ e => setSearchTerm(e.target.value) } 
                    placeholder="Buscar por Nombre de Producto..." 
                />
                <select  id='select-client' name='select-client' className="p-2 rounded-md w-full md:w-44" onChange={handleClient}>
                    <option  value=''>Todos los Cliente</option>
                    {data?.customers.map( (customer, index) => (
                        <option value={customer.id} key={customer.id}>{ capitalizeWords(customer.name)}</option>
                    ) )}
                </select>
                <select  id='select-user' name='select-user' className="p-2 rounded-md w-full md:w-44" onChange={handleUser}>
                    <option  value=''>Todos los Usuario</option>
                    {data?.users.map( (user, index) => (
                        <option value={user.id} key={user.id}>{ capitalizeWords(user.firstName)}</option>
                    ) )}
                </select>
                <select  id='select-category' name='select-category' className="p-2 rounded-md w-full md:w-44" onChange={handleCategory}>
                    <option  value=''>Todas las Categoría</option>
                    {data?.categories.map( (category, index) => (
                        <option value={category.id} key={category.id}>{ capitalizeWords(category.name)}</option>
                    ) )}
                </select>
                <select  id='select-date' name='select-date' className="p-2 rounded-md w-full md:w-44" onChange={handleDate}>
                    <option  value='2'>Fecha DESC</option> 
                    <option  value='1'>Fecha ASC</option>
                </select>
            </div>
        { orders?.length ? (
            <>
            <div className="list-products overflow-auto">
                <table className={`${styles.tableZebra} w-full`}> 
                    <thead className='bg-indigo-600 text-white text-left'>
                        <tr>
                            <th className='p-2'>Fecha</th>
                            <th className='p-2'>Nombre</th>
                            <th className='p-2'>Cantidad</th>
                            <th className='p-2'>Precio</th>
                            <th className='p-2'>Categoría</th>
                            <th className='p-2'>Imagen</th>
                            <th className='p-2'>Usuario</th>
                            <th className='p-2'>Cliente</th>
                        </tr>
                    </thead>
                    <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-normal'>
                        {/* { products?.filter( (product) => {
                            if(searchTerm == ''){
                                return product
                            }else if( product.name.toLowerCase().includes( searchTerm.toLowerCase() ) ){
                                return product
                            }
                        } ).map( product => (
                            <ItemProduct product={product} key={product.id} />
                        ) ) } */}
                        { orders?.map( order => (
                            <ItemSell order={order} key={order.id} />
                        ) ) }
                    </tbody>
                </table>
            </div>
            </>
            ) : (<p>No hay registro de Ventas</p>)}
        </div>
    )
}