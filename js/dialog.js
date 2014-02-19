define(['./os', './event', './data', './touch', './transition', './fixed'], function(){

    var os = $.os;
    var showClass = 'js-show';
    // why event without namespace? Zepto do not support trigger custom event with namespace like foo.bar .
    var showEvent = 'show:dialog';
    var shownEvent = 'shown:dialog';
    var hideEvent = 'hide:dialog';
    var hiddenEvent = 'hidden:dialog';

    var tapEvent = 'tap';
    // Why not use tap event? We know click event has a 300+ delay, on iOS 5- this will trigger click event on backdrop.
    if(os.ios < 5){
        tapEvent = "click";
    }

    var dismissDialogEventName = tapEvent + '.dismiss.dialog';

    function Dialog(element, options) {
        this.options   = options;
        this.$element  = $(element);
        this.$backdrop =
        this.isShown   = null
    }

    Dialog.DEFAULTS = {
        backdrop: true,
        show: true,
        expires: 0
    };

    Dialog.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    };

    Dialog.prototype.show = function (_relatedTarget) {
        var that = this;
        var e    = $.Event(showEvent, { relatedTarget: _relatedTarget });

        this.$element.trigger(e);

        if (this.isShown || e.isDefaultPrevented()) return;

        this.isShown = true;

        // killing the scroll on body
        $(document).on('touchmove.dialog', function(e){
            return e.preventDefault();
        })

        this.$element.on( dismissDialogEventName, '[data-dismiss="dialog"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.options.effect

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body); // don't move dialogs dom position
            }

            that.$element.show();

            if (transition) {
                $(document.documentElement).addClass('js-effect-' + that.options.effect);
                that.$element[0].offsetWidth; // force reflow
            }

            that.$element
                .addClass(showClass)
                .attr('aria-hidden', false);

            var e = $.Event(shownEvent, { relatedTarget: _relatedTarget });

            transition ?
                that.$element.find('.js-dialog-content')
                    // wait for dialog to slide in
                    .one($.support.transition.end, function () {
                        that.$element.focus().trigger(e)
                    })
                    .emulateTransitionEnd(300) :
                that.$element.focus().trigger(e)
        })

        // auto expires
        if(Number(that.options.expires) > 0){
            setTimeout($.proxy(that.hide, that), that.options.expires);
        }
    }

    Dialog.prototype.hide = function (e) {
        if (e && e.preventDefault) e.preventDefault();

        e = $.Event(hideEvent);

        this.$element.trigger(e);

        if (!this.isShown || e.isDefaultPrevented()) return;

        this.isShown = false;

        $(document).off('touchmove.dialog');

        this.$element
            .removeClass(showClass)
            .attr('aria-hidden', true)
            .off(dismissDialogEventName);

        $.support.transition && (this.options.effect) ?
            this.$element
                .one($.support.transition.end, $.proxy(this.hideDialog, this))
                .emulateTransitionEnd(300) :
            this.hideDialog()
    };

    Dialog.prototype.hideDialog = function () {
        var that = this;
        this.$element.hide();
        this.backdrop(function () {
            that.removeBackdrop();
            $(document.documentElement).removeClass('js-effect-' + that.options.effect);
            that.$element.trigger(hiddenEvent)
        })
    };

    Dialog.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null
    };

    Dialog.prototype.backdrop = function (callback) {
        var animate = this.options.effect ? 'js-effect-fade' : '';

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;

            this.$backdrop = $('<div class="js-backdrop ' + animate + '" />')
                .appendTo(this.$element.parent())
                .emulateFixed();

            this.$element.on(dismissDialogEventName, $.proxy(function (e) {
                if (e.target !== e.currentTarget) return;
                this.options.backdrop == 'static'
                    ? this.$element[0].focus.call(this.$element[0])
                    : this.hide.call(this)
            }, this));

            if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

            this.$backdrop.addClass(showClass);

            if (!callback) return;

            doAnimate ?
                this.$backdrop
                    .one($.support.transition.end, callback)
                    .emulateTransitionEnd(150) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass(showClass);

            $.support.transition && this.options.effect ?
                this.$backdrop
                    .one($.support.transition.end, callback)
                    .emulateTransitionEnd(150) :
                callback()

        } else if (callback) {
            callback()
        }
    };

    $.Dialog = Dialog;

    $.fn.dialog = function (option, _relatedTarget) {
        return this.each(function () {
            var $this   = $(this).emulateFixed();

            var data    = $this.data('dialog');
            var options = $.extend({}, Dialog.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) data = new Dialog(this, options);
            if (options.cache) $this.data('dialog', data);
            if (typeof option == 'string') data[option](_relatedTarget);
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $(document).on(tapEvent + '.dialog.data-api', '[data-toggle="dialog"]', function (e) {

        var $this   = $(this);
        var $target = $($this.attr('data-target'));
        var option  = $target.data('dialog') ? 'toggle' : $.extend({}, $target.data(), $this.data());

        if ($this.is('a')) e.preventDefault();

        $target.dialog(option, this)
    })

});
