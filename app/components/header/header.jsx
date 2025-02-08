
import { Link } from '@remix-run/react'
import styles from './styles.module.css'
import Navigation from '../nav/navigation';
// import { UserSession } from '~/utils/types.server';
import logo from '../../../public/icons/logo-transparent.png'
// interface HeaderProps {
//     id: string | null;
//     name: string
// }
export default function Header({user}) {
    // console.log(user)
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <Link to='/productos'>
                        <img className='logo w-52 m-2' src={logo} alt="Logo de Factory" />
                    </Link>
                    <Navigation user={user} />
                </div>
                
            </div>
        </header>
    )
}
