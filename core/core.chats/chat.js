const { homeDirectory } = require('../folderManager.js');
const fs = require('fs');

class Chat
{
    constructor(a_chatId)
    {
        this._chatId = a_chatId;
        this._chatPath = `${homeDirectory}/chats/${this._chatId}.json`;
        this._chatMessages = null;
        this._chatName = null;
    }

    _parse()
    {
        this._chatMessages = JSON.parse(fs.readFileSync(this._chatPath).toString()).MESSAGES;
        this._chatName = JSON.parse(fs.readFileSync(this._chatPath).toString()).NAME;
    }

    _getName()
    {
        return require(this._chatPath).NAME;
    }

    _getMessages()
    {
        return this._chatMessages;
    }

    _sendMessage(a_text, a_type)
    {
        let t_codes = [
            -1 // file wasn't parsed
        ]

        if (!Array.isArray(this._chatMessages))
        {
            return t_codes[0];
        }

        this._chatMessages.push({
            TYPE: a_type,
            TEXT: a_text
        });

        // Free heap
        t_codes = null;

        return 0; // SUCCESS
    }

    _clear()
    {
        this._chatMessages = [];
    }

    _delete()
    {
        this._clear();
    }

    _upload()
    {
        const fs = require('fs');

        fs.writeFileSync(this._chatPath, JSON.stringify(this._normilize(), null, '\t'));

        return 0; // SUCCESS
    }

    _normilize()
    {
        return {
            ID: this._chatId,
            NAME: this._chatName,
            MESSAGES: this._chatMessages
        };
    }

    _rename(a_name)
    {
        this._chatName = a_name;

        this._upload();
    }

    static create(a_chatId, a_chatName)
    {
        const fs = require('fs');
        
        fs.appendFileSync(`${homeDirectory}/chats/${a_chatId}.json`, JSON.stringify({
            ID: a_chatId,
            NAME: a_chatName,
            MESSAGES: []
        }, null, '\t'));

        return new Chat(a_chatId);
    }
}

exports.Chat = Chat;