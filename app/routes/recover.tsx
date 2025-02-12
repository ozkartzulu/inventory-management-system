
import { useState, useEffect, useRef } from 'react';
import { ActionFunction, LoaderFunction, json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { login, getUser } from '~/utils/auth.server';
import FormField from '~/components/form-field';
import FieldPassword from '~/components/field-password'
import { validateEmail, validatePassword, validateRepeatPassword } from '~/utils/validators';
import { updateUserPwd } from '~/utils/user.server';


export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();
    const email = form.get('email');
    const password = form.get('password');
    const repeatPwd = form.get('repeatPwd');

    if (typeof email !== 'string' || typeof password !== 'string' || typeof repeatPwd !== 'string') {
        return json({ error: `Invalido de datos`, form: action }, { status: 400 })
    }

    const errors = {
        email: validateEmail(email),
        password: validatePassword(password),
        repeatPwd: validateRepeatPassword(password, repeatPwd),
    }

    if (Object.values(errors).some(Boolean)) {
        return json({ errors, fields: { email, password, repeatPwd }, form: action }, { status: 400 })
    }

    return await updateUserPwd({ email, password });
}

export const loader: LoaderFunction = async ({ request }) => {
    // If there's already a user in the session, redirect to the home page
    // console.log(request)
    return (await getUser(request)) ? redirect('/productos') : null;
}

export default function Recover() {

    const actionData = useActionData<typeof action>();

    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState(actionData?.errors || {});
    const [formError, setFormError] = useState(actionData?.error || '');

    const [formData, setFormData] = useState({
        email: actionData?.fields.email || '',
        password: '',
        repeatPwd: '',
    });

    // Updates the form data when an input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData(form => ({ ...form, [field]: event.target.value }))
    }


    return (
        <div className="h-full justify-center items-center flex flex-col gap-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-yellow-300">Lubricantes Rojas</h2>
            <p className="font-semibold text-slate-300">Cambiar contraseña</p>

            <form method="post" className="rounded-2xl bg-gray-200 p-6 w-11/12 md:w-96">
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{formError}</div>
                <FormField
                    htmlFor="email"
                    label="Email"
                    value={formData.email}
                    onChange={e => handleInputChange(e, 'email')}
                    error={errors?.email}
                />

                <FieldPassword
                    htmlFor="password"
                    label="Nueva Contraseña"
                    onChange={e => handleInputChange(e, 'password')}
                    error={errors?.password}
                />

                <FieldPassword
                    htmlFor="repeatPwd"
                    label="Repetir nueva Contraseña"
                    onChange={e => handleInputChange(e, 'repeatPwd')}
                    error={errors?.repeatPwd}
                />

                <div className="w-full text-center">
                    <input
                    type="submit"
                    className="cursor-pointer rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                    value="Cambiar Contraseña"
                    />
                </div>
            </form>
            <p className="font-semibold text-slate-300">¿No tienes cuenta aún? <a href="/sign-up" className='text-yellow-300 underline'>Registrate!</a> </p>
            <p className="font-semibold text-slate-300">¿Ya tiene cuenta? <a href="/login" className="text-yellow-300 underline">Iniciar Sesión</a> </p>
        </div>
    )
}