import React from "react";

function Track(props) {  //function
    function renderAction() {  //helper function to determine which button should appear + or -
        if (props.isRemoval) {  //props.isRemoval is a boolean prop passed down from parent
            return (
                <button onClick={passTrackToRemove}>-</button>
            );
        } else {
            return (
                <button onClick={passTrack}>+</button>
            );
        }
    }

    function passTrack() {  //bridge function to let the Track component communicate with its parent component
        props.onAdd(props.track);
    }

    function passTrackToRemove() {  //bridge function to let the Track component communicate with its parent component
        props.onRemove(props.track);
    }

    return (
        <div >
            <div>
                {/* <h3><!-- track name will go here --></h3> */}
                <h3>{props.track.name}</h3>
                {/* <p><!-- track artist will go here--> | <!-- track album will go here --></p> */}
                <p>
                    {props.track.artist} | {props.track.album}
                </p>
            </div>
            {/* <button class="Track-action"><!-- + or - will go here --></button> */}
            {renderAction()}
        </div>
    );
}

export default Track;