const express = require('express')
const app = express()

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
const ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

const hostname    = process.env.HOSTNAME || "Generic hostname"
const application = process.env.APPLICATION || "Generic application"

app.get('/', (req, res) => res.send(`My name is ${application} and I am running in the pod ${hostname}`))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const healthApp = express()
const healthPort = port + 1
healthApp.get('/ready', (req, res)  => res.send(`Jepp. Jeg er klar!!`))
healthApp.get('/alive', (req, res)  => res.send(`Er da fremdeles i live!`))
healthApp.listen(healthPort, () => console.log(`Example app listening on port ${healthPort} for health reqests!`))
