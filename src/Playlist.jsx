import React from "react";
import Tracklist from "./Tracklist";

function Playlist(props) {
    function handleNameChange({ target }) {
        props.onNameChange(target.value);
    }
    return (
        <div>
            <input defaultValue={"New Playlist"} onChange={handleNameChange} />
            {/* <!-- Add a TrackList component --> */}
            <Tracklist
                userSearchResults={props.playlistTracks}
                onRemove={props.onRemove}
                isRemoval={true}
            />
            <button onClick={props.onSave} >
                SAVE TO SPOTIFY
            </button>
        </div>
    );
}

export default Playlist; 

/* 
Playlist represents the user’s playlist.
It allows the user to:

rename the playlist

view and remove tracks in the playlist

save the playlist to Spotify
*/