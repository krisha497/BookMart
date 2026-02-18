import { useNavigate } from "react-router-dom";
import styles from "../styles/bookCard.module.css";

export default function BookCard({ id, q, name, image, description }) {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/aboutBook?id=${id}&q=${q}`)
    }

    return (
        <div className={styles.card}>
            <h3 className={styles.card_name}>{name}</h3>
            <img src={image} className={styles.card_image} />
            <p className={styles.card_desc}>{description}</p>
            <button className={styles.view_button} onClick={handleClick}>View Book</button>
        </div>
    )
}
