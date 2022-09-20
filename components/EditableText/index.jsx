import React, { useState } from "react";

export const EditableText = ({ defaultText, onChange }) => {
  const [textToggle, setTextToggle] = useState(false);
  const [text, setText] = useState(defaultText);

  const handleTextClick = (e) => {
    setTextToggle(true);
  };

  const handleInputTextChange = (e) => {
    setText(e.target.value);
  };

  const handleBlur = (e) => {
    setTextToggle(false);
    onChange(text);
  };

  return (
    <>
      {!textToggle && <div onClick={handleTextClick}>{defaultText}</div>}
      {textToggle && (
        <input
          type="text"
          value={text}
          onChange={handleInputTextChange}
          onBlur={handleBlur}
        />
      )}
    </>
  );
};

export default EditableText;
