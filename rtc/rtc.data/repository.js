class Repository
{
    constructor()
    {
        this._values = [];
    }

    _push(a_key, a_value)
    {
        this._values[a_key] = a_value;
    }

    _get(a_key)
    {
        return this._values[a_key];
    }

    _clear()
    {
        this._values = {};
    }

    _getLastElement()
    {
        return Object.keys(this._values)[Object.keys(this._values).length - 1] ?? null;
    }
}