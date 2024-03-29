
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop$1(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop$1(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function getAllContexts() {
        return get_current_component().$$.context;
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop$1(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop$1(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop$1(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }
    /**
     * Base class to create strongly typed Svelte components.
     * This only exists for typing purposes and should be used in `.d.ts` files.
     *
     * ### Example:
     *
     * You have component library on npm called `component-library`, from which
     * you export a component called `MyComponent`. For Svelte+TypeScript users,
     * you want to provide typings. Therefore you create a `index.d.ts`:
     * ```ts
     * import { SvelteComponentTyped } from "svelte";
     * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
     * ```
     * Typing this makes it possible for IDEs like VS Code with the Svelte extension
     * to provide intellisense and to use the component like this in a Svelte file
     * with TypeScript:
     * ```svelte
     * <script lang="ts">
     * 	import { MyComponent } from "component-library";
     * </script>
     * <MyComponent foo={'bar'} />
     * ```
     *
     * #### Why not make this part of `SvelteComponent(Dev)`?
     * Because
     * ```ts
     * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
     * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
     * ```
     * will throw a type error, so we need to separate the more strictly typed class.
     */
    class SvelteComponentTyped extends SvelteComponentDev {
        constructor(options) {
            super(options);
        }
    }

    /* src\LetterContainer\Letter.svelte generated by Svelte v3.49.0 */

    const file$g = "src\\LetterContainer\\Letter.svelte";

    // (11:4) {#if letter.letter}
    function create_if_block$5(ctx) {
    	let t_value = /*letter*/ ctx[0].letter + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*letter*/ 1 && t_value !== (t_value = /*letter*/ ctx[0].letter + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(11:4) {#if letter.letter}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let if_block = /*letter*/ ctx[0].letter && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "letter svelte-we6obl");
    			toggle_class(div, "game_lost", /*letter*/ ctx[0].game_state === "game_lost");
    			toggle_class(div, "game_won", /*letter*/ ctx[0].game_state === "game_won");
    			toggle_class(div, "incorrect", /*letter*/ ctx[0].state === "incorrect");
    			toggle_class(div, "misplaced", /*letter*/ ctx[0].state === "misplaced");
    			toggle_class(div, "correct", /*letter*/ ctx[0].state === "correct");
    			add_location(div, file$g, 4, 0, 46);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*letter*/ ctx[0].letter) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*letter*/ 1) {
    				toggle_class(div, "game_lost", /*letter*/ ctx[0].game_state === "game_lost");
    			}

    			if (dirty & /*letter*/ 1) {
    				toggle_class(div, "game_won", /*letter*/ ctx[0].game_state === "game_won");
    			}

    			if (dirty & /*letter*/ 1) {
    				toggle_class(div, "incorrect", /*letter*/ ctx[0].state === "incorrect");
    			}

    			if (dirty & /*letter*/ 1) {
    				toggle_class(div, "misplaced", /*letter*/ ctx[0].state === "misplaced");
    			}

    			if (dirty & /*letter*/ 1) {
    				toggle_class(div, "correct", /*letter*/ ctx[0].state === "correct");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Letter', slots, []);
    	let { letter } = $$props;
    	const writable_props = ['letter'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Letter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('letter' in $$props) $$invalidate(0, letter = $$props.letter);
    	};

    	$$self.$capture_state = () => ({ letter });

    	$$self.$inject_state = $$props => {
    		if ('letter' in $$props) $$invalidate(0, letter = $$props.letter);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [letter];
    }

    class Letter$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { letter: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Letter",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*letter*/ ctx[0] === undefined && !('letter' in props)) {
    			console.warn("<Letter> was created without expected prop 'letter'");
    		}
    	}

    	get letter() {
    		throw new Error("<Letter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set letter(value) {
    		throw new Error("<Letter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // external events
    const FINALIZE_EVENT_NAME = "finalize";
    const CONSIDER_EVENT_NAME = "consider";

    /**
     * @typedef {Object} Info
     * @property {string} trigger
     * @property {string} id
     * @property {string} source
     * @param {Node} el
     * @param {Array} items
     * @param {Info} info
     */
    function dispatchFinalizeEvent(el, items, info) {
        el.dispatchEvent(
            new CustomEvent(FINALIZE_EVENT_NAME, {
                detail: {items, info}
            })
        );
    }

    /**
     * Dispatches a consider event
     * @param {Node} el
     * @param {Array} items
     * @param {Info} info
     */
    function dispatchConsiderEvent(el, items, info) {
        el.dispatchEvent(
            new CustomEvent(CONSIDER_EVENT_NAME, {
                detail: {items, info}
            })
        );
    }

    // internal events
    const DRAGGED_ENTERED_EVENT_NAME = "draggedEntered";
    const DRAGGED_LEFT_EVENT_NAME = "draggedLeft";
    const DRAGGED_OVER_INDEX_EVENT_NAME = "draggedOverIndex";
    const DRAGGED_LEFT_DOCUMENT_EVENT_NAME = "draggedLeftDocument";

    const DRAGGED_LEFT_TYPES = {
        LEFT_FOR_ANOTHER: "leftForAnother",
        OUTSIDE_OF_ANY: "outsideOfAny"
    };

    function dispatchDraggedElementEnteredContainer(containerEl, indexObj, draggedEl) {
        containerEl.dispatchEvent(
            new CustomEvent(DRAGGED_ENTERED_EVENT_NAME, {
                detail: {indexObj, draggedEl}
            })
        );
    }

    /**
     * @param containerEl - the dropzone the element left
     * @param draggedEl - the dragged element
     * @param theOtherDz - the new dropzone the element entered
     */
    function dispatchDraggedElementLeftContainerForAnother(containerEl, draggedEl, theOtherDz) {
        containerEl.dispatchEvent(
            new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
                detail: {draggedEl, type: DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER, theOtherDz}
            })
        );
    }

    function dispatchDraggedElementLeftContainerForNone(containerEl, draggedEl) {
        containerEl.dispatchEvent(
            new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
                detail: {draggedEl, type: DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY}
            })
        );
    }
    function dispatchDraggedElementIsOverIndex(containerEl, indexObj, draggedEl) {
        containerEl.dispatchEvent(
            new CustomEvent(DRAGGED_OVER_INDEX_EVENT_NAME, {
                detail: {indexObj, draggedEl}
            })
        );
    }
    function dispatchDraggedLeftDocument(draggedEl) {
        window.dispatchEvent(
            new CustomEvent(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, {
                detail: {draggedEl}
            })
        );
    }

    const TRIGGERS = {
        DRAG_STARTED: "dragStarted",
        DRAGGED_ENTERED: DRAGGED_ENTERED_EVENT_NAME,
        DRAGGED_ENTERED_ANOTHER: "dragEnteredAnother",
        DRAGGED_OVER_INDEX: DRAGGED_OVER_INDEX_EVENT_NAME,
        DRAGGED_LEFT: DRAGGED_LEFT_EVENT_NAME,
        DRAGGED_LEFT_ALL: "draggedLeftAll",
        DROPPED_INTO_ZONE: "droppedIntoZone",
        DROPPED_INTO_ANOTHER: "droppedIntoAnother",
        DROPPED_OUTSIDE_OF_ANY: "droppedOutsideOfAny",
        DRAG_STOPPED: "dragStopped"
    };

    const SOURCES = {
        POINTER: "pointer",
        KEYBOARD: "keyboard"
    };

    const SHADOW_ITEM_MARKER_PROPERTY_NAME = "isDndShadowItem";
    const SHADOW_ELEMENT_ATTRIBUTE_NAME = "data-is-dnd-shadow-item";
    const SHADOW_PLACEHOLDER_ITEM_ID = "id:dnd-shadow-placeholder-0000";
    const DRAGGED_ELEMENT_ID = "dnd-action-dragged-el";

    let ITEM_ID_KEY = "id";
    let activeDndZoneCount = 0;
    function incrementActiveDropZoneCount() {
        activeDndZoneCount++;
    }
    function decrementActiveDropZoneCount() {
        if (activeDndZoneCount === 0) {
            throw new Error("Bug! trying to decrement when there are no dropzones");
        }
        activeDndZoneCount--;
    }

    const isOnServer = typeof window === "undefined";

    // This is based off https://stackoverflow.com/questions/27745438/how-to-compute-getboundingclientrect-without-considering-transforms/57876601#57876601
    // It removes the transforms that are potentially applied by the flip animations
    /**
     * Gets the bounding rect but removes transforms (ex: flip animation)
     * @param {HTMLElement} el
     * @return {{top: number, left: number, bottom: number, right: number}}
     */
    function getBoundingRectNoTransforms(el) {
        let ta;
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const tx = style.transform;

        if (tx) {
            let sx, sy, dx, dy;
            if (tx.startsWith("matrix3d(")) {
                ta = tx.slice(9, -1).split(/, /);
                sx = +ta[0];
                sy = +ta[5];
                dx = +ta[12];
                dy = +ta[13];
            } else if (tx.startsWith("matrix(")) {
                ta = tx.slice(7, -1).split(/, /);
                sx = +ta[0];
                sy = +ta[3];
                dx = +ta[4];
                dy = +ta[5];
            } else {
                return rect;
            }

            const to = style.transformOrigin;
            const x = rect.x - dx - (1 - sx) * parseFloat(to);
            const y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(" ") + 1));
            const w = sx ? rect.width / sx : el.offsetWidth;
            const h = sy ? rect.height / sy : el.offsetHeight;
            return {
                x: x,
                y: y,
                width: w,
                height: h,
                top: y,
                right: x + w,
                bottom: y + h,
                left: x
            };
        } else {
            return rect;
        }
    }

    /**
     * Gets the absolute bounding rect (accounts for the window's scroll position and removes transforms)
     * @param {HTMLElement} el
     * @return {{top: number, left: number, bottom: number, right: number}}
     */
    function getAbsoluteRectNoTransforms(el) {
        const rect = getBoundingRectNoTransforms(el);
        return {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            right: rect.right + window.scrollX
        };
    }

    /**
     * Gets the absolute bounding rect (accounts for the window's scroll position)
     * @param {HTMLElement} el
     * @return {{top: number, left: number, bottom: number, right: number}}
     */
    function getAbsoluteRect(el) {
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            right: rect.right + window.scrollX
        };
    }

    /**
     * finds the center :)
     * @typedef {Object} Rect
     * @property {number} top
     * @property {number} bottom
     * @property {number} left
     * @property {number} right
     * @param {Rect} rect
     * @return {{x: number, y: number}}
     */
    function findCenter(rect) {
        return {
            x: (rect.left + rect.right) / 2,
            y: (rect.top + rect.bottom) / 2
        };
    }

    /**
     * @typedef {Object} Point
     * @property {number} x
     * @property {number} y
     * @param {Point} pointA
     * @param {Point} pointB
     * @return {number}
     */
    function calcDistance(pointA, pointB) {
        return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
    }

    /**
     * @param {Point} point
     * @param {Rect} rect
     * @return {boolean|boolean}
     */
    function isPointInsideRect(point, rect) {
        return point.y <= rect.bottom && point.y >= rect.top && point.x >= rect.left && point.x <= rect.right;
    }

    /**
     * find the absolute coordinates of the center of a dom element
     * @param el {HTMLElement}
     * @returns {{x: number, y: number}}
     */
    function findCenterOfElement(el) {
        return findCenter(getAbsoluteRect(el));
    }

    /**
     * @param {HTMLElement} elA
     * @param {HTMLElement} elB
     * @return {boolean}
     */
    function isCenterOfAInsideB(elA, elB) {
        const centerOfA = findCenterOfElement(elA);
        const rectOfB = getAbsoluteRectNoTransforms(elB);
        return isPointInsideRect(centerOfA, rectOfB);
    }

    /**
     * @param {HTMLElement|ChildNode} elA
     * @param {HTMLElement|ChildNode} elB
     * @return {number}
     */
    function calcDistanceBetweenCenters(elA, elB) {
        const centerOfA = findCenterOfElement(elA);
        const centerOfB = findCenterOfElement(elB);
        return calcDistance(centerOfA, centerOfB);
    }

    /**
     * @param {HTMLElement} el - the element to check
     * @returns {boolean} - true if the element in its entirety is off screen including the scrollable area (the normal dom events look at the mouse rather than the element)
     */
    function isElementOffDocument(el) {
        const rect = getAbsoluteRect(el);
        return rect.right < 0 || rect.left > document.documentElement.scrollWidth || rect.bottom < 0 || rect.top > document.documentElement.scrollHeight;
    }

    /**
     * If the point is inside the element returns its distances from the sides, otherwise returns null
     * @param {Point} point
     * @param {HTMLElement} el
     * @return {null|{top: number, left: number, bottom: number, right: number}}
     */
    function calcInnerDistancesBetweenPointAndSidesOfElement(point, el) {
        const rect = getAbsoluteRect(el);
        if (!isPointInsideRect(point, rect)) {
            return null;
        }
        return {
            top: point.y - rect.top,
            bottom: rect.bottom - point.y,
            left: point.x - rect.left,
            // TODO - figure out what is so special about right (why the rect is too big)
            right: Math.min(rect.right, document.documentElement.clientWidth) - point.x
        };
    }

    let dzToShadowIndexToRect;

    /**
     * Resets the cache that allows for smarter "would be index" resolution. Should be called after every drag operation
     */
    function resetIndexesCache() {
        dzToShadowIndexToRect = new Map();
    }
    resetIndexesCache();

    /**
     * Resets the cache that allows for smarter "would be index" resolution for a specific dropzone, should be called after the zone was scrolled
     * @param {HTMLElement} dz
     */
    function resetIndexesCacheForDz(dz) {
        dzToShadowIndexToRect.delete(dz);
    }

    /**
     * Caches the coordinates of the shadow element when it's in a certain index in a certain dropzone.
     * Helpful in order to determine "would be index" more effectively
     * @param {HTMLElement} dz
     * @return {number} - the shadow element index
     */
    function cacheShadowRect(dz) {
        const shadowElIndex = Array.from(dz.children).findIndex(child => child.getAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME));
        if (shadowElIndex >= 0) {
            if (!dzToShadowIndexToRect.has(dz)) {
                dzToShadowIndexToRect.set(dz, new Map());
            }
            dzToShadowIndexToRect.get(dz).set(shadowElIndex, getAbsoluteRectNoTransforms(dz.children[shadowElIndex]));
            return shadowElIndex;
        }
        return undefined;
    }

    /**
     * @typedef {Object} Index
     * @property {number} index - the would be index
     * @property {boolean} isProximityBased - false if the element is actually over the index, true if it is not over it but this index is the closest
     */
    /**
     * Find the index for the dragged element in the list it is dragged over
     * @param {HTMLElement} floatingAboveEl
     * @param {HTMLElement} collectionBelowEl
     * @returns {Index|null} -  if the element is over the container the Index object otherwise null
     */
    function findWouldBeIndex(floatingAboveEl, collectionBelowEl) {
        if (!isCenterOfAInsideB(floatingAboveEl, collectionBelowEl)) {
            return null;
        }
        const children = collectionBelowEl.children;
        // the container is empty, floating element should be the first
        if (children.length === 0) {
            return {index: 0, isProximityBased: true};
        }
        const shadowElIndex = cacheShadowRect(collectionBelowEl);

        // the search could be more efficient but keeping it simple for now
        // a possible improvement: pass in the lastIndex it was found in and check there first, then expand from there
        for (let i = 0; i < children.length; i++) {
            if (isCenterOfAInsideB(floatingAboveEl, children[i])) {
                const cachedShadowRect = dzToShadowIndexToRect.has(collectionBelowEl) && dzToShadowIndexToRect.get(collectionBelowEl).get(i);
                if (cachedShadowRect) {
                    if (!isPointInsideRect(findCenterOfElement(floatingAboveEl), cachedShadowRect)) {
                        return {index: shadowElIndex, isProximityBased: false};
                    }
                }
                return {index: i, isProximityBased: false};
            }
        }
        // this can happen if there is space around the children so the floating element has
        //entered the container but not any of the children, in this case we will find the nearest child
        let minDistanceSoFar = Number.MAX_VALUE;
        let indexOfMin = undefined;
        // we are checking all of them because we don't know whether we are dealing with a horizontal or vertical container and where the floating element entered from
        for (let i = 0; i < children.length; i++) {
            const distance = calcDistanceBetweenCenters(floatingAboveEl, children[i]);
            if (distance < minDistanceSoFar) {
                minDistanceSoFar = distance;
                indexOfMin = i;
            }
        }
        return {index: indexOfMin, isProximityBased: true};
    }

    const SCROLL_ZONE_PX = 25;

    function makeScroller() {
        let scrollingInfo;
        function resetScrolling() {
            scrollingInfo = {directionObj: undefined, stepPx: 0};
        }
        resetScrolling();
        // directionObj {x: 0|1|-1, y:0|1|-1} - 1 means down in y and right in x
        function scrollContainer(containerEl) {
            const {directionObj, stepPx} = scrollingInfo;
            if (directionObj) {
                containerEl.scrollBy(directionObj.x * stepPx, directionObj.y * stepPx);
                window.requestAnimationFrame(() => scrollContainer(containerEl));
            }
        }
        function calcScrollStepPx(distancePx) {
            return SCROLL_ZONE_PX - distancePx;
        }

        /**
         * If the pointer is next to the sides of the element to scroll, will trigger scrolling
         * Can be called repeatedly with updated pointer and elementToScroll values without issues
         * @return {boolean} - true if scrolling was needed
         */
        function scrollIfNeeded(pointer, elementToScroll) {
            if (!elementToScroll) {
                return false;
            }
            const distances = calcInnerDistancesBetweenPointAndSidesOfElement(pointer, elementToScroll);
            if (distances === null) {
                resetScrolling();
                return false;
            }
            const isAlreadyScrolling = !!scrollingInfo.directionObj;
            let [scrollingVertically, scrollingHorizontally] = [false, false];
            // vertical
            if (elementToScroll.scrollHeight > elementToScroll.clientHeight) {
                if (distances.bottom < SCROLL_ZONE_PX) {
                    scrollingVertically = true;
                    scrollingInfo.directionObj = {x: 0, y: 1};
                    scrollingInfo.stepPx = calcScrollStepPx(distances.bottom);
                } else if (distances.top < SCROLL_ZONE_PX) {
                    scrollingVertically = true;
                    scrollingInfo.directionObj = {x: 0, y: -1};
                    scrollingInfo.stepPx = calcScrollStepPx(distances.top);
                }
                if (!isAlreadyScrolling && scrollingVertically) {
                    scrollContainer(elementToScroll);
                    return true;
                }
            }
            // horizontal
            if (elementToScroll.scrollWidth > elementToScroll.clientWidth) {
                if (distances.right < SCROLL_ZONE_PX) {
                    scrollingHorizontally = true;
                    scrollingInfo.directionObj = {x: 1, y: 0};
                    scrollingInfo.stepPx = calcScrollStepPx(distances.right);
                } else if (distances.left < SCROLL_ZONE_PX) {
                    scrollingHorizontally = true;
                    scrollingInfo.directionObj = {x: -1, y: 0};
                    scrollingInfo.stepPx = calcScrollStepPx(distances.left);
                }
                if (!isAlreadyScrolling && scrollingHorizontally) {
                    scrollContainer(elementToScroll);
                    return true;
                }
            }
            resetScrolling();
            return false;
        }

        return {
            scrollIfNeeded,
            resetScrolling
        };
    }

    /**
     * @param {Object} object
     * @return {string}
     */
    function toString(object) {
        return JSON.stringify(object, null, 2);
    }

    /**
     * Finds the depth of the given node in the DOM tree
     * @param {HTMLElement} node
     * @return {number} - the depth of the node
     */
    function getDepth(node) {
        if (!node) {
            throw new Error("cannot get depth of a falsy node");
        }
        return _getDepth(node, 0);
    }
    function _getDepth(node, countSoFar = 0) {
        if (!node.parentElement) {
            return countSoFar - 1;
        }
        return _getDepth(node.parentElement, countSoFar + 1);
    }

    /**
     * A simple util to shallow compare objects quickly, it doesn't validate the arguments so pass objects in
     * @param {Object} objA
     * @param {Object} objB
     * @return {boolean} - true if objA and objB are shallow equal
     */
    function areObjectsShallowEqual(objA, objB) {
        if (Object.keys(objA).length !== Object.keys(objB).length) {
            return false;
        }
        for (const keyA in objA) {
            if (!{}.hasOwnProperty.call(objB, keyA) || objB[keyA] !== objA[keyA]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Shallow compares two arrays
     * @param arrA
     * @param arrB
     * @return {boolean} - whether the arrays are shallow equal
     */
    function areArraysShallowEqualSameOrder(arrA, arrB) {
        if (arrA.length !== arrB.length) {
            return false;
        }
        for (let i = 0; i < arrA.length; i++) {
            if (arrA[i] !== arrB[i]) {
                return false;
            }
        }
        return true;
    }

    const INTERVAL_MS$1 = 200;
    const TOLERANCE_PX = 10;
    const {scrollIfNeeded: scrollIfNeeded$1, resetScrolling: resetScrolling$1} = makeScroller();
    let next$1;

    /**
     * Tracks the dragged elements and performs the side effects when it is dragged over a drop zone (basically dispatching custom-events scrolling)
     * @param {Set<HTMLElement>} dropZones
     * @param {HTMLElement} draggedEl
     * @param {number} [intervalMs = INTERVAL_MS]
     */
    function observe(draggedEl, dropZones, intervalMs = INTERVAL_MS$1) {
        // initialization
        let lastDropZoneFound;
        let lastIndexFound;
        let lastIsDraggedInADropZone = false;
        let lastCentrePositionOfDragged;
        // We are sorting to make sure that in case of nested zones of the same type the one "on top" is considered first
        const dropZonesFromDeepToShallow = Array.from(dropZones).sort((dz1, dz2) => getDepth(dz2) - getDepth(dz1));

        /**
         * The main function in this module. Tracks where everything is/ should be a take the actions
         */
        function andNow() {
            const currentCenterOfDragged = findCenterOfElement(draggedEl);
            const scrolled = scrollIfNeeded$1(currentCenterOfDragged, lastDropZoneFound);
            // we only want to make a new decision after the element was moved a bit to prevent flickering
            if (
                !scrolled &&
                lastCentrePositionOfDragged &&
                Math.abs(lastCentrePositionOfDragged.x - currentCenterOfDragged.x) < TOLERANCE_PX &&
                Math.abs(lastCentrePositionOfDragged.y - currentCenterOfDragged.y) < TOLERANCE_PX
            ) {
                next$1 = window.setTimeout(andNow, intervalMs);
                return;
            }
            if (isElementOffDocument(draggedEl)) {
                dispatchDraggedLeftDocument(draggedEl);
                return;
            }

            lastCentrePositionOfDragged = currentCenterOfDragged;
            // this is a simple algorithm, potential improvement: first look at lastDropZoneFound
            let isDraggedInADropZone = false;
            for (const dz of dropZonesFromDeepToShallow) {
                if (scrolled) resetIndexesCacheForDz(lastDropZoneFound);
                const indexObj = findWouldBeIndex(draggedEl, dz);
                if (indexObj === null) {
                    // it is not inside
                    continue;
                }
                const {index} = indexObj;
                isDraggedInADropZone = true;
                // the element is over a container
                if (dz !== lastDropZoneFound) {
                    lastDropZoneFound && dispatchDraggedElementLeftContainerForAnother(lastDropZoneFound, draggedEl, dz);
                    dispatchDraggedElementEnteredContainer(dz, indexObj, draggedEl);
                    lastDropZoneFound = dz;
                } else if (index !== lastIndexFound) {
                    dispatchDraggedElementIsOverIndex(dz, indexObj, draggedEl);
                    lastIndexFound = index;
                }
                // we handle looping with the 'continue' statement above
                break;
            }
            // the first time the dragged element is not in any dropzone we need to notify the last dropzone it was in
            if (!isDraggedInADropZone && lastIsDraggedInADropZone && lastDropZoneFound) {
                dispatchDraggedElementLeftContainerForNone(lastDropZoneFound, draggedEl);
                lastDropZoneFound = undefined;
                lastIndexFound = undefined;
                lastIsDraggedInADropZone = false;
            } else {
                lastIsDraggedInADropZone = true;
            }
            next$1 = window.setTimeout(andNow, intervalMs);
        }
        andNow();
    }

    // assumption - we can only observe one dragged element at a time, this could be changed in the future
    function unobserve() {
        clearTimeout(next$1);
        resetScrolling$1();
        resetIndexesCache();
    }

    const INTERVAL_MS = 300;
    let mousePosition;

    /**
     * Do not use this! it is visible for testing only until we get over the issue Cypress not triggering the mousemove listeners
     * // TODO - make private (remove export)
     * @param {{clientX: number, clientY: number}} e
     */
    function updateMousePosition(e) {
        const c = e.touches ? e.touches[0] : e;
        mousePosition = {x: c.clientX, y: c.clientY};
    }
    const {scrollIfNeeded, resetScrolling} = makeScroller();
    let next;

    function loop() {
        if (mousePosition) {
            const scrolled = scrollIfNeeded(mousePosition, document.documentElement);
            if (scrolled) resetIndexesCache();
        }
        next = window.setTimeout(loop, INTERVAL_MS);
    }

    /**
     * will start watching the mouse pointer and scroll the window if it goes next to the edges
     */
    function armWindowScroller() {
        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("touchmove", updateMousePosition);
        loop();
    }

    /**
     * will stop watching the mouse pointer and won't scroll the window anymore
     */
    function disarmWindowScroller() {
        window.removeEventListener("mousemove", updateMousePosition);
        window.removeEventListener("touchmove", updateMousePosition);
        mousePosition = undefined;
        window.clearTimeout(next);
        resetScrolling();
    }

    /**
     * Fixes svelte issue when cloning node containing (or being) <select> which will loose it's value.
     * Since svelte manages select value internally.
     * @see https://github.com/sveltejs/svelte/issues/6717
     * @see https://github.com/isaacHagoel/svelte-dnd-action/issues/306
     * 
     * @param {HTMLElement} el 
     * @returns 
     */
    function svelteNodeClone(el) {
      const cloned = el.cloneNode(true);

      const values = [];
      const elIsSelect = el.tagName === "SELECT";
      const selects = elIsSelect ? [el] : [...el.querySelectorAll('select')];
      for (const select of selects) {
        values.push(select.value);
      }

      if (selects.length <= 0) {
        return cloned;
      }

      const clonedSelects = elIsSelect ? [cloned] : [...cloned.querySelectorAll('select')];
      for (let i = 0; i < clonedSelects.length; i++) {
        const select = clonedSelects[i];
        const value = values[i];
        const optionEl = select.querySelector(`option[value="${value}"`);
        if (optionEl) {
          optionEl.setAttribute('selected', true);
        }
      }

      return cloned;
    }

    const TRANSITION_DURATION_SECONDS = 0.2;

    /**
     * private helper function - creates a transition string for a property
     * @param {string} property
     * @return {string} - the transition string
     */
    function trs(property) {
        return `${property} ${TRANSITION_DURATION_SECONDS}s ease`;
    }
    /**
     * clones the given element and applies proper styles and transitions to the dragged element
     * @param {HTMLElement} originalElement
     * @param {Point} [positionCenterOnXY]
     * @return {Node} - the cloned, styled element
     */
    function createDraggedElementFrom(originalElement, positionCenterOnXY) {
        const rect = originalElement.getBoundingClientRect();
        const draggedEl = svelteNodeClone(originalElement);
        copyStylesFromTo(originalElement, draggedEl);
        draggedEl.id = DRAGGED_ELEMENT_ID;
        draggedEl.style.position = "fixed";
        let elTopPx = rect.top;
        let elLeftPx = rect.left;
        draggedEl.style.top = `${elTopPx}px`;
        draggedEl.style.left = `${elLeftPx}px`;
        if (positionCenterOnXY) {
            const center = findCenter(rect);
            elTopPx -= center.y - positionCenterOnXY.y;
            elLeftPx -= center.x - positionCenterOnXY.x;
            window.setTimeout(() => {
                draggedEl.style.top = `${elTopPx}px`;
                draggedEl.style.left = `${elLeftPx}px`;
            }, 0);
        }
        draggedEl.style.margin = "0";
        // we can't have relative or automatic height and width or it will break the illusion
        draggedEl.style.boxSizing = "border-box";
        draggedEl.style.height = `${rect.height}px`;
        draggedEl.style.width = `${rect.width}px`;
        draggedEl.style.transition = `${trs("top")}, ${trs("left")}, ${trs("background-color")}, ${trs("opacity")}, ${trs("color")} `;
        // this is a workaround for a strange browser bug that causes the right border to disappear when all the transitions are added at the same time
        window.setTimeout(() => (draggedEl.style.transition += `, ${trs("width")}, ${trs("height")}`), 0);
        draggedEl.style.zIndex = "9999";
        draggedEl.style.cursor = "grabbing";

        return draggedEl;
    }

    /**
     * styles the dragged element to a 'dropped' state
     * @param {HTMLElement} draggedEl
     */
    function moveDraggedElementToWasDroppedState(draggedEl) {
        draggedEl.style.cursor = "grab";
    }

    /**
     * Morphs the dragged element style, maintains the mouse pointer within the element
     * @param {HTMLElement} draggedEl
     * @param {HTMLElement} copyFromEl - the element the dragged element should look like, typically the shadow element
     * @param {number} currentMouseX
     * @param {number} currentMouseY
     * @param {function} transformDraggedElement - function to transform the dragged element, does nothing by default.
     */
    function morphDraggedElementToBeLike(draggedEl, copyFromEl, currentMouseX, currentMouseY, transformDraggedElement) {
        const newRect = copyFromEl.getBoundingClientRect();
        const draggedElRect = draggedEl.getBoundingClientRect();
        const widthChange = newRect.width - draggedElRect.width;
        const heightChange = newRect.height - draggedElRect.height;
        if (widthChange || heightChange) {
            const relativeDistanceOfMousePointerFromDraggedSides = {
                left: (currentMouseX - draggedElRect.left) / draggedElRect.width,
                top: (currentMouseY - draggedElRect.top) / draggedElRect.height
            };
            draggedEl.style.height = `${newRect.height}px`;
            draggedEl.style.width = `${newRect.width}px`;
            draggedEl.style.left = `${parseFloat(draggedEl.style.left) - relativeDistanceOfMousePointerFromDraggedSides.left * widthChange}px`;
            draggedEl.style.top = `${parseFloat(draggedEl.style.top) - relativeDistanceOfMousePointerFromDraggedSides.top * heightChange}px`;
        }

        /// other properties
        copyStylesFromTo(copyFromEl, draggedEl);
        transformDraggedElement();
    }

    /**
     * @param {HTMLElement} copyFromEl
     * @param {HTMLElement} copyToEl
     */
    function copyStylesFromTo(copyFromEl, copyToEl) {
        const computedStyle = window.getComputedStyle(copyFromEl);
        Array.from(computedStyle)
            .filter(
                s =>
                    s.startsWith("background") ||
                    s.startsWith("padding") ||
                    s.startsWith("font") ||
                    s.startsWith("text") ||
                    s.startsWith("align") ||
                    s.startsWith("justify") ||
                    s.startsWith("display") ||
                    s.startsWith("flex") ||
                    s.startsWith("border") ||
                    s === "opacity" ||
                    s === "color" ||
                    s === "list-style-type"
            )
            .forEach(s => copyToEl.style.setProperty(s, computedStyle.getPropertyValue(s), computedStyle.getPropertyPriority(s)));
    }

    /**
     * makes the element compatible with being draggable
     * @param {HTMLElement} draggableEl
     * @param {boolean} dragDisabled
     */
    function styleDraggable(draggableEl, dragDisabled) {
        draggableEl.draggable = false;
        draggableEl.ondragstart = () => false;
        if (!dragDisabled) {
            draggableEl.style.userSelect = "none";
            draggableEl.style.WebkitUserSelect = "none";
            draggableEl.style.cursor = "grab";
        } else {
            draggableEl.style.userSelect = "";
            draggableEl.style.WebkitUserSelect = "";
            draggableEl.style.cursor = "";
        }
    }

    /**
     * Hides the provided element so that it can stay in the dom without interrupting
     * @param {HTMLElement} dragTarget
     */
    function hideElement(dragTarget) {
        dragTarget.style.display = "none";
        dragTarget.style.position = "fixed";
        dragTarget.style.zIndex = "-5";
    }

    /**
     * styles the shadow element
     * @param {HTMLElement} shadowEl
     */
    function decorateShadowEl(shadowEl) {
        shadowEl.style.visibility = "hidden";
        shadowEl.setAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME, "true");
    }

    /**
     * undo the styles the shadow element
     * @param {HTMLElement} shadowEl
     */
    function unDecorateShadowElement(shadowEl) {
        shadowEl.style.visibility = "";
        shadowEl.removeAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
    }

    /**
     * will mark the given dropzones as visually active
     * @param {Array<HTMLElement>} dropZones
     * @param {Function} getStyles - maps a dropzone to a styles object (so the styles can be removed)
     * @param {Function} getClasses - maps a dropzone to a classList
     */
    function styleActiveDropZones(dropZones, getStyles = () => {}, getClasses = () => []) {
        dropZones.forEach(dz => {
            const styles = getStyles(dz);
            Object.keys(styles).forEach(style => {
                dz.style[style] = styles[style];
            });
            getClasses(dz).forEach(c => dz.classList.add(c));
        });
    }

    /**
     * will remove the 'active' styling from given dropzones
     * @param {Array<HTMLElement>} dropZones
     * @param {Function} getStyles - maps a dropzone to a styles object
     * @param {Function} getClasses - maps a dropzone to a classList
     */
    function styleInactiveDropZones(dropZones, getStyles = () => {}, getClasses = () => []) {
        dropZones.forEach(dz => {
            const styles = getStyles(dz);
            Object.keys(styles).forEach(style => {
                dz.style[style] = "";
            });
            getClasses(dz).forEach(c => dz.classList.contains(c) && dz.classList.remove(c));
        });
    }

    /**
     * will prevent the provided element from shrinking by setting its minWidth and minHeight to the current width and height values
     * @param {HTMLElement} el
     * @return {function(): void} - run this function to undo the operation and restore the original values
     */
    function preventShrinking(el) {
        const originalMinHeight = el.style.minHeight;
        el.style.minHeight = window.getComputedStyle(el).getPropertyValue("height");
        const originalMinWidth = el.style.minWidth;
        el.style.minWidth = window.getComputedStyle(el).getPropertyValue("width");
        return function undo() {
            el.style.minHeight = originalMinHeight;
            el.style.minWidth = originalMinWidth;
        };
    }

    const DEFAULT_DROP_ZONE_TYPE$1 = "--any--";
    const MIN_OBSERVATION_INTERVAL_MS = 100;
    const MIN_MOVEMENT_BEFORE_DRAG_START_PX = 3;
    const DEFAULT_DROP_TARGET_STYLE$1 = {
        outline: "rgba(255, 255, 102, 0.7) solid 2px"
    };

    let originalDragTarget;
    let draggedEl;
    let draggedElData;
    let draggedElType;
    let originDropZone;
    let originIndex;
    let shadowElData;
    let shadowElDropZone;
    let dragStartMousePosition;
    let currentMousePosition;
    let isWorkingOnPreviousDrag = false;
    let finalizingPreviousDrag = false;
    let unlockOriginDzMinDimensions;
    let isDraggedOutsideOfAnyDz = false;
    let scheduledForRemovalAfterDrop = [];

    // a map from type to a set of drop-zones
    const typeToDropZones$1 = new Map();
    // important - this is needed because otherwise the config that would be used for everyone is the config of the element that created the event listeners
    const dzToConfig$1 = new Map();
    // this is needed in order to be able to cleanup old listeners and avoid stale closures issues (as the listener is defined within each zone)
    const elToMouseDownListener = new WeakMap();

    /* drop-zones registration management */
    function registerDropZone$1(dropZoneEl, type) {
        if (!typeToDropZones$1.has(type)) {
            typeToDropZones$1.set(type, new Set());
        }
        if (!typeToDropZones$1.get(type).has(dropZoneEl)) {
            typeToDropZones$1.get(type).add(dropZoneEl);
            incrementActiveDropZoneCount();
        }
    }
    function unregisterDropZone$1(dropZoneEl, type) {
        typeToDropZones$1.get(type).delete(dropZoneEl);
        decrementActiveDropZoneCount();
        if (typeToDropZones$1.get(type).size === 0) {
            typeToDropZones$1.delete(type);
        }
    }

    /* functions to manage observing the dragged element and trigger custom drag-events */
    function watchDraggedElement() {
        armWindowScroller();
        const dropZones = typeToDropZones$1.get(draggedElType);
        for (const dz of dropZones) {
            dz.addEventListener(DRAGGED_ENTERED_EVENT_NAME, handleDraggedEntered);
            dz.addEventListener(DRAGGED_LEFT_EVENT_NAME, handleDraggedLeft);
            dz.addEventListener(DRAGGED_OVER_INDEX_EVENT_NAME, handleDraggedIsOverIndex);
        }
        window.addEventListener(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, handleDrop$1);
        // it is important that we don't have an interval that is faster than the flip duration because it can cause elements to jump bach and forth
        const observationIntervalMs = Math.max(
            MIN_OBSERVATION_INTERVAL_MS,
            ...Array.from(dropZones.keys()).map(dz => dzToConfig$1.get(dz).dropAnimationDurationMs)
        );
        observe(draggedEl, dropZones, observationIntervalMs * 1.07);
    }
    function unWatchDraggedElement() {
        disarmWindowScroller();
        const dropZones = typeToDropZones$1.get(draggedElType);
        for (const dz of dropZones) {
            dz.removeEventListener(DRAGGED_ENTERED_EVENT_NAME, handleDraggedEntered);
            dz.removeEventListener(DRAGGED_LEFT_EVENT_NAME, handleDraggedLeft);
            dz.removeEventListener(DRAGGED_OVER_INDEX_EVENT_NAME, handleDraggedIsOverIndex);
        }
        window.removeEventListener(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, handleDrop$1);
        unobserve();
    }

    // finds the initial placeholder that is placed there on drag start
    function findShadowPlaceHolderIdx(items) {
        return items.findIndex(item => item[ITEM_ID_KEY] === SHADOW_PLACEHOLDER_ITEM_ID);
    }
    function findShadowElementIdx(items) {
        // checking that the id is not the placeholder's for Dragula like usecases
        return items.findIndex(item => !!item[SHADOW_ITEM_MARKER_PROPERTY_NAME] && item[ITEM_ID_KEY] !== SHADOW_PLACEHOLDER_ITEM_ID);
    }

    /* custom drag-events handlers */
    function handleDraggedEntered(e) {
        let {items, dropFromOthersDisabled} = dzToConfig$1.get(e.currentTarget);
        if (dropFromOthersDisabled && e.currentTarget !== originDropZone) {
            return;
        }
        isDraggedOutsideOfAnyDz = false;
        // this deals with another race condition. in rare occasions (super rapid operations) the list hasn't updated yet
        items = items.filter(item => item[ITEM_ID_KEY] !== shadowElData[ITEM_ID_KEY]);

        if (originDropZone !== e.currentTarget) {
            const originZoneItems = dzToConfig$1.get(originDropZone).items;
            const newOriginZoneItems = originZoneItems.filter(item => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
            dispatchConsiderEvent(originDropZone, newOriginZoneItems, {
                trigger: TRIGGERS.DRAGGED_ENTERED_ANOTHER,
                id: draggedElData[ITEM_ID_KEY],
                source: SOURCES.POINTER
            });
        } else {
            const shadowPlaceHolderIdx = findShadowPlaceHolderIdx(items);
            if (shadowPlaceHolderIdx !== -1) {
                items.splice(shadowPlaceHolderIdx, 1);
            }
        }

        const {index, isProximityBased} = e.detail.indexObj;
        const shadowElIdx = isProximityBased && index === e.currentTarget.children.length - 1 ? index + 1 : index;
        shadowElDropZone = e.currentTarget;
        items.splice(shadowElIdx, 0, shadowElData);
        dispatchConsiderEvent(e.currentTarget, items, {trigger: TRIGGERS.DRAGGED_ENTERED, id: draggedElData[ITEM_ID_KEY], source: SOURCES.POINTER});
    }

    function handleDraggedLeft(e) {
        // dealing with a rare race condition on extremely rapid clicking and dropping
        if (!isWorkingOnPreviousDrag) return;
        const {items, dropFromOthersDisabled} = dzToConfig$1.get(e.currentTarget);
        if (dropFromOthersDisabled && e.currentTarget !== originDropZone && e.currentTarget !== shadowElDropZone) {
            return;
        }
        const shadowElIdx = findShadowElementIdx(items);
        const shadowItem = items.splice(shadowElIdx, 1)[0];
        shadowElDropZone = undefined;
        const {type, theOtherDz} = e.detail;
        if (
            type === DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY ||
            (type === DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER && theOtherDz !== originDropZone && dzToConfig$1.get(theOtherDz).dropFromOthersDisabled)
        ) {
            isDraggedOutsideOfAnyDz = true;
            shadowElDropZone = originDropZone;
            const originZoneItems = dzToConfig$1.get(originDropZone).items;
            originZoneItems.splice(originIndex, 0, shadowItem);
            dispatchConsiderEvent(originDropZone, originZoneItems, {
                trigger: TRIGGERS.DRAGGED_LEFT_ALL,
                id: draggedElData[ITEM_ID_KEY],
                source: SOURCES.POINTER
            });
        }
        // for the origin dz, when the dragged is outside of any, this will be fired in addition to the previous. this is for simplicity
        dispatchConsiderEvent(e.currentTarget, items, {
            trigger: TRIGGERS.DRAGGED_LEFT,
            id: draggedElData[ITEM_ID_KEY],
            source: SOURCES.POINTER
        });
    }
    function handleDraggedIsOverIndex(e) {
        const {items, dropFromOthersDisabled} = dzToConfig$1.get(e.currentTarget);
        if (dropFromOthersDisabled && e.currentTarget !== originDropZone) {
            return;
        }
        isDraggedOutsideOfAnyDz = false;
        const {index} = e.detail.indexObj;
        const shadowElIdx = findShadowElementIdx(items);
        items.splice(shadowElIdx, 1);
        items.splice(index, 0, shadowElData);
        dispatchConsiderEvent(e.currentTarget, items, {trigger: TRIGGERS.DRAGGED_OVER_INDEX, id: draggedElData[ITEM_ID_KEY], source: SOURCES.POINTER});
    }

    // Global mouse/touch-events handlers
    function handleMouseMove(e) {
        e.preventDefault();
        const c = e.touches ? e.touches[0] : e;
        currentMousePosition = {x: c.clientX, y: c.clientY};
        draggedEl.style.transform = `translate3d(${currentMousePosition.x - dragStartMousePosition.x}px, ${
        currentMousePosition.y - dragStartMousePosition.y
    }px, 0)`;
    }

    function handleDrop$1() {
        finalizingPreviousDrag = true;
        // cleanup
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("mouseup", handleDrop$1);
        window.removeEventListener("touchend", handleDrop$1);
        unWatchDraggedElement();
        moveDraggedElementToWasDroppedState(draggedEl);

        if (!shadowElDropZone) {
            shadowElDropZone = originDropZone;
        }
        let {items, type} = dzToConfig$1.get(shadowElDropZone);
        styleInactiveDropZones(
            typeToDropZones$1.get(type),
            dz => dzToConfig$1.get(dz).dropTargetStyle,
            dz => dzToConfig$1.get(dz).dropTargetClasses
        );
        let shadowElIdx = findShadowElementIdx(items);
        // the handler might remove the shadow element, ex: dragula like copy on drag
        if (shadowElIdx === -1) shadowElIdx = originIndex;
        items = items.map(item => (item[SHADOW_ITEM_MARKER_PROPERTY_NAME] ? draggedElData : item));
        function finalizeWithinZone() {
            unlockOriginDzMinDimensions();
            dispatchFinalizeEvent(shadowElDropZone, items, {
                trigger: isDraggedOutsideOfAnyDz ? TRIGGERS.DROPPED_OUTSIDE_OF_ANY : TRIGGERS.DROPPED_INTO_ZONE,
                id: draggedElData[ITEM_ID_KEY],
                source: SOURCES.POINTER
            });
            if (shadowElDropZone !== originDropZone) {
                // letting the origin drop zone know the element was permanently taken away
                dispatchFinalizeEvent(originDropZone, dzToConfig$1.get(originDropZone).items, {
                    trigger: TRIGGERS.DROPPED_INTO_ANOTHER,
                    id: draggedElData[ITEM_ID_KEY],
                    source: SOURCES.POINTER
                });
            }
            unDecorateShadowElement(shadowElDropZone.children[shadowElIdx]);
            cleanupPostDrop();
        }
        animateDraggedToFinalPosition(shadowElIdx, finalizeWithinZone);
    }

    // helper function for handleDrop
    function animateDraggedToFinalPosition(shadowElIdx, callback) {
        const shadowElRect = getBoundingRectNoTransforms(shadowElDropZone.children[shadowElIdx]);
        const newTransform = {
            x: shadowElRect.left - parseFloat(draggedEl.style.left),
            y: shadowElRect.top - parseFloat(draggedEl.style.top)
        };
        const {dropAnimationDurationMs} = dzToConfig$1.get(shadowElDropZone);
        const transition = `transform ${dropAnimationDurationMs}ms ease`;
        draggedEl.style.transition = draggedEl.style.transition ? draggedEl.style.transition + "," + transition : transition;
        draggedEl.style.transform = `translate3d(${newTransform.x}px, ${newTransform.y}px, 0)`;
        window.setTimeout(callback, dropAnimationDurationMs);
    }

    function scheduleDZForRemovalAfterDrop(dz, destroy) {
        scheduledForRemovalAfterDrop.push({dz, destroy});
        window.requestAnimationFrame(() => {
            hideElement(dz);
            document.body.appendChild(dz);
        });
    }
    /* cleanup */
    function cleanupPostDrop() {
        draggedEl.remove();
        originalDragTarget.remove();
        if (scheduledForRemovalAfterDrop.length) {
            scheduledForRemovalAfterDrop.forEach(({dz, destroy}) => {
                destroy();
                dz.remove();
            });
            scheduledForRemovalAfterDrop = [];
        }
        draggedEl = undefined;
        originalDragTarget = undefined;
        draggedElData = undefined;
        draggedElType = undefined;
        originDropZone = undefined;
        originIndex = undefined;
        shadowElData = undefined;
        shadowElDropZone = undefined;
        dragStartMousePosition = undefined;
        currentMousePosition = undefined;
        isWorkingOnPreviousDrag = false;
        finalizingPreviousDrag = false;
        unlockOriginDzMinDimensions = undefined;
        isDraggedOutsideOfAnyDz = false;
    }

    function dndzone$2(node, options) {
        let initialized = false;
        const config = {
            items: undefined,
            type: undefined,
            flipDurationMs: 0,
            dragDisabled: false,
            morphDisabled: false,
            dropFromOthersDisabled: false,
            dropTargetStyle: DEFAULT_DROP_TARGET_STYLE$1,
            dropTargetClasses: [],
            transformDraggedElement: () => {},
            centreDraggedOnCursor: false
        };
        let elToIdx = new Map();

        function addMaybeListeners() {
            window.addEventListener("mousemove", handleMouseMoveMaybeDragStart, {passive: false});
            window.addEventListener("touchmove", handleMouseMoveMaybeDragStart, {passive: false, capture: false});
            window.addEventListener("mouseup", handleFalseAlarm, {passive: false});
            window.addEventListener("touchend", handleFalseAlarm, {passive: false});
        }
        function removeMaybeListeners() {
            window.removeEventListener("mousemove", handleMouseMoveMaybeDragStart);
            window.removeEventListener("touchmove", handleMouseMoveMaybeDragStart);
            window.removeEventListener("mouseup", handleFalseAlarm);
            window.removeEventListener("touchend", handleFalseAlarm);
        }
        function handleFalseAlarm() {
            removeMaybeListeners();
            originalDragTarget = undefined;
            dragStartMousePosition = undefined;
            currentMousePosition = undefined;
        }

        function handleMouseMoveMaybeDragStart(e) {
            e.preventDefault();
            const c = e.touches ? e.touches[0] : e;
            currentMousePosition = {x: c.clientX, y: c.clientY};
            if (
                Math.abs(currentMousePosition.x - dragStartMousePosition.x) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX ||
                Math.abs(currentMousePosition.y - dragStartMousePosition.y) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX
            ) {
                removeMaybeListeners();
                handleDragStart();
            }
        }
        function handleMouseDown(e) {
            // on safari clicking on a select element doesn't fire mouseup at the end of the click and in general this makes more sense
            if (e.target !== e.currentTarget && (e.target.value !== undefined || e.target.isContentEditable)) {
                return;
            }
            // prevents responding to any button but left click which equals 0 (which is falsy)
            if (e.button) {
                return;
            }
            if (isWorkingOnPreviousDrag) {
                return;
            }
            e.stopPropagation();
            const c = e.touches ? e.touches[0] : e;
            dragStartMousePosition = {x: c.clientX, y: c.clientY};
            currentMousePosition = {...dragStartMousePosition};
            originalDragTarget = e.currentTarget;
            addMaybeListeners();
        }

        function handleDragStart() {
            isWorkingOnPreviousDrag = true;

            // initialising globals
            const currentIdx = elToIdx.get(originalDragTarget);
            originIndex = currentIdx;
            originDropZone = originalDragTarget.parentElement;
            /** @type {ShadowRoot | HTMLDocument} */
            const rootNode = originDropZone.getRootNode();
            const originDropZoneRoot = rootNode.body || rootNode;
            const {items, type, centreDraggedOnCursor} = config;
            draggedElData = {...items[currentIdx]};
            draggedElType = type;
            shadowElData = {...draggedElData, [SHADOW_ITEM_MARKER_PROPERTY_NAME]: true};
            // The initial shadow element. We need a different id at first in order to avoid conflicts and timing issues
            const placeHolderElData = {...shadowElData, [ITEM_ID_KEY]: SHADOW_PLACEHOLDER_ITEM_ID};

            // creating the draggable element
            draggedEl = createDraggedElementFrom(originalDragTarget, centreDraggedOnCursor && currentMousePosition);
            // We will keep the original dom node in the dom because touch events keep firing on it, we want to re-add it after the framework removes it
            function keepOriginalElementInDom() {
                if (!draggedEl.parentElement) {
                    originDropZoneRoot.appendChild(draggedEl);
                    // to prevent the outline from disappearing
                    draggedEl.focus();
                    watchDraggedElement();
                    hideElement(originalDragTarget);
                    originDropZoneRoot.appendChild(originalDragTarget);
                } else {
                    window.requestAnimationFrame(keepOriginalElementInDom);
                }
            }
            window.requestAnimationFrame(keepOriginalElementInDom);

            styleActiveDropZones(
                Array.from(typeToDropZones$1.get(config.type)).filter(dz => dz === originDropZone || !dzToConfig$1.get(dz).dropFromOthersDisabled),
                dz => dzToConfig$1.get(dz).dropTargetStyle,
                dz => dzToConfig$1.get(dz).dropTargetClasses
            );

            // removing the original element by removing its data entry
            items.splice(currentIdx, 1, placeHolderElData);
            unlockOriginDzMinDimensions = preventShrinking(originDropZone);

            dispatchConsiderEvent(originDropZone, items, {trigger: TRIGGERS.DRAG_STARTED, id: draggedElData[ITEM_ID_KEY], source: SOURCES.POINTER});

            // handing over to global handlers - starting to watch the element
            window.addEventListener("mousemove", handleMouseMove, {passive: false});
            window.addEventListener("touchmove", handleMouseMove, {passive: false, capture: false});
            window.addEventListener("mouseup", handleDrop$1, {passive: false});
            window.addEventListener("touchend", handleDrop$1, {passive: false});
        }

        function configure({
            items = undefined,
            flipDurationMs: dropAnimationDurationMs = 0,
            type: newType = DEFAULT_DROP_ZONE_TYPE$1,
            dragDisabled = false,
            morphDisabled = false,
            dropFromOthersDisabled = false,
            dropTargetStyle = DEFAULT_DROP_TARGET_STYLE$1,
            dropTargetClasses = [],
            transformDraggedElement = () => {},
            centreDraggedOnCursor = false
        }) {
            config.dropAnimationDurationMs = dropAnimationDurationMs;
            if (config.type && newType !== config.type) {
                unregisterDropZone$1(node, config.type);
            }
            config.type = newType;
            registerDropZone$1(node, newType);
            config.items = [...items];
            config.dragDisabled = dragDisabled;
            config.morphDisabled = morphDisabled;
            config.transformDraggedElement = transformDraggedElement;
            config.centreDraggedOnCursor = centreDraggedOnCursor;

            // realtime update for dropTargetStyle
            if (
                initialized &&
                isWorkingOnPreviousDrag &&
                !finalizingPreviousDrag &&
                (!areObjectsShallowEqual(dropTargetStyle, config.dropTargetStyle) ||
                    !areArraysShallowEqualSameOrder(dropTargetClasses, config.dropTargetClasses))
            ) {
                styleInactiveDropZones(
                    [node],
                    () => config.dropTargetStyle,
                    () => dropTargetClasses
                );
                styleActiveDropZones(
                    [node],
                    () => dropTargetStyle,
                    () => dropTargetClasses
                );
            }
            config.dropTargetStyle = dropTargetStyle;
            config.dropTargetClasses = [...dropTargetClasses];

            // realtime update for dropFromOthersDisabled
            function getConfigProp(dz, propName) {
                return dzToConfig$1.get(dz) ? dzToConfig$1.get(dz)[propName] : config[propName];
            }
            if (initialized && isWorkingOnPreviousDrag && config.dropFromOthersDisabled !== dropFromOthersDisabled) {
                if (dropFromOthersDisabled) {
                    styleInactiveDropZones(
                        [node],
                        dz => getConfigProp(dz, "dropTargetStyle"),
                        dz => getConfigProp(dz, "dropTargetClasses")
                    );
                } else {
                    styleActiveDropZones(
                        [node],
                        dz => getConfigProp(dz, "dropTargetStyle"),
                        dz => getConfigProp(dz, "dropTargetClasses")
                    );
                }
            }
            config.dropFromOthersDisabled = dropFromOthersDisabled;

            dzToConfig$1.set(node, config);
            const shadowElIdx = findShadowElementIdx(config.items);
            for (let idx = 0; idx < node.children.length; idx++) {
                const draggableEl = node.children[idx];
                styleDraggable(draggableEl, dragDisabled);
                if (idx === shadowElIdx) {
                    if (!morphDisabled) {
                        morphDraggedElementToBeLike(draggedEl, draggableEl, currentMousePosition.x, currentMousePosition.y, () =>
                            config.transformDraggedElement(draggedEl, draggedElData, idx)
                        );
                    }
                    decorateShadowEl(draggableEl);
                    continue;
                }
                draggableEl.removeEventListener("mousedown", elToMouseDownListener.get(draggableEl));
                draggableEl.removeEventListener("touchstart", elToMouseDownListener.get(draggableEl));
                if (!dragDisabled) {
                    draggableEl.addEventListener("mousedown", handleMouseDown);
                    draggableEl.addEventListener("touchstart", handleMouseDown);
                    elToMouseDownListener.set(draggableEl, handleMouseDown);
                }
                // updating the idx
                elToIdx.set(draggableEl, idx);

                if (!initialized) {
                    initialized = true;
                }
            }
        }
        configure(options);

        return {
            update: newOptions => {
                configure(newOptions);
            },
            destroy: () => {
                function destroyDz() {
                    unregisterDropZone$1(node, dzToConfig$1.get(node).type);
                    dzToConfig$1.delete(node);
                }
                if (isWorkingOnPreviousDrag) {
                    scheduleDZForRemovalAfterDrop(node, destroyDz);
                } else {
                   destroyDz();
                }
            }
        };
    }

    const INSTRUCTION_IDs$1 = {
        DND_ZONE_ACTIVE: "dnd-zone-active",
        DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
    };
    const ID_TO_INSTRUCTION = {
        [INSTRUCTION_IDs$1.DND_ZONE_ACTIVE]: "Tab to one the items and press space-bar or enter to start dragging it",
        [INSTRUCTION_IDs$1.DND_ZONE_DRAG_DISABLED]: "This is a disabled drag and drop list"
    };

    const ALERT_DIV_ID = "dnd-action-aria-alert";
    let alertsDiv;

    function initAriaOnBrowser() {
        if (alertsDiv) {
            // it is already initialized
            return;
        }
        // setting the dynamic alerts
        alertsDiv = document.createElement("div");
        (function initAlertsDiv() {
            alertsDiv.id = ALERT_DIV_ID;
            // tab index -1 makes the alert be read twice on chrome for some reason
            //alertsDiv.tabIndex = -1;
            alertsDiv.style.position = "fixed";
            alertsDiv.style.bottom = "0";
            alertsDiv.style.left = "0";
            alertsDiv.style.zIndex = "-5";
            alertsDiv.style.opacity = "0";
            alertsDiv.style.height = "0";
            alertsDiv.style.width = "0";
            alertsDiv.setAttribute("role", "alert");
        })();
        document.body.prepend(alertsDiv);

        // setting the instructions
        Object.entries(ID_TO_INSTRUCTION).forEach(([id, txt]) => document.body.prepend(instructionToHiddenDiv(id, txt)));
    }

    /**
     * Initializes the static aria instructions so they can be attached to zones
     * @return {{DND_ZONE_ACTIVE: string, DND_ZONE_DRAG_DISABLED: string} | null} - the IDs for static aria instruction (to be used via aria-describedby) or null on the server
     */
    function initAria() {
        if (isOnServer) return null;
        if (document.readyState === "complete") {
            initAriaOnBrowser();
        } else {
            window.addEventListener("DOMContentLoaded", initAriaOnBrowser);
        }
        return {...INSTRUCTION_IDs$1};
    }

    /**
     * Removes all the artifacts (dom elements) added by this module
     */
    function destroyAria() {
        if (isOnServer || !alertsDiv) return;
        Object.keys(ID_TO_INSTRUCTION).forEach(id => document.getElementById(id)?.remove());
        alertsDiv.remove();
        alertsDiv = undefined;
    }

    function instructionToHiddenDiv(id, txt) {
        const div = document.createElement("div");
        div.id = id;
        div.innerHTML = `<p>${txt}</p>`;
        div.style.display = "none";
        div.style.position = "fixed";
        div.style.zIndex = "-5";
        return div;
    }

    /**
     * Will make the screen reader alert the provided text to the user
     * @param {string} txt
     */
    function alertToScreenReader(txt) {
        if (isOnServer) return;
        if (!alertsDiv) {
            initAriaOnBrowser();
        }
        alertsDiv.innerHTML = "";
        const alertText = document.createTextNode(txt);
        alertsDiv.appendChild(alertText);
        // this is needed for Safari
        alertsDiv.style.display = "none";
        alertsDiv.style.display = "inline";
    }

    const DEFAULT_DROP_ZONE_TYPE = "--any--";
    const DEFAULT_DROP_TARGET_STYLE = {
        outline: "rgba(255, 255, 102, 0.7) solid 2px"
    };

    let isDragging = false;
    let draggedItemType;
    let focusedDz;
    let focusedDzLabel = "";
    let focusedItem;
    let focusedItemId;
    let focusedItemLabel = "";
    const allDragTargets = new WeakSet();
    const elToKeyDownListeners = new WeakMap();
    const elToFocusListeners = new WeakMap();
    const dzToHandles = new Map();
    const dzToConfig = new Map();
    const typeToDropZones = new Map();

    /* TODO (potentially)
     * what's the deal with the black border of voice-reader not following focus?
     * maybe keep focus on the last dragged item upon drop?
     */

    let INSTRUCTION_IDs;

    /* drop-zones registration management */
    function registerDropZone(dropZoneEl, type) {
        if (typeToDropZones.size === 0) {
            INSTRUCTION_IDs = initAria();
            window.addEventListener("keydown", globalKeyDownHandler);
            window.addEventListener("click", globalClickHandler);
        }
        if (!typeToDropZones.has(type)) {
            typeToDropZones.set(type, new Set());
        }
        if (!typeToDropZones.get(type).has(dropZoneEl)) {
            typeToDropZones.get(type).add(dropZoneEl);
            incrementActiveDropZoneCount();
        }
    }
    function unregisterDropZone(dropZoneEl, type) {
        if (focusedDz === dropZoneEl) {
            handleDrop();
        }
        typeToDropZones.get(type).delete(dropZoneEl);
        decrementActiveDropZoneCount();
        if (typeToDropZones.get(type).size === 0) {
            typeToDropZones.delete(type);
        }
        if (typeToDropZones.size === 0) {
            window.removeEventListener("keydown", globalKeyDownHandler);
            window.removeEventListener("click", globalClickHandler);
            INSTRUCTION_IDs = undefined;
            destroyAria();
        }
    }

    function globalKeyDownHandler(e) {
        if (!isDragging) return;
        switch (e.key) {
            case "Escape": {
                handleDrop();
                break;
            }
        }
    }

    function globalClickHandler() {
        if (!isDragging) return;
        if (!allDragTargets.has(document.activeElement)) {
            handleDrop();
        }
    }

    function handleZoneFocus(e) {
        if (!isDragging) return;
        const newlyFocusedDz = e.currentTarget;
        if (newlyFocusedDz === focusedDz) return;

        focusedDzLabel = newlyFocusedDz.getAttribute("aria-label") || "";
        const {items: originItems} = dzToConfig.get(focusedDz);
        const originItem = originItems.find(item => item[ITEM_ID_KEY] === focusedItemId);
        const originIdx = originItems.indexOf(originItem);
        const itemToMove = originItems.splice(originIdx, 1)[0];
        const {items: targetItems, autoAriaDisabled} = dzToConfig.get(newlyFocusedDz);
        if (
            newlyFocusedDz.getBoundingClientRect().top < focusedDz.getBoundingClientRect().top ||
            newlyFocusedDz.getBoundingClientRect().left < focusedDz.getBoundingClientRect().left
        ) {
            targetItems.push(itemToMove);
            if (!autoAriaDisabled) {
                alertToScreenReader(`Moved item ${focusedItemLabel} to the end of the list ${focusedDzLabel}`);
            }
        } else {
            targetItems.unshift(itemToMove);
            if (!autoAriaDisabled) {
                alertToScreenReader(`Moved item ${focusedItemLabel} to the beginning of the list ${focusedDzLabel}`);
            }
        }
        const dzFrom = focusedDz;
        dispatchFinalizeEvent(dzFrom, originItems, {trigger: TRIGGERS.DROPPED_INTO_ANOTHER, id: focusedItemId, source: SOURCES.KEYBOARD});
        dispatchFinalizeEvent(newlyFocusedDz, targetItems, {trigger: TRIGGERS.DROPPED_INTO_ZONE, id: focusedItemId, source: SOURCES.KEYBOARD});
        focusedDz = newlyFocusedDz;
    }

    function triggerAllDzsUpdate() {
        dzToHandles.forEach(({update}, dz) => update(dzToConfig.get(dz)));
    }

    function handleDrop(dispatchConsider = true) {
        if (!dzToConfig.get(focusedDz).autoAriaDisabled) {
            alertToScreenReader(`Stopped dragging item ${focusedItemLabel}`);
        }
        if (allDragTargets.has(document.activeElement)) {
            document.activeElement.blur();
        }
        if (dispatchConsider) {
            dispatchConsiderEvent(focusedDz, dzToConfig.get(focusedDz).items, {
                trigger: TRIGGERS.DRAG_STOPPED,
                id: focusedItemId,
                source: SOURCES.KEYBOARD
            });
        }
        styleInactiveDropZones(
            typeToDropZones.get(draggedItemType),
            dz => dzToConfig.get(dz).dropTargetStyle,
            dz => dzToConfig.get(dz).dropTargetClasses
        );
        focusedItem = null;
        focusedItemId = null;
        focusedItemLabel = "";
        draggedItemType = null;
        focusedDz = null;
        focusedDzLabel = "";
        isDragging = false;
        triggerAllDzsUpdate();
    }
    //////
    function dndzone$1(node, options) {
        const config = {
            items: undefined,
            type: undefined,
            dragDisabled: false,
            zoneTabIndex: 0,
            dropFromOthersDisabled: false,
            dropTargetStyle: DEFAULT_DROP_TARGET_STYLE,
            dropTargetClasses: [],
            autoAriaDisabled: false
        };

        function swap(arr, i, j) {
            if (arr.length <= 1) return;
            arr.splice(j, 1, arr.splice(i, 1, arr[j])[0]);
        }

        function handleKeyDown(e) {
            switch (e.key) {
                case "Enter":
                case " ": {
                    // we don't want to affect nested input elements or clickable elements
                    if ((e.target.disabled !== undefined || e.target.href || e.target.isContentEditable) && !allDragTargets.has(e.target)) {
                        return;
                    }
                    e.preventDefault(); // preventing scrolling on spacebar
                    e.stopPropagation();
                    if (isDragging) {
                        // TODO - should this trigger a drop? only here or in general (as in when hitting space or enter outside of any zone)?
                        handleDrop();
                    } else {
                        // drag start
                        handleDragStart(e);
                    }
                    break;
                }
                case "ArrowDown":
                case "ArrowRight": {
                    if (!isDragging) return;
                    e.preventDefault(); // prevent scrolling
                    e.stopPropagation();
                    const {items} = dzToConfig.get(node);
                    const children = Array.from(node.children);
                    const idx = children.indexOf(e.currentTarget);
                    if (idx < children.length - 1) {
                        if (!config.autoAriaDisabled) {
                            alertToScreenReader(`Moved item ${focusedItemLabel} to position ${idx + 2} in the list ${focusedDzLabel}`);
                        }
                        swap(items, idx, idx + 1);
                        dispatchFinalizeEvent(node, items, {trigger: TRIGGERS.DROPPED_INTO_ZONE, id: focusedItemId, source: SOURCES.KEYBOARD});
                    }
                    break;
                }
                case "ArrowUp":
                case "ArrowLeft": {
                    if (!isDragging) return;
                    e.preventDefault(); // prevent scrolling
                    e.stopPropagation();
                    const {items} = dzToConfig.get(node);
                    const children = Array.from(node.children);
                    const idx = children.indexOf(e.currentTarget);
                    if (idx > 0) {
                        if (!config.autoAriaDisabled) {
                            alertToScreenReader(`Moved item ${focusedItemLabel} to position ${idx} in the list ${focusedDzLabel}`);
                        }
                        swap(items, idx, idx - 1);
                        dispatchFinalizeEvent(node, items, {trigger: TRIGGERS.DROPPED_INTO_ZONE, id: focusedItemId, source: SOURCES.KEYBOARD});
                    }
                    break;
                }
            }
        }
        function handleDragStart(e) {
            setCurrentFocusedItem(e.currentTarget);
            focusedDz = node;
            draggedItemType = config.type;
            isDragging = true;
            const dropTargets = Array.from(typeToDropZones.get(config.type)).filter(dz => dz === focusedDz || !dzToConfig.get(dz).dropFromOthersDisabled);
            styleActiveDropZones(
                dropTargets,
                dz => dzToConfig.get(dz).dropTargetStyle,
                dz => dzToConfig.get(dz).dropTargetClasses
            );
            if (!config.autoAriaDisabled) {
                let msg = `Started dragging item ${focusedItemLabel}. Use the arrow keys to move it within its list ${focusedDzLabel}`;
                if (dropTargets.length > 1) {
                    msg += `, or tab to another list in order to move the item into it`;
                }
                alertToScreenReader(msg);
            }
            dispatchConsiderEvent(node, dzToConfig.get(node).items, {trigger: TRIGGERS.DRAG_STARTED, id: focusedItemId, source: SOURCES.KEYBOARD});
            triggerAllDzsUpdate();
        }

        function handleClick(e) {
            if (!isDragging) return;
            if (e.currentTarget === focusedItem) return;
            e.stopPropagation();
            handleDrop(false);
            handleDragStart(e);
        }
        function setCurrentFocusedItem(draggableEl) {
            const {items} = dzToConfig.get(node);
            const children = Array.from(node.children);
            const focusedItemIdx = children.indexOf(draggableEl);
            focusedItem = draggableEl;
            focusedItem.tabIndex = 0;
            focusedItemId = items[focusedItemIdx][ITEM_ID_KEY];
            focusedItemLabel = children[focusedItemIdx].getAttribute("aria-label") || "";
        }

        function configure({
            items = [],
            type: newType = DEFAULT_DROP_ZONE_TYPE,
            dragDisabled = false,
            zoneTabIndex = 0,
            dropFromOthersDisabled = false,
            dropTargetStyle = DEFAULT_DROP_TARGET_STYLE,
            dropTargetClasses = [],
            autoAriaDisabled = false
        }) {
            config.items = [...items];
            config.dragDisabled = dragDisabled;
            config.dropFromOthersDisabled = dropFromOthersDisabled;
            config.zoneTabIndex = zoneTabIndex;
            config.dropTargetStyle = dropTargetStyle;
            config.dropTargetClasses = dropTargetClasses;
            config.autoAriaDisabled = autoAriaDisabled;
            if (config.type && newType !== config.type) {
                unregisterDropZone(node, config.type);
            }
            config.type = newType;
            registerDropZone(node, newType);
            if (!autoAriaDisabled) {
                node.setAttribute("aria-disabled", dragDisabled);
                node.setAttribute("role", "list");
                node.setAttribute("aria-describedby", dragDisabled ? INSTRUCTION_IDs.DND_ZONE_DRAG_DISABLED : INSTRUCTION_IDs.DND_ZONE_ACTIVE);
            }
            dzToConfig.set(node, config);

            if (isDragging) {
                node.tabIndex =
                    node === focusedDz ||
                    focusedItem.contains(node) ||
                    config.dropFromOthersDisabled ||
                    (focusedDz && config.type !== dzToConfig.get(focusedDz).type)
                        ? -1
                        : 0;
            } else {
                node.tabIndex = config.zoneTabIndex;
            }

            node.addEventListener("focus", handleZoneFocus);

            for (let i = 0; i < node.children.length; i++) {
                const draggableEl = node.children[i];
                allDragTargets.add(draggableEl);
                draggableEl.tabIndex = isDragging ? -1 : 0;
                if (!autoAriaDisabled) {
                    draggableEl.setAttribute("role", "listitem");
                }
                draggableEl.removeEventListener("keydown", elToKeyDownListeners.get(draggableEl));
                draggableEl.removeEventListener("click", elToFocusListeners.get(draggableEl));
                if (!dragDisabled) {
                    draggableEl.addEventListener("keydown", handleKeyDown);
                    elToKeyDownListeners.set(draggableEl, handleKeyDown);
                    draggableEl.addEventListener("click", handleClick);
                    elToFocusListeners.set(draggableEl, handleClick);
                }
                if (isDragging && config.items[i][ITEM_ID_KEY] === focusedItemId) {
                    // if it is a nested dropzone, it was re-rendered and we need to refresh our pointer
                    focusedItem = draggableEl;
                    focusedItem.tabIndex = 0;
                    // without this the element loses focus if it moves backwards in the list
                    draggableEl.focus();
                }
            }
        }
        configure(options);

        const handles = {
            update: newOptions => {
                configure(newOptions);
            },
            destroy: () => {
                unregisterDropZone(node, config.type);
                dzToConfig.delete(node);
                dzToHandles.delete(node);
            }
        };
        dzToHandles.set(node, handles);
        return handles;
    }

    /**
     * A custom action to turn any container to a dnd zone and all of its direct children to draggables
     * Supports mouse, touch and keyboard interactions.
     * Dispatches two events that the container is expected to react to by modifying its list of items,
     * which will then feed back in to this action via the update function
     *
     * @typedef {object} Options
     * @property {array} items - the list of items that was used to generate the children of the given node (the list used in the #each block
     * @property {string} [type] - the type of the dnd zone. children dragged from here can only be dropped in other zones of the same type, default to a base type
     * @property {number} [flipDurationMs] - if the list animated using flip (recommended), specifies the flip duration such that everything syncs with it without conflict, defaults to zero
     * @property {boolean} [dragDisabled]
     * @property {boolean} [morphDisabled] - whether dragged element should morph to zone dimensions
     * @property {boolean} [dropFromOthersDisabled]
     * @property {number} [zoneTabIndex] - set the tabindex of the list container when not dragging
     * @property {object} [dropTargetStyle]
     * @property {string[]} [dropTargetClasses]
     * @property {function} [transformDraggedElement]
     * @param {HTMLElement} node - the element to enhance
     * @param {Options} options
     * @return {{update: function, destroy: function}}
     */
    function dndzone(node, options) {
        validateOptions(options);
        const pointerZone = dndzone$2(node, options);
        const keyboardZone = dndzone$1(node, options);
        return {
            update: newOptions => {
                validateOptions(newOptions);
                pointerZone.update(newOptions);
                keyboardZone.update(newOptions);
            },
            destroy: () => {
                pointerZone.destroy();
                keyboardZone.destroy();
            }
        };
    }

    function validateOptions(options) {
        /*eslint-disable*/
        const {
            items,
            flipDurationMs,
            type,
            dragDisabled,
            morphDisabled,
            dropFromOthersDisabled,
            zoneTabIndex,
            dropTargetStyle,
            dropTargetClasses,
            transformDraggedElement,
            autoAriaDisabled,
            centreDraggedOnCursor,
            ...rest
        } = options;
        /*eslint-enable*/
        if (Object.keys(rest).length > 0) {
            console.warn(`dndzone will ignore unknown options`, rest);
        }
        if (!items) {
            throw new Error("no 'items' key provided to dndzone");
        }
        const itemWithMissingId = items.find(item => !{}.hasOwnProperty.call(item, ITEM_ID_KEY));
        if (itemWithMissingId) {
            throw new Error(`missing '${ITEM_ID_KEY}' property for item ${toString(itemWithMissingId)}`);
        }
        if (dropTargetClasses && !Array.isArray(dropTargetClasses)) {
            throw new Error(`dropTargetClasses should be an array but instead it is a ${typeof dropTargetClasses}, ${toString(dropTargetClasses)}`);
        }
        if (zoneTabIndex && !isInt(zoneTabIndex)) {
            throw new Error(`zoneTabIndex should be a number but instead it is a ${typeof zoneTabIndex}, ${toString(zoneTabIndex)}`);
        }
    }

    function isInt(value) {
        return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
    }

    var svelte = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SvelteComponent: SvelteComponentDev,
        SvelteComponentTyped: SvelteComponentTyped,
        afterUpdate: afterUpdate,
        beforeUpdate: beforeUpdate,
        createEventDispatcher: createEventDispatcher,
        getAllContexts: getAllContexts,
        getContext: getContext,
        hasContext: hasContext,
        onDestroy: onDestroy,
        onMount: onMount,
        setContext: setContext,
        tick: tick
    });

    /* src\LetterContainer\LetterContainer.svelte generated by Svelte v3.49.0 */
    const file$f = "src\\LetterContainer\\LetterContainer.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (62:4) {#each items as tile(tile.id)}
    function create_each_block$4(key_1, ctx) {
    	let first;
    	let letter_1;
    	let current;

    	letter_1 = new Letter$1({
    			props: { letter: /*tile*/ ctx[9] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(letter_1.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(letter_1, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const letter_1_changes = {};
    			if (dirty & /*items*/ 1) letter_1_changes.letter = /*tile*/ ctx[9];
    			letter_1.$set(letter_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(letter_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(letter_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(letter_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(62:4) {#each items as tile(tile.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let dndzone_action;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*tile*/ ctx[9].id;
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "letter svelte-1e4oktc");
    			add_location(div, file$f, 55, 0, 1453);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(dndzone_action = dndzone.call(null, div, /*options*/ ctx[1])),
    					listen_dev(div, "consider", /*handleDndConsider*/ ctx[2], false, false, false),
    					listen_dev(div, "finalize", /*handleDndFinalize*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items*/ 1) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    				check_outros();
    			}

    			if (dndzone_action && is_function(dndzone_action.update) && dirty & /*options*/ 2) dndzone_action.update.call(null, /*options*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let disable;
    	let options;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LetterContainer', slots, []);
    	const dispatch = createEventDispatcher();
    	let { letter } = $$props;
    	let { xPos } = $$props;
    	let { yPos } = $$props;
    	let items = [letter];

    	function handleDndConsider(e) {
    		$$invalidate(0, items = e.detail.items);
    	}

    	function handleDndFinalize(e) {
    		const { info: { trigger } } = e.detail;

    		if (trigger === TRIGGERS.DROPPED_INTO_ANOTHER) {
    			//console.log(`DROPPED_INTO_ANOTHER from ${xPos}, ${yPos}`); //starting container
    			//console.log(e)
    			dispatch('DRAGGED_FROM', {
    				type: "DRAGGED_FROM",
    				text: 'Item has been dragged from x, y',
    				xPos,
    				yPos
    			});
    		}

    		if (items.length != e.detail.items) {
    			dispatch('DRAGGED_TO', {
    				type: "DRAGGED_TO",
    				text: 'Item has been dragged to x, y',
    				xPos,
    				yPos
    			});
    		}

    		$$invalidate(0, items = e.detail.items);
    	}

    	const writable_props = ['letter', 'xPos', 'yPos'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LetterContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('letter' in $$props) $$invalidate(4, letter = $$props.letter);
    		if ('xPos' in $$props) $$invalidate(5, xPos = $$props.xPos);
    		if ('yPos' in $$props) $$invalidate(6, yPos = $$props.yPos);
    	};

    	$$self.$capture_state = () => ({
    		Letter: Letter$1,
    		dndzone,
    		TRIGGERS,
    		createEventDispatcher,
    		dispatch,
    		letter,
    		xPos,
    		yPos,
    		items,
    		handleDndConsider,
    		handleDndFinalize,
    		disable,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('letter' in $$props) $$invalidate(4, letter = $$props.letter);
    		if ('xPos' in $$props) $$invalidate(5, xPos = $$props.xPos);
    		if ('yPos' in $$props) $$invalidate(6, yPos = $$props.yPos);
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('disable' in $$props) $$invalidate(7, disable = $$props.disable);
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*letter*/ 16) {
    			$$invalidate(7, disable = letter.state === "blocked" || letter.state === "correct" || letter.game_state === "game_lost" || letter.game_state === "game_won");
    		}

    		if ($$self.$$.dirty & /*disable, items*/ 129) {
    			$$invalidate(1, options = {
    				dropFromOthersDisabled: disable,
    				dragDisabled: disable,
    				items,
    				dropTargetStyle: {},
    				flipDurationMs: 100
    			});
    		}
    	};

    	return [
    		items,
    		options,
    		handleDndConsider,
    		handleDndFinalize,
    		letter,
    		xPos,
    		yPos,
    		disable
    	];
    }

    class LetterContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { letter: 4, xPos: 5, yPos: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LetterContainer",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*letter*/ ctx[4] === undefined && !('letter' in props)) {
    			console.warn("<LetterContainer> was created without expected prop 'letter'");
    		}

    		if (/*xPos*/ ctx[5] === undefined && !('xPos' in props)) {
    			console.warn("<LetterContainer> was created without expected prop 'xPos'");
    		}

    		if (/*yPos*/ ctx[6] === undefined && !('yPos' in props)) {
    			console.warn("<LetterContainer> was created without expected prop 'yPos'");
    		}
    	}

    	get letter() {
    		throw new Error("<LetterContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set letter(value) {
    		throw new Error("<LetterContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xPos() {
    		throw new Error("<LetterContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xPos(value) {
    		throw new Error("<LetterContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yPos() {
    		throw new Error("<LetterContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yPos(value) {
    		throw new Error("<LetterContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\GameBoard\Row.svelte generated by Svelte v3.49.0 */
    const file$e = "src\\GameBoard\\Row.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (10:4) {#each row_list as letter, i (letter.id)}
    function create_each_block$3(key_1, ctx) {
    	let first;
    	let lettercontainer;
    	let current;

    	lettercontainer = new LetterContainer({
    			props: {
    				letter: /*letter*/ ctx[4],
    				xPos: /*i*/ ctx[6],
    				yPos: /*col*/ ctx[1]
    			},
    			$$inline: true
    		});

    	lettercontainer.$on("DRAGGED_FROM", /*DRAGGED_FROM_handler*/ ctx[2]);
    	lettercontainer.$on("DRAGGED_TO", /*DRAGGED_TO_handler*/ ctx[3]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(lettercontainer.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(lettercontainer, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const lettercontainer_changes = {};
    			if (dirty & /*row_list*/ 1) lettercontainer_changes.letter = /*letter*/ ctx[4];
    			if (dirty & /*row_list*/ 1) lettercontainer_changes.xPos = /*i*/ ctx[6];
    			if (dirty & /*col*/ 2) lettercontainer_changes.yPos = /*col*/ ctx[1];
    			lettercontainer.$set(lettercontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lettercontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lettercontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(lettercontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(10:4) {#each row_list as letter, i (letter.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*row_list*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*letter*/ ctx[4].id;
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "row svelte-1bu2qfp");
    			add_location(div, file$e, 8, 0, 180);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*row_list, col*/ 3) {
    				each_value = /*row_list*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const flipDurationMs = 150;

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, []);
    	let { row_list } = $$props;
    	let { col } = $$props;
    	const writable_props = ['row_list', 'col'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Row> was created with unknown prop '${key}'`);
    	});

    	function DRAGGED_FROM_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function DRAGGED_TO_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('row_list' in $$props) $$invalidate(0, row_list = $$props.row_list);
    		if ('col' in $$props) $$invalidate(1, col = $$props.col);
    	};

    	$$self.$capture_state = () => ({
    		LetterContainer,
    		row_list,
    		col,
    		flipDurationMs
    	});

    	$$self.$inject_state = $$props => {
    		if ('row_list' in $$props) $$invalidate(0, row_list = $$props.row_list);
    		if ('col' in $$props) $$invalidate(1, col = $$props.col);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [row_list, col, DRAGGED_FROM_handler, DRAGGED_TO_handler];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { row_list: 0, col: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*row_list*/ ctx[0] === undefined && !('row_list' in props)) {
    			console.warn("<Row> was created without expected prop 'row_list'");
    		}

    		if (/*col*/ ctx[1] === undefined && !('col' in props)) {
    			console.warn("<Row> was created without expected prop 'col'");
    		}
    	}

    	get row_list() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row_list(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get col() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set col(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class Letter {
        constructor(id, letter, state="incorrect") {
            this.id = id;
            this.letter = letter;
            this.state = state;
            this.game_state = state;
        }
    }

    /* src\Popups\SolModal\SolPopup.svelte generated by Svelte v3.49.0 */
    const file$d = "src\\Popups\\SolModal\\SolPopup.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (10:12) {#each board as row, i}
    function create_each_block$2(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				row_list: /*row*/ ctx[1],
    				col: /*i*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};
    			if (dirty & /*board*/ 1) row_changes.row_list = /*row*/ ctx[1];
    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(10:12) {#each board as row, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div2;
    	let h1;
    	let t1;
    	let div1;
    	let div0;
    	let current;
    	let each_value = /*board*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Solution";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-1br9232");
    			add_location(h1, file$d, 6, 4, 132);
    			attr_dev(div0, "class", "game-board svelte-1br9232");
    			add_location(div0, file$d, 8, 8, 200);
    			attr_dev(div1, "class", "board-container flexx svelte-1br9232");
    			add_location(div1, file$d, 7, 4, 155);
    			attr_dev(div2, "class", "main-popup flexx svelte-1br9232");
    			add_location(div2, file$d, 5, 0, 96);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*board*/ 1) {
    				each_value = /*board*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SolPopup', slots, []);
    	let { board } = $$props;
    	const writable_props = ['board'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SolPopup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('board' in $$props) $$invalidate(0, board = $$props.board);
    	};

    	$$self.$capture_state = () => ({ board, Row });

    	$$self.$inject_state = $$props => {
    		if ('board' in $$props) $$invalidate(0, board = $$props.board);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [board];
    }

    class SolPopup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { board: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SolPopup",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*board*/ ctx[0] === undefined && !('board' in props)) {
    			console.warn("<SolPopup> was created without expected prop 'board'");
    		}
    	}

    	get board() {
    		throw new Error("<SolPopup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set board(value) {
    		throw new Error("<SolPopup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Popups\SolModal\SolModalManager.svelte generated by Svelte v3.49.0 */
    const file$c = "src\\Popups\\SolModal\\SolModalManager.svelte";

    function create_fragment$c(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "show solution";
    			attr_dev(button, "class", "show-sol-button svelte-for4t0");
    			add_location(button, file$c, 10, 0, 241);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*openPopup*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SolModalManager', slots, []);
    	let { board } = $$props;
    	const { open } = getContext('simple-modal');
    	const openPopup = () => open(SolPopup, { board });
    	const writable_props = ['board'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SolModalManager> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('board' in $$props) $$invalidate(1, board = $$props.board);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		Popup: SolPopup,
    		board,
    		open,
    		openPopup
    	});

    	$$self.$inject_state = $$props => {
    		if ('board' in $$props) $$invalidate(1, board = $$props.board);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [openPopup, board];
    }

    class SolModalManager extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { board: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SolModalManager",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*board*/ ctx[1] === undefined && !('board' in props)) {
    			console.warn("<SolModalManager> was created without expected prop 'board'");
    		}
    	}

    	get board() {
    		throw new Error("<SolModalManager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set board(value) {
    		throw new Error("<SolModalManager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* node_modules\svelte-simple-modal\src\Modal.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$2, window: window_1 } = globals;
    const file$b = "node_modules\\svelte-simple-modal\\src\\Modal.svelte";

    // (423:0) {#if Component}
    function create_if_block$4(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let t;
    	let div0;
    	let switch_instance;
    	let div0_class_value;
    	let div1_class_value;
    	let div1_aria_label_value;
    	let div1_aria_labelledby_value;
    	let div1_transition;
    	let div2_class_value;
    	let div3_class_value;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*state*/ ctx[1].closeButton && create_if_block_1$3(ctx);
    	var switch_value = /*Component*/ ctx[2];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-g4wg3a"));
    			attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			add_location(div0, file$b, 466, 8, 11854);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-g4wg3a"));
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");

    			attr_dev(div1, "aria-label", div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null);

    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null);
    			attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			add_location(div1, file$b, 438, 6, 10907);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-g4wg3a"));
    			attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			add_location(div2, file$b, 432, 4, 10774);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-g4wg3a"));
    			attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			add_location(div3, file$b, 423, 2, 10528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			/*div1_binding*/ ctx[49](div1);
    			/*div2_binding*/ ctx[50](div2);
    			/*div3_binding*/ ctx[51](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div1,
    						"introstart",
    						function () {
    							if (is_function(/*onOpen*/ ctx[13])) /*onOpen*/ ctx[13].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outrostart",
    						function () {
    							if (is_function(/*onClose*/ ctx[14])) /*onClose*/ ctx[14].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"introend",
    						function () {
    							if (is_function(/*onOpened*/ ctx[15])) /*onOpened*/ ctx[15].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outroend",
    						function () {
    							if (is_function(/*onClosed*/ ctx[16])) /*onClosed*/ ctx[16].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "mousedown", /*handleOuterMousedown*/ ctx[20], false, false, false),
    					listen_dev(div3, "mouseup", /*handleOuterMouseup*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*state*/ ctx[1].closeButton) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-g4wg3a"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*cssContent*/ 512) {
    				attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-g4wg3a"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_label_value !== (div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null)) {
    				attr_dev(div1, "aria-label", div1_aria_label_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null)) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (!current || dirty[0] & /*cssWindow*/ 256) {
    				attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-g4wg3a"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty[0] & /*cssWindowWrap*/ 128) {
    				attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-g4wg3a"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty[0] & /*cssBg*/ 64) {
    				attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, false);
    			div1_transition.run(0);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[49](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[50](null);
    			/*div3_binding*/ ctx[51](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(423:0) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (454:8) {#if state.closeButton}
    function create_if_block_1$3(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$1, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*state*/ 2) show_if = null;
    		if (show_if == null) show_if = !!/*isFunction*/ ctx[17](/*state*/ ctx[1].closeButton);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, [-1, -1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(454:8) {#if state.closeButton}",
    		ctx
    	});

    	return block;
    }

    // (457:10) {:else}
    function create_else_block$4(ctx) {
    	let button;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-g4wg3a"));
    			attr_dev(button, "aria-label", "Close modal");
    			attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			add_location(button, file$b, 457, 12, 11603);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-g4wg3a"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty[0] & /*cssCloseButton*/ 1024) {
    				attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(457:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (455:10) {#if isFunction(state.closeButton)}
    function create_if_block_2$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*state*/ ctx[1].closeButton;

    	function switch_props(ctx) {
    		return {
    			props: { onClose: /*close*/ ctx[18] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*state*/ ctx[1].closeButton)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(455:10) {#if isFunction(state.closeButton)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Component*/ ctx[2] && create_if_block$4(ctx);
    	const default_slot_template = /*#slots*/ ctx[48].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[47], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "keydown", /*handleKeydown*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*Component*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*Component*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[47],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[47])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[47], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function bind(Component, props = {}) {
    	return function ModalComponent(options) {
    		return new Component({
    				...options,
    				props: { ...props, ...options.props }
    			});
    	};
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const baseSetContext = setContext;

    	/**
     * A basic function that checks if a node is tabbale
     */
    	const baseIsTabbable = node => node.tabIndex >= 0 && !node.hidden && !node.disabled && node.style.display !== 'none' && node.type !== 'hidden' && Boolean(node.offsetWidth || node.offsetHeight || node.getClientRects().length);

    	let { isTabbable = baseIsTabbable } = $$props;
    	let { show = null } = $$props;
    	let { key = 'simple-modal' } = $$props;
    	let { ariaLabel = null } = $$props;
    	let { ariaLabelledBy = null } = $$props;
    	let { closeButton = true } = $$props;
    	let { closeOnEsc = true } = $$props;
    	let { closeOnOuterClick = true } = $$props;
    	let { styleBg = {} } = $$props;
    	let { styleWindowWrap = {} } = $$props;
    	let { styleWindow = {} } = $$props;
    	let { styleContent = {} } = $$props;
    	let { styleCloseButton = {} } = $$props;
    	let { classBg = null } = $$props;
    	let { classWindowWrap = null } = $$props;
    	let { classWindow = null } = $$props;
    	let { classContent = null } = $$props;
    	let { classCloseButton = null } = $$props;
    	let { unstyled = false } = $$props;
    	let { setContext: setContext$1 = baseSetContext } = $$props;
    	let { transitionBg = fade } = $$props;
    	let { transitionBgProps = { duration: 250 } } = $$props;
    	let { transitionWindow = transitionBg } = $$props;
    	let { transitionWindowProps = transitionBgProps } = $$props;
    	let { disableFocusTrap = false } = $$props;

    	const defaultState = {
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isTabbable,
    		unstyled
    	};

    	let state = { ...defaultState };
    	let Component = null;
    	let background;
    	let wrap;
    	let modalWindow;
    	let scrollY;
    	let cssBg;
    	let cssWindowWrap;
    	let cssWindow;
    	let cssContent;
    	let cssCloseButton;
    	let currentTransitionBg;
    	let currentTransitionWindow;
    	let prevBodyPosition;
    	let prevBodyOverflow;
    	let prevBodyWidth;
    	let outerClickTarget;
    	const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

    	const toCssString = props => props
    	? Object.keys(props).reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, '')
    	: '';

    	const isFunction = f => !!(f && f.constructor && f.call && f.apply);

    	const updateStyleTransition = () => {
    		$$invalidate(6, cssBg = toCssString(Object.assign(
    			{},
    			{
    				width: window.innerWidth,
    				height: window.innerHeight
    			},
    			state.styleBg
    		)));

    		$$invalidate(7, cssWindowWrap = toCssString(state.styleWindowWrap));
    		$$invalidate(8, cssWindow = toCssString(state.styleWindow));
    		$$invalidate(9, cssContent = toCssString(state.styleContent));
    		$$invalidate(10, cssCloseButton = toCssString(state.styleCloseButton));
    		$$invalidate(11, currentTransitionBg = state.transitionBg);
    		$$invalidate(12, currentTransitionWindow = state.transitionWindow);
    	};

    	const toVoid = () => {
    		
    	};

    	let onOpen = toVoid;
    	let onClose = toVoid;
    	let onOpened = toVoid;
    	let onClosed = toVoid;

    	const open = (NewComponent, newProps = {}, options = {}, callback = {}) => {
    		$$invalidate(2, Component = bind(NewComponent, newProps));
    		$$invalidate(1, state = { ...defaultState, ...options });
    		updateStyleTransition();
    		disableScroll();

    		$$invalidate(13, onOpen = event => {
    			if (callback.onOpen) callback.onOpen(event);

    			/**
     * The open event is fired right before the modal opens
     * @event {void} open
     */
    			dispatch('open');

    			/**
     * The opening event is fired right before the modal opens
     * @event {void} opening
     * @deprecated Listen to the `open` event instead
     */
    			dispatch('opening'); // Deprecated. Do not use!
    		});

    		$$invalidate(14, onClose = event => {
    			if (callback.onClose) callback.onClose(event);

    			/**
     * The close event is fired right before the modal closes
     * @event {void} close
     */
    			dispatch('close');

    			/**
     * The closing event is fired right before the modal closes
     * @event {void} closing
     * @deprecated Listen to the `close` event instead
     */
    			dispatch('closing'); // Deprecated. Do not use!
    		});

    		$$invalidate(15, onOpened = event => {
    			if (callback.onOpened) callback.onOpened(event);

    			/**
     * The opened event is fired after the modal's opening transition
     * @event {void} opened
     */
    			dispatch('opened');
    		});

    		$$invalidate(16, onClosed = event => {
    			if (callback.onClosed) callback.onClosed(event);

    			/**
     * The closed event is fired after the modal's closing transition
     * @event {void} closed
     */
    			dispatch('closed');
    		});
    	};

    	const close = (callback = {}) => {
    		if (!Component) return;
    		$$invalidate(14, onClose = callback.onClose || onClose);
    		$$invalidate(16, onClosed = callback.onClosed || onClosed);
    		$$invalidate(2, Component = null);
    		enableScroll();
    	};

    	const handleKeydown = event => {
    		if (state.closeOnEsc && Component && event.key === 'Escape') {
    			event.preventDefault();
    			close();
    		}

    		if (Component && event.key === 'Tab' && !state.disableFocusTrap) {
    			// trap focus
    			const nodes = modalWindow.querySelectorAll('*');

    			const tabbable = Array.from(nodes).filter(state.isTabbable).sort((a, b) => a.tabIndex - b.tabIndex);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && event.shiftKey) index = 0;
    			index += tabbable.length + (event.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			event.preventDefault();
    		}
    	};

    	const handleOuterMousedown = event => {
    		if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) outerClickTarget = event.target;
    	};

    	const handleOuterMouseup = event => {
    		if (state.closeOnOuterClick && event.target === outerClickTarget) {
    			event.preventDefault();
    			close();
    		}
    	};

    	const disableScroll = () => {
    		scrollY = window.scrollY;
    		prevBodyPosition = document.body.style.position;
    		prevBodyOverflow = document.body.style.overflow;
    		prevBodyWidth = document.body.style.width;
    		document.body.style.position = 'fixed';
    		document.body.style.top = `-${scrollY}px`;
    		document.body.style.overflow = 'hidden';
    		document.body.style.width = '100%';
    	};

    	const enableScroll = () => {
    		document.body.style.position = prevBodyPosition || '';
    		document.body.style.top = '';
    		document.body.style.overflow = prevBodyOverflow || '';
    		document.body.style.width = prevBodyWidth || '';
    		window.scrollTo(0, scrollY);
    	};

    	setContext$1(key, { open, close });
    	let isMounted = false;

    	onDestroy(() => {
    		if (isMounted) close();
    	});

    	onMount(() => {
    		$$invalidate(46, isMounted = true);
    	});

    	const writable_props = [
    		'isTabbable',
    		'show',
    		'key',
    		'ariaLabel',
    		'ariaLabelledBy',
    		'closeButton',
    		'closeOnEsc',
    		'closeOnOuterClick',
    		'styleBg',
    		'styleWindowWrap',
    		'styleWindow',
    		'styleContent',
    		'styleCloseButton',
    		'classBg',
    		'classWindowWrap',
    		'classWindow',
    		'classContent',
    		'classCloseButton',
    		'unstyled',
    		'setContext',
    		'transitionBg',
    		'transitionBgProps',
    		'transitionWindow',
    		'transitionWindowProps',
    		'disableFocusTrap'
    	];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modalWindow = $$value;
    			$$invalidate(5, modalWindow);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrap = $$value;
    			$$invalidate(4, wrap);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('isTabbable' in $$props) $$invalidate(22, isTabbable = $$props.isTabbable);
    		if ('show' in $$props) $$invalidate(23, show = $$props.show);
    		if ('key' in $$props) $$invalidate(24, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(25, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(26, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(27, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(28, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(29, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(30, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(31, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(32, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(33, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(34, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(35, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(36, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(37, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(38, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(39, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(40, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(41, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(42, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(43, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(44, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(45, disableFocusTrap = $$props.disableFocusTrap);
    		if ('$$scope' in $$props) $$invalidate(47, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		bind,
    		svelte,
    		fade,
    		createEventDispatcher,
    		dispatch,
    		baseSetContext,
    		baseIsTabbable,
    		isTabbable,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		unstyled,
    		setContext: setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		defaultState,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		scrollY,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		prevBodyPosition,
    		prevBodyOverflow,
    		prevBodyWidth,
    		outerClickTarget,
    		camelCaseToDash,
    		toCssString,
    		isFunction,
    		updateStyleTransition,
    		toVoid,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		open,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		disableScroll,
    		enableScroll,
    		isMounted
    	});

    	$$self.$inject_state = $$props => {
    		if ('isTabbable' in $$props) $$invalidate(22, isTabbable = $$props.isTabbable);
    		if ('show' in $$props) $$invalidate(23, show = $$props.show);
    		if ('key' in $$props) $$invalidate(24, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(25, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(26, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(27, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(28, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(29, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(30, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(31, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(32, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(33, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(34, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(35, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(36, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(37, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(38, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(39, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(40, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(41, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(42, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(43, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(44, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(45, disableFocusTrap = $$props.disableFocusTrap);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('background' in $$props) $$invalidate(3, background = $$props.background);
    		if ('wrap' in $$props) $$invalidate(4, wrap = $$props.wrap);
    		if ('modalWindow' in $$props) $$invalidate(5, modalWindow = $$props.modalWindow);
    		if ('scrollY' in $$props) scrollY = $$props.scrollY;
    		if ('cssBg' in $$props) $$invalidate(6, cssBg = $$props.cssBg);
    		if ('cssWindowWrap' in $$props) $$invalidate(7, cssWindowWrap = $$props.cssWindowWrap);
    		if ('cssWindow' in $$props) $$invalidate(8, cssWindow = $$props.cssWindow);
    		if ('cssContent' in $$props) $$invalidate(9, cssContent = $$props.cssContent);
    		if ('cssCloseButton' in $$props) $$invalidate(10, cssCloseButton = $$props.cssCloseButton);
    		if ('currentTransitionBg' in $$props) $$invalidate(11, currentTransitionBg = $$props.currentTransitionBg);
    		if ('currentTransitionWindow' in $$props) $$invalidate(12, currentTransitionWindow = $$props.currentTransitionWindow);
    		if ('prevBodyPosition' in $$props) prevBodyPosition = $$props.prevBodyPosition;
    		if ('prevBodyOverflow' in $$props) prevBodyOverflow = $$props.prevBodyOverflow;
    		if ('prevBodyWidth' in $$props) prevBodyWidth = $$props.prevBodyWidth;
    		if ('outerClickTarget' in $$props) outerClickTarget = $$props.outerClickTarget;
    		if ('onOpen' in $$props) $$invalidate(13, onOpen = $$props.onOpen);
    		if ('onClose' in $$props) $$invalidate(14, onClose = $$props.onClose);
    		if ('onOpened' in $$props) $$invalidate(15, onOpened = $$props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(16, onClosed = $$props.onClosed);
    		if ('isMounted' in $$props) $$invalidate(46, isMounted = $$props.isMounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*show*/ 8388608 | $$self.$$.dirty[1] & /*isMounted*/ 32768) {
    			{
    				if (isMounted) {
    					if (isFunction(show)) {
    						open(show);
    					} else {
    						close();
    					}
    				}
    			}
    		}
    	};

    	return [
    		unstyled,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		isFunction,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		isTabbable,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isMounted,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$b,
    			create_fragment$b,
    			safe_not_equal,
    			{
    				isTabbable: 22,
    				show: 23,
    				key: 24,
    				ariaLabel: 25,
    				ariaLabelledBy: 26,
    				closeButton: 27,
    				closeOnEsc: 28,
    				closeOnOuterClick: 29,
    				styleBg: 30,
    				styleWindowWrap: 31,
    				styleWindow: 32,
    				styleContent: 33,
    				styleCloseButton: 34,
    				classBg: 35,
    				classWindowWrap: 36,
    				classWindow: 37,
    				classContent: 38,
    				classCloseButton: 39,
    				unstyled: 0,
    				setContext: 40,
    				transitionBg: 41,
    				transitionBgProps: 42,
    				transitionWindow: 43,
    				transitionWindowProps: 44,
    				disableFocusTrap: 45
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get isTabbable() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isTabbable(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnEsc() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnEsc(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnOuterClick() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnOuterClick(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unstyled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unstyled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setContext() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setContext(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBgProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBgProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindowProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindowProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disableFocusTrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disableFocusTrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function saveObj(key, obj) {
        window.localStorage.setItem(key, JSON.stringify(obj));
    }

    function getObj$1(key) {
        try {
            let json = JSON.parse(window.localStorage.getItem(key));
            return json
        } catch {
            return null
        }
    }

    /* src\GameBoard\GameBoard.svelte generated by Svelte v3.49.0 */
    const file$a = "src\\GameBoard\\GameBoard.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[24] = i;
    	return child_ctx;
    }

    // (290:12) {#each board as row, i}
    function create_each_block$1(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				row_list: /*row*/ ctx[22],
    				col: /*i*/ ctx[24]
    			},
    			$$inline: true
    		});

    	row.$on("DRAGGED_FROM", /*handleCustomEvent*/ ctx[4]);
    	row.$on("DRAGGED_TO", /*handleCustomEvent*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};
    			if (dirty & /*board*/ 4) row_changes.row_list = /*row*/ ctx[22];
    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(290:12) {#each board as row, i}",
    		ctx
    	});

    	return block;
    }

    // (289:8) {#key board}
    function create_key_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*board*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*board, handleCustomEvent*/ 20) {
    				each_value = /*board*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(289:8) {#key board}",
    		ctx
    	});

    	return block;
    }

    // (303:8) {:else}
    function create_else_block$3(ctx) {
    	let p;
    	let strong0;
    	let t0;
    	let t1;
    	let strong1;
    	let t3;

    	const block = {
    		c: function create() {
    			p = element("p");
    			strong0 = element("strong");
    			t0 = text(/*MOVES*/ ctx[3]);
    			t1 = text(" ಚಲನೆಗಳು ಉಳಿದಿರುವಾಗ ಆಟವನ್ನು ");
    			strong1 = element("strong");
    			strong1.textContent = "ಗೆದ್ದಿದ್ದೀರಿ";
    			t3 = text("!");
    			attr_dev(strong0, "class", "svelte-n6pppp");
    			add_location(strong0, file$a, 303, 15, 9815);
    			attr_dev(strong1, "class", "svelte-n6pppp");
    			add_location(strong1, file$a, 303, 67, 9867);
    			add_location(p, file$a, 303, 12, 9812);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, strong0);
    			append_dev(strong0, t0);
    			append_dev(p, t1);
    			append_dev(p, strong1);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*MOVES*/ 8) set_data_dev(t0, /*MOVES*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(303:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (301:40) 
    function create_if_block_3(ctx) {
    	let p;
    	let t0;
    	let strong;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ಆಟವನ್ನು ");
    			strong = element("strong");
    			strong.textContent = "ಕಳೆದುಕೊಂಡಿದ್ದೀರಿ";
    			attr_dev(strong, "class", "svelte-n6pppp");
    			add_location(strong, file$a, 301, 23, 9744);
    			add_location(p, file$a, 301, 12, 9733);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, strong);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(301:40) ",
    		ctx
    	});

    	return block;
    }

    // (299:8) {#if GAME_STATE === "playing"}
    function create_if_block_2(ctx) {
    	let p;
    	let t0;
    	let strong;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ಬಾಕಿ ಇರುವ ಚಲನೆಗಳು ");
    			strong = element("strong");
    			t1 = text(/*MOVES*/ ctx[3]);
    			t2 = text("!");
    			attr_dev(strong, "class", "svelte-n6pppp");
    			add_location(strong, file$a, 299, 33, 9648);
    			add_location(p, file$a, 299, 12, 9627);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, strong);
    			append_dev(strong, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*MOVES*/ 8) set_data_dev(t1, /*MOVES*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(299:8) {#if GAME_STATE === \\\"playing\\\"}",
    		ctx
    	});

    	return block;
    }

    // (310:8) {#if GAME_STATE === "lost"}
    function create_if_block_1$2(ctx) {
    	let content;
    	let current;

    	content = new SolModalManager({
    			props: { board: /*ans_board*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(content.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(310:8) {#if GAME_STATE === \\\"lost\\\"}",
    		ctx
    	});

    	return block;
    }

    // (313:8) {#if GAME_STATE != "playing"}
    function create_if_block$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "share";
    			attr_dev(button, "class", "share-btn svelte-n6pppp");
    			add_location(button, file$a, 313, 12, 10124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*shareButton*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(313:8) {#if GAME_STATE != \\\"playing\\\"}",
    		ctx
    	});

    	return block;
    }

    // (307:4) <Modal          classContent="modal"      >
    function create_default_slot$1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*GAME_STATE*/ ctx[1] === "lost" && create_if_block_1$2(ctx);
    	let if_block1 = /*GAME_STATE*/ ctx[1] != "playing" && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*GAME_STATE*/ ctx[1] === "lost") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*GAME_STATE*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*GAME_STATE*/ ctx[1] != "playing") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(307:4) <Modal          classContent=\\\"modal\\\"      >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div3;
    	let div0;
    	let p;
    	let t0;
    	let strong;
    	let t1;
    	let t2;
    	let t3;
    	let div1;
    	let previous_key = /*board*/ ctx[2];
    	let t4;
    	let div2;
    	let t5;
    	let modal;
    	let current;
    	let key_block = create_key_block(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*GAME_STATE*/ ctx[1] === "playing") return create_if_block_2;
    		if (/*GAME_STATE*/ ctx[1] === "lost") return create_if_block_3;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	modal = new Modal({
    			props: {
    				classContent: "modal",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text("daily obbattu ");
    			strong = element("strong");
    			t1 = text("#");
    			t2 = text(/*OBBATTU_COUNT*/ ctx[0]);
    			t3 = space();
    			div1 = element("div");
    			key_block.c();
    			t4 = space();
    			div2 = element("div");
    			if_block.c();
    			t5 = space();
    			create_component(modal.$$.fragment);
    			attr_dev(strong, "class", "svelte-n6pppp");
    			add_location(strong, file$a, 285, 25, 9194);
    			add_location(p, file$a, 285, 8, 9177);
    			attr_dev(div0, "class", "daily-obbattu-count svelte-n6pppp");
    			add_location(div0, file$a, 284, 4, 9134);
    			attr_dev(div1, "class", "game-board svelte-n6pppp");
    			add_location(div1, file$a, 287, 4, 9249);
    			attr_dev(div2, "class", "moves-counter flexx svelte-n6pppp");
    			add_location(div2, file$a, 297, 4, 9540);
    			attr_dev(div3, "class", "board-container flexx svelte-n6pppp");
    			add_location(div3, file$a, 283, 0, 9093);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(p, strong);
    			append_dev(strong, t1);
    			append_dev(strong, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			key_block.m(div1, null);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			if_block.m(div2, null);
    			append_dev(div3, t5);
    			mount_component(modal, div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*OBBATTU_COUNT*/ 1) set_data_dev(t2, /*OBBATTU_COUNT*/ ctx[0]);

    			if (dirty & /*board*/ 4 && safe_not_equal(previous_key, previous_key = /*board*/ ctx[2])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(div1, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			}

    			const modal_changes = {};

    			if (dirty & /*$$scope, GAME_STATE*/ 33554434) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			key_block.d(detaching);
    			if_block.d();
    			destroy_component(modal);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function debounce(func, timeout = 300) {
    	let timer;

    	return (...args) => {
    		clearTimeout(timer);

    		timer = setTimeout(
    			() => {
    				func.apply(this, args);
    			},
    			timeout
    		);
    	};
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let MOVES;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameBoard', slots, []);
    	const dispatch = createEventDispatcher();

    	let { questions = [
    		["a", "d", "f", "t", "e"],
    		["o", "", "j", "", "h"],
    		["c", "r", "m", "p", "k"],
    		["w", "", "l", "", "b"],
    		["u", "x", "n", "v", "y"]
    	] } = $$props;

    	let { answers = [
    		["a", "b", "c", "d", "e"],
    		["e", "j", "o", "t", "y"],
    		["a", "f", "k", "p", "u"],
    		["u", "v", "w", "x", "y"],
    		["c", "h", "m", "r", "w"],
    		["k", "l", "m", "n", "o"]
    	] } = $$props;

    	let { ans_to_show = [
    		["a", "b", "c", "d", "e"],
    		["f", "", "h", "", "j"],
    		["k", "l", "m", "n", "o"],
    		["p", "", "r", "", "t"],
    		["u", "v", "w", "x", "y"]
    	] } = $$props;

    	let { TOTAL_MOVES = 20 } = $$props;
    	let { OBBATTU_COUNT = 0 } = $$props;
    	let GAME_STATE = "playing";
    	let char_num = 0;

    	function getRow(row_num, ans = false) {
    		let arr = [];
    		let state = "incorrect";

    		for (let i = 0; i < 5; i++) {
    			if (ans === false) {
    				if ((i === 0 || i === 4) && (row_num === 0 || row_num === 4) || i === 2 && row_num === 2) {
    					state = "correct";
    				} else if (questions[row_num][i] === "") {
    					state = "blocked";
    				} else {
    					state = "incorrect";
    				}

    				arr.push(new Letter(char_num, questions[row_num][i], state));
    			} else {
    				if (ans_to_show[row_num][i] === "") {
    					state = "blocked";
    				} else {
    					state = "correct";
    				}

    				arr.push(new Letter(char_num, ans_to_show[row_num][i], state));
    			}

    			char_num++;
    		}

    		return arr;
    	}

    	function getBoard(ans = false) {
    		let board = [];

    		for (let i = 0; i < 5; i++) {
    			board.push(getRow(i, ans));
    		}

    		return board;
    	}

    	let events = [];

    	function handleCustomEvent(event) {
    		//console.log(event.detail)
    		for (let i = 0; i < events.length; i++) {
    			if (events[i].type === event.detail.type) {
    				$$invalidate(11, events = []);
    				return;
    			}
    		}

    		$$invalidate(11, events = [...events, event.detail]);

    		//console.log("An event occured", events.length, events)
    		setTimeout(
    			() => {
    				if (events.length > 0) {
    					//console.log("No double event occured")
    					$$invalidate(11, events = []);
    				}
    			},
    			500
    		);
    	}

    	function checkPosition(x, y, temp) {
    		if (temp.state === "blocked") {
    			return temp;
    		}

    		if (y === 0 && answers[0].includes(temp.letter)) {
    			if (answers[0][x] === temp.letter) {
    				temp.state = "correct";
    			} else {
    				temp.state = "misplaced";
    			}
    		} else if (x === 0 && answers[2].includes(temp.letter)) {
    			if (answers[2][y] === temp.letter) {
    				temp.state = "correct";
    			} else {
    				temp.state = "misplaced";
    			}
    		} else if (y === 4 && answers[3].includes(temp.letter)) {
    			if (answers[3][x] === temp.letter) {
    				temp.state = "correct";
    			} else {
    				temp.state = "misplaced";
    			}
    		} else if (x === 4 && answers[1].includes(temp.letter)) {
    			if (answers[1][y] === temp.letter) {
    				temp.state = "correct";
    			} else {
    				temp.state = "misplaced";
    			}
    		} else if (x === 2 && answers[4].includes(temp.letter)) {
    			if (answers[4][y] === temp.letter) {
    				temp.state = "correct";
    			} else {
    				temp.state = "misplaced";
    			}
    		} else if (y === 2 && answers[5].includes(temp.letter)) {
    			if (answers[5][x] === temp.letter) {
    				temp.state = "correct";
    			} else {
    				temp.state = "misplaced";
    			}
    		} else {
    			temp.state = "incorrect";
    		}

    		return temp;
    	}

    	function saveSnapshot() {
    		//console.log("saving snapshot...")
    		let GAME_BOARD = { questions, MOVES };

    		saveObj("GAME_BOARD", GAME_BOARD);
    	}

    	let debounceSave = debounce(saveSnapshot, 500);

    	function checkGameState(extra = true) {
    		//console.log("checking state...")
    		//console.log(board)
    		for (let i = 0; i < board.length; i++) {
    			for (let j = 0; j < board[i].length; j++) {
    				if (board[i][j].state === "incorrect" || board[i][j].state === "misplaced") {
    					if (MOVES <= 0) {
    						$$invalidate(2, board = endGame(board, false));
    						dispatch('GAME_LOST', { extra });
    						saveSnapshot();
    					} //console.log(board)

    					return;
    				}
    			}
    		}

    		$$invalidate(2, board = endGame(board, true));
    		dispatch('GAME_WON', { extra });
    		saveSnapshot();
    	} //console.log("extra from checkGameState", extra)

    	function swapElements(x1, y1, x2, y2) {
    		if (x1 === x2 && y1 === y2) {
    			return;
    		}

    		$$invalidate(3, MOVES -= 1);
    		let temp = checkPosition(y2, x2, board[x1][y1]);
    		let temp2 = checkPosition(y1, x1, board[x2][y2]);

    		// I dont know why its like (y, x), even if its designed to be like (x, y), it works, so im not going to question this
    		$$invalidate(2, board[x1][y1] = temp2, board);

    		$$invalidate(2, board[x2][y2] = temp, board);
    		let questionsTemp = questions[x2][y2];
    		$$invalidate(7, questions[x2][y2] = questions[x1][y1], questions);
    		$$invalidate(7, questions[x1][y1] = questionsTemp, questions);
    		debounceSave();
    		checkGameState();
    	}

    	function endGame(board, won = false) {
    		if (won === false) {
    			$$invalidate(1, GAME_STATE = "lost");
    		} else {
    			$$invalidate(1, GAME_STATE = "won");
    		}

    		for (let i = 0; i < board.length; i++) {
    			for (let j = 0; j < board[i].length; j++) {
    				if (board[i][j].state != "blocked") {
    					if (won === true) {
    						board[i][j].game_state = "game_won";
    					} else {
    						board[i][j].game_state = "game_lost";
    					}
    				}
    			}
    		}

    		return board;
    	}

    	function shareButton() {
    		let mainText = "DAILY OBBATTU #" + OBBATTU_COUNT + "\n\n";
    		let board_emoji = "";

    		if (GAME_STATE === "won") {
    			board_emoji = "🟩🟩🟩🟩🟩\n🟩⬜🟩⬜🟩\n🟩🟩🟩🟩🟩\n🟩⬜🟩⬜🟩\n🟩🟩🟩🟩🟩\n";
    		} else {
    			for (let i = 0; i < board.length; i++) {
    				for (let j = 0; j < board[i].length; j++) {
    					if (board[i][j].state === "incorrect") {
    						board_emoji += "⬛";
    					} else if (board[i][j].state === "misplaced") {
    						board_emoji += "🟨";
    					} else if (board[i][j].state === "correct") {
    						board_emoji += "🟩";
    					} else {
    						board_emoji += "⬜";
    					}
    				}

    				board_emoji += "\n";
    			}
    		}

    		mainText += board_emoji + "\nPlay today's game on https://obbattu.xyz";
    		navigator.clipboard.writeText(mainText);
    		navigator.share({ title: 'Obbattu', text: mainText });
    	}

    	let board = getBoard();
    	let ans_board = getBoard(true);

    	for (let i = 0; i < board.length; i++) {
    		for (let j = 0; j < board[i].length; j++) {
    			checkPosition(j, i, board[i][j]);
    		}
    	}

    	setTimeout(() => checkGameState(false), 1);
    	const writable_props = ['questions', 'answers', 'ans_to_show', 'TOTAL_MOVES', 'OBBATTU_COUNT'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameBoard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('questions' in $$props) $$invalidate(7, questions = $$props.questions);
    		if ('answers' in $$props) $$invalidate(8, answers = $$props.answers);
    		if ('ans_to_show' in $$props) $$invalidate(9, ans_to_show = $$props.ans_to_show);
    		if ('TOTAL_MOVES' in $$props) $$invalidate(10, TOTAL_MOVES = $$props.TOTAL_MOVES);
    		if ('OBBATTU_COUNT' in $$props) $$invalidate(0, OBBATTU_COUNT = $$props.OBBATTU_COUNT);
    	};

    	$$self.$capture_state = () => ({
    		Row,
    		Letter,
    		Content: SolModalManager,
    		Modal,
    		saveObj,
    		createEventDispatcher,
    		dispatch,
    		questions,
    		answers,
    		ans_to_show,
    		TOTAL_MOVES,
    		OBBATTU_COUNT,
    		GAME_STATE,
    		char_num,
    		getRow,
    		getBoard,
    		events,
    		handleCustomEvent,
    		checkPosition,
    		saveSnapshot,
    		debounce,
    		debounceSave,
    		checkGameState,
    		swapElements,
    		endGame,
    		shareButton,
    		board,
    		ans_board,
    		MOVES
    	});

    	$$self.$inject_state = $$props => {
    		if ('questions' in $$props) $$invalidate(7, questions = $$props.questions);
    		if ('answers' in $$props) $$invalidate(8, answers = $$props.answers);
    		if ('ans_to_show' in $$props) $$invalidate(9, ans_to_show = $$props.ans_to_show);
    		if ('TOTAL_MOVES' in $$props) $$invalidate(10, TOTAL_MOVES = $$props.TOTAL_MOVES);
    		if ('OBBATTU_COUNT' in $$props) $$invalidate(0, OBBATTU_COUNT = $$props.OBBATTU_COUNT);
    		if ('GAME_STATE' in $$props) $$invalidate(1, GAME_STATE = $$props.GAME_STATE);
    		if ('char_num' in $$props) char_num = $$props.char_num;
    		if ('events' in $$props) $$invalidate(11, events = $$props.events);
    		if ('debounceSave' in $$props) debounceSave = $$props.debounceSave;
    		if ('board' in $$props) $$invalidate(2, board = $$props.board);
    		if ('ans_board' in $$props) $$invalidate(6, ans_board = $$props.ans_board);
    		if ('MOVES' in $$props) $$invalidate(3, MOVES = $$props.MOVES);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*TOTAL_MOVES*/ 1024) {
    			$$invalidate(3, MOVES = TOTAL_MOVES);
    		}

    		if ($$self.$$.dirty & /*events*/ 2048) {
    			{
    				if (events.length >= 2) {
    					let dragged_from = events.find(event => event.type === "DRAGGED_FROM");
    					let dragged_to = events.find(event => event.type === "DRAGGED_TO");
    					$$invalidate(11, events = []);
    					swapElements(dragged_from.yPos, dragged_from.xPos, dragged_to.yPos, dragged_to.xPos);
    				} // I dont know why its like (y1, x1; y2, x2), even if its designed to be like (x1, y1; x2, y2), it works, so im not going to question this
    			}
    		}
    	};

    	return [
    		OBBATTU_COUNT,
    		GAME_STATE,
    		board,
    		MOVES,
    		handleCustomEvent,
    		shareButton,
    		ans_board,
    		questions,
    		answers,
    		ans_to_show,
    		TOTAL_MOVES,
    		events
    	];
    }

    class GameBoard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			questions: 7,
    			answers: 8,
    			ans_to_show: 9,
    			TOTAL_MOVES: 10,
    			OBBATTU_COUNT: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameBoard",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get questions() {
    		throw new Error("<GameBoard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set questions(value) {
    		throw new Error("<GameBoard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get answers() {
    		throw new Error("<GameBoard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set answers(value) {
    		throw new Error("<GameBoard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ans_to_show() {
    		throw new Error("<GameBoard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ans_to_show(value) {
    		throw new Error("<GameBoard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get TOTAL_MOVES() {
    		throw new Error("<GameBoard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set TOTAL_MOVES(value) {
    		throw new Error("<GameBoard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get OBBATTU_COUNT() {
    		throw new Error("<GameBoard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set OBBATTU_COUNT(value) {
    		throw new Error("<GameBoard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Popups\HelpPopup\HelpPopup.svelte generated by Svelte v3.49.0 */
    const file$9 = "src\\Popups\\HelpPopup\\HelpPopup.svelte";

    function create_fragment$9(ctx) {
    	let div11;
    	let h10;
    	let t1;
    	let p0;
    	let t3;
    	let hr0;
    	let t4;
    	let div0;
    	let lettercomponenet0;
    	let t5;
    	let p1;
    	let t7;
    	let div1;
    	let lettercomponenet1;
    	let t8;
    	let p2;
    	let t10;
    	let div2;
    	let lettercomponenet2;
    	let t11;
    	let p3;
    	let t13;
    	let hr1;
    	let t14;
    	let h11;
    	let t16;
    	let div10;
    	let div9;
    	let div3;
    	let p4;
    	let t18;
    	let div4;
    	let a0;
    	let t20;
    	let div5;
    	let p5;
    	let t22;
    	let div6;
    	let a1;
    	let t24;
    	let a2;
    	let t26;
    	let a3;
    	let t28;
    	let div7;
    	let p6;
    	let t30;
    	let div8;
    	let a4;
    	let current;

    	lettercomponenet0 = new Letter$1({
    			props: {
    				letter: new Letter(undefined, "ಅ", "correct")
    			},
    			$$inline: true
    		});

    	lettercomponenet1 = new Letter$1({
    			props: {
    				letter: new Letter(undefined, "ಅ", "misplaced")
    			},
    			$$inline: true
    		});

    	lettercomponenet2 = new Letter$1({
    			props: {
    				letter: new Letter(undefined, "ಅ", "incorrect")
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			h10 = element("h1");
    			h10.textContent = "ಆಟದ ಬಗ್ಗೆ";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "ಒಬ್ಬಟ್ಟು ಆಡುವ ವಿಧಾನ. ಪ್ರತಿಯೊಂದು ಆಟವನ್ನು 20 ಅಥವಾ ಕಡಿಮೆ ಚಲನೆಗಳಲ್ಲಿ ಮುಗಿಸಬಹುದು. ಅಕ್ಷರಗಳನ್ನು ಸರಿಯಾಗಿ ಜೋಡಿಸಿ ಪದಗಳನ್ನು ಮಾಡಿ, ಅಡ್ಡವಾಗಿ ಮತ್ತು ಉದ್ದವಾಗಿ. ನಿಮ್ಮ ಅನಿಸಿಕೆಗಳನ್ನು \"skandabhairava@gmail.com\"ಗೆ ಕಳಿಸಿ.";
    			t3 = space();
    			hr0 = element("hr");
    			t4 = space();
    			div0 = element("div");
    			create_component(lettercomponenet0.$$.fragment);
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "ಹಸಿರು ಬಣ್ಣದ ಅಕ್ಷರ ಪದದಲ್ಲಿ ಸರಿಯಾದ ಜಾಗದಲ್ಲಿ ಇದೆ. ಹಸಿರು ಬಣ್ಣದ ಅಕ್ಷರಗಳನ್ನು ಬಿಟ್ಟು ಬೇರೆ ಅಕ್ಷರಗಳನ್ನು ಬೇರೆ ಜಾಗಕ್ಕೆ ಚಲಿಸಬಹುದು.";
    			t7 = space();
    			div1 = element("div");
    			create_component(lettercomponenet1.$$.fragment);
    			t8 = space();
    			p2 = element("p");
    			p2.textContent = "ಹಳದಿ ಬಣ್ಣದ ಅಕ್ಷರ ಪದದಲ್ಲಿ ಇದೆ ಆದರೆ ಸರಿಯಾದ ಜಾಗದಲ್ಲಿ ಇಲ್ಲ.";
    			t10 = space();
    			div2 = element("div");
    			create_component(lettercomponenet2.$$.fragment);
    			t11 = space();
    			p3 = element("p");
    			p3.textContent = "ಬೂದು ಬಣ್ಣದ ಅಕ್ಷರಗಳು ಪದದಲ್ಲಿಲ್ಲ.";
    			t13 = space();
    			hr1 = element("hr");
    			t14 = space();
    			h11 = element("h1");
    			h11.textContent = "Credits";
    			t16 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div3 = element("div");
    			p4 = element("p");
    			p4.textContent = "ಮಾಡಿದ್ದು";
    			t18 = space();
    			div4 = element("div");
    			a0 = element("a");
    			a0.textContent = "ಸ್ಕಂದ ಭೈರವ";
    			t20 = space();
    			div5 = element("div");
    			p5 = element("p");
    			p5.textContent = "ಸ್ಫೂರ್ತಿ";
    			t22 = space();
    			div6 = element("div");
    			a1 = element("a");
    			a1.textContent = "WaffleGame";
    			t24 = space();
    			a2 = element("a");
    			a2.textContent = "Wordle";
    			t26 = space();
    			a3 = element("a");
    			a3.textContent = "Wordalla";
    			t28 = space();
    			div7 = element("div");
    			p6 = element("p");
    			p6.textContent = "ಮೂಲ ಕೋಡ್";
    			t30 = space();
    			div8 = element("div");
    			a4 = element("a");
    			a4.textContent = "Github";
    			attr_dev(h10, "class", "svelte-1egjh85");
    			add_location(h10, file$9, 6, 4, 193);
    			add_location(p0, file$9, 7, 4, 217);
    			attr_dev(hr0, "class", "svelte-1egjh85");
    			add_location(hr0, file$9, 8, 4, 429);
    			attr_dev(div0, "class", "limit-letter svelte-1egjh85");
    			add_location(div0, file$9, 9, 4, 439);
    			add_location(p1, file$9, 12, 4, 559);
    			attr_dev(div1, "class", "limit-letter svelte-1egjh85");
    			add_location(div1, file$9, 13, 4, 690);
    			add_location(p2, file$9, 16, 4, 812);
    			attr_dev(div2, "class", "limit-letter svelte-1egjh85");
    			add_location(div2, file$9, 17, 4, 881);
    			add_location(p3, file$9, 20, 4, 1003);
    			attr_dev(hr1, "class", "svelte-1egjh85");
    			add_location(hr1, file$9, 21, 4, 1048);
    			attr_dev(h11, "class", "svelte-1egjh85");
    			add_location(h11, file$9, 22, 4, 1058);
    			add_location(p4, file$9, 26, 16, 1179);
    			attr_dev(div3, "class", "item svelte-1egjh85");
    			add_location(div3, file$9, 25, 12, 1143);
    			attr_dev(a0, "class", "a-tag svelte-1egjh85");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "href", "https://github.com/skandabhairava");
    			add_location(a0, file$9, 29, 16, 1264);
    			attr_dev(div4, "class", "item svelte-1egjh85");
    			add_location(div4, file$9, 28, 12, 1228);
    			add_location(p5, file$9, 32, 16, 1422);
    			attr_dev(div5, "class", "item svelte-1egjh85");
    			add_location(div5, file$9, 31, 12, 1386);
    			attr_dev(a1, "class", "a-tag svelte-1egjh85");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "href", "https://wafflegame.net/");
    			add_location(a1, file$9, 35, 16, 1507);
    			attr_dev(a2, "class", "a-tag svelte-1egjh85");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "href", "https://www.nytimes.com/games/wordle/index.html");
    			add_location(a2, file$9, 36, 16, 1603);
    			attr_dev(a3, "class", "a-tag svelte-1egjh85");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "href", "https://wordalla.online/");
    			add_location(a3, file$9, 37, 16, 1719);
    			attr_dev(div6, "class", "item svelte-1egjh85");
    			add_location(div6, file$9, 34, 12, 1471);
    			add_location(p6, file$9, 40, 16, 1866);
    			attr_dev(div7, "class", "item svelte-1egjh85");
    			add_location(div7, file$9, 39, 12, 1830);
    			attr_dev(a4, "class", "a-tag svelte-1egjh85");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "href", "https://github.com/skandabhairava/Oxidised-Obbattu");
    			add_location(a4, file$9, 43, 16, 1951);
    			attr_dev(div8, "class", "item svelte-1egjh85");
    			add_location(div8, file$9, 42, 12, 1915);
    			attr_dev(div9, "class", "dict svelte-1egjh85");
    			add_location(div9, file$9, 24, 8, 1111);
    			attr_dev(div10, "class", "credits");
    			add_location(div10, file$9, 23, 4, 1080);
    			attr_dev(div11, "class", "main-popup flexx svelte-1egjh85");
    			add_location(div11, file$9, 5, 0, 157);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, h10);
    			append_dev(div11, t1);
    			append_dev(div11, p0);
    			append_dev(div11, t3);
    			append_dev(div11, hr0);
    			append_dev(div11, t4);
    			append_dev(div11, div0);
    			mount_component(lettercomponenet0, div0, null);
    			append_dev(div11, t5);
    			append_dev(div11, p1);
    			append_dev(div11, t7);
    			append_dev(div11, div1);
    			mount_component(lettercomponenet1, div1, null);
    			append_dev(div11, t8);
    			append_dev(div11, p2);
    			append_dev(div11, t10);
    			append_dev(div11, div2);
    			mount_component(lettercomponenet2, div2, null);
    			append_dev(div11, t11);
    			append_dev(div11, p3);
    			append_dev(div11, t13);
    			append_dev(div11, hr1);
    			append_dev(div11, t14);
    			append_dev(div11, h11);
    			append_dev(div11, t16);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div3);
    			append_dev(div3, p4);
    			append_dev(div9, t18);
    			append_dev(div9, div4);
    			append_dev(div4, a0);
    			append_dev(div9, t20);
    			append_dev(div9, div5);
    			append_dev(div5, p5);
    			append_dev(div9, t22);
    			append_dev(div9, div6);
    			append_dev(div6, a1);
    			append_dev(div6, t24);
    			append_dev(div6, a2);
    			append_dev(div6, t26);
    			append_dev(div6, a3);
    			append_dev(div9, t28);
    			append_dev(div9, div7);
    			append_dev(div7, p6);
    			append_dev(div9, t30);
    			append_dev(div9, div8);
    			append_dev(div8, a4);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lettercomponenet0.$$.fragment, local);
    			transition_in(lettercomponenet1.$$.fragment, local);
    			transition_in(lettercomponenet2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lettercomponenet0.$$.fragment, local);
    			transition_out(lettercomponenet1.$$.fragment, local);
    			transition_out(lettercomponenet2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			destroy_component(lettercomponenet0);
    			destroy_component(lettercomponenet1);
    			destroy_component(lettercomponenet2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HelpPopup', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HelpPopup> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ LetterComponenet: Letter$1, Letter });
    	return [];
    }

    class HelpPopup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HelpPopup",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\Popups\HelpPopup\HelpModalManager.svelte generated by Svelte v3.49.0 */
    const file$8 = "src\\Popups\\HelpPopup\\HelpModalManager.svelte";

    function create_fragment$8(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "?";
    			attr_dev(button, "class", "help-button svelte-1cragtd");
    			add_location(button, file$8, 8, 0, 211);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*openPopup*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HelpModalManager', slots, []);
    	const { open } = getContext('simple-modal');
    	const openPopup = () => open(HelpPopup, {});
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HelpModalManager> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getContext, Popup: HelpPopup, open, openPopup });
    	return [openPopup];
    }

    class HelpModalManager extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HelpModalManager",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\Popups\StatPopup\StatPopup.svelte generated by Svelte v3.49.0 */

    const file$7 = "src\\Popups\\StatPopup\\StatPopup.svelte";

    function create_fragment$7(ctx) {
    	let div7;
    	let h1;
    	let t1;
    	let hr;
    	let t2;
    	let div6;
    	let div0;
    	let p0;
    	let t4;
    	let div1;
    	let p1;
    	let t5;
    	let t6;
    	let div2;
    	let p2;
    	let t8;
    	let div3;
    	let p3;
    	let t9;
    	let t10;
    	let div4;
    	let p4;
    	let t12;
    	let div5;
    	let p5;
    	let t13;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Statistics";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div6 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Played";
    			t4 = space();
    			div1 = element("div");
    			p1 = element("p");
    			t5 = text(/*GAMES_PLAYED*/ ctx[0]);
    			t6 = space();
    			div2 = element("div");
    			p2 = element("p");
    			p2.textContent = "Games Won";
    			t8 = space();
    			div3 = element("div");
    			p3 = element("p");
    			t9 = text(/*GAMES_WON*/ ctx[1]);
    			t10 = space();
    			div4 = element("div");
    			p4 = element("p");
    			p4.textContent = "Games Lost";
    			t12 = space();
    			div5 = element("div");
    			p5 = element("p");
    			t13 = text(/*GAMES_LOST*/ ctx[2]);
    			attr_dev(h1, "class", "svelte-lon2u1");
    			add_location(h1, file$7, 45, 4, 1088);
    			attr_dev(hr, "class", "svelte-lon2u1");
    			add_location(hr, file$7, 46, 4, 1113);
    			add_location(p0, file$7, 49, 12, 1188);
    			attr_dev(div0, "class", "item left svelte-lon2u1");
    			add_location(div0, file$7, 48, 8, 1151);
    			add_location(p1, file$7, 52, 12, 1265);
    			attr_dev(div1, "class", "item right svelte-lon2u1");
    			add_location(div1, file$7, 51, 8, 1227);
    			add_location(p2, file$7, 55, 12, 1349);
    			attr_dev(div2, "class", "item left svelte-lon2u1");
    			add_location(div2, file$7, 54, 8, 1312);
    			add_location(p3, file$7, 58, 12, 1429);
    			attr_dev(div3, "class", "item right svelte-lon2u1");
    			add_location(div3, file$7, 57, 8, 1391);
    			add_location(p4, file$7, 61, 12, 1510);
    			attr_dev(div4, "class", "item left svelte-lon2u1");
    			add_location(div4, file$7, 60, 8, 1473);
    			add_location(p5, file$7, 64, 12, 1591);
    			attr_dev(div5, "class", "item right svelte-lon2u1");
    			add_location(div5, file$7, 63, 8, 1553);
    			attr_dev(div6, "class", "dict svelte-lon2u1");
    			add_location(div6, file$7, 47, 4, 1123);
    			attr_dev(div7, "class", "main-popup flexx svelte-lon2u1");
    			add_location(div7, file$7, 44, 0, 1052);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, h1);
    			append_dev(div7, t1);
    			append_dev(div7, hr);
    			append_dev(div7, t2);
    			append_dev(div7, div6);
    			append_dev(div6, div0);
    			append_dev(div0, p0);
    			append_dev(div6, t4);
    			append_dev(div6, div1);
    			append_dev(div1, p1);
    			append_dev(p1, t5);
    			append_dev(div6, t6);
    			append_dev(div6, div2);
    			append_dev(div2, p2);
    			append_dev(div6, t8);
    			append_dev(div6, div3);
    			append_dev(div3, p3);
    			append_dev(p3, t9);
    			append_dev(div6, t10);
    			append_dev(div6, div4);
    			append_dev(div4, p4);
    			append_dev(div6, t12);
    			append_dev(div6, div5);
    			append_dev(div5, p5);
    			append_dev(p5, t13);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*GAMES_PLAYED*/ 1) set_data_dev(t5, /*GAMES_PLAYED*/ ctx[0]);
    			if (dirty & /*GAMES_WON*/ 2) set_data_dev(t9, /*GAMES_WON*/ ctx[1]);
    			if (dirty & /*GAMES_LOST*/ 4) set_data_dev(t13, /*GAMES_LOST*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function saveObject(key, obj) {
    	window.localStorage.setItem(key, JSON.stringify(obj));
    }

    function getObj(key) {
    	// console.log("Shits going on...")
    	try {
    		let json = JSON.parse(window.localStorage.getItem(key));

    		// console.log("found item", json)
    		return json;
    	} catch {
    		return null;
    	}
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let GAMES_LOST;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StatPopup', slots, []);
    	let GAMES_PLAYED = 0;
    	let GAMES_WON = 0;
    	let game_stats = getObj("GAME_STATS");

    	// console.log("found stats", game_stats)
    	function load() {
    		if (game_stats === null) {
    			game_stats = { GAMES_PLAYED: 0, GAMES_WON: 0 };
    			saveObject("GAME_STATS", game_stats);
    		} else {
    			($$invalidate(0, GAMES_PLAYED = game_stats.GAMES_PLAYED), $$invalidate(1, GAMES_WON = game_stats.GAMES_WON));
    		}
    	}

    	load();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StatPopup> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		GAMES_PLAYED,
    		GAMES_WON,
    		saveObject,
    		getObj,
    		game_stats,
    		load,
    		GAMES_LOST
    	});

    	$$self.$inject_state = $$props => {
    		if ('GAMES_PLAYED' in $$props) $$invalidate(0, GAMES_PLAYED = $$props.GAMES_PLAYED);
    		if ('GAMES_WON' in $$props) $$invalidate(1, GAMES_WON = $$props.GAMES_WON);
    		if ('game_stats' in $$props) game_stats = $$props.game_stats;
    		if ('GAMES_LOST' in $$props) $$invalidate(2, GAMES_LOST = $$props.GAMES_LOST);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*GAMES_PLAYED, GAMES_WON*/ 3) {
    			$$invalidate(2, GAMES_LOST = GAMES_PLAYED - GAMES_WON);
    		}
    	};

    	return [GAMES_PLAYED, GAMES_WON, GAMES_LOST];
    }

    class StatPopup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StatPopup",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\Popups\StatPopup\StatModalManager.svelte generated by Svelte v3.49.0 */
    const file$6 = "src\\Popups\\StatPopup\\StatModalManager.svelte";

    function create_fragment$6(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./stats.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "statistics");
    			attr_dev(img, "class", "stats-img svelte-1maplsy");
    			add_location(img, file$6, 12, 4, 280);
    			attr_dev(button, "class", "stats-button svelte-1maplsy");
    			add_location(button, file$6, 8, 0, 211);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*openPopup*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StatModalManager', slots, []);
    	const { open } = getContext('simple-modal');
    	const openPopup = () => open(StatPopup, {});
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StatModalManager> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getContext, Popup: StatPopup, open, openPopup });
    	return [openPopup];
    }

    class StatModalManager extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StatModalManager",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\Header.svelte generated by Svelte v3.49.0 */
    const file$5 = "src\\Header.svelte";

    // (9:4) <Modal classContent="modal">
    function create_default_slot_1(ctx) {
    	let helpmodal;
    	let current;
    	helpmodal = new HelpModalManager({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(helpmodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(helpmodal, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(helpmodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(helpmodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(helpmodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(9:4) <Modal classContent=\\\"modal\\\">",
    		ctx
    	});

    	return block;
    }

    // (15:4) <Modal classContent="modal">
    function create_default_slot(ctx) {
    	let statpopup;
    	let current;
    	statpopup = new StatModalManager({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(statpopup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(statpopup, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(statpopup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(statpopup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(statpopup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(15:4) <Modal classContent=\\\"modal\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let modal0;
    	let t0;
    	let div0;
    	let h1;
    	let t2;
    	let modal1;
    	let current;

    	modal0 = new Modal({
    			props: {
    				classContent: "modal",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal1 = new Modal({
    			props: {
    				classContent: "modal",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(modal0.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "ಒಬ್ಬಟ್ಟು";
    			t2 = space();
    			create_component(modal1.$$.fragment);
    			attr_dev(h1, "class", "svelte-qlj59i");
    			add_location(h1, file$5, 12, 8, 340);
    			attr_dev(div0, "class", "title svelte-qlj59i");
    			add_location(div0, file$5, 11, 4, 311);
    			attr_dev(div1, "class", "flexx");
    			add_location(div1, file$5, 7, 0, 215);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(modal0, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div1, t2);
    			mount_component(modal1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				modal0_changes.$$scope = { dirty, ctx };
    			}

    			modal0.$set(modal0_changes);
    			const modal1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				modal1_changes.$$scope = { dirty, ctx };
    			}

    			modal1.$set(modal1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal0.$$.fragment, local);
    			transition_in(modal1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal0.$$.fragment, local);
    			transition_out(modal1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(modal0);
    			destroy_component(modal1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ HelpModal: HelpModalManager, StatPopup: StatModalManager, Modal });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const defaults = {
      duration: 4000,
      initial: 1,
      next: 0,
      pausable: false,
      dismissable: true,
      reversed: false,
      intro: { x: 256 }
    };

    const createToast = () => {
      const { subscribe, update } = writable([]);
      let count = 0;
      const options = {};
      const _obj = (obj) => obj instanceof Object;
      const push = (msg, opts = {}) => {
        const param = { target: 'default', ...(_obj(msg) ? msg : { ...opts, msg }) };
        const conf = options[param.target] || {};
        const entry = {
          ...defaults,
          ...conf,
          ...param,
          theme: { ...conf.theme, ...param.theme },
          classes: [...(conf.classes || []), ...(param.classes || [])],
          id: ++count
        };
        update((n) => (entry.reversed ? [...n, entry] : [entry, ...n]));
        return count
      };
      const pop = (id) => {
        update((n) => {
          if (!n.length || id === 0) return []
          if (_obj(id)) return n.filter((i) => id(i))
          const target = id || Math.max(...n.map((i) => i.id));
          return n.filter((i) => i.id !== target)
        });
      };
      const set = (id, opts = {}) => {
        const param = _obj(id) ? { ...id } : { ...opts, id };
        update((n) => {
          const idx = n.findIndex((i) => i.id === param.id);
          if (idx > -1) {
            n[idx] = { ...n[idx], ...param };
          }
          return n
        });
      };
      const _init = (target = 'default', opts = {}) => {
        options[target] = opts;
        return options
      };
      return { subscribe, push, pop, set, _init }
    };

    const toast = createToast();

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop$1(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* node_modules\@zerodevx\svelte-toast\src\ToastItem.svelte generated by Svelte v3.49.0 */
    const file$4 = "node_modules\\@zerodevx\\svelte-toast\\src\\ToastItem.svelte";

    // (67:4) {:else}
    function create_else_block$2(ctx) {
    	let html_tag;
    	let raw_value = /*item*/ ctx[0].msg + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 1 && raw_value !== (raw_value = /*item*/ ctx[0].msg + "")) html_tag.p(raw_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(67:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (65:4) {#if item.component}
    function create_if_block_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*getProps*/ ctx[6]()];
    	var switch_value = /*item*/ ctx[0].component.src;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*getProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*getProps*/ ctx[6]())])
    			: {};

    			if (switch_value !== (switch_value = /*item*/ ctx[0].component.src)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(65:4) {#if item.component}",
    		ctx
    	});

    	return block;
    }

    // (71:2) {#if item.dismissable}
    function create_if_block$2(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "✕";
    			attr_dev(div, "class", "_toastBtn pe svelte-5er0t9");
    			attr_dev(div, "role", "button");
    			attr_dev(div, "tabindex", "-1");
    			add_location(div, file$4, 71, 4, 1703);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*close*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(71:2) {#if item.dismissable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let t1;
    	let progress_1;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$1, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[0].component) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*item*/ ctx[0].dismissable && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			progress_1 = element("progress");
    			attr_dev(div0, "role", "status");
    			attr_dev(div0, "class", "_toastMsg svelte-5er0t9");
    			toggle_class(div0, "pe", /*item*/ ctx[0].component);
    			add_location(div0, file$4, 63, 2, 1462);
    			attr_dev(progress_1, "class", "_toastBar svelte-5er0t9");
    			progress_1.value = /*$progress*/ ctx[1];
    			add_location(progress_1, file$4, 73, 2, 1792);
    			attr_dev(div1, "class", "_toastItem svelte-5er0t9");
    			toggle_class(div1, "pe", /*item*/ ctx[0].pausable);
    			add_location(div1, file$4, 62, 0, 1365);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div1, t0);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, progress_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mouseenter", /*pause*/ ctx[4], false, false, false),
    					listen_dev(div1, "mouseleave", /*resume*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			if (dirty & /*item*/ 1) {
    				toggle_class(div0, "pe", /*item*/ ctx[0].component);
    			}

    			if (/*item*/ ctx[0].dismissable) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*$progress*/ 2) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[1]);
    			}

    			if (dirty & /*item*/ 1) {
    				toggle_class(div1, "pe", /*item*/ ctx[0].pausable);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastItem', slots, []);
    	let { item } = $$props;
    	const progress = tweened(item.initial, { duration: item.duration, easing: identity });
    	validate_store(progress, 'progress');
    	component_subscribe($$self, progress, value => $$invalidate(1, $progress = value));
    	const close = () => toast.pop(item.id);

    	const autoclose = () => {
    		if ($progress === 1 || $progress === 0) {
    			close();
    		}
    	};

    	let next = item.initial;
    	let prev = next;
    	let paused = false;

    	const pause = () => {
    		if (item.pausable && !paused && $progress !== next) {
    			progress.set($progress, { duration: 0 });
    			paused = true;
    		}
    	};

    	const resume = () => {
    		if (paused) {
    			const d = item.duration;
    			const duration = d - d * (($progress - prev) / (next - prev));
    			progress.set(next, { duration }).then(autoclose);
    			paused = false;
    		}
    	};

    	const getProps = () => {
    		const { props = {}, sendIdTo } = item.component;

    		if (sendIdTo) {
    			props[sendIdTo] = item.id;
    		}

    		return props;
    	};

    	onDestroy(() => {
    		if (typeof item.onpop === 'function') {
    			item.onpop(item.id);
    		}
    	});

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		tweened,
    		linear: identity,
    		toast,
    		item,
    		progress,
    		close,
    		autoclose,
    		next,
    		prev,
    		paused,
    		pause,
    		resume,
    		getProps,
    		$progress
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('next' in $$props) $$invalidate(7, next = $$props.next);
    		if ('prev' in $$props) prev = $$props.prev;
    		if ('paused' in $$props) paused = $$props.paused;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*item*/ 1) {
    			// `progress` has been renamed to `next`; shim included for backward compatibility, to remove in next major
    			if (typeof item.progress !== 'undefined') {
    				$$invalidate(0, item.next = item.progress, item);
    			}
    		}

    		if ($$self.$$.dirty & /*next, item, $progress*/ 131) {
    			if (next !== item.next) {
    				$$invalidate(7, next = item.next);
    				prev = $progress;
    				paused = false;
    				progress.set(next).then(autoclose);
    			}
    		}
    	};

    	return [item, $progress, progress, close, pause, resume, getProps, next];
    }

    class ToastItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastItem",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<ToastItem> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<ToastItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ToastItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@zerodevx\svelte-toast\src\SvelteToast.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$1 } = globals;
    const file$3 = "node_modules\\@zerodevx\\svelte-toast\\src\\SvelteToast.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (19:2) {#each items as item (item.id)}
    function create_each_block(key_1, ctx) {
    	let li;
    	let toastitem;
    	let t;
    	let li_class_value;
    	let li_style_value;
    	let li_intro;
    	let li_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	toastitem = new ToastItem({
    			props: { item: /*item*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			create_component(toastitem.$$.fragment);
    			t = space();
    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*item*/ ctx[5].classes.join(' ')) + " svelte-yh90az"));
    			attr_dev(li, "style", li_style_value = /*getCss*/ ctx[1](/*item*/ ctx[5].theme));
    			add_location(li, file$3, 19, 4, 494);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(toastitem, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const toastitem_changes = {};
    			if (dirty & /*items*/ 1) toastitem_changes.item = /*item*/ ctx[5];
    			toastitem.$set(toastitem_changes);

    			if (!current || dirty & /*items*/ 1 && li_class_value !== (li_class_value = "" + (null_to_empty(/*item*/ ctx[5].classes.join(' ')) + " svelte-yh90az"))) {
    				attr_dev(li, "class", li_class_value);
    			}

    			if (!current || dirty & /*items*/ 1 && li_style_value !== (li_style_value = /*getCss*/ ctx[1](/*item*/ ctx[5].theme))) {
    				attr_dev(li, "style", li_style_value);
    			}
    		},
    		r: function measure() {
    			rect = li.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(li);
    			stop_animation();
    			add_transform(li, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(li, rect, flip, { duration: 200 });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastitem.$$.fragment, local);

    			add_render_callback(() => {
    				if (li_outro) li_outro.end(1);
    				li_intro = create_in_transition(li, fly, /*item*/ ctx[5].intro);
    				li_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastitem.$$.fragment, local);
    			if (li_intro) li_intro.invalidate();
    			li_outro = create_out_transition(li, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(toastitem);
    			if (detaching && li_outro) li_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(19:2) {#each items as item (item.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[5].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "_toastContainer svelte-yh90az");
    			add_location(ul, file$3, 17, 0, 427);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items, getCss*/ 3) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, fix_and_outro_and_destroy_block, create_each_block, null, get_each_context);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $toast;
    	validate_store(toast, 'toast');
    	component_subscribe($$self, toast, $$value => $$invalidate(4, $toast = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteToast', slots, []);
    	let { options = {} } = $$props;
    	let { target = 'default' } = $$props;
    	let items;
    	const getCss = theme => Object.keys(theme).reduce((a, c) => `${a}${c}:${theme[c]};`, '');
    	const writable_props = ['options', 'target'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvelteToast> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('target' in $$props) $$invalidate(3, target = $$props.target);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		flip,
    		toast,
    		ToastItem,
    		options,
    		target,
    		items,
    		getCss,
    		$toast
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('target' in $$props) $$invalidate(3, target = $$props.target);
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*target, options*/ 12) {
    			toast._init(target, options);
    		}

    		if ($$self.$$.dirty & /*$toast, target*/ 24) {
    			$$invalidate(0, items = $toast.filter(i => i.target === target));
    		}
    	};

    	return [items, getCss, options, target, $toast];
    }

    class SvelteToast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { options: 2, target: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteToast",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get options() {
    		throw new Error("<SvelteToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<SvelteToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get target() {
    		throw new Error("<SvelteToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error("<SvelteToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\RefreshNotif.svelte generated by Svelte v3.49.0 */
    const file$2 = "src\\RefreshNotif.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "New Obbattu Has been served";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Refresh";
    			add_location(h3, file$2, 12, 4, 198);
    			attr_dev(button, "class", "buttn svelte-1qcmkrb");
    			add_location(button, file$2, 13, 4, 240);
    			attr_dev(div, "class", "main svelte-1qcmkrb");
    			add_location(div, file$2, 11, 0, 174);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*refreshPage*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RefreshNotif', slots, []);
    	let { toastId } = $$props;

    	function refreshPage() {
    		toast.pop(toastId);
    	}

    	const writable_props = ['toastId'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RefreshNotif> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('toastId' in $$props) $$invalidate(1, toastId = $$props.toastId);
    	};

    	$$self.$capture_state = () => ({ toast, toastId, refreshPage });

    	$$self.$inject_state = $$props => {
    		if ('toastId' in $$props) $$invalidate(1, toastId = $$props.toastId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [refreshPage, toastId];
    }

    class RefreshNotif extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { toastId: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RefreshNotif",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*toastId*/ ctx[1] === undefined && !('toastId' in props)) {
    			console.warn("<RefreshNotif> was created without expected prop 'toastId'");
    		}
    	}

    	get toastId() {
    		throw new Error("<RefreshNotif>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toastId(value) {
    		throw new Error("<RefreshNotif>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Countdown.svelte generated by Svelte v3.49.0 */
    const file$1 = "src\\Countdown.svelte";

    // (47:4) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*finishMsg*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*finishMsg*/ 1) set_data_dev(t, /*finishMsg*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(47:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (45:4) {#if finished === false}
    function create_if_block$1(ctx) {
    	let t0_value = (/*hr*/ ctx[4].length === 1 ? "0" : "") + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = (/*min*/ ctx[3].length === 1 ? "0" : "") + "";
    	let t3;
    	let t4;
    	let t5;
    	let t6_value = (/*sec*/ ctx[2].length === 1 ? "0" : "") + "";
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(/*hr*/ ctx[4]);
    			t2 = text(":");
    			t3 = text(t3_value);
    			t4 = text(/*min*/ ctx[3]);
    			t5 = text(":");
    			t6 = text(t6_value);
    			t7 = text(/*sec*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, t7, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hr*/ 16 && t0_value !== (t0_value = (/*hr*/ ctx[4].length === 1 ? "0" : "") + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*hr*/ 16) set_data_dev(t1, /*hr*/ ctx[4]);
    			if (dirty & /*min*/ 8 && t3_value !== (t3_value = (/*min*/ ctx[3].length === 1 ? "0" : "") + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*min*/ 8) set_data_dev(t4, /*min*/ ctx[3]);
    			if (dirty & /*sec*/ 4 && t6_value !== (t6_value = (/*sec*/ ctx[2].length === 1 ? "0" : "") + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*sec*/ 4) set_data_dev(t7, /*sec*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(t7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(45:4) {#if finished === false}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*finished*/ ctx[1] === false) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "timer");
    			add_location(div, file$1, 43, 0, 1198);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let hr;
    	let min;
    	let sec;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Countdown', slots, []);
    	const dispatch = createEventDispatcher();
    	let { endDate } = $$props;
    	let { finishMsg } = $$props;

    	//console.log(endDate(false))
    	endDate = endDate();

    	let finished = false;

    	let x = setInterval(
    		() => {
    			$$invalidate(5, endDate -= 1000);
    			let hrss = Math.floor(endDate / (1000 * 60 * 60) % 24);
    			let minss = Math.floor(Math.abs(endDate / (1000 * 60) % 60));
    			let secss = Math.floor(Math.abs(endDate / 1000 % 60));

    			if (endDate <= 0) {
    				clearInterval(x);
    				$$invalidate(1, finished = true);
    				dispatch("REFRESH_BOARD");
    				return;
    			} else {
    				$$invalidate(4, hr = Math.abs(hrss).toString());
    				$$invalidate(3, min = minss.toString());
    				$$invalidate(2, sec = secss.toString());
    			}
    		},
    		1000
    	);

    	const writable_props = ['endDate', 'finishMsg'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Countdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('endDate' in $$props) $$invalidate(5, endDate = $$props.endDate);
    		if ('finishMsg' in $$props) $$invalidate(0, finishMsg = $$props.finishMsg);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		endDate,
    		finishMsg,
    		finished,
    		x,
    		sec,
    		min,
    		hr
    	});

    	$$self.$inject_state = $$props => {
    		if ('endDate' in $$props) $$invalidate(5, endDate = $$props.endDate);
    		if ('finishMsg' in $$props) $$invalidate(0, finishMsg = $$props.finishMsg);
    		if ('finished' in $$props) $$invalidate(1, finished = $$props.finished);
    		if ('x' in $$props) x = $$props.x;
    		if ('sec' in $$props) $$invalidate(2, sec = $$props.sec);
    		if ('min' in $$props) $$invalidate(3, min = $$props.min);
    		if ('hr' in $$props) $$invalidate(4, hr = $$props.hr);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*endDate*/ 32) {
    			//console.log(endDate)
    			$$invalidate(4, hr = Math.floor(endDate / (1000 * 60 * 60) % 24).toString());
    		}

    		if ($$self.$$.dirty & /*endDate*/ 32) {
    			$$invalidate(3, min = Math.floor(Math.abs(endDate / (1000 * 60) % 60)).toString());
    		}

    		if ($$self.$$.dirty & /*endDate*/ 32) {
    			$$invalidate(2, sec = Math.floor(Math.abs(endDate / 1000 % 60)).toString());
    		}
    	};

    	return [finishMsg, finished, sec, min, hr, endDate];
    }

    class Countdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { endDate: 5, finishMsg: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Countdown",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*endDate*/ ctx[5] === undefined && !('endDate' in props)) {
    			console.warn("<Countdown> was created without expected prop 'endDate'");
    		}

    		if (/*finishMsg*/ ctx[0] === undefined && !('finishMsg' in props)) {
    			console.warn("<Countdown> was created without expected prop 'finishMsg'");
    		}
    	}

    	get endDate() {
    		throw new Error("<Countdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set endDate(value) {
    		throw new Error("<Countdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get finishMsg() {
    		throw new Error("<Countdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set finishMsg(value) {
    		throw new Error("<Countdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // canvas-confetti v1.5.1 built on 2022-02-08T22:20:40.944Z
    var module = {};

    // source content
    (function main(global, module, isWorker, workerSize) {
      var canUseWorker = !!(
        global.Worker &&
        global.Blob &&
        global.Promise &&
        global.OffscreenCanvas &&
        global.OffscreenCanvasRenderingContext2D &&
        global.HTMLCanvasElement &&
        global.HTMLCanvasElement.prototype.transferControlToOffscreen &&
        global.URL &&
        global.URL.createObjectURL);

      function noop() {}

      // create a promise if it exists, otherwise, just
      // call the function directly
      function promise(func) {
        var ModulePromise = module.exports.Promise;
        var Prom = ModulePromise !== void 0 ? ModulePromise : global.Promise;

        if (typeof Prom === 'function') {
          return new Prom(func);
        }

        func(noop, noop);

        return null;
      }

      var raf = (function () {
        var TIME = Math.floor(1000 / 60);
        var frame, cancel;
        var frames = {};
        var lastFrameTime = 0;

        if (typeof requestAnimationFrame === 'function' && typeof cancelAnimationFrame === 'function') {
          frame = function (cb) {
            var id = Math.random();

            frames[id] = requestAnimationFrame(function onFrame(time) {
              if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
                lastFrameTime = time;
                delete frames[id];

                cb();
              } else {
                frames[id] = requestAnimationFrame(onFrame);
              }
            });

            return id;
          };
          cancel = function (id) {
            if (frames[id]) {
              cancelAnimationFrame(frames[id]);
            }
          };
        } else {
          frame = function (cb) {
            return setTimeout(cb, TIME);
          };
          cancel = function (timer) {
            return clearTimeout(timer);
          };
        }

        return { frame: frame, cancel: cancel };
      }());

      var getWorker = (function () {
        var worker;
        var prom;
        var resolves = {};

        function decorate(worker) {
          function execute(options, callback) {
            worker.postMessage({ options: options || {}, callback: callback });
          }
          worker.init = function initWorker(canvas) {
            var offscreen = canvas.transferControlToOffscreen();
            worker.postMessage({ canvas: offscreen }, [offscreen]);
          };

          worker.fire = function fireWorker(options, size, done) {
            if (prom) {
              execute(options, null);
              return prom;
            }

            var id = Math.random().toString(36).slice(2);

            prom = promise(function (resolve) {
              function workerDone(msg) {
                if (msg.data.callback !== id) {
                  return;
                }

                delete resolves[id];
                worker.removeEventListener('message', workerDone);

                prom = null;
                done();
                resolve();
              }

              worker.addEventListener('message', workerDone);
              execute(options, id);

              resolves[id] = workerDone.bind(null, { data: { callback: id }});
            });

            return prom;
          };

          worker.reset = function resetWorker() {
            worker.postMessage({ reset: true });

            for (var id in resolves) {
              resolves[id]();
              delete resolves[id];
            }
          };
        }

        return function () {
          if (worker) {
            return worker;
          }

          if (!isWorker && canUseWorker) {
            var code = [
              'var CONFETTI, SIZE = {}, module = {};',
              '(' + main.toString() + ')(this, module, true, SIZE);',
              'onmessage = function(msg) {',
              '  if (msg.data.options) {',
              '    CONFETTI(msg.data.options).then(function () {',
              '      if (msg.data.callback) {',
              '        postMessage({ callback: msg.data.callback });',
              '      }',
              '    });',
              '  } else if (msg.data.reset) {',
              '    CONFETTI.reset();',
              '  } else if (msg.data.resize) {',
              '    SIZE.width = msg.data.resize.width;',
              '    SIZE.height = msg.data.resize.height;',
              '  } else if (msg.data.canvas) {',
              '    SIZE.width = msg.data.canvas.width;',
              '    SIZE.height = msg.data.canvas.height;',
              '    CONFETTI = module.exports.create(msg.data.canvas);',
              '  }',
              '}',
            ].join('\n');
            try {
              worker = new Worker(URL.createObjectURL(new Blob([code])));
            } catch (e) {
              // eslint-disable-next-line no-console
              typeof console !== undefined && typeof console.warn === 'function' ? console.warn('🎊 Could not load worker', e) : null;

              return null;
            }

            decorate(worker);
          }

          return worker;
        };
      })();

      var defaults = {
        particleCount: 50,
        angle: 90,
        spread: 45,
        startVelocity: 45,
        decay: 0.9,
        gravity: 1,
        drift: 0,
        ticks: 200,
        x: 0.5,
        y: 0.5,
        shapes: ['square', 'circle'],
        zIndex: 100,
        colors: [
          '#26ccff',
          '#a25afd',
          '#ff5e7e',
          '#88ff5a',
          '#fcff42',
          '#ffa62d',
          '#ff36ff'
        ],
        // probably should be true, but back-compat
        disableForReducedMotion: false,
        scalar: 1
      };

      function convert(val, transform) {
        return transform ? transform(val) : val;
      }

      function isOk(val) {
        return !(val === null || val === undefined);
      }

      function prop(options, name, transform) {
        return convert(
          options && isOk(options[name]) ? options[name] : defaults[name],
          transform
        );
      }

      function onlyPositiveInt(number){
        return number < 0 ? 0 : Math.floor(number);
      }

      function randomInt(min, max) {
        // [min, max)
        return Math.floor(Math.random() * (max - min)) + min;
      }

      function toDecimal(str) {
        return parseInt(str, 16);
      }

      function colorsToRgb(colors) {
        return colors.map(hexToRgb);
      }

      function hexToRgb(str) {
        var val = String(str).replace(/[^0-9a-f]/gi, '');

        if (val.length < 6) {
            val = val[0]+val[0]+val[1]+val[1]+val[2]+val[2];
        }

        return {
          r: toDecimal(val.substring(0,2)),
          g: toDecimal(val.substring(2,4)),
          b: toDecimal(val.substring(4,6))
        };
      }

      function getOrigin(options) {
        var origin = prop(options, 'origin', Object);
        origin.x = prop(origin, 'x', Number);
        origin.y = prop(origin, 'y', Number);

        return origin;
      }

      function setCanvasWindowSize(canvas) {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
      }

      function setCanvasRectSize(canvas) {
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      function getCanvas(zIndex) {
        var canvas = document.createElement('canvas');

        canvas.style.position = 'fixed';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = zIndex;

        return canvas;
      }

      function ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
        context.save();
        context.translate(x, y);
        context.rotate(rotation);
        context.scale(radiusX, radiusY);
        context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
        context.restore();
      }

      function randomPhysics(opts) {
        var radAngle = opts.angle * (Math.PI / 180);
        var radSpread = opts.spread * (Math.PI / 180);

        return {
          x: opts.x,
          y: opts.y,
          wobble: Math.random() * 10,
          wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
          velocity: (opts.startVelocity * 0.5) + (Math.random() * opts.startVelocity),
          angle2D: -radAngle + ((0.5 * radSpread) - (Math.random() * radSpread)),
          tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
          color: opts.color,
          shape: opts.shape,
          tick: 0,
          totalTicks: opts.ticks,
          decay: opts.decay,
          drift: opts.drift,
          random: Math.random() + 2,
          tiltSin: 0,
          tiltCos: 0,
          wobbleX: 0,
          wobbleY: 0,
          gravity: opts.gravity * 3,
          ovalScalar: 0.6,
          scalar: opts.scalar
        };
      }

      function updateFetti(context, fetti) {
        fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
        fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
        fetti.wobble += fetti.wobbleSpeed;
        fetti.velocity *= fetti.decay;
        fetti.tiltAngle += 0.1;
        fetti.tiltSin = Math.sin(fetti.tiltAngle);
        fetti.tiltCos = Math.cos(fetti.tiltAngle);
        fetti.random = Math.random() + 2;
        fetti.wobbleX = fetti.x + ((10 * fetti.scalar) * Math.cos(fetti.wobble));
        fetti.wobbleY = fetti.y + ((10 * fetti.scalar) * Math.sin(fetti.wobble));

        var progress = (fetti.tick++) / fetti.totalTicks;

        var x1 = fetti.x + (fetti.random * fetti.tiltCos);
        var y1 = fetti.y + (fetti.random * fetti.tiltSin);
        var x2 = fetti.wobbleX + (fetti.random * fetti.tiltCos);
        var y2 = fetti.wobbleY + (fetti.random * fetti.tiltSin);

        context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 - progress) + ')';
        context.beginPath();

        if (fetti.shape === 'circle') {
          context.ellipse ?
            context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) :
            ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
        } else {
          context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
          context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
          context.lineTo(Math.floor(x2), Math.floor(y2));
          context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
        }

        context.closePath();
        context.fill();

        return fetti.tick < fetti.totalTicks;
      }

      function animate(canvas, fettis, resizer, size, done) {
        var animatingFettis = fettis.slice();
        var context = canvas.getContext('2d');
        var animationFrame;
        var destroy;

        var prom = promise(function (resolve) {
          function onDone() {
            animationFrame = destroy = null;

            context.clearRect(0, 0, size.width, size.height);

            done();
            resolve();
          }

          function update() {
            if (isWorker && !(size.width === workerSize.width && size.height === workerSize.height)) {
              size.width = canvas.width = workerSize.width;
              size.height = canvas.height = workerSize.height;
            }

            if (!size.width && !size.height) {
              resizer(canvas);
              size.width = canvas.width;
              size.height = canvas.height;
            }

            context.clearRect(0, 0, size.width, size.height);

            animatingFettis = animatingFettis.filter(function (fetti) {
              return updateFetti(context, fetti);
            });

            if (animatingFettis.length) {
              animationFrame = raf.frame(update);
            } else {
              onDone();
            }
          }

          animationFrame = raf.frame(update);
          destroy = onDone;
        });

        return {
          addFettis: function (fettis) {
            animatingFettis = animatingFettis.concat(fettis);

            return prom;
          },
          canvas: canvas,
          promise: prom,
          reset: function () {
            if (animationFrame) {
              raf.cancel(animationFrame);
            }

            if (destroy) {
              destroy();
            }
          }
        };
      }

      function confettiCannon(canvas, globalOpts) {
        var isLibCanvas = !canvas;
        var allowResize = !!prop(globalOpts || {}, 'resize');
        var globalDisableForReducedMotion = prop(globalOpts, 'disableForReducedMotion', Boolean);
        var shouldUseWorker = canUseWorker && !!prop(globalOpts || {}, 'useWorker');
        var worker = shouldUseWorker ? getWorker() : null;
        var resizer = isLibCanvas ? setCanvasWindowSize : setCanvasRectSize;
        var initialized = (canvas && worker) ? !!canvas.__confetti_initialized : false;
        var preferLessMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion)').matches;
        var animationObj;

        function fireLocal(options, size, done) {
          var particleCount = prop(options, 'particleCount', onlyPositiveInt);
          var angle = prop(options, 'angle', Number);
          var spread = prop(options, 'spread', Number);
          var startVelocity = prop(options, 'startVelocity', Number);
          var decay = prop(options, 'decay', Number);
          var gravity = prop(options, 'gravity', Number);
          var drift = prop(options, 'drift', Number);
          var colors = prop(options, 'colors', colorsToRgb);
          var ticks = prop(options, 'ticks', Number);
          var shapes = prop(options, 'shapes');
          var scalar = prop(options, 'scalar');
          var origin = getOrigin(options);

          var temp = particleCount;
          var fettis = [];

          var startX = canvas.width * origin.x;
          var startY = canvas.height * origin.y;

          while (temp--) {
            fettis.push(
              randomPhysics({
                x: startX,
                y: startY,
                angle: angle,
                spread: spread,
                startVelocity: startVelocity,
                color: colors[temp % colors.length],
                shape: shapes[randomInt(0, shapes.length)],
                ticks: ticks,
                decay: decay,
                gravity: gravity,
                drift: drift,
                scalar: scalar
              })
            );
          }

          // if we have a previous canvas already animating,
          // add to it
          if (animationObj) {
            return animationObj.addFettis(fettis);
          }

          animationObj = animate(canvas, fettis, resizer, size , done);

          return animationObj.promise;
        }

        function fire(options) {
          var disableForReducedMotion = globalDisableForReducedMotion || prop(options, 'disableForReducedMotion', Boolean);
          var zIndex = prop(options, 'zIndex', Number);

          if (disableForReducedMotion && preferLessMotion) {
            return promise(function (resolve) {
              resolve();
            });
          }

          if (isLibCanvas && animationObj) {
            // use existing canvas from in-progress animation
            canvas = animationObj.canvas;
          } else if (isLibCanvas && !canvas) {
            // create and initialize a new canvas
            canvas = getCanvas(zIndex);
            document.body.appendChild(canvas);
          }

          if (allowResize && !initialized) {
            // initialize the size of a user-supplied canvas
            resizer(canvas);
          }

          var size = {
            width: canvas.width,
            height: canvas.height
          };

          if (worker && !initialized) {
            worker.init(canvas);
          }

          initialized = true;

          if (worker) {
            canvas.__confetti_initialized = true;
          }

          function onResize() {
            if (worker) {
              // TODO this really shouldn't be immediate, because it is expensive
              var obj = {
                getBoundingClientRect: function () {
                  if (!isLibCanvas) {
                    return canvas.getBoundingClientRect();
                  }
                }
              };

              resizer(obj);

              worker.postMessage({
                resize: {
                  width: obj.width,
                  height: obj.height
                }
              });
              return;
            }

            // don't actually query the size here, since this
            // can execute frequently and rapidly
            size.width = size.height = null;
          }

          function done() {
            animationObj = null;

            if (allowResize) {
              global.removeEventListener('resize', onResize);
            }

            if (isLibCanvas && canvas) {
              document.body.removeChild(canvas);
              canvas = null;
              initialized = false;
            }
          }

          if (allowResize) {
            global.addEventListener('resize', onResize, false);
          }

          if (worker) {
            return worker.fire(options, size, done);
          }

          return fireLocal(options, size, done);
        }

        fire.reset = function () {
          if (worker) {
            worker.reset();
          }

          if (animationObj) {
            animationObj.reset();
          }
        };

        return fire;
      }

      // Make default export lazy to defer worker creation until called.
      var defaultFire;
      function getDefaultFire() {
        if (!defaultFire) {
          defaultFire = confettiCannon(null, { useWorker: true, resize: true });
        }
        return defaultFire;
      }

      module.exports = function() {
        return getDefaultFire().apply(this, arguments);
      };
      module.exports.reset = function() {
        getDefaultFire().reset();
      };
      module.exports.create = confettiCannon;
    }((function () {
      if (typeof window !== 'undefined') {
        return window;
      }

      if (typeof self !== 'undefined') {
        return self;
      }

      return this || {};
    })(), module, false));

    // end source content

    var confetti = module.exports;
    module.exports.create;

    /* src\App.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (322:4) {:else}
    function create_else_block(ctx) {
    	let div6;
    	let h1;
    	let t1;
    	let h3;
    	let t3;
    	let div5;
    	let div4;
    	let div0;
    	let div1;
    	let div2;
    	let div3;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Generating a new game...";
    			t1 = space();
    			h3 = element("h3");
    			h3.textContent = "Please wait...";
    			t3 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			div1 = element("div");
    			div2 = element("div");
    			div3 = element("div");
    			attr_dev(h1, "class", "svelte-19i2ufz");
    			add_location(h1, file, 323, 12, 9689);
    			add_location(h3, file, 324, 12, 9736);
    			attr_dev(div0, "class", "svelte-19i2ufz");
    			add_location(div0, file, 326, 16, 9832);
    			attr_dev(div1, "class", "svelte-19i2ufz");
    			add_location(div1, file, 326, 27, 9843);
    			attr_dev(div2, "class", "svelte-19i2ufz");
    			add_location(div2, file, 326, 38, 9854);
    			attr_dev(div3, "class", "svelte-19i2ufz");
    			add_location(div3, file, 326, 49, 9865);
    			attr_dev(div4, "class", "ldio svelte-19i2ufz");
    			add_location(div4, file, 325, 35, 9796);
    			attr_dev(div5, "class", "loadingio svelte-19i2ufz");
    			add_location(div5, file, 325, 12, 9773);
    			attr_dev(div6, "class", "notice flexx svelte-19i2ufz");
    			add_location(div6, file, 322, 8, 9649);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, h1);
    			append_dev(div6, t1);
    			append_dev(div6, h3);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div4, div1);
    			append_dev(div4, div2);
    			append_dev(div4, div3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(322:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (305:4) {#if show_loading === false}
    function create_if_block(ctx) {
    	let gameboard;
    	let t;
    	let if_block_anchor;
    	let current;

    	gameboard = new GameBoard({
    			props: {
    				questions: /*questions*/ ctx[0],
    				answers: /*answers*/ ctx[2],
    				ans_to_show: /*ansToShow*/ ctx[1],
    				TOTAL_MOVES: /*moves*/ ctx[3],
    				OBBATTU_COUNT: /*OBBATTU_COUNT*/ ctx[4]
    			},
    			$$inline: true
    		});

    	gameboard.$on("GAME_WON", /*handleGameWin*/ ctx[8]);
    	gameboard.$on("GAME_LOST", /*handleGameLost*/ ctx[9]);
    	let if_block = /*reminderStatus*/ ctx[5] === "timer" && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			create_component(gameboard.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(gameboard, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const gameboard_changes = {};
    			if (dirty & /*questions*/ 1) gameboard_changes.questions = /*questions*/ ctx[0];
    			if (dirty & /*answers*/ 4) gameboard_changes.answers = /*answers*/ ctx[2];
    			if (dirty & /*ansToShow*/ 2) gameboard_changes.ans_to_show = /*ansToShow*/ ctx[1];
    			if (dirty & /*moves*/ 8) gameboard_changes.TOTAL_MOVES = /*moves*/ ctx[3];
    			if (dirty & /*OBBATTU_COUNT*/ 16) gameboard_changes.OBBATTU_COUNT = /*OBBATTU_COUNT*/ ctx[4];
    			gameboard.$set(gameboard_changes);

    			if (/*reminderStatus*/ ctx[5] === "timer") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*reminderStatus*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gameboard.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gameboard.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(gameboard, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(305:4) {#if show_loading === false}",
    		ctx
    	});

    	return block;
    }

    // (315:8) {#if reminderStatus === "timer"}
    function create_if_block_1(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let countdown;
    	let t2;
    	let hr;
    	let current;

    	countdown = new Countdown({
    			props: {
    				endDate: /*getDurationTillMidnight*/ ctx[7],
    				finishMsg: "Serving new Obbattu..."
    			},
    			$$inline: true
    		});

    	countdown.$on("REFRESH_BOARD", /*refreshBoard*/ ctx[10]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "ಮುಂದಿನ ಒಬ್ಬಟ್ಟು";
    			t1 = space();
    			create_component(countdown.$$.fragment);
    			t2 = space();
    			hr = element("hr");
    			add_location(h2, file, 316, 20, 9399);
    			attr_dev(div, "class", "timer notice flexx svelte-19i2ufz");
    			add_location(div, file, 315, 12, 9345);
    			attr_dev(hr, "class", "spacer svelte-19i2ufz");
    			add_location(hr, file, 319, 12, 9592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			mount_component(countdown, div, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, hr, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(countdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(countdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(countdown);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(315:8) {#if reminderStatus === \\\"timer\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let sveltetoast;
    	let current;
    	header = new Header({ $$inline: true });
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*show_loading*/ ctx[6] === false) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	sveltetoast = new SvelteToast({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			create_component(sveltetoast.$$.fragment);
    			attr_dev(main, "class", "svelte-19i2ufz");
    			add_location(main, file, 302, 0, 8932);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			if_blocks[current_block_type_index].m(main, null);
    			insert_dev(target, t1, anchor);
    			mount_component(sveltetoast, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(sveltetoast.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(sveltetoast.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t1);
    			destroy_component(sveltetoast, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const duration = 5000; //Fire work duration

    function randomInRange(min, max) {
    	return Math.random() * (max - min) + min;
    }

    async function incrementWonStat() {
    	let obj = window.localStorage.getItem("GAME_STATS");
    	let json;

    	if (obj === null) {
    		json = { GAMES_PLAYED: 0, GAMES_WON: 0 };
    	} else {
    		json = JSON.parse(obj);
    	}

    	json.GAMES_WON += 1;
    	json.GAMES_PLAYED += 1;
    	window.localStorage.setItem("GAME_STATS", JSON.stringify(json));
    	await fetch("/played/true");
    }

    async function incrementPlayedStat() {
    	let obj = window.localStorage.getItem("GAME_STATS");
    	let json;

    	if (obj === null) {
    		json = { GAMES_PLAYED: 0, GAMES_WON: 0 };
    	} else {
    		json = JSON.parse(obj);
    	}

    	json.GAMES_PLAYED += 1;
    	window.localStorage.setItem("GAME_STATS", JSON.stringify(json));
    	await fetch("/played/false");
    }

    function instance($$self, $$props, $$invalidate) {
    	let show_loading;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const defaults = {
    		startVelocity: 30,
    		spread: 360,
    		ticks: 60,
    		zIndex: 0
    	};

    	/* let questions_from_server = [["a", "d", "f", "t", "e"], ["o", "", "j", "", "h"], ["c", "r", "m", "p", "k"], ["w", "", "l", "", "b"], ["u", "x", "n", "v", "y"]]
    let ansToShow_from_server = [["a", "b", "c", "d", "e"], ["f", "", "h", "", "j"], ["k", "l", "m", "n", "o"], ["p", "", "r", "", "t"], ["u", "v", "w", "x", "y"]]
    let answers_from_server = [["a", "b", "c", "d", "e"], ["e", "j", "o", "t", "y"], ["a", "f", "k", "p", "u"], ["u", "v", "w", "x", "y"], ["c", "h", "m", "r", "w"], ["k", "l", "m", "n", "o"]]
    let OBBATTU_COUNT_from_server = 0 */
    	let questions;

    	let ansToShow;
    	let answers;
    	let TOTAL_MOVES = 20;
    	let moves = TOTAL_MOVES;
    	let OBBATTU_COUNT = 0;

    	// SET RESFRESH TIME HERE!
    	const refreshTime = { hour: 23, min: 59, sec: 59 };

    	/* function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    } */
    	async function QUERY_SERVER() {
    		let return_val;
    		let date = new Date().getDate();

    		await fetch("/get-board/" + date).then(response => response.json()).then(data => {
    			$$invalidate(2, answers = data.answers);
    			$$invalidate(1, ansToShow = data.answers_to_show);
    			$$invalidate(0, questions = data.questions);
    			$$invalidate(4, OBBATTU_COUNT = data.OBBATTU_COUNT);

    			//console.log(data)
    			return_val = data;
    		}).catch(err => {
    			console.log("an err occured while setting data", err);
    			return_val = false;
    		});

    		return return_val;
    	} /* questions = questions_from_server
    ansToShow = ansToShow_from_server
    answers = answers_from_server
    OBBATTU_COUNT = OBBATTU_COUNT_from_server */

    	let reminderStatus = null; // to show if timer or alert should be displayed

    	function getDurationTillMidnight(duration = true) {
    		let end_time = new Date();
    		end_time.setHours(refreshTime.hour, refreshTime.min, refreshTime.sec);
    		let now = new Date();
    		let dur = end_time - now;

    		//return dur
    		if (dur < 0) {
    			end_time.setDate(end_time.getDate() + 1);
    			dur = Math.abs(end_time - now); // + 86400000
    		}

    		//console.log(dur)
    		if (duration === true) {
    			return dur;
    		} else {
    			return end_time;
    		}
    	}

    	function refreshAlertCheck() {
    		if (reminderStatus === null) {
    			displayRefreshToast();
    		}
    	}

    	let refreshTimeout = setTimeout(refreshAlertCheck, getDurationTillMidnight());

    	async function handleGameWin(e) {
    		let animationEnd = Date.now() + duration;
    		let increment = e.detail.extra;

    		//console.log("game won, but... extra?", increment)
    		if (reminderStatus === null) {
    			$$invalidate(5, reminderStatus = "timer");
    		}

    		if (increment === true) {
    			console.log("YAY, You won the game. Thanks a lot for playing Obbattu. It means a lot to me :D");
    			navigator.vibrate(200);
    			await incrementWonStat();

    			let interval = setInterval(
    				function () {
    					let timeLeft = animationEnd - Date.now();

    					if (timeLeft <= 0) {
    						return clearInterval(interval);
    					}

    					let particleCount = 50 * (timeLeft / duration);

    					// since particles fall down, start a bit higher than random
    					confetti(Object.assign({}, defaults, {
    						particleCount,
    						origin: {
    							x: randomInRange(0.1, 0.3),
    							y: Math.random() - 0.2
    						}
    					}));

    					confetti(Object.assign({}, defaults, {
    						particleCount,
    						origin: {
    							x: randomInRange(0.7, 0.9),
    							y: Math.random() - 0.2
    						}
    					}));
    				},
    				250
    			);
    		}
    	}

    	async function handleGameLost(e) {
    		let increment = e.detail.extra;

    		if (increment === true) {
    			console.log("Aww :(. You Lost. Thanks a lot for playing Obbattu. It means a lot to me :D");
    			await incrementPlayedStat();
    		}

    		if (reminderStatus === null) {
    			$$invalidate(5, reminderStatus = "timer");
    		}
    	}

    	function refreshBoard(_) {
    		//console.log("refreshing board....")
    		setTimeout(
    			() => {
    				$$invalidate(5, reminderStatus = null);
    			},
    			1000
    		);

    		window.localStorage.removeItem("GAME_META");
    		window.localStorage.removeItem("GAME_BOARD");
    		$$invalidate(0, questions = undefined);
    		load(true);
    		refreshTimeout = setTimeout(refreshAlertCheck, getDurationTillMidnight());
    	}

    	function displayRefreshToast() {
    		toast.push({
    			component: {
    				src: RefreshNotif, // where `src` is a Svelte component
    				sendIdTo: 'toastId', // send toast id to `toastId` prop
    				
    			},
    			dismissable: true,
    			initial: 0,
    			onpop: refreshBoard
    		}); /* theme: {
        '--toastPadding': '0',
        '--toastMsgPadding': '1em'
    } */
    	}

    	async function load(time_wait = false) {
    		let now = new Date();

    		if (time_wait === true) {
    			now = new Date(now.getTime() + 2 * 60000);
    		}

    		let board = getObj$1("GAME_BOARD");
    		let gameMeta = getObj$1("GAME_META");

    		if (board === null || gameMeta === null) {
    			// console.log("query started")
    			let result = await QUERY_SERVER();

    			// console.log("query finished")
    			//QUERYING THE BACKEND SERVER HERE
    			if (result === false) {
    				return;
    			}

    			let timecreated = new Date();
    			timecreated.setHours(0, 0, 0);

    			let GAME_META = {
    				timecreated,
    				ansToShow: result.answers_to_show,
    				answers: result.answers,
    				count: result.OBBATTU_COUNT
    			};

    			saveObj("GAME_META", GAME_META);

    			let GAME_BOARD = {
    				questions: result.questions,
    				MOVES: TOTAL_MOVES
    			};

    			$$invalidate(3, moves = TOTAL_MOVES);
    			saveObj("GAME_BOARD", GAME_BOARD);
    		} else {
    			let timeCreated = new Date(gameMeta.timecreated);

    			if (now - timeCreated > 86400000) {
    				//console.log("new board... Bail loading old board")
    				//questions = questions_from_server
    				window.localStorage.removeItem("GAME_META");

    				window.localStorage.removeItem("GAME_BOARD");
    				return load();
    			}

    			$$invalidate(0, questions = board.questions);
    			$$invalidate(3, moves = board.MOVES);
    			$$invalidate(1, ansToShow = gameMeta.ansToShow);
    			$$invalidate(2, answers = gameMeta.answers);
    			$$invalidate(4, OBBATTU_COUNT = gameMeta.count);
    		} // reminderStatus = "timer"
    	}

    	load();
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		GameBoard,
    		Header,
    		SvelteToast,
    		toast,
    		RefreshNotif,
    		Countdown,
    		confetti,
    		saveObj,
    		getObj: getObj$1,
    		duration,
    		defaults,
    		questions,
    		ansToShow,
    		answers,
    		TOTAL_MOVES,
    		moves,
    		OBBATTU_COUNT,
    		refreshTime,
    		QUERY_SERVER,
    		reminderStatus,
    		getDurationTillMidnight,
    		refreshAlertCheck,
    		refreshTimeout,
    		randomInRange,
    		incrementWonStat,
    		incrementPlayedStat,
    		handleGameWin,
    		handleGameLost,
    		refreshBoard,
    		displayRefreshToast,
    		load,
    		show_loading
    	});

    	$$self.$inject_state = $$props => {
    		if ('questions' in $$props) $$invalidate(0, questions = $$props.questions);
    		if ('ansToShow' in $$props) $$invalidate(1, ansToShow = $$props.ansToShow);
    		if ('answers' in $$props) $$invalidate(2, answers = $$props.answers);
    		if ('TOTAL_MOVES' in $$props) TOTAL_MOVES = $$props.TOTAL_MOVES;
    		if ('moves' in $$props) $$invalidate(3, moves = $$props.moves);
    		if ('OBBATTU_COUNT' in $$props) $$invalidate(4, OBBATTU_COUNT = $$props.OBBATTU_COUNT);
    		if ('reminderStatus' in $$props) $$invalidate(5, reminderStatus = $$props.reminderStatus);
    		if ('refreshTimeout' in $$props) refreshTimeout = $$props.refreshTimeout;
    		if ('show_loading' in $$props) $$invalidate(6, show_loading = $$props.show_loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*questions, ansToShow, answers*/ 7) {
    			$$invalidate(6, show_loading = questions === undefined || ansToShow === undefined || answers === undefined
    			? true
    			: false);
    		}
    	};

    	return [
    		questions,
    		ansToShow,
    		answers,
    		moves,
    		OBBATTU_COUNT,
    		reminderStatus,
    		show_loading,
    		getDurationTillMidnight,
    		handleGameWin,
    		handleGameLost,
    		refreshBoard
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    if ("serviceWorker" in navigator) {
    	navigator.serviceWorker.register("./service-worker.js")
    	.then((data) => console.log("Service worker registered", data))
    	.catch((err) => console.log("err occurred while loading service worker", err));
    }

    return app;

})();
//# sourceMappingURL=bundle.js.map
