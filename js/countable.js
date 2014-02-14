define(['./data', './requestAnimationFrame'], function(){

    function Counter(element, options) {

        this.$element = $(element);
        this.options = options;

        this.frameVal = this.from = Number(options.from);
        this.to = Number(options.to);
        this.duration = options.duration;
        this.decimals = Math.max(0, options.decimals);
        this.dec = Math.pow(10, options.decimals);
        this.startTime = null;

        var self = this;

        this.count = function(timestamp) {
            var from = self.from;
            var to = self.to;
            var duration = self.duration;
            var countDown = from > to;

            if (self.startTime === null) self.startTime = timestamp;

            var progress = timestamp - self.startTime;

            // to ease or not to ease
            if (countDown) {
                var i = self.easeOutExpo(progress, 0, from - to, duration);
                self.frameVal = from - i;
            } else {
                self.frameVal = self.easeOutExpo(progress, from, to - from, duration);
            }

            // decimal
            self.frameVal = Math.round(self.frameVal*self.dec)/self.dec;

            // don't go past endVal since progress can exceed duration in the last frame
            if (countDown) {
                self.frameVal = (self.frameVal < to) ? to : self.frameVal;
            } else {
                self.frameVal = (self.frameVal > to) ? to : self.frameVal;
            }

            // format and print value
            var val = self.frameVal.toFixed(self.decimals)
            if(self.options.commas){
                val = self.addCommas(val)
            }
            self.$element.html(val);

            // whether to continue
            if (progress < duration) {
                requestAnimationFrame(self.count);
            } else {
                if (self.onComplete != null) self.onComplete();
            }
        }
    }

    Counter.DEFAULTS = {
        commas: false,
        decimals: 0,  // number of decimal places in number, default 0
        duration: 1000  // duration in ms
    };

    Counter.prototype.start = function(callback) {
        this.onComplete = callback;
        // make sure values are valid
        if (!isNaN(this.to) && !isNaN(this.from)) {
            requestAnimationFrame(this.count);
        } else {
            this.$element.html('--');
            console.log('Error: from or to is not a number');
        }
        return false;
    };

    // Robert Penner's easeOutExpo
    Counter.prototype.easeOutExpo = function(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    };

    Counter.prototype.reset = function(){
        this.$element.html(0);
    };
    
    Counter.prototype.addCommas = function(nStr) {
        nStr += '';
        var x, x1, x2, rgx;
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    };

    $.Counter = Counter;

    $.fn.countable = function (option) {

        return $(this).each(function () {
            var $this   = $(this);
            var data    = $this.data('counter');
            var options = $.extend({}, Counter.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) {
                data = new Counter(this, options);
                $this.data('counter', data)
            }
            if (typeof option == 'string') data[option]();
            else if (options.show) data.show()
        });
    };

});
