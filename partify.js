const fs = require("fs");
const PartyPartyParty = require("party-party-party");

export function partify(inPath, outPath) {
    return new Promise((resolve) => {
        let outputFileStream = fs.createWriteStream(outPath);
        
        outputFileStream.on('finish', () => {
            resolve()
        });

        PartyPartyParty(inPath, outputFileStream, 10, undefined, () => {
            outputFileStream.end()
        });
    })
}