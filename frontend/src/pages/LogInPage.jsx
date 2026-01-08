import React, { useState } from "react";
import { CiUser, CiLock } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/LogInPage.module.css';

export default function LogIn() {
    return (
        <div className={styles.container}>
            <h2>Log In</h2>
            <form>
                <div className={styles.input_wrapper}>
                    <CiUser className={styles.icons} />
                    <input type="text" name="username" required placeholder="Username..." />
                </div>
                <div className={styles.input_wrapper}>
                    <CiLock className={styles.icons} />
                    <input type="password" name="password" placeholder="Password..." required />
                </div>
                <div className={styles.remember_me}>
                    <input type="checkbox" className={styles.remember_me_button} value="Remember Me" />
                    <label className={styles.remember_me_label}>Remember Me</label>
                </div>
                <button type="submit">Log In</button>
                <p className={styles.forgot_password_link}><a href='/ForgotPassword'>Forgot Password?</a></p>
                <p className={styles.to_signup}>Do not have an account? <a href='/SignUp'>Sign Up</a></p>
            </form>
        </div>
    )
}
