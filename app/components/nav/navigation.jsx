
import { Link, useLocation, Form } from '@remix-run/react';
import styles from './styles.module.css';
// import { UserSession } from '~/utils/types.server';

import CartSell from '../cart-sell';
import CartBuy from '../cart-buy';

function Navigation({user}){
    const location = useLocation()
    // console.log(user)
    return (
        <>
        {/* Object.keys(user).length > 0 */}
        {user ? (
            <nav className={styles.nav}>
            <ul>
                <li>
                    <Link to='/productos' className={ `${location.pathname === '/productos' ? 'active' : ''} ` } >Productos</Link>
                    <ul>
                        <li><Link to='/categorias' className={ `${location.pathname === '/categorias' ? 'active' : ''} ` } >Categorías</Link></li>
                        <li><Link to='/modelos' className={ `${location.pathname === '/modelos' ? 'active' : ''} ` } >Modelos</Link></li>
                        <li><Link to='/marcas' className={ `${location.pathname === '/marcas' ? 'active' : ''} ` } >Marcas</Link></li>
                        <li><Link to='/variantes' className={ `${location.pathname === '/variantes' ? 'active' : ''} ` } >Variantes</Link></li>
                        <li><Link to='/fabricados' className={ `${location.pathname === '/fabricados' ? 'active' : ''} ` } >Fabricados</Link></li>
                    </ul>
                </li>
                <li>
                    <Link to='/proveedores' className={ `${location.pathname === '/proveedores' ? 'active' : ''} ` } >Proveedores</Link>
                </li>
                <li>
                    <Link to='/clientes' className={ `${location.pathname === '/clientes' ? 'active' : ''} ` } >Clientes</Link>
                </li>
                <li>
                    <Link to='/backup' className={ `${location.pathname === '/backup' ? 'active' : ''} `  } >Back Up</Link>
                </li>
                <li>
                    <Link to='/'>{user.name}</Link> 
                    <ul>
                        <li>
                            <Form method='post' action='/logout'><button type='submit' className='cursor-pointer'>Log Out</button></Form>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="/compras">
                        <CartBuy />
                    </a>
                </li>
                <li>
                    <a href="/ventas">
                        <CartSell />
                    </a>
                </li>
            </ul>
            </nav>
        ) : (
            <nav className={styles.nav}>
            <ul>
                <li>
                    <Link to='/login' className={ `${location.pathname === '/login' ? 'active' : ''} `  } >Login</Link>
                </li>
            </ul>
            </nav>
        )
        }
        
        </>
    )
}

export default Navigation