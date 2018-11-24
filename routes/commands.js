const {join} = require('path')
const {mkdirSync} = require('fs')

const { SlackClient } = require('../slack')
const {partify} = require("../partify")

const Slack = new SlackClient()

const tempDirectory = "./.runtimetemp"
const emojiRegex = new RegExp(/:(.*):/)

mkdirSync(tempDirectory)

module.exports = async function routes(fastify, options) {
    fastify.post('/partify', async (request, reply) => {
        try{
            let text = request.body["text"]

            let emojiName = await emojiFromText(text)
            let emojiUrl = await Slack.getUrlForEmoji(emojiName)

            let partyName = `party_${emojiName}`
            let partyEmojiLocalPath = join(tempDirectory,`${partyName}.gif`)
            
            await partify(emojiUrl , partyEmojiLocalPath)
          
            let response = await Slack.uploadEmoji(partyName, partyEmojiLocalPath)

            console.log(response)

            reply.send(`:${partyName}:`)
        }catch(err){
            console.log(err)
            reply.send(err)
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