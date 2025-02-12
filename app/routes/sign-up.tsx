
import { useState } from "react";
import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { validateEmail, validatePassword, validateName, validateLastName } from "~/utils/validators";
import { register, getUser } from "~/utils/auth.server";
import FormField from "~/components/form-field";

export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();
    const email = form.get('email');
    const password = form.get('password');
    const firstName = form.get('firstName');
    const lastName = form.get('lastName');

    if (typeof email !== 'string' || typeof password !== 'string' || typeof firstName !== 'string' || typeof lastName !== 'string') {
        return json({ error: `Invalid Form Data`, form: action }, { status: 400 })
    }

    const errors = {
        email: validateEmail(email),
        password: validatePassword(password),
        firstName: validateName(firstName),
        lastName: validateLastName(lastName),
    }

    if (Object.values(errors).some(Boolean)) {
        return json({ errors, fields: { email, password, firstName, lastName }, form: action }, { status: 400 })
    }

    return await register({ email, password, firstName, lastName });
}

export const loader: LoaderFunction = async ({ request }) => {
    // If there's already a user in the session, redirect to the home page
    return (await getUser(request)) ? redirect('/productos') : null;
}

export default function Signup() {

    const actionData = useActionData<typeof action>();

    const [errors, setErrors] = useState(actionData?.errors || {});
    const [formError, setFormError] = useState(actionData?.error || '');

    const [formData, setFormData] = useState({
        email: actionData?.fields?.email || '',
        password: actionData?.fields?.password || '',
        firstName: actionData?.fields?.firstName || '',
        lastName: actionData?.fields?.lastName || ''
    });

    // Updates the form data when an input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData(form => ({ ...form, [field]: event.target.value }))
    }

    return (
        <div className="h-full justify-center items-center flex flex-col gap-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-yellow-300">Lubricantes Rojas</h2>
            <p className="font-semibold text-slate-300">Por favor registrate!</p>

            <form method="post" className="rounded-2xl bg-gray-200 p-6 w-11/12 md:w-96">
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{formError}</div>
                <FormField
                    htmlFor="email"
                    label="Email"
                    value={formData.email}
                    onChange={e => handleInputChange(e, 'email')}
                    error={errors?.email}
                />
                <FormField
                    htmlFor="password"
                    type="password"
                    label="Contraseña"
                    value={formData.password}
                    onChange={e => handleInputChange(e, 'password')}
                    error={errors?.password}
                />

                <FormField
                    htmlFor="firstName"
                    label="Primer Nombre"
                    value={formData.firstName}
                    onChange={e => handleInputChange(e, 'firstName')}
                    error={errors?.firstName}
                />

                <FormField
                    htmlFor="lastName"
                    label="Seguno Nombre"
                    value={formData.lastName}
                    onChange={e => handleInputChange(e, 'lastName')}
                    error={errors?.lastName}
                />

                <div className="w-full text-center">
                    <input
                    type="submit"
                    className=" cursor-pointer rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                    value="Registrar"
                    />
                </div>
            </form>
            <p className="font-semibold text-slate-300">¿Ya tiene cuenta? <a href="/login" className="text-yellow-300 underline">Iniciar Sesión</a> </p>
        </div>
    )
}