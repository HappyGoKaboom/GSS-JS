$.global.register({
    // info
    name: "Features",
    description: "Adds various features to the framework",
    author: "YourName",
    date: "@TODO",
    update: "@TODO",
    version: "@TODO",
    license: "@TODO",
    
    // config
    path: "plugins.features", // optional assign path
    auto: true, // automatically instances the class to the path / default true
    
    // extensions / plugins
    plugins: [
    ],
    
    // instance
    instance: class Features
        {
            registered()
                {
                    // fires when $.global.register is done so this.$ is available
                    $.id = this.id_getter;
                    $.class = this.classname_getter;
                    this.refMapping = false;
                    this.refMap = [];
                    $.create.hook("process", this.create_process_handler);
                }
            
            id_getter (id) {
                return document.getElementById(id);
            }
            
            classname_getter(classString) {
                return document.getElementsByClassName(classString);
            }
            
            create_process_handler(ev)
                {
                    let features = $.plugins.features;
                    let str = ev.data.prop.replace(/\s\s+/g, ''); // clean tabs and sequential spaces
                    
                    switch (str.toLocaleLowerCase())
                    {
                        // no break statements are required due to return statement
                        case "id":
                            features.id_set(ev);
                            break;
                            
                        // ClassNames
                        case "classname":
                            features.class_set(ev);
                            break;
                        case "class":
                            features.class_set(ev, true);
                            break;
                        
                        // Events
                        case "event":
                            features.events_set(ev);
                            break;
                        case "events":
                            features.events_set(ev);
                            break;
                        
                        // Attributes
                        case "attributes":
                            features.attributes_set(ev);
                            break;
                        case "attribute":
                            features.attributes_set(ev);
                            break;
                        case "attrib":
                            features.attributes_set(ev);
                            break;
                        case "attr":
                            features.attributes_set(ev);
                            break;

                        case "refs":
                            features.refs_set(ev);
                            break;
                        case "ref":
                            features.ref_set(ev);
                            break;
    
                        case "bind":
                            features.binder(ev);
                            break;
    
                        case "style":
                            features.style(ev);
                            break;
    
                    }
                }
            
            id_set(ev)
                {
                    // adds the id to $.id[id_val] = element
                    $.id[ev.data.value] = ev.data.parent;
                }
            
            class_set(ev, set = false)
                {
                    // adds the classnames to $.class[class_val] = list of elemens that belongs to that class
                    let classes = ev.data.value.split(" ");
                    
                    classes.map((v) =>
                    {
                        if (!$.class[v])
                            {
                                $.class[v] = [];
                            }
                        
                        $.class[v].push(ev.data.parent);
                    });
                    
                    if (set)
                        {
                            ev.data.parent.className = ev.data.value;
                        }
                }
            
            attributes_set(ev)
                {
                    ev.data.set = false;
                    
                    // sets attributes for the element
                    for (let n in ev.data.value)
                        {
                            ev.data.parent.setAttribute(n, ev.data.value[n]);
                        }
                }
            
            events_set(ev)
                {
                    ev.data.set = false;
                    
                    // sets event listeners for the element
                    for (let n in ev.data.value)
                        {
                            if (typeof ev.data.value[n] === "function")
                                {
                                    ev.data.parent.addEventListener(n, ev.data.value[n].bind(ev.data.parent));
                                }
                        }
                    
                    ev.data.parent.events = ev.data.value;
                }

            refs_set(ev) {
                ev.data.set = false;

                if (this.refMap.length > 0)
                    {
                        let refs = {};

                        this.refMap.map((v) => {
                            refs[v.name] = v.target;
                        });
                        
                        refs.$ = ev.data.parent;
                        
                        if (!ev.data.parent.refs)
                            {
                                ev.data.parent.refs = refs;
                            }
                        else
                            {
                                $.append(refs, ev.data.parent.refs, true);
                            }
    
                        this.refMap.map((v) => {
                            v.target.refs = refs;
                        });
                        
                        this.refMap = [];
                    }
            }

            ref_set(ev) {
                this.refMap.push({name: ev.data.value, target: ev.data.parent});
            }
    
            binder (ev) {
                ev.data.set = false;
                
                // binds function to the element, so that this = the element
                for (let i in ev.data.value) {
                    let item = ev.data.value[i];
                    
                    ev.data.parent[i] = item.bind(ev.data.parent);
                }
            }
    
            style (ev) {
                // append style object
                ev.data.set = false;
                
                for (let i in ev.data.value)
                    {
                        if (typeof ev.data.value[i] === "function")
                            {
                                ev.data.parent.style[i] = ev.data.value[i]();
                            }
                        else
                            {
                                ev.data.parent.style[i] = ev.data.value[i];
                            }
                    }
            }
        }
});
