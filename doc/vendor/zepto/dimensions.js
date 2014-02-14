define(['../../../js/pro'], function () {
    var ioDim = function(dimension, includeBorder) {
        return function (includeMargin) {
            var sides, size, elem;
            if (this) {
                elem = this;
                size = elem[dimension]();
                sides = {
                    width: ["left", "right"],
                    height: ["top", "bottom"]
                };
                sides[dimension].forEach(function(side) {
                    size += parseInt(elem.css("padding-" + side), 10);
                    if (includeBorder) {
                        size += parseInt(elem.css("border-" + side + "-width"), 10);
                    }
                    if (includeMargin) {
                        size += parseInt(elem.css("margin-" + side), 10);
                    }
                });
                return size;
            } else {
                return null;
            }
        }
    };
    ["width", "height"].forEach(function(dimension) {
        var Dimension = dimension.substr(0,1).toUpperCase() + dimension.substr(1);
        $.fn["inner" + Dimension] = ioDim(dimension, false);
        $.fn["outer" + Dimension] = ioDim(dimension, true);
    });
});