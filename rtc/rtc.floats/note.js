class Note {
    static createNote(a_text, a_delay)
    {
        if (typeof a_text !== 'string')
        {
            return /* Error log here */;
        }

        if (document.querySelector('.notifier').children.length > 0)
        {
            return /* Error log here */;
        }

        let t_note = buildElement('div', a_text, { 'class': 'notifier__note' });

        document.querySelector('.notifier').append(t_note);

        // show notification
        $('.notifier').animate({
            'bottom': 0
        }, ANIMATION_TIME, () => {
            // wait for delay ends
            setTimeout(() => {
                // hide notification
                $('.notifier').animate({
                    'bottom': '-100%'
                }, ANIMATION_TIME, () => {
                    // delete notification
                    t_note.remove();
                });
            }, a_delay);
        })
    }
}