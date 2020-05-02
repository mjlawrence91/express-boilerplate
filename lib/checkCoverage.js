const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const xml2json = require('xml2json')

const readFile = promisify(fs.readFile)

;(async () => {
  try {
    const coveragePath = path.resolve(__dirname, '../coverage/clover.xml')
    const xml = await readFile(coveragePath, { encoding: 'utf-8' })

    const json = xml2json.toJson(xml)
    const file = JSON.parse(json)

    const { metrics } = file.coverage.project

    if (metrics) {
      const statementsPC =
        (metrics.coveredstatements / metrics.statements) * 100
      const functionsPC = (metrics.coveredmethods / metrics.methods) * 100
      const linesPC = (metrics.coveredelements / metrics.elements) * 100

      if (statementsPC < 80 || functionsPC < 80 || linesPC < 80) {
        console.log(`
          Failing because one of the following has fallen below 80%...
          Statements: ${statementsPC}%
          Functions: ${functionsPC}%
          Lines: ${linesPC}%
        `)
        process.exit(1)
      } else {
        console.log(`
          Success!
          Statements: ${statementsPC}%
          Functions: ${functionsPC}%
          Lines: ${linesPC}%
        `)
        process.exit(0)
      }
    }
  } catch (error) {
    console.error(error)
  }
})()