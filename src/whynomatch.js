import _ from "lodash"

let operators = {
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
    return !operators["$in"](target, value);
  }
}

function whynomatch(target, query){
  let results = [];
  
  _.keys(query).forEach(function(key){
    let value = query[key];

    if(_.isObject(value) && !_.isArray(value)){
      let fieldResults = whynomatch(target[key], query[key]);
      _.each(fieldResults, _.partial(addToResults, results, key));
    } else {
      if(key in operators){
        if(!operators[key](target, value)){
          addToResults(results, key, value);
        }
      } else if(target[key] != value){
        addToResults(results, key, value);
      }
    }
  })

  return results;
}

function addToResults(results, key, value){
  results.push(createResult(key, value));
}

function createResult(key, value){
  return { [key]: value };
}
module.exports = whynomatch