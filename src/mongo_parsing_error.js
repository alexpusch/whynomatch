class MongoParsingError extends Error{
  constructor(operator, expected, value){
    super(`${key} operator must recieve a ${expected}. Got: ${recived}`);
  }
}

module.exports = MongoParsingError;