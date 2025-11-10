import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import magnifyingGlass from './assets/magnifyingGlass.svg';
import Results from './Results';
import YourPlaylist from './YourPlaylist';
import Banner from './Banner';

const CLIENT_ID = "0daed1230ede4c0c910f75e06e18e62e";
const CLIENT_SECRET = "cb2fd0d33f0f4009a599a834e968954d";

function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [returnedTracks, setReturnedTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  useEffect(() => {
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    };

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token));
  }, []);

  // Search
  async function Search() {
    if (!accessToken) {
      console.log("Access token not ready yet!");
      return;
    }

    console.log("Searching for " + inputValue);

    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    };

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${inputValue}&type=track,artist,album&limit=24`,
      searchParameters
    );
    const data = await response.json();

    console.log(data.tracks.items);
    setReturnedTracks(data.tracks.items || []);
  }

  const handleToggleTrack = (track, isAdded) => {
    setPlaylistTracks(prev => {
      if (isAdded) {
        if (prev.some(t => t.id === track.id)) return prev;
        return [...prev, track];
      }
      return prev.filter(t => t.id !== track.id);
    });
  };

  const handleRemoveTrack = (track) => {
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
  };

  return (
    <>
    <div className="header">
      <Banner />
      <form>
        <input
          className="searchBar"
          type="text"
          id="search"
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

      {/* render search results */}
      <Results
        tracks={returnedTracks}
        onToggleTrack={handleToggleTrack}
        playlistTracks={playlistTracks}  // <- pass current playlist so Results can derive isAdded
      />
      <YourPlaylist tracks={playlistTracks} onRemove={handleRemoveTrack} />
      {/* playlistTracks now contains the added tracks */}
    </>
  );
}

export default SearchBar;
