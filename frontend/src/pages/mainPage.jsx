import React, { useEffect, useState } from "react";
import styles from "../styles/mainPage.module.css";
import "../components/navigation-bar";

import BookCard from "../components/book-card";
import NavBar from "../components/navigation-bar";
import SideBar from "../components/side-bar";
import SearchBook from "../components/search-book";
import { fetchMainPageBooks, MAIN_PAGE_CATEGORIES } from "../services/pageBookData";

export default function MainPage() {
    const [booksByCategory, setBooksByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({});

    useEffect(() => {
        let isMounted = true;

        async function loadBooks() {
            setLoading(true);
            const { booksByCategory: books, errorsByCategory } = await fetchMainPageBooks({
                maxResults: 12,
            });

            if (!isMounted) return;

            setBooksByCategory(books);
            setError(errorsByCategory);
            setLoading(false);
        }

        loadBooks();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <NavBar />
            <div className={styles.main_page}>
                <SideBar />
                <div className={styles.content}>
                    <SearchBook />
                    
                    <h2>Trending Books</h2>

                    {MAIN_PAGE_CATEGORIES.map((cat) => (
                        <section key={cat.key}>
                            <h2>{cat.title}</h2>

                            {loading && <p>Loading...</p>}
                            {error[cat.key] && <p>Error: {error[cat.key]}</p>}

                            {!loading && !error[cat.key] && (
                                <section className={styles.book_list}>
                                    {(booksByCategory[cat.key] ?? []).map((book) => (
                                        <BookCard
                                            id={book.id}
                                            key={book.id}
                                            name={book.name}
                                            image={book.image}
                                            rating={book.rating}
                                            description={book.description}
                                            bookId={book.id}
                                            query={cat.query}
                                        />
                                    ))}
                                </section>
                            )}
                        </section>
                    ))}
                </div>
            </div>
        </>
    );
}
