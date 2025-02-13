
import { useState } from "react";
import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { validateEmail, validatePassword, validateName, validateLastName, validateNumber } from "~/utils/validators";
import { getAllCategories, getCategory, registerCategory, updateCategory } from "~/utils/category.server";
import { getUser } from "~/utils/auth.server";
import FormField from "~/components/form-field";
import { category } from "@prisma/client";
import { getModel, updateModel } from "~/utils/model.server";
import { getVariant, updateVariant } from "~/utils/variant.server";
import SelectField from "~/components/select-field";

type dataLoader = {
    variant: {
        id: number;
        categoryId: number; 
        medida: string; 
        unit: number; 
        category: category;
    },
    categories: category[]
}

export const action: ActionFunction = async ({request, params}) => {

    let idVariant: number = Number(params.idVariant);

    const form = await request.formData();
    const medida = form.get('medida');
    const unit = Number(form.get('unit'));
    const categoryId = Number(form.get('categoryId'));

    if (typeof medida !== 'string' || typeof unit !== 'number' || typeof categoryId !== 'number') {
        return json({ error: `Invalid Form Data`, form: action }, { status: 400 })
    }

    const errors = {
        medida: validateName(medida),
        unit: validateNumber(unit),
        categoryId: validateNumber(categoryId),
    }

    if (Object.values(errors).some(Boolean)) {
        return json({ errors, fields: { medida, unit, categoryId}, form: action }, { status: 400 })
    }

    const variantUpdated =  await updateVariant({ idVariant, medida, unit, categoryId});

    if(!variantUpdated) {
        return json({ error: `No se pudo completar el cambio de cliente`, form: action }, { status: 400 })
    }

    return redirect('/variantes');
}

export const loader: LoaderFunction = async ({ params }) => {
    let idVariant: number = Number(params.idVariant);
       
    const variant = await getVariant(idVariant);
    const categories = await getAllCategories();

    return {variant, categories};
}

export default function ModelEdit() {

    const actionData = useActionData<typeof action>();

    const loader:dataLoader = useLoaderData();

    const navigation = useNavigate();

    const [errors, setErrors] = useState(actionData?.errors || {});
    const [formError, setFormError] = useState(actionData?.error || '');

    const [formData, setFormData] = useState({
        medida: loader.variant.medida || '',
        unit: loader.variant.unit || '',
        categoryId: loader.variant.categoryId || '',
    });

    // Updates the form data when an input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData(form => ({ ...form, [field]: event.target.value }))
    }

    return (
        <div className="h-full justify-center items-center flex flex-col gap-y-4">
            <p className="text-2xl font-extrabold text-yellow-300 mb-6">Editar Variante</p>
            <form method="post" className="rounded-2xl bg-gray-200 p-6 w-11/12 max-w-xl mb-12">
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{formError}</div>

                <FormField
                    htmlFor="medida"
                    label="Medida"
                    value={formData.medida}
                    onChange={e => handleInputChange(e, 'medida')}
                    error={errors?.medida}
                />

                <FormField
                    htmlFor="unit"
                    label="Unidad"
                    value={formData.unit}
                    onChange={e => handleInputChange(e, 'unit')}
                    error={errors?.unit}
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
                        onClick={() => navigation(`/variantes`)}
                    >Cancelar</button>
                </div>
            </form>
        </div>
    )
}