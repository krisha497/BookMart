import React, { useState, useEffect } from "react";
import styles from "../styles/viewCart.module.css";

import CartList from "../components/cart-list";
import { FaCartPlus } from "react-icons/fa";

export default function viewCart() {

    const [ cartItems, setCartItems ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        async function getCart() {
            try {
                const response = await fetch("http://localhost/bookmart/backend/get_cart.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch cart.");
                }

                const result = await response.json();

                if (result.status === "error") {
                    alert("An error occured.");
                    console.log(result.message);
                } else {
                    setCartItems(result);
                }
            } catch (err) {
                alert("An error occured");
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        getCart();
    }, []);

    const handleQuantityChange = async (google_volume_id, new_quantity) => {
        if (new_quantity < 1) return;

        try {
            const response = await fetch("http://localhost/bookmart/backend/update_quantity.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ google_volume_id: google_volume_id, quantity: new_quantity})
            });
            const result = await response.json();
            if (result.status === "success") {
                setCartItems(prev => prev.map(item =>
                    item.google_volume_id === google_volume_id
                        ? { ...item, quantity: new_quantity }
                        : item
                ));
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleRemove = async(google_volume_id) => {
        try {
            const response = await fetch("http://localhost/bookmart/backend/remove_from_cart.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ google_volume_id })
            });

            const result = await response.json();
            if (result.status === "success") {
                setCartItems(prev => prev.filter(item => item.google_volume_id !== google_volume_id));
            }
        } catch (err) {
            console.log(err);
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return(
        <>
            <div className={styles.content}>
                <FaCartPlus className={styles.cart_icon} />
                <h2 className={styles.view_cart_title}> My Cart</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Remove</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cartItems.map((r,i) => (
                            <CartList 
                            key = {i}
                            image={r.image}
                            name = {r.name}
                            quantity = {r.quantity}
                            price = {r.price}
                            google_volume_id={r.google_volume_id}
                            onQuantityChange={handleQuantityChange}
                            onRemove={handleRemove}
                            />
                        ))}
                    </tbody>
                </table>
                <div className={styles.total}>
                    <h3 className={styles.total_heading}>Total: ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</h3>
                    <button className={styles.checkout_btn}>Proceed to Checkout</button>
                </div>
            </div>
        </>
    )
}