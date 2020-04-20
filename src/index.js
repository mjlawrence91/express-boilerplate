import https from 'https'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import app from './app'

const readFile = promisify(fs.readFile)

;(async () => {
  const options = {
    key: await readFile(path.resolve(__dirname, '../certs/key.pem')),
    cert: await readFile(path.resolve(__dirname, '../certs/cert.pem'))
  }

  https
    .createServer(options, app)
    .listen(3000, (_) => console.log('Server open on port 3000'))
})()
