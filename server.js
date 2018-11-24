const fastify = require('fastify')()
fastify.log = console

require('dotenv').config()


const port = 1234

fastify.register(require('fastify-formbody'))

fastify.get('/', async (request, reply) => {
    return "Hello World!"
})

fastify.register(require('./routes/commands.js'))
fastify.register(require('./routes/auth.js'))

const start = async () => {
    try {
        await fastify.listen(port)

        fastify.log.info(fastify.printRoutes())
        fastify.log.info(`Listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}


start()