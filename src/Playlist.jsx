import React from "react";
import Tracklist from "./Tracklist";
import styles from "./Playlist.module.css";

function Playlist(props) {
    function handleNameChange({ target }) {
        props.onNameChange(target.value);
    }

    return (
        <div className={styles.Playlist}>
            <input
                className={styles.PlaylistInput}
                value={props.playlistName}
                onChange={handleNameChange}
            />
            <Tracklist
                userSearchResults={props.playlistTracks}
                onRemove={props.onRemove}
                isRemoval={true}
            />
            <button
                className={styles.PlaylistSave}
                onClick={props.onSave}
            >
                SAVE TO SPOTIFY
            </button>
        </div>
    );
}

export default Playlist;
