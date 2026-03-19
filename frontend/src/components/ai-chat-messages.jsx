import { useRef, useEffect } from "react";
import styles from "../styles/AIPage.module.css";

function BookCards({ books }) {
    if (!books || !Array.isArray(books)) return null;
    return (
        <div className={styles.book_cards}>
            {books.map((book, i) => (
                <div key={i} className={styles.book_card}>
                    <p className={styles.book_title}>{book.title}</p>
                    <p className={styles.book_author}>{book.author}</p>
                    <p className={styles.book_desc}>{book.description}</p>
                    <p className={styles.book_reason}>{book.reason}</p>
                </div>
            ))}
        </div>
    )
}

function TypingIndicator() {
    return(
        <div className={`${styles.bubble_row} ${styles.bot}`}>
            <div className={`${styles.bubble} ${styles.bot}`}>
                <div className={styles.typing}>
                    <span /><span /><span />
                </div>
            </div>
        </div>
    )
}

export default function AIChatMessages({ messages, loading }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return(
        <div className={styles.messages}>
            {messages.map((msg, i) => (
                <div key={i} className={`${styles.bubble_row} ${styles[msg.role]}`}>
                    <div className={`${styles.bubble} ${styles[msg.role]} ${msg.errror ? styles.error : ""}`}>
                        <p>{msg.text}</p>
                        {msg.books && <BookCards books={msg.books} />}
                    </div>
                </div>
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
        </div>
    )
}