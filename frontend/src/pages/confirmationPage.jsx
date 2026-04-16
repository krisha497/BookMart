import { useLocation, useNavigate } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";
import styles from "../styles/confirmationPage.module.css";
import { useEffect, useState } from "react";

export default function ConfirmationPage() {
    
    const location = useLocation();
    const [ order, setOrder ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state?.order_id) {
            navigate('/');
            return null;
        }

        fetch('http://localhost/bookmart/backend/get_order.php', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: location.state.order_id }),
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            setOrder(data);
            setLoading(false);
        });

    }, []);

    if (loading || !order) return <p>Loading...</p>;

    return(
        <div className={styles.content}>
            <div className={styles.confirmation_header}>
                <FaRegCheckCircle className={styles.confirmation} />
                <h2>Order Placed Successfully!</h2>
                <p>Thank you, <span className={styles.username}>{order.username}</span>. Your books are on the way.</p>
            </div>
            <div className={styles.delivery_details}>
                <h3 className={styles.delivery_heading}>Delivery Details</h3>
                <p className={styles.detail}>Name:<span className={styles.delivery_detail}>{order.order_details.delivery_name}</span></p>
                <p className={styles.detail}>Address:<span className={styles.delivery_detail}>{order.order_details.delivery_address}</span></p>
                <p className={styles.detail}>City:<span className={styles.delivery_detail}>{order.order_details.delivery_city}</span></p>
                <p className={styles.detail}>Post Code:<span className={styles.delivery_detail}>{order.order_details.delivery_post_code}</span></p>
                <p className={`${styles.detail} ${styles.last}`}>Country:<span className={styles.delivery_detail}>{order.order_details.delivery_country}</span></p>
            </div>
            <div className={styles.order_summary}>
                <h3 className={styles.order_heading}>Items Ordered</h3>
                <div className={styles.order_items}>
                    {order.order_items.map((item) => (
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
                </div>
                <div className={styles.order_total}>
                    <span className={styles.total_label}>Total</span>
                    <span className={styles.total_price}>
                        ${order.order_items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </span>
                </div>
            </div>
            <div className={styles.btns}>
                <button className={styles.btn} onClick={()=>navigate('/')}>Continue Browsing</button>
                <button className={styles.btn} onClick={()=>navigate('/AIAssistant')}>Search for Recommendations</button>
                <button className={styles.btn} onClick={()=>navigate('/orderHistory')}>See Order History</button>
            </div>
        </div>
    )
}