require([
    '../../js/pro'
], function(){

    // CountUp
    $('#countup').countable('start');

    // Spinner
    $('[data-spinner]').each(function () {
        var $this = $(this);
        $this.spinner('show')
    });

    $('#show-body-spinner').on('tap', function(){
        //var $this = $(this);
        //var delay = $this.data('delay') || 6000;

        $('body').spinner('show');
        //setTimeout(function(){
        //    $('body').spinner('hide');
        //}, delay);
    });

    $('#hide-body-spinner').on('tap', function(){
        $('body').spinner('hide');
    });

    function initSearch(){
        var $search = $('#my-search');
        var $input = $('#my-search-input');
        $input.on('focus', function(){
            $search.addClass('js-focus')
        }).on('input', function(){
                if($input[0].value){
                    $search.addClass('js-input')
                }else{
                    $search.removeClass('js-input')
                }
            });

        $('#my-search-reset').on('tap', function(){
            $input[0].value = '';
            $search.removeClass('js-input');
            $input[0].focus();
        });

        $('#my-search-cancel').on('touchstart', function(evt){
            $input[0].value = '';
            $search.removeClass('js-input');
            $search.removeClass('js-focus');

            document.activeElement.blur();
            $input[0].blur();

            evt.stopPropagation();
            evt.preventDefault();
        });
    }

    initSearch();

    // Tab
    $('[data-toggle="tab"]').on('shown:tab', function (e) {

        var target = e.target // activated tab
        var relatedTarget = e.relatedTarget // previous tab

        var tab = target.innerText.trim().toLowerCase();

        if(target.inited) return;

        if(tab == 'counter'){

            $('[data-countable]').each(function () {
                var $this = $(this);
                $this.countable('start')
            });

        }else if(tab == 'spinner'){


        }else if(tab == 'carousel'){

            $('[data-ride="carousel"]').each(function () {
                var $this = $(this);
                $this.carousel($this.data())
            });
        }else if(tab == 'deleter'){

            $('.my-deletable').deletable()

        }else if(tab == 'lazyload'){
            $('[data-lazy]').lazyload({
                container: $.os.ios > 5? $('#page5-container'): window
            });
        }

        target.inited = true;

    });

});
