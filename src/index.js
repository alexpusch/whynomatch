require('./style.sass')
require('../node_modules/codemirror/lib/codemirror.css')
require('../node_modules/codemirror/theme/elegant.css')

import CodeMirror from '../node_modules/codemirror/lib/codemirror.js'
import {} from '../node_modules/codemirror/mode/javascript/javascript.js'

import whynomatch from 'whynomatch'
import $ from 'jquery'
import JSON5 from "json5" 

$(function(){
  let objectEditor = createEditor('.object');
  let queryEditor = createEditor('.query');
  let outputEditor = createEditor('.output', {readonly: true});

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
    theme: 'elegant',
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
      outputEditor.setValue(JSON5.stringify(result, null, 2));
    } catch(e){
      setError(queryEditor, e.message);
    }
  }
}

function tryParse(editor){
  let parsedValue;
  try{
    let value = editor.getValue();
    if(value !== ""){
      parsedValue = JSON5.parse(value);
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