const fastify = require('fastify')()
fastify.log = console

const path = require('path')
require('dotenv').config()

const { partify } = require('./partify')
const { SlackClient } = require('./slack')

const Slack = new SlackClient()

const port = 1234


fastify.get('/', async (request, reply) => {
    return "Hello World!"
})

fastify.get('/oauthCallback', async (request, reply) => {
    let code = request.query["code"]
    Slack.setTokenFromOauthCode(code).then(() => {
        reply.send("Authentication Successful!")
    }).catch((err) => {
        reply.code = 500
        reply.send(err)
    })
})

fastify.post('/partify', async (request, reply) => {
    fastify.log.debug(request.body)
    return "Hello World"
})

const start = async () => {
    try {
        await fastify.listen(port)
        fastify.log.info(`Listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()