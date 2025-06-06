
import { useState } from "react";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { useActionData, useNavigate } from "@remix-run/react";

import { registerCustomer } from "~/utils/customer.server";

import { validateName, validatePhone } from "~/utils/validators";
import FormField from "~/components/form-field";
import { getUserIdName } from "~/utils/auth.server";

export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();
    const name = form.get('name');
    const phone = Number(form.get('phone'));
    const address = form.get('address');

    if (typeof name !== 'string' || typeof phone !== 'number' || typeof address !== 'string') {
        return json({ error: `Invalido de tipos en formulario`, form: action }, { status: 400 });
    }

    const errors = {
        name: validateName(name),
        phone: validatePhone(phone),
        address: validateName(address),
    }

    if (Object.values(errors).some(Boolean)) {
        return json({ errors, fields: { name, phone, address}, form: action }, { status: 400 });
    }

    const customer = await registerCustomer({ name, phone, address });
    if(!customer) {
        return json({ error: `No se pudo completar el registro`, form: action }, { status: 400 })
    }
    return redirect('/clientes');
}

export const loader: LoaderFunction = async ({ request }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }

    return null;
}

export default function CrearCustomer() {

    const actionData = useActionData<typeof action>();

    const navigation = useNavigate();

    const [errors, setErrors] = useState(actionData?.errors || {});
    const [formError, setFormError] = useState(actionData?.error || '');

    const [formData, setFormData] = useState({
        name: actionData?.fields?.name || '',
        phone: actionData?.fields?.phone || '',
        address: actionData?.fields?.address || '',
    });

    // Updates the form data when an input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData(form => ({ ...form, [field]: event.target.value }))
    }

    return (
        <div className="h-full justify-center items-center flex flex-col gap-y-4">
            <p className="text-2xl font-extrabold text-yellow-300 mb-6">Registrar Cliente</p>
            <form method="post" className="rounded-2xl bg-gray-200 p-6 w-11/12 md:w-96">
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{formError}</div>
                <FormField
                    htmlFor="name"
                    label="Nombre"
                    value={formData.name}
                    onChange={e => handleInputChange(e, 'name')}
                    error={errors?.name}
                />
                <FormField
                    htmlFor="phone"
                    type="number"
                    label="N° Teléfono"
                    value={formData.phone}
                    onChange={e => handleInputChange(e, 'phone')}
                    error={errors?.phone}
                />

                <FormField
                    htmlFor="address"
                    label="Dirección"
                    value={formData.address}
                    onChange={e => handleInputChange(e, 'address')}
                    error={errors?.address}
                />

                <div className="w-full flex justify-center gap-5">
                    <input
                    type="submit"
                    className=" cursor-pointer rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                    value="Registrar"
                    />
                    <button 
                        type="button"
                        className="rounded-xl mt-3 bg-yellow-300 px-6 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                        onClick={() => navigation(`/clientes`)}
                    >Cancelar</button>
                </div>
            </form>
        </div>
    )
}