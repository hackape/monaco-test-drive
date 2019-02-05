import * as monaco from 'monaco-editor'
const Promise = monaco.Promise;
import * as fe from './lib/feServices';

export class FeWorker {
  constructor(ctx, createData) {
    this._ctx = ctx;
    this._languageSettings = createData.languageSettings;
    this._languageId = createData.languageId;
    this._languageService = fe.createLanguageService(this);
  }

  doValidation(uri) {
    const document = this._getTextDocument(uri);
    console.log('[doValidation]', document)
    return Promise.as([])
  }
}

export function create(ctx, createData) {
  console.log('feWorker created', ctx, createData);
  return new FeWorker(ctx, createData);
}
