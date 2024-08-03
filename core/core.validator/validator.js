class Validator
{
    static validateMessage(a_message)
    {
        const { ChatsManager } = require('../core.chats/chatsManager.js');
        const { Chat } = require('../core.chats/chat.js');

        let t_codes = [
            -1, // MESSAGE is incorrect (not a string)
            -2, // FROM_CHAT is incorrect (not a string)
            -3, // FROM_CHAT doesn't exists
        ];

        if (!a_message.MESSAGE || typeof a_message.MESSAGE !== 'string')
        {
            return t_codes[0];
        }

        if (!a_message.FROM_CHAT || typeof a_message.FROM_CHAT !== 'string')
        {
            return t_codes[1];
        }

        let t_chatState = ChatsManager.getChatById(a_message.FROM_CHAT);

        if (!t_chatState instanceof Chat)
        {
            return t_codes[2];
        }

        // Free heap
        t_codes = null;
        t_chatState = null;

        return 0; // SUCCESS
    }
}

exports.Validator = Validator;