const assert = require('assert');
const hooker = require('./lib/Hooker.js');
const { Hooker } = require('./lib/Hooker.js');

//const hooker = require('./node-hooker');
//const { Hooker } = require('./node-hooker');


console.log('Running tests for node-hooker v2...');

let testCount = 0;
let passCount = 0;

function test(description, fn) {
    testCount++;
    try {
        fn();
        passCount++;
        console.log(`\x1b[32m✔\x1b[0m ${description}`);
    } catch (error) {
        console.error(`\x1b[31m✖\x1b[0m ${description}`);
        console.error(error);
        process.exit(1);
    }
}

// Reset singleton state between tests
function createCleanInstance() {
    return new Hooker();
}

let freshHooker;

// --- REGISTRATION & TRIGGERING ---
test('should execute action with do_action', () => {
    freshHooker = createCleanInstance();
    let executed = false;
    freshHooker.add_action('test_1', () => { executed = true; });
    freshHooker.do_action('test_1');
    assert.strictEqual(executed, true);
});

test('should apply filter with apply_filters', () => {
    freshHooker = createCleanInstance();
    freshHooker.add_filter('test_2', (v) => v.toUpperCase());
    const result = freshHooker.apply_filters('test_2', 'hello');
    assert.strictEqual(result, 'HELLO');
});

test('should execute action with do_action_ref_array', () => {
    freshHooker = createCleanInstance();
    let result = '';
    freshHooker.add_action('test_3', (a, b) => { result = `${a} ${b}`; }, 10, 2);
    freshHooker.do_action_ref_array('test_3', ['Hello', 'World']);
    assert.strictEqual(result, 'Hello World');
});

test('should apply filter with apply_filters_ref_array', () => {
    freshHooker = createCleanInstance();
    freshHooker.add_filter('test_4', (v, a) => `${v}${a}`, 10, 2);
    const result = freshHooker.apply_filters_ref_array('test_4', ['Hello', '!']);
    assert.strictEqual(result, 'Hello!');
});

// --- REMOVAL ---
test('should remove action with specific priority using remove_action', () => {
    freshHooker = createCleanInstance();
    let priority10Hookered = false;
    let priority20Hookered = false;
    const cb1 = () => { priority10Hookered = true; };
    const cb2 = () => { priority20Hookered = true; };
    freshHooker.add_action('test_5', cb1, 10);
    freshHooker.add_action('test_5', cb2, 20);
    freshHooker.remove_action('test_5', cb1, 10);
    freshHooker.do_action('test_5');
    assert.strictEqual(priority10Hookered, false, 'Priority 10 should have been removed');
    assert.strictEqual(priority20Hookered, true, 'Priority 20 should still exist');
});

test('should remove all actions for a hook with remove_all_actions', () => {
    freshHooker = createCleanInstance();
    let called = false;
    freshHooker.add_action('test_6', () => { called = true; });
    freshHooker.remove_all_actions('test_6');
    freshHooker.do_action('test_6');
    assert.strictEqual(called, false);
});

test('should remove all filters for a specific priority with remove_all_filters', () => {
    freshHooker = createCleanInstance();
    const cb1 = v => v + 'A';
    const cb2 = v => v + 'B';
    freshHooker.add_filter('test_7', cb1, 10);
    freshHooker.add_filter('test_7', cb2, 20);
    freshHooker.remove_all_filters('test_7', 10);
    const result = freshHooker.apply_filters('test_7', '');
    assert.strictEqual(result, 'B');
});

// --- INSPECTION ---
test('has_action should return true for existing action, false otherwise', () => {
    freshHooker = createCleanInstance();
    const cb = () => {};
    freshHooker.add_action('test_8', cb);
    assert.strictEqual(freshHooker.has_action('test_8'), true);
    assert.strictEqual(freshHooker.has_action('test_8', cb), true);
    assert.strictEqual(freshHooker.has_action('test_8_nonexistent'), false);
    assert.strictEqual(freshHooker.has_action('test_8', () => {}), false);
});

test('has_filter should work correctly', () => {
    freshHooker = createCleanInstance();
    const cb = v => v;
    freshHooker.add_filter('test_9', cb);
    assert.strictEqual(freshHooker.has_filter('test_9'), true);
    assert.strictEqual(freshHooker.has_filter('test_9', cb), true);
});

test('did_action should return correct execution count', () => {
    freshHooker = createCleanInstance();
    freshHooker.add_action('test_10', () => {});
    assert.strictEqual(freshHooker.did_action('test_10'), 0);
    freshHooker.do_action('test_10');
    freshHooker.do_action('test_10');
    assert.strictEqual(freshHooker.did_action('test_10'), 2);
    assert.strictEqual(freshHooker.did_action('test_10_nonexistent'), 0);
});

test('current_action should return the current action name', () => {
    freshHooker = createCleanInstance();
    assert.strictEqual(freshHooker.current_action(), null);
    freshHooker.add_action('test_11', () => {
        assert.strictEqual(freshHooker.current_action(), 'test_11');
    });
    freshHooker.do_action('test_11');
    assert.strictEqual(freshHooker.current_action(), null);
});

test('current_filter should return the current filter name, even inside an action', () => {
    freshHooker = createCleanInstance();
    freshHooker.add_filter('test_12_filter', v => v);
    freshHooker.add_action('test_12_action', () => {
        assert.strictEqual(freshHooker.current_action(), 'test_12_action');
        assert.strictEqual(freshHooker.current_filter(), null);
        freshHooker.apply_filters('test_12_filter', '');
        assert.strictEqual(freshHooker.current_action(), 'test_12_action');
    });
    freshHooker.do_action('test_12_action');
});

test('doing_action should correctly report status', () => {
    freshHooker = createCleanInstance();
    assert.strictEqual(freshHooker.doing_action(), false);
    freshHooker.add_action('test_13', () => {
        assert.strictEqual(freshHooker.doing_action(), true);
        assert.strictEqual(freshHooker.doing_action('test_13'), true);
        assert.strictEqual(freshHooker.doing_action('nonexistent'), false);
    });
    freshHooker.do_action('test_13');
    assert.strictEqual(freshHooker.doing_action(), false);
});

test('doing_filter should correctly report status', () => {
    freshHooker = createCleanInstance();
    assert.strictEqual(freshHooker.doing_filter(), false);
    freshHooker.add_filter('test_14', v => {
        assert.strictEqual(freshHooker.doing_filter(), true);
        assert.strictEqual(freshHooker.doing_filter('test_14'), true);
        return v;
    });
    freshHooker.apply_filters('test_14', '');
    assert.strictEqual(freshHooker.doing_filter(), false);
});

console.log(`\n--- Test Summary ---`);
console.log(`Total: ${testCount}`);
console.log(`Passed: ${passCount}`);
if (testCount === passCount) {
    console.log('\x1b[32mAll tests passed!\x1b[0m');
} else {
    console.error(`\x1b[31m${testCount - passCount} tests failed.\x1b[0m`);
    process.exit(1);
}

