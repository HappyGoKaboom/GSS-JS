$.global.register({
    // info
    name: "NAME",
    description: "Description",
    author: "YourName",
    date: "@TODO",
    update: "@TODO",
    version: "@TODO",
    license: "@TODO",

    // config
    path: "PATH", // optional assign path
    auto: true, // automatically instances the class to the path / default true

    // extensions / plugins
    plugins: [
        "aPlugin" // looks for $.aPlugin OR $.plugins.aPlugin and adds it to your project
    ],

    // instance
    instance: class YOURCLASS
        {
            constructor()
                {
                    // fires on registration before this.$ is available
                }
            
            registered()
                {
                    // fires when $.global.register is done so this.$ is available
                }
            
            
        }
});