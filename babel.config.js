/**
 * ref: http://kangax.github.io/compat-table/es6/
 */

/**
 * @param {{ version: string; assertVersion(v: string): boolean; cache: { forever(): void; never(): void; using(func: () => string): void };  env(...args: any[]): any; caller(func: (instance: any) => any) }} [api]
 */
function babelConfigFactory(api) {
  console.log('babelConfigFactory GOT LOADED', api.version)
  api.cache(true);
  // preset & plugin ordering

  // plugins run before presets, from first to last
  const plugins = [
    // `decorators` MUST come before class-properties plugin
    ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-syntax-dynamic-import",
    // SHOULD manually spec version, otherwise default to 7.0.0, 
    // which doesn't support decorators plugin, resulting in 10k of inline code for each file
    // see https://github.com/babel/babel/issues/8766
    ["@babel/plugin-transform-runtime", { version: "7.2.0" }],
  ]

  // presets run from LAST to FIRST
  const presets = [
    "@babel/preset-typescript", // strip TS type syntax
    "@babel/preset-react", // transform JSX to JS
    [
      "@babel/preset-env", // transform latest ES syntax to compat old syntax
      {
        targets: { "ie": "11" },
        useBuiltIns: false,         // DO NOT use polyfil, use plugin-transform-runtime
        modules: false                // DO NOT transform module, leave it to webpack
      }
    ]
  ].reverse();

  return {
    plugins,
    presets
  };
}

module.exports = babelConfigFactory;
