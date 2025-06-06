
import { useState } from "react";
import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { validateEmail, validatePassword, validateName, validateLastName, validateNumber } from "~/utils/validators";
import { getAllCategories, getCategory, registerCategory, updateCategory } from "~/utils/category.server";
import { getUser, getUserIdName } from "~/utils/auth.server";
import FormField from "~/components/form-field";
import { category } from "@prisma/client";
import { getModel, updateModel } from "~/utils/model.server";
import { getBrand, updateBrand } from "~/utils/brand.server";
import SelectField from "~/components/select-field";

type dataLoader = {
    brand: {
        id: number;
        categoryId: number; 
        name: string;
    },
    categories: category[]
}

export const action: ActionFunction = async ({request, params}) => {

    let idBrand: number = Number(params.idBrand);

    const form = await request.formData();
    const name = form.get('name');
    const categoryId = Number(form.get('categoryId'));

    if (typeof name !== 'string' || typeof categoryId !== 'number') {
        return json({ error: `Tipos de datos inválidos`, form: action }, { status: 400 })
    }

    const errors = {
        name: validateName(name),
        categoryId: validateNumber(categoryId),
    }

    if (Object.values(errors).some(Boolean)) {
        return json({ errors, fields: { name, categoryId }, form: action }, { status: 400 })
    }

    const brandUpdated =  await updateBrand({ idBrand, name, categoryId});

    if(!brandUpdated) {
        return json({ error: `La marca con ese nombre y categoría ya existe`, form: action }, { status: 400 })
    }

    return redirect('/marcas');
}

export const loader: LoaderFunction = async ({ request, params }) => {
    let user = await getUserIdName(request);
    if(!user) {
        return redirect('/login');
    }
    let idBrand: number = Number(params.idBrand);
       
    const brand = await getBrand(idBrand);
    const categories = await getAllCategories();
    return {brand, categories};
}

export default function BrandEdit() {

    const actionData = useActionData<typeof action>();

    const loader:dataLoader = useLoaderData();

    const navigation = useNavigate();

    const [errors, setErrors] = useState(actionData?.errors || {});
    const [formError, setFormError] = useState(actionData?.error || '');

    const [formData, setFormData] = useState({
        name: loader.brand.name || '',
        categoryId: loader.brand.categoryId || '',
    });

    // Updates the form data when an input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData(form => ({ ...form, [field]: event.target.value }))
    }

    return (
        <div className="h-full justify-center items-center flex flex-col gap-y-4">
            <p className="text-2xl font-extrabold text-yellow-300 mb-6">Editar Marca</p>
            <form method="post" className="rounded-2xl bg-gray-200 p-6 w-11/12 max-w-xl mb-12">
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{formError}</div>
                <FormField
                    htmlFor="name"
                    label="Nombre"
                    value={formData.name}
                    onChange={e => handleInputChange(e, 'name')}
                    error={errors?.name}
                />

                <SelectField
                    categories={loader.categories}
                    htmlFor='categoryId'
                    label="Categoría"
                    value={formData.categoryId}
                    optionDefault="Seleccionar Categoría"
                    onChange={e => handleInputChange(e, 'categoryId')}
                    error={errors?.categoryId}
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
                        onClick={() => navigation(`/marcas`)}
                    >Cancelar</button>
                </div>
            </form>
        </div>
    )
}