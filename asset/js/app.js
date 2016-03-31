App = {}

App.run = function() {

    var EMPTY = new String('');
    var DOT = new String('.');
    var PX = new String('px');
    var IMG = new String('img');

    var ZERO = 0; //new Number(0);
    var GRAYS = 256;

    var R = 0.2126;
    var G = 0.7152;
    var B = 0.0722;
    var brightness = App.brightness;

    var THRESHOLD = new Array();
    for (var i = 0; i < GRAYS; i++) {
        THRESHOLD.push(i < (GRAYS >> 1) ? [0] : [GRAYS - 1]);
    }

    self.grayscale = function(image) {
        var RADIX = 10;
        var graypoint;
        image.gray = new Array(image.width * image.height);
        for (var i = 0; i < image.gray.length; i++) {
            // Luminosity:
            graypoint = parseInt(
                (R * image.data[i << 2]) +
                (G * image.data[(i << 2) + 1]) +
                (B * image.data[(i << 2) + 2]) +
                brightness, RADIX
            );
            image.gray[i] = graypoint > 255 ? 255 : graypoint
        }
    }

    self.contrast = function(data) {
        var amount = App.contrast;
        var pixels = data.data;
        for (var i = 0; i < pixels.length; i += 4) { //loop through all data
            /*
            pixels[i] is the red component
            pixels[i+1] is the green component
            pixels[i+2] is the blue component
            pixels[i+3] is the alpha component
            */
            var brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3; //get the brightness

            // pixels[i] += brightness > 127 ? amount : -amount;
            // pixels[i+1] += brightness > 127 ? amount : -amount;
            // pixels[i+2] += brightness > 127 ? amount : -amount;

            pixels[i] = ((((pixels[i] / 255) - 0.5) * amount) + 0.5) * 255;
            pixels[i + 1] = ((((pixels[i + 1] / 255) - 0.5) * amount) + 0.5) * 255;
            pixels[i + 2] = ((((pixels[i + 2] / 255) - 0.5) * amount) + 0.5) * 255;
        }
        data.data = pixels;
    }

    self.spread = function(image) {
        var p;
        for (var i = 0; i < image.data.length; i += 4) {
            p = image.gray[i >> 2];
            image.data[i] = p;
            image.data[i + 1] = p;
            image.data[i + 2] = p;
            // image.data[i + 3] = 0;
            // Skipping alpha channel.
        }
    }

    self.atkinson_alg = function(data, height, width) {
        for (var y = 0; y < data.height; y++) {
            for (var x = 0; x < data.width; x++) {
                var i = (y * data.width) + x;
                gray_old = data.gray[i];
                gray_new = THRESHOLD[gray_old];
                gray_err = (gray_old - gray_new) >> 3;
                data.gray[i] = gray_new;
                var NEAR = [
                    [x + 1, y],
                    [x + 2, y],
                    [x - 1, y + 1],
                    [x, y + 1],
                    [x + 1, y + 1],
                    [x, y + 2]
                ];
                var near_x = 0;
                var near_y = 0;
                for (var n = 0; n < NEAR.length; n++) {
                    near_x = NEAR[n][0];
                    near_y = NEAR[n][1];
                    if (near_x >= 0) {
                        if (near_x <= width) {
                            if (near_y >= 0) {
                                if (near_y <= height) {
                                    data.gray[
                                        ((near_y * data.width) + near_x)
                                    ] += gray_err;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    self.main = function(el) {

        var width = el.offsetWidth;
        var height = el.offsetHeight;

        var canvBlock = $('#canvas')[0];
        canvBlock.width = width;
        canvBlock.height = height + 100;
        var ctx = canvBlock.getContext('2d');
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, canvBlock.height);
        ctx.drawImage(el, ZERO, ZERO, width, height);
        var data = ctx.getImageData(ZERO, ZERO, width, height);
        self.contrast(data);
        self.grayscale(data);
        self.atkinson_alg(data, height, width);
        self.spread(data);

        ctx.putImageData(data, ZERO, ZERO);
    }
    var sourceImg = $('.source')[0];
    self.main(sourceImg);
};

window.onload = function(e) {
    App.brightness = localStorage.brightness || 0;
    App.contrast = localStorage.contrast || 0.8;
    App.run();
}
