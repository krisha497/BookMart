import {React, useEffect, useState} from "react";
import { CiSearch } from "react-icons/ci";
import styles from "../styles/searchBook.module.css";

export default function SearchBook() {

    return(
        <div className={styles.search_book}>
            <CiSearch className={styles.placeholder_search}/>
            <input 
                className={styles.search_bar}
                type="text"
                placeholder="Enter book name..."
            />
            <button type="button" className={styles.search_button}><CiSearch /></button>
        </div>
    )
}