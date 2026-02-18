import React from "react"
import NavBar from "../components/navigation-bar"
import SideBar from "../components/side-bar"
import styles from "../styles/rankingsPage.module.css";
import RankingGraph from "../components/rankings-graph";
import RankingList from "../components/ranking-list";

const data = [
    { rank: 1, name:"Book 1", popularity: 99, image:"https://placehold.co/300x300", description: "Best Book Ever" },
    { rank: 2, name:"Book 2", popularity: 95, image:"https://placehold.co/300x300", description: "Second Best Book Ever" },
    { rank: 3, name:"Book 3", popularity: 94, image:"https://placehold.co/300x300", description: "Third Best Book Ever" },
    { rank: 4, name:"Book 4", popularity: 94, image:"https://placehold.co/300x300", description: "Fourth Best Book Ever" },
    { rank: 5, name:"Book 5", popularity: 91, image:"https://placehold.co/300x300", description: "Fifth Best Book Ever" },
    { rank: 6, name:"Book 6", popularity: 88, image:"https://placehold.co/300x300", description: "Sixth Best Book Ever" },
    { rank: 7, name:"Book 7", popularity: 84, image:"https://placehold.co/300x300", description: "Seventh Best Book Ever" },
    { rank: 8, name:"Book 8", popularity: 84, image:"https://placehold.co/300x300", description: "Eighth Best Book Ever" },
    { rank: 9, name:"Book 9", popularity: 84, image:"https://placehold.co/300x300", description: "Ninth Best Book Ever" },
    { rank: 10, name:"Book 10", popularity: 84, image:"https://placehold.co/300x300", description: "Tenth Best Book Ever" },
    { rank: 11, name:"Book 11", popularity: 84, image:"https://placehold.co/300x300", description: "Eleventh Best Book Ever" },
    { rank: 12, name:"Book 12", popularity: 84, image:"https://placehold.co/300x300", description: "Twelfth Best Book Ever" },
    { rank: 13, name:"Book 13", popularity: 84, image:"https://placehold.co/300x300", description: "Thirteenth Best Book Ever" },
    { rank: 14, name:"Book 14", popularity: 84, image:"https://placehold.co/300x300", description: "Fouteenth Best Book Ever" },
    { rank: 15, name:"Book 15", popularity: 84, image:"https://placehold.co/300x300", description: "Fifteenth Best Book Ever" },
    { rank: 16, name:"Book 16", popularity: 84, image:"https://placehold.co/300x300", description: "Sixteenth Best Book Ever" },
    { rank: 17, name:"Book 17", popularity: 84, image:"https://placehold.co/300x300", description: "Seventeenth Best Book Ever" },
    { rank: 18, name:"Book 18", popularity: 84, image:"https://placehold.co/300x300", description: "Eighteenth Best Book Ever" },
    { rank: 19, name:"Book 19", popularity: 84, image:"https://placehold.co/300x300", description: "Nineteenth Best Book Ever" },
    { rank: 20, name:"Book 20", popularity: 84, image:"https://placehold.co/300x300", description: "Twentieth Best Book Ever" },
]

export default function RankingsPage() {
    return(
        <>
            <NavBar />
            <div className={styles.global_rankings}>
                <SideBar />
                <div className={styles.content}>
                    <section className={styles.popularity_graph}>
                        <h2>Popularity Chart</h2>
                        <RankingGraph data={data.slice(0,10)}/>
                    </section>
                    <h2>Top Books Globally</h2>
                    <section className={styles.ranking_list}>
                        {data.slice(0,15).map((r,i) => (
                            <RankingList
                            key={i}
                            name={r.name}
                            image={r.image}
                            popularity={r.popularity}
                            description={r.description}
                            />
                        ))}
                    </section>
                </div>
            </div>
        </>
    )
}