import { CompilationError } from "../errors";

export const checkAny = (expected, actual) => {
  return Boolean(expected.find((e) => e.value === actual.token.value));
};

export const matchAny = (expected, actual) => {
  const result = checkAny(expected, actual);

  if (!result) {
    throw new CompilationError(
      `Expected ${expected.map((e) => e.name).join()} got ${actual.token.name}`,
      actual.line,
      actual.col,
      actual.filename
    );
  }
};

export const check = (expected, actual) => {
  if (Array.isArray(expected)) return checkAny(expected, actual);

  return expected.value === actual.token.value;
};

export const match = (expected, actual) => {
  if (!check(expected, actual)) {
    throw new CompilationError(
      `Expected ${expected.name} got ${actual.token.name}`,
      actual.line,
      actual.col,
      actual.filename
    );
  }

  return true;
};

export const matchAndMove = (expected, tokenStream) => {
  if (Array.isArray(expected)) {
    matchAny(expected, tokenStream.current());
    tokenStream.advance();
    return;
  }

  match(expected, tokenStream.current());
  tokenStream.advance();
};
