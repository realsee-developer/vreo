const fs = require('fs')
const path = require('path')
const del = require('del')
const { execSync } = require('child_process')

process.chdir(path.join(__dirname, '../'))

async function main() {

  await del(['lib'])
  fs.mkdirSync('lib')

  console.log("packaging...")

  console.log("[packaging] compile source code")
  execSync(`npx babel "./resources" --out-dir "./lib" --extensions ".ts,.tsx" --config-file "./dev-tools/babel.config.js"`)

  console.log("[packaging] emit ts declaration")
  execSync(`npx tsc --project "./dev-tools/tsconfig.build.json"`)

  // const packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"))

  // delete packageJSON.private
  // delete packageJSON.scripts
  // delete packageJSON.devDependencies

  // console.log("packaging package.json")
  // fs.writeFileSync(path.join(__dirname, "../packages/package.json"), JSON.stringify(packageJSON, null, "  "), "utf8")

  // execSync(`cp ./README.md ./packages/README.md`)
  // execSync(`cp ./TERMS.txt ./packages/TERMS.txt`)

  console.log("[packaging] done: " + path.join(__dirname, '../lib'))
}

main()
