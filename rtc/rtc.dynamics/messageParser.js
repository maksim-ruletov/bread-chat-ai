function parseAndStream(a_messages)
{
    if (a_messages.length > 0)
    {
        messages._clear();

        a_messages.forEach((t_message, t_index) => {
            let t_element = buildElement(
                'div',
                '',
                {
                    'message-id': messages._getLastElement() ? Number(messages._getLastElement()) + 1 : 0,
                    'class': `chat__${t_message.TYPE}`
                },
                [
                    buildElement(
                        'div',
                        '',
                        {
                            'class': `${t_message.TYPE}__text-wrapper`
                        },
                        [],
                        marked.parse(t_message.TEXT),
                    )
                ]
            );

            if (document.querySelector('.chatgpt__chat').children.length === 0)
            {
                document.querySelector('.chatgpt__chat').append(t_element);
            }
            else
            {
                document.querySelector('.chatgpt__chat').insertBefore(t_element, document.querySelector('.chatgpt__chat').children[0]);

                t_element.children[0].childNodes.forEach(t_item => {
                    if (t_item.nodeName === 'PRE')
                    {
                        let t_code = t_item.children[0];
                        let t_language = t_code.getAttribute('class').split('-')[1];

                        const highlightedCode = hljs.highlight(
                            t_code.textContent,
                            { language: t_language }
                        ).value

                        t_code.innerHTML = highlightedCode;
                    }
                });
            }

            messages._push(Number(t_element.getAttribute('message-id')), t_message.TEXT);
            lastMessageId = Number(t_element.getAttribute('message-id'));
        });
    }
}