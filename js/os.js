define(['./zepto'], function(){
    var ua = navigator.userAgent.toLowerCase();
    function platform (os){
        var ver = ('' + (new RegExp(os + '(\\d+((\\.|_)\\d+)*)').exec(ua) || [,0])[1]).replace(/_/g, '.');
        // undefined < 3 === false, but null < 3 === true
        return parseFloat(ver) || undefined;
    }

    $.os = {
        // iPad UA contains 'cpu os', and iPod/iPhone UA contains 'iphone os'
        ios: platform('os '),
        // WTF? ZTE UserAgent: ZTEU880E_TD/1.0 Linux/2.6.35 Android/2.3 Release/12.15.2011 Browser/AppleWebKit533.1 FlyFlow/2.4 baidubrowser/042_1.8.4.2_dio
        android: platform('android[/ ]')
    };
});
