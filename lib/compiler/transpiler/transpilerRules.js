import nodeTypes from "../tree/nodeTypes";
import symbolRules from "./symbolRules";

const doChild = (rules, node, index) =>
  rules[node.children[index].type](node.children[index]);

const concatChildren = (rules, node, join = "") =>
  node.children.map((c) => rules[c.type](c)).join(join);

export const transpilerRules = {
  [nodeTypes.Root]: (node, table) => {
    let output = "";
    node.children.forEach((n) => {
      //console.log(n);
      output = `${output}${transpilerRules[n.type](n, table)}
      `;
    });
    return output;
  },
  [nodeTypes.Print]: (node) => {
    const value = doChild(transpilerRules, node, 0);
    return `console.log(${value});`;
  },
  [nodeTypes.Call]: (node) => {
    const child = doChild(transpilerRules, node, 0);
    return child.substring(1, child.length - 1);
  },

  [nodeTypes.CallTerm]: (node) => `eval(${doChild(transpilerRules, node, 0)})`,
  [nodeTypes.Expression]: (node) => doChild(transpilerRules, node, 0),
  [nodeTypes.Add]: (node) => {
    const left = doChild(transpilerRules, node, 0);
    const right = doChild(transpilerRules, node, 1);
    return `${left}+${right}`;
  },
  [nodeTypes.Subtract]: (node) => {
    const left = doChild(transpilerRules, node, 0);
    const right = doChild(transpilerRules, node, 1);
    return `${left}-${right}`;
  },
  [nodeTypes.UMinus]: (node) => {
    const value = doChild(transpilerRules, node, 0);
    return `-${value}`;
  },
  [nodeTypes.Multiply]: (node) => {
    const left = doChild(transpilerRules, node, 0);
    const right = doChild(transpilerRules, node, 1);
    return `${left}*${right}`;
  },
  [nodeTypes.Divide]: (node) => {
    const left = doChild(transpilerRules, node, 0);
    const right = doChild(transpilerRules, node, 1);
    return `${left}/${right}`;
  },
  [nodeTypes.Paren]: (node) => `(${doChild(transpilerRules, node, 0)})`,
  [nodeTypes.Term]: (node) => node.data,
  [nodeTypes.Dim]: (node) =>
    `let ${node.data} = createArray([${doChild(transpilerRules, node, 0)}]);`,
  [nodeTypes.VariableList]: (node) =>
    `${concatChildren(transpilerRules, node, ",")}`,
  [nodeTypes.FunctionDecl]: (node, table) =>
    `const ${node.data} = (${doChild(transpilerRules, node, 0)})=>{
      ${symbolRules(table, node.data)}
      ${doChild(transpilerRules, node, 1)}};`,
  [nodeTypes.FunctionCall]: (node) =>
    `${node.data}(${doChild(transpilerRules, node, 0)});`,
  [nodeTypes.FunctionTerm]: (node) =>
    `${node.data}(${doChild(transpilerRules, node, 0)})`,
  [nodeTypes.FunctionReturn]: (node) =>
    `return ${doChild(transpilerRules, node, 0)};`,
  [nodeTypes.ArrayLookup]: (node) =>
    `${node.data}[${doChild(transpilerRules, node, 0)}]`,
  [nodeTypes.ExpressionList]: (node) =>
    concatChildren(transpilerRules, node, ","),
  [nodeTypes.ArrayList]: (node) => concatChildren(transpilerRules, node, "]["),
  [nodeTypes.Assign]: (node) =>
    `${node.data} = ${doChild(transpilerRules, node, 0)};`,
  [nodeTypes.ArrayAssign]: (node) =>
    `${node.data}[${doChild(transpilerRules, node, 0)}]=${doChild(
      transpilerRules,
      node,
      1
    )};`,
  [nodeTypes.And]: (node) =>
    `${doChild(transpilerRules, node, 0)}&&${doChild(
      transpilerRules,
      node,
      1
    )}`,
  [nodeTypes.Or]: (node) =>
    `${doChild(transpilerRules, node, 0)}||${doChild(
      transpilerRules,
      node,
      1
    )}`,
  [nodeTypes.Not]: (node) => `!${doChild(transpilerRules, node, 0)}`,
  [nodeTypes.Relation]: (node) =>
    `${doChild(transpilerRules, node, 0)}${
      node.data === "=" ? "==" : node.data
    }${doChild(transpilerRules, node, 1)}`,
  [nodeTypes.While]: (node) =>
    `while(${doChild(transpilerRules, node, 0)}){${doChild(
      transpilerRules,
      node,
      1
    )}}`,
  [nodeTypes.If]: (node) =>
    `if(${doChild(transpilerRules, node, 0)}){${doChild(
      transpilerRules,
      node,
      1
    )}}`,
  [nodeTypes.For]: (node) =>
    `for(${doChild(transpilerRules, node, 0)}){${doChild(
      transpilerRules,
      node,
      1
    )}}`,
  [nodeTypes.To]: (node) =>
    `${node.data} = ${doChild(transpilerRules, node, 0)}; ${
      node.data
    } <= ${doChild(transpilerRules, node, 1)}; ${node.data}++`,
  [nodeTypes.In]: (node) => `${node.data.var} of ${node.data.iterator}`
};

export default transpilerRules;
