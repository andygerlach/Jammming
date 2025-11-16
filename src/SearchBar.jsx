import React, { useState } from "react";
import styles from "./SearchBar.module.css"; // <-- make sure this exists

function SearchBar(props) {
    const [term, setTerm] = useState("");

    function submitSearch() {
        if (term.trim() === "") return;
        props.onSearch(term);
        setTerm("");
    }

    function handleTermChange({ target }) {
        setTerm(target.value);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            submitSearch();
        }
    }

    return (
        <div className={styles.SearchBar}>
            <input
                className={styles.SearchInput}
                placeholder="Enter A Song, Album, or Artist"
                value={term}
                onChange={handleTermChange}
                onKeyDown={handleKeyDown}
            />
            <button
                className={styles.SearchButton}
                onClick={submitSearch}
            >
                SEARCH
            </button>
        </div>
    );
}

export default SearchBar;
