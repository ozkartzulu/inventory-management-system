import { logout } from "~/utils/auth.server";
import { ActionFunction, LoaderFunction } from "@remix-run/node";

// export const action: ActionFunction = async ({request}) => {
//     return await logout(request);
// }

export const loader: LoaderFunction = async ({request}) => {
    return await logout(request);
}

export default function LogoutUser(){
    return (
        <div>logout</div>
    )
}