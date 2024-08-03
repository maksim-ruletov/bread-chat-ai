const fs = require('fs');
const { homeDir } = require('../../framework/filesystem/Utils.js');

class Token {
    constructor(_tokenIndex)
    {
        this._service = null;
        this._value = null;
        this._tokenIndex = _tokenIndex;
    }

    _parse()
    {
        let t_token = require(`${homeDir}/BreadChatAI/.data/tokens.json`)
                      .list.find(it_token => it_token.tokenIndex === this._tokenIndex);

        if (!t_token)
        {
            return /* error logs here */;
        }

        this._service = t_token.service;
        this._value = t_token.value;
        
        t_token = null;
    }

    _normalize()
    {
        if (!this._service || !this._value)
        {
            return /* error logs here */;
        }

        return {
            service: this._service,
            value: this._value,
            tokenIndex: this._tokenIndex
        };
    }

    _uploadChanges()
    {
        if (!this._service || !this._value)
        {
            return /* error logs here */;
        }

        let t_tokens = require(`${homeDir}/BreadChatAI/.data/tokens.json`);

        t_tokens.list.find(it_token => it_token.tokenIndex === this._tokenIndex).service = this._service;
        t_tokens.list.find(it_token => it_token.tokenIndex === this._tokenIndex).value = this._value;

        fs.writeFileSync(`${homeDir}/BreadChatAI/.data/tokens.json`, JSON.stringify(t_tokens, null, '\t'));

        t_tokens = null;
    }

    _deleteToken()
    {
        let t_tokens = require(`${homeDir}/BreadChatAI/.data/tokens.json`);

        try
        {
            t_tokens.list.splice(t_tokens.list.indexOf(t_tokens.list.find(it_token => it_token.tokenIndex === this._tokenIndex)), 1);
            
            if (t_tokens.list.length === 0)
            {
                t_tokens.activeToken = null;
            }
            else
            {
                if (t_tokens.activeToken === this.tokenIndex)
                {
                    t_tokens.activeToken = t_tokens.list[0].tokenIndex;
                }
            }

            fs.writeFileSync(`${homeDir}/BreadChatAI/.data/tokens.json`, JSON.stringify(t_tokens, null, '\t'));
            this._tokenIndex = null;
        }
        catch (error) {
            /* error log here */
            return /* error here */;
        }
    }

    static createToken(service, value)
    {
        let t_tokens = require(`${homeDir}/BreadChatAI/.data/tokens.json`);

        let t_generatedToken = {
            service,
            value,
            tokenIndex: `tokens::entry-0_${t_tokens.list.length + 1}`
        };

        t_tokens.list.push(t_generatedToken);

        if (t_tokens.list.length === 1) {
            t_tokens.activeToken = t_generatedToken.tokenIndex
        }

        fs.writeFileSync(`${homeDir}/BreadChatAI/.data/tokens.json`, JSON.stringify(t_tokens, null, '\t'));

        t_tokens = null;

        return new Token(t_generatedToken.tokenIndex);
    }

    static getActiveToken() {
        let t_tokens = require(`${homeDir}/BreadChatAI/.data/tokens.json`);

        let t_token = new Token(t_tokens.activeToken);
        t_token._parse();

        return t_token._normalize();
    }

    static setActiveToken(tokenIndex) {
        let t_tokens = require(`${homeDir}/BreadChatAI/.data/tokens.json`);

        let t_token = t_tokens.list.find(item => item.tokenIndex === tokenIndex);

        if (t_token) {
            t_tokens.activeToken = tokenIndex;

            fs.writeFileSync(`${homeDir}/BreadChatAI/.data/tokens.json`, JSON.stringify(t_tokens, null, '\t'));

            return {
                'ok': true
            }
        }
        else {
            return {
                'ok': false,
                'code': 'ELEMENT_DOES_NOT_EXIST'
            }
        }
    }
}

exports.Token = Token;