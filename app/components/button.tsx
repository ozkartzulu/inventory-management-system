
interface FormFieldProps {
    label: string
    href: string
}

export default function Button({ label, href }: FormFieldProps) {

    return (
        <>
            <a 
                href={href} 
                className="bg-indigo-800 text-white text-center flex justify-center items-center rounded px-2 py-1 min-w-24 md:min-w-28 font-semibold"
            >{label}</a>
        </>
    )
}