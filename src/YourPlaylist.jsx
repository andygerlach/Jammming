import React, { useState, useEffect } from 'react';
import './YourPlaylist.css';

export default function YourPlaylist({ tracks = [], onRemove, playlistName = 'Playlist', onRename }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(playlistName);

    // keep draft in sync when parent changes playlistName
    useEffect(() => {
      setDraftName(playlistName);
    }, [playlistName]);

    const saveName = () => {
      const newName = (draftName || '').trim() || 'Untitled Playlist';
      setIsEditing(false);
      if (typeof onRename === 'function') onRename(newName);
    };

    const cancelEdit = () => {
      setIsEditing(false);
      setDraftName(playlistName);
    };

    const onInputKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveName();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    };

    return (
      <div className="yourPlaylistContainer">
        <div className="playlistHeader">
          {!isEditing ? (
            <>
              <h3 className="playlistTitle">{playlistName}</h3>
              <button className="editNameButton" onClick={() => setIsEditing(true)}>Edit</button>
            </>
          ) : (
            <>
              <input
                aria-label="Playlist name"
                className="playlistNameInput"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={onInputKeyDown}      // <-- handle Enter/Escape
                autoFocus
              />
              <button className="saveNameButton" onClick={saveName}>Save</button>
              <button className="cancelNameButton" onClick={cancelEdit}>Cancel</button>
            </>
          )}
        </div>

        <div className="yourPlaylist">
          {tracks.length === 0 ? (
            <p className="emptyPlaylist">No tracks in your playlist</p>
          ) : (
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
          )}
        </div>
      </div>
    );
}