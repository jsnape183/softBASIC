import tokens from "../tokens";
import node from "../tree";
import nodeTypes from "../tree/nodeTypes";
import expressionRules from "./expressionRules";
import { matchAndMove, check } from "./rulesHelpers";

const booleans = [tokens.BoolTrue, tokens.BoolFalse];
const relOps = [
  tokens.Equals,
  tokens.GreaterThan,
  tokens.GreaterThanEqualTo,
  tokens.LessThan,
  tokens.LessThanEqualTo
];

export const boolExpressionRules = {
  ...expressionRules,
  BoolExpression: ({ tokenStream, symbolTable }) => {
    let term = boolExpressionRules.Not({ tokenStream, symbolTable });
    //console.log({ ...term });
    while (check([tokens.And, tokens.Or], tokenStream.current())) {
      switch (tokenStream.current().token) {
        case tokens.And:
          term = boolExpressionRules.And(term, { tokenStream, symbolTable });
          break;
        case tokens.Or:
          term = boolExpressionRules.Or(term, { tokenStream, symbolTable });
          break;
        default:
          //console.log("defaulting");
          return term;
      }
    }
    return term;
  },
  ArrayList: ({ tokenStream, symbolTable }) => {
    let expr = [boolExpressionRules.Expression({ tokenStream, symbolTable })];
    while (check(tokens.Comma, tokenStream.current())) {
      matchAndMove(tokens.Comma, tokenStream);
      expr.push(boolExpressionRules.Expression({ tokenStream, symbolTable }));
    }
    return node(nodeTypes.ArrayList, null, expr);
  },
  ExpressionList: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.OpenParen, tokenStream);
    if (check(tokens.CloseParen, tokenStream.current())) {
      matchAndMove(tokens.CloseParen, tokenStream);
      return node(nodeTypes.ExpressionList, null, null);
    }
    let expr = [boolExpressionRules.Expression({ tokenStream, symbolTable })];
    while (check(tokens.Comma, tokenStream.current())) {
      matchAndMove(tokens.Comma, tokenStream);
      expr.push(boolExpressionRules.Expression({ tokenStream, symbolTable }));
    }
    matchAndMove(tokens.CloseParen, tokenStream);
    return node(nodeTypes.ExpressionList, null, expr);
  },
  Or: (term, { tokenStream, symbolTable }) => {
    matchAndMove(tokens.Or, tokenStream);
    return node(nodeTypes.Or, null, [
      term,
      boolExpressionRules.BoolTerm({ tokenStream, symbolTable })
    ]);
  },
  And: (term, { tokenStream, symbolTable }) => {
    matchAndMove(tokens.And, tokenStream);
    return node(nodeTypes.And, null, [
      term,
      boolExpressionRules.BoolTerm({ tokenStream, symbolTable })
    ]);
  },
  Not: ({ tokenStream, symbolTable }) => {
    if (check(tokens.Not, tokenStream.current())) {
      matchAndMove(tokens.Not, tokenStream);
      return node(
        nodeTypes.Not,
        null,
        boolExpressionRules.BoolFactor({ tokenStream, symbolTable })
      );
    }

    return boolExpressionRules.BoolTerm({ tokenStream, symbolTable });
  },
  BoolTerm: ({ tokenStream, symbolTable }) => {
    return boolExpressionRules.BoolFactor({ tokenStream, symbolTable });
  },
  BoolFactor: ({ tokenStream, symbolTable }) => {
    if (check(booleans, tokenStream.current())) {
      matchAndMove(booleans, tokenStream);
      return node(nodeTypes.Term, tokenStream.prev().text, null);
    }
    return boolExpressionRules.Relation({ tokenStream, symbolTable });
  },
  Relation: ({ tokenStream, symbolTable }) => {
    const left = expressionRules.Expression({ tokenStream, symbolTable });
    if (!check(relOps, tokenStream.current())) return left;

    matchAndMove(relOps, tokenStream);
    return node(nodeTypes.Relation, tokenStream.prev().text, [
      left,
      expressionRules.Expression({ tokenStream, symbolTable })
    ]);
  }
};

export default boolExpressionRules;
