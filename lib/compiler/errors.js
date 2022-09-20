export class CompilationError extends Error {
  constructor(message, line, col, filename) {
    super(`${message} at ${line}:${col} in ${filename}`);
    this.name = "CompilatonError";
    this.line = line;
    this.col = col;
  }
}
