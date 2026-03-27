import { useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import placeholder from "../assets/book-img.png";
import styles from "../styles/addReview.module.css";

export default function AddReview() {

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const q = searchParams.get("q");

    const [ rating, setRating ] = useState(0);
    const [ hovered, setHovered ] = useState(0);
    const [ title, setTitle ] = useState('');
    const [ body, setBody ] = useState('');
    const [ submitting, setSubmitting ] = useState(false);

    const navigate = useNavigate();

    const location = useLocation();
    const { bookName, bookImage, bookAuthor } = location.state || {};

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                rating,
                title,
                body,
                google_volume_id: id,
            };

            const response = await fetch('http://localhost/bookmart/backend/add_review.php', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.status === 'unauthorized') {
                navigate('/logIn');
            } else if (result.status === 'error') {
                alert("Something went wrong");
            } else {
                navigate(`/aboutBook?id=${id}&q=${q}`);
            }
        } catch (err) {
            alert('Something went wrong');
            console.log(err);
        }

        setSubmitting(false);
    }

    const starLabels = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

    return (
        <div className={styles.add_page}>

            {/* BANNER */}
            <div className={styles.banner}>
                <img
                    src={bookImage || placeholder}
                    alt={bookName}
                    className={styles.banner_cover}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = placeholder;
                    }}
                />
                <div className={styles.banner_info}>
                    <p className={styles.banner_title}>{bookName || "Unknown Title"}</p>
                    <p className={styles.banner_author}>{bookAuthor || "Unknown Author"}</p>
                </div>
                <span className={styles.banner_badge}>Reviewing</span>
            </div>

            {/* BODY */}
            <div className={styles.body}>

                {/* STAR RATING */}
                <div className={styles.star_rating}>
                    <p className={styles.question}>How would you rate your experience?</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHovered(star)}
                                onMouseLeave={() => setHovered(0)}
                                style={{
                                    fontSize: '40px',
                                    cursor: 'pointer',
                                    color: star <= (hovered || rating) ? '#f59e0b' : '#ddd',
                                    transition: 'color 0.1s, transform 0.1s',
                                    transform: star <= (hovered || rating) ? 'scale(1.15)' : 'scale(1)',
                                    display: 'inline-block',
                                    lineHeight: 1,
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <span className={styles.label}>
                        {starLabels[hovered || rating]}
                    </span>
                </div>

                <form className={styles.reviewForm} onSubmit={handleSubmit}>
                    <div>
                        <p className={styles.question}>Title of your review</p>
                        <input
                            required
                            maxLength={100}
                            className={styles.title_input}
                            value={title}
                            placeholder="Summarise your experience..."
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <p className={styles.question}>What do you want to say?</p>
                        <textarea
                            required
                            className={styles.text_input}
                            value={body}
                            placeholder="Tell others what you thought about this book..."
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                    <button className={styles.submit_btn} disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>

            </div>
        </div>
    );
}