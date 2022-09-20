export const matchChar = (input, match) => ({
  match: input.substring(0, 1) === match,
  position: 1,
  text: input.substring(0, 1)
});

export const matchAll = (input, match) => {
  let position = 0;
  while (input.substring(position, 1) === match) {
    position++;
  }
  return { match: position > 0, position, text: input.substring(0, position) };
};

export const matchString = (input, match) => {
  return {
    match:
      input.length >= match.length &&
      input.substring(0, match.length).toLowerCase() === match,
    position: match.length,
    text: input.substring(0, match.length)
  };
};

export const matchPattern = (input, regex) => {
  const result = input.match(regex);
  return {
    match: result && result.length > 0 && result[0] !== "",
    position: result && result[0].length,
    text: result && result[0]
  };
};
