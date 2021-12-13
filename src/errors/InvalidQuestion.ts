class InvalidQuestion extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'InvalidQuestion';
    }
  }
  
  export default InvalidQuestion;