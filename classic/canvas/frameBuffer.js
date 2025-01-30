function frameBuffer(width, height, xOffset, yOffset) {
    this.width = width;
    this.height = height;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.frame = [];

    this.set = function(x, y, pixel) {
        frame[width * (y - 1) + x] = pixel;
    }

    this.get = function(x, y) {
        return frame[width * (y - 1) + x];
    }

    this.isSet = function(x, y) {
        return frame[width * (y - 1) + x] === undefined;
    }

    this.draw = function(context, contextType) {
        var imgData = context.createImageData(width, height);
        for (var i = 0; i < imgData.data.length; i += 4) {
            if (frame.isSet(i % width, Math.floor(i / height))) {
                imgData.data[i + 0] = frame[i / 4].r;
                imgData.data[i + 1] = frame[i / 4].g;
                imgData.data[i + 2] = frame[i / 4].b;
                imgData.data[i + 3] = frame[i / 4].a;
            } else {
                imgData.data[i + 0] = 0;
                imgData.data[i + 1] = 0;
                imgData.data[i + 2] = 0;
                imgData.data[i + 3] = 255;
            }
        }
        context.putImageData(imgData, xOffset, yOffset);
    }

    this.clear = function() {
        frame = [];
    }
}

function pixel() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    var that = this;

    /* Source: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation
     */
    this.setHSL = function(h, s, l) {
        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        r *= 255;
        g *= 255;
        b *= 255;
        a = 255;
    }
    /***************************************************************************/

    this.setRGBA = function(r, g, b, a) {
        that.r = r;
        that.g = g;
        that.b = b;
        that.a = a;
    }
}