class Message {
    constructor(byWho, text, fromChat) {
        this.byWho = byWho;
        this.text = text;
        this.date = null;
        this.fromChat = fromChat;
    }

    ReturnAsJSON() {
        return {
            sender: this.byWho,
            text: this.text,
            sendedAt: this.date,
            fromChat: this.fromChat
        }
    }
}

exports.Message = Message;