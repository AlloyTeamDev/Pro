define(['./os', './event'], function(){

    var os = $.os;
    // Why not use feature detecting? It's performance care and we already know only the iOS 4.3 not support fixed
    $.support.positionFixed = !(os.ios < 5);

    $.fn.emulateFixed = function (options) {
        var $this = $(this);
        if ($this.attr('isFixed') || $.support.positionFixed) return this;

        return this.each(function() {
            var $el = $(this);
            $el.attr('isFixed', true);

            var styles = $.extend($el.css(['top', 'left', 'bottom', 'right']), options || {});
            $.each(styles, function(k, v) {
                styles[k] = parseFloat(v)
            });

            function positionFixed() {
                var properties = {
                    position: 'absolute'
                };

                if(styles.left == 0 && styles.right == 0) {
                    properties.left = 0;
                    properties.width = '100%';
                }else{
                    properties.left = isNaN(styles.right) ? (styles.left || 0): document.body.offsetWidth - $el.width() - styles.right;
                }

                if(styles.top === 0 && styles.bottom === 0) {
                    properties.height = '100%';
                }

                properties.top = window.pageYOffset + ( isNaN(styles.bottom) ? (styles.top || 0): window.innerHeight - $el.height() - styles.bottom );

                $el.css(properties);
            }

            positionFixed();
            // TODO: events debounce
            $(window).on('scroll.fixed', positionFixed);
            $(window).on('resize.fixed', positionFixed);
        })
    };

    // TODO: how to disable emulate fixed
});
