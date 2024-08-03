class Message
{
    // a_message [string] - user message
    constructor(a_message)
    {
        this._message = a_message;
        this._activeChat = client._getActiveChat();
    }

    // output the message data in normal view
    _normalize()
    {
        return {
            MESSAGE: this._message,
            FROM_CHAT: this._activeChat
        };
    }
}