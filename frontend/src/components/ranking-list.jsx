import styles from "../styles/rankingsPage.module.css";

export default function RankingList({image, name, popularity, description}) {
    return (
        <div className={styles.card}>
            <h3 className={styles.card_name}>{name}</h3>
            <img src={image} className={styles.card_image} />
            <p>Popularity: {popularity}%</p>
            <p>{description}</p>
            <button className={styles.view_button}>View Book</button>
        </div>
    )
}