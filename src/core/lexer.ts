export class CommandLexer {
  private input: string;
  private position: number = 0;
  private tokens: string[] = [];

  constructor(input: string) {
    this.input = input.trim();
  }

  tokenize(): string[] {
    this.tokens = [];
    this.position = 0;

    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      if (this.position >= this.input.length) break;

      if (this.current() === '"' || this.current() === "'") {
        this.readQuotedString();
      } else {
        this.readWord();
      }
    }

    return this.tokens;
  }

  private current(): string {
    return this.input[this.position];
  }

  private advance(): void {
    this.position++;
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length && /\s/.test(this.current())) {
      this.advance();
    }
  }

  private readWord(): void {
    let word = '';
    while (this.position < this.input.length && !/\s/.test(this.current())) {
      word += this.current();
      this.advance();
    }
    if (word) this.tokens.push(word);
  }

  private readQuotedString(): void {
    const quote = this.current();
    this.advance(); // Skip opening quote
    
    let str = '';
    while (this.position < this.input.length && this.current() !== quote) {
      str += this.current();
      this.advance();
    }
    
    if (this.position < this.input.length) {
      this.advance(); // Skip closing quote
    }
    
    this.tokens.push(str);
  }
}