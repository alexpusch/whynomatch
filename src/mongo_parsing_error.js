class MongoParsingError extends Error{
  constructor(operator, expected, recived){
    let message = `${operator} operator must recieve a ${expected}. Got: ${recived}`;
    super(message);
    this.name = this.constructor.name;
    this.message = message; 
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = MongoParsingError;