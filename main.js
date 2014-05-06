$(document).ready(function () {
    var fills = ["FFFFFF", "000000"]; 
    var epsilon = 0.01;
    var minRe = -4;
    var maxRe = 4;
    var minIm = -4;
    var maxIm = 4;
    function reset() {
        minRe = -4;
        maxRe = 4;
        minIm = -4;
        maxIm = 4;
        $('#scale').text(2);
        main({"offsetX" : $('#mainCanvas').width()/2, "offsetY" : $('#mainCanvas').height()/2});
    }
    reset();
    
    function main(event) {
        var mainCanvas = document.getElementById("mainCanvas");
        var totalIterations = parseInt($('#totalIterations').val());

        function placePixel(ctx, x, y, hexColor) {
            ctx.fillStyle = hexColor;
            ctx.fillRect( x, y, 1, 1 );
        }

        function getFill(worldC_x1, worldC_y1) {
            function _getFill(iterations) {
                switch($('#colorScheme').val()) {
                    case 'Zebra': 
                        var color = 255*(iterations % 2);
                        var hex = (color).toString(16);
                        return hex + hex + hex; break;
                    case 'Levels': 
                        var color = totalIterations != 0 ? 255*Math.log(1+iterations)/Math.log(totalIterations) : 0;
                        var hex = (Math.ceil(color)).toString(16);
                        return hex + hex + hex;
                    case 'Default': return iterations <= totalIterations ? fills[0] : fills[1];
                }
            }
            //init
            var C_x = worldC_x1;
            var C_y = worldC_y1;
            var x = 0;
            var y = 0;
            for (var i = 0; i < totalIterations; i++) {
                var next_x = x*x-y*y + C_x;
                var next_y = 2*x*y + C_y;
                if (Math.abs(next_x*next_x + next_y*next_y) > 4)
                    return _getFill(i);
                x = next_x;
                y = next_y;
            }
            return "000000";
        }

        function clearCanvas(context, canvas) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            var w = canvas.width;
            canvas.width = 1;
            canvas.width = w;
        }
        var scale = parseInt($('#scale').text());
        maxRe /= scale; maxIm /= scale; minIm /= scale; minRe /= scale;

        var scRe = (maxRe-minRe)/mainCanvas.height;
        var scIm = (maxIm-minIm)/mainCanvas.width;
        var x1 = scRe*(event.offsetX - mainCanvas.width/2);
        var y1 = scIm*(event.offsetY - mainCanvas.height/2);
        maxRe += x1; minRe += x1; maxIm += y1; minIm += y1; 
        
        var ctx = mainCanvas.getContext('2d');
        clearCanvas(ctx, mainCanvas);
        for (var x = 0; x < mainCanvas.width; x++) {
            for (var y = 0; y < mainCanvas.height; y++) {
                var worldC_x = minRe + x*scRe;
                var worldC_y = minIm + y*scIm;
                var color = getFill(worldC_x, worldC_y);
                placePixel(ctx, x, y, color);
            }
        }
        $('#scale').text(scale + 1);
    }
    $('#mainCanvas').click(main);
    $('#reset').click(reset);
});