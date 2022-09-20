const eof = { token: { name: "EndOfFile", value: 0 } };

const generateEof = (tokens) => {
  const { line, col, filename } = tokens[tokens.length - 1];

  return { ...eof, line, col, filename };
};

export const tokenStream = (tokens) => {
  let tokenPtr = 0;
  return {
    prev: () => {
      if (tokenPtr === 0) return generateEof(tokens);
      return tokens[tokenPtr - 1];
    },
    next: () => {
      if (tokenPtr >= tokens.length) return generateEof(tokens);
      return tokens[tokenPtr + 1];
    },
    at: (position) => {
      if (position >= tokens.length) return generateEof(tokens);
      return tokens[position];
    },
    current: () => {
      if (tokenPtr >= tokens.length) return generateEof(tokens);
      return tokens[tokenPtr];
    },
    advance: () => {
      tokenPtr++;
    },
    endOfStream: () => {
      return tokenPtr >= tokens.length;
    }
  };
};

export default tokenStream;
