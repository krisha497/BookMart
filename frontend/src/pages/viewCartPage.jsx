import React from "react";
import styles from "../styles/viewCart.module.css";

import CartList from "../components/cart-list";
import NavBar from "../components/navigation-bar";
import SideBar from "../components/side-bar";

import { FaCartPlus } from "react-icons/fa";

const cart_items = [
    { id: 1, name: "Book 1", image: "https://placehold.co/300x300", rating: "★ ★ ★ ★ ☆", price: 10, quantity: 1 },
    { id: 2, name: "Book 2", image: "https://placehold.co/300x300", rating: "★ ★ ★ ★ ★", price: 12, quantity: 2 },
    { id: 3, name: "Book 3", image: "https://placehold.co/300x300", rating: "★ ★ ★ ★ ☆", price: 8, quantity: 3 },
    { id: 4, name: "Book 4", image: "https://placehold.co/300x300", rating: "★ ★ ☆ ☆ ☆", price: 20, quantity: 4 },
    { id: 5, name: "Book 5", image: "https://placehold.co/300x300", rating: "★ ★ ★ ★ ★", price: 50, quantity: 5 },
    { id: 6, name: "Book 6", image: "https://placehold.co/300x300", rating: "★ ★ ★ ☆ ☆", price: 30, quantity: 6 },
    { id: 7, name: "Book 7", image: "https://placehold.co/300x300", rating: "★ ★ ★ ★ ★", price: 5, quantity: 7 }
]

export default function ViewCart() {
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
                            {cart_items.map((r,i) => (
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