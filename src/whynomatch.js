import _ from "lodash"
import MongoParsingError from "./mongo_parsing_error"
import deepEqual from "deep-equal"

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
  $exists(target, value){
    return (target !== undefined) == value;
  },
  $mod(target, value){
    if(!_.isArray(value) || value.length !== 2)
      throw new MongoParsingError('mod', 'array of size 2: [dividor, reminder]', value);

    let divisor = value[0];
    let reminder = value[1];

    return target % divisor === reminder;
  },
  $regex(target, value){
    if(!_.isString(value) && !_.isRegExp(value))
      throw new MongoParsingError('regex', 'RegExp or a string', value);

    return new RegExp(value).test(target);
  },
  $shortEq(target, value, key){
    if(_.isRegExp(value)){
      return value.test(target)
    } else {
      return deepEqual(value, target, {strictOrder: true});
    }
  }
}

let arrayOperators = {
  $in(target, value){
    if(!_.isArray(value))
      throw new MongoParsingError('in', 'array', value);

    if(!_.isArray(target)){
      target = [target];
    } 

    let match = comparisionOperators.$shortEq
    
    for(let i in target){
      let curTarget = target[i];
      for(let j in value){
        let curValue = value[j];

        if(match(curTarget, curValue)){
          return true;
        }
      }
    }

    return false;
  },
  $nin(target, value){
    return !arrayOperators["$in"](target, value);
  },
  $all(target, value){
    if(!_.isArray(value))
      throw new MongoParsingError('$all', 'Array', value);
    if(!_.isArray(target)){
      target = [target];
    }
    return _(value).difference(target).isEmpty();
  },
  $size(target, value){
    if(!_.isNumber(value))
      throw new MongoParsingError('size', 'number', value);
    if(!_.isArray(target))
      return false;

    return target.length === value;
  }
}

let lowLevelOperators = _.extend(
  wrapComperisionOperators(comparisionOperators, true),
  wrapComperisionOperators(arrayOperators),

  {
    $not(target, value, key){
      let result = lowLevelWhynomatch(target, value);
      if(_.isEmpty(result))
        return value;
      else
        return {};
    }, 
    $elemMatch(target, value, key){
      if(!_.isPlainObject(value))
        throw new MongoParsingError('elemMatch', 'object', value);
  
      if(!_.isArray(target))
        return value;
  
      let subQueriesResults = _(target)
        .map(_.partial(elemMatchLevelWhynomatch, _, value))
        .reject(_.partial(_.isEqual, {})).value();
  
  
      if(subQueriesResults.length === target.length){
        return value;
      }
          
      return {};
  }}
);

let topLevelOperators = {
  $or(target, value, key){
    let subQueriesResults = multiOperator(target, value, key);

    if(subQueriesResults.length === value.length)
      return value;

    return {};
  },
  $and(target, value, key){
    let subQueriesResults = multiOperator(target, value, key);

    if(subQueriesResults.length > 0)
      return subQueriesResults;

    return {};
  },
  $nor(target, value, key){
    let subQueriesResults = multiOperator(target, value, key);

    if(subQueriesResults.length !== value.length)
      return value;

    return {};
  },
  $where(target, value){
    let fn;

    if(_.isFunction(value)){
      fn = value;
    }
    else if(_.isString(value)){
      eval(`fn = function(){var obj = this; return ${value}}`)
    } else{
      throw new MongoParsingError('where', 'function or a string', value);
    }
    
    if(!fn.call(target))
      return value;
  }
}

function whynomatch(target, query){
  return topLevelWhynomatch(target, query);
}

function topLevelWhynomatch(target, query){
  let noMatch = {};

  _.keys(query).forEach(function(key){
    validateOperator(key, isTopLevelOperator);
    
    let value = query[key];
    let results

    if(isTopLevelOperator(key)){
      let operator = getTopLevelOperator(key, value);
      results = operator(target, value, key);
    } else {
      let nestedTarget = _.property(key)(target);
      results = lowLevelWhynomatch(nestedTarget, value);
    }

    if(!isEmpty(results))
      noMatch[key] = results;
  });

  return noMatch;
}

function lowLevelWhynomatch(target, query){
  let noMatch = {};

  if(!isMongoExpression(query)){
    noMatch = lowLevelOperators.$shortEq(target, query)
    return noMatch;
  }

  _.keys(query).forEach(function(key){
    validateOperator(key, isLowLevelOperator);

    let value = query[key];

    let operator = getLowLevelOperator(key, value);
    let operatorResults = operator(target, value, key);
    
    if(!isEmpty(operatorResults))
      noMatch[key] = operatorResults;
  });

  return noMatch;
}

function elemMatchLevelWhynomatch(target, query){
  let noMatch = {};

  _.keys(query).forEach(function(key){
    validateOperator(key, function(key){
      return key !== "$where" && (isLowLevelOperator(key) || isTopLevelOperator(key));
    });

    let value = query[key];
    let results

    if(isTopLevelOperator(key)){
      let operator = getTopLevelOperator(key, value);
      results = operator(target, value, key);
    } else if(isLowLevelOperator(key)) {
      let operator = getLowLevelOperator(key, value);
      results = operator(target, value, key);
    } else {
      let nestedTarget = _.property(key)(target);
      results = lowLevelWhynomatch(nestedTarget, value);
    }

    if(!isEmpty(results))
      noMatch[key] = results;
  });

  return noMatch;
}

function isMongoExpression(query){
  return !isPrimitive(query) && _(query).keys().all(looksLikeOperator);
}

function isPrimitive(query){
  return _.isString(query) ||
    _.isNumber(query) ||
    _.isDate(query) ||
    _.isArray(query) ||
    _.isBoolean(query) ||
    _.isRegExp(query);
}

function getTopLevelOperator(key, value){
  return topLevelOperators[key];
} 

function getLowLevelOperator(key, value){
  return lowLevelOperators[key];
}

function isTopLevelOperator(operator){
  return operator in topLevelOperators;
}

function isLowLevelOperator(operator){
  return operator in lowLevelOperators;
}

function validateOperator(key, checkFn){
  if(looksLikeOperator(key) && !checkFn(key)){
    throw new Error(`${key} is not a legal operator at this location`)
  }
}

function looksLikeOperator(key){
  return /^\$.+/.test(key);
}

function isEmpty(value){
  return value == undefined || _.isEqual(value, {});
}

function multiOperator(target, subQueries, key){
  if(!_.isArray(subQueries) || subQueries.length === 0)
    throw new MongoParsingError(key, 'Array', subQueries);

  let subQueriesResults = _(subQueries)
    .map(_.partial(topLevelWhynomatch, target))
    .reject(_.partial(_.isEqual, {})).value();

  return subQueriesResults;
}

function wrapComperisionOperators(operators, arrayEquality = false){
  return _.transform(operators, function(result, operatorFn, operatorName){
    let wrapedOperator = wrapComperisionOperator(operatorFn, arrayEquality);
    result[operatorName] = wrapedOperator;
  });
}

function wrapComperisionOperator(operatorFn, arrayEquality){
  return function(target, value, key){
    if(arrayEquality && _.isArray(target)){
      if(!_.some(target, _.partial(operatorFn, _, value, key)))
        return value;

      return {};
    } else if(!operatorFn(target, value, key)){
      return value;
    }

    return {};
  };
}

export default whynomatch;