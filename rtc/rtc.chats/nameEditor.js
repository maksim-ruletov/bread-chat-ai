class NameEditor
{
    constructor()
    {
        this._editing = false;
        this._editableElement;
        this._oldContent;
    }

    _isEditing()
    {
        return this._editing;
    }

    _getEditableElement()
    {
        return this._editableElement;
    }

    _startEditing(element)
    {
        this._editing = true;
        this._editableElement = element;
        this._oldContent = element.children[0].textContent;
        
        this._editableElement.children[0].contentEditable = true;
        this._editableElement.children[0].focus();

        this._editableElement.children[1].children[0].classList.remove('fa-pen');
        this._editableElement.children[1].children[0].classList.add('fa-check');

        this._editableElement.children[1].onclick = this._finishEditing;
        this._editableElement.children[2].onclick = this._cancelEditing;

        document.execCommand('selectAll', false, null);
    }

    _finishEditing()
    {
        let _this = NAME_EDITOR;

        let t_newContent = _this._editableElement.children[0].textContent;
        let t_chatId = _this._editableElement.getAttribute('chat-id');

        if (t_newContent.length === 0)
        {
            _this._editableElement.children[0].focus();
            return Note.createNote(api.localisation[api.getConfig().language]['errors.name-is-empty'], 1500);
        }

        _this._editableElement.children[0].contentEditable = false;

        _this._editing = false;

        api.ipcRenderer.invoke('@system::chats::rename', t_chatId, t_newContent).then(response => {
            if (response.OK) {
                resetButtons(_this);

                if (client._getActiveChat() === t_chatId)
                {
                    document.querySelector('.menu__current-chat-name').textContent = t_newContent;
                }
            }
        });
    }

    _cancelEditing()
    {
        let _this = NAME_EDITOR;

        _this._editing = false;
        _this._getEditableElement().children[0].textContent = _this._oldContent;
        _this._getEditableElement().children[0].contentEditable = false;

        resetButtons(_this);
    }
}

function resetButtons(_this) {
    _this._getEditableElement().children[1].children[0].classList.remove('fa-check');
    _this._getEditableElement().children[1].children[0].classList.add('fa-pen');

    _this._getEditableElement().children[1].onclick = () => client._renameChat(_this._getEditableElement().getAttribute('chat-id'));
    _this._getEditableElement().children[2].onclick = () => {
        client._deleteChat(_this._getEditableElement().getAttribute('chat-id'));
        messages._clear();
        requestChats();
    }

    ApplyAnimation();
}