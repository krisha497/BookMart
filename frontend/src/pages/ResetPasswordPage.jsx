import React from "react";
import { CiLock } from 'react-icons/ci';

import styles from "../styles/ResetPasswordPage.module.css";

export default function ResetPassword() {
    return(
        <div className={styles.container}>
            <h2>Enter New Password</h2>
            <form>
                <div className={styles.input_wrapper}>
                    <CiLock className={styles.icons} />
                    <input type="password" name="password" required placeholder="Enter Password..." />
                </div>
                <div className={styles.input_wrapper}>
                    <CiLock className={styles.icons} />
                    <input type="password" name="confirm" required placeholder="Reenter Password..." />
                </div>
                <button type="submit">Confirm Password</button>
            </form>
        </div>
    )
}