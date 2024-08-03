class RTCChatManager {
    constructor() {

    }

    static resetContext() {
        api.ipcRenderer.invoke('reset-context', CHAT_WORKER._getActiveChat()).then(response => {
            document.querySelector('.chatgpt__chat').innerHTML = '';
        })
    }
}