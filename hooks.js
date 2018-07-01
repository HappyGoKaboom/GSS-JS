$.global.register({
    // info
    name: "hooks",
    description: "Allows other code to hook into your code and fire events",
    author: "Christopher Myers",
    date: "@TODO",
    update: "@TODO",
    version: "@TODO",
    license: "@TODO",
    
    // config
    path: "plugins.hooks", // optional assign path
    auto: true, // automatically instances the class to the path / default true
    
    // extensions / plugins
    plugins: [],
    
    // instance
    instance: class Hooks
        {
            registered()
                {
                    if (!this.$.hook)
                        {
                            this.$.hook = this.hook;
                            this.$.hook.hooks = {};
                            this.$.hook.remove = this.remove;
                        }
                    
                    if (!this.$.fire)
                        {
                            this.$.fire = this.fire;
                            this.$.fire.fires = {};
                            this.$.fire.get = this.hook.get;
                            this.$.fire.set = this.hook.set;
                        }
                }
            
            extends(what)
                {
                    // this extends another object with its own hook system
                    what.hook = this.hook.bind(what);
                    what.hook.hooks = {};
                    what.hook.remove = this.remove.bind(what);
                    
                    what.fire = this.fire.bind(what);
                    what.fire.fires = {};
                    what.fire.get = this.get.bind(what);
                    what.fire.set = this.set.bind(what);
                }
            
            hook(ev, callback, getlast = false)
                {
                    let target;
                    
                    if (this && this.hook)
                        {
                            // local fire
                            // bound target instance
                            target = this;
                        }
                    else
                        {
                            // global fire
                            target = window[GLOBAL_INIT_PATH];
                        }
                    
                    if (!target.hook.hooks[ev])
                        {
                            target.hook.hooks[ev] = [];
                        }
                    
                    target.hook.hooks[ev].push(callback);
                    
                    if (getlast && target.fire.fires[ev])
                        {
                            target.fire(ev, target.fire.fires[ev]);
                        }
                }
            
            fire(ev, data)
                {
                    let target, ret = true;
                    
                    if (this && this.fire)
                        {
                            // local fire
                            // bound target instance
                            target = this;
                        }
                    else
                        {
                            // global fire
                            target = window[GLOBAL_INIT_PATH];
                        }
                    
                    if (target.hook.hooks[ev])
                        {
                            target.hook.hooks[ev].map((v) =>
                            {
                                ret = v({event: ev, data: data});
                            });
                        }
                    
                    // update last event fire
                    target.fire.fires[ev] = data;
                    return ret; // return result
                }
            
            get(ev)
                {
                    let target;
                    
                    if (this && this.hook)
                        {
                            // local fire
                            // bound target instance
                            target = this;
                        }
                    else
                        {
                            // global fire
                            target = window[GLOBAL_INIT_PATH];
                        }
                    
                    return (data) =>
                        {
                            return (target.fire(ev.replace(/\s/g, ''), data)) !== false
                        }
                }
            
            set(ev, value)
                {
                    let target;
                    
                    if (this && this.hook)
                        {
                            // local fire
                            // bound target instance
                            target = this;
                        }
                    else
                        {
                            // global fire
                            target = window[GLOBAL_INIT_PATH];
                        }
                    
                    target.fire.fires[ev.replace(/\s/g, '')] = value;
                }
            
            remove (ev, what) {
                let target;
    
                if (this && this.fire)
                    {
                        // local fire
                        // bound target instance
                        target = this;
                    }
                else
                    {
                        // global fire
                        target = window[GLOBAL_INIT_PATH];
                    }
                if (target.hook.hooks[ev])
                    {
                        target.hook.hooks[ev].map((v, k) =>
                        {
                            if (v === what)
                                {
                                    // found
                                    delete target.hook.hooks[ev][k];
                                }
                        });
                    }
            }
        }
});