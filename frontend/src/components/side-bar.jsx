import React from "react"
import { Link } from "react-router-dom";
import styles from "../styles/side-bar.module.css"

function SideBar() {
    return(
        <div className={styles.SideBar}>
            <h2>Menu</h2>
            <ul className={styles.sidebar_menu}>
                <li><Link className={styles.links} to='/'>Dashboard</Link></li>
                <li><Link className={styles.links} to='/ViewCart'>View Cart</Link></li>
                <li><Link className={styles.links} to='/'>My Reviews</Link></li>
                <li><Link className={styles.links} to='/Rankings'>Global Rankings</Link></li>
                <li><Link className={styles.links} to='/AIAssistant'>AI Assistant</Link></li>
            </ul>
        </div>
    )
}

export default SideBar;