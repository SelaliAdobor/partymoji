const { join } = require('path')
const { mkdirSync, existsSync } = require('fs')

const { SlackClient } = require('../slack')
const { partify } = require("../partify")

const Slack = new SlackClient()

const tempDirectory = "./.runtimetemp"
const emojiRegex = new RegExp(/:(.*):/)
const { post } = require('request-promise')

if(!existsSync(tempDirectory)){
    mkdirSync(tempDirectory)
}

module.exports = async function routes(fastify, options) {
    fastify.post('/partify', async (request, reply) => {
        let responseUrl = request.body["response_url"]

        try {
            reply.send("Serving up your party gif! :parrot:")
            let text = request.body["text"]

            let emojiName = await emojiFromText(text)
            let emojiUrl = await Slack.getUrlForEmoji(emojiName)

            let partyName = `party_${emojiName}`
            let partyEmojiLocalPath = join(tempDirectory, `${partyName}.gif`)

            await partify(emojiUrl, partyEmojiLocalPath)

            await Slack.uploadEmoji(partyName, partyEmojiLocalPath)

            await Slack.sendSlashCommandResponse(responseUrl, `:${partyName}: Your gif is here! :${partyName}:`)
        } catch (err) {
            console.log("Attempt to invoke `/partify` failed",err)
            await  Slack.sendSlashCommandResponse(responseUrl, `😞 I wasn't able to make your gif 😞`, err.message)
        }
    })
}

function emojiFromText(text) {
    let matches = emojiRegex.exec(text)

    if (matches == null || matches.length < 2) {
        throw new Error("Could not understand that text, did you include an emoji?")
    }

    console.log(matches)
    return matches[1]
}