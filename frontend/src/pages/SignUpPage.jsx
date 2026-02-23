import { React, useState } from "react";
import { CiUser, CiLock, CiMail } from 'react-icons/ci';
import { useNavigate } from "react-router-dom";

import styles from '../styles/SignUpPage.module.css';

export default function SignUp() {

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const [formData, setFormData ] = useState({
        username: "",
        email: "",
        password: "",
        confirm: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE}/signup.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (result.status === "success") {
                alert("Registration Successful");
                navigate("/login");
            } else {
                alert(result.message);
            }
        } catch(error) {
            console.error(error);
            alert("An error occured. Please try again.");
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.signup}>Sign Up</h2>
            <form className={styles.signup_form} onSubmit={handleSubmit}>
                <div className={styles.input_wrapper}>
                    <CiMail className={styles.icons} />
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email..."
                        value={formData.email}
                        onChange={handleChange}
                     />
                </div>
                <div className={styles.input_wrapper}>
                    <CiUser className={styles.icons} />
                    <input
                        type="text"
                        name="username"
                        required
                        placeholder="Username..."
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.input_wrapper}>
                    <CiLock className={styles.icons} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password..."
                        required
                        defaultValue={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.input_wrapper}>
                    <CiLock className={styles.icons} />
                    <input
                        type="password"
                        name="confirm"
                        placeholder="Confirm Password..."
                        required
                        defaultValue={formData.confirm}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className={styles.submit_button}>Create Account</button>
                <p className={styles.to_login}>Already have an account? <a className={styles.login_link} href='/login'>Log In</a></p>
            </form>
        </div>
    )
}
