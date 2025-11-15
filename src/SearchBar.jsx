import React, { useState } from "react";


function SearchBar(props) { //props is an object containing data passed in from the parent component

    const [Term, setTerm] = useState(""); //state hook to re-render when information changes

    /* helper function for SearchBar()
    lifting state up. onSearch is a callback funtion passed down from the parent via props. This function acts as a messenger between the child and parent. it takes the current value of searchTerm from useState and sends it back to the parent by calling the parents onSearch function
        |
        |
        v
    */

    function passTerm() {
        props.onSearch(Term);
    }


    /* handles input change event from search. this function is called automatically when the user types. The parameter { target } uses object destructuring. setTerm uses the hook to update value with the useState, keeping the value updated with what the user types.
    */

    function handleTermChange({ target }) {
        setTerm(target.value);
    }

    return (
        <div>
            <input
                placeholder="Enter A Song, Album, or Artist"
                onChange={handleTermChange}
            />
            <button onClick={passTerm}>SEARCH</button>
        </div>
    );

}

export default SearchBar;