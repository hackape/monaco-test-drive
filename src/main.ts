import 'monaco-editor';
import './client';
(self as any).MonacoEnvironment = {
  getWorkerUrl: () => './editor.worker.bundle.js'
};
