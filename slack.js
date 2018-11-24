import { createReadStream, readFileSync, writeFileSync, read } from 'fs';
import { post } from 'superagent'
const { WebClient } = require('@slack/client');

let token = readFileSync(".token", "utf8");

const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;
const web = new WebClient(token);

const aliasEmojiPrefix = "alias:"
const nameTakenError = "error_name_taken"

export class SlackClient {

    async setTokenFromOauthCode(code) {
        let oauthResult = web.oauth.access({
            client_id: clientId,
            client_secret: clientSecret,
            code: code
        })

        if (oauthResult.ok) {
            web.token = result["access_token"]
            writeFileSync(".token", token)
            return web.token = token
        } else {
            throw new Error(result.error) 
        }
    }

    async uploadEmoji(name, path) {
        const formData = {
            token: web.token,
            name: name,
            mode: 'data',
            image: readFileSync(__dirname + "/" + path)
        };

        try {
            return await web.apiCall("/emoji.add", formData)
        } catch (err) {
            if (err["data"]["error"] == nameTakenError) {
                throw new Error(`The emoji name :${name}: is already taken 🙁"`)
            }
        }
    }

    async getUrlForEmoji(emojiName) {
        let emojiList = web.emoji.list()

        let url = emojiList["emoji"][emojiName]

        while (url.startsWith(aliasEmojiPrefix)) {
            let aliasedEmoji = url.slice(aliasEmojiPrefix.length)
            url = result["emoji"][aliasedEmoji]
        }

        if (result.ok && url) {
            return url
        } else {
            return result.error || "Emoji Not Found"
        }
    }
}