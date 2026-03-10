import React, { useState, useEffect } from "react";
import styles from "../styles/viewCart.module.css";

import CartList from "../components/cart-list";
import NavBar from "../components/navigation-bar";
import SideBar from "../components/side-bar";

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

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return(
        <>
            <NavBar />
            <div className={styles.view_cart}>
                <SideBar />
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
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}