import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import styles from "../styles/rankingsPage.module.css";

export default function RankingGraph({data}) {
    return (
        <div className={styles.graph}>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={data}
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 14 }}
                        tickLine={false}
                    />
                    <YAxis type="number" tickLine={false} />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "white",
                            border: "none",
                            borderRadius: "10px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{
                            color: "#A5668B",
                            fontWeight: 500,
                        }}
                        itemStyle={{
                            color: "#111827",
                        }}
                    />  
                    
                    <Bar
                        dataKey="popularity"
                        fill="#A5668B"
                        radius={[0, 6, 6, 0]}
                    >
                        <LabelList dataKey="rank" position="left" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}