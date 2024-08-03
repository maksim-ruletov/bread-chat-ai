class Allocator {
    constructor() {

    }

    /**
     * Allocate new data
     * 
     * @param {string} m_name 
     * @param {any} m_data 
     */
    _allocate(m_name, m_data) {
        if (this[m_name]) {
            return console.error(`Failed to allocate ${m_name} because pool already has this property`);
        }

        this[m_name] = m_data;
    }

    /**
     * Deallocate one item by name
     * 
     * @param {string} m_name 
     */
    _deallocateByName(m_name) {
        if (!this[m_name]) {
            return console.error(`Failed to deallocate item with name ${m_name} because pool hasn't this item`);
        }

        delete this[m_name];
    }

    /**
     * Clear pool
     */
    _deallocateAll() {
        for (const poolMember in this) {
            console.log(`[__dealloc] member ${poolMember}`);
            delete this[poolMember];
        }
    }

    /**
     * Fetch allocated member
     * 
     * @param {string} m_name 
     */
    _fetch(m_name) {
        if (!this[m_name]) {
            return console.error(`Failed to fetch item with name ${m_name} because pool hasn't this item`);
        }

        return this[m_name];
    }
}