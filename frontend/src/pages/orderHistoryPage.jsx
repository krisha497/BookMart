import { useEffect, useState } from "react";
import { fetchBookById } from "../services/googleBooksApi";
import styles from "../styles/orderHistory.module.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderHistory() {

    const [orders, setOrders] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function getOrders() {
            try {
                const response = await fetch("http://localhost/bookmart/backend/get_order_history.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });

                if (!response.ok) {
                    alert("An error occured. Please try again");
                    return;
                }

                const result = await response.json();

                if (result.status === "error") {
                    alert("An error occured. Please try again.");
                    console.log(result.message);
                    return;
                } else {
                    const enrichedOrders = await Promise.all(
                        result.orders.map(async (order) => ({
                            ...order,
                            order_items: await Promise.all(
                                order.order_items.map(async (item) => ({
                                    ...item,
                                    bookDetails: await fetchBookById(item.google_volume_id)
                                }))
                            )
                        }))
                    );
                    setOrders(enrichedOrders);
                }
            } catch (err) {
                alert("Something went wrong");
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        getOrders();
    }, []);

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <h1>Order History</h1>
            {orders.map((order) => (
                <div key={order.order_id} className={styles.order}>
                    <h2 className={styles.order_heading}>Order #{order.order_id}</h2>
                    {order.order_items.map((item, i) => (
                        <div key={i} className={styles.order_history}>
                            {item.bookDetails.image && (
                                <img src={item.bookDetails.image} className={styles.book_img} alt={item.bookDetails.name} />
                            )}
                            <div>
                                <p className={styles.book_name}>{item.bookDetails.name}</p>
                                <p className={styles.book_authors}>{item.bookDetails.authors[0]}</p>
                                <p className={styles.quantity}>Quantity: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                    <button className={styles.btn} onClick={()=>navigate(`/confirmation`, { state: { order_id: order.order_id } })}>View Order Details</button>
                </div>
            ))}
        </div>
    )
}