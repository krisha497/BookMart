import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import NavBar from "../components/navigation-bar";
import placeholder from "../assets/book-img.png";

import styles from "../styles/aboutBook.module.css";
import { fetchAboutBookData } from "../services/pageBookData";

export default function AboutBook() {
    const [searchParams] = useSearchParams();
    const [book, setBook] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadBook() {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchAboutBookData({
                    bookId: searchParams.get("id"),
                    query: searchParams.get("q") || "bestseller",
                });

                if (!isMounted) return;
                setBook(data);
            } catch (err) {
                if (!isMounted) return;
                setError(err.message || "Failed to load book");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadBook();

        return () => {
            isMounted = false;
        };
    }, [searchParams]);

    const bookPrice = Number(((book?.rating ?? 3.9) * 5.5 + 8).toFixed(2));
    const originalPrice = Number((bookPrice + 6).toFixed(2));

    function decreaseQty() {
        setQuantity((prev) => Math.max(1, prev - 1));
    }

    function increaseQty() {
        setQuantity((prev) => Math.min(10, prev + 1));
    }

    return (
        <>
            <NavBar />
            <div className={styles.about_book}>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}

                {!loading && !error && !book && <p>No book found.</p>}

                {!loading && !error && book && (
                    <article className={styles.about}>
                        <section className={styles.cover_panel}>
                            <img
                                src={book.image || placeholder}
                                alt={book.name}
                                className={styles.book_image}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = placeholder;
                                }}
                            />
                        </section>

                        <section className={styles.details_panel}>
                            <p className={styles.breadcrumb}>Books / Product Details</p>
                            <h1 className={styles.title}>{book.name}</h1>
                            <p className={styles.author}>
                                By{" "}
                                {book.authors?.length
                                    ? book.authors.join(", ")
                                    : "Unknown Author"}
                            </p>

                            <div className={styles.rating_row}>
                                <span className={styles.rating_badge}>
                                    {book.rating ?? "N/A"} star
                                </span>
                                <span className={styles.rating_text}>Reader Rating</span>
                            </div>

                            <div className={styles.price_row}>
                                <span className={styles.sale_price}>${bookPrice}</span>
                                <span className={styles.original_price}>${originalPrice}</span>
                                <span className={styles.discount_tag}>Save 20%</span>
                            </div>

                            <p className={styles.meta}>
                                Published: {book.publishedDate || "N/A"}
                            </p>

                            <div className={styles.purchase_row}>
                                <div className={styles.quantity_box}>
                                    <button type="button" onClick={decreaseQty}>
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button type="button" onClick={increaseQty}>
                                        +
                                    </button>
                                </div>

                                <button type="button" className={styles.cart_btn}>
                                    Add to Cart
                                </button>
                                <button type="button" className={styles.buy_btn}>
                                    Buy Now
                                </button>
                            </div>

                            <button type="button" className={styles.wishlist_btn}>
                                Add to Wishlist
                            </button>

                            <div className={styles.description}>
                                <h2>About this book</h2>
                                <p>
                                    {book.description || "No description available."}
                                </p>
                            </div>
                        </section>
                    </article>
                )}
            </div>
        </>
    );
}
