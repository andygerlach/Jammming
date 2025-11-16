import React from "react";
import styles from "./Track.module.css";

function Track(props) {
    function handleClick() {
        if (props.isRemoval) {
            props.onRemove(props.track);
        } else {
            props.onAdd(props.track);
        }
    }

    return (
        <div
            className={styles.Track}
            onClick={handleClick}
        >
            {/* Album image */}
            {props.track.albumImage && (
                <img
                    className={styles.TrackImage}
                    src={props.track.albumImage}
                    alt={`${props.track.album} cover`}
                />
            )}

            {/* Track info */}
            <div className={styles.TrackInfo}>
                <h3 className={styles.TrackName}>{props.track.name}</h3>
                <p className={styles.TrackMeta}>
                    {props.track.artist} | {props.track.album}
                </p>
            </div>
        </div>
    );
}

export default Track;
