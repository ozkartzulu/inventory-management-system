
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Category, Customer, InvoiceOrder, Product, Supplier, User } from "@prisma/client";
import { ActionFunction, ActionFunctionArgs, json, LoaderFunction, redirect } from "@remix-run/node";
import { getUser, getUserIdName, requireUserId } from "~/utils/auth.server";
import { getAllProducts } from "~/utils/product.server";
import ItemBuy from "~/components/report/item-buy";
import Button from "~/components/button";
import { getAllInventories } from "~/utils/inventory.server";
import { getAllOrders, getAllSales } from "~/utils/order.server";
import { getAllCustomers, getCustomer } from "~/utils/customer.server";
import { getAllSuppliers } from "~/utils/supplier.server";
import { getAllUsers } from "~/utils/user.server";
import { getAllCategories } from "~/utils/category.server";

type OrderType = {
    id: number;
    quantity: number;
    price: number;
    date: string;
    productId: number;
    invoiceSalesId: number;
    product: {id: number, url: string, name: string, categoryId: number, category: Category};
    invoiceSales: {
        id: number;
        date: string;
        total: number;
        debt: number; 
        state: boolean; 
        userId: number; 
        supplierId: number;
        user: {id: number, firstName: string}; 
        supplier: {id: number, name: string}; 
    };
}
type Data = {
    orderList: OrderType[];
    suppliers: Supplier[];
    users: {id: number, firstName: string, lastName: string}[];
    categories: Category[];
}

export const loader: LoaderFunction = async ({ request }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    const orders = await getAllSales();
    const suppliers = await getAllSuppliers();
    const users = await getAllUsers();
    const categories = await getAllCategories();

    if(!orders) {
        return null;
    }
    const orderList = orders.map( order => ({...order, date: order.date.toISOString(), invoiceSales: {...order.invoiceSales, date: order.invoiceSales.date.toISOString()}}))
    return {orderList, suppliers, users, categories};

}

export default function ReporteCompras() {
    const data:Data = useLoaderData();

    const ordersData = data?.orderList;
    
    const [searchTerm, setSearchTerm] = useState('');

    const [supplier, setSupplier] = useState(0);
    const [user, setUser] = useState(0);
    const [category, setCategory] = useState(0);
    const [date, setDate] = useState('2');

    const [orders, setOrders] = useState( () => {
        return ordersData.sort((a:OrderType, b:OrderType) => new Date(b.date).getTime() - new Date(a.date).getTime() );
    } );

    useEffect( () => {

        let ordersFilter:OrderType[] = ordersData;

        if(supplier) {
            ordersFilter = ordersData.filter( (order) => {
                if(order.invoiceSales.supplier.id === supplier) {
                    return order;
                }
            } );
        }

        if(user) {
            ordersFilter = ordersFilter.filter( (order) => {
                if(order.invoiceSales.user.id === user) {
                    return order;
                }
            } );
        }

        if(category) {
            ordersFilter = ordersFilter.filter( (order) => {
                if(order.product.categoryId === category) {
                    return order;
                }
            } );
        }

        if(searchTerm) {
            ordersFilter = ordersFilter.filter( (order) => {
                if(order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ) {
                    return order;
                }
            } );
        }

        if(date == '2') {
            ordersFilter = ordersFilter.sort((a:OrderType, b:OrderType) => new Date(a.date).getTime() - new Date(b.date).getTime() );
        } else {
            ordersFilter = ordersFilter.sort((a:OrderType, b:OrderType) => new Date(b.date).getTime() - new Date(a.date).getTime() );
        }

        setOrders(ordersFilter);

    },[supplier, user, category, searchTerm, date])

    const handleSupplier = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSupplier(+e.target.value);
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
            <h2 className='text-3xl text-yellow-300 font-bold text-center mb-5'>Lista de Compras</h2>
            <div className='flex gap-5 mb-3'>
                <input 
                    type="text"
                    className='py-1 px-3 shadow-sm w-1/3 rounded'
                    onChange={ e => setSearchTerm(e.target.value) } 
                    placeholder="Buscar por Nombre de Producto..." 
                />
                <select  id='select-supplier' name='select-supplier' className="p-2 rounded-md w-44" onChange={handleSupplier}>
                    <option  value=''>Todos los Proveedores</option>
                    {data?.suppliers.map( (supplier, index) => (
                        <option value={supplier.id} key={supplier.id}>{ supplier.name}</option>
                    ) )}
                </select>
                <select  id='select-user' name='select-user' className="p-2 rounded-md w-44" onChange={handleUser}>
                    <option  value=''>Todos los Usuario</option>
                    {data?.users.map( (user, index) => (
                        <option value={user.id} key={user.id}>{ user.firstName}</option>
                    ) )}
                </select>
                <select  id='select-category' name='select-category' className="p-2 rounded-md w-44" onChange={handleCategory}>
                    <option  value=''>Todas las Categoría</option>
                    {data?.categories.map( (category, index) => (
                        <option value={category.id} key={category.id}>{ category.name}</option>
                    ) )}
                </select>
                <select  id='select-date' name='select-date' className="p-2 rounded-md w-44" onChange={handleDate}>
                    <option  value='2'>Fecha DESC</option> 
                    <option  value='1'>Fecha ASC</option>
                </select>
            </div>
        { orders?.length ? (
            <>
            <div className="list-products">
                <table className='w-full'> 
                    <thead className='bg-indigo-600 text-white text-left'>
                        <tr>
                            <th className='p-2'>Fecha</th>
                            <th className='p-2'>Nombre</th>
                            <th className='p-2'>Cantidad</th>
                            <th className='p-2'>Precio</th>
                            <th className='p-2'>Categoría</th>
                            <th className='p-2'>Imagen</th>
                            <th className='p-2'>Usuario</th>
                            <th className='p-2'>Proveedor</th>
                        </tr>
                    </thead>
                    <tbody className='border-l border-r border-pink-200 border-opacity-30 text-white font-thin'>
                        { orders?.map( order => (
                            <ItemBuy order={order} key={order.id} />
                        ) ) }
                    </tbody>
                </table>
            </div>
            </>
            ) : (<p>No hay registro de Compras</p>)}
        </div>
    )
}