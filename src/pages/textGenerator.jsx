import React  from "react";

import { sentence } from "txtgen";

const TextGenerator = ({ setGeneratedText, updateContent }) => {

  const generateText = () => {
    let text = sentence();
    setGeneratedText(text);
    updateContent(text);
  };
  return (
    <div>
      <button type="button" className="bn5" onClick={generateText}>
        Generate Text
      </button>
    </div>
  );
};
export default TextGenerator;
