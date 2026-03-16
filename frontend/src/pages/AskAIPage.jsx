import {useState} from "react";

import styles from "../styles/AIPage.module.css";
import AIHeroPrompts from "../components/ai-hero-prompts";
import AITextInput from "../components/ai-text-input";

export default function AIAssistant() {

    return(
        <div className={styles.AI_page}>
            <div className={styles.content}>
                <AIHeroPrompts />
            </div>
            <AITextInput/>
        </div>
    )
}