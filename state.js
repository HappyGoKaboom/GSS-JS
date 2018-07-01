$.global.register({
    // info
    name: "state",
    description: "Handles states",
    author: "YourName",
    date: "@TODO",
    update: "@TODO",
    version: "@TODO",
    license: "@TODO",
    
    // config
    path: "plugins.state", // optional assign path
    auto: true, // automatically instances the class to the path / default true
    
    // extensions / plugins
    plugins: [],
    
    // instance
    instance: class State
        {
            constructor()
                {
                    // fires on registration before this.$ is available
                    this.string = this.string();
                    this.targets = this.targets();
                }
            
            registered()
                {
                    // fires when $.global.register is done so this.$ is available
                    if (!this.$.states)
                        {
                            this.$.states = {};
                        }
                    
                    if (!this.$.state)
                        {
                            this.$.state = this.$.plugins.state;
                        }
                }
            
            example()
                {
                    // DATA States
                    window.mydata = {};
                    
                    $.state.create({
                        id: "DataSpec",
                        event: {
                            change: (ev, data) =>
                                {
                                    console.log(data)
                                }
                        },
                        spec: {
                            dataA: {
                                data: {
                                    target: window.mydata,
                                    set: {a: "first", b: "some B", c: "not gona be here long", f: "another first"},
                                },
                                html: {
                                    target: document.body,
                                    struct:
                                        $.create.div({id: "view-container-a"},
                                            $.create.div({
                                                    id: "view-a", className: "hide",
                                                    event: {
                                                        click: () =>
                                                            {
                                                                console.log("A CLICK")
                                                            },
                                                        mouseenter: () =>
                                                            {
                                                                console.log("OH YEAH")
                                                            }
                                                    },
                                                    attributes: {
                                                        contentEditable: true,
                                                        disabled: null
                                                    }
                                                },
                                                $.create.p({className: "label", textContent: "Hello from View Alpha"}),
                                                $.create.p({className: "text-a", textContent: "Sponge bobs"})
                                            ),
                                            $.create.div({id: "view-b", className: "hide"},
                                                $.create.p({className: "label", textContent: "Hello from View Beta"}),
                                                $.create.p({className: "text-b", textContent: "sqaure pants"})
                                            ),
                                            $.create.div({id: "view-c", className: "hide"},
                                                $.create.p({className: "label", textContent: "Hello from View Charly"}),
                                                $.create.p({className: "text-c", textContent: "fin"})
                                            )
                                        )
                                },
                            },
                            dataB: {
                                data: {
                                    target: window.mydata,
                                    set: {c: "overwritten", d: "new"},
                                    remove: {a: true},
                                },
                                html: {
                                    target: document.body,
                                    struct:
                                        $.create.div({id: "view-container-b"},
                                            $.create.div({id: "view-d", className: "hide"},
                                                $.create.p({
                                                    className: "label",
                                                    textContent: "ANOTHER HTML VIEW Alpha"
                                                }),
                                                $.create.p({className: "text-a", textContent: "you got mail"})
                                            ),
                                            $.create.div({id: "view-e", className: "hide"},
                                                $.create.p({className: "label", textContent: "ANOTHER HTML VIEW Beta"}),
                                                $.create.p({className: "text-b", textContent: "you got spam"})
                                            ),
                                            $.create.div({id: "view-f", className: "hide"},
                                                $.create.p({
                                                    className: "label",
                                                    textContent: "ANOTHER HTML VIEW Charly"
                                                }),
                                                $.create.p({className: "text-c", textContent: "you got scammed"})
                                            )
                                        )
                                },
                            }
                        }
                    });
                    
                    $.state.set("DataSpec", "dataA");
                    window.dataString = "hello world how are you";
                    
                    // This controls each view within the current DataSpec HTML in the dom
                    $.state.create({
                        id: "views",
                        event: {
                            beforechange: (ev, data) =>
                                {
                                    console.log("global > beforechange", ev, data)
                                },
                            change: (ev, data) =>
                                {
                                    console.log("global > change", ev, data)
                                }
                        },
                        spec: {
                            viewA: {
                                string: {
                                    target: window,
                                    prop: "dataString",
                                    add: " spongebob",
                                    remove: "how ", // add space or it will leave a double space
                                    swap: "hello/slappy"
                                },
                                className: [
                                    {
                                        target: "#view-a #view-d",
                                        swap: "hide/show"
                                    },
                                    {
                                        target: "#view-b #view-c #view-e #view-f",
                                        swap: "show/hide"
                                    },
                                ]
                            },
                            viewB: {
                                event: {
                                    beforechange: (ev, data) =>
                                        {
                                            console.log("local B > beforechange", ev, data)
                                        },
                                    change: (ev, data) =>
                                        {
                                            console.log("local B> change", ev, data)
                                        }
                                },
                                className: [
                                    {
                                        target: "#view-b #view-e",
                                        swap: "hide/show"
                                    },
                                    {
                                        target: "#view-a #view-c #view-d #view-f",
                                        swap: "show/hide"
                                    },
                                ]
                            },
                            viewC: {
                                className: [
                                    {
                                        target: "#view-c #view-f",
                                        swap: "hide/show"
                                    },
                                    {
                                        target: "#view-a #view-b #view-d #view-e",
                                        swap: "show/hide"
                                    },
                                ]
                            },
                        }
                    });
                    
                    $.state.set("views", "viewA");
                }
            
            create(what)
                {
                    let $target;
                    
                    if (this && this.hook)
                        {
                            // local fire
                            // bound target instance
                            $target = this;
                        }
                    else
                        {
                            // global fire
                            $target = window[GLOBAL_INIT_PATH];
                        }
                    
                    for (let n in what.spec)
                        {
                            // assign state name to each spec for referencing
                            what.spec[n].state = n;
                            what.spec[n].states = what;
                        }
                    
                    // additional properties
                    what.current = null;
                    what.previous = null;
                    
                    // assign
                    if (!what.spec)
                        {
                            what.spec = {};
                        }
                    
                    $target.states[what.id] = what;
                    
                    // check for default
                    if (what.default)
                        {
                            $target.set(what.id, what.default);
                        }
                }
            
            set(id, state)
                {
                    let $target;
                    
                    if (this && this.hook)
                        {
                            // local fire
                            // bound target instance
                            $target = this;
                        }
                    else
                        {
                            // global fire
                            $target = window[GLOBAL_INIT_PATH];
                        }
                    
                    if ($target.states[id])
                        {
                            let target = $target.states[id];
                            
                            if (target.spec[state])
                                {
                                    let spec = target.spec[state];
                                    
                                    if (target.event && target.event.beforechange)
                                        {
                                            target.event.beforechange(spec)
                                        }
                                    
                                    // update current and previous
                                    target.previous = target.current;
                                    target.current = spec;
                                    
                                    //  ##################  HTML states #####################
                                    if (spec.html)
                                        {
                                            let node;
                                            
                                            if (typeof spec.html.target === "string")
                                                {
                                                    // string
                                                    node = document.getElementById(spec.html.target);
                                                }
                                            else
                                                {
                                                    // node
                                                    node = spec.html.target;
                                                }
                                            
                                            if (node)
                                                {
                                                    if (spec.event && spec.event.beforechange)
                                                        {
                                                            spec.event.beforechange(target)
                                                        }
                                                    
                                                    // found target node / swap HTML
                                                    if (target.current && node.contains(target.current.html.struct) === true)
                                                        {
                                                            // if previous then remove
                                                            node.replaceChild(spec.html.struct, target.current.html.struct);
                                                        }
                                                    else
                                                        {
                                                            // add new nodes at the same location
                                                            node.appendChild(spec.html.struct);
                                                        }
                                                    
                                                    
                                                    
                                                    
                                                    if (spec.event && spec.event.change)
                                                        {
                                                            spec.event.change(spec)
                                                        }
                                                }
                                            else
                                                {
                                                    // cannot find target node
                                                    console.log("$[STATE]  Unable to find target node!");
                                                }
                                        }
                                    
                                    //  ##################  ClassName/String states #####################
                                    if (spec.string)
                                        {
                                            this.string.process.call(this, target, spec.string);
                                        }
                                    
                                    if (spec.className)
                                        {
                                            if (spec.event && spec.event.beforechange)
                                                {
                                                    spec.event.beforechange(spec)
                                                }
                                            
                                            this.string.process.call(this, target, spec.className, "className");
                                            
                                            if (spec.event && spec.event.change)
                                                {
                                                    spec.event.change(spec)
                                                }
                                        }
                                    
                                    //  ##################  Data states #####################
                                    if (spec.data)
                                        {
                                            if (spec.event && spec.event.beforechange)
                                                {
                                                    spec.event.beforechange(spec, spec.data.target)
                                                }
                                            
                                            if (spec.data.set)
                                                {
                                                    $.global.append(spec.data.set, spec.data.target, false);
                                                }
                                            
                                            if (spec.data.remove)
                                                {
                                                    for (let n in spec.data.remove)
                                                        {
                                                            if (spec.data.target[n])
                                                                {
                                                                    if (spec.data.target.hasOwnProperty(n))
                                                                        {
                                                                            // delete
                                                                            delete spec.data.target[n];
                                                                        }
                                                                    else
                                                                        {
                                                                            // replace with constructor type
                                                                            if (typeof spec.data.target[n] === "string")
                                                                                {
                                                                                    spec.data.target[n] = "";
                                                                                }
                                                                            else if (spec.data.target[n] instanceof Array)
                                                                                {
                                                                                    spec.data.target[n] = [];
                                                                                }
                                                                            else if (spec.data.target[n] instanceof Object)
                                                                                {
                                                                                    spec.data.target[n] = [];
                                                                                }
                                                                            else
                                                                                {
                                                                                    spec.data.target[n] = null; // hope for the best
                                                                                }
                                                                        }
                                                                }
                                                        }
                                                }
    
                                            
                                            
                                            if (spec.event && spec.event.change)
                                                {
                                                    spec.event.change(spec, spec.data.target)
                                                }
                                        }
                                    
                                    if (target.event.change)
                                        {
                                            target.event.change(spec)
                                        }
                                }
                            else
                                {
                                    // cannot find target state
                                    console.log("$[STATE]  Unable to find target state!");
                                }
                        }
                    else
                        {
                            // cannot find target id
                            console.log("$[STATE]  Unable to find target id!");
                        }
                }
            
            add (name, state, spec) {
                if ($.states[name])
                    {
                        if (!$.states[name].spec[state])
                            {
                                if (spec)
                                    {
                                        $.states[name].spec[state] = spec;
                                    }
                                else
                                    {
                                        $.states[name].spec[state] = {};
                                    }
                            }
                        else
                            {
                                $.states[name].spec[state] = spec;
                            }
                        
                        $.states[name].spec[state].state = state;
                        $.states[name].spec[state].states = $.states[name];
                    }
            }
            
            dispose(name, state = null, spec = null)
                {
                    // Disposes of a state and its contents, frees up memory
                    // either the entire state object, or its indiivual states and to a specific extent
                    let target;
                    
                    // what we want to remove
                    let list = {
                        html: false,
                        data: false,
                        string: false,
                        classname: false,
                    };
                    
                    if (!name)
                        {
                            return false;
                        }
                    
                    if (spec && spec !== true)
                        {
                            // remove according to its spec
                            if (spec.map)
                                {
                                    // array
                                    spec.map((v, k) =>
                                    {
                                        let item = v.trim().toLocaleLowerCase();
                                        
                                        if (list[item])
                                            {
                                                list[item] = true;
                                            }
                                    });
                                }
                            else
                                {
                                    // object
                                    for (let n in spec)
                                        {
                                            if (list[n])
                                                {
                                                    list[n] = spec[n];
                                                }
                                        }
                                }
                        }
                    else if (spec === true)
                        {
                            // remove all
                            for (var n in list)
                                {
                                    list[n] = true;
                                }
                        }
                    else
                        {
                            list.html = true; // remove HTML only
                            // no other items will be removed unless specified in a spec
                        }
                    
                    // remove from target
                    if (!state)
                        {
                            // iter thourhg each state and remove according to spec
                            for (let n in $.states[name].spec)
                                {
                                    target = $.states[name].spec[n];
                                    
                                    if (list.html === true && target.html)
                                        {
                                            $.state.dispose_html(target);
                                        }
        
                                    if (list.data === true && target.data)
                                        {
                                            $.state.dispose_data(target);
                                        }
        
                                    if (list.string === true && target.string)
                                        {
                                            $.state.dispose_string(target);
                                        }
        
                                    if (list.classname === true && target.className)
                                        {
                                            $.state.dispose_classname(target);
                                        }
                                }
    
                            delete $.states[name];
                        }
                    else
                        {
                            // remove from a specific state
                            target = $.states[name].spec[state];
                            
                            if (list.html === true && target.html)
                                {
                                    // HTML is removed first to reduce workload of subseqent removals where data is contained within the HTML
                                    $.state.dispose_html(target);
                                }
    
                            if (list.data === true && target.data)
                                {
                                    $.state.dispose_data(target);
                                }
    
                            if (list.string === true && target.string)
                                {
                                    $.state.dispose_string(target);
                                }
    
                            if (list.classname === true && target.className)
                                {
                                    $.state.dispose_classname(target);
                                }
                            
                            delete $.states[name].spec[state];
                        }
                    
                }
            
            dispose_data (target) {
                let list = [];
    
                if (target.data.set)
                    {
                        for (let s in target.data.set)
                            {
                                list.push(s);
                            }
                    }
                
                list.map((v,k) => {
                    delete target.data.target[v];
                });
            }
    
            dispose_html (target) {
                if (target.html.target.contains(target.html.struct))
                    {
                        // must contain the struct with the target or it will produce a NodeNotFound error
                        target.html.target.removeChild(target.html.struct);
                    }
            }
    
            dispose_string (target, prop) {
                let isString = false;
                
                if (!prop)
                    {
                    prop = "string";
                    }
                
                if (target[prop] instanceof Array)
                    {
                        target[prop].map((v) => {
                            let strings = [];
                            let arr;
                            
                            if (v.swap)
                                {
                                    arr = v.swap.split(" ");
                                    
                                    arr.map((s) => {
                                        strings.push(s.slice(s.indexOf("/")+1));
                                    })
                                }
    
                            if (v.add)
                                {
                                    arr = v.add.split(" ");
            
                                    strings = strings.concat(strings, arr);
                                }
    
                            if (v.set)
                                {
                                    arr = v.set.split(" ");
            
                                    strings = strings.concat(strings, arr);
                                }
                            
                            let nodes = $.state.targets.process.call(this, v.target);
                            
                            if (nodes && nodes.length > 0)
                                {
                                    nodes.map((vv) =>
                                    {
                                        if (vv)
                                            {
                                                strings.map((str) => {
                                                    vv[prop] = vv[prop].replace(new RegExp(str, 'g'), "");
                                                });
                                            }
                                    });
                                }
                        });
                    }
                else if (target[prop] instanceof Object)
                    {
                    let item = target[prop];
                    let strings = [];
                    let arr;
                    
                    if (item.swap)
                        {
                            arr = item.swap.split(" ");
        
                            arr.map((s) => {
                                strings.push(s.slice(s.indexOf("/")+1));
                            })
                        }

                    if (item.add)
                        {
                            arr = item.add.split(" ");
        
                            strings = strings.concat(strings, arr);
                        }

                    if (item.set)
                        {
                            arr = item.set.split(" ");
        
                            strings = strings.concat(strings, arr);
                        }

                    let nodes = $.state.targets.process.call(this, item.target);
                    
                    if (nodes && nodes.length > 0)
                        {
                            nodes.map((node) =>
                            {
                                if (node)
                                    {
                                        strings.map((str) => {
                                            node[target[prop].prop] = node[target[prop].prop].replace(new RegExp(str, 'g'), "");
                                        });
                                    }
                            });
                        }
                        
                    }
            }
    
            dispose_classname (target) {
                $.state.dispose_string(target, "className");
            }
            
            string()
                {
                    return {
                        process(target, spec, prop)
                            {
                                // process the targets string according to methods used
                                if (spec instanceof Array)
                                    {
                                        // array of items
                                        spec.map((v, k) =>
                                        {
                                            // single object
                                            for (let n in v)
                                                {
                                                    if (this.string[n])
                                                        {
                                                            prop = prop ? prop : (v.prop ? v.prop : false);
                                                            
                                                            let nodes = this.targets.process.call(this, v.target);
                                                            
                                                            if (nodes && nodes.length > 0)
                                                                {
                                                                    nodes.map((vv) =>
                                                                    {
                                                                        if (vv)
                                                                            {
                                                                                prop ?
                                                                                    this.string[n](vv, prop, v[n])
                                                                                    :
                                                                                    this.string[n](vv, "target", v[n]);
                                                                            }
                                                                    });
                                                                }
                                                            else
                                                                {
                                                                    if (v.target || v)
                                                                        {
                                                                            prop ?
                                                                                this.string[n](v.target, prop, v[n])
                                                                                :
                                                                                this.string[n](v, "target", v[n]);
                                                                        }
                                                                }
                                                        }
                                                }
                                        });
                                    }
                                else if (spec instanceof Object)
                                    {
                                        prop = prop ? prop : (spec.prop ? spec.prop : false);
                                        
                                        let nodes = this.targets.process.call(this, spec.target);
                                        
                                        // single object
                                        for (let n in spec)
                                            {
                                                if (this.string[n])
                                                    {
                                                        if (nodes && nodes.length > 0)
                                                            {
                                                                nodes.map((v) =>
                                                                {
                                                                    if (v)
                                                                        {
                                                                            prop ?
                                                                                this.string[n](v, prop, spec[n])
                                                                                :
                                                                                this.string[n](v, "target", spec[n]);
                                                                        }
                                                                });
                                                            }
                                                        else
                                                            {
                                                                if (spec.target || spec)
                                                                    {
                                                                        prop ?
                                                                            this.string[n](spec.target, prop, spec[n])
                                                                            :
                                                                            this.string[n](spec, "target", spec[n]);
                                                                    }
                                                            }
                                                    }
                                            }
                                    }
                            },
                        add(target, prop, str)
                            {
                                // adds a string
                                target[prop] += str;
                            },
                        remove(target, prop, str)
                            {
                                // removes a string
                                target[prop] = target[prop].replace(new RegExp(str, 'g'), "");
                            },
                        swap(target, prop, str)
                            {
                                // swaps a string
                                let n = str.split("/");
                                target[prop] = target[prop].replace(new RegExp(n[0], 'g'), n[1]);
                            },
                        set(target, prop, str)
                            {
                                // sets a string
                                target[prop] = str;
                            },
                    }
                }
            
            targets()
                {
                    return {
                        process(what)
                            {
                                // process and object, array or string and returns all the nodes
                                if (typeof what === "string")
                                    {
                                        return this.targets.selectors(what);
                                    }
                                else if (what instanceof Array)
                                    {
                                        let nodes = [];
                                        
                                        what.map((v) =>
                                        {
                                            nodes.concat(this.targets.process(v));
                                        });
                                        
                                        return nodes;
                                    }
                                else if (what instanceof Object)
                                    {
                                        return [what]; // return the object
                                    }
                            },
                        selectors(str)
                            {
                                // gets nodes by string ie # for byID or . for by ClassNames
                                let nodes = [];
                                
                                // Get target elements
                                let a = str.split(" ");
                                
                                a.map((v) =>
                                {
                                    if (v.indexOf(".") !== -1)
                                        {
                                            // class selector
                                            let classname = v.trim().replace(".", "");
                                            
                                            let classlist = document.getElementsByClassName(classname);
                                            
                                            for (let i = 0; i < classlist.length; i++)
                                                {
                                                    nodes.push(classlist[i]);
                                                }
                                        }
                                    else if (v.indexOf("#") !== -1)
                                        {
                                            // id selector
                                            nodes.push(document.getElementById(v.trim().replace("#", "")));
                                        }
                                });
                                
                                return nodes;
                            },
                        path(str)
                            {
                                // gets target by processing the path for example window.document.body.mydata
                                
                            }
                        
                    }
                }
            
        }
});