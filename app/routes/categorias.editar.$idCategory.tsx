
import { useState } from "react";
import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { validateEmail, validatePassword, validateName, validateLastName } from "~/utils/validators";
import { getCategory, registerCategory, updateCategory } from "~/utils/category.server";
import { getUser } from "~/utils/auth.server";
import FormField from "~/components/form-field";
import { Category } from "@prisma/client";

export const action: ActionFunction = async ({request, params}) => {

    let idCategory: number = Number(params.idCategory);

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

    const categoryUpdated =  await updateCategory({ idCategory, name, description});

    if(!categoryUpdated) {
        return json({ error: `No se pudo completar el cambio de cliente`, form: action }, { status: 400 })
    }

    return redirect('/categorias');
}

export const loader: LoaderFunction = async ({ params }) => {
    let idCategory: number = Number(params.idCategory);
       
    const category = await getCategory(idCategory);
    return category;
}

export default function CategoryCreate() {

    const actionData = useActionData<typeof action>();

    const loader = useLoaderData<Category>();

    const navigation = useNavigate();

    const [errors, setErrors] = useState(actionData?.errors || {});
    const [formError, setFormError] = useState(actionData?.error || '');

    const [formData, setFormData] = useState({
        name: loader.name || '',
        description: loader.description || ''
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

                <div className="w-full flex justify-center gap-5">
                    <input
                    type="submit"
                    className="rounded-xl mt-3 bg-yellow-300 px-6 cursor-pointer py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                    value="Actualizar"
                    />
                    <button
                        type="button" 
                        className="rounded-xl mt-3 bg-yellow-300 px-6 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                        onClick={() => navigation(`/categorias`)}
                    >Cancelar</button>
                </div>
            </form>
        </div>
    )
}