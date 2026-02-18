import React from "react"
import styles from "../styles/side-bar.module.css"

function SideBar() {
    return(
        <div className={styles.SideBar}>
            <h2>Menu</h2>
            <ul className={styles.sidebar_menu}>
                <li><a className={styles.links} href='/'>Dashboard</a></li>
                <li><a className={styles.links} href='/viewCart'>View Cart</a></li>
                <li><a className={styles.links} href='/'>My Reviews</a></li>
                <li><a className={styles.links} href='/Rankings'>Global Rankings</a></li>
                <li><a className={styles.links} href='/AIAssistant'>AI Assistant</a></li>
            </ul>
        </div>
    )
}

export default SideBar;