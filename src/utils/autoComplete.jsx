// AutoCompleteTextarea.js
import { faL } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";

const AutoCompleteTextarea = ({ text, onTextChange, className }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    // Fetch suggestions from Datamuse API based on the last word in the text
    const fetchSuggestions = async () => {
      const words = text.trim().split(" ");
      const lastWord = words[words.length - 1];

      try {
        const response = await fetch(
          `https://api.datamuse.com/words?rel_jjb=${lastWord}&max=20`
        );
        const data = await response.json();
        setSuggestions(data.reverse());
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    if (text.trim() !== "") {
      fetchSuggestions();
    } else {
      setSuggestions([]); // Clear suggestions when text is empty
    }
  }, [text]);

  const handleSuggestionClick = (suggestion) => {
    console.log(text);
    console.log(suggestion);
    const words = text.trim().split(" ");
    const lastWord = words[words.length - 1];
    words[words.length - 1] = lastWord
      ? lastWord + " " + suggestion
      : suggestion;
    const newText = words.join(" ");
    onTextChange(newText);
    setSuggestions([]); // Clear suggestions after selecting one
    setSelectedSuggestion(null); // Highlight the selected suggestion
  };

  

  return (
    <div className="auto-complete-textarea">
      {focused && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.word)}
              className={
                suggestion.word === selectedSuggestion ? "selected" : ""
              }
            >
              {suggestion.word}
            </li>
          ))}
        </ul>
      )}
      <textarea
        onFocus={() => setFocused(true)}
        // onBlur={() => setFocused(false)}
        className={className}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
      />
    </div>
  );
};

export default AutoCompleteTextarea;
