import {React, useState } from "react";
import { CiMail } from 'react-icons/ci';
import { useNavigate } from "react-router-dom";

import styles from "../styles/ForgotPasswordPage.module.css"

export default function ForgotPassword() {

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const [ formData, setFormData ] = useState({
        email: ""
    });

    const [resetLink, setResetLink] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE}/forgot.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if(result.status === "success") {
                alert("Token Generated");
                setResetLink(result.resetLink);
                console.log(resetLink)
            } else {
                alert(result.message);
            }
        } catch(error) {
            alert("An error occured");
            console.error(error);
        }
    }

    return(
        <div className={styles.container}>
            <h2 className={styles.forgot}>Forgot Password</h2>
            <form className={styles.forgot_form} onSubmit={handleSubmit}>
                <div className={styles.input_wrapper}>
                    <CiMail className={styles.icons} />
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email..."
                        defaultValue={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className={styles.submit_button}>Forgot Password</button>
                <p className={styles.to_login}>Go back to <a className={styles.login_link} href='/login'>Log In Page</a></p>

                {resetLink && <p>Reset Password Link: </p>}
                {resetLink && <a href={resetLink} className={styles.reset_link}>Click here</a>}
            </form>
        </div>
    )
}