import styles from "../styles/AIPage.module.css";
import { IoMdSend } from "react-icons/io";

export default function AITextInput() {
    return(
        <div className={styles.input}>
            <textarea 
                placeholder="Ask the AI Assistant for Book Recomendations... "
                className={styles.textbox}
                rows={1}
            />
            <button className={styles.submit} onClick={() => setShowOutput(true)}>
                <IoMdSend />
            </button>
        </div>
    )
}