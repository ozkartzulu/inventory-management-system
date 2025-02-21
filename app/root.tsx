import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation
} from "@remix-run/react";
import "./tailwind.css";
import { LoaderFunction } from "@remix-run/node";
import Header from '~/components/header/header';
import { getUserIdName } from "./utils/auth.server";
import styles from './styles.module.css';
import { useEffect } from "react";
import { CartProvider } from "./context/CartProvider";
import Spinner from "./components/spinner";

export const loader: LoaderFunction = async ({ request }) => {
  let user = await getUserIdName(request);
  return user;
}

// export function Layout({ children}: { children: React.ReactNode }) {

    
//   return (
// 	<CartProvider>
// 		<html lang="en">
// 		<head>
// 			<meta charSet="utf-8" />
// 			<meta name="viewport" content="width=device-width, initial-scale=1" />
// 			<Meta />
// 			<Links />
// 		</head>
// 		{/* <body className={styles.body}> */}
			
// 			{/* <main> */}
// 			{children}
// 			{/* </main> */}
// 			<ScrollRestoration />
// 			<Scripts />
// 		{/* </body> */}
// 		</html>
// 	</CartProvider>
//   );
// }

// export default function App() {
//   const user  = useLoaderData(); // ✅ Aquí sí puedes usar useLoaderData()
//   return (
//     <Layout>
//         <Header user={user}/>
//         <Outlet />
//     </Layout>
//   )
  
// }

export default function App() {

    const user = useLoaderData();
    const navigation = useNavigation();
    const isLoading = navigation.state !== "idle"
    
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
            <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
      { isLoading && <Spinner/>}
    </html>
    </CartProvider>
  );
}
