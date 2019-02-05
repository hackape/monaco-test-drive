import * as monaco from 'monaco-editor'

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    console.log('what label?', moduleId, label);
    if (label === 'json') {
      return './json.worker.bundle.js';
    }
    if (label === 'css') {
      return './css.worker.bundle.js';
    }
    if (label === 'html') {
      return './html.worker.bundle.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.bundle.js';
    }
    if (label === 'fe') {
      return './fe.worker.bundle.js';
    }
    
    return './editor.worker.bundle.js';
  }
}

monaco.editor.create(document.getElementById('editor-container'), {
  value: [
    'function x() {',
    '\tconsole.log("Hello world!");',
    '}'
  ].join('\n'),
  language: 'typescript'
});