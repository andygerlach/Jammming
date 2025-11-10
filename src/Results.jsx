import React from 'react';
import './Results.css';

function ToggleButton({ isAdded, onClick }) {
    return (
        <button
            onClick={onClick}
            className={isAdded ? 'added add' : 'add'}
            aria-pressed={isAdded}
        >
            {isAdded ? '✓' : '+'}
        </button>
    );
}

export default function Results({ tracks = [], onToggleTrack, playlistTracks = [] }) {
    if (!tracks.length) return null;

    // derive a fast lookup from parent's playlist state
    const playlistIds = new Set(playlistTracks.map(t => t.id));

    const toggle = (track) => {
        // ask parent to add/remove based on current membership
        const willBeAdded = !playlistIds.has(track.id);
        if (typeof onToggleTrack === 'function') onToggleTrack(track, willBeAdded);
    };

    return (
        <div className="results">
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
                            <ToggleButton
                                isAdded={playlistIds.has(track.id)}
                                onClick={() => toggle(track)}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

