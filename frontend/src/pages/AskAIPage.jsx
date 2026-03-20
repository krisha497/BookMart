import {useEffect, useState} from "react";

import styles from "../styles/AIPage.module.css";
import AIHeroPrompts from "../components/ai-hero-prompts";
import AITextInput from "../components/ai-text-input";
import AIChatMessages from "../components/ai-chat-messages";

export default function AIAssistant() {

    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = async(text) => {
        const query = text ||  input.trim();
        if (!query || loading) return;
        setInput("");

        setMessages((prev) => [
            ...prev,
            { role: 'user', text: query }
        ]);
        setLoading(true);

        try {
            const response = await fetch("http://localhost/bookmart/backend/recommend.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("Failed to generate recommendations. Please try again.");
            }
            const result = await response.json();

            if (result.status === "error") {
                setMessages((prev) => [
                    ...prev,
                    { role: 'bot', text: result.message, error: true }
                ]);
                return;
            }

            console.log(result);
            setMessages((prev) => [...prev, { 
                role: 'bot', 
                text: 'Here are some books you may like: ',
                books: result.recommendations 
            }]);

        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: 'bot', text: 'Something went worng. Please try again.', error: true }
            ]);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className={styles.AI_page}>
            <div className={`${styles.content} ${styles.ai_page_content}`}>
                {messages.length === 0 && !loading ? (
                    <AIHeroPrompts onPromptClick={sendMessage} />
                ) : (
                    <AIChatMessages messages={messages}loading={loading} />
                )}
            </div>
            <AITextInput input={input} setInput={setInput} onSend={sendMessage} loading={loading} />
        </div>
    )
}