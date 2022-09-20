import { createKeyValueEnum } from "../helpers";

export const tokens = createKeyValueEnum([
  "EndOfFile",
  "Error",
  "WhiteSpace",
  "Comment",
  "NewLine",
  "SoftNewLine",
  "Number",
  "String",
  "Add",
  "Subtract",
  "Divide",
  "Multiply",
  "OpenParen",
  "CloseParen",
  "Equals",
  "GreaterThan",
  "GreaterThanEqualTo",
  "LessThan",
  "LessThanEqualTo",
  "Print",
  "Call",
  "Variable",
  "Dim",
  "Function",
  "Return",
  "EndFunction",
  "Comma",
  "BoolTrue",
  "BoolFalse",
  "And",
  "Or",
  "Not",
  "If",
  "EndIf",
  "While",
  "EndWhile",
  "Do",
  "Until",
  "For",
  "Next",
  "To",
  "In"
]);

tokens.WhiteSpace.stripped = true;
tokens.Comment.stripped = true;

export default tokens;
