import styles from "../styles/AIPage.module.css";

export default function AIGeneratedList({image, name, description}) {
    return (
        <div className={styles.card}>
            <h3 className={styles.card_name}>{name}</h3>
            <img src={image} className={styles.card_image} />
            <p>{description}</p>
            <button className={styles.view_button}>View Book</button>
        </div>
    )
}