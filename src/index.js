// require('../node_modules/codemirror/theme/elegant.css')
require('../node_modules/codemirror/theme/ambiance.css')
require('../node_modules/codemirror/lib/codemirror.css')
require('./style.sass')

import CodeMirror from '../node_modules/codemirror/lib/codemirror.js'
import {} from '../node_modules/codemirror/mode/javascript/javascript.js'
import JSON5P from "./json5p"
import whynomatch from 'whynomatch'
import $ from 'jquery'

$(function(){
  let objectEditor = createEditor('.object', {value: getDefaultTarget()});
  let queryEditor = createEditor('.query', {value: getDefaultQuery()});
  let outputEditor = createEditor('.output', {readonly: true});

  update(objectEditor, queryEditor, outputEditor);
  addFirstComment(outputEditor);

  objectEditor.on('change', function(){
    update(objectEditor, queryEditor, outputEditor);
  })

  queryEditor.on('change', function(){
    update(objectEditor, queryEditor, outputEditor);
  })
})

function createEditor(selector, options = {}){
  let element = $(selector)[0];

  return CodeMirror(element, { 
    value: options.value ? options.value: '',
    theme: 'ambiance',
    lineNumbers: true,
    matchBrackets: true,
    readOnly: options.readonly || false,
    mode: {
      name: 'javascript',
      json: true
    }
  }); 
}

function update(objectEditor, queryEditor, outputEditor){
  let object = tryParse(objectEditor);
  let query = tryParse(queryEditor);

  if(object && query){
    try{
      let result = whynomatch(object, query);
      outputEditor.setValue(stringify(result));
    } catch(e){
      setError(queryEditor, e.message);
    }
  }
}

function tryParse(editor, options = {}){
  let parsedValue;
  try{
    let value = editor.getValue();

    if(value !== ""){
      parsedValue = JSON5P.parse(value);
    }

    clearError(editor);
  } catch(e){
    setError(editor, e.message);
  }

  return parsedValue;
}

function clearError(editor){
  let errorDiv = findErrorDiv(editor);

  if(errorDiv.length > 0){
    errorDiv.text("");
    errorDiv.remove();
  }
}

function setError(editor, message){
  let errorDiv = findErrorDiv(editor);

  if(errorDiv.length === 0){
    errorDiv = createErrorDiv(editor);
  } 

  errorDiv.text(message);
}

function createErrorDiv(editor){
  let errorDiv = $("<div></div>");
  errorDiv.addClass("error");

  let wrapperElement = $(editor.getWrapperElement());
  errorDiv.appendTo(wrapperElement);
  return errorDiv;
}

function findErrorDiv(editor){
  let wrapperElement = $(editor.getWrapperElement());
  let errorDiv = wrapperElement.find(".error").first();

  return errorDiv;
}

function getDefaultTarget(){
  let defaultTargetObject = {
    _id: "FILE_0094310654803142674",
    name: "Rick Sanchez",
    age: 80,
    dimension: "C-137",
    profession: ["Scientist", "Inventor", "Arms salesman"],
    criminalRecord: [
      {
        charge: "Assult",
        occurrences: 45
      }, 
      {
        charge: "Bioterrorism",
        occurrences: 4
      }, 
      {
        charge: "Genocide",
        occurrences: 2
      }, 
      {
        charge: "Terrorism",
        occurrences: 15
      }
    ]
  };

  let defaultTargetString = 
`// Ricks Criminal record does not match our query. 
// Lets find out why.
//
// Paste your mistery object here.

${stringify(defaultTargetObject)}`

  return defaultTargetString;
}

function getDefaultQuery(){
  let defaultQuery = {
    profession: {
      $in: [
        "Scientist"
      ]
    },
    age: {
      $lt: 100,
      $gt: 70
    },
    criminalRecord: {
      $exists: 1,
      $elemMatch: {
        charge: "Genocide",
        occurrences: {
          $gt: 1
        }
      }
    },
    dimension: "C-138"
  }
  
  let defaultQueryString = 
`// We query for Scientist in the age 70 - 100
// that have commited Genocide more than once.
//
// Paste your non matching query

${stringify(defaultQuery)}`
  return defaultQueryString;
}

function addFirstComment(editor){
  let value = editor.getValue();
  let newValue = 
`// Oh, wrong dimention!
//
// Find out the why your query does 
// not match an object the easy way

${value}`;

  editor.setValue(newValue);
}

function stringify(object){
  return JSON5P.stringify(object);
}