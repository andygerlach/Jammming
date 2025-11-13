import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import magnifyingGlass from './assets/magnifyingGlass.svg';
import Results from './Results';
import YourPlaylist from './YourPlaylist';
import Banner from './Banner';
import { startAuth, handleRedirectCallback, getStoredToken } from './Auth'; // PKCE helpers

const CLIENT_ID = "0daed1230ede4c0c910f75e06e18e62e";

export default function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [userAccessToken, setUserAccessToken] = useState('');
  const [returnedTracks, setReturnedTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('My Jammming Playlist');

  // 1️⃣ Handle redirect after user authorization (PKCE)
  useEffect(() => {
    (async () => {
      try {
        const redirectUri = window.location.origin + '/';
        const params = new URLSearchParams(window.location.search);
        if (params.get('code')) {
          const tokenResp = await handleRedirectCallback({ clientId: CLIENT_ID, redirectUri });
          if (tokenResp?.access_token) {
            setUserAccessToken(tokenResp.access_token);
            return;
          }
        }
      } catch (err) {
        console.error('handleRedirectCallback error', err);
      }

      // Load stored token if already authorized
      const stored = getStoredToken();
      if (stored) setUserAccessToken(stored);
    })();
  }, []);

  // 2️⃣ Start the PKCE Authorization when user clicks button
  const handleAuthorizeClick = () =>
    startAuth({ clientId: CLIENT_ID, redirectUri: 'http://127.0.0.1:8080/' });

  // 3️⃣ Perform search (requires user access token)
  async function Search() {
    const token = userAccessToken || getStoredToken();
    if (!token) {
      alert('Please authorize first to search Spotify');
      return;
    }

    console.log("Searching for " + inputValue);

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(inputValue)}&type=track,artist,album&limit=24`,
      {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
      }
    );

    const data = await response.json();
    setReturnedTracks(data.tracks?.items || []);
  }

  const handleToggleTrack = (track, isAdded) => {
    setPlaylistTracks(prev =>
      isAdded
        ? prev.some(t => t.id === track.id) ? prev : [...prev, track]
        : prev.filter(t => t.id !== track.id)
    );
  };

  const handleRemoveTrack = (track) =>
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));

  const handleRenamePlaylist = (newName) => setPlaylistName(newName);

  // 4️⃣ Save playlist to Spotify (requires user access token)
  const savePlaylistToSpotify = async (name = playlistName) => {
    const token = userAccessToken || getStoredToken();
    if (!token) {
      alert('Authorize a Spotify user first to save playlists.');
      return;
    }
    if (!playlistTracks.length) {
      alert('Playlist is empty');
      return;
    }

    try {
      const meRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!meRes.ok) throw new Error('Failed to fetch user profile');
      const me = await meRes.json();
      const userId = me.id;

      // Create playlist
      const createRes = await fetch(`https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, public: false, description: 'Created with Jammming' })
      });
      if (!createRes.ok) throw new Error('Failed to create playlist');
      const playlist = await createRes.json();

      // Add tracks
      const uris = playlistTracks.map(t => t.uri).filter(Boolean);
      for (let i = 0; i < uris.length; i += 100) {
        const batch = uris.slice(i, i + 100);
        const addRes = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ uris: batch })
        });
        if (!addRes.ok) throw new Error('Failed to add tracks');
      }

      alert('Playlist saved to Spotify!');
    } catch (err) {
      console.error(err);
      alert('Error saving playlist: ' + err.message);
    }
  };

  return (
    <>
      <div className="header">
        <Banner />
        <form>
          <input
            className="searchBar"
            type="text"
            placeholder="Explore Spotify"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                Search();
              }
            }}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              Search();
            }}
            className="searchButton"
          >
            <img src={magnifyingGlass} className="glass" alt="Search" />
          </button>
        </form>
      </div>

      <div style={{ padding: '1rem' }}>
        <button onClick={() => savePlaylistToSpotify(playlistName)} className="searchButton">
          Save to Spotify
        </button>
      </div>

      <Results
        tracks={returnedTracks}
        onToggleTrack={handleToggleTrack}
        playlistTracks={playlistTracks}
      />

      <YourPlaylist
        tracks={playlistTracks}
        onRemove={handleRemoveTrack}
        playlistName={playlistName}
        onRename={handleRenamePlaylist}
      />

      {/* Always-visible authorize button */}
      <div className="authTop" style={{ position: 'fixed', top: 8, right: 16, zIndex: 999 }}>
        <button onClick={handleAuthorizeClick} className="authButton">Authorize</button>
      </div>
    </>
  );
}
