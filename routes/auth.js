module.exports = async function routes(fastify, options) {
    fastify.get('/oauthCallback', async (request, reply) => {
        let code = request.query["code"]
        Slack.setTokenFromOauthCode(code).then(() => {
            reply.send("Authentication Successful!")
        }).catch((err) => {
            reply.code = 500
            reply.send(err)
        })
    })
}