import * as monaco from "monaco-editor";
import { getLanguageService } from "./fe-language-service";
import { languageConfiguration, monarchLanguage } from "./fe-language-service/languageConfiguration";

const LANGUAGE_ID = "fe";
const MODEL_URI = "inmemory://model.fe";
const MONACO_URI = monaco.Uri.parse(MODEL_URI);

monaco.languages.register({
  id: LANGUAGE_ID,
  extensions: [".fe"],
  mimetypes: ["application/x-fe"]
});

monaco.languages.setLanguageConfiguration(LANGUAGE_ID, languageConfiguration);
monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, monarchLanguage);

const fe = getLanguageService();

monaco.editor.create(document.getElementById("container")!, {
  model: monaco.editor.createModel('', LANGUAGE_ID, MONACO_URI),
  glyphMargin: true,
  lightbulb: {
    enabled: true
  }
});

monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
  provideCompletionItems(model, position, context, token) {
    return {
      suggestions: fe.getFunctionCompletionItems()
    };
  }
});

monaco.languages.registerSignatureHelpProvider(LANGUAGE_ID, {
  provideSignatureHelp(model, position, token, context) {
    return fe.getSignatureHelpItem(model, position, token, context);
  },
  signatureHelpTriggerCharacters: ["(", ","],
  signatureHelpRetriggerCharacters: [","]
});

// monaco.languages.registerHoverProvider(LANGUAGE_ID, {
//   provideHover(model, position, token) {
//     return {  }
//   }
// })
