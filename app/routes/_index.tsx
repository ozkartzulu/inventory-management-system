import { LoaderFunction, redirect } from "@remix-run/node";
import { getUser, getUserIdName } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
    // If there's already a user in the session, redirect to the home page
    // console.log(request)
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    return (await getUser(request)) ? redirect('/productos') : null;
}

export default function Index() {
    return (
        <>index</>
    )
}