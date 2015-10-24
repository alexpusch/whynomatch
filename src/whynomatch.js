import _ from "lodash"

let comparisionOperators = {
  $eq(target, value){
    return target === value;
  },
  $gt(target, value){
    return target > value;
  },
  $gte(target, value){
    return target >= value;
  },
  $lt(target, value){
    return target < value;
  },
  $lte(target, value){
    return target <= value;
  },
  $ne(target, value){
    return target !== value;
  },
  $in(target, value){
    if(_.isArray(target)){
      return _.intersection(target, value).length > 0
    } else{     
      return _.includes(value, target);
    }
  },
  $nin(target, value){
    return !comparisionOperators["$in"](target, value);
  }
}

let virtualOperators = {
  $simpleEq(target, value, key){
    if(target[key] !== value)
      return value;
  },
  $nested(target, value, key){
    return whynomatch(target[key], value);
  }
}

let operators = _.extend(
  virtualOperators, 
  wrapComperisionOperators(comparisionOperators));

function whynomatch(target, query){
  
  let noMatch = {};

  _.keys(query).forEach(function(key){
    let value = query[key];

    let operator = getOperator(key, value);
    let operatorResults = operator(target, value, key);

    if(!isEmpty(operatorResults))
      noMatch[key] = operatorResults;
  });
  
  return noMatch;
}

function wrapComperisionOperators(operators){
  return _.transform(operators, function(result, operatorFn, operatorName){
    let wrapedOperator = function(target, value, key){
      if(!operatorFn(target, value, key))
        return value;

      return {};
    }

    result[operatorName] = wrapedOperator;
  });
}

function getOperator(key, value){
  let operatorName;

  if(key in operators)
    operatorName = key
  else if (!_.isObject(value))
    operatorName = "$simpleEq";
  else
    operatorName = "$nested";  

  return operators[operatorName];
}

function isEmpty(value){
  return value == undefined || _.isEqual(value, {});
}

module.exports = whynomatch