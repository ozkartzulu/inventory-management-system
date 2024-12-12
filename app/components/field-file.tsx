import { useState, useEffect, useRef } from "react";

interface FormFieldProps {
    label: string
    accept?: string
    value: any
    error?: string
}

export default function FormField({ label, accept, value, error = "" }: FormFieldProps) {

    const [errorText, setErrorText] = useState(error);

    useEffect(() => {
        setErrorText(error)
    }, [error])

    const [previewImage, setPreviewImage] = useState(value); // URL de la imagen actual
    const fileInputRef = useRef<HTMLInputElement>(null); // Referencia al input de archivo

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Simula un clic en el input file
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string); // Muestra una vista previa de la nueva imagen
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <>
            <label htmlFor='url' className="text-blue-600 font-semibold">
                {label}
            </label>
            <input ref={fileInputRef} onChange={handleFileChange} type="file" name='url' id="url" accept={accept} className="w-full p-2 rounded-xl my-2 hidden" />
            {value ? (
                <>
                    <img src={previewImage} className="w-14 h-14 object-cover cursor-pointer rounded mt-3" onClick={handleImageClick} />
                    <span className="text-gray-500 text-sm">(Click en la imagen para poder cambiar de imagen)</span>
                    <input type="hidden" name="productUrl" value={value} />
                </>
                ) : ''
            }
            <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
                {errorText || ''}
            </div>
        </>
    )
}