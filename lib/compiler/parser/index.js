import symbols from "../symbols";
import parserRules from "./parserRules";
import tokenStream from "./tokenStream";

export const parser = {
  parse: (tokens) => {
    const stream = tokenStream(tokens);
    const symbolTable = symbols();
    const parseResult = parserRules.Root({ tokenStream: stream, symbolTable });

    return { tree: parseResult, symbolTable };
  }
};

export default parser;
