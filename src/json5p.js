import JSON5 from "json5" 

let regexRegex = /(\/(.+?)\/([gimy]*))/g

let objectIdRegex = /ObjectId\([\'\"](\w{24})[\'\"]\)/;

let isoDateRegexBase = "(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2}(?:\\.\\d*)?)(?:Z|(\\+|-)([\\d|:]*))?"
let isoDateRegex = new RegExp(`ISODate\\([\\'\\"](${isoDateRegexBase})[\\'\\"]\\)`)

function parse(str){
  str = _encode(str);
  let parsedStr = JSON5.parse(str, _decodeRegex);
  return parsedStr;
}

function stringify(obj){
  return JSON5.stringify(obj, _stringifyRegex, 2);
}

function _encode(value){
  value = _endcodeRegex(value);
  value = _encodeObjectId(value);
  value = _encodeIsoDate(value);
  return value;
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

function _encodeObjectId(value){
  return value.replace(objectIdRegex, "\"ObjectId(\'$1\')\""); 
}

function _encodeIsoDate(value){
  return value.replace(isoDateRegex, "\"ISODate(\'$1\')\""); 
}

function _stringifyRegex(key, value){
  if(_.isRegExp(value)){
    return value.toString();
  } else{
    return value;
  }
}

export default {parse, stringify}