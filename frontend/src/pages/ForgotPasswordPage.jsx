import React from "react";
import { CiMail } from 'react-icons/ci';
import { useNavigate } from "react-router-dom";

import styles from "../styles/ForgotPasswordPage.module.css"

export default function ForgotPassword() {
    return(
        <div className={styles.container}>
            <h2>Forgot Password</h2>
            <form>
                <div className={styles.input_wrapper}>
                    <CiMail className={styles.icons} />
                    <input type="email" name="email" required placeholder="Email..." />
                </div>
                <button type="submit">Reset Password</button>
                <p className={styles.to_login}>Go back to <a href='/LogIn'>Log In Page</a></p>
            </form>
        </div>
    )
}