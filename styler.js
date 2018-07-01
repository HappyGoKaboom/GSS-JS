$.global.register({
    // info
    name: "Styler",
    description: "Javascript Styling using fragments",
    author: "YourName",
    date: "@TODO",
    update: "@TODO",
    version: "@TODO",
    license: "@TODO",
    
    // config
    path: "styler", // optional assign path
    auto: true, // automatically instances the class to the path / default true
    
    // extensions / plugins
    plugins: [
        "hook"
    ],
    
    // instance
    instance: class Styler
        {
            constructor()
                {
                    // fires on registration before this.$ is available
                }
            
            registered()
                {
                    // fires when $.global.register is done so this.$ is available
                    if (!this.$.styles)
                        {
                            this.$.styles = {};
                            this.$.styler.states = {};
                            this.$.prefix = this.prefix;
                            this.domReady = false;
                            this.hooks = {};
                        }
                    
                    $.create.hook("process", this.process_handler);
                    $.create.hook("create_before", this.create_handler);
            }
            
            prefix (target, prop) {
                // add css prefixes for JS properties
                let p = prop.trim()[0].toUpperCase() + prop.slice(1);
                target.style["O"+p] = this;
                target.style["Moz"+p] = this;
                target.style["ms"+p] = this;
                target.style["Webkit"+p] = this;

                return this;
            }
            
            create(stylesheet)
                {
                    // adds the style sheet to $.styles
                    $.global.append(stylesheet, $.styles, true);
                    
                    if (stylesheet["@body"])
                        {
                            // requires the DOM to be ready
                            if (!$.styler.domReady)
                                {
                                    window.addEventListener("DOMContentLoaded", () => {$.styler.set(document.body, "@body");}, false);
                                }
                            else
                                {
                                    $.styler.set(document.body, "@body");
                                }
                        }
                }
            
            process_handler(ev)
                {
                    let className, id, str;

                    switch (ev.data.prop)
                    {
                        case "styler":
                            ev.data.set = false;
                            $.styler.set(ev.data.parent, ev.data.value);
                            break;
                        case "id":
                            id = "#"+ev.data.value;
                            $.styler.set(ev.data.parent, id);
                            break;
                        case "class":
                            str = ev.data.value.split(" ");
                            className = "";

                            str.map((v) => {
                                $.styler.set(ev.data.parent, "." + v);
                            });
                            break;
                        case "className":
                            str = ev.data.value.split(" ");
                            className = "";

                            str.map((v) => {
                                className += "."+v+" ";
                            });

                            className = "."+ev.data.value;
                            $.styler.set(ev.data.parent, className);
                            break;
                        case "classname":
                            str = ev.data.value.split(" ");
                            className = "";

                            str.map((v) => {
                                className += "."+v+" ";
                            });

                            className = "."+ev.data.value;
                            $.styler.set(ev.data.parent, className);
                            break;
                    }

                }
    
            create_handler (ev) {
                let style = "@"+ev.data.element.tagName.toLowerCase();

                if ($.styles[style])
                    {
                        console.log("@"+ev.element);
                        $.styler.set(ev.data.element, style);
                    }
            }
            
            set(target, style)
                {
                    if (!target.styler)
                        {
                            target.styler = {};
                            target.styler.style = {};
                            target.styler.fragments = {};
                        }
                    
                    if (style instanceof Array)
                        {
                            // array of strings
                            style.map((v) => {
                                if (v)
                                    {
                                        if (v instanceof Array)
                                            {
                                                // override styler ie.. [arg.styler]
                                                target.styler.overrides = v[0];
                                            }
                                        else
                                            {
                                                // string value
                                                let arr = v.split(";")
                
                                                arr.map((a) =>
                                                {
                                                    $.styler.set_processor(target, a.replace(/\s\s+/g, ' '));
                                                });
                                            }
                                    }
                            });
                        }
                    else if (typeof style === "string")
                        {
                            // A single string, split by ";" incase of multiple statements so were also compatible with backticks
                            let arr = style.split(";"); // split by statement

                            arr.map((v,k) => {
                                $.styler.set_processor(target, v.replace(/\s\s+/g, ' '));
                            });
                        }

                    $.styler.update_style(target, style);
                }

            
            set_processor(target, fragment)
                {
                    let str = "";
                    fragment = fragment.trim();
                    
                    let list = {
                        add: $.styler.type_add,
                        remove: $.styler.type_remove,
                        swap: $.styler.type_swap,
                        set: $.styler.type_set,
                        event: $.styler.type_event,
                        state: $.styler.type_state,
                    };

                    let i = fragment.indexOf(" ");

                    if (i > -1)
                        {
                            str = fragment.slice(0, i);
                        }
                    else
                        {
                            str = fragment;
                        }

                    if (!list[str])
                        {
                            str = "add";
                        }

                    if (list[str])
                        {
                            if (i > -1)
                                {
                                    list[str](target, fragment.slice(i+1));
                                }
                            else
                                {
                                    list[str](target, fragment);
                                }
                        }
                }
            
            update_style(target, fragment) {
                // enum thourhg each prop and process accordingly, get rid of append
                target.styler.style = {};
                
                if (fragment && target.styler.fragments[fragment])
                    {
                        $.global.append(target.styler.fragments[fragment], target.styler.style, true);

                        if (target.styler.overrides && target.styler.overrides[fragment])
                            {
                                // override style
                                $.global.append(target.styler.overrides[fragment], target.styler.style, true);
                            }
                    }
                else
                    {
                        for (let n in target.styler.fragments)
                            {
                                $.global.append(target.styler.fragments[n], target.styler.style, true);

                                if (target.styler.overrides && target.styler.overrides[n])
                                    {
                                        // override style
                                        $.global.append(target.styler.overrides[n], target.styler.style, true);
                                    }
                            }
                    }

                for (let n in target.styler.style)
                    {
                        let item = target.styler.style[n];
                        let f = n.trim()[0].charCodeAt(0);
                        let type = typeof item;
                        
                        // special char check
                        if (    (f < 48)
                            ||  (f > 57 && f < 65)
                            ||  (f > 90 && f < 97)
                            ||  (f > 122) )
                        {
                            // Special syntax found
                            
                            continue;
                        }
                        
                        if (type === "function")
                            {
                                // function value
                                target.style[n] = item(target, n);
                            }
                        else if (type === "string" && item.indexOf("@") > -1)
                            {
                                // hook value
                                let id = item.slice(item.indexOf("@")+1);
                                
                                if (!$.styler.hooks[id])
                                    {
                                        $.styler.hooks[id] = [];
                                        
                                        $.hook(id, (ev) => {
                                            $.styler.hooks[id].map((v) => {
                                                v.style[n] = ev.data
                                            });
                                        });
    
                                    }
                                
                                $.styler.hooks[id].push(target);
                                
                            }
                        else
                            {
                                target.style[n] = item;
                            }
                    }
            }
            
            type_set (target, fragment) {
                // replace and set inital styler for the target
                let fragments = $.styler.get_fragment(fragment);

                $.global.append({fragments: fragments.set}, target.styler, true);
            }
    
            type_swap (target, fragment) {
                // replace and set inital styler for the target
                let fragments = $.styler.get_fragment(fragment, "swap");
                
                for (let n in fragments.ref)
                    {
                        let remove = fragments.ref[n].what;
    
                        if (target.styler.fragments[remove])
                        {
                            let add = fragments.ref[n].with;
                            
                            delete target.styler.fragments[remove];
                            if (fragments.set[add])
                                {
                                    target.styler.fragments[add] = fragments.set[add];
                                }
                        }
                    }
            }

            type_switch (target, fragment) {
                // replace and set inital styler for the target
                let fragments = $.styler.get_fragment(fragment, "switch");

                for (let n in fragments.ref)
                    {
                        let a = fragments.ref[n].what;
                        let b = fragments.ref[n].with;

                        if (target.styler.fragments[a])
                            {
                                delete target.styler.fragments[a];

                                if (fragments.set[b])
                                    {
                                        target.styler.fragments[b] = fragments.set[add];
                                    }
                            }
                        else if (target.styler.fragments[b])
                            {
                                delete target.styler.fragments[b];

                                if (fragments.set[a])
                                    {
                                        target.styler.fragments[a] = fragments.set[add];
                                    }
                            }
                    }
            }
    
            type_remove (target, fragment) {
                let fragments = $.styler.get_fragment(fragment, "remove");

                fragments.ref.remove.map( (v) => {
                    if (target.styler.fragments[v])
                        {
                            for (let n in target.styler.fragments[v])
                                {
                                    target.style[n] = ""; // use "" not unset as unset technically is a value and is retained internally in the CSSOM
                                }

                            delete target.styler.fragments[v];
                        }
                });

            }
    
            type_add (target, fragment) {
                let fragments = $.styler.get_fragment(fragment);
                for (let n in fragments.set)
                    {
                        if (fragments.set[n])
                            {
                                target.styler.fragments[n] = fragments.set[n];
                            }
                    }
            }
    
            type_state (target, fragment) {
                let fragments = $.styler.get_fragment(fragment, "state");

                if (!target.styler.states)
                    {
                        target.styler.states = {};
                    }
                
                if (!target.styler.states[fragments.ref.name])
                    {
                        target.styler.states[fragments.ref.name] = {};
                        target.styler.states[fragments.ref.name][fragments.ref.state] = fragments.set;
                        
                        $.styler.states[fragments.ref.name] = {};
                        $.styler.states[fragments.ref.name][fragments.ref.state] = [];
                        
                        $.styler.states[fragments.ref.name][fragments.ref.state].push(target);
                        target.styler.states[fragments.ref.name][fragments.ref.state].state_target = true;
                    }
                else
                    {
    
                        if (!$.styler.states[fragments.ref.name])
                            {
                                $.styler.states[fragments.ref.name] = {}
                            }
    
                        if (!$.styler.states[fragments.ref.name][fragments.ref.state])
                            {
                                if (!target.styler.states[fragments.ref.name][fragments.ref.state])
                                    {
                                        target.styler.states[fragments.ref.name][fragments.ref.state] = {};
                                    }
                                
                                $.global.append(fragments.set, target.styler.states[fragments.ref.name][fragments.ref.state], true);
                                $.styler.states[fragments.ref.name][fragments.ref.state] = [];
                            }
                        
                        $.styler.states[fragments.ref.name][fragments.ref.state].push(target);
                        target.styler.states[fragments.ref.name][fragments.ref.state].state_target = true;
                    }
    
                if (!$.states[fragments.ref.name])
                    {
                        // state does not exists
                        // add onchange event and set to state handler
                        $.state.create({
                            id: fragments.ref.name,
                            event: {
                                change: $.styler.state_change_handler
                            },
                        });
                        
                        $.state.add(fragments.ref.name, fragments.ref.state);
                    }
                else
                    {
                        // state exists so add this state
                        $.state.add(fragments.ref.name, fragments.ref.state);
                    }
            }
            
            // state_change_handler
            state_change_handler (ev) {
                // remove previous states style
                // add new states style
                if ($.styler.states[ev.states.id] && $.styler.states[ev.states.id][ev.state])
                    {
                        $.styler.states[ev.states.id][ev.state].map((v) => {
                            // enum each target element
                            // remove previous state
                            if (ev.states.previous)
                                {
                                    for (let n in v.styler.states[ev.states.id][ev.states.previous.state])
                                        {
                                            if (n !== "state_target")
                                                {
                                                    // apply style (NOTE: this is not part of the typical $.styler.update_style pipe)
                                                    let item = v.styler.states[ev.states.id][ev.states.previous.state][n];
                    
                                                    delete v.styler.fragments[n];
                                                }
                                        }
                                }
                            
                            // add new state
                            for (let n in v.styler.states[ev.states.id][ev.state])
                                {
                                    if (n !== "state_target")
                                        {
                                            // apply style (NOTE: this is not part of the typical $.styler.update_style pipe)
                                            let item = v.styler.states[ev.states.id][ev.state][n];
                                            
                                            v.styler.fragments[n] = item; // add fragment
                                        }
                                }
                            
                            $.styler.update_style(v);
                        });
                    }
            }
    
            type_event (target, fragment) {
                let fragments = $.styler.get_fragment(fragment, "event");

                if (!target.styler.events)
                    {
                        target.styler.events = {};
                    }
                
                if (!target.styler.events[fragments.ref.event])
                    {
                        target.styler.events[fragments.ref.event] = [];
                    }

                target.styler.events[fragments.ref.event].push(fragments);

                // event shorthands
                if (fragments.ref.event === "hover")
                    {
                        target.eventHover = false;
                        target.addEventListener("mouseenter", $.styler.event_hover.bind(null, target, fragments));
                        target.addEventListener("mouseleave", $.styler.event_hover.bind(null, target, fragments));

                    }
                else if (fragments.ref.event === "select")
                    {
                        target.eventSelect = false;
                        target.addEventListener("click", $.styler.event_select.bind(null, target, fragments));
                    }
                else
                    {
                        target.addEventListener(fragments.ref.event, $.styler.event_handler.bind(null, target, fragments));
                    }

            }

            event_hover (target, event) {

                if (!target.eventSelect)
                    {
                        if (target.eventHover)
                            {
                                target.eventHover = false;
                                if (target.styler.fragments[event.ref.a])
                                    {
                                        delete target.styler.fragments[event.ref.a];
                                    }

                                $.global.append(event.ref.bStyle, target.styler.fragments, true);
                                $.styler.update_style(target, event.ref.b);

                            }
                        else
                            {
                                target.eventHover = true;

                                if (target.styler.fragments[event.ref.b])
                                    {
                                        delete target.styler.fragments[event.ref.b];
                                    }

                                $.global.append(event.ref.aStyle, target.styler.fragments, true);
                                $.styler.update_style(target, event.ref.a);
                            }

                    }
            }

            event_select (target, event) {
                if (target.eventSelect)
                    {
                        // selected
                        target.eventSelect = false;

                        if (target.styler.fragments[event.ref.a])
                            {
                                delete target.styler.fragments[event.ref.a];
                            }

                        $.global.append(event.ref.bStyle, target.styler.fragments, true)
                        $.styler.update_style(target, event.ref.b);
                    }
                else
                    {
                        // not selected
                        target.eventSelect = true;

                        if (target.styler.fragments[event.ref.b])
                            {
                                delete target.styler.fragments[event.ref.b];
                            }

                        $.global.append(event.ref.aStyle, target.styler.fragments, true)
                        $.styler.update_style(target, event.ref.a);
                    }

            }
            
            event_handler (target, event) {
                switch (event.ref.op)
                {
                    case "swap":
                        if (event.ref.swap)
                            {
                                delete target.styler.fragments[event.ref.swap];
                            }
                        
                        $.global.append(event.set, target.styler.fragments, true);

                        for (let n in event.set)
                            {
                                $.styler.update_style(target, n);
                            }
                        break;
                    case "switch":
                        if (target.styler.fragments[event.ref.a])
                            {
                                delete target.styler.fragments[event.ref.a];
                                $.global.append(event.ref.bStyle, target.styler.fragments, true);
                            }
                        else if (target.styler.fragments[event.ref.b])
                            {
                                delete target.styler.fragments[event.ref.b];
                                $.global.append(event.ref.aStyle, target.styler.fragments, true);
                            }
                        else
                            {
                                // default if the fragment has intitaly not being set, a first then b
                                if ($.styles[event.ref.a])
                                    {
                                        $.global.append(event.ref.aStyle, target.styler.fragments, true);
                                        $.styler.update_style(target, event.ref.a);
                                    }
                                else
                                    {
                                        $.global.append(event.ref.bStyle, target.styler.fragments, true);
                                        $.styler.update_style(target, event.ref.b);
                                    }
                            }
                        break;
                    case "remove":
                        for (let n in event.set)
                            {
                                delete target.styler.fragments[n];
                            }
                        break;
                    default:
                        $.global.append(event.set, target.styler.fragments, true);
                        for (let n in event.set)
                            {
                                $.styler.update_style(target, n);
                            }
                        break;
                }
            }
    
            get_fragment (str, type = null) {

                let fragments = str.split(" ");
                let setArray = [];
                let set = {};
                let ref = {};

                if (type)
                    {
                        switch (type)
                        {
                            case "swap":
                                fragments.map((v, k) => {
                                    let s = v.split("/");
                                    setArray[k] = s[1];
                                    ref[k] = {what: s[0], with: s[1]};
                                });
                                break;
                            case "remove":
                                ref = {remove: fragments}
                                break;
                            case "switch":
                                fragments.map((v, k) => {
                                    let s = v.split("/");
                                    setArray[k] = s[1];
                                    ref[k] = {what: s[0], with: s[1]};
                                });
                                break;
                            case "state":
                                if (fragments[0] === "default")
                                    {
                                        let state = fragments[1].split("/");
                                        ref = {
                                            name: state[0],
                                            state: state[1],
                                            default: true,
                                        };
                                        
                                        setArray = fragments.slice(2);
                                    }
                                else
                                    {
                                        let state = fragments[0].split("/");
                                        ref = {
                                            name: state[0],
                                            state: state[1],
                                            default: false,
                                        };
                                        
                                        setArray = fragments.slice(1);
                                    }
    
                                break;
                            case "event":
                                ref = {
                                    event: fragments[0],
                                    op: fragments.length === 3 ? fragments[2] : "switch",
                                };

                                if (fragments[fragments.length-1].indexOf("/") > -1)
                                    {
                                        // swap
                                        let s = fragments[fragments.length-1].split("/");

                                        if (ref.op === "switch")
                                            {
                                                // switch
                                                ref.a = s[0];
                                                ref.b = s[1];
                                                ref.aStyle = $.styler.resolve_fragment(s[0]);
                                                ref.bStyle = $.styler.resolve_fragment(s[1]);
                                            }
                                        else
                                            {
                                                // swap
                                                ref.swap = s[0];
                                                setArray = [s[1]];
                                            }
                                    }
                                else
                                    {
                                        setArray = fragments.slice(2);
                                    }
                                break;
                        }
                    }
                else
                    {
                        setArray = fragments;
                    }

                setArray.map( (v) => {
                    $.global.append($.styler.resolve_fragment(v), set, true);
                });

                return {set: set, ref: ref};
            }
            
            resolve_fragment(str) {
                let results = [];

                if ($.styles[str])
                    {
                        // global stylesheet
                        results[str] = $.styles[str];
                    }
                else
                    {
                        // try path search
                        let arr = str.split(".");
    
                        if (arr.length > 0)
                            {
                                let target = $.styles;
                                let index = 0;
                                let search = true;
                    
                                while (search)
                                    {
                                        if (index < arr.length)
                                            {
                                                if (target[arr[index]])
                                                    {
                                                        target = target[arr[index]];
                                                    }
                                                else
                                                    {
                                                        if (index === 0)
                                                            {
                                                                target = false;
                                                            }
                                                        
                                                        search = false;
                                                    }
                                            }
                                        else
                                            {
                                                search = false;
                                            }
                            
                                        index++;
                                    }
                                    
                                results[str] = target;
                            }
                    }
                
                return results;
            }
        }
    
    
});