import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import "./tailwind.css";
import { LoaderFunction } from "@remix-run/node";
import Header from '~/components/header/header';
import { getUserIdName } from "./utils/auth.server";
import styles from './styles.module.css';
import { useEffect } from "react";
import { CartProvider } from "./context/CartProvider";

export const loader: LoaderFunction = async ({ request }) => {
  let user = await getUserIdName(request);
  // console.log(user)
  return user;
}
// interface HeaderProps {
//   id: string | null;
//   name: string
// }

export function Layout({ children }: { children: React.ReactNode }) {

  const user = useLoaderData();

//   cuando cargue el componente crear cart en localstorage si no existe
//   useEffect( () => {
//     if( !localStorage.getItem('cart') ) {
//         localStorage.setItem('cart', JSON.stringify([]));
//     }
//   }, [] );
    
  return (
	<CartProvider>
		<html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<Meta />
			<Links />
		</head>
		<body className={styles.body}>
			<Header user={user}/>
			<main>
			{children}
			</main>
			<ScrollRestoration />
			<Scripts />
		</body>
		</html>
	</CartProvider>
  );
}

export default function App() {
  return <Outlet />;
}
