// More info about Modfile at https://github.com/modulejs/modjs/

module.exports = {
    version: ">=0.4.3",
    plugins: {
        amdify: './task/amdify'
    },
    tasks: {
        server: {
            port: 3000
        },
        download: {
            options: {
                dest: "js/"
            },
            zepto: {
                src: "http://rawgithub.com/madrobby/zepto/master/src/zepto.js"
            },
            event: {
                src: "http://rawgithub.com/madrobby/zepto/master/src/event.js"
            },
            ajax: {
                src: "http://rawgithub.com/madrobby/zepto/master/src/ajax.js"
            },
            data: {
                src: "http://rawgithub.com/madrobby/zepto/master/src/data.js"
            },
            touch: {
                src: "http://rawgithub.com/madrobby/zepto/master/src/touch.js"
            },
            requirejs: {
                src: "http://requirejs.org/docs/release/2.1.10/comments/require.js",
                dest: 'vendor/requirejs/'
            },
            'requirejs-tmpl': {
                src: "http://rawgithub.com/modulejs/requirejs-tmpl/master/tmpl.js"
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