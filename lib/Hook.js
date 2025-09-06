/**
 * @typedef {Object} Callback
 * @property {Function} func - The callback function.
 * @property {number} accepted_args - The number of arguments the function accepts.
 */

/**
 * @typedef {Object.<string, Callback[]>} Priority
 */

/**
 * Manages callbacks for a single hook.
 * @class
 */
class Hook {
    /**
     * @param {string} hook - The name of the hook.
     */
    constructor(hook) {
        /** @type {string} */
        this.hook = hook;
        /** @type {Map<number, Callback[]>} */
        this.callbacks = new Map();
        /** @type {boolean} */
        this.isSorted = true;
    }

    /**
     * Adds a callback function to the hook.
     *
     * @param {Function} func - The callback function to be executed.
     * @param {number} priority - The order in which the function should be executed. Lower numbers correspond with earlier execution.
     * @param {number} accepted_args - The number of arguments the function accepts.
     */
    add(func, priority, accepted_args) {
        const callback = { func, accepted_args };

        if (!this.callbacks.has(priority)) {
            this.callbacks.set(priority, []);
        }

        this.callbacks.get(priority).push(callback);
        this.isSorted = false;
    }

    /**
     * Removes a specific callback function from the hook.
     *
     * @param {Function} func - The callback function to remove.
     * @param {number} [priority] - The priority of the function to remove.
     * @returns {boolean} Whether the callback was successfully removed.
     */
    remove(func, priority) {
        let found = false;
        const removeCb = (priorityKey) => {
            const funcs = this.callbacks.get(priorityKey);
            const index = funcs.findIndex(cb => cb.func === func);
            if (index !== -1) {
                funcs.splice(index, 1);
                if (funcs.length === 0) {
                    this.callbacks.delete(priorityKey);
                }
                found = true;
                return true; // Stop iteration
            }
            return false;
        };

        if (priority !== undefined) {
             if (this.callbacks.has(priority)) {
                removeCb(priority);
            }
        } else {
            for (const priorityKey of this.callbacks.keys()) {
                if (removeCb(priorityKey)) {
                    break;
                }
            }
        }
        return found;
    }

    /**
     * Removes all callbacks from a hook, optionally for a specific priority.
     * @param {number} [priority] - If specified, only callbacks with this priority will be removed.
     */
    removeAll(priority) {
        if (priority !== undefined) {
            this.callbacks.delete(priority);
        } else {
            this.callbacks.clear();
        }
    }
    
    /**
     * Checks if a specific callback is registered for this hook.
     * @param {Function} [func] - The callback function to check for. If omitted, checks if any callback exists.
     * @returns {boolean}
     */
    has(func) {
        if (this.callbacks.size === 0) {
            return false;
        }
        if (!func) {
            return true;
        }
        for (const funcs of this.callbacks.values()) {
            if (funcs.some(cb => cb.func === func)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Executes all registered callbacks for the hook (action).
     *
     * @param {...*} args - Arguments to pass to the callbacks.
     */
    exec(...args) {
        if (this.callbacks.size === 0) {
            return;
        }

        this.sort();
        for (const funcs of this.callbacks.values()) {
            for (const { func, accepted_args } of funcs) {
                const callArgs = args.slice(0, accepted_args);
                func(...callArgs);
            }
        }
    }

    /**
     * Applies filters to a value.
     *
     * @param {*} value - The value to filter.
     * @param {...*} args - Additional arguments to pass to the filter callbacks.
     * @returns {*} The filtered value.
     */
    apply(value, ...args) {
        if (this.callbacks.size === 0) {
            return value;
        }

        this.sort();
        let filteredValue = value;
        for (const funcs of this.callbacks.values()) {
            for (const { func, accepted_args } of funcs) {
                const callArgs = [filteredValue, ...args].slice(0, accepted_args);
                filteredValue = func(...callArgs);
            }
        }
        return filteredValue;
    }

    /**
     * Sorts the callbacks by priority.
     * @private
     */
    sort() {
        if (!this.isSorted) {
            this.callbacks = new Map([...this.callbacks.entries()].sort((a, b) => a[0] - b[0]));
            this.isSorted = true;
        }
    }
}

module.exports = Hook;
