import { useNavigate } from "react-router-dom";
import styles from "../styles/bookCard.module.css";
import placeholder from "../assets/book-img.png";

export default function BookList({name, image, rating, description, bookId, query}) {
    const navigate = useNavigate();

    function handleViewBook() {
        const params = new URLSearchParams();

        if (bookId) params.set("id", bookId);
        if (query) params.set("q", query);

        navigate(`/aboutBook?${params.toString()}`);
    }

    return(
        <article className={styles.book_card}>
            <img
                className={styles.book_image}
                src={image || placeholder}
                alt={name}
                onError={(e) => {
                    e.currentTarget.onerror = null; // prevent loop
                    e.currentTarget.src = placeholder;
                }}
            />
            <h2 className={styles.book_name}>{name}</h2>
            <p className={styles.book_description}>{description}</p>
            <div className={styles.book_rating}>{rating}</div>
            <button className={styles.view_book} onClick={handleViewBook}>View Book</button>
        </article>
    )
}
