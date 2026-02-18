import styles from '../styles/nav-bar.module.css';

import {Link} from 'react-router-dom';
import logo from "../assets/logo.png";
import {CgProfile} from "react-icons/cg";

function NavBar() {
    return (
        <nav className={styles.NavBar}>
            <div className={styles.left_section}>
                <img src={logo} alt="Website Logo" className={styles.website_logo} />
                <h1 className={styles.heading}>BookMart</h1>
            </div>
            <div className={styles.right_section}>
                <ul className={styles.menu}>
                    <li>Recommended Books</li>
                    <li>Categories</li>
                    <li>Trending</li>
                </ul>
            </div>
            <div className={styles.profile}>
                <div className={styles.icon}><CgProfile /></div>
                <p>User123</p>
            </div>
        </nav>
    )
}

export default NavBar;