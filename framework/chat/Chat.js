const fs = require('fs');

const { homeDir } = require('../filesystem/Utils.js');
const { ErrorLog } = require('../system/ErrorLog.js');
const { Message } = require('./Message.js');
const { Chats } = require('../filesystem/Chats.js');

/**
 * Класс для работы с чатом.
 */
class Chat {
    constructor(chatId) {
        this.chatId = chatId;

        this.chatParsedFile = {};
    }

    /**
     * Получение содержимого чата.
     */
    Parse() {
        this.chatParsedFile = require(`${homeDir}/BreadChatAI/chats/${this.chatId}.json`);
    }

    /**
     * Создание файла чата
     */
    Create(chatName) {
        if (!fs.existsSync(`${homeDir}/BreadChatAI/chats/${this.chatId}.json`)) {
            fs.appendFileSync(`${homeDir}/BreadChatAI/chats/${this.chatId}.json`, JSON.stringify({
                chatId: this.chatId,
                chatName,
                messages: []
            }));

            this.Parse();
        }
    }

    /**
     * Загрузка новых данных в файл
     * @returns 
     */
    Upload() {
        if (!fs.existsSync(`${homeDir}/BreadChatAI/chats/${this.chatId}.json`)) {
            this.Create();
        }

        if (!this.chatParsedFile) {
            return ErrorLog.AddLogToFile('Failed to upload file', 'file not parsed');
        }

        fs.writeFileSync(`${homeDir}/BreadChatAI/chats/${this.chatId}.json`, JSON.stringify(this.chatParsedFile));
    }

    /**
     * Чтение сообщений
     * @returns {Message[]}
     */
    ReadMessages() {
        if (!this.chatParsedFile) {
            return ErrorLog.AddLogToFile('Failed to read messages', 'file not parsed');
        }

        return this.chatParsedFile.messages;
    }

    /**
     * Добавление сообщения
     * @param {Message} message 
     */
    PushMessage(message) {
        if (!this.chatParsedFile) {
            return ErrorLog.AddLogToFile('Failed to push message', 'file not parsed');
        }

        if (!message || !message instanceof Message) {
            return ErrorLog.AddLogToFile('Failed to push message', 'message isn\'t Message instance');
        }

        this.chatParsedFile.messages.push(message.ReturnAsJSON());
    }

    /**
     * Удаление чата.
     */
    DeleteChat() {
        fs.rm(`${homeDir}/BreadChatAI/chats/${this.chatId}.json`, () => {});
    }

    /**
     * JSON
     */
    Serialize() {
        return {
            chatId: this.chatId,
            chatName: this.chatParsedFile.chatName,
            messages: this.chatParsedFile.messages
        };
    }

    static _createChat(chatName) {
        let chat = new Chat(`chat-${Chats.DropChatsFile().length + 1}`);

        chat.Create(chatName);

        const CHATS = Chats.DropChatsFile();

        CHATS.push({
            chatId: chat.chatId,
            chatName: chat.Serialize().chatName
        });

        Chats.UploadChatsFile(CHATS);

        return chat.Serialize();
    }

    static _deleteChat(chatId) {
        const CHATS = Chats.DropChatsFile();
        let chat = CHATS.find(item => item.chatId == chatId);

        if (!chat) {
            return JSON.stringify({
                'ok': false,
                'error-code': 'CNF'
            });
        }
        else {
            new Chat(chatId).DeleteChat();

            CHATS.splice(CHATS.indexOf(chat), 1);
            Chats.UploadChatsFile(CHATS);

            return JSON.stringify({
                'ok': true
            })
        }
    }

    static _readChat(chatId) {
        if (chatId === 'first') {
            chatId = Chats.DropChatsFile()[0].chatId;
        }

        let chat = new Chat(chatId);
        chat.Parse();

        return JSON.stringify(chat.Serialize());
    }

    static _saveMessage(chatId, message, type = 'question') {
        let chat = new Chat(chatId);
        chat.Parse();

        chat.chatParsedFile.messages.push({
            'type': type,
            'message': message,
            'date': Date.now()
        });

        chat.Upload();
    }

    static resetContext(chatId) {
        let chat = new Chat(chatId);
        chat.Parse();

        chat.chatParsedFile.messages = [];

        chat.Upload();
    }
}

exports.Chat = Chat;