const express = require('express')
const app = express()

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
const healthPort = port + 1

const hostname    = process.env.HOSTNAME || "Generic hostname"
const application = process.env.APPLICATION || "Generic application"

let httpCode = 200
let readyCode = 200

function getTs() {
  const date = new Date()
  return(date.toISOString())
}

app.get('/', (req, res) => {
  res.status(httpCode).send(`${getTs()}: ${application} in pod ${hostname}` + (httpCode == 200?"":" is really sick"))
})

app.put('/kill', (req, res) => {
  httpCode = 503
  res.status(httpCode).send(`${getTs()}: ${application} in pod ${hostname} - you killed me!!`)
})

app.listen(port, () => console.log(`Demo app listening on port ${port}!`))

const healthApp = express()
healthApp.put('/getready', (req, res) => {
  readyCode = 200
  res.status(httpCode).send(`${getTs()}: ${application} in pod ${hostname} - I'm ready!!`)
})

healthApp.put('/backoff', (req, res) => {
  readyCode = 503
  res.status(httpCode).send(`${getTs()}: ${application} in pod ${hostname} - I'm not talking to you!!`)
})

healthApp.get('/ready', (req, res) => { res.status(readyCode).send(readyCode==200?`Jepp. Jeg er klar!!`:"Glem det!") })
healthApp.get('/alive', (req, res) => { res.status(httpCode).send(httpCode==200?`Er da fremdeles i live!`:"Hjelp, jeg dør!") })
healthApp.listen(healthPort, () => console.log(`Demo app listening on port ${healthPort} for health reqests!`))
