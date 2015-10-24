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

    if(target instanceof Array){
      return _.intersection(target, value).length > 0
    } else{     
      return value.indexOf(target) >= 0;
    }
  },
  $nin(target, value){
    return !operators["$in"](target, value);
  }
}

function whynomatch(target, query){
  let results = [];
  Object.keys(query).forEach(function(key){
    let value = query[key];
    if(value instanceof Object && !(value instanceof Array)){
      let fieldResults = whynomatch(target[key], query[key]);
      for(let i in fieldResults){
        let result = fieldResults[i];
        addToResults(results, key, result);
      }
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
  results.push({[key]: value})
}

module.exports = whynomatch