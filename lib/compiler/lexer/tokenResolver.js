import tokens from "../tokens";
import {
  matchChar,
  matchAll,
  matchString,
  matchPattern
} from "./resolverHelpers";

export const tokenResolver = [
  {
    isMatch: (input) => ({
      match: false,
      token: tokens.Error
    })
  },
  {
    isMatch: (input) => ({
      ...matchAll(input, " "),
      token: tokens.WhiteSpace
    })
  },
  {
    isMatch: (input) => ({
      ...matchAll(input, "\n"),
      token: tokens.NewLine
    })
  },
  {
    isMatch: (input) => ({
      ...matchAll(input, ":"),
      token: tokens.SoftNewLine
    })
  },
  {
    isMatch: (input) => ({
      ...matchPattern(input, /^[+-]?([0-9]*[.])?[0-9]+/i),
      token: tokens.Number
    })
  },
  {
    isMatch: (input) => ({
      ...matchChar(input, "+"),
      token: tokens.Add
    })
  },
  {
    isMatch: (input) => ({
      ...matchChar(input, "-"),
      token: tokens.Subtract
    })
  },
  {
    isMatch: (input) => ({
      ...matchChar(input, "*"),
      token: tokens.Multiply
    })
  },
  {
    isMatch: (input) => ({
      ...matchChar(input, "/"),
      token: tokens.Divide
    })
  },
  {
    isMatch: (input) => ({
      ...matchChar(input, "("),
      token: tokens.OpenParen
    })
  },
  {
    isMatch: (input) => ({
      ...matchChar(input, ")"),
      token: tokens.CloseParen
    })
  },
  {
    isMatch: (input) => ({
      ...matchChar(input, "="),
      token: tokens.Equals
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, ">="),
      token: tokens.GreaterThanEqualTo
    })
  },
  {
    isMatch: (input) => ({
      ...matchChar(input, ">"),
      token: tokens.GreaterThan
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "<="),
      token: tokens.LessThanEqualTo
    })
  },
  {
    isMatch: (input) => ({
      ...matchChar(input, "<"),
      token: tokens.LessThan
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "print"),
      token: tokens.Print
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "call"),
      token: tokens.Call
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "dim"),
      token: tokens.Dim
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "function"),
      token: tokens.Function
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "return"),
      token: tokens.Return
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "endfunction"),
      token: tokens.EndFunction
    })
  },
  {
    isMatch: (input) => ({
      ...matchChar(input, ","),
      token: tokens.Comma
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "true"),
      token: tokens.BoolTrue
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "and"),
      token: tokens.And
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "or"),
      token: tokens.Or
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "not"),
      token: tokens.Not
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "if"),
      token: tokens.If
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "endif"),
      token: tokens.EndIf
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "while"),
      token: tokens.While
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "endwhile"),
      token: tokens.EndWhile
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "for"),
      token: tokens.For
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "next"),
      token: tokens.Next
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "in"),
      token: tokens.In
    })
  },
  {
    isMatch: (input) => ({
      ...matchString(input, "to"),
      token: tokens.To
    })
  },
  {
    isMatch: (input) => ({
      ...matchPattern(input, /^'.*/),
      token: tokens.Comment
    })
  },
  {
    isMatch: (input) => ({
      ...matchPattern(input, /^"(.*?)"/),
      token: tokens.String
    })
  },
  {
    isMatch: (input) => ({
      ...matchPattern(input, /[A-Za-z][A-Za-z_$0-9]*/),
      token: tokens.Variable
    })
  }
];

export default { tokenResolver, newLineToken: tokens.NewLine };
