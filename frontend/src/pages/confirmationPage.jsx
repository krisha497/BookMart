import { useLocation, useNavigate } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";
import styles from "../styles/confirmationPage.module.css";

export default function ConfirmationPage() {
    
    const location = useLocation();
    const { username, deliveryDetails, items, total } = location.state;
    
    return(
        <div className={styles.content}>
            <FaRegCheckCircle />
        </div>
    )
}