import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import NavBar from "../components/navigation-bar";
import placeholder from "../assets/book-img.png";

import styles from "../styles/aboutBook.module.css";
import { fetchAboutBookData } from "../services/pageBookData";
import SideBar from "../components/side-bar";

export default function AboutBook() {
    const [searchParams] = useSearchParams();
    const [book, setBook] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSubmit = async(e) => {
        e.preventDefault();

        const payload = {
            google_volume_id: book?.id || "",
            quantity,
        };

        if(!payload.google_volume_id) {
            alert("Book ID not found.");
            return;
        }

        try {
            const response = await fetch('http://localhost/bookmart/backend/add_to_cart.php', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            const result = await response.json();
            if (result.status === "success") {
                alert("Book Successfully Added to Cart.");
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert("An error occured. Please try again.");
            console.log(error);
        }
    }

    useEffect(() => {
        async function loadBook() {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchAboutBookData({
                    bookId: searchParams.get("id"),
                    query: searchParams.get("q") || "bestseller",
                });
                setBook(data);
            } catch (err) {
                setError(err.message || "Failed to load book");
            } finally {
                setLoading(false);
            }
        }
        loadBook();
    }, [searchParams]);

    const rating = book?.rating ?? 3.9;
    const bookPrice = rating * 5.5 + 8;
    
    function decreaseQty() {
        setQuantity((prev) => Math.max(1, prev - 1));
    }

    function increaseQty() {
        setQuantity((prev) => Math.min(10, prev + 1));
    }

    return (
        <>
            <NavBar />
            <div className={styles.about_page}>
                <SideBar />
                <div className={styles.content}>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}

                    {!loading && !error && !book && <p>No book found.</p>}

                    {!loading && !error && book && (
                        <form className={styles.about} onSubmit={handleSubmit}>
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

                                    <button type="submit" className={styles.cart_btn}>
                                        Add to Cart
                                    </button>
                                </div>

                                <div className={styles.description}>
                                    <h2>About this book</h2>
                                    <p>
                                        {book.description || "No description available."}
                                    </p>
                                </div>
                            </section>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
