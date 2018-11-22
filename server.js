const fastify = require('fastify')()

const port = 1234

fastify.register(require('fastify-formbody'))

fastify.get('/', async (request, reply) => {
  return "Hello World"
})

fastify.post('/partify', async (request, reply) => {
    fastify.log.debug(request.body)
    return "Hello World"
})

// Run the server!
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