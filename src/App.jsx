import { useState } from 'react'
import './App.css'
import Banner from './Banner'
import SearchBar from './SearchBar'
import Results from './Results'
import YourPlaylist from './YourPlaylist'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SearchBar />
      <Results />
    </>
  )
}

export default App
