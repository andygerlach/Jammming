import React, { useState, useEffect } from "react";
import SearchResults from "./SearchResults";
import Playlist from "./Playlist";
import { Spotify } from "./Spotify";
import SearchBar from "./SearchBar";
import style from "./app.module.css"
import "./app.css"


function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("Example Playlist Name");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  function addTrack(track) {
    const exists = playlistTracks.find((t) => t.id === track.id);
    if (!exists) {
      setPlaylistTracks([...playlistTracks, track]);
      setSearchResults(searchResults.filter((t) => t.id !== track.id));
    }
  }

  function removeTrack(track) {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
  }

  function updatePlaylistName(name) {
    setPlaylistName(name);
  }

  function savePlaylist() {
    const trackURIs = playlistTracks.map((t) => t.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      updatePlaylistName("New Playlist");
      setPlaylistTracks([]);
    });
  }

  function search(term) {
    Spotify.search(term).then((result) => setSearchResults(result));
  }

  return (
    <div className="App">
      <h1>Jammming</h1>

      {/* SEARCH BAR SECTION */}
      <div className="SearchSection">
        <SearchBar onSearch={search} />
      </div>

      {/* MAIN RESULTS + PLAYLIST GRID */}
      <div className="MainContainer">
        <SearchResults
          userSearchResults={searchResults}
          onAdd={addTrack}
        />

        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;
