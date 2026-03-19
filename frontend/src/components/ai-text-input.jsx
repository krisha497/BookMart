import styles from "../styles/AIPage.module.css";
import { IoMdSend } from "react-icons/io";

export default function AITextInput({ input, setInput, onSend, loading }) {

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return(
        <div className={styles.input}>
            <textarea 
                placeholder="Ask the AI Assistant for Book Recomendations... "
                className={styles.textbox}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
            />
            <button 
                className={styles.submit}
                onClick={() => setShowOutput(true)}
                disabled={loading || !input.trim()}
            >
                <IoMdSend />
            </button>
        </div>
    )
}