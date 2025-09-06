(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Hooker = factory());
})(this, (function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var Hooker$1 = {exports: {}};

	/**
	 * @typedef {Object} Callback
	 * @property {Function} func - The callback function.
	 * @property {number} accepted_args - The number of arguments the function accepts.
	 */

	var Hook_1;
	var hasRequiredHook;

	function requireHook () {
		if (hasRequiredHook) return Hook_1;
		hasRequiredHook = 1;
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

		Hook_1 = Hook;
		return Hook_1;
	}

	var hasRequiredHooker;

	function requireHooker () {
		if (hasRequiredHooker) return Hooker$1.exports;
		hasRequiredHooker = 1;
		const Hook = requireHook();

		/**
		 * A class for managing hooks (actions and filters), inspired by the WordPress hook system.
		 * This allows for a flexible, event-driven architecture.
		 * @class
		 */
		class Hooker {
			constructor() {
				/** @private @type {Map<string, Hook>} */
				this.hooks = new Map();
				/** @private @type {Map<string, number>} */
				this.actionCounter = new Map();
				/** @private @type {string[]} */
				this.currentActions = [];
				/** @private @type {string[]} */
				this.currentFilters = [];
			}

			/**
			 * Gets or creates a hook instance.
			 * @private
			 * @param {string} hook - The name of the hook.
			 * @returns {Hook} The hook instance.
			 */
			_getHook(hook) {
				if (!this.hooks.has(hook)) {
					this.hooks.set(hook, new Hook(hook));
				}
				return this.hooks.get(hook);
			}

			/**
			 * Registers a callback for a specific hook.
			 * @param {string} hook - The name of the hook.
			 * @param {Function} callback - The callback function.
			 * @param {number} [priority=10] - The execution priority.
			 * @param {number} [accepted_args=1] - The number of arguments the callback accepts.
			 */
			add(hook, callback, priority = 10, accepted_args = 1) {
				if (typeof callback !== 'function') {
					console.error(`The callback for hook '${hook}' must be a function.`);
					return;
				}
				this._getHook(hook).add(callback, priority, accepted_args);
			}
			
			add_action(hook, callback, priority = 10, accepted_args = 1) {
				this.add(hook, callback, priority, accepted_args);
			}
			
			add_filter(hook, callback, priority = 10, accepted_args = 1) {
				this.add(hook, callback, priority, accepted_args);
			}

			/**
			 * Removes a specific callback from a hook.
			 * @param {string} hook - The name of the hook.
			 * @param {Function} callback - The specific function to remove.
			 * @param {number} [priority] - The priority of the function to remove.
			 * @returns {boolean} True if the callback was removed, false otherwise.
			 */
			remove(hook, callback, priority) {
				if (this.hooks.has(hook)) {
					return this._getHook(hook).remove(callback, priority);
				}
				return false;
			}
			
			remove_action(hook, callback, priority) {
				return this.remove(hook, callback, priority);
			}

			remove_filter(hook, callback, priority) {
				return this.remove(hook, callback, priority);
			}
			
			/**
			 * Removes all callbacks for a specific hook.
			 * @param {string} hook - The name of the hook.
			 * @param {number} [priority] - If specified, only callbacks with this priority are removed.
			 */
			remove_all(hook, priority){
				if (this.hooks.has(hook)) {
					this._getHook(hook).removeAll(priority);
				}
			}
			
			remove_all_actions(hook, priority){
				this.remove_all(hook, priority);
			}
			
			remove_all_filters(hook, priority){
				this.remove_all(hook, priority);
			}
			
			/**
			 * Checks if a callback is registered for a hook.
			 * @param {string} hook - The name of the hook.
			 * @param {Function} [callback=false] - Optional callback to check for.
			 * @returns {boolean}
			 */
			has(hook, callback = false) {
				return this.hooks.has(hook) && this._getHook(hook).has(callback);
			}
			
			has_action(hook, callback = false) {
				return this.has(hook, callback);
			}

			has_filter(hook, callback = false) {
				return this.has(hook, callback);
			}

			/**
			 * Executes all callbacks for an action hook.
			 * @param {string} hook - The name of the action to execute.
			 * @param {...*} [args] - Arguments to pass to the action callbacks.
			 */
			do_action(hook, ...args) {
				if (!this.hooks.has(hook)) return;

				const count = this.actionCounter.get(hook) || 0;
				this.actionCounter.set(hook, count + 1);
				
				this.currentActions.push(hook);
				try {
					this._getHook(hook).exec(...args);
				} finally {
					this.currentActions.pop();
				}
			}

			do_action_ref_array(hook, args_array = []) {
				this.do_action(hook, ...args_array);
			}

			/**
			 * Applies all registered filters to a value.
			 * @param {string} hook - The name of the filter.
			 * @param {*} value - The initial value to be filtered.
			 * @param {...*} [args] - Additional arguments to pass to the filter callbacks.
			 * @returns {*} The modified value.
			 */
			apply_filters(hook, value, ...args) {
				if (!this.hooks.has(hook)) return value;
				
				this.currentFilters.push(hook);
				try {
					return this._getHook(hook).apply(value, ...args);
				} finally {
					this.currentFilters.pop();
				}
			}

			apply_filters_ref_array(hook, args_array = []) {
				return this.apply_filters(hook, ...args_array);
			}

			/**
			 * Gets the number of times an action has been fired.
			 * @param {string} hook - The name of the action.
			 * @returns {number}
			 */
			did_action(hook) {
				return this.actionCounter.get(hook) || 0;
			}
			
			/**
			 * Gets the name of the currently running action.
			 * @returns {string|null}
			 */
			current_action() {
				return this.currentActions.length > 0 ? this.currentActions[this.currentActions.length - 1] : null;
			}
			
			/**
			 * Gets the name of the currently running filter.
			 * @returns {string|null}
			 */
			current_filter() {
				return this.currentFilters.length > 0 ? this.currentFilters[this.currentFilters.length - 1] : null;
			}
			
			/**
			 * Checks if a specific action is currently running.
			 * @param {string|null} [hook=null] - The name of the action. If null, checks for any action.
			 * @returns {boolean}
			 */
			doing_action(hook = null) {
				if (hook === null) {
					return this.currentActions.length > 0;
				}
				return this.currentActions.includes(hook);
			}

			/**
			 * Checks if a specific filter is currently running.
			 * @param {string|null} [hook=null] - The name of the filter. If null, checks for any filter.
			 * @returns {boolean}
			 */
			doing_filter(hook = null) {
				if (hook === null) {
					return this.currentFilters.length > 0;
				}
				return this.currentFilters.includes(hook);
			}
			
			// --- Legacy aliases for backward compatibility ---
			exec(hook, ...args) { this.do_action(hook, ...args); }
			apply(hook, value, ...args) { return this.apply_filters(hook, value, ...args); }
			filter(hook, value, ...args) { return this.apply_filters(hook, value, ...args); }
		}

		Hooker$1.exports = new Hooker();
		Hooker$1.exports.Hooker = Hooker;
		return Hooker$1.exports;
	}

	var HookerExports = requireHooker();
	var Hooker = /*@__PURE__*/getDefaultExportFromCjs(HookerExports);

	return Hooker;

}));
