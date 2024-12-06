
import { useState } from "react";
import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { validateEmail, validatePassword, validateName, validateLastName } from "~/utils/validators";
import { registerCategory } from "~/utils/category.server";
import { getUser } from "~/utils/auth.server";
import FormField from "~/components/form-field";

export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();
    const name = form.get('name');
    const description = form.get('description');

    if (typeof name !== 'string' || typeof description !== 'string') {
        return json({ error: `Invalid Form Data`, form: action }, { status: 400 })
    }

    const errors = {
        name: validateName(name),
        description: validateName(description),
    }

    if (Object.values(errors).some(Boolean)) {
        return json({ errors, fields: { name, description}, form: action }, { status: 400 })
    }

    return await registerCategory({ name, description});
}

export const loader: LoaderFunction = async ({ request }) => {
    // If there's already a user in the session, redirect to the home page
    let user = await getUser(request);
    // console.log(request)
    return null;
}

export default function CategoryCreate() {

    const actionData = useActionData<typeof action>();

    const [errors, setErrors] = useState(actionData?.errors || {});
    const [formError, setFormError] = useState(actionData?.error || '');

    const [formData, setFormData] = useState({
        name: actionData?.fields?.name || '',
        description: actionData?.fields?.description || ''
    });

    // Updates the form data when an input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData(form => ({ ...form, [field]: event.target.value }))
    }

    return (
        <div className="h-full justify-center items-center flex flex-col gap-y-4">
            <p className="text-2xl font-extrabold text-yellow-300 mb-6">Crear Categoría</p>
            <form method="post" className="rounded-2xl bg-gray-200 p-6 w-11/12 max-w-xl mb-12">
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{formError}</div>
                <FormField
                    htmlFor="name"
                    label="Nombre"
                    value={formData.name}
                    onChange={e => handleInputChange(e, 'name')}
                    error={errors?.name}
                />
                <FormField
                    htmlFor="description"
                    label="Descripción"
                    value={formData.description}
                    onChange={e => handleInputChange(e, 'description')}
                    error={errors?.description}
                />

                <div className="w-full text-center">
                    <input
                    type="submit"
                    className="rounded-xl mt-3 bg-yellow-300 px-6 cursor-pointer py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                    value="Registrar"
                    />
                </div>
            </form>
        </div>
    )
}