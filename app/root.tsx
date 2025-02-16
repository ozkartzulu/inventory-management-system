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
  return user;
}

export function Layout({ children, user }: { children: React.ReactNode, user: any }) {

//   const user = useLoaderData();
    
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
//   return <Outlet />;
  const user  = useLoaderData(); // ✅ Aquí sí puedes usar useLoaderData()
  return <Layout user={user}><Outlet /></Layout>;
}
