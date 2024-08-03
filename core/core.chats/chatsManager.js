const { homeDirectory } = require('../folderManager.js');
const { Chat } = require('./chat.js');
const fs = require('fs');

class ChatsManager
{
    constructor()
    {
        this._errors = [];
    }

    static getChatById(a_chatId)
    {
        let t_codes = [
            -1, // a_chatId is incorrect (isn't string)
            -2  // searched chat not found
        ]

        let t_chats = ChatsManager.cleanChats(require(`${homeDirectory}/chats.json`));

        if (!a_chatId || typeof a_chatId !== 'string')
        {
            return t_codes[0];
        }

        let t_searchedChat = t_chats.find(t_chat => t_chat.ID === a_chatId);

        if (!t_searchedChat)
        {
            return t_codes[1];
        }

        let chat = new Chat(a_chatId);

        // result
        return chat;
    }

    // Clean all unused chats
    static cleanChats(a_chats)
    {
        a_chats.forEach((t_chat, t_index) => {
            if (!fs.existsSync(t_chat.PATH))
            {
                a_chats.splice(t_index, 1);
            }
        });

        return a_chats;
    }

    static createChat(a_chatName)
    {
        let t_chats = ChatsManager.cleanChats(require(`${homeDirectory}/chats.json`));
        let t_chatId = `chats@id-${t_chats.length}`;

        t_chats.push({
            ID: t_chatId,
            PATH: `${homeDirectory}/chats/${t_chatId}.json`
        });

        this.rewriteChatsRepository(t_chats);

        return Chat.create(t_chatId, a_chatName);
    }

    static getChatsLength()
    {
        return ChatsManager.cleanChats(require(`${homeDirectory}/chats.json`)).length;
    }

    static rewriteChatsRepository(a_chatsRepository)
    {
        fs.writeFileSync(`${homeDirectory}/chats.json`, JSON.stringify(a_chatsRepository, null, '\t'));
    }

    static getFirstChat()
    {
        let t_chats = ChatsManager.cleanChats(require(`${homeDirectory}/chats.json`));

        return new Chat(t_chats[0].ID);
    }

    static getChats()
    {
        return this.cleanChats(require(`${homeDirectory}/chats.json`));
    }

    static deleteChat(a_chatId)
    {
        const t_codes = [
            -1 // Chat not found
        ];

        let t_chats = ChatsManager.cleanChats(require(`${homeDirectory}/chats.json`));

        let t_chat = t_chats.find(t_item => t_item.ID === a_chatId);

        if (!t_chat)
        {
            return t_codes[0];
        }

        t_chats.splice(t_chats.indexOf(t_chat), 1);
        this.uploadChatsList(t_chats);
        fs.rm(t_chat.PATH, (error) => {
            /* error log here */
        });

        return 0; // SUCCESS
    }

    static uploadChatsList(a_chats)
    {
        fs.writeFileSync(`${homeDirectory}/chats.json`, JSON.stringify(a_chats));
    }
}

exports.ChatsManager = ChatsManager;