// where in the window do you want the framework to be initialized to, ie window.my.path or window.$
const GLOBAL_INIT_PATH = "$";

class Global
    {
        constructor()
            {
                return this
            }
        
        register(obj)
            {
                let target, name;
                let found = false;
                let info = {};
                let item;
                
                if (!this.registered)
                    {
                        this.registered = {};
                        $.append = this.append;
                    }
                
                name = obj.name.toLowerCase();
                name = name.replace(" ", "");
                
                this.registered[name] = obj;

                if (!obj.auto && obj.auto === false)
                    {
                        // do not auto instance
                        // default auto instance
                        if (obj.path)
                            {
                                // use path instead
                                target = this.appendToPath(obj.instance, obj.path);
                            }
                        else if (obj.name)
                            {
                                // use name converted to lowercase
                                this.$[obj.name] = obj.instance;
                                target = this.$[obj.name];
                            }
                        else
                            {
                                // no name to assign - @error
                            }
                    }
                else
                    {

                        // default auto instance
                        if (obj.path)
                            {
                                // use path instead
                                target = this.appendToPath((new obj.instance), obj.path);
                            }
                        else if (obj.name)
                            {
                                // use name converted to lowercase
                                this.$[obj.name] = new obj.instance;
                                target = this.$[obj.name];
                            }
                        else
                            {
                                // no name to assign - @error
                            }
                    }
                
                target.$ = window[GLOBAL_INIT_PATH];
                
                // Get plugins
                if (obj.plugins)
                    {
                        if (!this.await)
                            {
                                this.await = {};
                            }
                        
                        if (typeof obj.plugins === "object")
                            {
                                // iterate
                                if (obj.plugins.map)
                                    {
                                        // array
                                        obj.plugins.map((v) =>
                                        {
                                            found = false;
                                            item = v.toLowerCase().replace(/\s/g, '');
                                            
                                            if (this.$[item])
                                                {
                                                    found = this.$[item];
                                                }
                                            else if (this.$.plugins && this.$.plugins[item])
                                                {
                                                    found = this.$.plugins[item];
                                                }
                                            else
                                                {
                                                    // await plugin to be loaded
                                                    this.await[item] = {what: item, instance: target};
                                                }
    
                                            // if found
                                            if (found)
                                                {
                                                    // add plugin
                                                    if (found.extends)
                                                        {
                                                            found.extends(target);
                                                            
                                                            if (target["_" +item])
                                                                {
                                                                    target["_" +item]();
                                                                }
                                                        }
            
                                                }
                                        });
                                    }
                                else
                                    {
                                        // object, {hooks: true, events: false} true / false pattern for active/inactive
                                        // array
                                        for (let v in obj.plugins)
                                            {
                                                found = false;
                                                item = v.toLowerCase().replace(/\s/g, '');
                                                
                                                if (this.$[item] && obj.plugins[item])
                                                    {
                                                        found = this.$[item];
                                                    }
                                                else if (this.$.plugins && this.$.plugins[v] && obj.plugins[item])
                                                    {
                                                        found = this.$.plugins[item];
                                                    }
                                                else if (obj.plugins[item])
                                                    {
                                                        // await plugin to be loaded
                                                        this.await[item] = {what: item, instance: target};
                                                    }
    
                                                // if found
                                                if (found)
                                                    {
                                                        // add plugin
                                                        if (found.extends)
                                                            {
                                                                found.extends(target);
                    
                                                                if (target["_" +item])
                                                                    {
                                                                        target["_" +item]();
                                                                    }
                                                            }
            
                                                    }
                                            }
                                    }
                            }
                        else if (typeof obj.plugins === "string")
                            {
                                // string parsing
                                let plugins = obj.plugins.split(" ");
                                
                                plugins.map((v) =>
                                {
                                    found = false;
                                    item = v.toLowerCase().replace(/\s/g, '');
                                    
                                    if (this.$[item])
                                        {
                                            found = this.$[item];
                                        }
                                    else if (this.$.plugins && this.$.plugins[item])
                                        {
                                            found = this.$.plugins[item];
                                        }
                                    else
                                        {
                                            // await plugin to be loaded
                                            this.await[item] = {what: item, instance: target};
                                        }
                                    
                                    // if found
                                    if (found)
                                        {
                                            // add plugin
                                            if (found.extends)
                                                {
                                                    found.extends(target);
                                                    
                                                    if (target["_" +item])
                                                        {
                                                            target["_" +item]();
                                                        }
                                                }
                                        }
                                });
                            }
                        
                        
                    }
                
                // Check plugins
                if (this.await[name])
                    {
                        // found awaiting plugin
                        // add plugin
                        if (target.extends)
                            {
                                target.extends(this.await[name].instance);
                                
                                if (this.await[name].instance["_" +name])
                                    {
                                        // found callback for plugin on awaiting instance
                                        this.await[name].instance["_" +name]();
                                    }
                            }
                    }
                if (target.registered)
                    {
                        // for auto instanced classes
                        target.registered();
                    }
                else if (obj.instance.prototype.registered)
                    {
                        // for non auto instanced classes
                        obj.instance.prototype.registered();
                    }
            }
        
        appendToPath(obj, path)
            {
                let target = null;
                path = path.split(".");
                
                path.map((v, k) =>
                {
                    if (target === null)
                        {
                            // target not set
                            if (!this.$[v])
                                {
                                    // doesn't exist
                                    if (k === path.length - 1)
                                        {
                                            // last item so set obj
                                            this.$[v] = obj;
                                        }
                                    else
                                        {
                                            this.$[v] = {};
                                        }
                                }
                            
                            target = this.$[v];
                        }
                    else
                        {
                            // target set
                            if (!target[v])
                                {
                                    // doesn't exist
                                    if (k === path.length - 1)
                                        {
                                            // last item so set obj
                                            target[v] = obj;
                                        }
                                    else
                                        {
                                            target[v] = {};
                                        }
                                }
                            
                            target = target[v];
                        }
                });
                
                return target;
            }
        
        append(what, to, own = true, fire = null, _parent, _owner)
            {
                let n;
                let set = true;
                
                if (!_owner)
                    {
                        _owner = to
                    }
                
                for (n in what)
                    {
                        if (own === true)
                            {
                                if (what.hasOwnProperty(n))
                                    {
                                        set = true;
                                    }
                                else
                                    {
                                        set = false;
                                    }
                            }
                        
                        if (set)
                            {
                            if (typeof what[n] === 'object')
                                {
                                    if (what[n] instanceof Array)
                                        {
                                            if (fire)
                                                {
                                                    let res = {prop: n, value: what[n], parent: to, owner: _owner, set: true };
                                                    fire(res);
    
                                                    if (res.set === true)
                                                        {
                                                            // do not set the append
                                                            if (!to[n]){to[n] = []}
                                                            $.append(what[n], to[n], own, fire, n, _owner);
                                                        }
                                                }
                                            else
                                                {
                                                    if (!to[n]){to[n] = []}
                                                    $.append(what[n], to[n], own, fire, n, _owner);
                                                }
                                        }
                                    else
                                        {
                                            if (fire)
                                                {
                                                    let res = {prop: n, value: what[n], parent: to, owner: _owner, set: true };
                                                    fire(res);
    
                                                    if (res.set === true)
                                                        {
                                                            // do not set the append
                                                            if (what[n] && what[n].nodeType)
                                                                {
                                                                    to[n] = what[n];
                                                                }
                                                            else
                                                                {
                                                                    if (!to[n]){to[n] = {}}
                                                                    $.append(what[n], to[n], own, fire, n, _owner);
                                                                }
                                                        }
                                                }
                                            else
                                                {
                                                    if (what[n] && what[n].nodeType)
                                                        {
                                                            to[n] = what[n];
                                                        }
                                                    else
                                                        {
                                                            if (!to[n]){to[n] = {}}
                                                            $.append(what[n], to[n], own, fire, n, _owner);
                                                        }
                                                }
                                        }
                                }
                            else
                                {
                                    if (fire)
                                        {
                                            let res = {prop: n, value: what[n], parent: to, owner: _owner, set: true };
                                            fire(res);
                                            
                                            if (res.set === true)
                                                {
                                                    to[n] = what[n];
                                                }
                                        }
                                    else
                                        {
                                            to[n] = what[n];
                                        }
                                }
                            }
                    }
            }
    }

if (window[GLOBAL_INIT_PATH])
    {
        window[GLOBAL_INIT_PATH].global = new Global;
    }
else
    {
        window[GLOBAL_INIT_PATH] = {global: new Global};
    }

window[GLOBAL_INIT_PATH].global.$ = window[GLOBAL_INIT_PATH];


