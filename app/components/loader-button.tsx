import styles from '../styles.module.css';

export default function Spinner() {
    return (
        <>
            <div className={`absolute w-full h-full top-0 left-0 flex justify-center items-center` } >
                <img className="w-11" src="/icons/spinner.svg" alt="" />
            </div>
        </>
    )
}