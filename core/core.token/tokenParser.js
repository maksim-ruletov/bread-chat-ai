const SERVICES = ['chatgpt'];
const { homeDir } = require('../../framework/filesystem/Utils.js');

class TokenParser {
    static parseFile() {
        return require(`${homeDir}/BreadChatAI/.data/tokens.json`).list;
    }

    static validate(tokensList) {
        let t_validatedTokens = [];

        tokensList.forEach(item => {
            if (SERVICES.includes(item.service)) {
                t_validatedTokens.push(item);
            }
        });

        return t_validatedTokens;
    }
}

exports.TokenParser = TokenParser;