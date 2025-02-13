import { category, madein, model } from "@prisma/client";
import { useState, useEffect } from "react";

interface FormFieldProps {
  categories: category[] | madein[] | model[] | null | undefined
  htmlFor: string
  label: string
  value?: any
  optionDefault: string
  onChange?: (...args: any) => any
  error?: string
}
  
export default function SelectField({ categories, htmlFor, label, value = "", optionDefault, onChange = () => {}, error = "" }: FormFieldProps) {

  const [errorText, setErrorText] = useState(error);

  useEffect(() => {
      setErrorText(error)
  }, [error])

  return (
    <>
      <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
        {label}
      </label>
      <select onChange={e => {
          onChange(e);
          setErrorText('');
        }} id={htmlFor} name={htmlFor} value={value} className="w-full p-2 rounded-xl my-2" >
        <option defaultValue={'true'} hidden>{optionDefault}</option>
        {categories?.map( (category, index) => (
            <option value={category.id} key={category.id}>{ category.name }</option>
          ) )}
      </select>
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
          {errorText || ''}
      </div>
    </>
  )
}