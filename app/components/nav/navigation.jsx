
import { Link, useLocation, Form } from '@remix-run/react';
import styles from './styles.module.css';
// import { UserSession } from '~/utils/types.server';

import CartSell from '../cart-sell';
import CartBuy from '../cart-buy';
import { useState } from 'react';
import { capitalizeWords } from '../../utils/utils';

function Navigation({user}) {

    const location = useLocation();

    const [showMenu, setShowMenu] = useState(false);

    const [showMenuProducts, setShowMenuProducts] = useState(false);

    const [showMenuReports, setShowMenuReports] = useState(false);
    
    
    const changeMenu = (e) => {
        setShowMenu(!showMenu);
    }

    const changeMenuReports = () => {
        setShowMenuReports(!showMenuReports);
        setShowMenuProducts(false);
    }

    const changeMenuProducts = () => {
        setShowMenuProducts(!showMenuProducts);
        setShowMenuReports(false);
    }

    return (
        <>
        {user ? (
            <nav className={`${styles.nav} ${styles.desktop}`}>
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
                        <Link to='/reportes/total-ventas' >Reportes</Link>
                        <ul>
                            <li><Link to='/reportes/ventas'  >Ventas</Link></li>
                            <li><Link to='/reportes/compras'  >Compras</Link></li>
                            <li><Link to='/reportes/total-ventas'  >Total Ventas</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to='/productos'>{capitalizeWords(user.name)}</Link> 
                        <ul>
                            <li>
                                <Link to='/logout' className={ `${location.pathname === '/categorias' ? 'active' : ''} ` }>Log Out</Link>
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
            <nav className={`${styles.nav} ${styles.desktop}`}>
            <ul>
                <li>
                    <Link to='/sign-up' className={ `${location.pathname === '/sign-up' ? 'active' : ''} `  } >Registrar</Link>
                </li>
                <li>
                    <Link to='/login' className={ `${location.pathname === '/login' ? 'active' : ''} `  } >Login</Link>
                </li>
            </ul>
            </nav>
        )}

{/* for mobile */}
        {user ? (
            <nav className={` ${styles.mobile}`}>
                <ul className={`${styles.menuMain} `}>
                    <li>
                        <Link to='#' >{capitalizeWords(user.name)}</Link> 
                        <ul>
                            <li>
                                <Link to='/logout' className={ `${location.pathname === '/categorias' ? 'active' : ''} ` }>Log Out</Link>
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
                    <li>
                        <a href="#" onClick={changeMenu}>
                            <img className='w-6' src="/icons/bars.svg" alt="icon show menu" />
                        </a>
                    </li>
                </ul>
                { showMenu && (
                    <div className={`${styles.menuSecond} `}>
                        <span className='flex justify-end'>
                            <img className='w-6 mr-4 mt-2 cursor-pointer' onClick={changeMenu} src="/icons/xmark.svg" alt="icon show menu" />
                        </span>
                        <ul  >
                            <li>
                                <a href='#' onClick={changeMenuProducts}>Productos</a>
                                <ul className={ showMenuProducts ? `${styles.showBlock}` : ''}>
                                    <li><Link to='/productos' onClick={changeMenu} className={ `${location.pathname === '/productos' ? `${styles.active}` : ''} ` } >Productos</Link></li>
                                    <li><Link to='/categorias' onClick={changeMenu} className={ `${location.pathname === '/categorias' ? `${styles.active}` : ''} ` } >Categorías</Link></li>
                                    <li><Link to='/modelos' onClick={changeMenu} className={ `${location.pathname === '/modelos' ? `${styles.active}` : ''} ` } >Modelos</Link></li>
                                    <li><Link to='/marcas' onClick={changeMenu} className={ `${location.pathname === '/marcas' ? `${styles.active}` : ''} ` } >Marcas</Link></li>
                                    <li><Link to='/variantes' onClick={changeMenu} className={ `${location.pathname === '/variantes' ? `${styles.active}` : ''} ` } >Variantes</Link></li>
                                    <li><Link to='/fabricados' onClick={changeMenu} className={ `${location.pathname === '/fabricados' ? `${styles.active}` : ''} ` } >Fabricados</Link></li>
                                </ul>
                            </li>
                            <li>
                                <Link to='/proveedores' onClick={changeMenu} className={ `${location.pathname === '/proveedores' ? `${styles.active}` : ''} ` } >Proveedores</Link>
                            </li>
                            <li>
                                <Link to='/clientes' onClick={changeMenu} className={ `${location.pathname === '/clientes' ? `${styles.active}` : ''} ` } >Clientes</Link>
                            </li>
                            <li>
                                <a href='#' onClick={changeMenuReports}>Reportes</a>
                                <ul className={ showMenuReports ? `${styles.showBlock}` : ''}>
                                    <li><Link to='/reportes/ventas' onClick={changeMenu} className={ `${location.pathname === '/reportes/ventas' ? `${styles.active}` : ''} ` } >Ventas</Link></li>
                                    <li><Link to='/reportes/compras' onClick={changeMenu} className={ `${location.pathname === '/reportes/compras' ? `${styles.active}` : ''} ` }  >Compras</Link></li>
                                    <li><Link to='/reportes/total-ventas' onClick={changeMenu} className={ `${location.pathname === '/reportes/total-ventas' ? `${styles.active}` : ''} ` }  >Total Ventas</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
        ) : (
            <nav className={`${styles.mobile}`}>
                <ul className={`${styles.menuMain} mr-4`}>
                    <li>
                        <Link to='/sign-up' className={ `${location.pathname === '/sign-up' ? 'active' : ''} `  } >Registrar</Link>
                    </li>
                    <li>
                        <Link to='/login' className={ `${location.pathname === '/login' ? 'active' : ''} `  } >Login</Link>
                    </li>
                </ul>
            </nav>
        )}
        </>
    )
}

export default Navigation