exports.run = function(){
    exports.files.forEach(function(file){
        var origin = exports.file.read(file);
        var amdify = '';
        if(file.indexOf('zepto') != -1){
            amdify = "define(function(){\n" + origin + "\n});\n";
        }else{
            amdify = "define(['./zepto'], function(){\n" + origin + "\n});\n";
        }

        exports.log(file);
        exports.file.write(file, amdify);
    })
};