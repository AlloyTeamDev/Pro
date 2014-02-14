define(['./event', './data'], function(){

    var animations = {}; /* Cache animation rules */
    var prefix = '-webkit-';
    var ratio = window.devicePixelRatio || 1;
    /**
     * Insert a new stylesheet to hold the @keyframe rules.
     */
    var sheet = (function() {
        var $el = $('<style />', {type : 'text/css'});
        $('head').append($el);
        return $el[0].sheet;
    }());

    /**
     * Creates an opacity keyframe animation rule and returns its name.
     * Since most mobile Webkits have timing issues with animation-delay,
     * we create separate rules for each line/segment.
     */
    function addSpinnerAnimation(lines) {

        var identifier = ['spinner', lines].join('-');
        var percentage;
        var rotate;

        if (!animations[identifier]) {

            var rules = [];
            for (var i=0; i < lines; i++) {
                percentage = i/lines * 100;
                rotate = i/lines * 360;
                if( i == 0 ){
                    rules.push('@' + prefix + 'keyframes ' + identifier + '{');
                }
                rules.push( percentage+'% {' + prefix + 'transform:rotate('+ rotate +'deg)}');
                if( i == lines-1 ){
                    rules.push('}')
                }
            }

            sheet.insertRule(rules.join('\n'), sheet.cssRules.length);
            // flag
            animations[identifier] = 1
        }

        return identifier
    }

    function Spinner(element, options){
        this.$element  = $(element);
        this.options = options
    }

    Spinner.DEFAULTS = {
        show: true,
        sqr: 30,               // The width/ height of the spinner
        duration: 1.6,        // Seconds per round
        lines: 12,            // The number of lines to draw
        color : '158,158,158',      // Must be an RGB string
        offset : {
            inner : 6,   // The inner offset of the spinner in px
            outer : 9    // The outer offset of the spinner in px
        },
        width : 2,         // The the width of each lines in px
        className: 'js-spinner', // CSS class to assign to the element
        wrapper: {
            top: '50%',          // center vertically
            left: '50%',         // center horizontally
            position: 'absolute',  // element position
            'z-index': 2e9,     // Use a high z-index by default,
//            width: '170px',
//            height: '120px',
//            background: 'rgba(0, 0, 0, 0.5)',
//            'text-align': 'center',
//            'vertical-align': 'middle',
//            'border-radius': '5px'
        }
    };

    Spinner.prototype.toggle = function () {
        return this[!this.isShown ? 'show' : 'hide']()
    };

    Spinner.prototype.show = function(){
        var e  = $.Event('show.spinner');
        this.$element.trigger(e);
        if (this.isShown || e.isDefaultPrevented()) return
        this.isShown = true

        if(!this.$wrap){
            this.draw()
        }

        this.$wrap.show();
    };

    Spinner.prototype.hide = function(){
        var e = $.Event('hide.spinner')
        this.$element.trigger(e)
        if (!this.isShown || e.isDefaultPrevented()) return
        this.isShown = false

        if(this.$wrap){
            this.$wrap.hide();
        }
    };

    Spinner.prototype.draw = function(){
        var options = this.options;
        var $element = this.$element;

        var lines  = options.lines;
        var ctx;

        var $wrap = $('<div class="'+ options.className +'" />');
        this.$wrap = $wrap;

        if(!options.sqr){
            var width = $element.width();
            var height = $element.height();
            options.sqr = Math.round(width >= height ? height : width);
        }

        var sqr = options.sqr * ratio;
        var hsqr = sqr/2; // 15
        var innerOffset = options.offset.inner * ratio || hsqr * (1/3) ;
        var outerOffset = options.offset.outer * ratio || hsqr * (2/3) ;
        var lineWidth = options.width * ratio;

        // css
        options.wrapper[prefix + 'transform'] = 'translate3d(-50%, -50%, 0) scale(' + 1/ratio + ')';
        $wrap.css(options.wrapper);

        var $canvas = $('<canvas />').attr({ 'width' : sqr, 'height' : sqr });

        if ( $canvas[0].getContext ){
            ctx = $canvas[0].getContext('2d');
            ctx.translate(hsqr, hsqr);
            ctx.lineWidth = lineWidth || Math.ceil(sqr * 0.025);
            ctx.lineCap = 'round';
        }

        ctx.clearRect(hsqr * -1, hsqr * -1, sqr, sqr);
        for (var i = 0; i < lines; i++) {
            ctx.rotate(Math.PI * 2 / lines);
            // The smallest opacity is 1/4
            ctx.strokeStyle = 'rgba(' + options.color + ','+ ( i < (1/4 * lines) ? 1/4: i/lines )  +')';
            ctx.beginPath();
            ctx.moveTo(0, innerOffset);
            ctx.lineTo(0, outerOffset);
            ctx.stroke();
        }

        var styles = {};
        styles[prefix + 'animation'] = addSpinnerAnimation(lines) + ' ' + options.duration + 's step-start infinite';
        $canvas.css(styles);

        // DOM append
        $wrap.append($canvas)
            .appendTo($element);
    };

    $.Spinner = Spinner;

    $.fn.spinner = function(option) {

        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('spinner');
            var options = $.extend({}, Spinner.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) {
                data = new Spinner(this, options);
                $this.data('spinner', data)
            }
            if (typeof option == 'string') data[option]();
            else if (options.show) data.show()
        })
    };

});
