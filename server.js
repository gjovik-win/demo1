const express = require('express')
const app = express()

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
const ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
const healthPort = port + 1

const hostname = process.env.HOSTNAME || "Generic hostname"
const application = process.env.APPLICATION || "Generic application"

let httpCode = 200

app.get('/', (req, res) => {
  const date = new Date()
  res.status(httpCode).send(`${date.toISOString()}: ${application} in pod ${hostname}` + (httpCode == 200?"":" is really sick"))
})

app.get('/kill', (req, res) => {
  httpCode = 503
  const date = new Date()
  res.status(httpCode).send(`${date.toISOString()}: ${application} in pod ${hostname} - you killed me!!`)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const healthApp = express()
healthApp.get('/ready', (req, res) => { res.status(httpCode).send(httpCode==200?`Jepp. Jeg er klar!!`:"Glem det!") })
healthApp.get('/alive', (req, res) => { res.status(httpCode).send(httpCode==200?`Er da fremdeles i live!`:"Hjelp, jeg dør!") })
healthApp.listen(healthPort, () => console.log(`Example app listening on port ${healthPort} for health reqests!`))
