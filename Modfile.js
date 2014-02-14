// More info about Modfile at https://github.com/modulejs/modjs/

module.exports = {
    version: ">=0.4.3",
    plugins: {
        amdify: './task/amdify'
    },
    tasks: {
        server: {
            port: 80,
            proxies: [
                {
                    location: "/demo/",
                    alias: "./"
                }
            ]
        },
        download: {
            options: {
                dest: "js/"
            },
            zepto: {
                src: "http://raw.github.com/madrobby/zepto/master/src/zepto.js"
            },
            event: {
                src: "http://raw.github.com/madrobby/zepto/master/src/event.js"
            },
            ajax: {
                src: "http://raw.github.com/madrobby/zepto/master/src/ajax.js"
            },
            data: {
                src: "http://raw.github.com/madrobby/zepto/master/src/data.js"
            },
            touch: {
                src: "http://raw.github.com/madrobby/zepto/master/src/touch.js"
            },
            requirejs: {
                src: "http://requirejs.org/docs/release/2.1.10/comments/require.js",
                dest: 'vendor/requirejs/'
            },
            'requirejs-tmpl': {
                src: "https://raw.github.com/modulejs/requirejs-tmpl/master/tmpl.js"
            }
        },
        amdify: {
            src: "js/{zepto,event,ajax,data,touch}.js"
        }
    },
    targets: {
        vendor: ["download", "amdify"]
    }
};