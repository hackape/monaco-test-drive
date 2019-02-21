// @ts-check

function getPreliminaryMap(funcsetStr) {
  return funcsetStr
    .trim()
    .split(/\n{2,}/)
    .map(desc => {
      return desc.split(/\n/).reduce(
        (acc, line) => {
          if (!acc.name) {
            acc.name = line
              .trim()
              .split(":")
              .pop();
            return acc;
          } else {
            var params = line.trim().split(/\,\ */);
            acc.signatures.push(params);
            return acc;
          }
        },
        { name: "", signatures: [] }
      );
    });
}

function getSignatureHelps(funcsetStr) {
  var preliminaryMap = getPreliminaryMap(funcsetStr);
  return preliminaryMap.map(each => {
    var sigHelp = { name: each.name, signatures: [] };
    sigHelp.signatures = each.signatures.map(params => {
      params = params.map(javaType => {
        return javaType.split(".").pop();
      });
      var paramsLabel = params.join(", ");
      return {
        label: `${each.name}(${paramsLabel})`,
        parameters: params.map(label => ({ label }))
      };
    });
    sigHelp.signatures.sort((a, b) => {
      let sortby = a.parameters.length - b.parameters.length;
      if (sortby === 0) sortby = a.label.length - b.label.length;
      return sortby;
    });
    return sigHelp;
  });
}

function main() {
  writeToLocalFileSystem();
}

function writeToLocalFileSystem(src, dest) {
  var fs = require("fs");
  var path = require("path");
  var funcsetStr = fs.readFileSync(src || path.resolve(__dirname, "./funcset.txt"), "utf8");
  var sigHelps = getSignatureHelps(funcsetStr);
  fs.writeFileSync(dest || path.resolve(__dirname, "./funcset.json"), JSON.stringify(sigHelps, null, 2), "utf8");
  return sigHelps;
}

main();