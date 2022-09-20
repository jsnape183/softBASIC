import tokens from "../tokens";
import node from "../tree";
import nodeTypes from "../tree/nodeTypes";
import boolExpressionRules from "./boolExpressionRules";
import { matchAndMove, check } from "./rulesHelpers";

const factors = [tokens.String, tokens.Number, tokens.Variable];

export const expressionRules = {
  Expression: ({ tokenStream, symbolTable }) => {
    let term = null;

    if (check([tokens.Add, tokens.Subtract], tokenStream.current())) {
      matchAndMove([tokens.Add, tokens.Subtract], tokenStream);
      term = node(
        nodeTypes.UMinus,
        null,
        expressionRules.Term({ tokenStream, symbolTable })
      );
    } else {
      term = expressionRules.Term({ tokenStream, symbolTable });
    }

    while (check([tokens.Add, tokens.Subtract], tokenStream.current())) {
      switch (tokenStream.current().token) {
        case tokens.Add:
          term = expressionRules.Add(term, { tokenStream, symbolTable });
          break;
        case tokens.Subtract:
          term = expressionRules.Subtract(term, { tokenStream, symbolTable });
          break;
        default:
          return node(nodeTypes.Expression, null, term);
      }
    }
    return term;
  },
  Add: (term, { tokenStream, symbolTable }) => {
    matchAndMove(tokens.Add, tokenStream);
    const secondary = expressionRules.Term({ tokenStream, symbolTable });
    return node(nodeTypes.Add, null, [term, secondary]);
  },
  Subtract: (term, { tokenStream, symbolTable }) => {
    matchAndMove(tokens.Subtract, tokenStream);
    const secondary = expressionRules.Term({ tokenStream, symbolTable });
    return node(nodeTypes.Subtract, null, [term, secondary]);
  },
  Multiply: (term, { tokenStream, symbolTable }) => {
    matchAndMove(tokens.Multiply, tokenStream);
    const secondary = expressionRules.Term({ tokenStream, symbolTable });
    return node(nodeTypes.Multiply, null, [term, secondary]);
  },
  Divide: (term, { tokenStream, symbolTable }) => {
    matchAndMove(tokens.Divide, tokenStream);
    const secondary = expressionRules.Term({ tokenStream, symbolTable });
    return node(nodeTypes.Divide, null, [term, secondary]);
  },
  Term: ({ tokenStream, symbolTable }) => {
    let factor = expressionRules.Factor({ tokenStream, symbolTable });
    while (check([tokens.Multiply, tokens.Divide], tokenStream.current())) {
      switch (tokenStream.current().token) {
        case tokens.Multiply:
          factor = expressionRules.Multiply(factor, {
            tokenStream,
            symbolTable
          });
          break;
        case tokens.Divide:
          factor = expressionRules.Divide(factor, { tokenStream, symbolTable });
          break;
        default:
          console.log("defaulting");
          return node(nodeTypes.Expression, null, factor);
      }
    }
    return factor;
  },
  FunctionFactor: ({ tokenStream, symbolTable }, name) => {
    const expr = boolExpressionRules.ExpressionList({
      tokenStream,
      symbolTable
    });
    return node(
      nodeTypes.FunctionTerm,
      symbolTable.get(name, "Function").name,
      expr
    );
  },
  VariableFactor: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.Variable, tokenStream);
    const name = tokenStream.prev().text;

    if (symbolTable.check(name, "Function")) {
      return expressionRules.FunctionFactor({ tokenStream, symbolTable }, name);
    }
    if (!check(tokens.OpenParen, tokenStream.current())) {
      return node(nodeTypes.Term, symbolTable.get(name).name, null);
    }
    matchAndMove(tokens.OpenParen, tokenStream);
    const elems = boolExpressionRules.ArrayList({ tokenStream, symbolTable });
    matchAndMove(tokens.CloseParen, tokenStream);
    return node(
      nodeTypes.ArrayLookup,
      symbolTable.get(name, "Array").name,
      elems
    );
  },
  CallFactor: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.Call, tokenStream);
    matchAndMove(tokens.OpenParen, tokenStream);
    const expr = boolExpressionRules.BoolExpression({
      tokenStream,
      symbolTable
    });
    matchAndMove(tokens.CloseParen, tokenStream);
    return node(nodeTypes.CallTerm, null, expr);
  },
  Factor: ({ tokenStream, symbolTable }) => {
    if (check([tokens.Add, tokens.Subtract], tokenStream.current())) {
      matchAndMove([tokens.Add, tokens.Subtract], tokenStream);
      return node(
        nodeTypes.UMinus,
        null,
        expressionRules.Factor({ tokenStream, symbolTable })
      );
    }
    if (check(tokens.OpenParen, tokenStream.current())) {
      matchAndMove(tokens.OpenParen, tokenStream);
      console.log("Paren");
      const expr = boolExpressionRules.BoolExpression({
        tokenStream,
        symbolTable
      });
      console.log(tokenStream.current());
      matchAndMove(tokens.CloseParen, tokenStream);
      return node(nodeTypes.Paren, null, expr);
    }
    if (check(tokens.Call, tokenStream.current())) {
      return expressionRules.CallFactor({ tokenStream, symbolTable });
    }
    if (check(tokens.Variable, tokenStream.current())) {
      return expressionRules.VariableFactor({ tokenStream, symbolTable });
    }

    matchAndMove(factors, tokenStream);
    return node(nodeTypes.Term, tokenStream.prev().text, null);
  }
};

export default expressionRules;
