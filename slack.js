import { createReadStream, readFileSync, writeFileSync, read } from 'fs';
import { post } from 'request'
const { WebClient } = require('@slack/client');

const fontkit = require('fontkit');
const emojiFont = fontkit.openSync('./fonts/apple_emoji.ttc').fonts[0];

const emoji = require('node-emoji');

const dataUri = require('datauri').prototype;

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
        return this.emojiUrlFromLocal(emojiName) || this.emojiUrlFromApi(emojiName)
    }

    emojiUrlFromLocal(emojiName) {
        if (!emoji.hasEmoji(emojiName)) {
            return undefined
        }

        let defaultEmoji = emoji.get(emojiName);

        let layout = emojiFont.layout(defaultEmoji);
        let rendered = layout.glyphs[0].getImageForSize(64)

        return dataUri.format('.png', rendered.data).content;
    }

    async emojiUrlFromApi(emojiName) {
        let emojiListResponse = await web.emoji.list()
        let url = emojiListResponse["emoji"][emojiName]

        while (url && url.startsWith(aliasEmojiPrefix)) {
            let aliasedEmoji = url.slice(aliasEmojiPrefix.length)
            url = result["emoji"][aliasedEmoji]
        }

        if (emojiListResponse.ok && url) {
            return url
        } else {
            throw new Error(emojiListResponse.error || `Emoji :${emojiName}: not found`)
        }
    }

    async sendSlashCommandResponse(responseUrl, text, secondaryText) {
        return await post(responseUrl, {
            json: true,
            body: {
                "text": text,
                "attachments": [{
                    "text": secondaryText
                }]
            }
        })
    }
}