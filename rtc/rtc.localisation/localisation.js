function localizateAll()
{
    let t_elements = [];

    document.querySelectorAll('[transalte]').forEach((n_item) => {
        t_elements.push(n_item);
    });

    t_elements.forEach((n_item) => {
        n_item.textContent = api.localisation[api.getConfig().language][n_item.getAttribute('translate')];
    });

    t_elements = null;
}

function localizateWOT()
{
    let t_elements = [];

    document.querySelectorAll('.chats-wrapper > [translate]').forEach((n_item) => {
        t_elements.push(n_item);
    });

    t_elements.forEach((n_item) => {
        n_item.textContent = api.localisation[api.getConfig().language][n_item.getAttribute('translate')];
    });

    t_elements = null;
}

function localizateZB()
{
    document.querySelector('.no-bookmarks > span').textContent = api.localisation[api.getConfig().language]['bookmarks.zero'];
}