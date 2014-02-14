define(['./event', './data', './requestAnimationFrame'], function () {

    var getTime = Date.now;

    function pos(e) {
        // touch event
        var touches = e.targetTouches;
        if (touches && (touches.length >= 1)) {
            return {
                x: touches[0].clientX,
                y: touches[0].clientY
            };
        }
    }

    function Deleter(element, options){
        this.$element = $(element);
        this.options = options;
        // 0 is init state
        // 1 is tap state
        // 2 is snap left
        // 3 is snap right
        this._state = 0;
        this._pre = {};  // pre position
        this._opened = false;
        this._offset = 0;
    }

    Deleter.DEFAULTS = {
        init: true,
        // left/right snap value
        left: 60, //px
        right: 0,
        timeConstant: 125 // ms
    };

    Deleter.prototype.init = function(){
        this.$element.on('touchstart', $.proxy(this.start, this));
        this.$element.on('touchmove',  $.proxy(this.move, this));
        this.$element.on('touchend', $.proxy(this.end, this));
        this.autoTranslate = $.proxy(this.autoTranslate, this);
    };

    Deleter.prototype.translate = function (x) {
        var move = -Math.round(x);
        if(move <= -this.options.right) this.$element.css('-webkit-transform', 'translate3d(' + move + 'px, 0, 0)');
        // make the latest offset value
        this._offset = x;
    };

    Deleter.prototype.track = function () {
        var now = getTime();
        var elapsed = now - this._timestamp;
        this._timestamp = now;

        var delta = this._offset - this._frame;
        this._frame = this._offset;

        var v = 1000 * delta / (1 + elapsed);
        this._speed = 0.8 * v + 0.2 * this._speed;
    };

    Deleter.prototype.autoTranslate = function () {

        var amplitude = this._amplitude;
        var target = this._target;
        var options = this.options;
        var left = options.left;
        var right = options.right;
        var timeConstant = options.timeConstant;

        var elapsed, delta;

        if (amplitude) {
            elapsed = getTime() - this._timestamp;
            delta = amplitude * Math.exp(-elapsed / timeConstant);

            var x = target - delta;
            // target stop range
            if (delta > 4 || delta < -4) {
                this.translate(target - delta);
                requestAnimationFrame(this.autoTranslate);
            }else{
                // translate to ending position
                x = Math.round(x) - 5;
                this._opened = x <= left && x > right;
                this.translate(this._opened? left: right);
            }
        }
    };

    Deleter.prototype.start = function (e) {

        this._state = 1;
        this._pre = pos(e);
        this._speed = this._amplitude = 0;
        this._frame = this._offset;
        this._timestamp = getTime();

        clearInterval(this._ticker);
        this._ticker = setInterval(this.track, 100);
    };

    Deleter.prototype.move = function (e) {

        if (this._state >= 1) {

            var cur = pos(e);
            var pre = this._pre;
            var deltaX = pre.x - cur.x;
            var deltaY = pre.y - cur.y;

            if ( (deltaX > 10 || deltaX < -10) && deltaY < 10 && deltaY > -10 ) {

                if(!this._opened && deltaX < -10){
                    this._state = 0;
                    return;
                }
                // update pre position
                this._pre = cur;
                // update state
                this._state = deltaX > 0? 2: 3;
                // translate element
                this.translate(this._offset + deltaX);

                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    };

    Deleter.prototype.end = function (e) {
        clearInterval(this._ticker);
        var state = this._state;

        if(state > 0){

            var offset = this._offset;
            var speed = this._speed;
            var amplitude = this._amplitude;
            var target = offset;

            // compute target value
            if (speed > 10 || speed < -10) {
                amplitude = 1.2 * speed;
                target = offset + amplitude;
            }

            var snap = this.options.left;
            // tap or snap right
            if(this._opened && (state == 1 || state == 3)){
                snap = this.options.right;
            }
            // snap value could be 0
            target = snap? (Math.round(target / snap) * snap) : 0;
            target = (target < -snap) ? -snap : (target > snap) ? snap : target;
            
            this._amplitude = target - offset;
            this._target = target;
            this._timestamp = getTime();

            requestAnimationFrame(this.autoTranslate);
        }

        // reset state
        this._state = 0;
    };

    $.Deleter = Deleter;

    $.fn.deletable = function(option){

        return this.each(function(){

            var $this   = $(this);
            var data    = $this.data('deleter');
            var options = $.extend({}, Deleter.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) {
                data = new Deleter(this, options)
                $this.data('deleter', data)
            }

            if (typeof option == 'string') data[option]()
            else if (options.init) data.init()

        })
    }

});
