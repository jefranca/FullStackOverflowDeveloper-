class InvalidToken extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'InvalidToken';
    }
  }
  
  export default InvalidToken;