import { React, useState } from "react";
import { CiLock } from 'react-icons/ci';
import { useNavigate, useSearchParams } from "react-router-dom";

import styles from "../styles/ResetPasswordPage.module.css";

export default function ResetPassword() {

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const [ searchParams ] = useSearchParams();
    const token = searchParams.get('token');

    const [ formData, setFormData ] = useState({
        password: "",
        confirm: ""
    });

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
            const response = await fetch(`${API_BASE}/reset.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ token, password: formData.password, confirm: formData.confirm })
            }); 

            const result = await response.json();

            if(result.status === "success") {
                alert("Password Changed Successfully");
                navigate("/login");
            } else {
                alert(result.message);
            }
        } catch(error) {
            alert("An error occured... Please try again");
            console.error(error);
        }
    }

    return(
        <div className={styles.container}>
            <h2 className={styles.reset}>Enter New Password</h2>
            <form className={styles.reset_form} onSubmit={handleSubmit}>
                <div className={styles.input_wrapper}>
                    <CiLock className={styles.icons} />
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Enter Password..."
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.input_wrapper}>
                    <CiLock className={styles.icons} />
                    <input
                        type="password"
                        name="confirm"
                        required
                        placeholder="Re-enter Password..."
                        value={formData.confirm}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className={styles.submit_button}>Confirm Password</button>
            </form>
        </div>
    )
}