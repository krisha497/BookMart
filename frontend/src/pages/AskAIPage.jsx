import {useState} from "react";
import NavBar from "../components/navigation-bar"
import SideBar from "../components/side-bar"
import AIGeneratedList from "../components/ai-generated-list";

import styles from "../styles/AIPage.module.css";
import { IoMdSend } from "react-icons/io";

export default function AIAssistant() {

    const [showOutput, setShowOutput] = useState(false);

    const data = [
        { rank: 1, name:"Book 1", image:"https://placehold.co/300x300", description: "Best Book Ever" },
        { rank: 2, name:"Book 2", image:"https://placehold.co/300x300", description: "Second Best Book Ever" },
        { rank: 3, name:"Book 3", image:"https://placehold.co/300x300", description: "Third Best Book Ever" },
    ]

    return(
        <>
            <NavBar />
            <div className={styles.AI_page}>
                <SideBar />
                <div className={styles.content}>
                    <div className={styles.input}>
                        <h2>AI Assistant</h2>
                        <textarea 
                            placeholder="Ask the AI Assistant for Book Recomendations... "
                            className={styles.textbox}
                            rows={1}
                        />
                        <button className={styles.submit} onClick={() => setShowOutput(true)}>
                            <IoMdSend />
                        </button>
                    </div>

                    {showOutput && (
                        <div className={styles.output}>
                            <h3>Your Reccomendations: </h3>
                            <div className={styles.results}>
                                {data.map((r,i) => (
                                    <AIGeneratedList
                                    key={i}
                                    name={r.name}
                                    image={r.image}
                                    description={r.description}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}