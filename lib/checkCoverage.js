const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const xml2json = require('xml2json')

const readFile = promisify(fs.readFile)
const getPercentage = (covered = 0, total = 0) => (covered / total) * 100 || 0

;(async () => {
  const coveragePath = path.resolve(__dirname, '../coverage/clover.xml')

  const xml = await readFile(coveragePath, { encoding: 'utf-8' }).catch(
    (error) => {
      console.error(error)
      process.exit(1)
    }
  )

  const file = xml2json.toJson(xml)
  const { metrics } = JSON.parse(file).coverage.project

  if (!metrics) {
    console.log('No metrics found in coverage XML. Erm... what?')
    process.exit(1)
  }

  const {
    coveredstatements,
    statements,
    coveredmethods,
    methods,
    coveredelements,
    elements
  } = metrics

  const statementsPC = getPercentage(coveredstatements, statements)
  const functionsPC = getPercentage(coveredmethods, methods)
  const linesPC = getPercentage(coveredelements, elements)

  if (statementsPC < 80 || functionsPC < 80 || linesPC < 80) {
    console.log(`
      Failing because one of the following has fallen below 80%...
      Statements: ${statementsPC}%
      Functions: ${functionsPC}%
      Lines: ${linesPC}%
    `)

    process.exit(1)
  }

  console.log(`
    Success!
    Statements: ${statementsPC}%
    Functions: ${functionsPC}%
    Lines: ${linesPC}%
  `)

  process.exit(0)
})()
