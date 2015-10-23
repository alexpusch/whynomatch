function whynomatch(target, query){
  let results = [];
  Object.keys(query).forEach(function(key){
    let value = query[key];

    if(value instanceof Object){
      let fieldResults = whynomatch(target[key], query[key]);
      for(let i in fieldResults){
        let result = fieldResults[i];
        results.push({[key]: result});
      }
    } else {
      if(target[key] != value)
        results.push({[key]: value});
    }
  })

  return results;
}

module.exports = whynomatch