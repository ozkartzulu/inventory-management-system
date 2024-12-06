
import { useEffect, useState } from "react";
import { ActionFunction, LoaderFunction, json, redirect, 
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
    unstable_createFileUploadHandler,
    unstable_composeUploadHandlers, } from "@remix-run/node";
import { useActionData, useLoaderData, useFetcher, FormEncType, Form, useSubmit } from "@remix-run/react";
import { validateFile, validatePassword, validateName, validateLastName, validateNumber } from "~/utils/validators";
import type { ActionFunctionArgs } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";
import FormField from "~/components/form-field";
import SelectField from '~/components/select-field';
import { getAllCategories } from "~/utils/category.server";
import { Category } from "@prisma/client";
import { getPathRelative, registerProduct } from "~/utils/product.server";
import { getModelsByIdCategory } from "~/utils/model.server";
import { getVariantsByIdCategory } from "~/utils/variant.server";
import { getBrandsByIdCategory } from "~/utils/brand.server";
import { getAllMadeins } from "~/utils/madein.server";


export async function action({ request}: ActionFunctionArgs) {

    let formData = await unstable_parseMultipartFormData(
        request,
        unstable_composeUploadHandlers(
            unstable_createFileUploadHandler({
            filter({ contentType }) {
                return contentType.includes("image");
            },
            directory: "./public/imgs",
            avoidFileConflicts: false,
            file({ filename }) {
                return normalizeImageUrl(filename);
            },
            maxPartSize: 10 * 1024 * 1024,
            }),
            unstable_createMemoryUploadHandler(),
        ),
    );

    if(formData.get('formCategory') == 'true' && formData.get('categoryId') ) {
        const idCategory = Number(formData.get('categoryId'));
        const variants = await getVariantsByIdCategory(idCategory);
        const models = await getModelsByIdCategory(idCategory);
        const brands = await getBrandsByIdCategory(idCategory);
        return json({ variants, models, brands });
    }


    // console.log(Object.fromEntries(formData.entries()))
    // console.log(formData)
    const name = formData.get('name');
    const description = String(formData.get('description'));
    const number = Number(formData.get('number'));
    const categoryId = Number(formData.get('categoryId'));
    const madeinId = Number(formData.get('madeinId'));
    const modelId = Number(formData.get('modelId'));
    const brandId = Number(formData.get('brandId'));
    const variantId = Number(formData.get('variantId'));
    let file = formData.get('file')?.filepath ?? '';
    file = getPathRelative(file);
    console.log(file)
    // console.log(description)
    // console.log(number)
    // console.log(categoryId)
    // console.log(madeinId)
    // console.log(file)

    if (typeof name !== 'string' || typeof description !== 'string' || typeof number !== 'number' || typeof categoryId !== 'number' || typeof madeinId !== 'number' || typeof file !== 'string') {
        return json({ error: `Tipos de datos en los campos invalidos.`, form: action }, { status: 400 })
    }

    const errors = {
        name: validateName(name),
        description: validateName(description),
        number: validateNumber(number),
        file: validateFile(file),
        categoryId: validateNumber(categoryId),
        madeinId: validateNumber(madeinId),
        modelId: validateNumber(modelId),
        brandId: validateNumber(brandId),
        variantId: validateNumber(variantId),
    }

    if (Object.values(errors).some(Boolean)) {
        return json({ errors, fields: { name, description, number, file, madeinId, categoryId, modelId, brandId, variantId}, form: action }, { status: 400 })
    }

    return await registerProduct({ name, description, number, madeinId, categoryId, file});
    
}

/*
export const action: ActionFunction = async ({request}) => {

    let formData = await unstable_parseMultipartFormData(
        request,
        unstable_composeUploadHandlers(
            unstable_createFileUploadHandler({
            filter({ contentType }) {
                return contentType.includes("image");
            },
            directory: "./public/imgs",
            avoidFileConflicts: false,
            file({ filename }) {
                return normalizeImageUrl(filename);
            },
            maxPartSize: 10 * 1024 * 1024,
            }),
            unstable_createMemoryUploadHandler(),
        ),
    );

    const name = formData.get('name');
    const description = formData.get('description');
    const number = Number(formData.get('number'));
    const categoryId = Number(formData.get('categoryId'));
    let file = formData.get('file')?.filepath ?? '';

    if (typeof name !== 'string' || typeof description !== 'string' || typeof number !== 'number' || typeof categoryId !== 'number' || typeof file !== 'string') {
        return json({ error: `Tipos de datos en los campos invalidos.`, form: action }, { status: 400 })
    }

    const errors = {
        name: validateName(name),
        description: validateName(description),
        number: validateNumber(number),
        file: validateFile(file),
        categoryId: validateNumber(categoryId),
    }
    if (Object.values(errors).some(Boolean)) {
        return json({ errors, fields: { name, description, number, file, categoryId}, form: action }, { status: 400 })
    }

    return await registerProduct({ name, description, number, categoryId, file});
}
*/

function normalizeImageUrl(url: string) {
    return url
        .toLowerCase()
        .replace(/\s+/g, '-')
}

export const loader: LoaderFunction = async ({ request }) => {
    const categories = await getAllCategories();
    const madeins = await getAllMadeins();
    return {categories, madeins};
}

export default function ProductCreate() {

    const submit = useSubmit();

    const actionData = useActionData<typeof action>();
    // console.log(actionData)

    const loaders = useLoaderData();

    const [errors, setErrors] = useState(actionData?.errors || {});
    const [formError, setFormError] = useState(actionData?.error || '');
    const [showVariants, setShowVariants] = useState(false);
    const [showModels, setShowModels] = useState(false);
    const [showBrands, setShowBrands] = useState(false);

    const [formData, setFormData] = useState({
        name: actionData?.fields?.name || '',
        description: actionData?.fields?.description || '',
        number: actionData?.fields?.number || '',
        file: actionData?.fields?.file || '',
        madeinId: actionData?.fields?.madeinId || '',
        categoryId: actionData?.fields?.categoryId || '',
        modelId: actionData?.fields?.modelId || '',
        brandId: actionData?.fields?.brandId || '',
        variantId: actionData?.fields?.variantId || '',
    });

    useEffect( () => {
        if(actionData?.variants) {
            setShowVariants(true);
        }
        if(actionData?.models) {
            setShowModels(true);
        }
        if(actionData?.brands) {
            setShowBrands(true);
        }
    }, [actionData])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData(form => ({ ...form, [field]: event.target.value }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData(form => ({ ...form, [field]: e.target.value }))
        let form: any = e.currentTarget.form;
        let formData = new FormData(form);
        formData.append("formCategory", 'true');
        submit(formData, { method: "post", encType: "multipart/form-data"});
    }

    return (
        <div className="h-full justify-center items-center flex flex-col gap-y-4">
            <p className="text-2xl font-extrabold text-yellow-300 mb-6">Registrar Producto</p>
            
            <form method="post" encType="multipart/form-data"  className="rounded-2xl bg-gray-200 p-6 w-11/12 max-w-xl mb-12" >
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{formError}</div>
                <FormField
                    htmlFor="name"
                    label="Nombre"
                    value={formData?.name}
                    onChange={e => handleInputChange(e, 'name')}
                    error={errors?.name}
                />
                <FormField
                    htmlFor="description"
                    label="Descripción"
                    value={formData?.description}
                    onChange={e => handleInputChange(e, 'description')}
                    error={errors?.description}
                />
                <FormField
                    htmlFor="number"
                    label="Número"
                    value={formData?.number}
                    onChange={e => handleInputChange(e, 'number')}
                    error={errors?.number}
                />
                <FormField
                    htmlFor="file"
                    label="Cargar Imagen"
                    accept=".jpg, .jpeg, .png"
                    type="file"
                    value={formData?.file}
                    onChange={e => handleInputChange(e, 'file')}
                    error={errors?.file}
                />
                <SelectField
                    categories={loaders?.madeins}
                    htmlFor='madeinId'
                    label="Fabricado en"
                    value={formData?.madeinId}
                    optionDefault="Seleccionar Fabricado en"
                    typeSelect="madein"
                    onChange={e => handleInputChange(e, 'madeinId')}
                    // onChange={e => submit(e.target.value)}
                    // onChange={e => handleChange(e)}
                    error={errors?.madeinId}
                />
                <SelectField
                    categories={loaders?.categories}
                    htmlFor='categoryId'
                    label="Categoría"
                    // value={formData.categoryId}
                    optionDefault="Seleccionar Categoría"
                    typeSelect="category"
                    // onChange={e => handleInputChange(e, 'categoryId')}
                    // onChange={e => submit(e.target.value)}
                    onChange={e => handleChange(e, 'categoryId')}
                    error={errors?.categoryId}
                />
                {showModels && (
                    <SelectField
                        categories={actionData?.models}
                        htmlFor='modelId'
                        label="Modelos"
                        value={formData?.modelId}
                        optionDefault="Seleccionar Modelo"
                        typeSelect="models"
                        onChange={e => handleInputChange(e, 'modelId')}
                        // onChange={e => submit(e.target.value)}
                        // onChange={e => handleChange(e)}
                        // error={errors?.categoryId}
                    />
                )}
                {showBrands && (
                    <SelectField
                        categories={actionData?.brands}
                        htmlFor='brandId'
                        label="Marcas"
                        value={formData?.brandId}
                        optionDefault="Seleccionar Marca"
                        typeSelect="brand"
                        onChange={e => handleInputChange(e, 'brandId')}
                        // onChange={e => submit(e.target.value)}
                        // onChange={e => handleChange(e)}
                        // error={errors?.categoryId}
                    />
                )}
                {showVariants && (
                    <SelectField
                        categories={actionData?.variants}
                        htmlFor='variantId'
                        label="Variantes"
                        value={formData?.variantId}
                        optionDefault="Seleccionar Variante"
                        typeSelect="variants"
                        onChange={e => handleInputChange(e, 'variantId')}
                        // onChange={e => submit(e.target.value)}
                        // onChange={e => handleChange(e)}
                        // error={errors?.categoryId}
                    />
                )}
                <div className="w-full text-center">
                    <input
                    type="submit"
                    className="rounded-xl mt-3 bg-yellow-300 px-6 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1 cursor-pointer"
                    value="Registrar"
                    />
                </div>
            </form>
            
        </div>
    )
}
