import styles from "../styles/AIPage.module.css";

export default function AIHeroPrompts() {

    const prompts = {
        "prompt1": "Something cosy for a rainy weekend",
        "prompt2": "A book I can escape into during a long flight",
        "prompt3": "Non-fiction that reads like a thriller",
        "prompt4": "If I loved Pireanesi, what should i read next?",
        "prompt5": "Something short - I only have 20 minutes a day",
        "prompt6": "Teach me something about history I didn't learn in school"
    }

    return(
        <div className={styles.hero}>
            <h2 className={styles.hero_heading}>Find your next best read</h2>
            <p className={styles.hero_description}>Describe a book, theme, or genre you love - or just ask anything. The assistant will help you find the perfect results.</p>
            <div className={styles.prompts}>
                <button className={styles.prompt}>{prompts['prompt1']}</button>
                <button className={styles.prompt}>{prompts['prompt2']}</button>
                <button className={styles.prompt}>{prompts['prompt3']}</button>
                <button className={styles.prompt}>{prompts['prompt4']}</button>
                <button className={styles.prompt}>{prompts['prompt5']}</button>
                <button className={styles.prompt}>{prompts['prompt6']}</button>
            </div>
        </div>
    )
}