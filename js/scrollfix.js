/**
 * ScrollFix v0.1
 * http://www.joelambert.co.uk
 *
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

// https://developers.google.com/mobile/articles/webapp_fixed_ui
// https://github.com/filamentgroup/Overthrow/
// http://bradfrostweb.com/blog/mobile/fixed-position/

define(['./os'], function(){

    var os = $.os;
    function scrollFix(borderHeight) {

        var container = document.querySelector('.ui-page');
        var content = container.querySelector('.js-page-content');

        if(!content || !container) return;

        // Variables to track inputs
        var startY, startTopScroll;

        // Handle the start of interactions
        container.addEventListener('touchstart', function(event){
            startY = event.touches[0].pageY;
            startTopScroll = container.scrollTop;

            if(startTopScroll <= 0)
                container.scrollTop = 1;

            if(startTopScroll + container.offsetHeight >= container.scrollHeight)
                container.scrollTop = container.scrollHeight - container.offsetHeight - 1;
        }, false);

        document.addEventListener('touchmove', function(event) {
            if( content.clientHeight + borderHeight < container.clientHeight ||
                content.clientWidth < container.clientWidth){
                // your element have overflow
                return event.preventDefault();
            }

            var curElement = event.target;
            do{
                var curElementClassName = curElement.className;
                if(curElementClassName.indexOf('js-no-bounce') != -1 ){
                    event.preventDefault();
                    break;
                }
                curElement = curElement.parentNode;
            }while(curElement && curElement !== document);
        }, false);
    }

    // Add ScrollFix only with iOS
    if(os.ios >= 5 ) {
        // TODO: remove hard code
        scrollFix(50*2);
    }else{
        var html = document.documentElement;
        html.className = html.className + ' ' + 'js-no-overflow-scrolling';
    }

})
