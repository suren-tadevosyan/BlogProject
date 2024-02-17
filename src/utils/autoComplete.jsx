import React, { useState, useEffect } from "react";

const AutoCompleteTextarea = ({
  text,
  onTextChange,
  className,
  handleSubmit,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [focused, setFocused] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      handleSubmit(e); // Pass the event object to handleSubmit
    }
  };
  useEffect(() => {
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
      setSuggestions([]);
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
    setSuggestions([]);
    setSelectedSuggestion(null);
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
        onKeyPress={handleKeyPress}
        onFocus={() => setFocused(true)}
        className={className}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
      />
    </div>
  );
};

export default AutoCompleteTextarea;
