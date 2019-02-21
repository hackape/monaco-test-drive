import * as monaco from "monaco-editor";
import { languages } from "monaco-editor";
// @ts-ignore
import sigHelps from "../../scripts/funcset.json";
type CompletionItem = languages.CompletionItem;

const completionItems: CompletionItem[] = sigHelps.map(each => {
  const funcname = each.name;
  const overloads = each.signatures.length;
  const documentation = { value: "" };
  if (overloads === 0) {
    documentation.value = `function ${funcname}()`;
  } else {
    documentation.value = `function ${each.signatures[0].label} **(with ${overloads} overloads)**`;
  }
  return {
    kind: languages.CompletionItemKind.Function,
    label: funcname,
    insertText: funcname,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation
  } as CompletionItem;
});

export function getLanguageService() {
  return new FeLanguageService();
}

class FeLanguageService {
  getFunctionCompletionItems(): CompletionItem[] {
    return completionItems;
  }

  getSignatureHelpItem(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    token: monaco.CancellationToken,
    context: languages.SignatureHelpContext
  ): languages.SignatureHelp {
    const lineContent = model.getLineContent(position.lineNumber);
    const matched = lineContent.match(/([a-zA-Z_]+)\((.*)\)/);
    if (!matched) return;

    const [_, funcName, argsStr] = matched;
    
    let commaIndexes = [];
    if (argsStr.length) {
      const bracketStack = [];
      let i = 0;

      while (i <= argsStr.length) {
        const char = argsStr[i];
        switch (char) {
          case "(":
          case "[":
            bracketStack.push(char);
            break;
          case ")":
          case "]":
            bracketStack.pop();
            break;
          case ",":
            if (bracketStack.length === 0) commaIndexes.push(i);
            break;
        }
        i++;
      }

      const argsOffset = lineContent.indexOf(argsStr);
      commaIndexes = commaIndexes.map(commaIndex => commaIndex + argsOffset);
    }

    const cursorPosition = position.column - 1;
    
    const activeParameter = commaIndexes.reduce((acc, commaIndex) => {
      if (cursorPosition >= commaIndex) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    const sigHelp = sigHelps.find(item => item.name === funcName);

    const commaCount = commaIndexes.length;
    const signatureParamsCount = sigHelp.signatures.map(signature => signature.parameters.length);

    const activeSignature = signatureParamsCount.reduce((acc, paramsCount, index) => {
      if (acc !== undefined) return acc;
      if (commaCount < paramsCount) return index;
    }, undefined) || 0;

    return { ...sigHelp, activeParameter, activeSignature }
  }
}
