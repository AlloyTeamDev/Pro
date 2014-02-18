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
                container: $('#page5-container')
            });
        }

        target.inited = true;

    });

});
