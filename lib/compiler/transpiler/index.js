import nodeTypes from "../tree/nodeTypes";
import symbolRules from "./symbolRules";
import transpilerRules from "./transpilerRules";

export const transpiler = {
  transpile: (tree, symbols) => {
    let output = `${symbolRules(symbols, "")}`;
    return `${output}${transpilerRules[tree.type](tree, symbols)}`;
  }
};

export default transpiler;
