define(['./debounce', './event'], function () {
    // TODO: skip load invisible element
    var debounce = $.debounce;
    // cache computing rect avoid re-layout
    var cacheId = 0;
    var boudingClientRectCache = {};

    function LazyLoad(elements, options) {
        this.elements = elements;
        this.options = options;
        this.handler =  options.handler;
        this.container = options.container;
        this.$container = $(options.container);
        this.onScroll = debounce($.proxy(this.onScroll, this), options.defer, false);
        this.onResize = debounce($.proxy(this.onResize, this), options.defer, false)
    }

    LazyLoad.DEFAULTS = {
        start: true,
        attribute: 'data-lazy',
        defer: 300,
        handler: function (el, lazyData){
            el.setAttribute("src", lazyData);
        },
        container: window   // container should with -webkit-overflow-scrolling: touch style
    };

    LazyLoad.prototype = {
        start: function(){
            this.status = 1;
            setTimeout(function(){
                if(!this.inited){
                    this.inited = true;
                    this.containerHeight = this.getContainerHeight();
                    $(window).on('resize', this.onResize);
                    this.$container.on('scroll', this.onScroll);
                }

                this.onScroll();
            }.bind(this), this.options.defer)
        },

        add: function(elements){
            elements = $(elements).get();
            this.elements = this.elements.concat(elements)
        },

        getContainerHeight: function(){
            var container = this.container;
            // if container is window object
            if(container.document){
                return window.innerHeight;
            }else{
                var style = window.getComputedStyle(container);
                // that equal container.offsetHeight
                return parseInt(style.height) + parseInt(style.paddingTop) + parseInt(style.paddingBottom) + parseInt(style.marginTop) + parseInt(style.marginBottom);
            }
        },

        onResize: function(evt){
            if(!this.status) return;
            this.containerHeight = this.getContainerHeight();
            boudingClientRectCache = {};
            this.onScroll();
        },

        onScroll: function (evt){
            if(!this.status) return;
            var elements = this.elements;
            var el;
            var lazyData;
            for(var i=0, l=elements.length; i< l; i++){
                el = elements[i];
                el.cacheId = el.cacheId || ++cacheId;
                if (el && this.elementInViewport(el)) {

                    if(!(lazyData = el.lazyData)){
                        lazyData = el.getAttribute(this.options.attribute);
                        // cache value
                        el.lazyData = lazyData;
                    }

                    if (lazyData) this.handler(el, lazyData);
                    elements.splice(i, 1, null);
                }
            }

            this.elements = elements.filter(function(v){return v});
        },

        elementInViewport: function (el) {
            var container = this.container;
            var id = el.cacheId;  // cached by id
            var rect = boudingClientRectCache[id] || $(el).offset();
            var scrollY = this.containerHeight;

            if(container.document){
                scrollY += (container.scrollY || container.pageYOffset);
            }else{
                scrollY += (container.scrollTop || window.scrollY ) + (container.offsetTop || window.pageYOffset);
            }

            boudingClientRectCache[id] = rect;
            return (rect.top >= 0 && rect.top <= scrollY ) || (rect.bottom >= 0 && rect.bottom <= scrollY);
        },

        pause: function(){
            this.status = 0
        },

        destory: function(){
            this.$container.off('scroll', this.onScroll);
            $(window).off('resize', this.onResize);
            boudingClientRectCache = {};
            this.status = 0;
            this.elements = null;
            this.container = null;
            this.$container = null;
        }
    };

    $.LazyLoad = LazyLoad;

    $.fn.lazyload = function(option) {
        var elements = this.get();
        var options = $.extend({}, LazyLoad.DEFAULTS, typeof option == 'object' && option);

        var $container = $(options.container);
        // assume it's a origin node
        options.container = $container[0];
        var data  = $container.data('lazyload');
        if (!data) {
            data = new LazyLoad(elements, options);
            $container.data('lazyload', data)
        }
        if (typeof option == 'string') data[option]();
        else if (options.start) data.start();

        return data;
    };
});
