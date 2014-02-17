define(['./event', './data', './touch'], function(){

    var activeClass = 'js-active';
    var showEvent = 'show:tab';
    var shownEvent = 'shown:tab';

    function Tab(element) {
        this.element = $(element)
    }

    Tab.prototype.show = function () {
        var $this    = this.element;
        if ($this.hasClass(activeClass)) return;

        var $parent  = $this.parent();
        var selector = $this.data('target');
        var previous = $parent.find('.' + activeClass)[0];
        var e        = $.Event(showEvent, {
            relatedTarget: previous
        });

        $this.trigger(e);

        if (e.isDefaultPrevented()) return;

        var $target = $(selector);

        this.activate($this, $parent);
        this.activate($target, $target.parent(), function () {
            $this.trigger({
                type: shownEvent,
                relatedTarget: previous
            })
        })
    };

    Tab.prototype.activate = function ($element, $container, callback) {
        // Why use helper class? js-active class is also used in inner container.
        var helperClass = 'zepto-tab-' + Date.now();
        $container.addClass(helperClass);
        var $active  = $('.' + helperClass + '>.'+ activeClass, $container);
        $container.removeClass(helperClass);
        $active.removeClass(activeClass);
        $element.addClass(activeClass);
        callback && callback()
    };

    $.Tab = Tab;

    $.fn.tab = function ( option ) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('tab');

            if (!data) $this.data('tab', (data = new Tab(this)));
            if (typeof option == 'string') data[option]()
        })
    };

    $(document).on('tap.tab.data-api', '[data-toggle="tab"]', function (e) {
        e.preventDefault();
        $(this).tab('show');
    })
});
