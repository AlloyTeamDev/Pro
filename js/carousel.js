define(['./event', './data', './touch', './transition', './requestAnimationFrame'], function(){
    
    var activeClass = 'js-active';
    var slidEvent = 'slid:carousel';
    
    function Carousel(element, options) {
        this.$element    = $(element);
        this.$indicators = this.$element.find('.ui-carousel-indicators');
        this.options     = options;
        this.paused      =
        this.sliding     =
        this.interval    =
        this.$active     =
        this.$items      = null;

        // TODO when only one item, do not need init swiping
        this.swipeable()
    }

    Carousel.DEFAULTS = {
        interval: 5000,
        wrap: true
    };

    Carousel.prototype.cycle =  function (e) {
        e || (this.paused = false);

        this.interval && clearInterval(this.interval);

        this.options.interval
            && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

        return this
    };

    Carousel.prototype.getActiveIndex = function () {
        this.$active = this.$element.find('.ui-carousel-item.'+ activeClass);
        this.$items  = this.$active.parent().children();

        return this.$items.index(this.$active);
    };

    Carousel.prototype.to = function (pos) {
        var that        = this;
        var activeIndex = this.getActiveIndex();

        if (pos > (this.$items.length - 1) || pos < 0) return;

        if (this.sliding)       return this.$element.one(slidEvent, function () { that.to(pos) });
        if (activeIndex == pos) return this.pause().cycle();

        return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]));
    };

    Carousel.prototype.pause = function (e) {
        e || (this.paused = true);

        if (this.$element.find('.js-next, .js-prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end);
            this.cycle(true)
        }

        this.interval = clearInterval(this.interval);

        return this
    };

    Carousel.prototype.next = function () {
        if (this.sliding) return;
        return this.slide('next')
    };

    Carousel.prototype.prev = function () {
        if (this.sliding) return;
        return this.slide('prev')
    };

    Carousel.prototype.slide = function (type, next) {
        var $active   = this.$element.find('.ui-carousel-item.'+ activeClass);
        var $next     = next || $active[type]();
        var direction = type == 'next' ? 'left' : 'right';
        var fallback  = type == 'next' ? 'first' : 'last';
        var that      = this;

        if (!$next.length) {
            if (!this.options.wrap) return;
            $next = this.$element.find('.ui-carousel-item')[fallback]()
        }

        if ($next.hasClass(activeClass)) return this.sliding = false;

        var e = $.Event(slidEvent, { relatedTarget: $next[0], direction: direction });
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;

        this.sliding = true;
        this.pause();

        if (this.$indicators.length) {
            this.$indicators.find('.'+ activeClass).removeClass(activeClass);
            this.$element.one(slidEvent, function () {
                var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()]);
                $nextIndicator && $nextIndicator.addClass(activeClass)
            })
        }

        if ($.support.transition && this.$element.hasClass('js-slide') && !this.swiping) {
            // js related class
            var directionClass = 'js-' + direction;
            var typeClass = 'js-' + type;
            $next.addClass(typeClass);
            $next[0].offsetWidth; // force reflow
            $active.addClass(directionClass);
            $next.addClass(directionClass);
            $active
                .one($.support.transition.end, function () {
                    $next.removeClass([typeClass, directionClass].join(' ')).addClass(activeClass);
                    $active.removeClass([activeClass, directionClass].join(' '));
                    that.sliding = false;
                    setTimeout(function () { that.$element.trigger(slidEvent) }, 0)
                })
                .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
        } else {
            $active.removeClass(activeClass);
            $next.addClass(activeClass);
            this.sliding = false;
            this.$element.trigger(slidEvent);
        }

        this.cycle();

        // reset swipe refs
        this.$center  = $next;
        var $item = (function(){
            var $item = $next[type]();
            if (!$item.length) {
                if (!that.options.wrap) return;
                $item = that.$element.find('.ui-carousel-item')[fallback]()
            }
            return $item;
        })();

        this.$left  = type == 'next'? $active: $item;
        this.$right = type == 'next'? $item: $active;

        return this
    }

    Carousel.prototype.swipeable = function(){
        // init swipe refs
        // TODO when not start from first item
        var $active   = this.$element.find('.ui-carousel-item.'+ activeClass);
        this.$center  = $active;
        this.$left  = this.$element.find('.ui-carousel-item').last();
        this.$right  = $active.next();

        var offset = 0,
            width = window.innerWidth,
            pressed = false,
            timeConstant = 125,
            xform= 'webkitTransform';

        var reference,
            amplitude,
            target,
            velocity,
            frame,
            timestamp,
            ticker;

        var slide = false;
        var type = ''; // next or prev
        var that = this;

        this.$element.on('touchstart', function touchstart(e) {

            if(!that.sliding){
                pressed = true;
                reference = xpos(e);

                velocity = amplitude = 0;
                frame = offset;
                timestamp = Date.now();
                clearInterval(ticker);
                ticker = setInterval(track, 100);

                that.pause();
                that.$left.addClass('js-show');
                that.$right.addClass('js-show');
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        this.$element.on('touchmove', function touchmove(e) {
            var x, delta;
            if (pressed) {
                x = xpos(e);
                delta = reference - x;
                if (delta > 2 || delta < -2) {
                    reference = x;
                    scroll(offset + delta);
                }
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        this.$element.on('touchend', function touchend(e) {

            if(!that.sliding){
                pressed = false;

                clearInterval(ticker);
                target = offset;
                if (velocity > 10 || velocity < -10) {
                    amplitude = 1.2 * velocity;
                    target = offset + amplitude;
                }
                target = Math.round(target / width) * width;
                target = (target < -width) ? -width : (target > width) ? width : target;
                amplitude = target - offset;
                timestamp = Date.now();

                that.swiping = true;
                slide = target !== 0;
                type = offset > 0? 'next': 'prev';
                autoScroll();
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        function xpos(e) {
            // touch event
            if (e.targetTouches && (e.targetTouches.length >= 1)) {
                return e.targetTouches[0].clientX;
            }

            // mouse event
            return e.clientX;
        }

        function track() {
            var now, elapsed, delta, v;

            now = Date.now();
            elapsed = now - timestamp;
            timestamp = now;
            delta = offset - frame;
            frame = offset;

            v = 800 * delta / (1 + elapsed);
            velocity = 0.8 * v + 0.2 * velocity;
        }

        function scroll(x) {
            offset = x;
            x = -Math.round(x);
            if(Math.abs(x) > width){
                x = x < 0? -width: width;
            }

            that.$left[0].style[xform] = 'translate3d(' + (x - width) + 'px, 0, 0)';
            that.$center[0].style[xform] = 'translate3d(' + x + 'px, 0, 0)';
            that.$right[0].style[xform] = 'translate3d(' + (x + width) + 'px, 0, 0)';
        }

        function autoScroll() {
            var elapsed, delta;

            if (amplitude) {
                elapsed = Date.now() - timestamp;
                delta = amplitude * Math.exp(-elapsed / timeConstant);
                if (delta > 10 || delta < -10) {
                    scroll(target - delta);
                    return requestAnimationFrame(autoScroll);
                } else {
                    scroll(0);
                    that.cycle();

                    [that.$left, that.$right].forEach(function($el){
                        $el[0].style[xform] = 'translate3d(0, 0, 0)';
                        $el.removeClass('js-show');
                    })

                    if(slide) that.slide(type);
                    that.swiping = false;
                }
            }
        }

    };

    $.Carousel = Carousel;

    $.fn.carousel = function (option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('carousel');
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option);
            var action  = typeof option == 'string' ? option : options.slide;

            if (!data) $this.data('carousel', (data = new Carousel(this, options)));
            if (typeof option == 'number') data.to(option);
            else if (action) data[action]();
            else if (options.interval) data.pause().cycle()
        })
    }

});
