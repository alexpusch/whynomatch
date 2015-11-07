import JSON5 from "json5" 

let regexRegex = /(\/(.+?)\/([gimy]*))/g

function parse(str){
  str = _endcodeRegex(str);
  let parsedStr = JSON5.parse(str, _decodeRegex);
  return parsedStr;
}

function stringify(obj){
  return JSON5.stringify(obj, _stringifyRegex, 2);
}

function _endcodeRegex(value){
  return value.replace(regexRegex, "\"$1\"");
}

function _decodeRegex(key, value){
  if(key == '')
    return value;

  let match;
  if(value.match && (match = regexRegex.exec(value)) ){
    let regexContent = match[2];
    let modifiers = match[3];
    return new RegExp(regexContent, modifiers);
  } else{
    return value;
  }
}

function _stringifyRegex(key, value){
  if(_.isRegExp(value)){
    return value.toString();
  } else{
    return value;
  }
}

export default {parse, stringify}