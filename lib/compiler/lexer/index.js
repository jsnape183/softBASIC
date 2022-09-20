import defaultTokenResolver from "./tokenResolver";
import { CompilationError } from "../errors";

const lexFile = (filename, source, tokenResolverConfig) => {
  let { tokenResolver, newLineToken } = tokenResolverConfig;
  let tokens = [];
  let currentPos = 0;
  let line = 1;
  let currentStream = source;

  while (currentStream.length > 0) {
    let match = { match: false };
    for (let tr of tokenResolver) {
      match = tr.isMatch(currentStream);
      if (match.match) {
        break;
      }
      match = { match: false };
    }
    if (!match.match) {
      throw new CompilationError(
        `Unexpected token ${currentStream.substring(0, 1)}`,
        line,
        currentPos,
        filename
      );
    }
    currentPos += match.position;
    if (match.token.value === newLineToken.value) {
      line++;
      currentPos = 0;
    }
    tokens.push({ ...match, line, col: currentPos, filename });
    if (match.position === 0) break;
    currentStream = currentStream.substring(match.position);
  }
  return tokens;
};

export const lexer = {
  lex: (project, tokenResolverConfig = defaultTokenResolver) => {
    const defs = lexFile("defs.bas", project.defs, tokenResolverConfig);
    console.log(project.files[0]);
    const main = lexFile(
      project.files[0].name,
      project.files[0].source,
      tokenResolverConfig
    );
    const tokens = [...defs, ...main];
    return tokens.filter((t) => !t.token.stripped);
  }
};

export default lexer;
