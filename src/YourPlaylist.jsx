import React, { useState } from 'react';
import './YourPlaylist.css';

export default function YourPlaylist({ tracks = [], onRemove, playlistName = 'Playlist', onRename }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(playlistName);

    // keep input in sync when parent name changes
    React.useEffect(() => {
        setDraftName(playlistName);
    }, [playlistName]);

    if (!tracks.length) return (
        <div className="yourPlaylistDefault">
            <p>No tracks in your playlist</p>
        </div>
    );

    return (
        <>
        <div className="playlistHeader">
            {!isEditing ? (
                <>
                <h3>{playlistName}</h3>
                <button className="editNameButton" onClick={() => setIsEditing(true)}>Name</button>
                </>
            ) : (
                <>
                <input
                    aria-label="Playlist name"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                />
                <button
                    onClick={() => {
                        setIsEditing(false);
                        if (typeof onRename === 'function') onRename(draftName.trim() || 'Untitled Playlist');
                    }}
                >
                    Save
                </button>
                <button onClick={() => { setIsEditing(false); setDraftName(playlistName); }}>Cancel</button>
                </>
            )}
        </div>
        <div className="yourPlaylist">
            <ul>
                {tracks.map((track) => (
                    <li key={track.id}>
                        <div className="img">
                            <img src={track.album?.images?.[0]?.url} alt={track.name} />
                        </div>
                        <div className="trackInfo">
                            <h4>{track.name}</h4>
                            <h5>{track.artists?.[0]?.name}</h5>
                            <h6>{track.album?.name}</h6>
                        </div>
                        <div className="button">
                            <button onClick={() => onRemove && onRemove(track)}>-</button>
                        </div>
                    </li>
                ))} 
            </ul>
        </div> 
        </>
    );
}