import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import { FeWorker } from './feWorker';
self.onmessage = function () {
    // ignore the first message
    worker.initialize(function (ctx, createData) {
        console.log('initiated, FeWorker', ctx, createData)
        return new FeWorker(ctx, createData);
    });
};
