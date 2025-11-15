import React from "react";
import Track from "./Tracks";

/* 
Tracklist is a React component that displays a list of tracks.
It takes an array of track objects from the parent and renders a <Track> component for each one.

This component does not manage state. It simply receives tracks, loops through them, and ouputs a UI component for each track.
*/

function Tracklist(props) {
    return (
        <div >
            {/* <!-- You will add a map method that renders a set of Track components  --> */}
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

/* props.userSearchResults.map((track) => (...))

userSearchResults is an array (list) of track objects.

map() loops over that array.

For every track, it returns a <Track> component.

Example:
If there are 10 tracks in the search results, this will render 10 <Track /> elements.


*/