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
  },
  $exists(target, value){
    return (target !== undefined) == value;
  },
  $mod(target, value){
    if(!_.isArray(value) || value.length !== 2)
      throw new Error(`$mod operator must recieve an array of size 2: [divisor, reminder]. Got: ${value}`);

    let divisor = value[0];
    let reminder = value[1];

    return target % divisor === reminder;
  },
  $regex(target, value){
    if(!_.isString(value) && !_.isRegExp(value))
      throw new Error(`$regex operator must recieve a RegExp or a string. got: ${value}`)

    return new RegExp(value).test(target);
  },
  $where(target, value){
    let fn;

    if(_.isFunction(value)){
      fn = value;
    }
    else if(_.isString(value)){
      eval(`fn = function(){var obj = this; return ${value}}`)
    } else{
      throw new Error(`$where operator must recieve a function or a string. Got: ${value}`)
    }
    
    return fn.call(target);
  },
  $all(target, value){
    if(!_.isArray(value))
      throw new Error(`$all operator must recieve an array. Got: ${value}`)
    if(!_.isArray(target)){
      target = [target];
    }
    return _(value).difference(target).isEmpty();
  }
}

let logicalOperators = {
  $not(target, value, key){
    let result = whynomatch(target, value);
    if(_.isEmpty(result))
      return value;
    else
      return {};
  },
  $or(target, value, key){
    let subQueriesResults = multiOperator(target, value, key);

    if(subQueriesResults.length === value.length)
      return value;

    return {};
  },
  $nor(target, value, key){
    let subQueriesResults = multiOperator(target, value, key);

    if(subQueriesResults.length !== value.length)
      return value;

    return {};
  },
  $and(target, value, key){
    let subQueriesResults = multiOperator(target, value, key);

    if(subQueriesResults.length > 0)
      return subQueriesResults;

    return {};
  }
}

function multiOperator(target, subQueries, key){
  if(!_.isArray(subQueries) || subQueries.length === 0)
      throw new Error(`${key} operator expectes an Array. Got: ${subQueries}`);

  let subQueriesResults = _(subQueries)
    .map(_.partial(whynomatch, target))
    .reject(_.partial(_.isEqual, {})).value();

  return subQueriesResults;
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
  logicalOperators, 
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