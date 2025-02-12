import { useState, useEffect } from "react";

interface FormFieldProps {
    htmlFor: string
    label: string
    onChange?: (...args: any) => any
    error?: string
}
  
export default function FieldPassword({ htmlFor, label, onChange = () => {}, error = "" }: FormFieldProps) {

  const [errorText, setErrorText] = useState(error);

  const [iconState, setIconState] = useState(true);

  useEffect(() => {
      setErrorText(error)
  }, [error])

  return (
    <>
        <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
        {label}
        </label>
        <div className="relative">
            <input onChange={e => {
                onChange(e)
                setErrorText('')
            }} type={ iconState ? 'password' : 'text'} id={htmlFor} name={htmlFor} className="w-full p-2 rounded-xl my-2" />
            <button type="button" onClick={() => setIconState(!iconState)} className="absolute w-5 top-2/4 -translate-y-1/2 right-3">
                <img src={ iconState ? 'icons/eye.svg': 'icons/eye-slash.svg'} alt="eye icon" />
            </button>
        </div>
        <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
            {errorText || ''}
        </div>
    </>
  )
}