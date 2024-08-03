function wot_generate()
{
    document.querySelector('.chats-wrapper').innerHTML =
    `
    <p translate="chats.without-token.heading" style="margin-bottom: 10px;"></p>
    <button translate="chats.without-token.button" class="chats-wrapper__button" onclick="CHATS_MANAGER._hideChats(); SETTINGS_MANAGER._showSettings(); AppendCurrentActivePage('chatgpt');"></button>
    <button onclick="CHATS_MANAGER._hideChats(); SETTINGS_MANAGER._showSettings();" class="chats-wrapper__settings">
        <span class="fa-regular fa-gear awesome"></span>
    </button>
    <button class="chats-wrapper__close" onclick="CHATS_MANAGER._hideChats()">
        <span class="fa-regular fa-xmark awesome"></span>
    </button>
    `;

    MENU_CONTROL_BUTTON._loadWOT();
}