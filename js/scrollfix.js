// https://developers.google.com/mobile/articles/webapp_fixed_ui
// https://github.com/filamentgroup/Overthrow/
// http://bradfrostweb.com/blog/mobile/fixed-position/

define(['./os', './event'], function(){

    var os = $.os;
    function scrollFix(borderHeight) {

        var $page = $('.ui-page');
        var $content = $('.js-page-content', $page);
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
                var content = page.querySelector('.js-page-content');
                if( content.clientHeight + borderHeight < page.clientHeight ||
                    content.clientWidth < page.clientWidth){
                    // your element have overflow
                    return event.preventDefault();
                }
            })
    }

    // Add ScrollFix only for iOS
    if(os.ios >= 5 ) {
        $('.js-no-bonce').on('touchmove', function(event){
            event.preventDefault();
        });
        // TODO: remove hard code
        scrollFix(50*2);
    }else{
        var html = document.documentElement;
        html.className = html.className + ' ' + 'js-no-overflow-scrolling';
    }
})
