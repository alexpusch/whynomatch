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
  let object = JSON5.parse(objectEditor.getValue());
  let query = JSON5.parse(queryEditor.getValue());
  if(object && query){
    let result = whynomatch(object, query);
    outputEditor.setValue(JSON5.stringify(result, null, 2));
  }
}