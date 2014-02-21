// https://developers.google.com/mobile/articles/webapp_fixed_ui
// https://github.com/filamentgroup/Overthrow/
// http://bradfrostweb.com/blog/mobile/fixed-position/

define(['./os', './event'], function(){

    var os = $.os;
    function scrollFix() {

        $('.js-no-bounce').on('touchmove', function(event){
            event.preventDefault();
        });

        var $page = $('.ui-page');
        var $content = $('.ui-page-content', $page);
        if(!$content[0] || !$page[0]) return;

        // Variables to track inputs
        var startTopScroll;

        // Handle the start of interactions
        $(document).on('touchstart', '.ui-page', function(event){
            var page = event.currentTarget;
            startTopScroll = page.scrollTop;

            if(startTopScroll <= 0)
                page.scrollTop = 1;

            if(startTopScroll + page.offsetHeight >= page.scrollHeight)
                page.scrollTop = page.scrollHeight - page.offsetHeight - 1;

        }).on('touchmove', '.ui-page', function(event){
                var page = event.currentTarget;
                // TODO cache element select
                var content = page.querySelector('.ui-page-content');
                // Offset value have include content and border
                if( content.offsetHeight < page.clientHeight ||
                    content.offsetWidth < page.clientWidth){
                    // your element have overflow
                    return event.preventDefault();
                }
            })
    }

    // Add ScrollFix only for iOS
    if(os.ios >= 5 ) {
        scrollFix();
    }else{
        var html = document.documentElement;
        html.className = html.className + ' ' + 'js-no-overflow-scrolling';
    }
});
