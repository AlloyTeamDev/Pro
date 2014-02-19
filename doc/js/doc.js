require([
    '../vendor/zepto/dimensions'
], function(){

    var windowWidth;
    var windowHeight;
    var pageHeight;
    var contentPadding;
    var footerHeight;
    var noticeBanner;
    var componentsList;
    var navComponentLinks;
    var contentSection;
    var currentActive;
    var topCache;
    var eventListeners;

    var $doc = $(document);
    var $win = $(window);
    var $body = $(document.body);
    var $iphone = $('.iphone');

    (function main(){
        prettyPrintExample();

        $win.on('ready resize', initialize);

        // TODO FingerBlast会导致checkbox无法点击
        $win.on('ready', function () {
            new FingerBlast('.iphone-content');
        });

        // Spinner
        $doc.on('tap', '[data-toggle="spinner"]', function () {
            var $this = $('.ui-app');
            $this.spinner('toggle')
        });

    })();

    function prettyPrintExample(){
        var componentExample  = $('.component-example');

        componentExample.each(function(index, node){
            var $node = $(node);
            var preStart = '<pre class="prettyprint">';
            var preEnd = '</pre>';
            var preContent = $node.html().replace(/&/g, '&amp;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").trim();
            $node.after( preStart + preContent +  preEnd);
        });

        prettyPrint();
    }

    function initialize() {
        currentActive        = 0;
        topCache             = [];
        noticeBanner         = $('.notice-banner');
        navComponentLinks    = $('.nav-components-link');
        componentsList       = $('.components-list');
        contentSection       = $('.component');
        topCache             = contentSection.map(function () { return $(this).offset().top });
        windowHeight         = $(window).height() / 3;
        pageHeight           = $(document).height();
        contentPadding       = parseInt($('.doc-content').css('padding-bottom'));
        footerHeight         = $('.doc-footer').outerHeight(false);

        $iphone.initialLeft   = $iphone.offset().left;
        $iphone.initialTop    = $iphone.initialTop || $iphone.offset().top;
        $iphone.dockingOffset = ($(window).height() + 20 + $('.doc-masthead').height() - $iphone.height())/2;

        checkDesktopContent();
        calculateScroll();

        if (!eventListeners) addEventListeners();
    }

    function addEventListeners() {
        eventListeners = true;

        noticeBanner.on('click', function () {
            $(this).hide();
        });

        // TODO 会导致checkbox无法点击
        $iphone.on('click', function (e) {
           e.preventDefault();
        });

        navComponentLinks.click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            // componentsList.toggleClass('active');
            componentsList.removeClass('active');
            $(e.target.parentNode.children[1]).toggleClass('active');
        });

        $doc.on('click', function () {
            componentsList.removeClass('active');
        });

        $win.on('scroll', calculateScroll);

    }

    function checkDesktopContent() {
        windowWidth = $(window).width();
        if (windowWidth <= 768) {
            var content = $('.content');
            if (content.length > 1) {
                $(content[0]).remove()
            }
        }
    }

    function calculateScroll() {
        // if small screen don't worry about this
        if (windowWidth <= 768) return

        // Save scrollTop value
        var contentSectionItem;
        var currentTop = $win.scrollTop();

        // If page is scrolled to bottom near footers
        if(pageHeight - currentTop < footerHeight + contentPadding + 1400) {
            $iphone[0].className = "iphone iphone-bottom";
            $iphone[0].setAttribute('style','')
        } else if(($iphone.initialTop - currentTop) <= $iphone.dockingOffset) {
            $iphone[0].className = "iphone iphone-fixed";
            $iphone.css({top: $iphone.dockingOffset})
        } else {
            $iphone[0].className = "iphone";
            $iphone[0].setAttribute('style','')
        }

        // Injection of components into phone
        for (var l = contentSection.length; l--;) {
            if ((topCache[l] - currentTop) < windowHeight) {
                if (currentActive == l) return;
                currentActive = l;
                $body.find('.component.active').removeClass('active');
                contentSectionItem = $(contentSection[l]);
                contentSectionItem.addClass('active');
                if(contentSectionItem.attr('id')) {
                    $iphone.attr("id", contentSectionItem.attr('id') + "InPhone");
                } else {
                    $iphone.attr("id", "")
                }
                if (!contentSectionItem.hasClass('informational')) {
                    updateContent(contentSectionItem.find('.prettyprint').not('.js').text())
                }
                break
            }
        }

        function updateContent(content) {
            $('#iwindow').html(content);
        }
    }

});
