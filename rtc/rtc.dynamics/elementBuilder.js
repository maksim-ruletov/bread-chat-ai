/**
 * Create a DOM object
 * 
 * @param {string} a_tagName 
 * @param {string} a_textContent 
 * @param {Object} a_properties 
 * @param {Array} a_childrens 
 * @returns {Element}
 */
function buildElement(a_tagName, a_textContent, a_properties, a_childrens, a_innerHTML)
{
    if (typeof a_tagName !== 'string')
    {
        return /* error log here */;
    }

    let t_element = document.createElement(a_tagName);

    if (typeof a_textContent !== 'string')
    {
        return /* errorm log here */;
    }

    t_element.textContent = a_textContent;

    /**
     * Append any properties to object, like this:
     * 
     * ```js
     * (..., { class: 'item__name' }, ...);
     * ```
     */
    if (typeof a_properties === 'object' && !Array.isArray(a_properties))
    {
        Object.keys(a_properties).forEach(item => {
            t_element.setAttribute(item, a_properties[item]);
        });
    }

    /**
     * Append child elements to parent
     */
    if (Array.isArray(a_childrens))
    {
        a_childrens.forEach(item => {
            if (item instanceof Element)
            {
                t_element.append(item);
            }
        })
    }

    if (a_innerHTML && typeof a_innerHTML === 'string')
    {
        t_element.innerHTML += a_innerHTML;
    }

    return t_element;
}