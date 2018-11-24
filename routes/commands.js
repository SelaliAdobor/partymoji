const emojiRegex = new RegExp(/:(.*):/)
const { SlackClient } = require('../slack')

const Slack = new SlackClient()

module.exports = async function routes(fastify, options) {
    fastify.post('/partify', async (request, reply) => {
        let text = request.body["text"]

        await Promise.resolve(emojiFromText(text))
            .then((emoji) => Slack.getUrlForEmoji(emoji))
            .then(url => reply.send(url))
            .catch((err) => {
                console.log(err)
                reply.send(err)
            })
    })
    console.log("Test")
}

function emojiFromText(text) {
    let matches = emojiRegex.exec(text)

    if (matches == null || matches.length < 2) {
        throw new Error("Could not understand that text, did you include an emoji?")
    }

    console.log(matches)
    return matches[1]
}