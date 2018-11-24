const fs = require("fs");
const PartyPartyParty = require("party-party-party");

export function partify(inPath, outPath){
    return new Promise(()=>{
        let outputFileStream = fs.createWriteStream(outPath);
        PartyPartyParty(inPath, outputFileStream, 10);
    })
}