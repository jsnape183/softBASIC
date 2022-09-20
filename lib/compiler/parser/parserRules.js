import tokens from "../tokens";
import node from "../tree";
import nodeTypes from "../tree/nodeTypes";
import { check, matchAndMove } from "./rulesHelpers";
import boolExpressionRules from "./boolExpressionRules";

const newLines = [tokens.NewLine, tokens.EndOfFile, tokens.SoftNewLine];

export const parserRules = {
  Root: ({ tokenStream, symbolTable }) => {
    const children = [];
    while (!check(tokens.EndOfFile, tokenStream.current())) {
      //for (let i = 0; i < 2; i++) {
      //console.log(tokenStream.current().token.name);
      const child = parserRules[tokenStream.current().token.name]({
        tokenStream,
        symbolTable
      });

      if (!child) continue;
      children.push(child);
    }
    return node(nodeTypes.Root, null, children);
  },
  Block: (endTokens, { tokenStream, symbolTable }) => {
    const children = [];
    while (!check(endTokens, tokenStream.current())) {
      const child = parserRules[tokenStream.current().token.name]({
        tokenStream,
        symbolTable
      });
      if (!child) continue;
      children.push(child);
    }
    return node(nodeTypes.Root, null, children);
  },
  NewLine: ({ tokenStream }) => matchAndMove(tokens.NewLine, tokenStream),
  Print: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.Print, tokenStream);
    const printNode = node(
      nodeTypes.Print,
      null,
      parserRules.BoolExpression({ tokenStream, symbolTable })
    );
    matchAndMove(newLines, tokenStream);
    return printNode;
  },
  VariableList: ({ tokenStream, symbolTable }) => {
    const list = [];
    while (check(tokens.Variable, tokenStream.current())) {
      matchAndMove(tokens.Variable, tokenStream);
      symbolTable.add(tokenStream.prev().text, "Parameter");
      list.push(
        node(nodeTypes.Term, tokenStream.prev().text.toLowerCase(), null)
      );
      if (!check(tokens.Comma, tokenStream.current())) break;
      matchAndMove(tokens.Comma, tokenStream);
    }

    return node(nodeTypes.VariableList, null, list);
  },
  Function: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.Function, tokenStream);
    matchAndMove(tokens.Variable, tokenStream);
    const name = tokenStream.prev().text.toLowerCase();
    symbolTable.add(name, "Function");
    matchAndMove(tokens.OpenParen, tokenStream);
    symbolTable.setScope(name);
    const variables = parserRules.VariableList({ tokenStream, symbolTable });
    matchAndMove(tokens.CloseParen, tokenStream);
    matchAndMove(newLines, tokenStream);
    const children = parserRules.Block(tokens.EndFunction, {
      tokenStream,
      symbolTable
    });
    matchAndMove(tokens.EndFunction, tokenStream);
    symbolTable.setScope("");
    matchAndMove(newLines, tokenStream);
    return node(nodeTypes.FunctionDecl, name, [
      variables,
      node(nodeTypes.Root, null, children)
    ]);
  },
  Call: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.Call, tokenStream);
    matchAndMove(tokens.OpenParen, tokenStream);
    const expr = boolExpressionRules.BoolExpression({
      tokenStream,
      symbolTable
    });
    matchAndMove(tokens.CloseParen, tokenStream);
    matchAndMove(newLines, tokenStream);
    return node(nodeTypes.Call, null, expr);
  },
  FunctionCall: ({ tokenStream, symbolTable }, name) => {
    const expressions = boolExpressionRules.ExpressionList({
      tokenStream,
      symbolTable
    });
    matchAndMove(newLines, tokenStream);
    return node(nodeTypes.FunctionCall, name, expressions);
  },
  Return: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.Return, tokenStream);
    const expr = boolExpressionRules.BoolExpression({
      tokenStream,
      symbolTable
    });
    matchAndMove(newLines, tokenStream);
    return node(nodeTypes.FunctionReturn, null, expr);
  },
  Variable: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.Variable, tokenStream);
    const name = tokenStream.prev().text.toLowerCase();
    if (symbolTable.check(name, "Function")) {
      return parserRules.FunctionCall(
        { tokenStream, symbolTable },
        symbolTable.get(name, "Function").name
      );
    }
    if (symbolTable.check(name, "Array")) {
      const dims = boolExpressionRules.ExpressionList({
        tokenStream,
        symbolTable
      });
      matchAndMove(tokens.Equals, tokenStream);
      const expr = parserRules.BoolExpression({ tokenStream, symbolTable });
      matchAndMove(newLines, tokenStream);
      return node(nodeTypes.ArrayAssign, symbolTable.get(name, "Array").name, [
        dims,
        expr
      ]);
    }
    symbolTable.add(name);
    matchAndMove(tokens.Equals, tokenStream);
    const expr = parserRules.BoolExpression({ tokenStream, symbolTable });
    matchAndMove(newLines, tokenStream);
    return node(nodeTypes.Assign, symbolTable.get(name).name, expr);
  },
  Dim: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.Dim, tokenStream);
    matchAndMove(tokens.Variable, tokenStream);
    const name = tokenStream.prev().text.toLowerCase();
    symbolTable.add(name, "Array");
    const dims = boolExpressionRules.ExpressionList({
      tokenStream,
      symbolTable
    });
    matchAndMove(newLines, tokenStream);

    return node(nodeTypes.Dim, name, dims);
  },
  While: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.While, tokenStream);
    const expr = boolExpressionRules.BoolExpression({
      tokenStream,
      symbolTable
    });
    matchAndMove(newLines, tokenStream);
    const block = parserRules.Block(tokens.EndWhile, {
      tokenStream,
      symbolTable
    });
    matchAndMove(tokens.EndWhile, tokenStream);
    matchAndMove(newLines, tokenStream);

    return node(nodeTypes.While, null, [expr, block]);
  },
  If: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.If, tokenStream);
    const expr = boolExpressionRules.BoolExpression({
      tokenStream,
      symbolTable
    });
    matchAndMove(newLines, tokenStream);
    const block = parserRules.Block(tokens.EndIf, {
      tokenStream,
      symbolTable
    });
    matchAndMove(tokens.EndIf, tokenStream);
    matchAndMove(newLines, tokenStream);

    return node(nodeTypes.If, null, [expr, block]);
  },
  For: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.For, tokenStream);
    const expr = parserRules.ForExpression({
      tokenStream,
      symbolTable
    });
    matchAndMove(newLines, tokenStream);
    const block = parserRules.Block(tokens.Next, {
      tokenStream,
      symbolTable
    });
    matchAndMove(tokens.Next, tokenStream);
    matchAndMove(newLines, tokenStream);

    return node(nodeTypes.For, null, [expr, block]);
  },
  ForExpression: ({ tokenStream, symbolTable }) => {
    matchAndMove(tokens.Variable, tokenStream);
    const name = tokenStream.prev().text.toLowerCase();
    symbolTable.add(name);
    if (check(tokens.In, tokenStream.current())) {
      matchAndMove(tokens.In, tokenStream);
      matchAndMove(tokens.Variable, tokenStream);
      const iterator = tokenStream.prev().text;
      return node(nodeTypes.In, { var: name, iterator }, []);
    }
    matchAndMove(tokens.Equals, tokenStream);
    const startExpr = boolExpressionRules.BoolExpression({
      tokenStream,
      symbolTable
    });
    matchAndMove(tokens.To, tokenStream);
    const endExpr = boolExpressionRules.BoolExpression({
      tokenStream,
      symbolTable
    });
    return node(nodeTypes.To, name, [startExpr, endExpr]);
  },
  ...boolExpressionRules
};

export default parserRules;
