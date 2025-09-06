# node-hooker

A powerful and flexible **hook system** for **Node.js**, inspired by the **WordPress actions** and filters API. This package provides a simple yet effective way to create extensible and decoupled architectures in your JavaScript applications.

[![Version](https://img.shields.io/badge/Version-2025.09.06-blue.svg)](https://github.com/mamedul/node-hooker/)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mamedul/node-hooker/blob/main/LICENSE) &nbsp;&nbsp; [![GitHub stars](https://img.shields.io/github/stars/mamedul/node-hooker?style=social)](https://github.com/mamedul/node-hooker/stargazers) &nbsp;&nbsp; [![GitHub forks](https://img.shields.io/github/forks/mamedul/node-hooker?style=social)](https://github.com/mamedul/node-hooker/network/members) &nbsp;&nbsp; [![GitHub watchers](https://img.shields.io/github/watchers/mamedul/node-hooker?style=social)](https://github.com/mamedul/node-hooker/watchers) &nbsp;&nbsp; [![GitHub followers](https://img.shields.io/github/followers/mamedul?style=social)](https://github.com/mamedul?tab=followers)
[![Hire Me](https://img.shields.io/badge/Hire%20Me-Available-brightgreen.svg)](http://mamedul.github.io/)


_\[ It is designed to be cross-platform, supporting modern ES2015+ environments as well as vanilla JavaScript setups. \]_

## Features

*   **Full WordPress Hook API compatibility:** Implements the vast majority of WP hook functions.
    
*   **Actions (`do_action`):** Create points in your code where other functions can be executed.
    
*   **Filters (`apply_filters`):** Create points in your code where data can be modified.
    
*   **Priority-based execution:** Control the order in which callbacks are executed.
    
*   **Hook Inspection:** Check if hooks exist, how many times they've run, and what's currently running.
    
*   **Easy to use:** A simple and intuitive API.
    
*   **Zero dependencies:** Lightweight and self-contained.
    

## Installation

You can install package via-

✅ **1. npm install**

This is the **standard** way to install any Node.js package.

```bash
npm install node-hooker
```

Or-


✅ **2. Yarn**

Yes — Yarn can install npm packages, because it uses the same npm registry under the hood ( Equivalent to `npm install node-hooker` ):

```bash
yarn add node-hooker
```

---

✅ **Test**

After install- you can then run your tests from the terminal simply by using the command:

```bash
npm test
```


## Quick Start

```js
const hooker = require('node-hooker');

// --- ACTIONS ---
// 1. Register a function for an action hook
function myActionCallback(arg1, arg2) {
    console.log(`Action running! Args: ${arg1}, ${arg2}`);
    console.log(`Currently doing action: ${hooker.current_action()}`);
}
hooker.add_action('app_init', myActionCallback, 10, 2);

// 2. Trigger the action hook
console.log('Doing action...');
hooker.do_action('app_init', 'user_id_123', { setting: 'on' });
console.log(`'app_init' has run ${hooker.did_action('app_init')} time(s).`);


// --- FILTERS ---
// 1. Register a function for a filter hook
function myFilterCallback(text) {
    return text.toUpperCase();
}
hooker.add_filter('format_title', myFilterCallback);

// 2. Trigger the filter hook and use the modified value
let title = 'Hello World';
title = hooker.apply_filters('format_title', title);
console.log(title); // Output: HELLO WORLD
```

## API Reference

### 1\. Registering Hooks

| Function | Purpose |
| --- | --- |
| `add_action(hook, callback, priority, args)` | Attach a function to an action hook. |
| `add_filter(hook, callback, priority, args)` | Attach a function to a filter hook. |

### 2\. Triggering Hooks

| Function | Purpose |
| --- | --- |
| `do_action(hook, ...args)` | Trigger an action hook (run all attached callbacks). |
| `do_action_ref_array(hook, args_array)` | Same as `do_action()`, but pass arguments as an array. |
| `apply_filters(hook, value, ...args)` | Trigger a filter hook, passing `$value` through each callback. |
| `apply_filters_ref_array(hook, args_array)` | Same as `apply_filters()`, but arguments are passed as an array. |

### 3\. Removing Hooks

| Function | Purpose |
| --- | --- |
| `remove_action(hook, callback, priority)` | Remove a previously added action callback. |
| `remove_filter(hook, callback, priority)` | Remove a previously added filter callback. |
| `remove_all_actions(hook, priority)` | Remove all callbacks for a specific action hook (or priority). |
| `remove_all_filters(hook, priority)` | Remove all callbacks for a specific filter hook (or priority). |

### 4\. Inspecting Hooks

| Function | Purpose |
| --- | --- |
| `has_action(hook, callback = false)` | Check if a function is hooked to an action (or if any callbacks exist). |
| `has_filter(hook, callback = false)` | Check if a function is hooked to a filter (or if any callbacks exist). |
| `did_action(hook)` | Returns how many times an action has run. |
| `current_action()` | Get the name of the currently running action hook. |
| `current_filter()` | Get the name of the currently running filter hook. |
| `doing_action(hook = null)` | Check if a specific action (or any action) is currently running. |
| `doing_filter(hook = null)` | Check if a specific filter (or any filter) is currently running. |

## Advanced Usage: Custom Instances

While the singleton is convenient, you can create isolated instances of the `Hooker` class for separate event buses.

```js
const { Hooker } = require('node-hooker');
const myInstance = new Hooker();

myInstance.add_action('my_hook', () => console.log('Hello from my instance!'));
myInstance.do_action('my_hook');
```


## Files

Files structures/ tree

```bash
node-hooker/
├── lib/
│   └── Hooker.js
│   └── Hook.js
├── test.js
├── package.json
├── README.md
└── CHANGELOG.md
```

## License

This extensible codes is licensed under the **MIT License**. Copyright (c) 2022 by [**Mamedul Islam**](https://mamedul.github.io/).

See the [LICENSE](https://opensource.org/licenses/MIT) file for more details.

---

## 👨‍💻 Author & Hire Me

This extensible codes was created and is maintained by [**Mamedul Islam**](https://mamedul.github.io/).


Me as a passionate **web developer** with experience in creating interactive and user-friendly web components. Currently *available for freelance projects* or full-time opportunities.

Helping businesses grow their online presence with custom web solutions. Specializing in **WordPress**, **WooCommerce**, and **Shopify**. Building modern, responsive, and high-performance scalable websites with custom made plugins, codes, customizations.

* **WhatsApp**: [message me](https://wa.me/8801847406830?text=Hi%2C%20I%27d%20like%20to%20hire%20you.)
* **Portfolio**: [mamedul.github.io](https://mamedul.github.io/)
* **GitHub**: [@mamedul](https://github.com/mamedul)
* **LinkedIn**: [Connect with me!](https://www.linkedin.com/in/mamedul/)
* **Twitter (X)**: [@mamedul](https://www.x.com/mamedul/)


[![Hire Me](https://img.shields.io/badge/Hire%20Me-Available-brightgreen.svg)](https://mamedul.github.io/)

---

### ⭐ Show Your Support

If you find this extension useful, please consider giving it a star on GitHub! Your support helps motivate further development and improvements.

[![GitHub stars](https://img.shields.io/github/stars/mamedul/node-hooker?style=for-the-badge)](https://github.com/mamedul/node-hooker/stargazers) &nbsp;

If you found this project helpful, give it a ⭐ on GitHub!
