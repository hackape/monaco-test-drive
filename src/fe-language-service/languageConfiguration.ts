import * as monaco from 'monaco-editor';
export const languageConfiguration: monaco.languages.LanguageConfiguration = {
  comments: {
		blockComment: ['/*', '*/'],
		lineComment: '#'
  },
  
  brackets: [
		['[',']'],
		['(',')']
  ],

  autoClosingPairs: [
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
	],

	surroundingPairs: [
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
	]
}

interface IMonarchLanguage extends monaco.languages.IMonarchLanguage {
  [k: string]: any;
}

const keywords1 = ["and", "or", "case", "when", "else", "then", "end"];
const keywords2 = ["as", "cast", "in", "true", "false", "null", "NULL", "lambda"];
export const monarchLanguage: IMonarchLanguage = {
  // predefined enums for later reference
  keywords: [...keywords1, ...keywords2],
  typeKeywords: ["boolean", "short", "smallint", "int", "bigint", "float", "double", "string"],
  operators: [">", "<", "!", "~", "?", "==", "<=", ">=", "!=", "+", "-", "*", "/", "%", "&", "->"],
  symbols: /[><!~?=\+\-\*\/%&]+/,

  escapes: /\\(?:[btnfr"'\\]|[0-3]{0,1}[0-7]{1,2}|u[0-9A-Fa-f]{4})/,
  brackets: [
		{ open: '{', close: '}', token: 'delimiter.curly' },
		{ open: '[', close: ']', token: 'delimiter.bracket' },
		{ open: '(', close: ')', token: 'delimiter.parenthesis' }
	],

  // tokenizer rules start:
  tokenizer: {
    root: [
      // identifiers and keywords
      [
        /[a-zA-Z_][a-zA-Z_0-9]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@typeKeywords": "type",
            "@default": "identifier"
          }
        }
      ],

      { include: "@whitespace" },

      // delimiters and operators
      [/[{}()\[\]]/, "@brackets"],
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],

      // numbers
      [/\d+\.\d*|\.\d+/, 'number.float'],
      [/\d+[smhd]/, 'number.time'],
      [/\d+/, 'number'],

      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }]
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],

    comment: [
      [/[^\/*]+/, "comment"],
      [/\/\*/, "comment", "@push"], // nested comment
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],

    whitespace: [[/[ \t\r\n]+/, "white"], [/\/\*/, "comment", "@comment"], [/#.*$/, "comment"]]
  }
};
