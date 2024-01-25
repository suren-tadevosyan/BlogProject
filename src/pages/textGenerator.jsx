import React, { useState } from "react";

import { sentence } from "txtgen";

const TextGenerator = ({ setGeneratedText, updateContent }) => {
  const [prompt, setPrompt] = useState("");

  const generateText = () => {
    let text = sentence();
    setGeneratedText(text);
    updateContent(text);
  };
  return (
    <div>
      <button type="button" onClick={generateText}>
        Generate Text
      </button>
    </div>
  );
};
export default TextGenerator;
