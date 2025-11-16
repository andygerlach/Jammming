import React from "react";
import Tracklist from "./Tracklist";
import styles from "./SearchResults.module.css";

function SearchResults(props) {
    return (
        <div className={styles.SearchResults}>
            <h2 className={styles.Title}>Results</h2>

            <Tracklist
                userSearchResults={props.userSearchResults}
                onAdd={props.onAdd}
                onRemove={props.onRemove}
                isRemoval={false}
            />
        </div>
    );
}

export default SearchResults;
