import { logout } from "~/utils/auth.server";
import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({request}) => {
    return await logout(request);
}

export default function LogoutUser(){
    return (
        <div>logout</div>
    )
}