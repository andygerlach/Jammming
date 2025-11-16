import React from "react";
import Track from "./Tracks";
import styles from "./Tracklist.module.css";

function Tracklist(props) {
    return (
        <div className={styles.Tracklist}>
            {props.userSearchResults.map((track) => (
                <Track
                    track={track}
                    key={track.id}
                    isRemoval={props.isRemoval}
                    onAdd={props.onAdd}
                    onRemove={props.onRemove}
                />
            ))}
        </div>
    );
}

export default Tracklist;
