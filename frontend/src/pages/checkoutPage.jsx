import { useEffect, useState } from "react";
import styles from "../styles/checkout.module.css";
import { FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {

    const [ loading, setLoading ] = useState(true);
    const [ orderSummary, setOrderSummary ] = useState([]);
    const [ username, setUsername ] = useState("");

    const [ formData, setFormData ] = useState({
        delivery_name: "",
        delivery_address: "",
        delivery_city: "",
        delivery_post_code: "",
        delivery_country: "England"
    });

    useEffect(() => {
        async function getCartSummary() {
            try {
                const response = await fetch("http://localhost/bookmart/backend/get_cart.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });

                if (!response.ok) {
                    throw new Error("Failed to get Cart Summary.");
                }

                const result = await response.json();
                if (result.status === "error") {
                    alert("Something went wrong");
                    console.log(result.message);
                } else {
                    setOrderSummary(result.items);
                    setUsername(result.username);
                }
            } catch (err) {
                alert("An error occured");
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        getCartSummary();
    }, []);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost/bookmart/backend/checkout.php', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include"
            });
            const result = await response.json();

            if (result.status === "error") {
                alert("An unexpected error occured. Please try again.");
                console.log(result.message);
            } else {
                navigate('/confirmation', {
                    state: {
                        order_id: result.order_id
                    }
                });
            }
        } catch (err) {
            alert("An unexpected error occures. Please try again.");
            console.log(err);
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div className={styles.content}>
                <FaCartPlus className={styles.cart_icon} />
                <h2 className={styles.checkout_title}> Place Order</h2>
                <div className={styles.page_content}>
                    <div className={styles.user_details}>
                        <div className={styles.user_profile}>
                            <div className={styles.avatar}>{username ? username.slice(0, 2).toUpperCase() : "??"}</div>
                            <p className={styles.user}>You are ordering as <span>{username}</span>.</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label className={styles.name_label}>Full Name</label>
                            <input 
                                className={styles.name_input} 
                                type="text" 
                                placeholder="Name..." 
                                required
                                name="delivery_name"
                                onChange={handleChange} 
                            />
                            <label className={styles.address_label}>Street Address</label>
                            <input 
                                className={styles.address_input} 
                                type="text" 
                                placeholder="Address..." 
                                required
                                name="delivery_address"
                                onChange={handleChange} 
                            />
                            <label className={styles.city_label}>City</label>
                            <input 
                                className={styles.city_input} 
                                type="text" 
                                placeholder="City..." 
                                required
                                name="delivery_city"
                                onChange={handleChange} 
                            />
                            <label className={styles.post_code_label}>Post Code</label>
                            <input 
                                className={styles.post_code_input} 
                                type="text" 
                                placeholder="Post Code..." 
                                required
                                name="delivery_post_code"
                                onChange={handleChange} 
                            />
                            <label className={styles.country_label}>Country</label>
                            <select 
                                className={styles.country_input} 
                                required
                                name="delivery_country"
                                onChange={handleChange}
                            >
                                <option>England</option>
                                <option>Scotland</option>
                                <option>Nothern Ireland</option>
                                <option>Wales</option>
                            </select>
                            <button type="submit" className={styles.submit_btn}>Place Order</button>
                        </form>
                    </div>
                    <div className={styles.order_summary}>
                        <p>Order Summary:</p>
                        <div className={styles.order_items}>
                            {orderSummary.map((item) => (
                                <div key={item.google_volume_id} className={styles.order_item}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={styles.item_image}
                                    />
                                    <div className={styles.item_info}>
                                        <p className={styles.item_name}>{item.name}</p>
                                        <p className={styles.item_qty}>Qty: {item.quantity}</p>
                                    </div>
                                    <p className={styles.item_price}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}

                            <div className={styles.order_total}>
                                <span className={styles.total_label}>Total</span>
                                <span className={styles.total_price}>
                                    ${orderSummary.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}