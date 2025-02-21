import styles from '../styles.module.css';

export default function Spinner() {
    return (
        <>
            <div className={`${styles.spiner}` } >
                <img className="w-20" src="/icons/spinner.svg" alt="" />
            </div>
        </>
    )
}