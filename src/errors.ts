export class ParseError extends Error {
  constructor(message: string, public suggestions: string[] = []) {
    super(message)
  }
}
