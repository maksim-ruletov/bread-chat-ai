function wt_generate()
{
    document.querySelector('.chats-wrapper').innerHTML =
    `
    <div class="chats-wrapper__list"></div>
    <button translate="app.chats.buttons.add" class="chats-wrapper__button" onclick="client._createChat()"></button>
    <button class="chats-wrapper__close" onclick="CHATS_MANAGER._hideChats()">
        <span class="fa-regular fa-xmark awesome"></span>
    </button>
    `;

    requestChats();
    localizateWOT();
    MENU_CONTROL_BUTTON._loadWT();
}