/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 2.3.0
 *
 * Copyright 2016 Nick Downie
 * Released under the MIT license
 * https://github.com/chartjs/Chart.js/blob/master/LICENSE.md
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Chart = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/* MIT license */
var colorNames = require(6);

module.exports = {
   getRgba: getRgba,
   getHsla: getHsla,
   getRgb: getRgb,
   getHsl: getHsl,
   getHwb: getHwb,
   getAlpha: getAlpha,

   hexString: hexString,
   rgbString: rgbString,
   rgbaString: rgbaString,
   percentString: percentString,
   percentaString: percentaString,
   hslString: hslString,
   hslaString: hslaString,
   hwbString: hwbString,
   keyword: keyword
}

function getRgba(string) {
   if (!string) {
      return;
   }
   var abbr =  /^#([a-fA-F0-9]{3})$/,
       hex =  /^#([a-fA-F0-9]{6})$/,
       rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       keyword = /(\w+)/;

   var rgb = [0, 0, 0],
       a = 1,
       match = string.match(abbr);
   if (match) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i] + match[i], 16);
      }
   }
   else if (match = string.match(hex)) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
      }
   }
   else if (match = string.match(rgba)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i + 1]);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(per)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(keyword)) {
      if (match[1] == "transparent") {
         return [0, 0, 0, 0];
      }
      rgb = colorNames[match[1]];
      if (!rgb) {
         return;
      }
   }

   for (var i = 0; i < rgb.length; i++) {
      rgb[i] = scale(rgb[i], 0, 255);
   }
   if (!a && a != 0) {
      a = 1;
   }
   else {
      a = scale(a, 0, 1);
   }
   rgb[3] = a;
   return rgb;
}

function getHsla(string) {
   if (!string) {
      return;
   }
   var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hsl);
   if (match) {
      var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          s = scale(parseFloat(match[2]), 0, 100),
          l = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, s, l, a];
   }
}

function getHwb(string) {
   if (!string) {
      return;
   }
   var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hwb);
   if (match) {
    var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          w = scale(parseFloat(match[2]), 0, 100),
          b = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, w, b, a];
   }
}

function getRgb(string) {
   var rgba = getRgba(string);
   return rgba && rgba.slice(0, 3);
}

function getHsl(string) {
  var hsla = getHsla(string);
  return hsla && hsla.slice(0, 3);
}

function getAlpha(string) {
   var vals = getRgba(string);
   if (vals) {
      return vals[3];
   }
   else if (vals = getHsla(string)) {
      return vals[3];
   }
   else if (vals = getHwb(string)) {
      return vals[3];
   }
}

// generators
function hexString(rgb) {
   return "#" + hexDouble(rgb[0]) + hexDouble(rgb[1])
              + hexDouble(rgb[2]);
}

function rgbString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return rgbaString(rgba, alpha);
   }
   return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
}

function rgbaString(rgba, alpha) {
   if (alpha === undefined) {
      alpha = (rgba[3] !== undefined ? rgba[3] : 1);
   }
   return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]
           + ", " + alpha + ")";
}

function percentString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return percentaString(rgba, alpha);
   }
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);

   return "rgb(" + r + "%, " + g + "%, " + b + "%)";
}

function percentaString(rgba, alpha) {
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);
   return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
}

function hslString(hsla, alpha) {
   if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
      return hslaString(hsla, alpha);
   }
   return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
}

function hslaString(hsla, alpha) {
   if (alpha === undefined) {
      alpha = (hsla[3] !== undefined ? hsla[3] : 1);
   }
   return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "
           + alpha + ")";
}

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
function hwbString(hwb, alpha) {
   if (alpha === undefined) {
      alpha = (hwb[3] !== undefined ? hwb[3] : 1);
   }
   return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%"
           + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";
}

function keyword(rgb) {
  return reverseNames[rgb.slice(0, 3)];
}

// helpers
function scale(num, min, max) {
   return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
  var str = num.toString(16).toUpperCase();
  return (str.length < 2) ? "0" + str : str;
}


//create a list of reverse color names
var reverseNames = {};
for (var name in colorNames) {
   reverseNames[colorNames[name]] = name;
}

},{"6":6}],3:[function(require,module,exports){
/* MIT license */
var convert = require(5);
var string = require(2);

var Color = function (obj) {
	if (obj instanceof Color) {
		return obj;
	}
	if (!(this instanceof Color)) {
		return new Color(obj);
	}

	this.values = {
		rgb: [0, 0, 0],
		hsl: [0, 0, 0],
		hsv: [0, 0, 0],
		hwb: [0, 0, 0],
		cmyk: [0, 0, 0, 0],
		alpha: 1
	};

	// parse Color() argument
	var vals;
	if (typeof obj === 'string') {
		vals = string.getRgba(obj);
		if (vals) {
			this.setValues('rgb', vals);
		} else if (vals = string.getHsla(obj)) {
			this.setValues('hsl', vals);
		} else if (vals = string.getHwb(obj)) {
			this.setValues('hwb', vals);
		} else {
			throw new Error('Unable to parse color from string "' + obj + '"');
		}
	} else if (typeof obj === 'object') {
		vals = obj;
		if (vals.r !== undefined || vals.red !== undefined) {
			this.setValues('rgb', vals);
		} else if (vals.l !== undefined || vals.lightness !== undefined) {
			this.setValues('hsl', vals);
		} else if (vals.v !== undefined || vals.value !== undefined) {
			this.setValues('hsv', vals);
		} else if (vals.w !== undefined || vals.whiteness !== undefined) {
			this.setValues('hwb', vals);
		} else if (vals.c !== undefined || vals.cyan !== undefined) {
			this.setValues('cmyk', vals);
		} else {
			throw new Error('Unable to parse color from object ' + JSON.stringify(obj));
		}
	}
};

Color.prototype = {
	rgb: function () {
		return this.setSpace('rgb', arguments);
	},
	hsl: function () {
		return this.setSpace('hsl', arguments);
	},
	hsv: function () {
		return this.setSpace('hsv', arguments);
	},
	hwb: function () {
		return this.setSpace('hwb', arguments);
	},
	cmyk: function () {
		return this.setSpace('cmyk', arguments);
	},

	rgbArray: function () {
		return this.values.rgb;
	},
	hslArray: function () {
		return this.values.hsl;
	},
	hsvArray: function () {
		return this.values.hsv;
	},
	hwbArray: function () {
		var values = this.values;
		if (values.alpha !== 1) {
			return values.hwb.concat([values.alpha]);
		}
		return values.hwb;
	},
	cmykArray: function () {
		return this.values.cmyk;
	},
	rgbaArray: function () {
		var values = this.values;
		return values.rgb.concat([values.alpha]);
	},
	hslaArray: function () {
		var values = this.values;
		return values.hsl.concat([values.alpha]);
	},
	alpha: function (val) {
		if (val === undefined) {
			return this.values.alpha;
		}
		this.setValues('alpha', val);
		return this;
	},

	red: function (val) {
		return this.setChannel('rgb', 0, val);
	},
	green: function (val) {
		return this.setChannel('rgb', 1, val);
	},
	blue: function (val) {
		return this.setChannel('rgb', 2, val);
	},
	hue: function (val) {
		if (val) {
			val %= 360;
			val = val < 0 ? 360 + val : val;
		}
		return this.setChannel('hsl', 0, val);
	},
	saturation: function (val) {
		return this.setChannel('hsl', 1, val);
	},
	lightness: function (val) {
		return this.setChannel('hsl', 2, val);
	},
	saturationv: function (val) {
		return this.setChannel('hsv', 1, val);
	},
	whiteness: function (val) {
		return this.setChannel('hwb', 1, val);
	},
	blackness: function (val) {
		return this.setChannel('hwb', 2, val);
	},
	value: function (val) {
		return this.setChannel('hsv', 2, val);
	},
	cyan: function (val) {
		return this.setChannel('cmyk', 0, val);
	},
	magenta: function (val) {
		return this.setChannel('cmyk', 1, val);
	},
	yellow: function (val) {
		return this.setChannel('cmyk', 2, val);
	},
	black: function (val) {
		return this.setChannel('cmyk', 3, val);
	},

	hexString: function () {
		return string.hexString(this.values.rgb);
	},
	rgbString: function () {
		return string.rgbString(this.values.rgb, this.values.alpha);
	},
	rgbaString: function () {
		return string.rgbaString(this.values.rgb, this.values.alpha);
	},
	percentString: function () {
		return string.percentString(this.values.rgb, this.values.alpha);
	},
	hslString: function () {
		return string.hslString(this.values.hsl, this.values.alpha);
	},
	hslaString: function () {
		return string.hslaString(this.values.hsl, this.values.alpha);
	},
	hwbString: function () {
		return string.hwbString(this.values.hwb, this.values.alpha);
	},
	keyword: function () {
		return string.keyword(this.values.rgb, this.values.alpha);
	},

	rgbNumber: function () {
		var rgb = this.values.rgb;
		return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
	},

	luminosity: function () {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		var rgb = this.values.rgb;
		var lum = [];
		for (var i = 0; i < rgb.length; i++) {
			var chan = rgb[i] / 255;
			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
		}
		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast: function (color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		var lum1 = this.luminosity();
		var lum2 = color2.luminosity();
		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}
		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level: function (color2) {
		var contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7.1) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	dark: function () {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		var rgb = this.values.rgb;
		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		return yiq < 128;
	},

	light: function () {
		return !this.dark();
	},

	negate: function () {
		var rgb = [];
		for (var i = 0; i < 3; i++) {
			rgb[i] = 255 - this.values.rgb[i];
		}
		this.setValues('rgb', rgb);
		return this;
	},

	lighten: function (ratio) {
		var hsl = this.values.hsl;
		hsl[2] += hsl[2] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	darken: function (ratio) {
		var hsl = this.values.hsl;
		hsl[2] -= hsl[2] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	saturate: function (ratio) {
		var hsl = this.values.hsl;
		hsl[1] += hsl[1] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	desaturate: function (ratio) {
		var hsl = this.values.hsl;
		hsl[1] -= hsl[1] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	whiten: function (ratio) {
		var hwb = this.values.hwb;
		hwb[1] += hwb[1] * ratio;
		this.setValues('hwb', hwb);
		return this;
	},

	blacken: function (ratio) {
		var hwb = this.values.hwb;
		hwb[2] += hwb[2] * ratio;
		this.setValues('hwb', hwb);
		return this;
	},

	greyscale: function () {
		var rgb = this.values.rgb;
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		this.setValues('rgb', [val, val, val]);
		return this;
	},

	clearer: function (ratio) {
		var alpha = this.values.alpha;
		this.setValues('alpha', alpha - (alpha * ratio));
		return this;
	},

	opaquer: function (ratio) {
		var alpha = this.values.alpha;
		this.setValues('alpha', alpha + (alpha * ratio));
		return this;
	},

	rotate: function (degrees) {
		var hsl = this.values.hsl;
		var hue = (hsl[0] + degrees) % 360;
		hsl[0] = hue < 0 ? 360 + hue : hue;
		this.setValues('hsl', hsl);
		return this;
	},

	/**
	 * Ported from sass implementation in C
	 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
	 */
	mix: function (mixinColor, weight) {
		var color1 = this;
		var color2 = mixinColor;
		var p = weight === undefined ? 0.5 : weight;

		var w = 2 * p - 1;
		var a = color1.alpha() - color2.alpha();

		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
		var w2 = 1 - w1;

		return this
			.rgb(
				w1 * color1.red() + w2 * color2.red(),
				w1 * color1.green() + w2 * color2.green(),
				w1 * color1.blue() + w2 * color2.blue()
			)
			.alpha(color1.alpha() * p + color2.alpha() * (1 - p));
	},

	toJSON: function () {
		return this.rgb();
	},

	clone: function () {
		// NOTE(SB): using node-clone creates a dependency to Buffer when using browserify,
		// making the final build way to big to embed in Chart.js. So let's do it manually,
		// assuming that values to clone are 1 dimension arrays containing only numbers,
		// except 'alpha' which is a number.
		var result = new Color();
		var source = this.values;
		var target = result.values;
		var value, type;

		for (var prop in source) {
			if (source.hasOwnProperty(prop)) {
				value = source[prop];
				type = ({}).toString.call(value);
				if (type === '[object Array]') {
					target[prop] = value.slice(0);
				} else if (type === '[object Number]') {
					target[prop] = value;
				} else {
					console.error('unexpected color value:', value);
				}
			}
		}

		return result;
	}
};

Color.prototype.spaces = {
	rgb: ['red', 'green', 'blue'],
	hsl: ['hue', 'saturation', 'lightness'],
	hsv: ['hue', 'saturation', 'value'],
	hwb: ['hue', 'whiteness', 'blackness'],
	cmyk: ['cyan', 'magenta', 'yellow', 'black']
};

Color.prototype.maxes = {
	rgb: [255, 255, 255],
	hsl: [360, 100, 100],
	hsv: [360, 100, 100],
	hwb: [360, 100, 100],
	cmyk: [100, 100, 100, 100]
};

Color.prototype.getValues = function (space) {
	var values = this.values;
	var vals = {};

	for (var i = 0; i < space.length; i++) {
		vals[space.charAt(i)] = values[space][i];
	}

	if (values.alpha !== 1) {
		vals.a = values.alpha;
	}

	// {r: 255, g: 255, b: 255, a: 0.4}
	return vals;
};

Color.prototype.setValues = function (space, vals) {
	var values = this.values;
	var spaces = this.spaces;
	var maxes = this.maxes;
	var alpha = 1;
	var i;

	if (space === 'alpha') {
		alpha = vals;
	} else if (vals.length) {
		// [10, 10, 10]
		values[space] = vals.slice(0, space.length);
		alpha = vals[space.length];
	} else if (vals[space.charAt(0)] !== undefined) {
		// {r: 10, g: 10, b: 10}
		for (i = 0; i < space.length; i++) {
			values[space][i] = vals[space.charAt(i)];
		}

		alpha = vals.a;
	} else if (vals[spaces[space][0]] !== undefined) {
		// {red: 10, green: 10, blue: 10}
		var chans = spaces[space];

		for (i = 0; i < space.length; i++) {
			values[space][i] = vals[chans[i]];
		}

		alpha = vals.alpha;
	}

	values.alpha = Math.max(0, Math.min(1, (alpha === undefined ? values.alpha : alpha)));

	if (space === 'alpha') {
		return false;
	}

	var capped;

	// cap values of the space prior converting all values
	for (i = 0; i < space.length; i++) {
		capped = Math.max(0, Math.min(maxes[space][i], values[space][i]));
		values[space][i] = Math.round(capped);
	}

	// convert to all the other color spaces
	for (var sname in spaces) {
		if (sname !== space) {
			values[sname] = convert[space][sname](values[space]);
		}
	}

	return true;
};

Color.prototype.setSpace = function (space, args) {
	var vals = args[0];

	if (vals === undefined) {
		// color.rgb()
		return this.getValues(space);
	}

	// color.rgb(10, 10, 10)
	if (typeof vals === 'number') {
		vals = Array.prototype.slice.call(args);
	}

	this.setValues(space, vals);
	return this;
};

Color.prototype.setChannel = function (space, index, val) {
	var svalues = this.values[space];
	if (val === undefined) {
		// color.red()
		return svalues[index];
	} else if (val === svalues[index]) {
		// color.red(color.red())
		return this;
	}

	// color.red(100)
	svalues[index] = val;
	this.setValues(space, svalues);

	return this;
};

if (typeof window !== 'undefined') {
	window.Color = Color;
}

module.exports = Color;

},{"2":2,"5":5}],4:[function(require,module,exports){
/* MIT license */

module.exports = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2hwb: rgb2hwb,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  rgb2lch: rgb2lch,

  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2hwb: hsl2hwb,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2hwb: hsv2hwb,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,

  hwb2rgb: hwb2rgb,
  hwb2hsl: hwb2hsl,
  hwb2hsv: hwb2hsv,
  hwb2cmyk: hwb2cmyk,
  hwb2keyword: hwb2keyword,

  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2hwb: cmyk2hwb,
  cmyk2keyword: cmyk2keyword,

  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2hwb: keyword2hwb,
  keyword2cmyk: keyword2cmyk,
  keyword2lab: keyword2lab,
  keyword2xyz: keyword2xyz,

  xyz2rgb: xyz2rgb,
  xyz2lab: xyz2lab,
  xyz2lch: xyz2lch,

  lab2xyz: lab2xyz,
  lab2rgb: lab2rgb,
  lab2lch: lab2lch,

  lch2lab: lch2lab,
  lch2xyz: lch2xyz,
  lch2rgb: lch2rgb
}


function rgb2hsl(rgb) {
  var r = rgb[0]/255,
      g = rgb[1]/255,
      b = rgb[2]/255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, l;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  l = (min + max) / 2;

  if (max == min)
    s = 0;
  else if (l <= 0.5)
    s = delta / (max + min);
  else
    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    s = 0;
  else
    s = (delta/max * 1000)/10;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2hwb(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      h = rgb2hsl(rgb)[0],
      w = 1/255 * Math.min(r, Math.min(g, b)),
      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k) || 0;
  m = (1 - g - k) / (1 - k) || 0;
  y = (1 - b - k) / (1 - k) || 0;
  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function rgb2lch(args) {
  return lab2lch(rgb2lab(args));
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = val * 255;
  }

  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0],
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      sv, v;

  if(l === 0) {
      // no need to do calc on black
      // also avoids divide by 0 error
      return [0, 0, 0];
  }

  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, sv * 100, v * 100];
}

function hsl2hwb(args) {
  return rgb2hwb(hsl2rgb(args));
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}


function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function hsv2hwb(args) {
  return rgb2hwb(hsv2rgb(args))
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
function hwb2rgb(hwb) {
  var h = hwb[0] / 360,
      wh = hwb[1] / 100,
      bl = hwb[2] / 100,
      ratio = wh + bl,
      i, v, f, n;

  // wh + bl cant be > 1
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }

  i = Math.floor(6 * h);
  v = 1 - bl;
  f = 6 * h - i;
  if ((i & 0x01) != 0) {
    f = 1 - f;
  }
  n = wh + f * (v - wh);  // linear interpolation

  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = wh; break;
    case 1: r = n; g = v; b = wh; break;
    case 2: r = wh; g = v; b = n; break;
    case 3: r = wh; g = n; b = v; break;
    case 4: r = n; g = wh; b = v; break;
    case 5: r = v; g = wh; b = n; break;
  }

  return [r * 255, g * 255, b * 255];
}

function hwb2hsl(args) {
  return rgb2hsl(hwb2rgb(args));
}

function hwb2hsv(args) {
  return rgb2hsv(hwb2rgb(args));
}

function hwb2cmyk(args) {
  return rgb2cmyk(hwb2rgb(args));
}

function hwb2keyword(args) {
  return rgb2keyword(hwb2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100,
      m = cmyk[1] / 100,
      y = cmyk[2] / 100,
      k = cmyk[3] / 100,
      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2hwb(args) {
  return rgb2hwb(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}


function xyz2rgb(xyz) {
  var x = xyz[0] / 100,
      y = xyz[1] / 100,
      z = xyz[2] / 100,
      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB
  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    : g = (g * 12.92);

  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    : b = (b * 12.92);

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

function xyz2lab(xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2],
      l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function xyz2lch(args) {
  return lab2lch(xyz2lab(args));
}

function lab2xyz(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      x, y, z, y2;

  if (l <= 8) {
    y = (l * 100) / 903.3;
    y2 = (7.787 * (y / 100)) + (16 / 116);
  } else {
    y = 100 * Math.pow((l + 16) / 116, 3);
    y2 = Math.pow(y / 100, 1/3);
  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];
}

function lab2lch(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      hr, h, c;

  hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  c = Math.sqrt(a * a + b * b);
  return [l, c, h];
}

function lab2rgb(args) {
  return xyz2rgb(lab2xyz(args));
}

function lch2lab(lch) {
  var l = lch[0],
      c = lch[1],
      h = lch[2],
      a, b, hr;

  hr = h / 360 * 2 * Math.PI;
  a = c * Math.cos(hr);
  b = c * Math.sin(hr);
  return [l, a, b];
}

function lch2xyz(args) {
  return lab2xyz(lch2lab(args));
}

function lch2rgb(args) {
  return lab2rgb(lch2lab(args));
}

function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2hwb(args) {
  return rgb2hwb(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

function keyword2lab(args) {
  return rgb2lab(keyword2rgb(args));
}

function keyword2xyz(args) {
  return rgb2xyz(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [119,136,153],
  lightslategrey: [119,136,153],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  rebeccapurple: [102, 51, 153],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}

},{}],5:[function(require,module,exports){
var conversions = require(4);

var convert = function() {
   return new Converter();
}

for (var func in conversions) {
  // export Raw versions
  convert[func + "Raw"] =  (function(func) {
    // accept array or plain args
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      return conversions[func](arg);
    }
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),
      from = pair[1],
      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]
  convert[from] = convert[from] || {};

  convert[from][to] = convert[func] = (function(func) { 
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      
      var val = conversions[func](arg);
      if (typeof val == "string" || val === undefined)
        return val; // keyword

      for (var i = 0; i < val.length; i++)
        val[i] = Math.round(val[i]);
      return val;
    }
  })(func);
}


/* Converter does lazy conversion and caching */
var Converter = function() {
   this.convs = {};
};

/* Either get the values for a space or
  set the values for a space, depending on args */
Converter.prototype.routeSpace = function(space, args) {
   var values = args[0];
   if (values === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof values == "number") {
      values = Array.prototype.slice.call(args);        
   }

   return this.setValues(space, values);
};
  
/* Set the values for a space, invalidating cache */
Converter.prototype.setValues = function(space, values) {
   this.space = space;
   this.convs = {};
   this.convs[space] = values;
   return this;
};

/* Get the values for a space. If there's already
  a conversion for the space, fetch it, otherwise
  compute it */
Converter.prototype.getValues = function(space) {
   var vals = this.convs[space];
   if (!vals) {
      var fspace = this.space,
          from = this.convs[fspace];
      vals = convert[fspace][space](from);

      this.convs[space] = vals;
   }
  return vals;
};

["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
   Converter.prototype[space] = function(vals) {
      return this.routeSpace(space, arguments);
   }
});

module.exports = convert;
},{"4":4}],6:[function(require,module,exports){
module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};
},{}],7:[function(require,module,exports){
/**
 * @namespace Chart
 */
var Chart = require(27)();

require(26)(Chart);
require(22)(Chart);
require(25)(Chart);
require(21)(Chart);
require(23)(Chart);
require(24)(Chart);
require(28)(Chart);
require(32)(Chart);
require(30)(Chart);
require(31)(Chart);
require(33)(Chart);
require(29)(Chart);
require(34)(Chart);

require(35)(Chart);
require(36)(Chart);
require(37)(Chart);
require(38)(Chart);

require(41)(Chart);
require(39)(Chart);
require(40)(Chart);
require(42)(Chart);
require(43)(Chart);
require(44)(Chart);

// Controllers must be loaded after elements
// See Chart.core.datasetController.dataElementType
require(15)(Chart);
require(16)(Chart);
require(17)(Chart);
require(18)(Chart);
require(19)(Chart);
require(20)(Chart);

require(8)(Chart);
require(9)(Chart);
require(10)(Chart);
require(11)(Chart);
require(12)(Chart);
require(13)(Chart);
require(14)(Chart);

window.Chart = module.exports = Chart;

},{"10":10,"11":11,"12":12,"13":13,"14":14,"15":15,"16":16,"17":17,"18":18,"19":19,"20":20,"21":21,"22":22,"23":23,"24":24,"25":25,"26":26,"27":27,"28":28,"29":29,"30":30,"31":31,"32":32,"33":33,"34":34,"35":35,"36":36,"37":37,"38":38,"39":39,"40":40,"41":41,"42":42,"43":43,"44":44,"8":8,"9":9}],8:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Bar = function(context, config) {
		config.type = 'bar';

		return new Chart(context, config);
	};

};

},{}],9:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Bubble = function(context, config) {
		config.type = 'bubble';
		return new Chart(context, config);
	};

};

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Doughnut = function(context, config) {
		config.type = 'doughnut';

		return new Chart(context, config);
	};

};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Line = function(context, config) {
		config.type = 'line';

		return new Chart(context, config);
	};

};

},{}],12:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.PolarArea = function(context, config) {
		config.type = 'polarArea';

		return new Chart(context, config);
	};

};

},{}],13:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Radar = function(context, config) {
		config.options = Chart.helpers.configMerge({aspectRatio: 1}, config.options);
		config.type = 'radar';

		return new Chart(context, config);
	};

};

},{}],14:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var defaultConfig = {
		hover: {
			mode: 'single'
		},

		scales: {
			xAxes: [{
				type: 'linear', // scatter should not use a category axis
				position: 'bottom',
				id: 'x-axis-1' // need an ID so datasets can reference the scale
			}],
			yAxes: [{
				type: 'linear',
				position: 'left',
				id: 'y-axis-1'
			}]
		},

		tooltips: {
			callbacks: {
				title: function() {
					// Title doesn't make sense for scatter since we format the data as a point
					return '';
				},
				label: function(tooltipItem) {
					return '(' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
				}
			}
		}
	};

	// Register the default config for this type
	Chart.defaults.scatter = defaultConfig;

	// Scatter charts use line controllers
	Chart.controllers.scatter = Chart.controllers.line;

	Chart.Scatter = function(context, config) {
		config.type = 'scatter';
		return new Chart(context, config);
	};

};

},{}],15:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.bar = {
		hover: {
			mode: 'label'
		},

		scales: {
			xAxes: [{
				type: 'category',

				// Specific to Bar Controller
				categoryPercentage: 0.8,
				barPercentage: 0.9,

				// grid line settings
				gridLines: {
					offsetGridLines: true
				}
			}],
			yAxes: [{
				type: 'linear'
			}]
		}
	};

	Chart.controllers.bar = Chart.DatasetController.extend({

		dataElementType: Chart.elements.Rectangle,

		initialize: function(chart, datasetIndex) {
			Chart.DatasetController.prototype.initialize.call(this, chart, datasetIndex);

			// Use this to indicate that this is a bar dataset.
			this.getMeta().bar = true;
		},

		// Get the number of datasets that display bars. We use this to correctly calculate the bar width
		getBarCount: function() {
			var me = this;
			var barCount = 0;
			helpers.each(me.chart.data.datasets, function(dataset, datasetIndex) {
				var meta = me.chart.getDatasetMeta(datasetIndex);
				if (meta.bar && me.chart.isDatasetVisible(datasetIndex)) {
					++barCount;
				}
			}, me);
			return barCount;
		},

		update: function(reset) {
			var me = this;
			helpers.each(me.getMeta().data, function(rectangle, index) {
				me.updateElement(rectangle, index, reset);
			}, me);
		},

		updateElement: function(rectangle, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var yScale = me.getScaleForId(meta.yAxisID);
			var scaleBase = yScale.getBasePixel();
			var rectangleElementOptions = me.chart.options.elements.rectangle;
			var custom = rectangle.custom || {};
			var dataset = me.getDataset();

			helpers.extend(rectangle, {
				// Utility
				_xScale: xScale,
				_yScale: yScale,
				_datasetIndex: me.index,
				_index: index,

				// Desired view properties
				_model: {
					x: me.calculateBarX(index, me.index),
					y: reset ? scaleBase : me.calculateBarY(index, me.index),

					// Tooltip
					label: me.chart.data.labels[index],
					datasetLabel: dataset.label,

					// Appearance
					base: reset ? scaleBase : me.calculateBarBase(me.index, index),
					width: me.calculateBarWidth(index),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor),
					borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleElementOptions.borderSkipped,
					borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth)
				}
			});
			rectangle.pivot();
		},

		calculateBarBase: function(datasetIndex, index) {
			var me = this;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			var base = 0;

			if (yScale.options.stacked) {
				var chart = me.chart;
				var datasets = chart.data.datasets;
				var value = Number(datasets[datasetIndex].data[index]);

				for (var i = 0; i < datasetIndex; i++) {
					var currentDs = datasets[i];
					var currentDsMeta = chart.getDatasetMeta(i);
					if (currentDsMeta.bar && currentDsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i)) {
						var currentVal = Number(currentDs.data[index]);
						base += value < 0 ? Math.min(currentVal, 0) : Math.max(currentVal, 0);
					}
				}

				return yScale.getPixelForValue(base);
			}

			return yScale.getBasePixel();
		},

		getRuler: function(index) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var datasetCount = me.getBarCount();

			var tickWidth;

			if (xScale.options.type === 'category') {
				tickWidth = xScale.getPixelForTick(index + 1) - xScale.getPixelForTick(index);
			} else {
				// Average width
				tickWidth = xScale.width / xScale.ticks.length;
			}
			var categoryWidth = tickWidth * xScale.options.categoryPercentage;
			var categorySpacing = (tickWidth - (tickWidth * xScale.options.categoryPercentage)) / 2;
			var fullBarWidth = categoryWidth / datasetCount;

			if (xScale.ticks.length !== me.chart.data.labels.length) {
				var perc = xScale.ticks.length / me.chart.data.labels.length;
				fullBarWidth = fullBarWidth * perc;
			}

			var barWidth = fullBarWidth * xScale.options.barPercentage;
			var barSpacing = fullBarWidth - (fullBarWidth * xScale.options.barPercentage);

			return {
				datasetCount: datasetCount,
				tickWidth: tickWidth,
				categoryWidth: categoryWidth,
				categorySpacing: categorySpacing,
				fullBarWidth: fullBarWidth,
				barWidth: barWidth,
				barSpacing: barSpacing
			};
		},

		calculateBarWidth: function(index) {
			var xScale = this.getScaleForId(this.getMeta().xAxisID);
			if (xScale.options.barThickness) {
				return xScale.options.barThickness;
			}
			var ruler = this.getRuler(index);
			return xScale.options.stacked ? ruler.categoryWidth : ruler.barWidth;
		},

		// Get bar index from the given dataset index accounting for the fact that not all bars are visible
		getBarIndex: function(datasetIndex) {
			var barIndex = 0;
			var meta, j;

			for (j = 0; j < datasetIndex; ++j) {
				meta = this.chart.getDatasetMeta(j);
				if (meta.bar && this.chart.isDatasetVisible(j)) {
					++barIndex;
				}
			}

			return barIndex;
		},

		calculateBarX: function(index, datasetIndex) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var barIndex = me.getBarIndex(datasetIndex);

			var ruler = me.getRuler(index);
			var leftTick = xScale.getPixelForValue(null, index, datasetIndex, me.chart.isCombo);
			leftTick -= me.chart.isCombo ? (ruler.tickWidth / 2) : 0;

			if (xScale.options.stacked) {
				return leftTick + (ruler.categoryWidth / 2) + ruler.categorySpacing;
			}

			return leftTick +
				(ruler.barWidth / 2) +
				ruler.categorySpacing +
				(ruler.barWidth * barIndex) +
				(ruler.barSpacing / 2) +
				(ruler.barSpacing * barIndex);
		},

		calculateBarY: function(index, datasetIndex) {
			var me = this;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			var value = Number(me.getDataset().data[index]);

			if (yScale.options.stacked) {

				var sumPos = 0,
					sumNeg = 0;

				for (var i = 0; i < datasetIndex; i++) {
					var ds = me.chart.data.datasets[i];
					var dsMeta = me.chart.getDatasetMeta(i);
					if (dsMeta.bar && dsMeta.yAxisID === yScale.id && me.chart.isDatasetVisible(i)) {
						var stackedVal = Number(ds.data[index]);
						if (stackedVal < 0) {
							sumNeg += stackedVal || 0;
						} else {
							sumPos += stackedVal || 0;
						}
					}
				}

				if (value < 0) {
					return yScale.getPixelForValue(sumNeg + value);
				}
				return yScale.getPixelForValue(sumPos + value);
			}

			return yScale.getPixelForValue(value);
		},

		draw: function(ease) {
			var me = this;
			var easingDecimal = ease || 1;
			helpers.each(me.getMeta().data, function(rectangle, index) {
				var d = me.getDataset().data[index];
				if (d !== null && d !== undefined && !isNaN(d)) {
					rectangle.transition(easingDecimal).draw();
				}
			}, me);
		},

		setHoverStyle: function(rectangle) {
			var dataset = this.chart.data.datasets[rectangle._datasetIndex];
			var index = rectangle._index;

			var custom = rectangle.custom || {};
			var model = rectangle._model;
			model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : helpers.getValueAtIndexOrDefault(dataset.hoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : helpers.getValueAtIndexOrDefault(dataset.hoverBorderColor, index, helpers.getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : helpers.getValueAtIndexOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
		},

		removeHoverStyle: function(rectangle) {
			var dataset = this.chart.data.datasets[rectangle._datasetIndex];
			var index = rectangle._index;
			var custom = rectangle.custom || {};
			var model = rectangle._model;
			var rectangleElementOptions = this.chart.options.elements.rectangle;

			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth);
		}

	});


	// including horizontalBar in the bar file, instead of a file of its own
	// it extends bar (like pie extends doughnut)
	Chart.defaults.horizontalBar = {
		hover: {
			mode: 'label'
		},

		scales: {
			xAxes: [{
				type: 'linear',
				position: 'bottom'
			}],
			yAxes: [{
				position: 'left',
				type: 'category',

				// Specific to Horizontal Bar Controller
				categoryPercentage: 0.8,
				barPercentage: 0.9,

				// grid line settings
				gridLines: {
					offsetGridLines: true
				}
			}]
		},
		elements: {
			rectangle: {
				borderSkipped: 'left'
			}
		},
		tooltips: {
			callbacks: {
				title: function(tooltipItems, data) {
					// Pick first xLabel for now
					var title = '';

					if (tooltipItems.length > 0) {
						if (tooltipItems[0].yLabel) {
							title = tooltipItems[0].yLabel;
						} else if (data.labels.length > 0 && tooltipItems[0].index < data.labels.length) {
							title = data.labels[tooltipItems[0].index];
						}
					}

					return title;
				},
				label: function(tooltipItem, data) {
					var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
					return datasetLabel + ': ' + tooltipItem.xLabel;
				}
			}
		}
	};

	Chart.controllers.horizontalBar = Chart.controllers.bar.extend({
		updateElement: function(rectangle, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var yScale = me.getScaleForId(meta.yAxisID);
			var scaleBase = xScale.getBasePixel();
			var custom = rectangle.custom || {};
			var dataset = me.getDataset();
			var rectangleElementOptions = me.chart.options.elements.rectangle;

			helpers.extend(rectangle, {
				// Utility
				_xScale: xScale,
				_yScale: yScale,
				_datasetIndex: me.index,
				_index: index,

				// Desired view properties
				_model: {
					x: reset ? scaleBase : me.calculateBarX(index, me.index),
					y: me.calculateBarY(index, me.index),

					// Tooltip
					label: me.chart.data.labels[index],
					datasetLabel: dataset.label,

					// Appearance
					base: reset ? scaleBase : me.calculateBarBase(me.index, index),
					height: me.calculateBarHeight(index),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor),
					borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleElementOptions.borderSkipped,
					borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth)
				},

				draw: function() {
					var ctx = this._chart.ctx;
					var vm = this._view;

					var halfHeight = vm.height / 2,
						topY = vm.y - halfHeight,
						bottomY = vm.y + halfHeight,
						right = vm.base - (vm.base - vm.x),
						halfStroke = vm.borderWidth / 2;

					// Canvas doesn't allow us to stroke inside the width so we can
					// adjust the sizes to fit if we're setting a stroke on the line
					if (vm.borderWidth) {
						topY += halfStroke;
						bottomY -= halfStroke;
						right += halfStroke;
					}

					ctx.beginPath();

					ctx.fillStyle = vm.backgroundColor;
					ctx.strokeStyle = vm.borderColor;
					ctx.lineWidth = vm.borderWidth;

					// Corner points, from bottom-left to bottom-right clockwise
					// | 1 2 |
					// | 0 3 |
					var corners = [
						[vm.base, bottomY],
						[vm.base, topY],
						[right, topY],
						[right, bottomY]
					];

					// Find first (starting) corner with fallback to 'bottom'
					var borders = ['bottom', 'left', 'top', 'right'];
					var startCorner = borders.indexOf(vm.borderSkipped, 0);
					if (startCorner === -1) {
						startCorner = 0;
					}

					function cornerAt(cornerIndex) {
						return corners[(startCorner + cornerIndex) % 4];
					}

					// Draw rectangle from 'startCorner'
					ctx.moveTo.apply(ctx, cornerAt(0));
					for (var i = 1; i < 4; i++) {
						ctx.lineTo.apply(ctx, cornerAt(i));
					}

					ctx.fill();
					if (vm.borderWidth) {
						ctx.stroke();
					}
				},

				inRange: function(mouseX, mouseY) {
					var vm = this._view;
					var inRange = false;

					if (vm) {
						if (vm.x < vm.base) {
							inRange = (mouseY >= vm.y - vm.height / 2 && mouseY <= vm.y + vm.height / 2) && (mouseX >= vm.x && mouseX <= vm.base);
						} else {
							inRange = (mouseY >= vm.y - vm.height / 2 && mouseY <= vm.y + vm.height / 2) && (mouseX >= vm.base && mouseX <= vm.x);
						}
					}

					return inRange;
				}
			});

			rectangle.pivot();
		},

		calculateBarBase: function(datasetIndex, index) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var base = 0;

			if (xScale.options.stacked) {
				var chart = me.chart;
				var datasets = chart.data.datasets;
				var value = Number(datasets[datasetIndex].data[index]);

				for (var i = 0; i < datasetIndex; i++) {
					var currentDs = datasets[i];
					var currentDsMeta = chart.getDatasetMeta(i);
					if (currentDsMeta.bar && currentDsMeta.xAxisID === xScale.id && chart.isDatasetVisible(i)) {
						var currentVal = Number(currentDs.data[index]);
						base += value < 0 ? Math.min(currentVal, 0) : Math.max(currentVal, 0);
					}
				}

				return xScale.getPixelForValue(base);
			}

			return xScale.getBasePixel();
		},

		getRuler: function(index) {
			var me = this;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			var datasetCount = me.getBarCount();

			var tickHeight;
			if (yScale.options.type === 'category') {
				tickHeight = yScale.getPixelForTick(index + 1) - yScale.getPixelForTick(index);
			} else {
				// Average width
				tickHeight = yScale.width / yScale.ticks.length;
			}
			var categoryHeight = tickHeight * yScale.options.categoryPercentage;
			var categorySpacing = (tickHeight - (tickHeight * yScale.options.categoryPercentage)) / 2;
			var fullBarHeight = categoryHeight / datasetCount;

			if (yScale.ticks.length !== me.chart.data.labels.length) {
				var perc = yScale.ticks.length / me.chart.data.labels.length;
				fullBarHeight = fullBarHeight * perc;
			}

			var barHeight = fullBarHeight * yScale.options.barPercentage;
			var barSpacing = fullBarHeight - (fullBarHeight * yScale.options.barPercentage);

			return {
				datasetCount: datasetCount,
				tickHeight: tickHeight,
				categoryHeight: categoryHeight,
				categorySpacing: categorySpacing,
				fullBarHeight: fullBarHeight,
				barHeight: barHeight,
				barSpacing: barSpacing
			};
		},

		calculateBarHeight: function(index) {
			var me = this;
			var yScale = me.getScaleForId(me.getMeta().yAxisID);
			if (yScale.options.barThickness) {
				return yScale.options.barThickness;
			}
			var ruler = me.getRuler(index);
			return yScale.options.stacked ? ruler.categoryHeight : ruler.barHeight;
		},

		calculateBarX: function(index, datasetIndex) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var value = Number(me.getDataset().data[index]);

			if (xScale.options.stacked) {

				var sumPos = 0,
					sumNeg = 0;

				for (var i = 0; i < datasetIndex; i++) {
					var ds = me.chart.data.datasets[i];
					var dsMeta = me.chart.getDatasetMeta(i);
					if (dsMeta.bar && dsMeta.xAxisID === xScale.id && me.chart.isDatasetVisible(i)) {
						var stackedVal = Number(ds.data[index]);
						if (stackedVal < 0) {
							sumNeg += stackedVal || 0;
						} else {
							sumPos += stackedVal || 0;
						}
					}
				}

				if (value < 0) {
					return xScale.getPixelForValue(sumNeg + value);
				}
				return xScale.getPixelForValue(sumPos + value);
			}

			return xScale.getPixelForValue(value);
		},

		calculateBarY: function(index, datasetIndex) {
			var me = this;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			var barIndex = me.getBarIndex(datasetIndex);

			var ruler = me.getRuler(index);
			var topTick = yScale.getPixelForValue(null, index, datasetIndex, me.chart.isCombo);
			topTick -= me.chart.isCombo ? (ruler.tickHeight / 2) : 0;

			if (yScale.options.stacked) {
				return topTick + (ruler.categoryHeight / 2) + ruler.categorySpacing;
			}

			return topTick +
				(ruler.barHeight / 2) +
				ruler.categorySpacing +
				(ruler.barHeight * barIndex) +
				(ruler.barSpacing / 2) +
				(ruler.barSpacing * barIndex);
		}
	});
};

},{}],16:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.bubble = {
		hover: {
			mode: 'single'
		},

		scales: {
			xAxes: [{
				type: 'linear', // bubble should probably use a linear scale by default
				position: 'bottom',
				id: 'x-axis-0' // need an ID so datasets can reference the scale
			}],
			yAxes: [{
				type: 'linear',
				position: 'left',
				id: 'y-axis-0'
			}]
		},

		tooltips: {
			callbacks: {
				title: function() {
					// Title doesn't make sense for scatter since we format the data as a point
					return '';
				},
				label: function(tooltipItem, data) {
					var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
					var dataPoint = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
					return datasetLabel + ': (' + dataPoint.x + ', ' + dataPoint.y + ', ' + dataPoint.r + ')';
				}
			}
		}
	};

	Chart.controllers.bubble = Chart.DatasetController.extend({

		dataElementType: Chart.elements.Point,

		update: function(reset) {
			var me = this;
			var meta = me.getMeta();
			var points = meta.data;

			// Update Points
			helpers.each(points, function(point, index) {
				me.updateElement(point, index, reset);
			});
		},

		updateElement: function(point, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var yScale = me.getScaleForId(meta.yAxisID);

			var custom = point.custom || {};
			var dataset = me.getDataset();
			var data = dataset.data[index];
			var pointElementOptions = me.chart.options.elements.point;
			var dsIndex = me.index;

			helpers.extend(point, {
				// Utility
				_xScale: xScale,
				_yScale: yScale,
				_datasetIndex: dsIndex,
				_index: index,

				// Desired view properties
				_model: {
					x: reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue(typeof data === 'object' ? data : NaN, index, dsIndex, me.chart.isCombo),
					y: reset ? yScale.getBasePixel() : yScale.getPixelForValue(data, index, dsIndex),
					// Appearance
					radius: reset ? 0 : custom.radius ? custom.radius : me.getRadius(data),

					// Tooltip
					hitRadius: custom.hitRadius ? custom.hitRadius : helpers.getValueAtIndexOrDefault(dataset.hitRadius, index, pointElementOptions.hitRadius)
				}
			});

			// Trick to reset the styles of the point
			Chart.DatasetController.prototype.removeHoverStyle.call(me, point, pointElementOptions);

			var model = point._model;
			model.skip = custom.skip ? custom.skip : (isNaN(model.x) || isNaN(model.y));

			point.pivot();
		},

		getRadius: function(value) {
			return value.r || this.chart.options.elements.point.radius;
		},

		setHoverStyle: function(point) {
			var me = this;
			Chart.DatasetController.prototype.setHoverStyle.call(me, point);

			// Radius
			var dataset = me.chart.data.datasets[point._datasetIndex];
			var index = point._index;
			var custom = point.custom || {};
			var model = point._model;
			model.radius = custom.hoverRadius ? custom.hoverRadius : (helpers.getValueAtIndexOrDefault(dataset.hoverRadius, index, me.chart.options.elements.point.hoverRadius)) + me.getRadius(dataset.data[index]);
		},

		removeHoverStyle: function(point) {
			var me = this;
			Chart.DatasetController.prototype.removeHoverStyle.call(me, point, me.chart.options.elements.point);

			var dataVal = me.chart.data.datasets[point._datasetIndex].data[point._index];
			var custom = point.custom || {};
			var model = point._model;

			model.radius = custom.radius ? custom.radius : me.getRadius(dataVal);
		}
	});
};

},{}],17:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers,
		defaults = Chart.defaults;

	defaults.doughnut = {
		animation: {
			// Boolean - Whether we animate the rotation of the Doughnut
			animateRotate: true,
			// Boolean - Whether we animate scaling the Doughnut from the centre
			animateScale: false
		},
		aspectRatio: 1,
		hover: {
			mode: 'single'
		},
		legendCallback: function(chart) {
			var text = [];
			text.push('<ul class="' + chart.id + '-legend">');

			var data = chart.data;
			var datasets = data.datasets;
			var labels = data.labels;

			if (datasets.length) {
				for (var i = 0; i < datasets[0].data.length; ++i) {
					text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
					if (labels[i]) {
						text.push(labels[i]);
					}
					text.push('</li>');
				}
			}

			text.push('</ul>');
			return text.join('');
		},
		legend: {
			labels: {
				generateLabels: function(chart) {
					var data = chart.data;
					if (data.labels.length && data.datasets.length) {
						return data.labels.map(function(label, i) {
							var meta = chart.getDatasetMeta(0);
							var ds = data.datasets[0];
							var arc = meta.data[i];
							var custom = arc && arc.custom || {};
							var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
							var arcOpts = chart.options.elements.arc;
							var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
							var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
							var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

							return {
								text: label,
								fillStyle: fill,
								strokeStyle: stroke,
								lineWidth: bw,
								hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

								// Extra data used for toggling the correct item
								index: i
							};
						});
					}
					return [];
				}
			},

			onClick: function(e, legendItem) {
				var index = legendItem.index;
				var chart = this.chart;
				var i, ilen, meta;

				for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
					meta = chart.getDatasetMeta(i);
					// toggle visibility of index if exists
					if (meta.data[index]) {
						meta.data[index].hidden = !meta.data[index].hidden;
					}
				}

				chart.update();
			}
		},

		// The percentage of the chart that we cut out of the middle.
		cutoutPercentage: 50,

		// The rotation of the chart, where the first data arc begins.
		rotation: Math.PI * -0.5,

		// The total circumference of the chart.
		circumference: Math.PI * 2.0,

		// Need to override these to give a nice default
		tooltips: {
			callbacks: {
				title: function() {
					return '';
				},
				label: function(tooltipItem, data) {
					return data.labels[tooltipItem.index] + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
				}
			}
		}
	};

	defaults.pie = helpers.clone(defaults.doughnut);
	helpers.extend(defaults.pie, {
		cutoutPercentage: 0
	});


	Chart.controllers.doughnut = Chart.controllers.pie = Chart.DatasetController.extend({

		dataElementType: Chart.elements.Arc,

		linkScales: helpers.noop,

		// Get index of the dataset in relation to the visible datasets. This allows determining the inner and outer radius correctly
		getRingIndex: function(datasetIndex) {
			var ringIndex = 0;

			for (var j = 0; j < datasetIndex; ++j) {
				if (this.chart.isDatasetVisible(j)) {
					++ringIndex;
				}
			}

			return ringIndex;
		},

		update: function(reset) {
			var me = this;
			var chart = me.chart,
				chartArea = chart.chartArea,
				opts = chart.options,
				arcOpts = opts.elements.arc,
				availableWidth = chartArea.right - chartArea.left - arcOpts.borderWidth,
				availableHeight = chartArea.bottom - chartArea.top - arcOpts.borderWidth,
				minSize = Math.min(availableWidth, availableHeight),
				offset = {
					x: 0,
					y: 0
				},
				meta = me.getMeta(),
				cutoutPercentage = opts.cutoutPercentage,
				circumference = opts.circumference;

			// If the chart's circumference isn't a full circle, calculate minSize as a ratio of the width/height of the arc
			if (circumference < Math.PI * 2.0) {
				var startAngle = opts.rotation % (Math.PI * 2.0);
				startAngle += Math.PI * 2.0 * (startAngle >= Math.PI ? -1 : startAngle < -Math.PI ? 1 : 0);
				var endAngle = startAngle + circumference;
				var start = {x: Math.cos(startAngle), y: Math.sin(startAngle)};
				var end = {x: Math.cos(endAngle), y: Math.sin(endAngle)};
				var contains0 = (startAngle <= 0 && 0 <= endAngle) || (startAngle <= Math.PI * 2.0 && Math.PI * 2.0 <= endAngle);
				var contains90 = (startAngle <= Math.PI * 0.5 && Math.PI * 0.5 <= endAngle) || (startAngle <= Math.PI * 2.5 && Math.PI * 2.5 <= endAngle);
				var contains180 = (startAngle <= -Math.PI && -Math.PI <= endAngle) || (startAngle <= Math.PI && Math.PI <= endAngle);
				var contains270 = (startAngle <= -Math.PI * 0.5 && -Math.PI * 0.5 <= endAngle) || (startAngle <= Math.PI * 1.5 && Math.PI * 1.5 <= endAngle);
				var cutout = cutoutPercentage / 100.0;
				var min = {x: contains180 ? -1 : Math.min(start.x * (start.x < 0 ? 1 : cutout), end.x * (end.x < 0 ? 1 : cutout)), y: contains270 ? -1 : Math.min(start.y * (start.y < 0 ? 1 : cutout), end.y * (end.y < 0 ? 1 : cutout))};
				var max = {x: contains0 ? 1 : Math.max(start.x * (start.x > 0 ? 1 : cutout), end.x * (end.x > 0 ? 1 : cutout)), y: contains90 ? 1 : Math.max(start.y * (start.y > 0 ? 1 : cutout), end.y * (end.y > 0 ? 1 : cutout))};
				var size = {width: (max.x - min.x) * 0.5, height: (max.y - min.y) * 0.5};
				minSize = Math.min(availableWidth / size.width, availableHeight / size.height);
				offset = {x: (max.x + min.x) * -0.5, y: (max.y + min.y) * -0.5};
			}

			chart.borderWidth = me.getMaxBorderWidth(meta.data);
			chart.outerRadius = Math.max((minSize - chart.borderWidth) / 2, 0);
			chart.innerRadius = Math.max(cutoutPercentage ? (chart.outerRadius / 100) * (cutoutPercentage) : 1, 0);
			chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();
			chart.offsetX = offset.x * chart.outerRadius;
			chart.offsetY = offset.y * chart.outerRadius;

			meta.total = me.calculateTotal();

			me.outerRadius = chart.outerRadius - (chart.radiusLength * me.getRingIndex(me.index));
			me.innerRadius = me.outerRadius - chart.radiusLength;

			helpers.each(meta.data, function(arc, index) {
				me.updateElement(arc, index, reset);
			});
		},

		updateElement: function(arc, index, reset) {
			var me = this;
			var chart = me.chart,
				chartArea = chart.chartArea,
				opts = chart.options,
				animationOpts = opts.animation,
				centerX = (chartArea.left + chartArea.right) / 2,
				centerY = (chartArea.top + chartArea.bottom) / 2,
				startAngle = opts.rotation, // non reset case handled later
				endAngle = opts.rotation, // non reset case handled later
				dataset = me.getDataset(),
				circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : me.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI)),
				innerRadius = reset && animationOpts.animateScale ? 0 : me.innerRadius,
				outerRadius = reset && animationOpts.animateScale ? 0 : me.outerRadius,
				valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;

			helpers.extend(arc, {
				// Utility
				_datasetIndex: me.index,
				_index: index,

				// Desired view properties
				_model: {
					x: centerX + chart.offsetX,
					y: centerY + chart.offsetY,
					startAngle: startAngle,
					endAngle: endAngle,
					circumference: circumference,
					outerRadius: outerRadius,
					innerRadius: innerRadius,
					label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
				}
			});

			var model = arc._model;
			// Resets the visual styles
			this.removeHoverStyle(arc);

			// Set correct angles if not resetting
			if (!reset || !animationOpts.animateRotate) {
				if (index === 0) {
					model.startAngle = opts.rotation;
				} else {
					model.startAngle = me.getMeta().data[index - 1]._model.endAngle;
				}

				model.endAngle = model.startAngle + model.circumference;
			}

			arc.pivot();
		},

		removeHoverStyle: function(arc) {
			Chart.DatasetController.prototype.removeHoverStyle.call(this, arc, this.chart.options.elements.arc);
		},

		calculateTotal: function() {
			var dataset = this.getDataset();
			var meta = this.getMeta();
			var total = 0;
			var value;

			helpers.each(meta.data, function(element, index) {
				value = dataset.data[index];
				if (!isNaN(value) && !element.hidden) {
					total += Math.abs(value);
				}
			});

			/* if (total === 0) {
				total = NaN;
			}*/

			return total;
		},

		calculateCircumference: function(value) {
			var total = this.getMeta().total;
			if (total > 0 && !isNaN(value)) {
				return (Math.PI * 2.0) * (value / total);
			}
			return 0;
		},

		// gets the max border or hover width to properly scale pie charts
		getMaxBorderWidth: function(elements) {
			var max = 0,
				index = this.index,
				length = elements.length,
				borderWidth,
				hoverWidth;

			for (var i = 0; i < length; i++) {
				borderWidth = elements[i]._model ? elements[i]._model.borderWidth : 0;
				hoverWidth = elements[i]._chart ? elements[i]._chart.config.data.datasets[index].hoverBorderWidth : 0;

				max = borderWidth > max ? borderWidth : max;
				max = hoverWidth > max ? hoverWidth : max;
			}
			return max;
		}
	});
};

},{}],18:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.line = {
		showLines: true,
		spanGaps: false,

		hover: {
			mode: 'label'
		},

		scales: {
			xAxes: [{
				type: 'category',
				id: 'x-axis-0'
			}],
			yAxes: [{
				type: 'linear',
				id: 'y-axis-0'
			}]
		}
	};

	function lineEnabled(dataset, options) {
		return helpers.getValueOrDefault(dataset.showLine, options.showLines);
	}

	Chart.controllers.line = Chart.DatasetController.extend({

		datasetElementType: Chart.elements.Line,

		dataElementType: Chart.elements.Point,

		addElementAndReset: function(index) {
			var me = this;
			var options = me.chart.options;
			var meta = me.getMeta();

			Chart.DatasetController.prototype.addElementAndReset.call(me, index);

			// Make sure bezier control points are updated
			if (lineEnabled(me.getDataset(), options) && meta.dataset._model.tension !== 0) {
				me.updateBezierControlPoints();
			}
		},

		update: function(reset) {
			var me = this;
			var meta = me.getMeta();
			var line = meta.dataset;
			var points = meta.data || [];
			var options = me.chart.options;
			var lineElementOptions = options.elements.line;
			var scale = me.getScaleForId(meta.yAxisID);
			var i, ilen, custom;
			var dataset = me.getDataset();
			var showLine = lineEnabled(dataset, options);

			// Update Line
			if (showLine) {
				custom = line.custom || {};

				// Compatibility: If the properties are defined with only the old name, use those values
				if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
					dataset.lineTension = dataset.tension;
				}

				// Utility
				line._scale = scale;
				line._datasetIndex = me.index;
				// Data
				line._children = points;
				// Model
				line._model = {
					// Appearance
					// The default behavior of lines is to break at null values, according
					// to https://github.com/chartjs/Chart.js/issues/2435#issuecomment-216718158
					// This option gives linse the ability to span gaps
					spanGaps: dataset.spanGaps ? dataset.spanGaps : options.spanGaps,
					tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.lineTension, lineElementOptions.tension),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : (dataset.backgroundColor || lineElementOptions.backgroundColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : (dataset.borderWidth || lineElementOptions.borderWidth),
					borderColor: custom.borderColor ? custom.borderColor : (dataset.borderColor || lineElementOptions.borderColor),
					borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : (dataset.borderCapStyle || lineElementOptions.borderCapStyle),
					borderDash: custom.borderDash ? custom.borderDash : (dataset.borderDash || lineElementOptions.borderDash),
					borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : (dataset.borderDashOffset || lineElementOptions.borderDashOffset),
					borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : (dataset.borderJoinStyle || lineElementOptions.borderJoinStyle),
					fill: custom.fill ? custom.fill : (dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill),
					steppedLine: custom.steppedLine ? custom.steppedLine : helpers.getValueOrDefault(dataset.steppedLine, lineElementOptions.stepped),
					cubicInterpolationMode: custom.cubicInterpolationMode ? custom.cubicInterpolationMode : helpers.getValueOrDefault(dataset.cubicInterpolationMode, lineElementOptions.cubicInterpolationMode),
					// Scale
					scaleTop: scale.top,
					scaleBottom: scale.bottom,
					scaleZero: scale.getBasePixel()
				};

				line.pivot();
			}

			// Update Points
			for (i=0, ilen=points.length; i<ilen; ++i) {
				me.updateElement(points[i], i, reset);
			}

			if (showLine && line._model.tension !== 0) {
				me.updateBezierControlPoints();
			}

			// Now pivot the point for animation
			for (i=0, ilen=points.length; i<ilen; ++i) {
				points[i].pivot();
			}
		},

		getPointBackgroundColor: function(point, index) {
			var backgroundColor = this.chart.options.elements.point.backgroundColor;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.backgroundColor) {
				backgroundColor = custom.backgroundColor;
			} else if (dataset.pointBackgroundColor) {
				backgroundColor = helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, backgroundColor);
			} else if (dataset.backgroundColor) {
				backgroundColor = dataset.backgroundColor;
			}

			return backgroundColor;
		},

		getPointBorderColor: function(point, index) {
			var borderColor = this.chart.options.elements.point.borderColor;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.borderColor) {
				borderColor = custom.borderColor;
			} else if (dataset.pointBorderColor) {
				borderColor = helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, borderColor);
			} else if (dataset.borderColor) {
				borderColor = dataset.borderColor;
			}

			return borderColor;
		},

		getPointBorderWidth: function(point, index) {
			var borderWidth = this.chart.options.elements.point.borderWidth;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.borderWidth) {
				borderWidth = custom.borderWidth;
			} else if (dataset.pointBorderWidth) {
				borderWidth = helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, borderWidth);
			} else if (dataset.borderWidth) {
				borderWidth = dataset.borderWidth;
			}

			return borderWidth;
		},

		updateElement: function(point, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var custom = point.custom || {};
			var dataset = me.getDataset();
			var datasetIndex = me.index;
			var value = dataset.data[index];
			var yScale = me.getScaleForId(meta.yAxisID);
			var xScale = me.getScaleForId(meta.xAxisID);
			var pointOptions = me.chart.options.elements.point;
			var x, y;
			var labels = me.chart.data.labels || [];
			var includeOffset = (labels.length === 1 || dataset.data.length === 1) || me.chart.isCombo;

			// Compatibility: If the properties are defined with only the old name, use those values
			if ((dataset.radius !== undefined) && (dataset.pointRadius === undefined)) {
				dataset.pointRadius = dataset.radius;
			}
			if ((dataset.hitRadius !== undefined) && (dataset.pointHitRadius === undefined)) {
				dataset.pointHitRadius = dataset.hitRadius;
			}

			x = xScale.getPixelForValue(typeof value === 'object' ? value : NaN, index, datasetIndex, includeOffset);
			y = reset ? yScale.getBasePixel() : me.calculatePointY(value, index, datasetIndex);

			// Utility
			point._xScale = xScale;
			point._yScale = yScale;
			point._datasetIndex = datasetIndex;
			point._index = index;

			// Desired view properties
			point._model = {
				x: x,
				y: y,
				skip: custom.skip || isNaN(x) || isNaN(y),
				// Appearance
				radius: custom.radius || helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, pointOptions.radius),
				pointStyle: custom.pointStyle || helpers.getValueAtIndexOrDefault(dataset.pointStyle, index, pointOptions.pointStyle),
				backgroundColor: me.getPointBackgroundColor(point, index),
				borderColor: me.getPointBorderColor(point, index),
				borderWidth: me.getPointBorderWidth(point, index),
				tension: meta.dataset._model ? meta.dataset._model.tension : 0,
				steppedLine: meta.dataset._model ? meta.dataset._model.steppedLine : false,
				// Tooltip
				hitRadius: custom.hitRadius || helpers.getValueAtIndexOrDefault(dataset.pointHitRadius, index, pointOptions.hitRadius)
			};
		},

		calculatePointY: function(value, index, datasetIndex) {
			var me = this;
			var chart = me.chart;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			var sumPos = 0;
			var sumNeg = 0;
			var i, ds, dsMeta;

			if (yScale.options.stacked) {
				for (i = 0; i < datasetIndex; i++) {
					ds = chart.data.datasets[i];
					dsMeta = chart.getDatasetMeta(i);
					if (dsMeta.type === 'line' && dsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i)) {
						var stackedRightValue = Number(yScale.getRightValue(ds.data[index]));
						if (stackedRightValue < 0) {
							sumNeg += stackedRightValue || 0;
						} else {
							sumPos += stackedRightValue || 0;
						}
					}
				}

				var rightValue = Number(yScale.getRightValue(value));
				if (rightValue < 0) {
					return yScale.getPixelForValue(sumNeg + rightValue);
				}
				return yScale.getPixelForValue(sumPos + rightValue);
			}

			return yScale.getPixelForValue(value);
		},

		updateBezierControlPoints: function() {
			var me = this;
			var meta = me.getMeta();
			var area = me.chart.chartArea;
			var points = (meta.data || []);
			var i, ilen, point, model, controlPoints;

			// Only consider points that are drawn in case the spanGaps option is used
			if (meta.dataset._model.spanGaps) {
				points = points.filter(function(pt) {
					return !pt._model.skip;
				});
			}

			function capControlPoint(pt, min, max) {
				return Math.max(Math.min(pt, max), min);
			}

			if (meta.dataset._model.cubicInterpolationMode === 'monotone') {
				helpers.splineCurveMonotone(points);
			} else {
				for (i = 0, ilen = points.length; i < ilen; ++i) {
					point = points[i];
					model = point._model;
					controlPoints = helpers.splineCurve(
						helpers.previousItem(points, i)._model,
						model,
						helpers.nextItem(points, i)._model,
						meta.dataset._model.tension
					);
					model.controlPointPreviousX = controlPoints.previous.x;
					model.controlPointPreviousY = controlPoints.previous.y;
					model.controlPointNextX = controlPoints.next.x;
					model.controlPointNextY = controlPoints.next.y;
				}
			}

			if (me.chart.options.elements.line.capBezierPoints) {
				for (i = 0, ilen = points.length; i < ilen; ++i) {
					model = points[i]._model;
					model.controlPointPreviousX = capControlPoint(model.controlPointPreviousX, area.left, area.right);
					model.controlPointPreviousY = capControlPoint(model.controlPointPreviousY, area.top, area.bottom);
					model.controlPointNextX = capControlPoint(model.controlPointNextX, area.left, area.right);
					model.controlPointNextY = capControlPoint(model.controlPointNextY, area.top, area.bottom);
				}
			}
		},

		draw: function(ease) {
			var me = this;
			var meta = me.getMeta();
			var points = meta.data || [];
			var easingDecimal = ease || 1;
			var i, ilen;

			// Transition Point Locations
			for (i=0, ilen=points.length; i<ilen; ++i) {
				points[i].transition(easingDecimal);
			}

			// Transition and Draw the line
			if (lineEnabled(me.getDataset(), me.chart.options)) {
				meta.dataset.transition(easingDecimal).draw();
			}

			// Draw the points
			for (i=0, ilen=points.length; i<ilen; ++i) {
				points[i].draw();
			}
		},

		setHoverStyle: function(point) {
			// Point
			var dataset = this.chart.data.datasets[point._datasetIndex];
			var index = point._index;
			var custom = point.custom || {};
			var model = point._model;

			model.radius = custom.hoverRadius || helpers.getValueAtIndexOrDefault(dataset.pointHoverRadius, index, this.chart.options.elements.point.hoverRadius);
			model.backgroundColor = custom.hoverBackgroundColor || helpers.getValueAtIndexOrDefault(dataset.pointHoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor || helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderColor, index, helpers.getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth || helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderWidth, index, model.borderWidth);
		},

		removeHoverStyle: function(point) {
			var me = this;
			var dataset = me.chart.data.datasets[point._datasetIndex];
			var index = point._index;
			var custom = point.custom || {};
			var model = point._model;

			// Compatibility: If the properties are defined with only the old name, use those values
			if ((dataset.radius !== undefined) && (dataset.pointRadius === undefined)) {
				dataset.pointRadius = dataset.radius;
			}

			model.radius = custom.radius || helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, me.chart.options.elements.point.radius);
			model.backgroundColor = me.getPointBackgroundColor(point, index);
			model.borderColor = me.getPointBorderColor(point, index);
			model.borderWidth = me.getPointBorderWidth(point, index);
		}
	});
};

},{}],19:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.polarArea = {

		scale: {
			type: 'radialLinear',
			lineArc: true, // so that lines are circular
			ticks: {
				beginAtZero: true
			}
		},

		// Boolean - Whether to animate the rotation of the chart
		animation: {
			animateRotate: true,
			animateScale: true
		},

		startAngle: -0.5 * Math.PI,
		aspectRatio: 1,
		legendCallback: function(chart) {
			var text = [];
			text.push('<ul class="' + chart.id + '-legend">');

			var data = chart.data;
			var datasets = data.datasets;
			var labels = data.labels;

			if (datasets.length) {
				for (var i = 0; i < datasets[0].data.length; ++i) {
					text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '">');
					if (labels[i]) {
						text.push(labels[i]);
					}
					text.push('</span></li>');
				}
			}

			text.push('</ul>');
			return text.join('');
		},
		legend: {
			labels: {
				generateLabels: function(chart) {
					var data = chart.data;
					if (data.labels.length && data.datasets.length) {
						return data.labels.map(function(label, i) {
							var meta = chart.getDatasetMeta(0);
							var ds = data.datasets[0];
							var arc = meta.data[i];
							var custom = arc.custom || {};
							var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
							var arcOpts = chart.options.elements.arc;
							var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
							var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
							var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

							return {
								text: label,
								fillStyle: fill,
								strokeStyle: stroke,
								lineWidth: bw,
								hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

								// Extra data used for toggling the correct item
								index: i
							};
						});
					}
					return [];
				}
			},

			onClick: function(e, legendItem) {
				var index = legendItem.index;
				var chart = this.chart;
				var i, ilen, meta;

				for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
					meta = chart.getDatasetMeta(i);
					meta.data[index].hidden = !meta.data[index].hidden;
				}

				chart.update();
			}
		},

		// Need to override these to give a nice default
		tooltips: {
			callbacks: {
				title: function() {
					return '';
				},
				label: function(tooltipItem, data) {
					return data.labels[tooltipItem.index] + ': ' + tooltipItem.yLabel;
				}
			}
		}
	};

	Chart.controllers.polarArea = Chart.DatasetController.extend({

		dataElementType: Chart.elements.Arc,

		linkScales: helpers.noop,

		update: function(reset) {
			var me = this;
			var chart = me.chart;
			var chartArea = chart.chartArea;
			var meta = me.getMeta();
			var opts = chart.options;
			var arcOpts = opts.elements.arc;
			var minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
			chart.outerRadius = Math.max((minSize - arcOpts.borderWidth / 2) / 2, 0);
			chart.innerRadius = Math.max(opts.cutoutPercentage ? (chart.outerRadius / 100) * (opts.cutoutPercentage) : 1, 0);
			chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();

			me.outerRadius = chart.outerRadius - (chart.radiusLength * me.index);
			me.innerRadius = me.outerRadius - chart.radiusLength;

			meta.count = me.countVisibleElements();

			helpers.each(meta.data, function(arc, index) {
				me.updateElement(arc, index, reset);
			});
		},

		updateElement: function(arc, index, reset) {
			var me = this;
			var chart = me.chart;
			var dataset = me.getDataset();
			var opts = chart.options;
			var animationOpts = opts.animation;
			var scale = chart.scale;
			var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
			var labels = chart.data.labels;

			var circumference = me.calculateCircumference(dataset.data[index]);
			var centerX = scale.xCenter;
			var centerY = scale.yCenter;

			// If there is NaN data before us, we need to calculate the starting angle correctly.
			// We could be way more efficient here, but its unlikely that the polar area chart will have a lot of data
			var visibleCount = 0;
			var meta = me.getMeta();
			for (var i = 0; i < index; ++i) {
				if (!isNaN(dataset.data[i]) && !meta.data[i].hidden) {
					++visibleCount;
				}
			}

			// var negHalfPI = -0.5 * Math.PI;
			var datasetStartAngle = opts.startAngle;
			var distance = arc.hidden ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);
			var startAngle = datasetStartAngle + (circumference * visibleCount);
			var endAngle = startAngle + (arc.hidden ? 0 : circumference);

			var resetRadius = animationOpts.animateScale ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);

			helpers.extend(arc, {
				// Utility
				_datasetIndex: me.index,
				_index: index,
				_scale: scale,

				// Desired view properties
				_model: {
					x: centerX,
					y: centerY,
					innerRadius: 0,
					outerRadius: reset ? resetRadius : distance,
					startAngle: reset && animationOpts.animateRotate ? datasetStartAngle : startAngle,
					endAngle: reset && animationOpts.animateRotate ? datasetStartAngle : endAngle,
					label: getValueAtIndexOrDefault(labels, index, labels[index])
				}
			});

			// Apply border and fill style
			me.removeHoverStyle(arc);

			arc.pivot();
		},

		removeHoverStyle: function(arc) {
			Chart.DatasetController.prototype.removeHoverStyle.call(this, arc, this.chart.options.elements.arc);
		},

		countVisibleElements: function() {
			var dataset = this.getDataset();
			var meta = this.getMeta();
			var count = 0;

			helpers.each(meta.data, function(element, index) {
				if (!isNaN(dataset.data[index]) && !element.hidden) {
					count++;
				}
			});

			return count;
		},

		calculateCircumference: function(value) {
			var count = this.getMeta().count;
			if (count > 0 && !isNaN(value)) {
				return (2 * Math.PI) / count;
			}
			return 0;
		}
	});
};

},{}],20:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.radar = {
		scale: {
			type: 'radialLinear'
		},
		elements: {
			line: {
				tension: 0 // no bezier in radar
			}
		}
	};

	Chart.controllers.radar = Chart.DatasetController.extend({

		datasetElementType: Chart.elements.Line,

		dataElementType: Chart.elements.Point,

		linkScales: helpers.noop,

		addElementAndReset: function(index) {
			Chart.DatasetController.prototype.addElementAndReset.call(this, index);

			// Make sure bezier control points are updated
			this.updateBezierControlPoints();
		},

		update: function(reset) {
			var me = this;
			var meta = me.getMeta();
			var line = meta.dataset;
			var points = meta.data;
			var custom = line.custom || {};
			var dataset = me.getDataset();
			var lineElementOptions = me.chart.options.elements.line;
			var scale = me.chart.scale;

			// Compatibility: If the properties are defined with only the old name, use those values
			if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
				dataset.lineTension = dataset.tension;
			}

			helpers.extend(meta.dataset, {
				// Utility
				_datasetIndex: me.index,
				// Data
				_children: points,
				_loop: true,
				// Model
				_model: {
					// Appearance
					tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.lineTension, lineElementOptions.tension),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : (dataset.backgroundColor || lineElementOptions.backgroundColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : (dataset.borderWidth || lineElementOptions.borderWidth),
					borderColor: custom.borderColor ? custom.borderColor : (dataset.borderColor || lineElementOptions.borderColor),
					fill: custom.fill ? custom.fill : (dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill),
					borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : (dataset.borderCapStyle || lineElementOptions.borderCapStyle),
					borderDash: custom.borderDash ? custom.borderDash : (dataset.borderDash || lineElementOptions.borderDash),
					borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : (dataset.borderDashOffset || lineElementOptions.borderDashOffset),
					borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : (dataset.borderJoinStyle || lineElementOptions.borderJoinStyle),

					// Scale
					scaleTop: scale.top,
					scaleBottom: scale.bottom,
					scaleZero: scale.getBasePosition()
				}
			});

			meta.dataset.pivot();

			// Update Points
			helpers.each(points, function(point, index) {
				me.updateElement(point, index, reset);
			}, me);


			// Update bezier control points
			me.updateBezierControlPoints();
		},
		updateElement: function(point, index, reset) {
			var me = this;
			var custom = point.custom || {};
			var dataset = me.getDataset();
			var scale = me.chart.scale;
			var pointElementOptions = me.chart.options.elements.point;
			var pointPosition = scale.getPointPositionForValue(index, dataset.data[index]);

			helpers.extend(point, {
				// Utility
				_datasetIndex: me.index,
				_index: index,
				_scale: scale,

				// Desired view properties
				_model: {
					x: reset ? scale.xCenter : pointPosition.x, // value not used in dataset scale, but we want a consistent API between scales
					y: reset ? scale.yCenter : pointPosition.y,

					// Appearance
					tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.tension, me.chart.options.elements.line.tension),
					radius: custom.radius ? custom.radius : helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, pointElementOptions.radius),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, pointElementOptions.backgroundColor),
					borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, pointElementOptions.borderColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, pointElementOptions.borderWidth),
					pointStyle: custom.pointStyle ? custom.pointStyle : helpers.getValueAtIndexOrDefault(dataset.pointStyle, index, pointElementOptions.pointStyle),

					// Tooltip
					hitRadius: custom.hitRadius ? custom.hitRadius : helpers.getValueAtIndexOrDefault(dataset.hitRadius, index, pointElementOptions.hitRadius)
				}
			});

			point._model.skip = custom.skip ? custom.skip : (isNaN(point._model.x) || isNaN(point._model.y));
		},
		updateBezierControlPoints: function() {
			var chartArea = this.chart.chartArea;
			var meta = this.getMeta();

			helpers.each(meta.data, function(point, index) {
				var model = point._model;
				var controlPoints = helpers.splineCurve(
					helpers.previousItem(meta.data, index, true)._model,
					model,
					helpers.nextItem(meta.data, index, true)._model,
					model.tension
				);

				// Prevent the bezier going outside of the bounds of the graph
				model.controlPointPreviousX = Math.max(Math.min(controlPoints.previous.x, chartArea.right), chartArea.left);
				model.controlPointPreviousY = Math.max(Math.min(controlPoints.previous.y, chartArea.bottom), chartArea.top);

				model.controlPointNextX = Math.max(Math.min(controlPoints.next.x, chartArea.right), chartArea.left);
				model.controlPointNextY = Math.max(Math.min(controlPoints.next.y, chartArea.bottom), chartArea.top);

				// Now pivot the point for animation
				point.pivot();
			});
		},

		draw: function(ease) {
			var meta = this.getMeta();
			var easingDecimal = ease || 1;

			// Transition Point Locations
			helpers.each(meta.data, function(point) {
				point.transition(easingDecimal);
			});

			// Transition and Draw the line
			meta.dataset.transition(easingDecimal).draw();

			// Draw the points
			helpers.each(meta.data, function(point) {
				point.draw();
			});
		},

		setHoverStyle: function(point) {
			// Point
			var dataset = this.chart.data.datasets[point._datasetIndex];
			var custom = point.custom || {};
			var index = point._index;
			var model = point._model;

			model.radius = custom.hoverRadius ? custom.hoverRadius : helpers.getValueAtIndexOrDefault(dataset.pointHoverRadius, index, this.chart.options.elements.point.hoverRadius);
			model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointHoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderColor, index, helpers.getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderWidth, index, model.borderWidth);
		},

		removeHoverStyle: function(point) {
			var dataset = this.chart.data.datasets[point._datasetIndex];
			var custom = point.custom || {};
			var index = point._index;
			var model = point._model;
			var pointElementOptions = this.chart.options.elements.point;

			model.radius = custom.radius ? custom.radius : helpers.getValueAtIndexOrDefault(dataset.radius, index, pointElementOptions.radius);
			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, pointElementOptions.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, pointElementOptions.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, pointElementOptions.borderWidth);
		}
	});
};

},{}],21:[function(require,module,exports){
/* global window: false */
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.global.animation = {
		duration: 1000,
		easing: 'easeOutQuart',
		onProgress: helpers.noop,
		onComplete: helpers.noop
	};

	Chart.Animation = Chart.Element.extend({
		currentStep: null, // the current animation step
		numSteps: 60, // default number of steps
		easing: '', // the easing to use for this animation
		render: null, // render function used by the animation service

		onAnimationProgress: null, // user specified callback to fire on each step of the animation
		onAnimationComplete: null // user specified callback to fire when the animation finishes
	});

	Chart.animationService = {
		frameDuration: 17,
		animations: [],
		dropFrames: 0,
		request: null,
		addAnimation: function(chartInstance, animationObject, duration, lazy) {
			var me = this;

			if (!lazy) {
				chartInstance.animating = true;
			}

			for (var index = 0; index < me.animations.length; ++index) {
				if (me.animations[index].chartInstance === chartInstance) {
					// replacing an in progress animation
					me.animations[index].animationObject = animationObject;
					return;
				}
			}

			me.animations.push({
				chartInstance: chartInstance,
				animationObject: animationObject
			});

			// If there are no animations queued, manually kickstart a digest, for lack of a better word
			if (me.animations.length === 1) {
				me.requestAnimationFrame();
			}
		},
		// Cancel the animation for a given chart instance
		cancelAnimation: function(chartInstance) {
			var index = helpers.findIndex(this.animations, function(animationWrapper) {
				return animationWrapper.chartInstance === chartInstance;
			});

			if (index !== -1) {
				this.animations.splice(index, 1);
				chartInstance.animating = false;
			}
		},
		requestAnimationFrame: function() {
			var me = this;
			if (me.request === null) {
				// Skip animation frame requests until the active one is executed.
				// This can happen when processing mouse events, e.g. 'mousemove'
				// and 'mouseout' events will trigger multiple renders.
				me.request = helpers.requestAnimFrame.call(window, function() {
					me.request = null;
					me.startDigest();
				});
			}
		},
		startDigest: function() {
			var me = this;

			var startTime = Date.now();
			var framesToDrop = 0;

			if (me.dropFrames > 1) {
				framesToDrop = Math.floor(me.dropFrames);
				me.dropFrames = me.dropFrames % 1;
			}

			var i = 0;
			while (i < me.animations.length) {
				if (me.animations[i].animationObject.currentStep === null) {
					me.animations[i].animationObject.currentStep = 0;
				}

				me.animations[i].animationObject.currentStep += 1 + framesToDrop;

				if (me.animations[i].animationObject.currentStep > me.animations[i].animationObject.numSteps) {
					me.animations[i].animationObject.currentStep = me.animations[i].animationObject.numSteps;
				}

				me.animations[i].animationObject.render(me.animations[i].chartInstance, me.animations[i].animationObject);
				if (me.animations[i].animationObject.onAnimationProgress && me.animations[i].animationObject.onAnimationProgress.call) {
					me.animations[i].animationObject.onAnimationProgress.call(me.animations[i].chartInstance, me.animations[i]);
				}

				if (me.animations[i].animationObject.currentStep === me.animations[i].animationObject.numSteps) {
					if (me.animations[i].animationObject.onAnimationComplete && me.animations[i].animationObject.onAnimationComplete.call) {
						me.animations[i].animationObject.onAnimationComplete.call(me.animations[i].chartInstance, me.animations[i]);
					}

					// executed the last frame. Remove the animation.
					me.animations[i].chartInstance.animating = false;

					me.animations.splice(i, 1);
				} else {
					++i;
				}
			}

			var endTime = Date.now();
			var dropFrames = (endTime - startTime) / me.frameDuration;

			me.dropFrames += dropFrames;

			// Do we have more stuff to animate?
			if (me.animations.length > 0) {
				me.requestAnimationFrame();
			}
		}
	};
};

},{}],22:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {
	// Global Chart canvas helpers object for drawing items to canvas
	var helpers = Chart.canvasHelpers = {};

	helpers.drawPoint = function(ctx, pointStyle, radius, x, y) {
		var type, edgeLength, xOffset, yOffset, height, size;

		if (typeof pointStyle === 'object') {
			type = pointStyle.toString();
			if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
				ctx.drawImage(pointStyle, x - pointStyle.width / 2, y - pointStyle.height / 2);
				return;
			}
		}

		if (isNaN(radius) || radius <= 0) {
			return;
		}

		switch (pointStyle) {
		// Default includes circle
		default:
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
			break;
		case 'triangle':
			ctx.beginPath();
			edgeLength = 3 * radius / Math.sqrt(3);
			height = edgeLength * Math.sqrt(3) / 2;
			ctx.moveTo(x - edgeLength / 2, y + height / 3);
			ctx.lineTo(x + edgeLength / 2, y + height / 3);
			ctx.lineTo(x, y - 2 * height / 3);
			ctx.closePath();
			ctx.fill();
			break;
		case 'rect':
			size = 1 / Math.SQRT2 * radius;
			ctx.beginPath();
			ctx.fillRect(x - size, y - size, 2 * size, 2 * size);
			ctx.strokeRect(x - size, y - size, 2 * size, 2 * size);
			break;
		case 'rectRot':
			size = 1 / Math.SQRT2 * radius;
			ctx.beginPath();
			ctx.moveTo(x - size, y);
			ctx.lineTo(x, y + size);
			ctx.lineTo(x + size, y);
			ctx.lineTo(x, y - size);
			ctx.closePath();
			ctx.fill();
			break;
		case 'cross':
			ctx.beginPath();
			ctx.moveTo(x, y + radius);
			ctx.lineTo(x, y - radius);
			ctx.moveTo(x - radius, y);
			ctx.lineTo(x + radius, y);
			ctx.closePath();
			break;
		case 'crossRot':
			ctx.beginPath();
			xOffset = Math.cos(Math.PI / 4) * radius;
			yOffset = Math.sin(Math.PI / 4) * radius;
			ctx.moveTo(x - xOffset, y - yOffset);
			ctx.lineTo(x + xOffset, y + yOffset);
			ctx.moveTo(x - xOffset, y + yOffset);
			ctx.lineTo(x + xOffset, y - yOffset);
			ctx.closePath();
			break;
		case 'star':
			ctx.beginPath();
			ctx.moveTo(x, y + radius);
			ctx.lineTo(x, y - radius);
			ctx.moveTo(x - radius, y);
			ctx.lineTo(x + radius, y);
			xOffset = Math.cos(Math.PI / 4) * radius;
			yOffset = Math.sin(Math.PI / 4) * radius;
			ctx.moveTo(x - xOffset, y - yOffset);
			ctx.lineTo(x + xOffset, y + yOffset);
			ctx.moveTo(x - xOffset, y + yOffset);
			ctx.lineTo(x + xOffset, y - yOffset);
			ctx.closePath();
			break;
		case 'line':
			ctx.beginPath();
			ctx.moveTo(x - radius, y);
			ctx.lineTo(x + radius, y);
			ctx.closePath();
			break;
		case 'dash':
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + radius, y);
			ctx.closePath();
			break;
		}

		ctx.stroke();
	};
};

},{}],23:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	// Create a dictionary of chart types, to allow for extension of existing types
	Chart.types = {};

	// Store a reference to each instance - allowing us to globally resize chart instances on window resize.
	// Destroy method on the chart will remove the instance of the chart from this reference.
	Chart.instances = {};

	// Controllers available for dataset visualization eg. bar, line, slice, etc.
	Chart.controllers = {};

	/**
	 * @class Chart.Controller
	 * The main controller of a chart.
	 */
	Chart.Controller = function(instance) {

		this.chart = instance;
		this.config = instance.config;
		this.options = this.config.options = helpers.configMerge(Chart.defaults.global, Chart.defaults[this.config.type], this.config.options || {});
		this.id = helpers.uid();

		Object.defineProperty(this, 'data', {
			get: function() {
				return this.config.data;
			}
		});

		// Add the chart instance to the global namespace
		Chart.instances[this.id] = this;

		if (this.options.responsive) {
			// Silent resize before chart draws
			this.resize(true);
		}

		this.initialize();

		return this;
	};

	helpers.extend(Chart.Controller.prototype, /** @lends Chart.Controller */ {

		initialize: function() {
			var me = this;
			// Before init plugin notification
			Chart.plugins.notify('beforeInit', [me]);

			me.bindEvents();

			// Make sure controllers are built first so that each dataset is bound to an axis before the scales
			// are built
			me.ensureScalesHaveIDs();
			me.buildOrUpdateControllers();
			me.buildScales();
			me.updateLayout();
			me.resetElements();
			me.initToolTip();
			me.update();

			// After init plugin notification
			Chart.plugins.notify('afterInit', [me]);

			return me;
		},

		clear: function() {
			helpers.clear(this.chart);
			return this;
		},

		stop: function() {
			// Stops any current animation loop occuring
			Chart.animationService.cancelAnimation(this);
			return this;
		},

		resize: function(silent) {
			var me = this;
			var chart = me.chart;
			var canvas = chart.canvas;
			var newWidth = helpers.getMaximumWidth(canvas);
			var aspectRatio = chart.aspectRatio;
			var newHeight = (me.options.maintainAspectRatio && isNaN(aspectRatio) === false && isFinite(aspectRatio) && aspectRatio !== 0) ? newWidth / aspectRatio : helpers.getMaximumHeight(canvas);

			var sizeChanged = chart.width !== newWidth || chart.height !== newHeight;

			if (!sizeChanged) {
				return me;
			}

			canvas.width = chart.width = newWidth;
			canvas.height = chart.height = newHeight;

			helpers.retinaScale(chart);

			// Notify any plugins about the resize
			var newSize = {width: newWidth, height: newHeight};
			Chart.plugins.notify('resize', [me, newSize]);

			// Notify of resize
			if (me.options.onResize) {
				me.options.onResize(me, newSize);
			}

			if (!silent) {
				me.stop();
				me.update(me.options.responsiveAnimationDuration);
			}

			return me;
		},

		ensureScalesHaveIDs: function() {
			var options = this.options;
			var scalesOptions = options.scales || {};
			var scaleOptions = options.scale;

			helpers.each(scalesOptions.xAxes, function(xAxisOptions, index) {
				xAxisOptions.id = xAxisOptions.id || ('x-axis-' + index);
			});

			helpers.each(scalesOptions.yAxes, function(yAxisOptions, index) {
				yAxisOptions.id = yAxisOptions.id || ('y-axis-' + index);
			});

			if (scaleOptions) {
				scaleOptions.id = scaleOptions.id || 'scale';
			}
		},

		/**
		 * Builds a map of scale ID to scale object for future lookup.
		 */
		buildScales: function() {
			var me = this;
			var options = me.options;
			var scales = me.scales = {};
			var items = [];

			if (options.scales) {
				items = items.concat(
					(options.scales.xAxes || []).map(function(xAxisOptions) {
						return {options: xAxisOptions, dtype: 'category'};
					}),
					(options.scales.yAxes || []).map(function(yAxisOptions) {
						return {options: yAxisOptions, dtype: 'linear'};
					})
				);
			}

			if (options.scale) {
				items.push({options: options.scale, dtype: 'radialLinear', isDefault: true});
			}

			helpers.each(items, function(item) {
				var scaleOptions = item.options;
				var scaleType = helpers.getValueOrDefault(scaleOptions.type, item.dtype);
				var scaleClass = Chart.scaleService.getScaleConstructor(scaleType);
				if (!scaleClass) {
					return;
				}

				var scale = new scaleClass({
					id: scaleOptions.id,
					options: scaleOptions,
					ctx: me.chart.ctx,
					chart: me
				});

				scales[scale.id] = scale;

				// TODO(SB): I think we should be able to remove this custom case (options.scale)
				// and consider it as a regular scale part of the "scales"" map only! This would
				// make the logic easier and remove some useless? custom code.
				if (item.isDefault) {
					me.scale = scale;
				}
			});

			Chart.scaleService.addScalesToLayout(this);
		},

		updateLayout: function() {
			Chart.layoutService.update(this, this.chart.width, this.chart.height);
		},

		buildOrUpdateControllers: function() {
			var me = this;
			var types = [];
			var newControllers = [];

			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				var meta = me.getDatasetMeta(datasetIndex);
				if (!meta.type) {
					meta.type = dataset.type || me.config.type;
				}

				types.push(meta.type);

				if (meta.controller) {
					meta.controller.updateIndex(datasetIndex);
				} else {
					meta.controller = new Chart.controllers[meta.type](me, datasetIndex);
					newControllers.push(meta.controller);
				}
			}, me);

			if (types.length > 1) {
				for (var i = 1; i < types.length; i++) {
					if (types[i] !== types[i - 1]) {
						me.isCombo = true;
						break;
					}
				}
			}

			return newControllers;
		},

		resetElements: function() {
			var me = this;
			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				me.getDatasetMeta(datasetIndex).controller.reset();
			}, me);
		},

		update: function(animationDuration, lazy) {
			var me = this;
			Chart.plugins.notify('beforeUpdate', [me]);

			// In case the entire data object changed
			me.tooltip._data = me.data;

			// Make sure dataset controllers are updated and new controllers are reset
			var newControllers = me.buildOrUpdateControllers();

			// Make sure all dataset controllers have correct meta data counts
			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				me.getDatasetMeta(datasetIndex).controller.buildOrUpdateElements();
			}, me);

			Chart.layoutService.update(me, me.chart.width, me.chart.height);

			// Apply changes to the dataets that require the scales to have been calculated i.e BorderColor chages
			Chart.plugins.notify('afterScaleUpdate', [me]);

			// Can only reset the new controllers after the scales have been updated
			helpers.each(newControllers, function(controller) {
				controller.reset();
			});

			me.updateDatasets();

			// Do this before render so that any plugins that need final scale updates can use it
			Chart.plugins.notify('afterUpdate', [me]);

			me.render(animationDuration, lazy);
		},

		/**
		 * @method beforeDatasetsUpdate
		 * @description Called before all datasets are updated. If a plugin returns false,
		 * the datasets update will be cancelled until another chart update is triggered.
		 * @param {Object} instance the chart instance being updated.
		 * @returns {Boolean} false to cancel the datasets update.
		 * @memberof Chart.PluginBase
		 * @since version 2.1.5
		 * @instance
		 */

		/**
		 * @method afterDatasetsUpdate
		 * @description Called after all datasets have been updated. Note that this
		 * extension will not be called if the datasets update has been cancelled.
		 * @param {Object} instance the chart instance being updated.
		 * @memberof Chart.PluginBase
		 * @since version 2.1.5
		 * @instance
		 */

		/**
		 * Updates all datasets unless a plugin returns false to the beforeDatasetsUpdate
		 * extension, in which case no datasets will be updated and the afterDatasetsUpdate
		 * notification will be skipped.
		 * @protected
		 * @instance
		 */
		updateDatasets: function() {
			var me = this;
			var i, ilen;

			if (Chart.plugins.notify('beforeDatasetsUpdate', [me])) {
				for (i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
					me.getDatasetMeta(i).controller.update();
				}

				Chart.plugins.notify('afterDatasetsUpdate', [me]);
			}
		},

		render: function(duration, lazy) {
			var me = this;
			Chart.plugins.notify('beforeRender', [me]);

			var animationOptions = me.options.animation;
			if (animationOptions && ((typeof duration !== 'undefined' && duration !== 0) || (typeof duration === 'undefined' && animationOptions.duration !== 0))) {
				var animation = new Chart.Animation();
				animation.numSteps = (duration || animationOptions.duration) / 16.66; // 60 fps
				animation.easing = animationOptions.easing;

				// render function
				animation.render = function(chartInstance, animationObject) {
					var easingFunction = helpers.easingEffects[animationObject.easing];
					var stepDecimal = animationObject.currentStep / animationObject.numSteps;
					var easeDecimal = easingFunction(stepDecimal);

					chartInstance.draw(easeDecimal, stepDecimal, animationObject.currentStep);
				};

				// user events
				animation.onAnimationProgress = animationOptions.onProgress;
				animation.onAnimationComplete = animationOptions.onComplete;

				Chart.animationService.addAnimation(me, animation, duration, lazy);
			} else {
				me.draw();
				if (animationOptions && animationOptions.onComplete && animationOptions.onComplete.call) {
					animationOptions.onComplete.call(me);
				}
			}
			return me;
		},

		draw: function(ease) {
			var me = this;
			var easingDecimal = ease || 1;
			me.clear();

			Chart.plugins.notify('beforeDraw', [me, easingDecimal]);

			// Draw all the scales
			helpers.each(me.boxes, function(box) {
				box.draw(me.chartArea);
			}, me);
			if (me.scale) {
				me.scale.draw();
			}

			Chart.plugins.notify('beforeDatasetsDraw', [me, easingDecimal]);

			// Draw each dataset via its respective controller (reversed to support proper line stacking)
			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				if (me.isDatasetVisible(datasetIndex)) {
					me.getDatasetMeta(datasetIndex).controller.draw(ease);
				}
			}, me, true);

			Chart.plugins.notify('afterDatasetsDraw', [me, easingDecimal]);

			// Finally draw the tooltip
			me.tooltip.transition(easingDecimal).draw();

			Chart.plugins.notify('afterDraw', [me, easingDecimal]);
		},

		// Get the single element that was clicked on
		// @return : An object containing the dataset index and element index of the matching element. Also contains the rectangle that was draw
		getElementAtEvent: function(e) {
			var me = this;
			var eventPosition = helpers.getRelativePosition(e, me.chart);
			var elementsArray = [];

			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				if (me.isDatasetVisible(datasetIndex)) {
					var meta = me.getDatasetMeta(datasetIndex);
					helpers.each(meta.data, function(element) {
						if (element.inRange(eventPosition.x, eventPosition.y)) {
							elementsArray.push(element);
							return elementsArray;
						}
					});
				}
			});

			return elementsArray.slice(0, 1);
		},

		getElementsAtEvent: function(e) {
			var me = this;
			var eventPosition = helpers.getRelativePosition(e, me.chart);
			var elementsArray = [];

			var found = function() {
				if (me.data.datasets) {
					for (var i = 0; i < me.data.datasets.length; i++) {
						var meta = me.getDatasetMeta(i);
						if (me.isDatasetVisible(i)) {
							for (var j = 0; j < meta.data.length; j++) {
								if (meta.data[j].inRange(eventPosition.x, eventPosition.y)) {
									return meta.data[j];
								}
							}
						}
					}
				}
			}.call(me);

			if (!found) {
				return elementsArray;
			}

			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				if (me.isDatasetVisible(datasetIndex)) {
					var meta = me.getDatasetMeta(datasetIndex),
						element = meta.data[found._index];
					if (element && !element._view.skip) {
						elementsArray.push(element);
					}
				}
			}, me);

			return elementsArray;
		},

		getElementsAtXAxis: function(e) {
			var me = this;
			var eventPosition = helpers.getRelativePosition(e, me.chart);
			var elementsArray = [];

			var found = function() {
				if (me.data.datasets) {
					for (var i = 0; i < me.data.datasets.length; i++) {
						var meta = me.getDatasetMeta(i);
						if (me.isDatasetVisible(i)) {
							for (var j = 0; j < meta.data.length; j++) {
								if (meta.data[j].inLabelRange(eventPosition.x, eventPosition.y)) {
									return meta.data[j];
								}
							}
						}
					}
				}
			}.call(me);

			if (!found) {
				return elementsArray;
			}

			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				if (me.isDatasetVisible(datasetIndex)) {
					var meta = me.getDatasetMeta(datasetIndex);
					var index = helpers.findIndex(meta.data, function(it) {
						return found._model.x === it._model.x;
					});
					if (index !== -1 && !meta.data[index]._view.skip) {
						elementsArray.push(meta.data[index]);
					}
				}
			}, me);

			return elementsArray;
		},

		getElementsAtEventForMode: function(e, mode) {
			var me = this;
			switch (mode) {
			case 'single':
				return me.getElementAtEvent(e);
			case 'label':
				return me.getElementsAtEvent(e);
			case 'dataset':
				return me.getDatasetAtEvent(e);
			case 'x-axis':
				return me.getElementsAtXAxis(e);
			default:
				return e;
			}
		},

		getDatasetAtEvent: function(e) {
			var elementsArray = this.getElementAtEvent(e);

			if (elementsArray.length > 0) {
				elementsArray = this.getDatasetMeta(elementsArray[0]._datasetIndex).data;
			}

			return elementsArray;
		},

		getDatasetMeta: function(datasetIndex) {
			var me = this;
			var dataset = me.data.datasets[datasetIndex];
			if (!dataset._meta) {
				dataset._meta = {};
			}

			var meta = dataset._meta[me.id];
			if (!meta) {
				meta = dataset._meta[me.id] = {
					type: null,
					data: [],
					dataset: null,
					controller: null,
					hidden: null,			// See isDatasetVisible() comment
					xAxisID: null,
					yAxisID: null
				};
			}

			return meta;
		},

		getVisibleDatasetCount: function() {
			var count = 0;
			for (var i = 0, ilen = this.data.datasets.length; i<ilen; ++i) {
				if (this.isDatasetVisible(i)) {
					count++;
				}
			}
			return count;
		},

		isDatasetVisible: function(datasetIndex) {
			var meta = this.getDatasetMeta(datasetIndex);

			// meta.hidden is a per chart dataset hidden flag override with 3 states: if true or false,
			// the dataset.hidden value is ignored, else if null, the dataset hidden state is returned.
			return typeof meta.hidden === 'boolean'? !meta.hidden : !this.data.datasets[datasetIndex].hidden;
		},

		generateLegend: function() {
			return this.options.legendCallback(this);
		},

		destroy: function() {
			var me = this;
			me.stop();
			me.clear();
			helpers.unbindEvents(me, me.events);
			helpers.removeResizeListener(me.chart.canvas.parentNode);

			// Reset canvas height/width attributes
			var canvas = me.chart.canvas;
			canvas.width = me.chart.width;
			canvas.height = me.chart.height;

			// if we scaled the canvas in response to a devicePixelRatio !== 1, we need to undo that transform here
			if (me.chart.originalDevicePixelRatio !== undefined) {
				me.chart.ctx.scale(1 / me.chart.originalDevicePixelRatio, 1 / me.chart.originalDevicePixelRatio);
			}

			// Reset to the old style since it may have been changed by the device pixel ratio changes
			canvas.style.width = me.chart.originalCanvasStyleWidth;
			canvas.style.height = me.chart.originalCanvasStyleHeight;

			Chart.plugins.notify('destroy', [me]);

			delete Chart.instances[me.id];
		},

		toBase64Image: function() {
			return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
		},

		initToolTip: function() {
			var me = this;
			me.tooltip = new Chart.Tooltip({
				_chart: me.chart,
				_chartInstance: me,
				_data: me.data,
				_options: me.options.tooltips
			}, me);
		},

		bindEvents: function() {
			var me = this;
			helpers.bindEvents(me, me.options.events, function(evt) {
				me.eventHandler(evt);
			});
		},

		updateHoverStyle: function(elements, mode, enabled) {
			var method = enabled? 'setHoverStyle' : 'removeHoverStyle';
			var element, i, ilen;

			switch (mode) {
			case 'single':
				elements = [elements[0]];
				break;
			case 'label':
			case 'dataset':
			case 'x-axis':
				// elements = elements;
				break;
			default:
				// unsupported mode
				return;
			}

			for (i=0, ilen=elements.length; i<ilen; ++i) {
				element = elements[i];
				if (element) {
					this.getDatasetMeta(element._datasetIndex).controller[method](element);
				}
			}
		},

		eventHandler: function(e) {
			var me = this;
			var tooltip = me.tooltip;
			var options = me.options || {};
			var hoverOptions = options.hover;
			var tooltipsOptions = options.tooltips;

			me.lastActive = me.lastActive || [];
			me.lastTooltipActive = me.lastTooltipActive || [];

			// Find Active Elements for hover and tooltips
			if (e.type === 'mouseout') {
				me.active = [];
				me.tooltipActive = [];
			} else {
				me.active = me.getElementsAtEventForMode(e, hoverOptions.mode);
				me.tooltipActive = me.getElementsAtEventForMode(e, tooltipsOptions.mode);
			}

			// On Hover hook
			if (hoverOptions.onHover) {
				hoverOptions.onHover.call(me, me.active);
			}

			if (me.legend && me.legend.handleEvent) {
				me.legend.handleEvent(e);
			}

			if (e.type === 'mouseup' || e.type === 'click') {
				if (options.onClick) {
					options.onClick.call(me, e, me.active);
				}
			}

			// Remove styling for last active (even if it may still be active)
			if (me.lastActive.length) {
				me.updateHoverStyle(me.lastActive, hoverOptions.mode, false);
			}

			// Built in hover styling
			if (me.active.length && hoverOptions.mode) {
				me.updateHoverStyle(me.active, hoverOptions.mode, true);
			}

			// Built in Tooltips
			if (tooltipsOptions.enabled || tooltipsOptions.custom) {
				tooltip.initialize();
				tooltip._active = me.tooltipActive;
				tooltip.update(true);
			}

			// Hover animations
			tooltip.pivot();

			if (!me.animating) {
				// If entering, leaving, or changing elements, animate the change via pivot
				if (!helpers.arrayEquals(me.active, me.lastActive) ||
					!helpers.arrayEquals(me.tooltipActive, me.lastTooltipActive)) {

					me.stop();

					if (tooltipsOptions.enabled || tooltipsOptions.custom) {
						tooltip.update(true);
					}

					// We only need to render at this point. Updating will cause scales to be
					// recomputed generating flicker & using more memory than necessary.
					me.render(hoverOptions.animationDuration, true);
				}
			}

			// Remember Last Actives
			me.lastActive = me.active;
			me.lastTooltipActive = me.tooltipActive;
			return me;
		}
	});
};

},{}],24:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var noop = helpers.noop;

	// Base class for all dataset controllers (line, bar, etc)
	Chart.DatasetController = function(chart, datasetIndex) {
		this.initialize(chart, datasetIndex);
	};

	helpers.extend(Chart.DatasetController.prototype, {

		/**
		 * Element type used to generate a meta dataset (e.g. Chart.element.Line).
		 * @type {Chart.core.element}
		 */
		datasetElementType: null,

		/**
		 * Element type used to generate a meta data (e.g. Chart.element.Point).
		 * @type {Chart.core.element}
		 */
		dataElementType: null,

		initialize: function(chart, datasetIndex) {
			var me = this;
			me.chart = chart;
			me.index = datasetIndex;
			me.linkScales();
			me.addElements();
		},

		updateIndex: function(datasetIndex) {
			this.index = datasetIndex;
		},

		linkScales: function() {
			var me = this;
			var meta = me.getMeta();
			var dataset = me.getDataset();

			if (meta.xAxisID === null) {
				meta.xAxisID = dataset.xAxisID || me.chart.options.scales.xAxes[0].id;
			}
			if (meta.yAxisID === null) {
				meta.yAxisID = dataset.yAxisID || me.chart.options.scales.yAxes[0].id;
			}
		},

		getDataset: function() {
			return this.chart.data.datasets[this.index];
		},

		getMeta: function() {
			return this.chart.getDatasetMeta(this.index);
		},

		getScaleForId: function(scaleID) {
			return this.chart.scales[scaleID];
		},

		reset: function() {
			this.update(true);
		},

		createMetaDataset: function() {
			var me = this;
			var type = me.datasetElementType;
			return type && new type({
				_chart: me.chart.chart,
				_datasetIndex: me.index
			});
		},

		createMetaData: function(index) {
			var me = this;
			var type = me.dataElementType;
			return type && new type({
				_chart: me.chart.chart,
				_datasetIndex: me.index,
				_index: index
			});
		},

		addElements: function() {
			var me = this;
			var meta = me.getMeta();
			var data = me.getDataset().data || [];
			var metaData = meta.data;
			var i, ilen;

			for (i=0, ilen=data.length; i<ilen; ++i) {
				metaData[i] = metaData[i] || me.createMetaData(meta, i);
			}

			meta.dataset = meta.dataset || me.createMetaDataset();
		},

		addElementAndReset: function(index) {
			var me = this;
			var element = me.createMetaData(index);
			me.getMeta().data.splice(index, 0, element);
			me.updateElement(element, index, true);
		},

		buildOrUpdateElements: function() {
			// Handle the number of data points changing
			var meta = this.getMeta(),
				md = meta.data,
				numData = this.getDataset().data.length,
				numMetaData = md.length;

			// Make sure that we handle number of datapoints changing
			if (numData < numMetaData) {
				// Remove excess bars for data points that have been removed
				md.splice(numData, numMetaData - numData);
			} else if (numData > numMetaData) {
				// Add new elements
				for (var index = numMetaData; index < numData; ++index) {
					this.addElementAndReset(index);
				}
			}
		},

		update: noop,

		draw: function(ease) {
			var easingDecimal = ease || 1;
			helpers.each(this.getMeta().data, function(element) {
				element.transition(easingDecimal).draw();
			});
		},

		removeHoverStyle: function(element, elementOpts) {
			var dataset = this.chart.data.datasets[element._datasetIndex],
				index = element._index,
				custom = element.custom || {},
				valueOrDefault = helpers.getValueAtIndexOrDefault,
				model = element._model;

			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueOrDefault(dataset.backgroundColor, index, elementOpts.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : valueOrDefault(dataset.borderColor, index, elementOpts.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : valueOrDefault(dataset.borderWidth, index, elementOpts.borderWidth);
		},

		setHoverStyle: function(element) {
			var dataset = this.chart.data.datasets[element._datasetIndex],
				index = element._index,
				custom = element.custom || {},
				valueOrDefault = helpers.getValueAtIndexOrDefault,
				getHoverColor = helpers.getHoverColor,
				model = element._model;

			model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueOrDefault(dataset.hoverBackgroundColor, index, getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : valueOrDefault(dataset.hoverBorderColor, index, getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : valueOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
		}

	});

	Chart.DatasetController.extend = helpers.inherits;
};

},{}],25:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.elements = {};

	Chart.Element = function(configuration) {
		helpers.extend(this, configuration);
		this.initialize.apply(this, arguments);
	};

	helpers.extend(Chart.Element.prototype, {

		initialize: function() {
			this.hidden = false;
		},

		pivot: function() {
			var me = this;
			if (!me._view) {
				me._view = helpers.clone(me._model);
			}
			me._start = helpers.clone(me._view);
			return me;
		},

		transition: function(ease) {
			var me = this;

			if (!me._view) {
				me._view = helpers.clone(me._model);
			}

			// No animation -> No Transition
			if (ease === 1) {
				me._view = me._model;
				me._start = null;
				return me;
			}

			if (!me._start) {
				me.pivot();
			}

			helpers.each(me._model, function(value, key) {

				if (key[0] === '_') {
					// Only non-underscored properties
				// Init if doesn't exist
				} else if (!me._view.hasOwnProperty(key)) {
					if (typeof value === 'number' && !isNaN(me._view[key])) {
						me._view[key] = value * ease;
					} else {
						me._view[key] = value;
					}
				// No unnecessary computations
				} else if (value === me._view[key]) {
					// It's the same! Woohoo!
				// Color transitions if possible
				} else if (typeof value === 'string') {
					try {
						var color = helpers.color(me._model[key]).mix(helpers.color(me._start[key]), ease);
						me._view[key] = color.rgbString();
					} catch (err) {
						me._view[key] = value;
					}
				// Number transitions
				} else if (typeof value === 'number') {
					var startVal = me._start[key] !== undefined && isNaN(me._start[key]) === false ? me._start[key] : 0;
					me._view[key] = ((me._model[key] - startVal) * ease) + startVal;
				// Everything else
				} else {
					me._view[key] = value;
				}
			}, me);

			return me;
		},

		tooltipPosition: function() {
			return {
				x: this._model.x,
				y: this._model.y
			};
		},

		hasValue: function() {
			return helpers.isNumber(this._model.x) && helpers.isNumber(this._model.y);
		}
	});

	Chart.Element.extend = helpers.inherits;

};

},{}],26:[function(require,module,exports){
/* global window: false */
/* global document: false */
'use strict';

var color = require(3);

module.exports = function(Chart) {
	// Global Chart helpers object for utility methods and classes
	var helpers = Chart.helpers = {};

	// -- Basic js utility methods
	helpers.each = function(loopable, callback, self, reverse) {
		// Check to see if null or undefined firstly.
		var i, len;
		if (helpers.isArray(loopable)) {
			len = loopable.length;
			if (reverse) {
				for (i = len - 1; i >= 0; i--) {
					callback.call(self, loopable[i], i);
				}
			} else {
				for (i = 0; i < len; i++) {
					callback.call(self, loopable[i], i);
				}
			}
		} else if (typeof loopable === 'object') {
			var keys = Object.keys(loopable);
			len = keys.length;
			for (i = 0; i < len; i++) {
				callback.call(self, loopable[keys[i]], keys[i]);
			}
		}
	};
	helpers.clone = function(obj) {
		var objClone = {};
		helpers.each(obj, function(value, key) {
			if (helpers.isArray(value)) {
				objClone[key] = value.slice(0);
			} else if (typeof value === 'object' && value !== null) {
				objClone[key] = helpers.clone(value);
			} else {
				objClone[key] = value;
			}
		});
		return objClone;
	};
	helpers.extend = function(base) {
		var setFn = function(value, key) {
			base[key] = value;
		};
		for (var i = 1, ilen = arguments.length; i < ilen; i++) {
			helpers.each(arguments[i], setFn);
		}
		return base;
	};
	// Need a special merge function to chart configs since they are now grouped
	helpers.configMerge = function(_base) {
		var base = helpers.clone(_base);
		helpers.each(Array.prototype.slice.call(arguments, 1), function(extension) {
			helpers.each(extension, function(value, key) {
				if (key === 'scales') {
					// Scale config merging is complex. Add out own function here for that
					base[key] = helpers.scaleMerge(base.hasOwnProperty(key) ? base[key] : {}, value);

				} else if (key === 'scale') {
					// Used in polar area & radar charts since there is only one scale
					base[key] = helpers.configMerge(base.hasOwnProperty(key) ? base[key] : {}, Chart.scaleService.getScaleDefaults(value.type), value);
				} else if (base.hasOwnProperty(key) && helpers.isArray(base[key]) && helpers.isArray(value)) {
					// In this case we have an array of objects replacing another array. Rather than doing a strict replace,
					// merge. This allows easy scale option merging
					var baseArray = base[key];

					helpers.each(value, function(valueObj, index) {

						if (index < baseArray.length) {
							if (typeof baseArray[index] === 'object' && baseArray[index] !== null && typeof valueObj === 'object' && valueObj !== null) {
								// Two objects are coming together. Do a merge of them.
								baseArray[index] = helpers.configMerge(baseArray[index], valueObj);
							} else {
								// Just overwrite in this case since there is nothing to merge
								baseArray[index] = valueObj;
							}
						} else {
							baseArray.push(valueObj); // nothing to merge
						}
					});

				} else if (base.hasOwnProperty(key) && typeof base[key] === 'object' && base[key] !== null && typeof value === 'object') {
					// If we are overwriting an object with an object, do a merge of the properties.
					base[key] = helpers.configMerge(base[key], value);

				} else {
					// can just overwrite the value in this case
					base[key] = value;
				}
			});
		});

		return base;
	};
	helpers.scaleMerge = function(_base, extension) {
		var base = helpers.clone(_base);

		helpers.each(extension, function(value, key) {
			if (key === 'xAxes' || key === 'yAxes') {
				// These properties are arrays of items
				if (base.hasOwnProperty(key)) {
					helpers.each(value, function(valueObj, index) {
						var axisType = helpers.getValueOrDefault(valueObj.type, key === 'xAxes' ? 'category' : 'linear');
						var axisDefaults = Chart.scaleService.getScaleDefaults(axisType);
						if (index >= base[key].length || !base[key][index].type) {
							base[key].push(helpers.configMerge(axisDefaults, valueObj));
						} else if (valueObj.type && valueObj.type !== base[key][index].type) {
							// Type changed. Bring in the new defaults before we bring in valueObj so that valueObj can override the correct scale defaults
							base[key][index] = helpers.configMerge(base[key][index], axisDefaults, valueObj);
						} else {
							// Type is the same
							base[key][index] = helpers.configMerge(base[key][index], valueObj);
						}
					});
				} else {
					base[key] = [];
					helpers.each(value, function(valueObj) {
						var axisType = helpers.getValueOrDefault(valueObj.type, key === 'xAxes' ? 'category' : 'linear');
						base[key].push(helpers.configMerge(Chart.scaleService.getScaleDefaults(axisType), valueObj));
					});
				}
			} else if (base.hasOwnProperty(key) && typeof base[key] === 'object' && base[key] !== null && typeof value === 'object') {
				// If we are overwriting an object with an object, do a merge of the properties.
				base[key] = helpers.configMerge(base[key], value);

			} else {
				// can just overwrite the value in this case
				base[key] = value;
			}
		});

		return base;
	};
	helpers.getValueAtIndexOrDefault = function(value, index, defaultValue) {
		if (value === undefined || value === null) {
			return defaultValue;
		}

		if (helpers.isArray(value)) {
			return index < value.length ? value[index] : defaultValue;
		}

		return value;
	};
	helpers.getValueOrDefault = function(value, defaultValue) {
		return value === undefined ? defaultValue : value;
	};
	helpers.indexOf = Array.prototype.indexOf?
		function(array, item) {
			return array.indexOf(item);
		}:
		function(array, item) {
			for (var i = 0, ilen = array.length; i < ilen; ++i) {
				if (array[i] === item) {
					return i;
				}
			}
			return -1;
		};
	helpers.where = function(collection, filterCallback) {
		if (helpers.isArray(collection) && Array.prototype.filter) {
			return collection.filter(filterCallback);
		}
		var filtered = [];

		helpers.each(collection, function(item) {
			if (filterCallback(item)) {
				filtered.push(item);
			}
		});

		return filtered;
	};
	helpers.findIndex = Array.prototype.findIndex?
		function(array, callback, scope) {
			return array.findIndex(callback, scope);
		} :
		function(array, callback, scope) {
			scope = scope === undefined? array : scope;
			for (var i = 0, ilen = array.length; i < ilen; ++i) {
				if (callback.call(scope, array[i], i, array)) {
					return i;
				}
			}
			return -1;
		};
	helpers.findNextWhere = function(arrayToSearch, filterCallback, startIndex) {
		// Default to start of the array
		if (startIndex === undefined || startIndex === null) {
			startIndex = -1;
		}
		for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
			var currentItem = arrayToSearch[i];
			if (filterCallback(currentItem)) {
				return currentItem;
			}
		}
	};
	helpers.findPreviousWhere = function(arrayToSearch, filterCallback, startIndex) {
		// Default to end of the array
		if (startIndex === undefined || startIndex === null) {
			startIndex = arrayToSearch.length;
		}
		for (var i = startIndex - 1; i >= 0; i--) {
			var currentItem = arrayToSearch[i];
			if (filterCallback(currentItem)) {
				return currentItem;
			}
		}
	};
	helpers.inherits = function(extensions) {
		// Basic javascript inheritance based on the model created in Backbone.js
		var me = this;
		var ChartElement = (extensions && extensions.hasOwnProperty('constructor')) ? extensions.constructor : function() {
			return me.apply(this, arguments);
		};

		var Surrogate = function() {
			this.constructor = ChartElement;
		};
		Surrogate.prototype = me.prototype;
		ChartElement.prototype = new Surrogate();

		ChartElement.extend = helpers.inherits;

		if (extensions) {
			helpers.extend(ChartElement.prototype, extensions);
		}

		ChartElement.__super__ = me.prototype;

		return ChartElement;
	};
	helpers.noop = function() {};
	helpers.uid = (function() {
		var id = 0;
		return function() {
			return id++;
		};
	}());
	// -- Math methods
	helpers.isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};
	helpers.almostEquals = function(x, y, epsilon) {
		return Math.abs(x - y) < epsilon;
	};
	helpers.max = function(array) {
		return array.reduce(function(max, value) {
			if (!isNaN(value)) {
				return Math.max(max, value);
			}
			return max;
		}, Number.NEGATIVE_INFINITY);
	};
	helpers.min = function(array) {
		return array.reduce(function(min, value) {
			if (!isNaN(value)) {
				return Math.min(min, value);
			}
			return min;
		}, Number.POSITIVE_INFINITY);
	};
	helpers.sign = Math.sign?
		function(x) {
			return Math.sign(x);
		} :
		function(x) {
			x = +x; // convert to a number
			if (x === 0 || isNaN(x)) {
				return x;
			}
			return x > 0 ? 1 : -1;
		};
	helpers.log10 = Math.log10?
		function(x) {
			return Math.log10(x);
		} :
		function(x) {
			return Math.log(x) / Math.LN10;
		};
	helpers.toRadians = function(degrees) {
		return degrees * (Math.PI / 180);
	};
	helpers.toDegrees = function(radians) {
		return radians * (180 / Math.PI);
	};
	// Gets the angle from vertical upright to the point about a centre.
	helpers.getAngleFromPoint = function(centrePoint, anglePoint) {
		var distanceFromXCenter = anglePoint.x - centrePoint.x,
			distanceFromYCenter = anglePoint.y - centrePoint.y,
			radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);

		var angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);

		if (angle < (-0.5 * Math.PI)) {
			angle += 2.0 * Math.PI; // make sure the returned angle is in the range of (-PI/2, 3PI/2]
		}

		return {
			angle: angle,
			distance: radialDistanceFromCenter
		};
	};
	helpers.aliasPixel = function(pixelWidth) {
		return (pixelWidth % 2 === 0) ? 0 : 0.5;
	};
	helpers.splineCurve = function(firstPoint, middlePoint, afterPoint, t) {
		// Props to Rob Spencer at scaled innovation for his post on splining between points
		// http://scaledinnovation.com/analytics/splines/aboutSplines.html

		// This function must also respect "skipped" points

		var previous = firstPoint.skip ? middlePoint : firstPoint,
			current = middlePoint,
			next = afterPoint.skip ? middlePoint : afterPoint;

		var d01 = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2));
		var d12 = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));

		var s01 = d01 / (d01 + d12);
		var s12 = d12 / (d01 + d12);

		// If all points are the same, s01 & s02 will be inf
		s01 = isNaN(s01) ? 0 : s01;
		s12 = isNaN(s12) ? 0 : s12;

		var fa = t * s01; // scaling factor for triangle Ta
		var fb = t * s12;

		return {
			previous: {
				x: current.x - fa * (next.x - previous.x),
				y: current.y - fa * (next.y - previous.y)
			},
			next: {
				x: current.x + fb * (next.x - previous.x),
				y: current.y + fb * (next.y - previous.y)
			}
		};
	};
	helpers.EPSILON = Number.EPSILON || 1e-14;
	helpers.splineCurveMonotone = function(points) {
		// This function calculates Bézier control points in a similar way than |splineCurve|,
		// but preserves monotonicity of the provided data and ensures no local extremums are added
		// between the dataset discrete points due to the interpolation.
		// See : https://en.wikipedia.org/wiki/Monotone_cubic_interpolation

		var pointsWithTangents = (points || []).map(function(point) {
			return {
				model: point._model,
				deltaK: 0,
				mK: 0
			};
		});

		// Calculate slopes (deltaK) and initialize tangents (mK)
		var pointsLen = pointsWithTangents.length;
		var i, pointBefore, pointCurrent, pointAfter;
		for (i = 0; i < pointsLen; ++i) {
			pointCurrent = pointsWithTangents[i];
			if (pointCurrent.model.skip) {
				continue;
			}

			pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
			pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
			if (pointAfter && !pointAfter.model.skip) {
				pointCurrent.deltaK = (pointAfter.model.y - pointCurrent.model.y) / (pointAfter.model.x - pointCurrent.model.x);
			}

			if (!pointBefore || pointBefore.model.skip) {
				pointCurrent.mK = pointCurrent.deltaK;
			} else if (!pointAfter || pointAfter.model.skip) {
				pointCurrent.mK = pointBefore.deltaK;
			} else if (this.sign(pointBefore.deltaK) !== this.sign(pointCurrent.deltaK)) {
				pointCurrent.mK = 0;
			} else {
				pointCurrent.mK = (pointBefore.deltaK + pointCurrent.deltaK) / 2;
			}
		}

		// Adjust tangents to ensure monotonic properties
		var alphaK, betaK, tauK, squaredMagnitude;
		for (i = 0; i < pointsLen - 1; ++i) {
			pointCurrent = pointsWithTangents[i];
			pointAfter = pointsWithTangents[i + 1];
			if (pointCurrent.model.skip || pointAfter.model.skip) {
				continue;
			}

			if (helpers.almostEquals(pointCurrent.deltaK, 0, this.EPSILON)) {
				pointCurrent.mK = pointAfter.mK = 0;
				continue;
			}

			alphaK = pointCurrent.mK / pointCurrent.deltaK;
			betaK = pointAfter.mK / pointCurrent.deltaK;
			squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
			if (squaredMagnitude <= 9) {
				continue;
			}

			tauK = 3 / Math.sqrt(squaredMagnitude);
			pointCurrent.mK = alphaK * tauK * pointCurrent.deltaK;
			pointAfter.mK = betaK * tauK * pointCurrent.deltaK;
		}

		// Compute control points
		var deltaX;
		for (i = 0; i < pointsLen; ++i) {
			pointCurrent = pointsWithTangents[i];
			if (pointCurrent.model.skip) {
				continue;
			}

			pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
			pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
			if (pointBefore && !pointBefore.model.skip) {
				deltaX = (pointCurrent.model.x - pointBefore.model.x) / 3;
				pointCurrent.model.controlPointPreviousX = pointCurrent.model.x - deltaX;
				pointCurrent.model.controlPointPreviousY = pointCurrent.model.y - deltaX * pointCurrent.mK;
			}
			if (pointAfter && !pointAfter.model.skip) {
				deltaX = (pointAfter.model.x - pointCurrent.model.x) / 3;
				pointCurrent.model.controlPointNextX = pointCurrent.model.x + deltaX;
				pointCurrent.model.controlPointNextY = pointCurrent.model.y + deltaX * pointCurrent.mK;
			}
		}
	};
	helpers.nextItem = function(collection, index, loop) {
		if (loop) {
			return index >= collection.length - 1 ? collection[0] : collection[index + 1];
		}
		return index >= collection.length - 1 ? collection[collection.length - 1] : collection[index + 1];
	};
	helpers.previousItem = function(collection, index, loop) {
		if (loop) {
			return index <= 0 ? collection[collection.length - 1] : collection[index - 1];
		}
		return index <= 0 ? collection[0] : collection[index - 1];
	};
	// Implementation of the nice number algorithm used in determining where axis labels will go
	helpers.niceNum = function(range, round) {
		var exponent = Math.floor(helpers.log10(range));
		var fraction = range / Math.pow(10, exponent);
		var niceFraction;

		if (round) {
			if (fraction < 1.5) {
				niceFraction = 1;
			} else if (fraction < 3) {
				niceFraction = 2;
			} else if (fraction < 7) {
				niceFraction = 5;
			} else {
				niceFraction = 10;
			}
		} else if (fraction <= 1.0) {
			niceFraction = 1;
		} else if (fraction <= 2) {
			niceFraction = 2;
		} else if (fraction <= 5) {
			niceFraction = 5;
		} else {
			niceFraction = 10;
		}

		return niceFraction * Math.pow(10, exponent);
	};
	// Easing functions adapted from Robert Penner's easing equations
	// http://www.robertpenner.com/easing/
	var easingEffects = helpers.easingEffects = {
		linear: function(t) {
			return t;
		},
		easeInQuad: function(t) {
			return t * t;
		},
		easeOutQuad: function(t) {
			return -1 * t * (t - 2);
		},
		easeInOutQuad: function(t) {
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * t * t;
			}
			return -1 / 2 * ((--t) * (t - 2) - 1);
		},
		easeInCubic: function(t) {
			return t * t * t;
		},
		easeOutCubic: function(t) {
			return 1 * ((t = t / 1 - 1) * t * t + 1);
		},
		easeInOutCubic: function(t) {
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * t * t * t;
			}
			return 1 / 2 * ((t -= 2) * t * t + 2);
		},
		easeInQuart: function(t) {
			return t * t * t * t;
		},
		easeOutQuart: function(t) {
			return -1 * ((t = t / 1 - 1) * t * t * t - 1);
		},
		easeInOutQuart: function(t) {
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * t * t * t * t;
			}
			return -1 / 2 * ((t -= 2) * t * t * t - 2);
		},
		easeInQuint: function(t) {
			return 1 * (t /= 1) * t * t * t * t;
		},
		easeOutQuint: function(t) {
			return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
		},
		easeInOutQuint: function(t) {
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * t * t * t * t * t;
			}
			return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
		},
		easeInSine: function(t) {
			return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
		},
		easeOutSine: function(t) {
			return 1 * Math.sin(t / 1 * (Math.PI / 2));
		},
		easeInOutSine: function(t) {
			return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
		},
		easeInExpo: function(t) {
			return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
		},
		easeOutExpo: function(t) {
			return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
		},
		easeInOutExpo: function(t) {
			if (t === 0) {
				return 0;
			}
			if (t === 1) {
				return 1;
			}
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * Math.pow(2, 10 * (t - 1));
			}
			return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
		},
		easeInCirc: function(t) {
			if (t >= 1) {
				return t;
			}
			return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
		},
		easeOutCirc: function(t) {
			return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
		},
		easeInOutCirc: function(t) {
			if ((t /= 1 / 2) < 1) {
				return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
			}
			return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
		},
		easeInElastic: function(t) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t === 0) {
				return 0;
			}
			if ((t /= 1) === 1) {
				return 1;
			}
			if (!p) {
				p = 1 * 0.3;
			}
			if (a < Math.abs(1)) {
				a = 1;
				s = p / 4;
			} else {
				s = p / (2 * Math.PI) * Math.asin(1 / a);
			}
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
		},
		easeOutElastic: function(t) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t === 0) {
				return 0;
			}
			if ((t /= 1) === 1) {
				return 1;
			}
			if (!p) {
				p = 1 * 0.3;
			}
			if (a < Math.abs(1)) {
				a = 1;
				s = p / 4;
			} else {
				s = p / (2 * Math.PI) * Math.asin(1 / a);
			}
			return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
		},
		easeInOutElastic: function(t) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t === 0) {
				return 0;
			}
			if ((t /= 1 / 2) === 2) {
				return 1;
			}
			if (!p) {
				p = 1 * (0.3 * 1.5);
			}
			if (a < Math.abs(1)) {
				a = 1;
				s = p / 4;
			} else {
				s = p / (2 * Math.PI) * Math.asin(1 / a);
			}
			if (t < 1) {
				return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
			}
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
		},
		easeInBack: function(t) {
			var s = 1.70158;
			return 1 * (t /= 1) * t * ((s + 1) * t - s);
		},
		easeOutBack: function(t) {
			var s = 1.70158;
			return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
		},
		easeInOutBack: function(t) {
			var s = 1.70158;
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
			}
			return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
		},
		easeInBounce: function(t) {
			return 1 - easingEffects.easeOutBounce(1 - t);
		},
		easeOutBounce: function(t) {
			if ((t /= 1) < (1 / 2.75)) {
				return 1 * (7.5625 * t * t);
			} else if (t < (2 / 2.75)) {
				return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
			} else if (t < (2.5 / 2.75)) {
				return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
			}
			return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
		},
		easeInOutBounce: function(t) {
			if (t < 1 / 2) {
				return easingEffects.easeInBounce(t * 2) * 0.5;
			}
			return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;
		}
	};
	// Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	helpers.requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
				return window.setTimeout(callback, 1000 / 60);
			};
	}());
	helpers.cancelAnimFrame = (function() {
		return window.cancelAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.mozCancelAnimationFrame ||
			window.oCancelAnimationFrame ||
			window.msCancelAnimationFrame ||
			function(callback) {
				return window.clearTimeout(callback, 1000 / 60);
			};
	}());
	// -- DOM methods
	helpers.getRelativePosition = function(evt, chart) {
		var mouseX, mouseY;
		var e = evt.originalEvent || evt,
			canvas = evt.currentTarget || evt.srcElement,
			boundingRect = canvas.getBoundingClientRect();

		var touches = e.touches;
		if (touches && touches.length > 0) {
			mouseX = touches[0].clientX;
			mouseY = touches[0].clientY;

		} else {
			mouseX = e.clientX;
			mouseY = e.clientY;
		}

		// Scale mouse coordinates into canvas coordinates
		// by following the pattern laid out by 'jerryj' in the comments of
		// http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
		var paddingLeft = parseFloat(helpers.getStyle(canvas, 'padding-left'));
		var paddingTop = parseFloat(helpers.getStyle(canvas, 'padding-top'));
		var paddingRight = parseFloat(helpers.getStyle(canvas, 'padding-right'));
		var paddingBottom = parseFloat(helpers.getStyle(canvas, 'padding-bottom'));
		var width = boundingRect.right - boundingRect.left - paddingLeft - paddingRight;
		var height = boundingRect.bottom - boundingRect.top - paddingTop - paddingBottom;

		// We divide by the current device pixel ratio, because the canvas is scaled up by that amount in each direction. However
		// the backend model is in unscaled coordinates. Since we are going to deal with our model coordinates, we go back here
		mouseX = Math.round((mouseX - boundingRect.left - paddingLeft) / (width) * canvas.width / chart.currentDevicePixelRatio);
		mouseY = Math.round((mouseY - boundingRect.top - paddingTop) / (height) * canvas.height / chart.currentDevicePixelRatio);

		return {
			x: mouseX,
			y: mouseY
		};

	};
	helpers.addEvent = function(node, eventType, method) {
		if (node.addEventListener) {
			node.addEventListener(eventType, method);
		} else if (node.attachEvent) {
			node.attachEvent('on' + eventType, method);
		} else {
			node['on' + eventType] = method;
		}
	};
	helpers.removeEvent = function(node, eventType, handler) {
		if (node.removeEventListener) {
			node.removeEventListener(eventType, handler, false);
		} else if (node.detachEvent) {
			node.detachEvent('on' + eventType, handler);
		} else {
			node['on' + eventType] = helpers.noop;
		}
	};
	helpers.bindEvents = function(chartInstance, arrayOfEvents, handler) {
		// Create the events object if it's not already present
		var events = chartInstance.events = chartInstance.events || {};

		helpers.each(arrayOfEvents, function(eventName) {
			events[eventName] = function() {
				handler.apply(chartInstance, arguments);
			};
			helpers.addEvent(chartInstance.chart.canvas, eventName, events[eventName]);
		});
	};
	helpers.unbindEvents = function(chartInstance, arrayOfEvents) {
		var canvas = chartInstance.chart.canvas;
		helpers.each(arrayOfEvents, function(handler, eventName) {
			helpers.removeEvent(canvas, eventName, handler);
		});
	};

	// Private helper function to convert max-width/max-height values that may be percentages into a number
	function parseMaxStyle(styleValue, node, parentProperty) {
		var valueInPixels;
		if (typeof(styleValue) === 'string') {
			valueInPixels = parseInt(styleValue, 10);

			if (styleValue.indexOf('%') !== -1) {
				// percentage * size in dimension
				valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
			}
		} else {
			valueInPixels = styleValue;
		}

		return valueInPixels;
	}

	/**
	 * Returns if the given value contains an effective constraint.
	 * @private
	 */
	function isConstrainedValue(value) {
		return value !== undefined && value !== null && value !== 'none';
	}

	// Private helper to get a constraint dimension
	// @param domNode : the node to check the constraint on
	// @param maxStyle : the style that defines the maximum for the direction we are using (maxWidth / maxHeight)
	// @param percentageProperty : property of parent to use when calculating width as a percentage
	// @see http://www.nathanaeljones.com/blog/2013/reading-max-width-cross-browser
	function getConstraintDimension(domNode, maxStyle, percentageProperty) {
		var view = document.defaultView;
		var parentNode = domNode.parentNode;
		var constrainedNode = view.getComputedStyle(domNode)[maxStyle];
		var constrainedContainer = view.getComputedStyle(parentNode)[maxStyle];
		var hasCNode = isConstrainedValue(constrainedNode);
		var hasCContainer = isConstrainedValue(constrainedContainer);
		var infinity = Number.POSITIVE_INFINITY;

		if (hasCNode || hasCContainer) {
			return Math.min(
				hasCNode? parseMaxStyle(constrainedNode, domNode, percentageProperty) : infinity,
				hasCContainer? parseMaxStyle(constrainedContainer, parentNode, percentageProperty) : infinity);
		}

		return 'none';
	}
	// returns Number or undefined if no constraint
	helpers.getConstraintWidth = function(domNode) {
		return getConstraintDimension(domNode, 'max-width', 'clientWidth');
	};
	// returns Number or undefined if no constraint
	helpers.getConstraintHeight = function(domNode) {
		return getConstraintDimension(domNode, 'max-height', 'clientHeight');
	};
	helpers.getMaximumWidth = function(domNode) {
		var container = domNode.parentNode;
		var paddingLeft = parseInt(helpers.getStyle(container, 'padding-left'), 10);
		var paddingRight = parseInt(helpers.getStyle(container, 'padding-right'), 10);
		var w = container.clientWidth - paddingLeft - paddingRight;
		var cw = helpers.getConstraintWidth(domNode);
		return isNaN(cw)? w : Math.min(w, cw);
	};
	helpers.getMaximumHeight = function(domNode) {
		var container = domNode.parentNode;
		var paddingTop = parseInt(helpers.getStyle(container, 'padding-top'), 10);
		var paddingBottom = parseInt(helpers.getStyle(container, 'padding-bottom'), 10);
		var h = container.clientHeight - paddingTop - paddingBottom;
		var ch = helpers.getConstraintHeight(domNode);
		return isNaN(ch)? h : Math.min(h, ch);
	};
	helpers.getStyle = function(el, property) {
		return el.currentStyle ?
			el.currentStyle[property] :
			document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
	};
	helpers.retinaScale = function(chart) {
		var ctx = chart.ctx;
		var canvas = chart.canvas;
		var width = canvas.width;
		var height = canvas.height;
		var pixelRatio = chart.currentDevicePixelRatio = window.devicePixelRatio || 1;

		if (pixelRatio !== 1) {
			canvas.height = height * pixelRatio;
			canvas.width = width * pixelRatio;
			ctx.scale(pixelRatio, pixelRatio);

			// Store the device pixel ratio so that we can go backwards in `destroy`.
			// The devicePixelRatio changes with zoom, so there are no guarantees that it is the same
			// when destroy is called
			chart.originalDevicePixelRatio = chart.originalDevicePixelRatio || pixelRatio;
		}

		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
	};
	// -- Canvas methods
	helpers.clear = function(chart) {
		chart.ctx.clearRect(0, 0, chart.width, chart.height);
	};
	helpers.fontString = function(pixelSize, fontStyle, fontFamily) {
		return fontStyle + ' ' + pixelSize + 'px ' + fontFamily;
	};
	helpers.longestText = function(ctx, font, arrayOfThings, cache) {
		cache = cache || {};
		var data = cache.data = cache.data || {};
		var gc = cache.garbageCollect = cache.garbageCollect || [];

		if (cache.font !== font) {
			data = cache.data = {};
			gc = cache.garbageCollect = [];
			cache.font = font;
		}

		ctx.font = font;
		var longest = 0;
		helpers.each(arrayOfThings, function(thing) {
			// Undefined strings and arrays should not be measured
			if (thing !== undefined && thing !== null && helpers.isArray(thing) !== true) {
				longest = helpers.measureText(ctx, data, gc, longest, thing);
			} else if (helpers.isArray(thing)) {
				// if it is an array lets measure each element
				// to do maybe simplify this function a bit so we can do this more recursively?
				helpers.each(thing, function(nestedThing) {
					// Undefined strings and arrays should not be measured
					if (nestedThing !== undefined && nestedThing !== null && !helpers.isArray(nestedThing)) {
						longest = helpers.measureText(ctx, data, gc, longest, nestedThing);
					}
				});
			}
		});

		var gcLen = gc.length / 2;
		if (gcLen > arrayOfThings.length) {
			for (var i = 0; i < gcLen; i++) {
				delete data[gc[i]];
			}
			gc.splice(0, gcLen);
		}
		return longest;
	};
	helpers.measureText = function(ctx, data, gc, longest, string) {
		var textWidth = data[string];
		if (!textWidth) {
			textWidth = data[string] = ctx.measureText(string).width;
			gc.push(string);
		}
		if (textWidth > longest) {
			longest = textWidth;
		}
		return longest;
	};
	helpers.numberOfLabelLines = function(arrayOfThings) {
		var numberOfLines = 1;
		helpers.each(arrayOfThings, function(thing) {
			if (helpers.isArray(thing)) {
				if (thing.length > numberOfLines) {
					numberOfLines = thing.length;
				}
			}
		});
		return numberOfLines;
	};
	helpers.drawRoundedRectangle = function(ctx, x, y, width, height, radius) {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
	};
	helpers.color = function(c) {
		if (!color) {
			console.error('Color.js not found!');
			return c;
		}

		/* global CanvasGradient */
		if (c instanceof CanvasGradient) {
			return color(Chart.defaults.global.defaultColor);
		}

		return color(c);
	};
	helpers.addResizeListener = function(node, callback) {
		// Hide an iframe before the node
		var hiddenIframe = document.createElement('iframe');
		var hiddenIframeClass = 'chartjs-hidden-iframe';

		if (hiddenIframe.classlist) {
			// can use classlist
			hiddenIframe.classlist.add(hiddenIframeClass);
		} else {
			hiddenIframe.setAttribute('class', hiddenIframeClass);
		}

		// Set the style
		hiddenIframe.tabIndex = -1;
		var style = hiddenIframe.style;
		style.width = '100%';
		style.display = 'block';
		style.border = 0;
		style.height = 0;
		style.margin = 0;
		style.position = 'absolute';
		style.left = 0;
		style.right = 0;
		style.top = 0;
		style.bottom = 0;

		// Insert the iframe so that contentWindow is available
		node.insertBefore(hiddenIframe, node.firstChild);

		(hiddenIframe.contentWindow || hiddenIframe).onresize = function() {
			if (callback) {
				return callback();
			}
		};
	};
	helpers.removeResizeListener = function(node) {
		var hiddenIframe = node.querySelector('.chartjs-hidden-iframe');

		// Remove the resize detect iframe
		if (hiddenIframe) {
			hiddenIframe.parentNode.removeChild(hiddenIframe);
		}
	};
	helpers.isArray = Array.isArray?
		function(obj) {
			return Array.isArray(obj);
		} :
		function(obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		};
	// ! @see http://stackoverflow.com/a/14853974
	helpers.arrayEquals = function(a0, a1) {
		var i, ilen, v0, v1;

		if (!a0 || !a1 || a0.length !== a1.length) {
			return false;
		}

		for (i = 0, ilen=a0.length; i < ilen; ++i) {
			v0 = a0[i];
			v1 = a1[i];

			if (v0 instanceof Array && v1 instanceof Array) {
				if (!helpers.arrayEquals(v0, v1)) {
					return false;
				}
			} else if (v0 !== v1) {
				// NOTE: two different object instances will never be equal: {x:20} != {x:20}
				return false;
			}
		}

		return true;
	};
	helpers.callCallback = function(fn, args, _tArg) {
		if (fn && typeof fn.call === 'function') {
			fn.apply(_tArg, args);
		}
	};
	helpers.getHoverColor = function(colorValue) {
		/* global CanvasPattern */
		return (colorValue instanceof CanvasPattern) ?
			colorValue :
			helpers.color(colorValue).saturate(0.5).darken(0.1).rgbString();
	};
};

},{"3":3}],27:[function(require,module,exports){
'use strict';

module.exports = function() {

	// Occupy the global variable of Chart, and create a simple base class
	var Chart = function(context, config) {
		var me = this;
		var helpers = Chart.helpers;
		me.config = config || {
			data: {
				datasets: []
			}
		};

		// Support a jQuery'd canvas element
		if (context.length && context[0].getContext) {
			context = context[0];
		}

		// Support a canvas domnode
		if (context.getContext) {
			context = context.getContext('2d');
		}

		me.ctx = context;
		me.canvas = context.canvas;

		context.canvas.style.display = context.canvas.style.display || 'block';

		// Figure out what the size of the chart will be.
		// If the canvas has a specified width and height, we use those else
		// we look to see if the canvas node has a CSS width and height.
		// If there is still no height, fill the parent container
		me.width = context.canvas.width || parseInt(helpers.getStyle(context.canvas, 'width'), 10) || helpers.getMaximumWidth(context.canvas);
		me.height = context.canvas.height || parseInt(helpers.getStyle(context.canvas, 'height'), 10) || helpers.getMaximumHeight(context.canvas);

		me.aspectRatio = me.width / me.height;

		if (isNaN(me.aspectRatio) || isFinite(me.aspectRatio) === false) {
			// If the canvas has no size, try and figure out what the aspect ratio will be.
			// Some charts prefer square canvases (pie, radar, etc). If that is specified, use that
			// else use the canvas default ratio of 2
			me.aspectRatio = config.aspectRatio !== undefined ? config.aspectRatio : 2;
		}

		// Store the original style of the element so we can set it back
		me.originalCanvasStyleWidth = context.canvas.style.width;
		me.originalCanvasStyleHeight = context.canvas.style.height;

		// High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
		helpers.retinaScale(me);
		me.controller = new Chart.Controller(me);

		// Always bind this so that if the responsive state changes we still work
		helpers.addResizeListener(context.canvas.parentNode, function() {
			if (me.controller && me.controller.config.options.responsive) {
				me.controller.resize();
			}
		});

		return me.controller ? me.controller : me;

	};

	// Globally expose the defaults to allow for user updating/changing
	Chart.defaults = {
		global: {
			responsive: true,
			responsiveAnimationDuration: 0,
			maintainAspectRatio: true,
			events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
			hover: {
				onHover: null,
				mode: 'single',
				animationDuration: 400
			},
			onClick: null,
			defaultColor: 'rgba(0,0,0,0.1)',
			defaultFontColor: '#666',
			defaultFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
			defaultFontSize: 12,
			defaultFontStyle: 'normal',
			showLines: true,

			// Element defaults defined in element extensions
			elements: {},

			// Legend callback string
			legendCallback: function(chart) {
				var text = [];
				text.push('<ul class="' + chart.id + '-legend">');
				for (var i = 0; i < chart.data.datasets.length; i++) {
					text.push('<li><span style="background-color:' + chart.data.datasets[i].backgroundColor + '"></span>');
					if (chart.data.datasets[i].label) {
						text.push(chart.data.datasets[i].label);
					}
					text.push('</li>');
				}
				text.push('</ul>');

				return text.join('');
			}
		}
	};

	Chart.Chart = Chart;

	return Chart;

};

},{}],28:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	// The layout service is very self explanatory.  It's responsible for the layout within a chart.
	// Scales, Legends and Plugins all rely on the layout service and can easily register to be placed anywhere they need
	// It is this service's responsibility of carrying out that layout.
	Chart.layoutService = {
		defaults: {},

		// Register a box to a chartInstance. A box is simply a reference to an object that requires layout. eg. Scales, Legend, Plugins.
		addBox: function(chartInstance, box) {
			if (!chartInstance.boxes) {
				chartInstance.boxes = [];
			}
			chartInstance.boxes.push(box);
		},

		removeBox: function(chartInstance, box) {
			if (!chartInstance.boxes) {
				return;
			}
			chartInstance.boxes.splice(chartInstance.boxes.indexOf(box), 1);
		},

		// The most important function
		update: function(chartInstance, width, height) {

			if (!chartInstance) {
				return;
			}

			var xPadding = 0;
			var yPadding = 0;

			var leftBoxes = helpers.where(chartInstance.boxes, function(box) {
				return box.options.position === 'left';
			});
			var rightBoxes = helpers.where(chartInstance.boxes, function(box) {
				return box.options.position === 'right';
			});
			var topBoxes = helpers.where(chartInstance.boxes, function(box) {
				return box.options.position === 'top';
			});
			var bottomBoxes = helpers.where(chartInstance.boxes, function(box) {
				return box.options.position === 'bottom';
			});

			// Boxes that overlay the chartarea such as the radialLinear scale
			var chartAreaBoxes = helpers.where(chartInstance.boxes, function(box) {
				return box.options.position === 'chartArea';
			});

			// Ensure that full width boxes are at the very top / bottom
			topBoxes.sort(function(a, b) {
				return (b.options.fullWidth ? 1 : 0) - (a.options.fullWidth ? 1 : 0);
			});
			bottomBoxes.sort(function(a, b) {
				return (a.options.fullWidth ? 1 : 0) - (b.options.fullWidth ? 1 : 0);
			});

			// Essentially we now have any number of boxes on each of the 4 sides.
			// Our canvas looks like the following.
			// The areas L1 and L2 are the left axes. R1 is the right axis, T1 is the top axis and
			// B1 is the bottom axis
			// There are also 4 quadrant-like locations (left to right instead of clockwise) reserved for chart overlays
			// These locations are single-box locations only, when trying to register a chartArea location that is already taken,
			// an error will be thrown.
			//
			// |----------------------------------------------------|
			// |                  T1 (Full Width)                   |
			// |----------------------------------------------------|
			// |    |    |                 T2                  |    |
			// |    |----|-------------------------------------|----|
			// |    |    | C1 |                           | C2 |    |
			// |    |    |----|                           |----|    |
			// |    |    |                                     |    |
			// | L1 | L2 |           ChartArea (C0)            | R1 |
			// |    |    |                                     |    |
			// |    |    |----|                           |----|    |
			// |    |    | C3 |                           | C4 |    |
			// |    |----|-------------------------------------|----|
			// |    |    |                 B1                  |    |
			// |----------------------------------------------------|
			// |                  B2 (Full Width)                   |
			// |----------------------------------------------------|
			//
			// What we do to find the best sizing, we do the following
			// 1. Determine the minimum size of the chart area.
			// 2. Split the remaining width equally between each vertical axis
			// 3. Split the remaining height equally between each horizontal axis
			// 4. Give each layout the maximum size it can be. The layout will return it's minimum size
			// 5. Adjust the sizes of each axis based on it's minimum reported size.
			// 6. Refit each axis
			// 7. Position each axis in the final location
			// 8. Tell the chart the final location of the chart area
			// 9. Tell any axes that overlay the chart area the positions of the chart area

			// Step 1
			var chartWidth = width - (2 * xPadding);
			var chartHeight = height - (2 * yPadding);
			var chartAreaWidth = chartWidth / 2; // min 50%
			var chartAreaHeight = chartHeight / 2; // min 50%

			// Step 2
			var verticalBoxWidth = (width - chartAreaWidth) / (leftBoxes.length + rightBoxes.length);

			// Step 3
			var horizontalBoxHeight = (height - chartAreaHeight) / (topBoxes.length + bottomBoxes.length);

			// Step 4
			var maxChartAreaWidth = chartWidth;
			var maxChartAreaHeight = chartHeight;
			var minBoxSizes = [];

			function getMinimumBoxSize(box) {
				var minSize;
				var isHorizontal = box.isHorizontal();

				if (isHorizontal) {
					minSize = box.update(box.options.fullWidth ? chartWidth : maxChartAreaWidth, horizontalBoxHeight);
					maxChartAreaHeight -= minSize.height;
				} else {
					minSize = box.update(verticalBoxWidth, chartAreaHeight);
					maxChartAreaWidth -= minSize.width;
				}

				minBoxSizes.push({
					horizontal: isHorizontal,
					minSize: minSize,
					box: box
				});
			}

			helpers.each(leftBoxes.concat(rightBoxes, topBoxes, bottomBoxes), getMinimumBoxSize);

			// At this point, maxChartAreaHeight and maxChartAreaWidth are the size the chart area could
			// be if the axes are drawn at their minimum sizes.

			// Steps 5 & 6
			var totalLeftBoxesWidth = xPadding;
			var totalRightBoxesWidth = xPadding;
			var totalTopBoxesHeight = yPadding;
			var totalBottomBoxesHeight = yPadding;

			// Function to fit a box
			function fitBox(box) {
				var minBoxSize = helpers.findNextWhere(minBoxSizes, function(minBox) {
					return minBox.box === box;
				});

				if (minBoxSize) {
					if (box.isHorizontal()) {
						var scaleMargin = {
							left: totalLeftBoxesWidth,
							right: totalRightBoxesWidth,
							top: 0,
							bottom: 0
						};

						// Don't use min size here because of label rotation. When the labels are rotated, their rotation highly depends
						// on the margin. Sometimes they need to increase in size slightly
						box.update(box.options.fullWidth ? chartWidth : maxChartAreaWidth, chartHeight / 2, scaleMargin);
					} else {
						box.update(minBoxSize.minSize.width, maxChartAreaHeight);
					}
				}
			}

			// Update, and calculate the left and right margins for the horizontal boxes
			helpers.each(leftBoxes.concat(rightBoxes), fitBox);

			helpers.each(leftBoxes, function(box) {
				totalLeftBoxesWidth += box.width;
			});

			helpers.each(rightBoxes, function(box) {
				totalRightBoxesWidth += box.width;
			});

			// Set the Left and Right margins for the horizontal boxes
			helpers.each(topBoxes.concat(bottomBoxes), fitBox);

			// Figure out how much margin is on the top and bottom of the vertical boxes
			helpers.each(topBoxes, function(box) {
				totalTopBoxesHeight += box.height;
			});

			helpers.each(bottomBoxes, function(box) {
				totalBottomBoxesHeight += box.height;
			});

			function finalFitVerticalBox(box) {
				var minBoxSize = helpers.findNextWhere(minBoxSizes, function(minSize) {
					return minSize.box === box;
				});

				var scaleMargin = {
					left: 0,
					right: 0,
					top: totalTopBoxesHeight,
					bottom: totalBottomBoxesHeight
				};

				if (minBoxSize) {
					box.update(minBoxSize.minSize.width, maxChartAreaHeight, scaleMargin);
				}
			}

			// Let the left layout know the final margin
			helpers.each(leftBoxes.concat(rightBoxes), finalFitVerticalBox);

			// Recalculate because the size of each layout might have changed slightly due to the margins (label rotation for instance)
			totalLeftBoxesWidth = xPadding;
			totalRightBoxesWidth = xPadding;
			totalTopBoxesHeight = yPadding;
			totalBottomBoxesHeight = yPadding;

			helpers.each(leftBoxes, function(box) {
				totalLeftBoxesWidth += box.width;
			});

			helpers.each(rightBoxes, function(box) {
				totalRightBoxesWidth += box.width;
			});

			helpers.each(topBoxes, function(box) {
				totalTopBoxesHeight += box.height;
			});
			helpers.each(bottomBoxes, function(box) {
				totalBottomBoxesHeight += box.height;
			});

			// Figure out if our chart area changed. This would occur if the dataset layout label rotation
			// changed due to the application of the margins in step 6. Since we can only get bigger, this is safe to do
			// without calling `fit` again
			var newMaxChartAreaHeight = height - totalTopBoxesHeight - totalBottomBoxesHeight;
			var newMaxChartAreaWidth = width - totalLeftBoxesWidth - totalRightBoxesWidth;

			if (newMaxChartAreaWidth !== maxChartAreaWidth || newMaxChartAreaHeight !== maxChartAreaHeight) {
				helpers.each(leftBoxes, function(box) {
					box.height = newMaxChartAreaHeight;
				});

				helpers.each(rightBoxes, function(box) {
					box.height = newMaxChartAreaHeight;
				});

				helpers.each(topBoxes, function(box) {
					if (!box.options.fullWidth) {
						box.width = newMaxChartAreaWidth;
					}
				});

				helpers.each(bottomBoxes, function(box) {
					if (!box.options.fullWidth) {
						box.width = newMaxChartAreaWidth;
					}
				});

				maxChartAreaHeight = newMaxChartAreaHeight;
				maxChartAreaWidth = newMaxChartAreaWidth;
			}

			// Step 7 - Position the boxes
			var left = xPadding;
			var top = yPadding;

			function placeBox(box) {
				if (box.isHorizontal()) {
					box.left = box.options.fullWidth ? xPadding : totalLeftBoxesWidth;
					box.right = box.options.fullWidth ? width - xPadding : totalLeftBoxesWidth + maxChartAreaWidth;
					box.top = top;
					box.bottom = top + box.height;

					// Move to next point
					top = box.bottom;

				} else {

					box.left = left;
					box.right = left + box.width;
					box.top = totalTopBoxesHeight;
					box.bottom = totalTopBoxesHeight + maxChartAreaHeight;

					// Move to next point
					left = box.right;
				}
			}

			helpers.each(leftBoxes.concat(topBoxes), placeBox);

			// Account for chart width and height
			left += maxChartAreaWidth;
			top += maxChartAreaHeight;

			helpers.each(rightBoxes, placeBox);
			helpers.each(bottomBoxes, placeBox);

			// Step 8
			chartInstance.chartArea = {
				left: totalLeftBoxesWidth,
				top: totalTopBoxesHeight,
				right: totalLeftBoxesWidth + maxChartAreaWidth,
				bottom: totalTopBoxesHeight + maxChartAreaHeight
			};

			// Step 9
			helpers.each(chartAreaBoxes, function(box) {
				box.left = chartInstance.chartArea.left;
				box.top = chartInstance.chartArea.top;
				box.right = chartInstance.chartArea.right;
				box.bottom = chartInstance.chartArea.bottom;

				box.update(maxChartAreaWidth, maxChartAreaHeight);
			});
		}
	};
};

},{}],29:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var noop = helpers.noop;

	Chart.defaults.global.legend = {

		display: true,
		position: 'top',
		fullWidth: true, // marks that this box should take the full width of the canvas (pushing down other boxes)
		reverse: false,

		// a callback that will handle
		onClick: function(e, legendItem) {
			var index = legendItem.datasetIndex;
			var ci = this.chart;
			var meta = ci.getDatasetMeta(index);

			// See controller.isDatasetVisible comment
			meta.hidden = meta.hidden === null? !ci.data.datasets[index].hidden : null;

			// We hid a dataset ... rerender the chart
			ci.update();
		},

		onHover: null,

		labels: {
			boxWidth: 40,
			padding: 10,
			// Generates labels shown in the legend
			// Valid properties to return:
			// text : text to display
			// fillStyle : fill of coloured box
			// strokeStyle: stroke of coloured box
			// hidden : if this legend item refers to a hidden item
			// lineCap : cap style for line
			// lineDash
			// lineDashOffset :
			// lineJoin :
			// lineWidth :
			generateLabels: function(chart) {
				var data = chart.data;
				return helpers.isArray(data.datasets) ? data.datasets.map(function(dataset, i) {
					return {
						text: dataset.label,
						fillStyle: (!helpers.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0]),
						hidden: !chart.isDatasetVisible(i),
						lineCap: dataset.borderCapStyle,
						lineDash: dataset.borderDash,
						lineDashOffset: dataset.borderDashOffset,
						lineJoin: dataset.borderJoinStyle,
						lineWidth: dataset.borderWidth,
						strokeStyle: dataset.borderColor,
						pointStyle: dataset.pointStyle,

						// Below is extra data used for toggling the datasets
						datasetIndex: i
					};
				}, this) : [];
			}
		}
	};

	Chart.Legend = Chart.Element.extend({

		initialize: function(config) {
			helpers.extend(this, config);

			// Contains hit boxes for each dataset (in dataset order)
			this.legendHitBoxes = [];

			// Are we in doughnut mode which has a different data type
			this.doughnutMode = false;
		},

		// These methods are ordered by lifecyle. Utilities then follow.
		// Any function defined here is inherited by all legend types.
		// Any function can be extended by the legend type

		beforeUpdate: noop,
		update: function(maxWidth, maxHeight, margins) {
			var me = this;

			// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
			me.beforeUpdate();

			// Absorb the master measurements
			me.maxWidth = maxWidth;
			me.maxHeight = maxHeight;
			me.margins = margins;

			// Dimensions
			me.beforeSetDimensions();
			me.setDimensions();
			me.afterSetDimensions();
			// Labels
			me.beforeBuildLabels();
			me.buildLabels();
			me.afterBuildLabels();

			// Fit
			me.beforeFit();
			me.fit();
			me.afterFit();
			//
			me.afterUpdate();

			return me.minSize;
		},
		afterUpdate: noop,

		//

		beforeSetDimensions: noop,
		setDimensions: function() {
			var me = this;
			// Set the unconstrained dimension before label rotation
			if (me.isHorizontal()) {
				// Reset position before calculating rotation
				me.width = me.maxWidth;
				me.left = 0;
				me.right = me.width;
			} else {
				me.height = me.maxHeight;

				// Reset position before calculating rotation
				me.top = 0;
				me.bottom = me.height;
			}

			// Reset padding
			me.paddingLeft = 0;
			me.paddingTop = 0;
			me.paddingRight = 0;
			me.paddingBottom = 0;

			// Reset minSize
			me.minSize = {
				width: 0,
				height: 0
			};
		},
		afterSetDimensions: noop,

		//

		beforeBuildLabels: noop,
		buildLabels: function() {
			var me = this;
			me.legendItems = me.options.labels.generateLabels.call(me, me.chart);
			if (me.options.reverse) {
				me.legendItems.reverse();
			}
		},
		afterBuildLabels: noop,

		//

		beforeFit: noop,
		fit: function() {
			var me = this;
			var opts = me.options;
			var labelOpts = opts.labels;
			var display = opts.display;

			var ctx = me.ctx;

			var globalDefault = Chart.defaults.global,
				itemOrDefault = helpers.getValueOrDefault,
				fontSize = itemOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize),
				fontStyle = itemOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle),
				fontFamily = itemOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily),
				labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);

			// Reset hit boxes
			var hitboxes = me.legendHitBoxes = [];

			var minSize = me.minSize;
			var isHorizontal = me.isHorizontal();

			if (isHorizontal) {
				minSize.width = me.maxWidth; // fill all the width
				minSize.height = display ? 10 : 0;
			} else {
				minSize.width = display ? 10 : 0;
				minSize.height = me.maxHeight; // fill all the height
			}

			// Increase sizes here
			if (display) {
				ctx.font = labelFont;

				if (isHorizontal) {
					// Labels

					// Width of each line of legend boxes. Labels wrap onto multiple lines when there are too many to fit on one
					var lineWidths = me.lineWidths = [0];
					var totalHeight = me.legendItems.length ? fontSize + (labelOpts.padding) : 0;

					ctx.textAlign = 'left';
					ctx.textBaseline = 'top';

					helpers.each(me.legendItems, function(legendItem, i) {
						var boxWidth = labelOpts.usePointStyle ?
							fontSize * Math.sqrt(2) :
							labelOpts.boxWidth;

						var width = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;
						if (lineWidths[lineWidths.length - 1] + width + labelOpts.padding >= me.width) {
							totalHeight += fontSize + (labelOpts.padding);
							lineWidths[lineWidths.length] = me.left;
						}

						// Store the hitbox width and height here. Final position will be updated in `draw`
						hitboxes[i] = {
							left: 0,
							top: 0,
							width: width,
							height: fontSize
						};

						lineWidths[lineWidths.length - 1] += width + labelOpts.padding;
					});

					minSize.height += totalHeight;

				} else {
					var vPadding = labelOpts.padding;
					var columnWidths = me.columnWidths = [];
					var totalWidth = labelOpts.padding;
					var currentColWidth = 0;
					var currentColHeight = 0;
					var itemHeight = fontSize + vPadding;

					helpers.each(me.legendItems, function(legendItem, i) {
						// If usePointStyle is set, multiple boxWidth by 2 since it represents
						// the radius and not truly the width
						var boxWidth = labelOpts.usePointStyle ? 2 * labelOpts.boxWidth : labelOpts.boxWidth;

						var itemWidth = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;

						// If too tall, go to new column
						if (currentColHeight + itemHeight > minSize.height) {
							totalWidth += currentColWidth + labelOpts.padding;
							columnWidths.push(currentColWidth); // previous column width

							currentColWidth = 0;
							currentColHeight = 0;
						}

						// Get max width
						currentColWidth = Math.max(currentColWidth, itemWidth);
						currentColHeight += itemHeight;

						// Store the hitbox width and height here. Final position will be updated in `draw`
						hitboxes[i] = {
							left: 0,
							top: 0,
							width: itemWidth,
							height: fontSize
						};
					});

					totalWidth += currentColWidth;
					columnWidths.push(currentColWidth);
					minSize.width += totalWidth;
				}
			}

			me.width = minSize.width;
			me.height = minSize.height;
		},
		afterFit: noop,

		// Shared Methods
		isHorizontal: function() {
			return this.options.position === 'top' || this.options.position === 'bottom';
		},

		// Actualy draw the legend on the canvas
		draw: function() {
			var me = this;
			var opts = me.options;
			var labelOpts = opts.labels;
			var globalDefault = Chart.defaults.global,
				lineDefault = globalDefault.elements.line,
				legendWidth = me.width,
				lineWidths = me.lineWidths;

			if (opts.display) {
				var ctx = me.ctx,
					cursor,
					itemOrDefault = helpers.getValueOrDefault,
					fontColor = itemOrDefault(labelOpts.fontColor, globalDefault.defaultFontColor),
					fontSize = itemOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize),
					fontStyle = itemOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle),
					fontFamily = itemOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily),
					labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);

				// Canvas setup
				ctx.textAlign = 'left';
				ctx.textBaseline = 'top';
				ctx.lineWidth = 0.5;
				ctx.strokeStyle = fontColor; // for strikethrough effect
				ctx.fillStyle = fontColor; // render in correct colour
				ctx.font = labelFont;

				var boxWidth = labelOpts.boxWidth,
					hitboxes = me.legendHitBoxes;

				// current position
				var drawLegendBox = function(x, y, legendItem) {
					if (isNaN(boxWidth) || boxWidth <= 0) {
						return;
					}

					// Set the ctx for the box
					ctx.save();

					ctx.fillStyle = itemOrDefault(legendItem.fillStyle, globalDefault.defaultColor);
					ctx.lineCap = itemOrDefault(legendItem.lineCap, lineDefault.borderCapStyle);
					ctx.lineDashOffset = itemOrDefault(legendItem.lineDashOffset, lineDefault.borderDashOffset);
					ctx.lineJoin = itemOrDefault(legendItem.lineJoin, lineDefault.borderJoinStyle);
					ctx.lineWidth = itemOrDefault(legendItem.lineWidth, lineDefault.borderWidth);
					ctx.strokeStyle = itemOrDefault(legendItem.strokeStyle, globalDefault.defaultColor);
					var isLineWidthZero = (itemOrDefault(legendItem.lineWidth, lineDefault.borderWidth) === 0);

					if (ctx.setLineDash) {
						// IE 9 and 10 do not support line dash
						ctx.setLineDash(itemOrDefault(legendItem.lineDash, lineDefault.borderDash));
					}

					if (opts.labels && opts.labels.usePointStyle) {
						// Recalulate x and y for drawPoint() because its expecting
						// x and y to be center of figure (instead of top left)
						var radius = fontSize * Math.SQRT2 / 2;
						var offSet = radius / Math.SQRT2;
						var centerX = x + offSet;
						var centerY = y + offSet;

						// Draw pointStyle as legend symbol
						Chart.canvasHelpers.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY);
					} else {
						// Draw box as legend symbol
						if (!isLineWidthZero) {
							ctx.strokeRect(x, y, boxWidth, fontSize);
						}
						ctx.fillRect(x, y, boxWidth, fontSize);
					}

					ctx.restore();
				};
				var fillText = function(x, y, legendItem, textWidth) {
					ctx.fillText(legendItem.text, boxWidth + (fontSize / 2) + x, y);

					if (legendItem.hidden) {
						// Strikethrough the text if hidden
						ctx.beginPath();
						ctx.lineWidth = 2;
						ctx.moveTo(boxWidth + (fontSize / 2) + x, y + (fontSize / 2));
						ctx.lineTo(boxWidth + (fontSize / 2) + x + textWidth, y + (fontSize / 2));
						ctx.stroke();
					}
				};

				// Horizontal
				var isHorizontal = me.isHorizontal();
				if (isHorizontal) {
					cursor = {
						x: me.left + ((legendWidth - lineWidths[0]) / 2),
						y: me.top + labelOpts.padding,
						line: 0
					};
				} else {
					cursor = {
						x: me.left + labelOpts.padding,
						y: me.top + labelOpts.padding,
						line: 0
					};
				}

				var itemHeight = fontSize + labelOpts.padding;
				helpers.each(me.legendItems, function(legendItem, i) {
					var textWidth = ctx.measureText(legendItem.text).width,
						width = labelOpts.usePointStyle ?
							fontSize + (fontSize / 2) + textWidth :
							boxWidth + (fontSize / 2) + textWidth,
						x = cursor.x,
						y = cursor.y;

					if (isHorizontal) {
						if (x + width >= legendWidth) {
							y = cursor.y += itemHeight;
							cursor.line++;
							x = cursor.x = me.left + ((legendWidth - lineWidths[cursor.line]) / 2);
						}
					} else if (y + itemHeight > me.bottom) {
						x = cursor.x = x + me.columnWidths[cursor.line] + labelOpts.padding;
						y = cursor.y = me.top;
						cursor.line++;
					}

					drawLegendBox(x, y, legendItem);

					hitboxes[i].left = x;
					hitboxes[i].top = y;

					// Fill the actual label
					fillText(x, y, legendItem, textWidth);

					if (isHorizontal) {
						cursor.x += width + (labelOpts.padding);
					} else {
						cursor.y += itemHeight;
					}

				});
			}
		},

		// Handle an event
		handleEvent: function(e) {
			var me = this;
			var opts = me.options;
			var type = e.type === 'mouseup' ? 'click' : e.type;

			if (type === 'mousemove') {
				if (!opts.onHover) {
					return;
				}
			} else if (type === 'click') {
				if (!opts.onClick) {
					return;
				}
			} else {
				return;
			}

			var position = helpers.getRelativePosition(e, me.chart.chart),
				x = position.x,
				y = position.y;

			if (x >= me.left && x <= me.right && y >= me.top && y <= me.bottom) {
				// See if we are touching one of the dataset boxes
				var lh = me.legendHitBoxes;
				for (var i = 0; i < lh.length; ++i) {
					var hitBox = lh[i];

					if (x >= hitBox.left && x <= hitBox.left + hitBox.width && y >= hitBox.top && y <= hitBox.top + hitBox.height) {
						// Touching an element
						if (type === 'click') {
							opts.onClick.call(me, e, me.legendItems[i]);
							break;
						} else if (type === 'mousemove') {
							opts.onHover.call(me, e, me.legendItems[i]);
							break;
						}
					}
				}
			}
		}
	});

	// Register the legend plugin
	Chart.plugins.register({
		beforeInit: function(chartInstance) {
			var opts = chartInstance.options;
			var legendOpts = opts.legend;

			if (legendOpts) {
				chartInstance.legend = new Chart.Legend({
					ctx: chartInstance.chart.ctx,
					options: legendOpts,
					chart: chartInstance
				});

				Chart.layoutService.addBox(chartInstance, chartInstance.legend);
			}
		}
	});
};

},{}],30:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var noop = Chart.helpers.noop;

	/**
	 * The plugin service singleton
	 * @namespace Chart.plugins
	 * @since 2.1.0
	 */
	Chart.plugins = {
		_plugins: [],

		/**
		 * Registers the given plugin(s) if not already registered.
		 * @param {Array|Object} plugins plugin instance(s).
		 */
		register: function(plugins) {
			var p = this._plugins;
			([]).concat(plugins).forEach(function(plugin) {
				if (p.indexOf(plugin) === -1) {
					p.push(plugin);
				}
			});
		},

		/**
		 * Unregisters the given plugin(s) only if registered.
		 * @param {Array|Object} plugins plugin instance(s).
		 */
		unregister: function(plugins) {
			var p = this._plugins;
			([]).concat(plugins).forEach(function(plugin) {
				var idx = p.indexOf(plugin);
				if (idx !== -1) {
					p.splice(idx, 1);
				}
			});
		},

		/**
		 * Remove all registered p^lugins.
		 * @since 2.1.5
		 */
		clear: function() {
			this._plugins = [];
		},

		/**
		 * Returns the number of registered plugins?
		 * @returns {Number}
		 * @since 2.1.5
		 */
		count: function() {
			return this._plugins.length;
		},

		/**
		 * Returns all registered plugin intances.
		 * @returns {Array} array of plugin objects.
		 * @since 2.1.5
		 */
		getAll: function() {
			return this._plugins;
		},

		/**
		 * Calls registered plugins on the specified extension, with the given args. This
		 * method immediately returns as soon as a plugin explicitly returns false. The
		 * returned value can be used, for instance, to interrupt the current action.
		 * @param {String} extension the name of the plugin method to call (e.g. 'beforeUpdate').
		 * @param {Array} [args] extra arguments to apply to the extension call.
		 * @returns {Boolean} false if any of the plugins return false, else returns true.
		 */
		notify: function(extension, args) {
			var plugins = this._plugins;
			var ilen = plugins.length;
			var i, plugin;

			for (i=0; i<ilen; ++i) {
				plugin = plugins[i];
				if (typeof plugin[extension] === 'function') {
					if (plugin[extension].apply(plugin, args || []) === false) {
						return false;
					}
				}
			}

			return true;
		}
	};

	/**
	 * Plugin extension methods.
	 * @interface Chart.PluginBase
	 * @since 2.1.0
	 */
	Chart.PluginBase = Chart.Element.extend({
		// Called at start of chart init
		beforeInit: noop,

		// Called at end of chart init
		afterInit: noop,

		// Called at start of update
		beforeUpdate: noop,

		// Called at end of update
		afterUpdate: noop,

		// Called at start of draw
		beforeDraw: noop,

		// Called at end of draw
		afterDraw: noop,

		// Called during destroy
		destroy: noop
	});

	/**
	 * Provided for backward compatibility, use Chart.plugins instead
	 * @namespace Chart.pluginService
	 * @deprecated since version 2.1.5
	 * @todo remove me at version 3
	 */
	Chart.pluginService = Chart.plugins;
};

},{}],31:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.scale = {
		display: true,
		position: 'left',

		// grid line settings
		gridLines: {
			display: true,
			color: 'rgba(0, 0, 0, 0.1)',
			lineWidth: 1,
			drawBorder: true,
			drawOnChartArea: true,
			drawTicks: true,
			tickMarkLength: 10,
			zeroLineWidth: 1,
			zeroLineColor: 'rgba(0,0,0,0.25)',
			offsetGridLines: false,
			borderDash: [],
			borderDashOffset: 0.0
		},

		// scale label
		scaleLabel: {
			// actual label
			labelString: '',

			// display property
			display: false
		},

		// label settings
		ticks: {
			beginAtZero: false,
			minRotation: 0,
			maxRotation: 50,
			mirror: false,
			padding: 10,
			reverse: false,
			display: true,
			autoSkip: true,
			autoSkipPadding: 0,
			labelOffset: 0,
			// We pass through arrays to be rendered as multiline labels, we convert Others to strings here.
			callback: function(value) {
				return helpers.isArray(value) ? value : '' + value;
			}
		}
	};

	Chart.Scale = Chart.Element.extend({

		// These methods are ordered by lifecyle. Utilities then follow.
		// Any function defined here is inherited by all scale types.
		// Any function can be extended by the scale type

		beforeUpdate: function() {
			helpers.callCallback(this.options.beforeUpdate, [this]);
		},
		update: function(maxWidth, maxHeight, margins) {
			var me = this;

			// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
			me.beforeUpdate();

			// Absorb the master measurements
			me.maxWidth = maxWidth;
			me.maxHeight = maxHeight;
			me.margins = helpers.extend({
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			}, margins);

			// Dimensions
			me.beforeSetDimensions();
			me.setDimensions();
			me.afterSetDimensions();

			// Data min/max
			me.beforeDataLimits();
			me.determineDataLimits();
			me.afterDataLimits();

			// Ticks
			me.beforeBuildTicks();
			me.buildTicks();
			me.afterBuildTicks();

			me.beforeTickToLabelConversion();
			me.convertTicksToLabels();
			me.afterTickToLabelConversion();

			// Tick Rotation
			me.beforeCalculateTickRotation();
			me.calculateTickRotation();
			me.afterCalculateTickRotation();
			// Fit
			me.beforeFit();
			me.fit();
			me.afterFit();
			//
			me.afterUpdate();

			return me.minSize;

		},
		afterUpdate: function() {
			helpers.callCallback(this.options.afterUpdate, [this]);
		},

		//

		beforeSetDimensions: function() {
			helpers.callCallback(this.options.beforeSetDimensions, [this]);
		},
		setDimensions: function() {
			var me = this;
			// Set the unconstrained dimension before label rotation
			if (me.isHorizontal()) {
				// Reset position before calculating rotation
				me.width = me.maxWidth;
				me.left = 0;
				me.right = me.width;
			} else {
				me.height = me.maxHeight;

				// Reset position before calculating rotation
				me.top = 0;
				me.bottom = me.height;
			}

			// Reset padding
			me.paddingLeft = 0;
			me.paddingTop = 0;
			me.paddingRight = 0;
			me.paddingBottom = 0;
		},
		afterSetDimensions: function() {
			helpers.callCallback(this.options.afterSetDimensions, [this]);
		},

		// Data limits
		beforeDataLimits: function() {
			helpers.callCallback(this.options.beforeDataLimits, [this]);
		},
		determineDataLimits: helpers.noop,
		afterDataLimits: function() {
			helpers.callCallback(this.options.afterDataLimits, [this]);
		},

		//
		beforeBuildTicks: function() {
			helpers.callCallback(this.options.beforeBuildTicks, [this]);
		},
		buildTicks: helpers.noop,
		afterBuildTicks: function() {
			helpers.callCallback(this.options.afterBuildTicks, [this]);
		},

		beforeTickToLabelConversion: function() {
			helpers.callCallback(this.options.beforeTickToLabelConversion, [this]);
		},
		convertTicksToLabels: function() {
			var me = this;
			// Convert ticks to strings
			me.ticks = me.ticks.map(function(numericalTick, index, ticks) {
				if (me.options.ticks.userCallback) {
					return me.options.ticks.userCallback(numericalTick, index, ticks);
				}
				return me.options.ticks.callback(numericalTick, index, ticks);
			},
			me);
		},
		afterTickToLabelConversion: function() {
			helpers.callCallback(this.options.afterTickToLabelConversion, [this]);
		},

		//

		beforeCalculateTickRotation: function() {
			helpers.callCallback(this.options.beforeCalculateTickRotation, [this]);
		},
		calculateTickRotation: function() {
			var me = this;
			var context = me.ctx;
			var globalDefaults = Chart.defaults.global;
			var optionTicks = me.options.ticks;

			// Get the width of each grid by calculating the difference
			// between x offsets between 0 and 1.
			var tickFontSize = helpers.getValueOrDefault(optionTicks.fontSize, globalDefaults.defaultFontSize);
			var tickFontStyle = helpers.getValueOrDefault(optionTicks.fontStyle, globalDefaults.defaultFontStyle);
			var tickFontFamily = helpers.getValueOrDefault(optionTicks.fontFamily, globalDefaults.defaultFontFamily);
			var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
			context.font = tickLabelFont;

			var firstWidth = context.measureText(me.ticks[0]).width;
			var lastWidth = context.measureText(me.ticks[me.ticks.length - 1]).width;
			var firstRotated;

			me.labelRotation = optionTicks.minRotation || 0;
			me.paddingRight = 0;
			me.paddingLeft = 0;

			if (me.options.display) {
				if (me.isHorizontal()) {
					me.paddingRight = lastWidth / 2 + 3;
					me.paddingLeft = firstWidth / 2 + 3;

					if (!me.longestTextCache) {
						me.longestTextCache = {};
					}
					var originalLabelWidth = helpers.longestText(context, tickLabelFont, me.ticks, me.longestTextCache);
					var labelWidth = originalLabelWidth;
					var cosRotation;
					var sinRotation;

					// Allow 3 pixels x2 padding either side for label readability
					// only the index matters for a dataset scale, but we want a consistent interface between scales
					var tickWidth = me.getPixelForTick(1) - me.getPixelForTick(0) - 6;

					// Max label rotation can be set or default to 90 - also act as a loop counter
					while (labelWidth > tickWidth && me.labelRotation < optionTicks.maxRotation) {
						cosRotation = Math.cos(helpers.toRadians(me.labelRotation));
						sinRotation = Math.sin(helpers.toRadians(me.labelRotation));

						firstRotated = cosRotation * firstWidth;

						// We're right aligning the text now.
						if (firstRotated + tickFontSize / 2 > me.yLabelWidth) {
							me.paddingLeft = firstRotated + tickFontSize / 2;
						}

						me.paddingRight = tickFontSize / 2;

						if (sinRotation * originalLabelWidth > me.maxHeight) {
							// go back one step
							me.labelRotation--;
							break;
						}

						me.labelRotation++;
						labelWidth = cosRotation * originalLabelWidth;
					}
				}
			}

			if (me.margins) {
				me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
				me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
			}
		},
		afterCalculateTickRotation: function() {
			helpers.callCallback(this.options.afterCalculateTickRotation, [this]);
		},

		//

		beforeFit: function() {
			helpers.callCallback(this.options.beforeFit, [this]);
		},
		fit: function() {
			var me = this;
			// Reset
			var minSize = me.minSize = {
				width: 0,
				height: 0
			};

			var opts = me.options;
			var globalDefaults = Chart.defaults.global;
			var tickOpts = opts.ticks;
			var scaleLabelOpts = opts.scaleLabel;
			var gridLineOpts = opts.gridLines;
			var display = opts.display;
			var isHorizontal = me.isHorizontal();

			var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
			var tickFontStyle = helpers.getValueOrDefault(tickOpts.fontStyle, globalDefaults.defaultFontStyle);
			var tickFontFamily = helpers.getValueOrDefault(tickOpts.fontFamily, globalDefaults.defaultFontFamily);
			var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);

			var scaleLabelFontSize = helpers.getValueOrDefault(scaleLabelOpts.fontSize, globalDefaults.defaultFontSize);

			var tickMarkLength = opts.gridLines.tickMarkLength;

			// Width
			if (isHorizontal) {
				// subtract the margins to line up with the chartArea if we are a full width scale
				minSize.width = me.isFullWidth() ? me.maxWidth - me.margins.left - me.margins.right : me.maxWidth;
			} else {
				minSize.width = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
			}

			// height
			if (isHorizontal) {
				minSize.height = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
			} else {
				minSize.height = me.maxHeight; // fill all the height
			}

			// Are we showing a title for the scale?
			if (scaleLabelOpts.display && display) {
				if (isHorizontal) {
					minSize.height += (scaleLabelFontSize * 1.5);
				} else {
					minSize.width += (scaleLabelFontSize * 1.5);
				}
			}

			if (tickOpts.display && display) {
				// Don't bother fitting the ticks if we are not showing them
				if (!me.longestTextCache) {
					me.longestTextCache = {};
				}

				var largestTextWidth = helpers.longestText(me.ctx, tickLabelFont, me.ticks, me.longestTextCache);
				var tallestLabelHeightInLines = helpers.numberOfLabelLines(me.ticks);
				var lineSpace = tickFontSize * 0.5;

				if (isHorizontal) {
					// A horizontal axis is more constrained by the height.
					me.longestLabelWidth = largestTextWidth;

					// TODO - improve this calculation
					var labelHeight = (Math.sin(helpers.toRadians(me.labelRotation)) * me.longestLabelWidth) + (tickFontSize * tallestLabelHeightInLines) + (lineSpace * tallestLabelHeightInLines);

					minSize.height = Math.min(me.maxHeight, minSize.height + labelHeight);
					me.ctx.font = tickLabelFont;

					var firstLabelWidth = me.ctx.measureText(me.ticks[0]).width;
					var lastLabelWidth = me.ctx.measureText(me.ticks[me.ticks.length - 1]).width;

					// Ensure that our ticks are always inside the canvas. When rotated, ticks are right aligned which means that the right padding is dominated
					// by the font height
					var cosRotation = Math.cos(helpers.toRadians(me.labelRotation));
					var sinRotation = Math.sin(helpers.toRadians(me.labelRotation));
					me.paddingLeft = me.labelRotation !== 0 ? (cosRotation * firstLabelWidth) + 3 : firstLabelWidth / 2 + 3; // add 3 px to move away from canvas edges
					me.paddingRight = me.labelRotation !== 0 ? (sinRotation * (tickFontSize / 2)) + 3 : lastLabelWidth / 2 + 3; // when rotated
				} else {
					// A vertical axis is more constrained by the width. Labels are the dominant factor here, so get that length first
					var maxLabelWidth = me.maxWidth - minSize.width;

					// Account for padding
					var mirror = tickOpts.mirror;
					if (!mirror) {
						largestTextWidth += me.options.ticks.padding;
					} else {
						// If mirrored text is on the inside so don't expand
						largestTextWidth = 0;
					}

					if (largestTextWidth < maxLabelWidth) {
						// We don't need all the room
						minSize.width += largestTextWidth;
					} else {
						// Expand to max size
						minSize.width = me.maxWidth;
					}

					me.paddingTop = tickFontSize / 2;
					me.paddingBottom = tickFontSize / 2;
				}
			}

			if (me.margins) {
				me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
				me.paddingTop = Math.max(me.paddingTop - me.margins.top, 0);
				me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
				me.paddingBottom = Math.max(me.paddingBottom - me.margins.bottom, 0);
			}

			me.width = minSize.width;
			me.height = minSize.height;

		},
		afterFit: function() {
			helpers.callCallback(this.options.afterFit, [this]);
		},

		// Shared Methods
		isHorizontal: function() {
			return this.options.position === 'top' || this.options.position === 'bottom';
		},
		isFullWidth: function() {
			return (this.options.fullWidth);
		},

		// Get the correct value. NaN bad inputs, If the value type is object get the x or y based on whether we are horizontal or not
		getRightValue: function(rawValue) {
			// Null and undefined values first
			if (rawValue === null || typeof(rawValue) === 'undefined') {
				return NaN;
			}
			// isNaN(object) returns true, so make sure NaN is checking for a number
			if (typeof(rawValue) === 'number' && isNaN(rawValue)) {
				return NaN;
			}
			// If it is in fact an object, dive in one more level
			if (typeof(rawValue) === 'object') {
				if ((rawValue instanceof Date) || (rawValue.isValid)) {
					return rawValue;
				}
				return this.getRightValue(this.isHorizontal() ? rawValue.x : rawValue.y);
			}

			// Value is good, return it
			return rawValue;
		},

		// Used to get the value to display in the tooltip for the data at the given index
		// function getLabelForIndex(index, datasetIndex)
		getLabelForIndex: helpers.noop,

		// Used to get data value locations.  Value can either be an index or a numerical value
		getPixelForValue: helpers.noop,

		// Used to get the data value from a given pixel. This is the inverse of getPixelForValue
		getValueForPixel: helpers.noop,

		// Used for tick location, should
		getPixelForTick: function(index, includeOffset) {
			var me = this;
			if (me.isHorizontal()) {
				var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
				var tickWidth = innerWidth / Math.max((me.ticks.length - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);
				var pixel = (tickWidth * index) + me.paddingLeft;

				if (includeOffset) {
					pixel += tickWidth / 2;
				}

				var finalVal = me.left + Math.round(pixel);
				finalVal += me.isFullWidth() ? me.margins.left : 0;
				return finalVal;
			}
			var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
			return me.top + (index * (innerHeight / (me.ticks.length - 1)));
		},

		// Utility for getting the pixel location of a percentage of scale
		getPixelForDecimal: function(decimal /* , includeOffset*/) {
			var me = this;
			if (me.isHorizontal()) {
				var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
				var valueOffset = (innerWidth * decimal) + me.paddingLeft;

				var finalVal = me.left + Math.round(valueOffset);
				finalVal += me.isFullWidth() ? me.margins.left : 0;
				return finalVal;
			}
			return me.top + (decimal * me.height);
		},

		getBasePixel: function() {
			var me = this;
			var min = me.min;
			var max = me.max;

			return me.getPixelForValue(
				me.beginAtZero? 0:
				min < 0 && max < 0? max :
				min > 0 && max > 0? min :
				0);
		},

		// Actualy draw the scale on the canvas
		// @param {rectangle} chartArea : the area of the chart to draw full grid lines on
		draw: function(chartArea) {
			var me = this;
			var options = me.options;
			if (!options.display) {
				return;
			}

			var context = me.ctx;
			var globalDefaults = Chart.defaults.global;
			var optionTicks = options.ticks;
			var gridLines = options.gridLines;
			var scaleLabel = options.scaleLabel;

			var isRotated = me.labelRotation !== 0;
			var skipRatio;
			var useAutoskipper = optionTicks.autoSkip;
			var isHorizontal = me.isHorizontal();

			// figure out the maximum number of gridlines to show
			var maxTicks;
			if (optionTicks.maxTicksLimit) {
				maxTicks = optionTicks.maxTicksLimit;
			}

			var tickFontColor = helpers.getValueOrDefault(optionTicks.fontColor, globalDefaults.defaultFontColor);
			var tickFontSize = helpers.getValueOrDefault(optionTicks.fontSize, globalDefaults.defaultFontSize);
			var tickFontStyle = helpers.getValueOrDefault(optionTicks.fontStyle, globalDefaults.defaultFontStyle);
			var tickFontFamily = helpers.getValueOrDefault(optionTicks.fontFamily, globalDefaults.defaultFontFamily);
			var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
			var tl = gridLines.tickMarkLength;
			var borderDash = helpers.getValueOrDefault(gridLines.borderDash, globalDefaults.borderDash);
			var borderDashOffset = helpers.getValueOrDefault(gridLines.borderDashOffset, globalDefaults.borderDashOffset);

			var scaleLabelFontColor = helpers.getValueOrDefault(scaleLabel.fontColor, globalDefaults.defaultFontColor);
			var scaleLabelFontSize = helpers.getValueOrDefault(scaleLabel.fontSize, globalDefaults.defaultFontSize);
			var scaleLabelFontStyle = helpers.getValueOrDefault(scaleLabel.fontStyle, globalDefaults.defaultFontStyle);
			var scaleLabelFontFamily = helpers.getValueOrDefault(scaleLabel.fontFamily, globalDefaults.defaultFontFamily);
			var scaleLabelFont = helpers.fontString(scaleLabelFontSize, scaleLabelFontStyle, scaleLabelFontFamily);

			var labelRotationRadians = helpers.toRadians(me.labelRotation);
			var cosRotation = Math.cos(labelRotationRadians);
			var longestRotatedLabel = me.longestLabelWidth * cosRotation;

			// Make sure we draw text in the correct color and font
			context.fillStyle = tickFontColor;

			var itemsToDraw = [];

			if (isHorizontal) {
				skipRatio = false;

				// Only calculate the skip ratio with the half width of longestRotateLabel if we got an actual rotation
				// See #2584
				if (isRotated) {
					longestRotatedLabel /= 2;
				}

				if ((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length > (me.width - (me.paddingLeft + me.paddingRight))) {
					skipRatio = 1 + Math.floor(((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length) / (me.width - (me.paddingLeft + me.paddingRight)));
				}

				// if they defined a max number of optionTicks,
				// increase skipRatio until that number is met
				if (maxTicks && me.ticks.length > maxTicks) {
					while (!skipRatio || me.ticks.length / (skipRatio || 1) > maxTicks) {
						if (!skipRatio) {
							skipRatio = 1;
						}
						skipRatio += 1;
					}
				}

				if (!useAutoskipper) {
					skipRatio = false;
				}
			}


			var xTickStart = options.position === 'right' ? me.left : me.right - tl;
			var xTickEnd = options.position === 'right' ? me.left + tl : me.right;
			var yTickStart = options.position === 'bottom' ? me.top : me.bottom - tl;
			var yTickEnd = options.position === 'bottom' ? me.top + tl : me.bottom;

			helpers.each(me.ticks, function(label, index) {
				// If the callback returned a null or undefined value, do not draw this line
				if (label === undefined || label === null) {
					return;
				}

				var isLastTick = me.ticks.length === index + 1;

				// Since we always show the last tick,we need may need to hide the last shown one before
				var shouldSkip = (skipRatio > 1 && index % skipRatio > 0) || (index % skipRatio === 0 && index + skipRatio >= me.ticks.length);
				if (shouldSkip && !isLastTick || (label === undefined || label === null)) {
					return;
				}

				var lineWidth, lineColor;
				if (index === (typeof me.zeroLineIndex !== 'undefined' ? me.zeroLineIndex : 0)) {
					// Draw the first index specially
					lineWidth = gridLines.zeroLineWidth;
					lineColor = gridLines.zeroLineColor;
				} else {
					lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, index);
					lineColor = helpers.getValueAtIndexOrDefault(gridLines.color, index);
				}

				// Common properties
				var tx1, ty1, tx2, ty2, x1, y1, x2, y2, labelX, labelY;
				var textAlign = 'middle';
				var textBaseline = 'middle';

				if (isHorizontal) {
					if (!isRotated) {
						textBaseline = options.position === 'top' ? 'bottom' : 'top';
					}

					textAlign = isRotated ? 'right' : 'center';

					var xLineValue = me.getPixelForTick(index) + helpers.aliasPixel(lineWidth); // xvalues for grid lines
					labelX = me.getPixelForTick(index, gridLines.offsetGridLines) + optionTicks.labelOffset; // x values for optionTicks (need to consider offsetLabel option)
					labelY = (isRotated) ? me.top + 12 : options.position === 'top' ? me.bottom - tl : me.top + tl;

					tx1 = tx2 = x1 = x2 = xLineValue;
					ty1 = yTickStart;
					ty2 = yTickEnd;
					y1 = chartArea.top;
					y2 = chartArea.bottom;
				} else {
					if (options.position === 'left') {
						if (optionTicks.mirror) {
							labelX = me.right + optionTicks.padding;
							textAlign = 'left';
						} else {
							labelX = me.right - optionTicks.padding;
							textAlign = 'right';
						}
					// right side
					} else if (optionTicks.mirror) {
						labelX = me.left - optionTicks.padding;
						textAlign = 'right';
					} else {
						labelX = me.left + optionTicks.padding;
						textAlign = 'left';
					}

					var yLineValue = me.getPixelForTick(index); // xvalues for grid lines
					yLineValue += helpers.aliasPixel(lineWidth);
					labelY = me.getPixelForTick(index, gridLines.offsetGridLines);

					tx1 = xTickStart;
					tx2 = xTickEnd;
					x1 = chartArea.left;
					x2 = chartArea.right;
					ty1 = ty2 = y1 = y2 = yLineValue;
				}

				itemsToDraw.push({
					tx1: tx1,
					ty1: ty1,
					tx2: tx2,
					ty2: ty2,
					x1: x1,
					y1: y1,
					x2: x2,
					y2: y2,
					labelX: labelX,
					labelY: labelY,
					glWidth: lineWidth,
					glColor: lineColor,
					glBorderDash: borderDash,
					glBorderDashOffset: borderDashOffset,
					rotation: -1 * labelRotationRadians,
					label: label,
					textBaseline: textBaseline,
					textAlign: textAlign
				});
			});

			// Draw all of the tick labels, tick marks, and grid lines at the correct places
			helpers.each(itemsToDraw, function(itemToDraw) {
				if (gridLines.display) {
					context.save();
					context.lineWidth = itemToDraw.glWidth;
					context.strokeStyle = itemToDraw.glColor;
					if (context.setLineDash) {
						context.setLineDash(itemToDraw.glBorderDash);
						context.lineDashOffset = itemToDraw.glBorderDashOffset;
					}

					context.beginPath();

					if (gridLines.drawTicks) {
						context.moveTo(itemToDraw.tx1, itemToDraw.ty1);
						context.lineTo(itemToDraw.tx2, itemToDraw.ty2);
					}

					if (gridLines.drawOnChartArea) {
						context.moveTo(itemToDraw.x1, itemToDraw.y1);
						context.lineTo(itemToDraw.x2, itemToDraw.y2);
					}

					context.stroke();
					context.restore();
				}

				if (optionTicks.display) {
					context.save();
					context.translate(itemToDraw.labelX, itemToDraw.labelY);
					context.rotate(itemToDraw.rotation);
					context.font = tickLabelFont;
					context.textBaseline = itemToDraw.textBaseline;
					context.textAlign = itemToDraw.textAlign;

					var label = itemToDraw.label;
					if (helpers.isArray(label)) {
						for (var i = 0, y = -(label.length - 1)*tickFontSize*0.75; i < label.length; ++i) {
							// We just make sure the multiline element is a string here..
							context.fillText('' + label[i], 0, y);
							// apply same lineSpacing as calculated @ L#320
							y += (tickFontSize * 1.5);
						}
					} else {
						context.fillText(label, 0, 0);
					}
					context.restore();
				}
			});

			if (scaleLabel.display) {
				// Draw the scale label
				var scaleLabelX;
				var scaleLabelY;
				var rotation = 0;

				if (isHorizontal) {
					scaleLabelX = me.left + ((me.right - me.left) / 2); // midpoint of the width
					scaleLabelY = options.position === 'bottom' ? me.bottom - (scaleLabelFontSize / 2) : me.top + (scaleLabelFontSize / 2);
				} else {
					var isLeft = options.position === 'left';
					scaleLabelX = isLeft ? me.left + (scaleLabelFontSize / 2) : me.right - (scaleLabelFontSize / 2);
					scaleLabelY = me.top + ((me.bottom - me.top) / 2);
					rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI;
				}

				context.save();
				context.translate(scaleLabelX, scaleLabelY);
				context.rotate(rotation);
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.fillStyle = scaleLabelFontColor; // render in correct colour
				context.font = scaleLabelFont;
				context.fillText(scaleLabel.labelString, 0, 0);
				context.restore();
			}

			if (gridLines.drawBorder) {
				// Draw the line at the edge of the axis
				context.lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, 0);
				context.strokeStyle = helpers.getValueAtIndexOrDefault(gridLines.color, 0);
				var x1 = me.left,
					x2 = me.right,
					y1 = me.top,
					y2 = me.bottom;

				var aliasPixel = helpers.aliasPixel(context.lineWidth);
				if (isHorizontal) {
					y1 = y2 = options.position === 'top' ? me.bottom : me.top;
					y1 += aliasPixel;
					y2 += aliasPixel;
				} else {
					x1 = x2 = options.position === 'left' ? me.right : me.left;
					x1 += aliasPixel;
					x2 += aliasPixel;
				}

				context.beginPath();
				context.moveTo(x1, y1);
				context.lineTo(x2, y2);
				context.stroke();
			}
		}
	});
};

},{}],32:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.scaleService = {
		// Scale registration object. Extensions can register new scale types (such as log or DB scales) and then
		// use the new chart options to grab the correct scale
		constructors: {},
		// Use a registration function so that we can move to an ES6 map when we no longer need to support
		// old browsers

		// Scale config defaults
		defaults: {},
		registerScaleType: function(type, scaleConstructor, defaults) {
			this.constructors[type] = scaleConstructor;
			this.defaults[type] = helpers.clone(defaults);
		},
		getScaleConstructor: function(type) {
			return this.constructors.hasOwnProperty(type) ? this.constructors[type] : undefined;
		},
		getScaleDefaults: function(type) {
			// Return the scale defaults merged with the global settings so that we always use the latest ones
			return this.defaults.hasOwnProperty(type) ? helpers.scaleMerge(Chart.defaults.scale, this.defaults[type]) : {};
		},
		updateScaleDefaults: function(type, additions) {
			var defaults = this.defaults;
			if (defaults.hasOwnProperty(type)) {
				defaults[type] = helpers.extend(defaults[type], additions);
			}
		},
		addScalesToLayout: function(chartInstance) {
			// Adds each scale to the chart.boxes array to be sized accordingly
			helpers.each(chartInstance.scales, function(scale) {
				Chart.layoutService.addBox(chartInstance, scale);
			});
		}
	};
};

},{}],33:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.global.title = {
		display: false,
		position: 'top',
		fullWidth: true, // marks that this box should take the full width of the canvas (pushing down other boxes)

		fontStyle: 'bold',
		padding: 10,

		// actual title
		text: ''
	};

	var noop = helpers.noop;
	Chart.Title = Chart.Element.extend({

		initialize: function(config) {
			var me = this;
			helpers.extend(me, config);
			me.options = helpers.configMerge(Chart.defaults.global.title, config.options);

			// Contains hit boxes for each dataset (in dataset order)
			me.legendHitBoxes = [];
		},

		// These methods are ordered by lifecyle. Utilities then follow.

		beforeUpdate: function() {
			var chartOpts = this.chart.options;
			if (chartOpts && chartOpts.title) {
				this.options = helpers.configMerge(Chart.defaults.global.title, chartOpts.title);
			}
		},
		update: function(maxWidth, maxHeight, margins) {
			var me = this;

			// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
			me.beforeUpdate();

			// Absorb the master measurements
			me.maxWidth = maxWidth;
			me.maxHeight = maxHeight;
			me.margins = margins;

			// Dimensions
			me.beforeSetDimensions();
			me.setDimensions();
			me.afterSetDimensions();
			// Labels
			me.beforeBuildLabels();
			me.buildLabels();
			me.afterBuildLabels();

			// Fit
			me.beforeFit();
			me.fit();
			me.afterFit();
			//
			me.afterUpdate();

			return me.minSize;

		},
		afterUpdate: noop,

		//

		beforeSetDimensions: noop,
		setDimensions: function() {
			var me = this;
			// Set the unconstrained dimension before label rotation
			if (me.isHorizontal()) {
				// Reset position before calculating rotation
				me.width = me.maxWidth;
				me.left = 0;
				me.right = me.width;
			} else {
				me.height = me.maxHeight;

				// Reset position before calculating rotation
				me.top = 0;
				me.bottom = me.height;
			}

			// Reset padding
			me.paddingLeft = 0;
			me.paddingTop = 0;
			me.paddingRight = 0;
			me.paddingBottom = 0;

			// Reset minSize
			me.minSize = {
				width: 0,
				height: 0
			};
		},
		afterSetDimensions: noop,

		//

		beforeBuildLabels: noop,
		buildLabels: noop,
		afterBuildLabels: noop,

		//

		beforeFit: noop,
		fit: function() {
			var me = this,
				valueOrDefault = helpers.getValueOrDefault,
				opts = me.options,
				globalDefaults = Chart.defaults.global,
				display = opts.display,
				fontSize = valueOrDefault(opts.fontSize, globalDefaults.defaultFontSize),
				minSize = me.minSize;

			if (me.isHorizontal()) {
				minSize.width = me.maxWidth; // fill all the width
				minSize.height = display ? fontSize + (opts.padding * 2) : 0;
			} else {
				minSize.width = display ? fontSize + (opts.padding * 2) : 0;
				minSize.height = me.maxHeight; // fill all the height
			}

			me.width = minSize.width;
			me.height = minSize.height;

		},
		afterFit: noop,

		// Shared Methods
		isHorizontal: function() {
			var pos = this.options.position;
			return pos === 'top' || pos === 'bottom';
		},

		// Actualy draw the title block on the canvas
		draw: function() {
			var me = this,
				ctx = me.ctx,
				valueOrDefault = helpers.getValueOrDefault,
				opts = me.options,
				globalDefaults = Chart.defaults.global;

			if (opts.display) {
				var fontSize = valueOrDefault(opts.fontSize, globalDefaults.defaultFontSize),
					fontStyle = valueOrDefault(opts.fontStyle, globalDefaults.defaultFontStyle),
					fontFamily = valueOrDefault(opts.fontFamily, globalDefaults.defaultFontFamily),
					titleFont = helpers.fontString(fontSize, fontStyle, fontFamily),
					rotation = 0,
					titleX,
					titleY,
					top = me.top,
					left = me.left,
					bottom = me.bottom,
					right = me.right;

				ctx.fillStyle = valueOrDefault(opts.fontColor, globalDefaults.defaultFontColor); // render in correct colour
				ctx.font = titleFont;

				// Horizontal
				if (me.isHorizontal()) {
					titleX = left + ((right - left) / 2); // midpoint of the width
					titleY = top + ((bottom - top) / 2); // midpoint of the height
				} else {
					titleX = opts.position === 'left' ? left + (fontSize / 2) : right - (fontSize / 2);
					titleY = top + ((bottom - top) / 2);
					rotation = Math.PI * (opts.position === 'left' ? -0.5 : 0.5);
				}

				ctx.save();
				ctx.translate(titleX, titleY);
				ctx.rotate(rotation);
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(opts.text, 0, 0);
				ctx.restore();
			}
		}
	});

	// Register the title plugin
	Chart.plugins.register({
		beforeInit: function(chartInstance) {
			var opts = chartInstance.options;
			var titleOpts = opts.title;

			if (titleOpts) {
				chartInstance.titleBlock = new Chart.Title({
					ctx: chartInstance.chart.ctx,
					options: titleOpts,
					chart: chartInstance
				});

				Chart.layoutService.addBox(chartInstance, chartInstance.titleBlock);
			}
		}
	});
};

},{}],34:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.global.tooltips = {
		enabled: true,
		custom: null,
		mode: 'single',
		backgroundColor: 'rgba(0,0,0,0.8)',
		titleFontStyle: 'bold',
		titleSpacing: 2,
		titleMarginBottom: 6,
		titleFontColor: '#fff',
		titleAlign: 'left',
		bodySpacing: 2,
		bodyFontColor: '#fff',
		bodyAlign: 'left',
		footerFontStyle: 'bold',
		footerSpacing: 2,
		footerMarginTop: 6,
		footerFontColor: '#fff',
		footerAlign: 'left',
		yPadding: 6,
		xPadding: 6,
		yAlign: 'center',
		xAlign: 'center',
		caretSize: 5,
		cornerRadius: 6,
		multiKeyBackground: '#fff',
		callbacks: {
			// Args are: (tooltipItems, data)
			beforeTitle: helpers.noop,
			title: function(tooltipItems, data) {
				// Pick first xLabel for now
				var title = '';
				var labels = data.labels;
				var labelCount = labels ? labels.length : 0;

				if (tooltipItems.length > 0) {
					var item = tooltipItems[0];

					if (item.xLabel) {
						title = item.xLabel;
					} else if (labelCount > 0 && item.index < labelCount) {
						title = labels[item.index];
					}
				}

				return title;
			},
			afterTitle: helpers.noop,

			// Args are: (tooltipItems, data)
			beforeBody: helpers.noop,

			// Args are: (tooltipItem, data)
			beforeLabel: helpers.noop,
			label: function(tooltipItem, data) {
				var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
				return datasetLabel + ': ' + tooltipItem.yLabel;
			},
			labelColor: function(tooltipItem, chartInstance) {
				var meta = chartInstance.getDatasetMeta(tooltipItem.datasetIndex);
				var activeElement = meta.data[tooltipItem.index];
				var view = activeElement._view;
				return {
					borderColor: view.borderColor,
					backgroundColor: view.backgroundColor
				};
			},
			afterLabel: helpers.noop,

			// Args are: (tooltipItems, data)
			afterBody: helpers.noop,

			// Args are: (tooltipItems, data)
			beforeFooter: helpers.noop,
			footer: helpers.noop,
			afterFooter: helpers.noop
		}
	};

	// Helper to push or concat based on if the 2nd parameter is an array or not
	function pushOrConcat(base, toPush) {
		if (toPush) {
			if (helpers.isArray(toPush)) {
				// base = base.concat(toPush);
				Array.prototype.push.apply(base, toPush);
			} else {
				base.push(toPush);
			}
		}

		return base;
	}

	function getAveragePosition(elements) {
		if (!elements.length) {
			return false;
		}

		var i, len;
		var xPositions = [];
		var yPositions = [];

		for (i = 0, len = elements.length; i < len; ++i) {
			var el = elements[i];
			if (el && el.hasValue()) {
				var pos = el.tooltipPosition();
				xPositions.push(pos.x);
				yPositions.push(pos.y);
			}
		}

		var x = 0,
			y = 0;
		for (i = 0; i < xPositions.length; ++i) {
			if (xPositions[i]) {
				x += xPositions[i];
				y += yPositions[i];
			}
		}

		return {
			x: Math.round(x / xPositions.length),
			y: Math.round(y / xPositions.length)
		};
	}

	// Private helper to create a tooltip iteam model
	// @param element : the chart element (point, arc, bar) to create the tooltip item for
	// @return : new tooltip item
	function createTooltipItem(element) {
		var xScale = element._xScale;
		var yScale = element._yScale || element._scale; // handle radar || polarArea charts
		var index = element._index,
			datasetIndex = element._datasetIndex;

		return {
			xLabel: xScale ? xScale.getLabelForIndex(index, datasetIndex) : '',
			yLabel: yScale ? yScale.getLabelForIndex(index, datasetIndex) : '',
			index: index,
			datasetIndex: datasetIndex
		};
	}

	Chart.Tooltip = Chart.Element.extend({
		initialize: function() {
			var me = this;
			var globalDefaults = Chart.defaults.global;
			var tooltipOpts = me._options;
			var getValueOrDefault = helpers.getValueOrDefault;

			helpers.extend(me, {
				_model: {
					// Positioning
					xPadding: tooltipOpts.xPadding,
					yPadding: tooltipOpts.yPadding,
					xAlign: tooltipOpts.xAlign,
					yAlign: tooltipOpts.yAlign,

					// Body
					bodyFontColor: tooltipOpts.bodyFontColor,
					_bodyFontFamily: getValueOrDefault(tooltipOpts.bodyFontFamily, globalDefaults.defaultFontFamily),
					_bodyFontStyle: getValueOrDefault(tooltipOpts.bodyFontStyle, globalDefaults.defaultFontStyle),
					_bodyAlign: tooltipOpts.bodyAlign,
					bodyFontSize: getValueOrDefault(tooltipOpts.bodyFontSize, globalDefaults.defaultFontSize),
					bodySpacing: tooltipOpts.bodySpacing,

					// Title
					titleFontColor: tooltipOpts.titleFontColor,
					_titleFontFamily: getValueOrDefault(tooltipOpts.titleFontFamily, globalDefaults.defaultFontFamily),
					_titleFontStyle: getValueOrDefault(tooltipOpts.titleFontStyle, globalDefaults.defaultFontStyle),
					titleFontSize: getValueOrDefault(tooltipOpts.titleFontSize, globalDefaults.defaultFontSize),
					_titleAlign: tooltipOpts.titleAlign,
					titleSpacing: tooltipOpts.titleSpacing,
					titleMarginBottom: tooltipOpts.titleMarginBottom,

					// Footer
					footerFontColor: tooltipOpts.footerFontColor,
					_footerFontFamily: getValueOrDefault(tooltipOpts.footerFontFamily, globalDefaults.defaultFontFamily),
					_footerFontStyle: getValueOrDefault(tooltipOpts.footerFontStyle, globalDefaults.defaultFontStyle),
					footerFontSize: getValueOrDefault(tooltipOpts.footerFontSize, globalDefaults.defaultFontSize),
					_footerAlign: tooltipOpts.footerAlign,
					footerSpacing: tooltipOpts.footerSpacing,
					footerMarginTop: tooltipOpts.footerMarginTop,

					// Appearance
					caretSize: tooltipOpts.caretSize,
					cornerRadius: tooltipOpts.cornerRadius,
					backgroundColor: tooltipOpts.backgroundColor,
					opacity: 0,
					legendColorBackground: tooltipOpts.multiKeyBackground
				}
			});
		},

		// Get the title
		// Args are: (tooltipItem, data)
		getTitle: function() {
			var me = this;
			var opts = me._options;
			var callbacks = opts.callbacks;

			var beforeTitle = callbacks.beforeTitle.apply(me, arguments),
				title = callbacks.title.apply(me, arguments),
				afterTitle = callbacks.afterTitle.apply(me, arguments);

			var lines = [];
			lines = pushOrConcat(lines, beforeTitle);
			lines = pushOrConcat(lines, title);
			lines = pushOrConcat(lines, afterTitle);

			return lines;
		},

		// Args are: (tooltipItem, data)
		getBeforeBody: function() {
			var lines = this._options.callbacks.beforeBody.apply(this, arguments);
			return helpers.isArray(lines) ? lines : lines !== undefined ? [lines] : [];
		},

		// Args are: (tooltipItem, data)
		getBody: function(tooltipItems, data) {
			var me = this;
			var callbacks = me._options.callbacks;
			var bodyItems = [];

			helpers.each(tooltipItems, function(tooltipItem) {
				var bodyItem = {
					before: [],
					lines: [],
					after: []
				};
				pushOrConcat(bodyItem.before, callbacks.beforeLabel.call(me, tooltipItem, data));
				pushOrConcat(bodyItem.lines, callbacks.label.call(me, tooltipItem, data));
				pushOrConcat(bodyItem.after, callbacks.afterLabel.call(me, tooltipItem, data));

				bodyItems.push(bodyItem);
			});

			return bodyItems;
		},

		// Args are: (tooltipItem, data)
		getAfterBody: function() {
			var lines = this._options.callbacks.afterBody.apply(this, arguments);
			return helpers.isArray(lines) ? lines : lines !== undefined ? [lines] : [];
		},

		// Get the footer and beforeFooter and afterFooter lines
		// Args are: (tooltipItem, data)
		getFooter: function() {
			var me = this;
			var callbacks = me._options.callbacks;

			var beforeFooter = callbacks.beforeFooter.apply(me, arguments);
			var footer = callbacks.footer.apply(me, arguments);
			var afterFooter = callbacks.afterFooter.apply(me, arguments);

			var lines = [];
			lines = pushOrConcat(lines, beforeFooter);
			lines = pushOrConcat(lines, footer);
			lines = pushOrConcat(lines, afterFooter);

			return lines;
		},

		update: function(changed) {
			var me = this;
			var opts = me._options;
			var model = me._model;
			var active = me._active;

			var data = me._data;
			var chartInstance = me._chartInstance;

			var i, len;

			if (active.length) {
				model.opacity = 1;

				var labelColors = [],
					tooltipPosition = getAveragePosition(active);

				var tooltipItems = [];
				for (i = 0, len = active.length; i < len; ++i) {
					tooltipItems.push(createTooltipItem(active[i]));
				}

				// If the user provided a sorting function, use it to modify the tooltip items
				if (opts.itemSort) {
					tooltipItems = tooltipItems.sort(function(a, b) {
						return opts.itemSort(a, b, data);
					});
				}

				// If there is more than one item, show color items
				if (active.length > 1) {
					helpers.each(tooltipItems, function(tooltipItem) {
						labelColors.push(opts.callbacks.labelColor.call(me, tooltipItem, chartInstance));
					});
				}

				// Build the Text Lines
				helpers.extend(model, {
					title: me.getTitle(tooltipItems, data),
					beforeBody: me.getBeforeBody(tooltipItems, data),
					body: me.getBody(tooltipItems, data),
					afterBody: me.getAfterBody(tooltipItems, data),
					footer: me.getFooter(tooltipItems, data),
					x: Math.round(tooltipPosition.x),
					y: Math.round(tooltipPosition.y),
					caretPadding: helpers.getValueOrDefault(tooltipPosition.padding, 2),
					labelColors: labelColors
				});

				// We need to determine alignment of
				var tooltipSize = me.getTooltipSize(model);
				me.determineAlignment(tooltipSize); // Smart Tooltip placement to stay on the canvas

				helpers.extend(model, me.getBackgroundPoint(model, tooltipSize));
			} else {
				me._model.opacity = 0;
			}

			if (changed && opts.custom) {
				opts.custom.call(me, model);
			}

			return me;
		},
		getTooltipSize: function(vm) {
			var ctx = this._chart.ctx;

			var size = {
				height: vm.yPadding * 2, // Tooltip Padding
				width: 0
			};

			// Count of all lines in the body
			var body = vm.body;
			var combinedBodyLength = body.reduce(function(count, bodyItem) {
				return count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length;
			}, 0);
			combinedBodyLength += vm.beforeBody.length + vm.afterBody.length;

			var titleLineCount = vm.title.length;
			var footerLineCount = vm.footer.length;
			var titleFontSize = vm.titleFontSize,
				bodyFontSize = vm.bodyFontSize,
				footerFontSize = vm.footerFontSize;

			size.height += titleLineCount * titleFontSize; // Title Lines
			size.height += (titleLineCount - 1) * vm.titleSpacing; // Title Line Spacing
			size.height += titleLineCount ? vm.titleMarginBottom : 0; // Title's bottom Margin
			size.height += combinedBodyLength * bodyFontSize; // Body Lines
			size.height += combinedBodyLength ? (combinedBodyLength - 1) * vm.bodySpacing : 0; // Body Line Spacing
			size.height += footerLineCount ? vm.footerMarginTop : 0; // Footer Margin
			size.height += footerLineCount * (footerFontSize); // Footer Lines
			size.height += footerLineCount ? (footerLineCount - 1) * vm.footerSpacing : 0; // Footer Line Spacing

			// Title width
			var widthPadding = 0;
			var maxLineWidth = function(line) {
				size.width = Math.max(size.width, ctx.measureText(line).width + widthPadding);
			};

			ctx.font = helpers.fontString(titleFontSize, vm._titleFontStyle, vm._titleFontFamily);
			helpers.each(vm.title, maxLineWidth);

			// Body width
			ctx.font = helpers.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);
			helpers.each(vm.beforeBody.concat(vm.afterBody), maxLineWidth);

			// Body lines may include some extra width due to the color box
			widthPadding = body.length > 1 ? (bodyFontSize + 2) : 0;
			helpers.each(body, function(bodyItem) {
				helpers.each(bodyItem.before, maxLineWidth);
				helpers.each(bodyItem.lines, maxLineWidth);
				helpers.each(bodyItem.after, maxLineWidth);
			});

			// Reset back to 0
			widthPadding = 0;

			// Footer width
			ctx.font = helpers.fontString(footerFontSize, vm._footerFontStyle, vm._footerFontFamily);
			helpers.each(vm.footer, maxLineWidth);

			// Add padding
			size.width += 2 * vm.xPadding;

			return size;
		},
		determineAlignment: function(size) {
			var me = this;
			var model = me._model;
			var chart = me._chart;
			var chartArea = me._chartInstance.chartArea;

			if (model.y < size.height) {
				model.yAlign = 'top';
			} else if (model.y > (chart.height - size.height)) {
				model.yAlign = 'bottom';
			}

			var lf, rf; // functions to determine left, right alignment
			var olf, orf; // functions to determine if left/right alignment causes tooltip to go outside chart
			var yf; // function to get the y alignment if the tooltip goes outside of the left or right edges
			var midX = (chartArea.left + chartArea.right) / 2;
			var midY = (chartArea.top + chartArea.bottom) / 2;

			if (model.yAlign === 'center') {
				lf = function(x) {
					return x <= midX;
				};
				rf = function(x) {
					return x > midX;
				};
			} else {
				lf = function(x) {
					return x <= (size.width / 2);
				};
				rf = function(x) {
					return x >= (chart.width - (size.width / 2));
				};
			}

			olf = function(x) {
				return x + size.width > chart.width;
			};
			orf = function(x) {
				return x - size.width < 0;
			};
			yf = function(y) {
				return y <= midY ? 'top' : 'bottom';
			};

			if (lf(model.x)) {
				model.xAlign = 'left';

				// Is tooltip too wide and goes over the right side of the chart.?
				if (olf(model.x)) {
					model.xAlign = 'center';
					model.yAlign = yf(model.y);
				}
			} else if (rf(model.x)) {
				model.xAlign = 'right';

				// Is tooltip too wide and goes outside left edge of canvas?
				if (orf(model.x)) {
					model.xAlign = 'center';
					model.yAlign = yf(model.y);
				}
			}
		},
		getBackgroundPoint: function(vm, size) {
			// Background Position
			var pt = {
				x: vm.x,
				y: vm.y
			};

			var caretSize = vm.caretSize,
				caretPadding = vm.caretPadding,
				cornerRadius = vm.cornerRadius,
				xAlign = vm.xAlign,
				yAlign = vm.yAlign,
				paddingAndSize = caretSize + caretPadding,
				radiusAndPadding = cornerRadius + caretPadding;

			if (xAlign === 'right') {
				pt.x -= size.width;
			} else if (xAlign === 'center') {
				pt.x -= (size.width / 2);
			}

			if (yAlign === 'top') {
				pt.y += paddingAndSize;
			} else if (yAlign === 'bottom') {
				pt.y -= size.height + paddingAndSize;
			} else {
				pt.y -= (size.height / 2);
			}

			if (yAlign === 'center') {
				if (xAlign === 'left') {
					pt.x += paddingAndSize;
				} else if (xAlign === 'right') {
					pt.x -= paddingAndSize;
				}
			} else if (xAlign === 'left') {
				pt.x -= radiusAndPadding;
			} else if (xAlign === 'right') {
				pt.x += radiusAndPadding;
			}

			return pt;
		},
		drawCaret: function(tooltipPoint, size, opacity) {
			var vm = this._view;
			var ctx = this._chart.ctx;
			var x1, x2, x3;
			var y1, y2, y3;
			var caretSize = vm.caretSize;
			var cornerRadius = vm.cornerRadius;
			var xAlign = vm.xAlign,
				yAlign = vm.yAlign;
			var ptX = tooltipPoint.x,
				ptY = tooltipPoint.y;
			var width = size.width,
				height = size.height;

			if (yAlign === 'center') {
				// Left or right side
				if (xAlign === 'left') {
					x1 = ptX;
					x2 = x1 - caretSize;
					x3 = x1;
				} else {
					x1 = ptX + width;
					x2 = x1 + caretSize;
					x3 = x1;
				}

				y2 = ptY + (height / 2);
				y1 = y2 - caretSize;
				y3 = y2 + caretSize;
			} else {
				if (xAlign === 'left') {
					x1 = ptX + cornerRadius;
					x2 = x1 + caretSize;
					x3 = x2 + caretSize;
				} else if (xAlign === 'right') {
					x1 = ptX + width - cornerRadius;
					x2 = x1 - caretSize;
					x3 = x2 - caretSize;
				} else {
					x2 = ptX + (width / 2);
					x1 = x2 - caretSize;
					x3 = x2 + caretSize;
				}

				if (yAlign === 'top') {
					y1 = ptY;
					y2 = y1 - caretSize;
					y3 = y1;
				} else {
					y1 = ptY + height;
					y2 = y1 + caretSize;
					y3 = y1;
				}
			}

			var bgColor = helpers.color(vm.backgroundColor);
			ctx.fillStyle = bgColor.alpha(opacity * bgColor.alpha()).rgbString();
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.closePath();
			ctx.fill();
		},
		drawTitle: function(pt, vm, ctx, opacity) {
			var title = vm.title;

			if (title.length) {
				ctx.textAlign = vm._titleAlign;
				ctx.textBaseline = 'top';

				var titleFontSize = vm.titleFontSize,
					titleSpacing = vm.titleSpacing;

				var titleFontColor = helpers.color(vm.titleFontColor);
				ctx.fillStyle = titleFontColor.alpha(opacity * titleFontColor.alpha()).rgbString();
				ctx.font = helpers.fontString(titleFontSize, vm._titleFontStyle, vm._titleFontFamily);

				var i, len;
				for (i = 0, len = title.length; i < len; ++i) {
					ctx.fillText(title[i], pt.x, pt.y);
					pt.y += titleFontSize + titleSpacing; // Line Height and spacing

					if (i + 1 === title.length) {
						pt.y += vm.titleMarginBottom - titleSpacing; // If Last, add margin, remove spacing
					}
				}
			}
		},
		drawBody: function(pt, vm, ctx, opacity) {
			var bodyFontSize = vm.bodyFontSize;
			var bodySpacing = vm.bodySpacing;
			var body = vm.body;

			ctx.textAlign = vm._bodyAlign;
			ctx.textBaseline = 'top';

			var bodyFontColor = helpers.color(vm.bodyFontColor);
			var textColor = bodyFontColor.alpha(opacity * bodyFontColor.alpha()).rgbString();
			ctx.fillStyle = textColor;
			ctx.font = helpers.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);

			// Before Body
			var xLinePadding = 0;
			var fillLineOfText = function(line) {
				ctx.fillText(line, pt.x + xLinePadding, pt.y);
				pt.y += bodyFontSize + bodySpacing;
			};

			// Before body lines
			helpers.each(vm.beforeBody, fillLineOfText);

			var drawColorBoxes = body.length > 1;
			xLinePadding = drawColorBoxes ? (bodyFontSize + 2) : 0;

			// Draw body lines now
			helpers.each(body, function(bodyItem, i) {
				helpers.each(bodyItem.before, fillLineOfText);

				helpers.each(bodyItem.lines, function(line) {
					// Draw Legend-like boxes if needed
					if (drawColorBoxes) {
						// Fill a white rect so that colours merge nicely if the opacity is < 1
						ctx.fillStyle = helpers.color(vm.legendColorBackground).alpha(opacity).rgbaString();
						ctx.fillRect(pt.x, pt.y, bodyFontSize, bodyFontSize);

						// Border
						ctx.strokeStyle = helpers.color(vm.labelColors[i].borderColor).alpha(opacity).rgbaString();
						ctx.strokeRect(pt.x, pt.y, bodyFontSize, bodyFontSize);

						// Inner square
						ctx.fillStyle = helpers.color(vm.labelColors[i].backgroundColor).alpha(opacity).rgbaString();
						ctx.fillRect(pt.x + 1, pt.y + 1, bodyFontSize - 2, bodyFontSize - 2);

						ctx.fillStyle = textColor;
					}

					fillLineOfText(line);
				});

				helpers.each(bodyItem.after, fillLineOfText);
			});

			// Reset back to 0 for after body
			xLinePadding = 0;

			// After body lines
			helpers.each(vm.afterBody, fillLineOfText);
			pt.y -= bodySpacing; // Remove last body spacing
		},
		drawFooter: function(pt, vm, ctx, opacity) {
			var footer = vm.footer;

			if (footer.length) {
				pt.y += vm.footerMarginTop;

				ctx.textAlign = vm._footerAlign;
				ctx.textBaseline = 'top';

				var footerFontColor = helpers.color(vm.footerFontColor);
				ctx.fillStyle = footerFontColor.alpha(opacity * footerFontColor.alpha()).rgbString();
				ctx.font = helpers.fontString(vm.footerFontSize, vm._footerFontStyle, vm._footerFontFamily);

				helpers.each(footer, function(line) {
					ctx.fillText(line, pt.x, pt.y);
					pt.y += vm.footerFontSize + vm.footerSpacing;
				});
			}
		},
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			if (vm.opacity === 0) {
				return;
			}

			var tooltipSize = this.getTooltipSize(vm);
			var pt = {
				x: vm.x,
				y: vm.y
			};

			// IE11/Edge does not like very small opacities, so snap to 0
			var opacity = Math.abs(vm.opacity < 1e-3) ? 0 : vm.opacity;

			if (this._options.enabled) {
				// Draw Background
				var bgColor = helpers.color(vm.backgroundColor);
				ctx.fillStyle = bgColor.alpha(opacity * bgColor.alpha()).rgbString();
				helpers.drawRoundedRectangle(ctx, pt.x, pt.y, tooltipSize.width, tooltipSize.height, vm.cornerRadius);
				ctx.fill();

				// Draw Caret
				this.drawCaret(pt, tooltipSize, opacity);

				// Draw Title, Body, and Footer
				pt.x += vm.xPadding;
				pt.y += vm.yPadding;

				// Titles
				this.drawTitle(pt, vm, ctx, opacity);

				// Body
				this.drawBody(pt, vm, ctx, opacity);

				// Footer
				this.drawFooter(pt, vm, ctx, opacity);
			}
		}
	});
};

},{}],35:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers,
		globalOpts = Chart.defaults.global;

	globalOpts.elements.arc = {
		backgroundColor: globalOpts.defaultColor,
		borderColor: '#fff',
		borderWidth: 2
	};

	Chart.elements.Arc = Chart.Element.extend({
		inLabelRange: function(mouseX) {
			var vm = this._view;

			if (vm) {
				return (Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hoverRadius, 2));
			}
			return false;
		},
		inRange: function(chartX, chartY) {
			var vm = this._view;

			if (vm) {
				var pointRelativePosition = helpers.getAngleFromPoint(vm, {
						x: chartX,
						y: chartY
					}),
					angle = pointRelativePosition.angle,
					distance = pointRelativePosition.distance;

				// Sanitise angle range
				var startAngle = vm.startAngle;
				var endAngle = vm.endAngle;
				while (endAngle < startAngle) {
					endAngle += 2.0 * Math.PI;
				}
				while (angle > endAngle) {
					angle -= 2.0 * Math.PI;
				}
				while (angle < startAngle) {
					angle += 2.0 * Math.PI;
				}

				// Check if within the range of the open/close angle
				var betweenAngles = (angle >= startAngle && angle <= endAngle),
					withinRadius = (distance >= vm.innerRadius && distance <= vm.outerRadius);

				return (betweenAngles && withinRadius);
			}
			return false;
		},
		tooltipPosition: function() {
			var vm = this._view;

			var centreAngle = vm.startAngle + ((vm.endAngle - vm.startAngle) / 2),
				rangeFromCentre = (vm.outerRadius - vm.innerRadius) / 2 + vm.innerRadius;
			return {
				x: vm.x + (Math.cos(centreAngle) * rangeFromCentre),
				y: vm.y + (Math.sin(centreAngle) * rangeFromCentre)
			};
		},
		draw: function() {

			var ctx = this._chart.ctx,
				vm = this._view,
				sA = vm.startAngle,
				eA = vm.endAngle;

			ctx.beginPath();

			ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
			ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);

			ctx.closePath();
			ctx.strokeStyle = vm.borderColor;
			ctx.lineWidth = vm.borderWidth;

			ctx.fillStyle = vm.backgroundColor;

			ctx.fill();
			ctx.lineJoin = 'bevel';

			if (vm.borderWidth) {
				ctx.stroke();
			}
		}
	});
};

},{}],36:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalDefaults = Chart.defaults.global;

	Chart.defaults.global.elements.line = {
		tension: 0.4,
		backgroundColor: globalDefaults.defaultColor,
		borderWidth: 3,
		borderColor: globalDefaults.defaultColor,
		borderCapStyle: 'butt',
		borderDash: [],
		borderDashOffset: 0.0,
		borderJoinStyle: 'miter',
		capBezierPoints: true,
		fill: true // do we fill in the area between the line and its base axis
	};

	Chart.elements.Line = Chart.Element.extend({
		draw: function() {
			var me = this;
			var vm = me._view;
			var spanGaps = vm.spanGaps;
			var scaleZero = vm.scaleZero;
			var loop = me._loop;

			var ctx = me._chart.ctx;
			ctx.save();

			// Helper function to draw a line to a point
			function lineToPoint(previousPoint, point) {
				var pointVM = point._view;
				if (point._view.steppedLine === true) {
					ctx.lineTo(pointVM.x, previousPoint._view.y);
					ctx.lineTo(pointVM.x, pointVM.y);
				} else if (point._view.tension === 0) {
					ctx.lineTo(pointVM.x, pointVM.y);
				} else {
					ctx.bezierCurveTo(
						previousPoint._view.controlPointNextX,
						previousPoint._view.controlPointNextY,
						pointVM.controlPointPreviousX,
						pointVM.controlPointPreviousY,
						pointVM.x,
						pointVM.y
					);
				}
			}

			var points = me._children.slice(); // clone array
			var lastDrawnIndex = -1;

			// If we are looping, adding the first point again
			if (loop && points.length) {
				points.push(points[0]);
			}

			var index, current, previous, currentVM;

			// Fill Line
			if (points.length && vm.fill) {
				ctx.beginPath();

				for (index = 0; index < points.length; ++index) {
					current = points[index];
					previous = helpers.previousItem(points, index);
					currentVM = current._view;

					// First point moves to it's starting position no matter what
					if (index === 0) {
						if (loop) {
							ctx.moveTo(scaleZero.x, scaleZero.y);
						} else {
							ctx.moveTo(currentVM.x, scaleZero);
						}

						if (!currentVM.skip) {
							lastDrawnIndex = index;
							ctx.lineTo(currentVM.x, currentVM.y);
						}
					} else {
						previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];

						if (currentVM.skip) {
							// Only do this if this is the first point that is skipped
							if (!spanGaps && lastDrawnIndex === (index - 1)) {
								if (loop) {
									ctx.lineTo(scaleZero.x, scaleZero.y);
								} else {
									ctx.lineTo(previous._view.x, scaleZero);
								}
							}
						} else {
							if (lastDrawnIndex !== (index - 1)) {
								// There was a gap and this is the first point after the gap. If we've never drawn a point, this is a special case.
								// If the first data point is NaN, then there is no real gap to skip
								if (spanGaps && lastDrawnIndex !== -1) {
									// We are spanning the gap, so simple draw a line to this point
									lineToPoint(previous, current);
								} else if (loop) {
									ctx.lineTo(currentVM.x, currentVM.y);
								} else {
									ctx.lineTo(currentVM.x, scaleZero);
									ctx.lineTo(currentVM.x, currentVM.y);
								}
							} else {
								// Line to next point
								lineToPoint(previous, current);
							}
							lastDrawnIndex = index;
						}
					}
				}

				if (!loop && lastDrawnIndex !== -1) {
					ctx.lineTo(points[lastDrawnIndex]._view.x, scaleZero);
				}

				ctx.fillStyle = vm.backgroundColor || globalDefaults.defaultColor;
				ctx.closePath();
				ctx.fill();
			}

			// Stroke Line Options
			var globalOptionLineElements = globalDefaults.elements.line;
			ctx.lineCap = vm.borderCapStyle || globalOptionLineElements.borderCapStyle;

			// IE 9 and 10 do not support line dash
			if (ctx.setLineDash) {
				ctx.setLineDash(vm.borderDash || globalOptionLineElements.borderDash);
			}

			ctx.lineDashOffset = vm.borderDashOffset || globalOptionLineElements.borderDashOffset;
			ctx.lineJoin = vm.borderJoinStyle || globalOptionLineElements.borderJoinStyle;
			ctx.lineWidth = vm.borderWidth || globalOptionLineElements.borderWidth;
			ctx.strokeStyle = vm.borderColor || globalDefaults.defaultColor;

			// Stroke Line
			ctx.beginPath();
			lastDrawnIndex = -1;

			for (index = 0; index < points.length; ++index) {
				current = points[index];
				previous = helpers.previousItem(points, index);
				currentVM = current._view;

				// First point moves to it's starting position no matter what
				if (index === 0) {
					if (!currentVM.skip) {
						ctx.moveTo(currentVM.x, currentVM.y);
						lastDrawnIndex = index;
					}
				} else {
					previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];

					if (!currentVM.skip) {
						if ((lastDrawnIndex !== (index - 1) && !spanGaps) || lastDrawnIndex === -1) {
							// There was a gap and this is the first point after the gap
							ctx.moveTo(currentVM.x, currentVM.y);
						} else {
							// Line to next point
							lineToPoint(previous, current);
						}
						lastDrawnIndex = index;
					}
				}
			}

			ctx.stroke();
			ctx.restore();
		}
	});
};

},{}],37:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers,
		globalOpts = Chart.defaults.global,
		defaultColor = globalOpts.defaultColor;

	globalOpts.elements.point = {
		radius: 3,
		pointStyle: 'circle',
		backgroundColor: defaultColor,
		borderWidth: 1,
		borderColor: defaultColor,
		// Hover
		hitRadius: 1,
		hoverRadius: 4,
		hoverBorderWidth: 1
	};

	Chart.elements.Point = Chart.Element.extend({
		inRange: function(mouseX, mouseY) {
			var vm = this._view;
			return vm ? ((Math.pow(mouseX - vm.x, 2) + Math.pow(mouseY - vm.y, 2)) < Math.pow(vm.hitRadius + vm.radius, 2)) : false;
		},
		inLabelRange: function(mouseX) {
			var vm = this._view;
			return vm ? (Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hitRadius, 2)) : false;
		},
		tooltipPosition: function() {
			var vm = this._view;
			return {
				x: vm.x,
				y: vm.y,
				padding: vm.radius + vm.borderWidth
			};
		},
		draw: function() {
			var vm = this._view;
			var ctx = this._chart.ctx;
			var pointStyle = vm.pointStyle;
			var radius = vm.radius;
			var x = vm.x;
			var y = vm.y;

			if (vm.skip) {
				return;
			}

			ctx.strokeStyle = vm.borderColor || defaultColor;
			ctx.lineWidth = helpers.getValueOrDefault(vm.borderWidth, globalOpts.elements.point.borderWidth);
			ctx.fillStyle = vm.backgroundColor || defaultColor;

			Chart.canvasHelpers.drawPoint(ctx, pointStyle, radius, x, y);
		}
	});
};

},{}],38:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var globalOpts = Chart.defaults.global;

	globalOpts.elements.rectangle = {
		backgroundColor: globalOpts.defaultColor,
		borderWidth: 0,
		borderColor: globalOpts.defaultColor,
		borderSkipped: 'bottom'
	};

	Chart.elements.Rectangle = Chart.Element.extend({
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			var halfWidth = vm.width / 2,
				leftX = vm.x - halfWidth,
				rightX = vm.x + halfWidth,
				top = vm.base - (vm.base - vm.y),
				halfStroke = vm.borderWidth / 2;

			// Canvas doesn't allow us to stroke inside the width so we can
			// adjust the sizes to fit if we're setting a stroke on the line
			if (vm.borderWidth) {
				leftX += halfStroke;
				rightX -= halfStroke;
				top += halfStroke;
			}

			ctx.beginPath();
			ctx.fillStyle = vm.backgroundColor;
			ctx.strokeStyle = vm.borderColor;
			ctx.lineWidth = vm.borderWidth;

			// Corner points, from bottom-left to bottom-right clockwise
			// | 1 2 |
			// | 0 3 |
			var corners = [
				[leftX, vm.base],
				[leftX, top],
				[rightX, top],
				[rightX, vm.base]
			];

			// Find first (starting) corner with fallback to 'bottom'
			var borders = ['bottom', 'left', 'top', 'right'];
			var startCorner = borders.indexOf(vm.borderSkipped, 0);
			if (startCorner === -1) {
				startCorner = 0;
			}

			function cornerAt(index) {
				return corners[(startCorner + index) % 4];
			}

			// Draw rectangle from 'startCorner'
			ctx.moveTo.apply(ctx, cornerAt(0));
			for (var i = 1; i < 4; i++) {
				ctx.lineTo.apply(ctx, cornerAt(i));
			}

			ctx.fill();
			if (vm.borderWidth) {
				ctx.stroke();
			}
		},
		height: function() {
			var vm = this._view;
			return vm.base - vm.y;
		},
		inRange: function(mouseX, mouseY) {
			var vm = this._view;
			return vm ?
					(vm.y < vm.base ?
						(mouseX >= vm.x - vm.width / 2 && mouseX <= vm.x + vm.width / 2) && (mouseY >= vm.y && mouseY <= vm.base) :
						(mouseX >= vm.x - vm.width / 2 && mouseX <= vm.x + vm.width / 2) && (mouseY >= vm.base && mouseY <= vm.y)) :
					false;
		},
		inLabelRange: function(mouseX) {
			var vm = this._view;
			return vm ? (mouseX >= vm.x - vm.width / 2 && mouseX <= vm.x + vm.width / 2) : false;
		},
		tooltipPosition: function() {
			var vm = this._view;
			return {
				x: vm.x,
				y: vm.y
			};
		}
	});

};

},{}],39:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	// Default config for a category scale
	var defaultConfig = {
		position: 'bottom'
	};

	var DatasetScale = Chart.Scale.extend({
		/**
		* Internal function to get the correct labels. If data.xLabels or data.yLabels are defined, use tose
		* else fall back to data.labels
		* @private
		*/
		getLabels: function() {
			var data = this.chart.data;
			return (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels;
		},
		// Implement this so that
		determineDataLimits: function() {
			var me = this;
			var labels = me.getLabels();
			me.minIndex = 0;
			me.maxIndex = labels.length - 1;
			var findIndex;

			if (me.options.ticks.min !== undefined) {
				// user specified min value
				findIndex = helpers.indexOf(labels, me.options.ticks.min);
				me.minIndex = findIndex !== -1 ? findIndex : me.minIndex;
			}

			if (me.options.ticks.max !== undefined) {
				// user specified max value
				findIndex = helpers.indexOf(labels, me.options.ticks.max);
				me.maxIndex = findIndex !== -1 ? findIndex : me.maxIndex;
			}

			me.min = labels[me.minIndex];
			me.max = labels[me.maxIndex];
		},

		buildTicks: function() {
			var me = this;
			var labels = me.getLabels();
			// If we are viewing some subset of labels, slice the original array
			me.ticks = (me.minIndex === 0 && me.maxIndex === labels.length - 1) ? labels : labels.slice(me.minIndex, me.maxIndex + 1);
		},

		getLabelForIndex: function(index, datasetIndex) {
			var me = this;
			var data = me.chart.data;
			var isHorizontal = me.isHorizontal();

			if ((data.xLabels && isHorizontal) || (data.yLabels && !isHorizontal)) {
				return me.getRightValue(data.datasets[datasetIndex].data[index]);
			}
			return me.ticks[index];
		},

		// Used to get data value locations.  Value can either be an index or a numerical value
		getPixelForValue: function(value, index, datasetIndex, includeOffset) {
			var me = this;
			// 1 is added because we need the length but we have the indexes
			var offsetAmt = Math.max((me.maxIndex + 1 - me.minIndex - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);

			if (value !== undefined && isNaN(index)) {
				var labels = me.getLabels();
				var idx = labels.indexOf(value);
				index = idx !== -1 ? idx : index;
			}

			if (me.isHorizontal()) {
				var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
				var valueWidth = innerWidth / offsetAmt;
				var widthOffset = (valueWidth * (index - me.minIndex)) + me.paddingLeft;

				if (me.options.gridLines.offsetGridLines && includeOffset || me.maxIndex === me.minIndex && includeOffset) {
					widthOffset += (valueWidth / 2);
				}

				return me.left + Math.round(widthOffset);
			}
			var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
			var valueHeight = innerHeight / offsetAmt;
			var heightOffset = (valueHeight * (index - me.minIndex)) + me.paddingTop;

			if (me.options.gridLines.offsetGridLines && includeOffset) {
				heightOffset += (valueHeight / 2);
			}

			return me.top + Math.round(heightOffset);
		},
		getPixelForTick: function(index, includeOffset) {
			return this.getPixelForValue(this.ticks[index], index + this.minIndex, null, includeOffset);
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var value;
			var offsetAmt = Math.max((me.ticks.length - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);
			var horz = me.isHorizontal();
			var innerDimension = horz ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.paddingBottom);
			var valueDimension = innerDimension / offsetAmt;

			pixel -= horz ? me.left : me.top;

			if (me.options.gridLines.offsetGridLines) {
				pixel -= (valueDimension / 2);
			}
			pixel -= horz ? me.paddingLeft : me.paddingTop;

			if (pixel <= 0) {
				value = 0;
			} else {
				value = Math.round(pixel / valueDimension);
			}

			return value;
		},
		getBasePixel: function() {
			return this.bottom;
		}
	});

	Chart.scaleService.registerScaleType('category', DatasetScale, defaultConfig);

};

},{}],40:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	var defaultConfig = {
		position: 'left',
		ticks: {
			callback: function(tickValue, index, ticks) {
				// If we have lots of ticks, don't use the ones
				var delta = ticks.length > 3 ? ticks[2] - ticks[1] : ticks[1] - ticks[0];

				// If we have a number like 2.5 as the delta, figure out how many decimal places we need
				if (Math.abs(delta) > 1) {
					if (tickValue !== Math.floor(tickValue)) {
						// not an integer
						delta = tickValue - Math.floor(tickValue);
					}
				}

				var logDelta = helpers.log10(Math.abs(delta));
				var tickString = '';

				if (tickValue !== 0) {
					var numDecimal = -1 * Math.floor(logDelta);
					numDecimal = Math.max(Math.min(numDecimal, 20), 0); // toFixed has a max of 20 decimal places
					tickString = tickValue.toFixed(numDecimal);
				} else {
					tickString = '0'; // never show decimal places for 0
				}

				return tickString;
			}
		}
	};

	var LinearScale = Chart.LinearScaleBase.extend({
		determineDataLimits: function() {
			var me = this;
			var opts = me.options;
			var chart = me.chart;
			var data = chart.data;
			var datasets = data.datasets;
			var isHorizontal = me.isHorizontal();

			function IDMatches(meta) {
				return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
			}

			// First Calculate the range
			me.min = null;
			me.max = null;

			if (opts.stacked) {
				var valuesPerType = {};

				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					if (valuesPerType[meta.type] === undefined) {
						valuesPerType[meta.type] = {
							positiveValues: [],
							negativeValues: []
						};
					}

					// Store these per type
					var positiveValues = valuesPerType[meta.type].positiveValues;
					var negativeValues = valuesPerType[meta.type].negativeValues;

					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						helpers.each(dataset.data, function(rawValue, index) {
							var value = +me.getRightValue(rawValue);
							if (isNaN(value) || meta.data[index].hidden) {
								return;
							}

							positiveValues[index] = positiveValues[index] || 0;
							negativeValues[index] = negativeValues[index] || 0;

							if (opts.relativePoints) {
								positiveValues[index] = 100;
							} else if (value < 0) {
								negativeValues[index] += value;
							} else {
								positiveValues[index] += value;
							}
						});
					}
				});

				helpers.each(valuesPerType, function(valuesForType) {
					var values = valuesForType.positiveValues.concat(valuesForType.negativeValues);
					var minVal = helpers.min(values);
					var maxVal = helpers.max(values);
					me.min = me.min === null ? minVal : Math.min(me.min, minVal);
					me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
				});

			} else {
				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						helpers.each(dataset.data, function(rawValue, index) {
							var value = +me.getRightValue(rawValue);
							if (isNaN(value) || meta.data[index].hidden) {
								return;
							}

							if (me.min === null) {
								me.min = value;
							} else if (value < me.min) {
								me.min = value;
							}

							if (me.max === null) {
								me.max = value;
							} else if (value > me.max) {
								me.max = value;
							}
						});
					}
				});
			}

			// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
			this.handleTickRangeOptions();
		},
		getTickLimit: function() {
			var maxTicks;
			var me = this;
			var tickOpts = me.options.ticks;

			if (me.isHorizontal()) {
				maxTicks = Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(me.width / 50));
			} else {
				// The factor of 2 used to scale the font size has been experimentally determined.
				var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, Chart.defaults.global.defaultFontSize);
				maxTicks = Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(me.height / (2 * tickFontSize)));
			}

			return maxTicks;
		},
		// Called after the ticks are built. We need
		handleDirectionalChanges: function() {
			if (!this.isHorizontal()) {
				// We are in a vertical orientation. The top value is the highest. So reverse the array
				this.ticks.reverse();
			}
		},
		getLabelForIndex: function(index, datasetIndex) {
			return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
		},
		// Utils
		getPixelForValue: function(value) {
			// This must be called after fit has been run so that
			// this.left, this.top, this.right, and this.bottom have been defined
			var me = this;
			var paddingLeft = me.paddingLeft;
			var paddingBottom = me.paddingBottom;
			var start = me.start;

			var rightValue = +me.getRightValue(value);
			var pixel;
			var innerDimension;
			var range = me.end - start;

			if (me.isHorizontal()) {
				innerDimension = me.width - (paddingLeft + me.paddingRight);
				pixel = me.left + (innerDimension / range * (rightValue - start));
				return Math.round(pixel + paddingLeft);
			}
			innerDimension = me.height - (me.paddingTop + paddingBottom);
			pixel = (me.bottom - paddingBottom) - (innerDimension / range * (rightValue - start));
			return Math.round(pixel);
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var isHorizontal = me.isHorizontal();
			var paddingLeft = me.paddingLeft;
			var paddingBottom = me.paddingBottom;
			var innerDimension = isHorizontal ? me.width - (paddingLeft + me.paddingRight) : me.height - (me.paddingTop + paddingBottom);
			var offset = (isHorizontal ? pixel - me.left - paddingLeft : me.bottom - paddingBottom - pixel) / innerDimension;
			return me.start + ((me.end - me.start) * offset);
		},
		getPixelForTick: function(index) {
			return this.getPixelForValue(this.ticksAsNumbers[index]);
		}
	});
	Chart.scaleService.registerScaleType('linear', LinearScale, defaultConfig);

};

},{}],41:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers,
		noop = helpers.noop;

	Chart.LinearScaleBase = Chart.Scale.extend({
		handleTickRangeOptions: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;

			// If we are forcing it to begin at 0, but 0 will already be rendered on the chart,
			// do nothing since that would make the chart weird. If the user really wants a weird chart
			// axis, they can manually override it
			if (tickOpts.beginAtZero) {
				var minSign = helpers.sign(me.min);
				var maxSign = helpers.sign(me.max);

				if (minSign < 0 && maxSign < 0) {
					// move the top up to 0
					me.max = 0;
				} else if (minSign > 0 && maxSign > 0) {
					// move the botttom down to 0
					me.min = 0;
				}
			}

			if (tickOpts.min !== undefined) {
				me.min = tickOpts.min;
			} else if (tickOpts.suggestedMin !== undefined) {
				me.min = Math.min(me.min, tickOpts.suggestedMin);
			}

			if (tickOpts.max !== undefined) {
				me.max = tickOpts.max;
			} else if (tickOpts.suggestedMax !== undefined) {
				me.max = Math.max(me.max, tickOpts.suggestedMax);
			}

			if (me.min === me.max) {
				me.max++;

				if (!tickOpts.beginAtZero) {
					me.min--;
				}
			}
		},
		getTickLimit: noop,
		handleDirectionalChanges: noop,

		buildTicks: function() {
			var me = this;
			var opts = me.options;
			var ticks = me.ticks = [];
			var tickOpts = opts.ticks;
			var getValueOrDefault = helpers.getValueOrDefault;

			// Figure out what the max number of ticks we can support it is based on the size of
			// the axis area. For now, we say that the minimum tick spacing in pixels must be 50
			// We also limit the maximum number of ticks to 11 which gives a nice 10 squares on
			// the graph

			var maxTicks = me.getTickLimit();

			// Make sure we always have at least 2 ticks
			maxTicks = Math.max(2, maxTicks);

			// To get a "nice" value for the tick spacing, we will use the appropriately named
			// "nice number" algorithm. See http://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks
			// for details.

			var spacing;
			var fixedStepSizeSet = (tickOpts.fixedStepSize && tickOpts.fixedStepSize > 0) || (tickOpts.stepSize && tickOpts.stepSize > 0);
			if (fixedStepSizeSet) {
				spacing = getValueOrDefault(tickOpts.fixedStepSize, tickOpts.stepSize);
			} else {
				var niceRange = helpers.niceNum(me.max - me.min, false);
				spacing = helpers.niceNum(niceRange / (maxTicks - 1), true);
			}
			var niceMin = Math.floor(me.min / spacing) * spacing;
			var niceMax = Math.ceil(me.max / spacing) * spacing;
			var numSpaces = (niceMax - niceMin) / spacing;

			// If very close to our rounded value, use it.
			if (helpers.almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
				numSpaces = Math.round(numSpaces);
			} else {
				numSpaces = Math.ceil(numSpaces);
			}

			// Put the values into the ticks array
			ticks.push(tickOpts.min !== undefined ? tickOpts.min : niceMin);
			for (var j = 1; j < numSpaces; ++j) {
				ticks.push(niceMin + (j * spacing));
			}
			ticks.push(tickOpts.max !== undefined ? tickOpts.max : niceMax);

			me.handleDirectionalChanges();

			// At this point, we need to update our max and min given the tick values since we have expanded the
			// range of the scale
			me.max = helpers.max(ticks);
			me.min = helpers.min(ticks);

			if (tickOpts.reverse) {
				ticks.reverse();

				me.start = me.max;
				me.end = me.min;
			} else {
				me.start = me.min;
				me.end = me.max;
			}
		},
		convertTicksToLabels: function() {
			var me = this;
			me.ticksAsNumbers = me.ticks.slice();
			me.zeroLineIndex = me.ticks.indexOf(0);

			Chart.Scale.prototype.convertTicksToLabels.call(me);
		}
	});
};

},{}],42:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	var defaultConfig = {
		position: 'left',

		// label settings
		ticks: {
			callback: function(value, index, arr) {
				var remain = value / (Math.pow(10, Math.floor(helpers.log10(value))));

				if (value === 0) {
					return '0';
				} else if (remain === 1 || remain === 2 || remain === 5 || index === 0 || index === arr.length - 1) {
					return value.toExponential();
				}
				return '';
			}
		}
	};

	var LogarithmicScale = Chart.Scale.extend({
		determineDataLimits: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;
			var chart = me.chart;
			var data = chart.data;
			var datasets = data.datasets;
			var getValueOrDefault = helpers.getValueOrDefault;
			var isHorizontal = me.isHorizontal();
			function IDMatches(meta) {
				return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
			}

			// Calculate Range
			me.min = null;
			me.max = null;
			me.minNotZero = null;

			if (opts.stacked) {
				var valuesPerType = {};

				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						if (valuesPerType[meta.type] === undefined) {
							valuesPerType[meta.type] = [];
						}

						helpers.each(dataset.data, function(rawValue, index) {
							var values = valuesPerType[meta.type];
							var value = +me.getRightValue(rawValue);
							if (isNaN(value) || meta.data[index].hidden) {
								return;
							}

							values[index] = values[index] || 0;

							if (opts.relativePoints) {
								values[index] = 100;
							} else {
								// Don't need to split positive and negative since the log scale can't handle a 0 crossing
								values[index] += value;
							}
						});
					}
				});

				helpers.each(valuesPerType, function(valuesForType) {
					var minVal = helpers.min(valuesForType);
					var maxVal = helpers.max(valuesForType);
					me.min = me.min === null ? minVal : Math.min(me.min, minVal);
					me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
				});

			} else {
				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						helpers.each(dataset.data, function(rawValue, index) {
							var value = +me.getRightValue(rawValue);
							if (isNaN(value) || meta.data[index].hidden) {
								return;
							}

							if (me.min === null) {
								me.min = value;
							} else if (value < me.min) {
								me.min = value;
							}

							if (me.max === null) {
								me.max = value;
							} else if (value > me.max) {
								me.max = value;
							}

							if (value !== 0 && (me.minNotZero === null || value < me.minNotZero)) {
								me.minNotZero = value;
							}
						});
					}
				});
			}

			me.min = getValueOrDefault(tickOpts.min, me.min);
			me.max = getValueOrDefault(tickOpts.max, me.max);

			if (me.min === me.max) {
				if (me.min !== 0 && me.min !== null) {
					me.min = Math.pow(10, Math.floor(helpers.log10(me.min)) - 1);
					me.max = Math.pow(10, Math.floor(helpers.log10(me.max)) + 1);
				} else {
					me.min = 1;
					me.max = 10;
				}
			}
		},
		buildTicks: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;
			var getValueOrDefault = helpers.getValueOrDefault;

			// Reset the ticks array. Later on, we will draw a grid line at these positions
			// The array simply contains the numerical value of the spots where ticks will be
			var ticks = me.ticks = [];

			// Figure out what the max number of ticks we can support it is based on the size of
			// the axis area. For now, we say that the minimum tick spacing in pixels must be 50
			// We also limit the maximum number of ticks to 11 which gives a nice 10 squares on
			// the graph

			var tickVal = getValueOrDefault(tickOpts.min, Math.pow(10, Math.floor(helpers.log10(me.min))));

			while (tickVal < me.max) {
				ticks.push(tickVal);

				var exp;
				var significand;

				if (tickVal === 0) {
					exp = Math.floor(helpers.log10(me.minNotZero));
					significand = Math.round(me.minNotZero / Math.pow(10, exp));
				} else {
					exp = Math.floor(helpers.log10(tickVal));
					significand = Math.floor(tickVal / Math.pow(10, exp)) + 1;
				}

				if (significand === 10) {
					significand = 1;
					++exp;
				}

				tickVal = significand * Math.pow(10, exp);
			}

			var lastTick = getValueOrDefault(tickOpts.max, tickVal);
			ticks.push(lastTick);

			if (!me.isHorizontal()) {
				// We are in a vertical orientation. The top value is the highest. So reverse the array
				ticks.reverse();
			}

			// At this point, we need to update our max and min given the tick values since we have expanded the
			// range of the scale
			me.max = helpers.max(ticks);
			me.min = helpers.min(ticks);

			if (tickOpts.reverse) {
				ticks.reverse();

				me.start = me.max;
				me.end = me.min;
			} else {
				me.start = me.min;
				me.end = me.max;
			}
		},
		convertTicksToLabels: function() {
			this.tickValues = this.ticks.slice();

			Chart.Scale.prototype.convertTicksToLabels.call(this);
		},
		// Get the correct tooltip label
		getLabelForIndex: function(index, datasetIndex) {
			return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
		},
		getPixelForTick: function(index) {
			return this.getPixelForValue(this.tickValues[index]);
		},
		getPixelForValue: function(value) {
			var me = this;
			var innerDimension;
			var pixel;

			var start = me.start;
			var newVal = +me.getRightValue(value);
			var range;
			var paddingTop = me.paddingTop;
			var paddingBottom = me.paddingBottom;
			var paddingLeft = me.paddingLeft;
			var opts = me.options;
			var tickOpts = opts.ticks;

			if (me.isHorizontal()) {
				range = helpers.log10(me.end) - helpers.log10(start); // todo: if start === 0
				if (newVal === 0) {
					pixel = me.left + paddingLeft;
				} else {
					innerDimension = me.width - (paddingLeft + me.paddingRight);
					pixel = me.left + (innerDimension / range * (helpers.log10(newVal) - helpers.log10(start)));
					pixel += paddingLeft;
				}
			} else {
				// Bottom - top since pixels increase downard on a screen
				innerDimension = me.height - (paddingTop + paddingBottom);
				if (start === 0 && !tickOpts.reverse) {
					range = helpers.log10(me.end) - helpers.log10(me.minNotZero);
					if (newVal === start) {
						pixel = me.bottom - paddingBottom;
					} else if (newVal === me.minNotZero) {
						pixel = me.bottom - paddingBottom - innerDimension * 0.02;
					} else {
						pixel = me.bottom - paddingBottom - innerDimension * 0.02 - (innerDimension * 0.98/ range * (helpers.log10(newVal)-helpers.log10(me.minNotZero)));
					}
				} else if (me.end === 0 && tickOpts.reverse) {
					range = helpers.log10(me.start) - helpers.log10(me.minNotZero);
					if (newVal === me.end) {
						pixel = me.top + paddingTop;
					} else if (newVal === me.minNotZero) {
						pixel = me.top + paddingTop + innerDimension * 0.02;
					} else {
						pixel = me.top + paddingTop + innerDimension * 0.02 + (innerDimension * 0.98/ range * (helpers.log10(newVal)-helpers.log10(me.minNotZero)));
					}
				} else {
					range = helpers.log10(me.end) - helpers.log10(start);
					innerDimension = me.height - (paddingTop + paddingBottom);
					pixel = (me.bottom - paddingBottom) - (innerDimension / range * (helpers.log10(newVal) - helpers.log10(start)));
				}
			}
			return pixel;
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var range = helpers.log10(me.end) - helpers.log10(me.start);
			var value, innerDimension;

			if (me.isHorizontal()) {
				innerDimension = me.width - (me.paddingLeft + me.paddingRight);
				value = me.start * Math.pow(10, (pixel - me.left - me.paddingLeft) * range / innerDimension);
			} else {  // todo: if start === 0
				innerDimension = me.height - (me.paddingTop + me.paddingBottom);
				value = Math.pow(10, (me.bottom - me.paddingBottom - pixel) * range / innerDimension) / me.start;
			}
			return value;
		}
	});
	Chart.scaleService.registerScaleType('logarithmic', LogarithmicScale, defaultConfig);

};

},{}],43:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalDefaults = Chart.defaults.global;

	var defaultConfig = {
		display: true,

		// Boolean - Whether to animate scaling the chart from the centre
		animate: true,
		lineArc: false,
		position: 'chartArea',

		angleLines: {
			display: true,
			color: 'rgba(0, 0, 0, 0.1)',
			lineWidth: 1
		},

		// label settings
		ticks: {
			// Boolean - Show a backdrop to the scale label
			showLabelBackdrop: true,

			// String - The colour of the label backdrop
			backdropColor: 'rgba(255,255,255,0.75)',

			// Number - The backdrop padding above & below the label in pixels
			backdropPaddingY: 2,

			// Number - The backdrop padding to the side of the label in pixels
			backdropPaddingX: 2
		},

		pointLabels: {
			// Number - Point label font size in pixels
			fontSize: 10,

			// Function - Used to convert point labels
			callback: function(label) {
				return label;
			}
		}
	};

	var LinearRadialScale = Chart.LinearScaleBase.extend({
		getValueCount: function() {
			return this.chart.data.labels.length;
		},
		setDimensions: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;
			// Set the unconstrained dimension before label rotation
			me.width = me.maxWidth;
			me.height = me.maxHeight;
			me.xCenter = Math.round(me.width / 2);
			me.yCenter = Math.round(me.height / 2);

			var minSize = helpers.min([me.height, me.width]);
			var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
			me.drawingArea = opts.display ? (minSize / 2) - (tickFontSize / 2 + tickOpts.backdropPaddingY) : (minSize / 2);
		},
		determineDataLimits: function() {
			var me = this;
			var chart = me.chart;
			me.min = null;
			me.max = null;


			helpers.each(chart.data.datasets, function(dataset, datasetIndex) {
				if (chart.isDatasetVisible(datasetIndex)) {
					var meta = chart.getDatasetMeta(datasetIndex);

					helpers.each(dataset.data, function(rawValue, index) {
						var value = +me.getRightValue(rawValue);
						if (isNaN(value) || meta.data[index].hidden) {
							return;
						}

						if (me.min === null) {
							me.min = value;
						} else if (value < me.min) {
							me.min = value;
						}

						if (me.max === null) {
							me.max = value;
						} else if (value > me.max) {
							me.max = value;
						}
					});
				}
			});

			// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
			me.handleTickRangeOptions();
		},
		getTickLimit: function() {
			var tickOpts = this.options.ticks;
			var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
			return Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(this.drawingArea / (1.5 * tickFontSize)));
		},
		convertTicksToLabels: function() {
			var me = this;
			Chart.LinearScaleBase.prototype.convertTicksToLabels.call(me);

			// Point labels
			me.pointLabels = me.chart.data.labels.map(me.options.pointLabels.callback, me);
		},
		getLabelForIndex: function(index, datasetIndex) {
			return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
		},
		fit: function() {
			/*
			 * Right, this is really confusing and there is a lot of maths going on here
			 * The gist of the problem is here: https://gist.github.com/nnnick/696cc9c55f4b0beb8fe9
			 *
			 * Reaction: https://dl.dropboxusercontent.com/u/34601363/toomuchscience.gif
			 *
			 * Solution:
			 *
			 * We assume the radius of the polygon is half the size of the canvas at first
			 * at each index we check if the text overlaps.
			 *
			 * Where it does, we store that angle and that index.
			 *
			 * After finding the largest index and angle we calculate how much we need to remove
			 * from the shape radius to move the point inwards by that x.
			 *
			 * We average the left and right distances to get the maximum shape radius that can fit in the box
			 * along with labels.
			 *
			 * Once we have that, we can find the centre point for the chart, by taking the x text protrusion
			 * on each side, removing that from the size, halving it and adding the left x protrusion width.
			 *
			 * This will mean we have a shape fitted to the canvas, as large as it can be with the labels
			 * and position it in the most space efficient manner
			 *
			 * https://dl.dropboxusercontent.com/u/34601363/yeahscience.gif
			 */

			var pointLabels = this.options.pointLabels;
			var pointLabelFontSize = helpers.getValueOrDefault(pointLabels.fontSize, globalDefaults.defaultFontSize);
			var pointLabeFontStyle = helpers.getValueOrDefault(pointLabels.fontStyle, globalDefaults.defaultFontStyle);
			var pointLabeFontFamily = helpers.getValueOrDefault(pointLabels.fontFamily, globalDefaults.defaultFontFamily);
			var pointLabeFont = helpers.fontString(pointLabelFontSize, pointLabeFontStyle, pointLabeFontFamily);

			// Get maximum radius of the polygon. Either half the height (minus the text width) or half the width.
			// Use this to calculate the offset + change. - Make sure L/R protrusion is at least 0 to stop issues with centre points
			var largestPossibleRadius = helpers.min([(this.height / 2 - pointLabelFontSize - 5), this.width / 2]),
				pointPosition,
				i,
				textWidth,
				halfTextWidth,
				furthestRight = this.width,
				furthestRightIndex,
				furthestRightAngle,
				furthestLeft = 0,
				furthestLeftIndex,
				furthestLeftAngle,
				xProtrusionLeft,
				xProtrusionRight,
				radiusReductionRight,
				radiusReductionLeft;
			this.ctx.font = pointLabeFont;

			for (i = 0; i < this.getValueCount(); i++) {
				// 5px to space the text slightly out - similar to what we do in the draw function.
				pointPosition = this.getPointPosition(i, largestPossibleRadius);
				textWidth = this.ctx.measureText(this.pointLabels[i] ? this.pointLabels[i] : '').width + 5;

				// Add quarter circle to make degree 0 mean top of circle
				var angleRadians = this.getIndexAngle(i) + (Math.PI / 2);
				var angle = (angleRadians * 360 / (2 * Math.PI)) % 360;

				if (angle === 0 || angle === 180) {
					// At angle 0 and 180, we're at exactly the top/bottom
					// of the radar chart, so text will be aligned centrally, so we'll half it and compare
					// w/left and right text sizes
					halfTextWidth = textWidth / 2;
					if (pointPosition.x + halfTextWidth > furthestRight) {
						furthestRight = pointPosition.x + halfTextWidth;
						furthestRightIndex = i;
					}
					if (pointPosition.x - halfTextWidth < furthestLeft) {
						furthestLeft = pointPosition.x - halfTextWidth;
						furthestLeftIndex = i;
					}
				} else if (angle < 180) {
					// Less than half the values means we'll left align the text
					if (pointPosition.x + textWidth > furthestRight) {
						furthestRight = pointPosition.x + textWidth;
						furthestRightIndex = i;
					}
				// More than half the values means we'll right align the text
				} else if (pointPosition.x - textWidth < furthestLeft) {
					furthestLeft = pointPosition.x - textWidth;
					furthestLeftIndex = i;
				}
			}

			xProtrusionLeft = furthestLeft;
			xProtrusionRight = Math.ceil(furthestRight - this.width);

			furthestRightAngle = this.getIndexAngle(furthestRightIndex);
			furthestLeftAngle = this.getIndexAngle(furthestLeftIndex);

			radiusReductionRight = xProtrusionRight / Math.sin(furthestRightAngle + Math.PI / 2);
			radiusReductionLeft = xProtrusionLeft / Math.sin(furthestLeftAngle + Math.PI / 2);

			// Ensure we actually need to reduce the size of the chart
			radiusReductionRight = (helpers.isNumber(radiusReductionRight)) ? radiusReductionRight : 0;
			radiusReductionLeft = (helpers.isNumber(radiusReductionLeft)) ? radiusReductionLeft : 0;

			this.drawingArea = Math.round(largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2);
			this.setCenterPoint(radiusReductionLeft, radiusReductionRight);
		},
		setCenterPoint: function(leftMovement, rightMovement) {
			var me = this;
			var maxRight = me.width - rightMovement - me.drawingArea,
				maxLeft = leftMovement + me.drawingArea;

			me.xCenter = Math.round(((maxLeft + maxRight) / 2) + me.left);
			// Always vertically in the centre as the text height doesn't change
			me.yCenter = Math.round((me.height / 2) + me.top);
		},

		getIndexAngle: function(index) {
			var angleMultiplier = (Math.PI * 2) / this.getValueCount();
			var startAngle = this.chart.options && this.chart.options.startAngle ?
				this.chart.options.startAngle :
				0;

			var startAngleRadians = startAngle * Math.PI * 2 / 360;

			// Start from the top instead of right, so remove a quarter of the circle
			return index * angleMultiplier - (Math.PI / 2) + startAngleRadians;
		},
		getDistanceFromCenterForValue: function(value) {
			var me = this;

			if (value === null) {
				return 0; // null always in center
			}

			// Take into account half font size + the yPadding of the top value
			var scalingFactor = me.drawingArea / (me.max - me.min);
			if (me.options.reverse) {
				return (me.max - value) * scalingFactor;
			}
			return (value - me.min) * scalingFactor;
		},
		getPointPosition: function(index, distanceFromCenter) {
			var me = this;
			var thisAngle = me.getIndexAngle(index);
			return {
				x: Math.round(Math.cos(thisAngle) * distanceFromCenter) + me.xCenter,
				y: Math.round(Math.sin(thisAngle) * distanceFromCenter) + me.yCenter
			};
		},
		getPointPositionForValue: function(index, value) {
			return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
		},

		getBasePosition: function() {
			var me = this;
			var min = me.min;
			var max = me.max;

			return me.getPointPositionForValue(0,
				me.beginAtZero? 0:
				min < 0 && max < 0? max :
				min > 0 && max > 0? min :
				0);
		},

		draw: function() {
			var me = this;
			var opts = me.options;
			var gridLineOpts = opts.gridLines;
			var tickOpts = opts.ticks;
			var angleLineOpts = opts.angleLines;
			var pointLabelOpts = opts.pointLabels;
			var getValueOrDefault = helpers.getValueOrDefault;

			if (opts.display) {
				var ctx = me.ctx;

				// Tick Font
				var tickFontSize = getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
				var tickFontStyle = getValueOrDefault(tickOpts.fontStyle, globalDefaults.defaultFontStyle);
				var tickFontFamily = getValueOrDefault(tickOpts.fontFamily, globalDefaults.defaultFontFamily);
				var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);

				helpers.each(me.ticks, function(label, index) {
					// Don't draw a centre value (if it is minimum)
					if (index > 0 || opts.reverse) {
						var yCenterOffset = me.getDistanceFromCenterForValue(me.ticksAsNumbers[index]);
						var yHeight = me.yCenter - yCenterOffset;

						// Draw circular lines around the scale
						if (gridLineOpts.display && index !== 0) {
							ctx.strokeStyle = helpers.getValueAtIndexOrDefault(gridLineOpts.color, index - 1);
							ctx.lineWidth = helpers.getValueAtIndexOrDefault(gridLineOpts.lineWidth, index - 1);

							if (opts.lineArc) {
								// Draw circular arcs between the points
								ctx.beginPath();
								ctx.arc(me.xCenter, me.yCenter, yCenterOffset, 0, Math.PI * 2);
								ctx.closePath();
								ctx.stroke();
							} else {
								// Draw straight lines connecting each index
								ctx.beginPath();
								for (var i = 0; i < me.getValueCount(); i++) {
									var pointPosition = me.getPointPosition(i, yCenterOffset);
									if (i === 0) {
										ctx.moveTo(pointPosition.x, pointPosition.y);
									} else {
										ctx.lineTo(pointPosition.x, pointPosition.y);
									}
								}
								ctx.closePath();
								ctx.stroke();
							}
						}

						if (tickOpts.display) {
							var tickFontColor = getValueOrDefault(tickOpts.fontColor, globalDefaults.defaultFontColor);
							ctx.font = tickLabelFont;

							if (tickOpts.showLabelBackdrop) {
								var labelWidth = ctx.measureText(label).width;
								ctx.fillStyle = tickOpts.backdropColor;
								ctx.fillRect(
									me.xCenter - labelWidth / 2 - tickOpts.backdropPaddingX,
									yHeight - tickFontSize / 2 - tickOpts.backdropPaddingY,
									labelWidth + tickOpts.backdropPaddingX * 2,
									tickFontSize + tickOpts.backdropPaddingY * 2
								);
							}

							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							ctx.fillStyle = tickFontColor;
							ctx.fillText(label, me.xCenter, yHeight);
						}
					}
				});

				if (!opts.lineArc) {
					ctx.lineWidth = angleLineOpts.lineWidth;
					ctx.strokeStyle = angleLineOpts.color;

					var outerDistance = me.getDistanceFromCenterForValue(opts.reverse ? me.min : me.max);

					// Point Label Font
					var pointLabelFontSize = getValueOrDefault(pointLabelOpts.fontSize, globalDefaults.defaultFontSize);
					var pointLabeFontStyle = getValueOrDefault(pointLabelOpts.fontStyle, globalDefaults.defaultFontStyle);
					var pointLabeFontFamily = getValueOrDefault(pointLabelOpts.fontFamily, globalDefaults.defaultFontFamily);
					var pointLabeFont = helpers.fontString(pointLabelFontSize, pointLabeFontStyle, pointLabeFontFamily);

					for (var i = me.getValueCount() - 1; i >= 0; i--) {
						if (angleLineOpts.display) {
							var outerPosition = me.getPointPosition(i, outerDistance);
							ctx.beginPath();
							ctx.moveTo(me.xCenter, me.yCenter);
							ctx.lineTo(outerPosition.x, outerPosition.y);
							ctx.stroke();
							ctx.closePath();
						}
						// Extra 3px out for some label spacing
						var pointLabelPosition = me.getPointPosition(i, outerDistance + 5);

						// Keep this in loop since we may support array properties here
						var pointLabelFontColor = getValueOrDefault(pointLabelOpts.fontColor, globalDefaults.defaultFontColor);
						ctx.font = pointLabeFont;
						ctx.fillStyle = pointLabelFontColor;

						var pointLabels = me.pointLabels;

						// Add quarter circle to make degree 0 mean top of circle
						var angleRadians = this.getIndexAngle(i) + (Math.PI / 2);
						var angle = (angleRadians * 360 / (2 * Math.PI)) % 360;

						if (angle === 0 || angle === 180) {
							ctx.textAlign = 'center';
						} else if (angle < 180) {
							ctx.textAlign = 'left';
						} else {
							ctx.textAlign = 'right';
						}

						// Set the correct text baseline based on outer positioning
						if (angle === 90 || angle === 270) {
							ctx.textBaseline = 'middle';
						} else if (angle > 270 || angle < 90) {
							ctx.textBaseline = 'bottom';
						} else {
							ctx.textBaseline = 'top';
						}

						ctx.fillText(pointLabels[i] ? pointLabels[i] : '', pointLabelPosition.x, pointLabelPosition.y);
					}
				}
			}
		}
	});
	Chart.scaleService.registerScaleType('radialLinear', LinearRadialScale, defaultConfig);

};

},{}],44:[function(require,module,exports){
/* global window: false */
'use strict';

var moment = require(1);
moment = typeof(moment) === 'function' ? moment : window.moment;

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var time = {
		units: [{
			name: 'millisecond',
			steps: [1, 2, 5, 10, 20, 50, 100, 250, 500]
		}, {
			name: 'second',
			steps: [1, 2, 5, 10, 30]
		}, {
			name: 'minute',
			steps: [1, 2, 5, 10, 30]
		}, {
			name: 'hour',
			steps: [1, 2, 3, 6, 12]
		}, {
			name: 'day',
			steps: [1, 2, 5]
		}, {
			name: 'week',
			maxStep: 4
		}, {
			name: 'month',
			maxStep: 3
		}, {
			name: 'quarter',
			maxStep: 4
		}, {
			name: 'year',
			maxStep: false
		}]
	};

	var defaultConfig = {
		position: 'bottom',

		time: {
			parser: false, // false == a pattern string from http://momentjs.com/docs/#/parsing/string-format/ or a custom callback that converts its argument to a moment
			format: false, // DEPRECATED false == date objects, moment object, callback or a pattern string from http://momentjs.com/docs/#/parsing/string-format/
			unit: false, // false == automatic or override with week, month, year, etc.
			round: false, // none, or override with week, month, year, etc.
			displayFormat: false, // DEPRECATED
			isoWeekday: false, // override week start day - see http://momentjs.com/docs/#/get-set/iso-weekday/
			minUnit: 'millisecond',

			// defaults to unit's corresponding unitFormat below or override using pattern string from http://momentjs.com/docs/#/displaying/format/
			displayFormats: {
				millisecond: 'h:mm:ss.SSS a', // 11:20:01.123 AM,
				second: 'h:mm:ss a', // 11:20:01 AM
				minute: 'h:mm:ss a', // 11:20:01 AM
				hour: 'MMM D, hA', // Sept 4, 5PM
				day: 'll', // Sep 4 2015
				week: 'll', // Week 46, or maybe "[W]WW - YYYY" ?
				month: 'MMM YYYY', // Sept 2015
				quarter: '[Q]Q - YYYY', // Q3
				year: 'YYYY' // 2015
			}
		},
		ticks: {
			autoSkip: false
		}
	};

	var TimeScale = Chart.Scale.extend({
		initialize: function() {
			if (!moment) {
				throw new Error('Chart.js - Moment.js could not be found! You must include it before Chart.js to use the time scale. Download at https://momentjs.com');
			}

			Chart.Scale.prototype.initialize.call(this);
		},
		getLabelMoment: function(datasetIndex, index) {
			if (datasetIndex === null || index === null) {
				return null;
			}

			if (typeof this.labelMoments[datasetIndex] !== 'undefined') {
				return this.labelMoments[datasetIndex][index];
			}

			return null;
		},
		getLabelDiff: function(datasetIndex, index) {
			var me = this;
			if (datasetIndex === null || index === null) {
				return null;
			}

			if (me.labelDiffs === undefined) {
				me.buildLabelDiffs();
			}

			if (typeof me.labelDiffs[datasetIndex] !== 'undefined') {
				return me.labelDiffs[datasetIndex][index];
			}

			return null;
		},
		getMomentStartOf: function(tick) {
			var me = this;
			if (me.options.time.unit === 'week' && me.options.time.isoWeekday !== false) {
				return tick.clone().startOf('isoWeek').isoWeekday(me.options.time.isoWeekday);
			}
			return tick.clone().startOf(me.tickUnit);
		},
		determineDataLimits: function() {
			var me = this;
			me.labelMoments = [];

			// Only parse these once. If the dataset does not have data as x,y pairs, we will use
			// these
			var scaleLabelMoments = [];
			if (me.chart.data.labels && me.chart.data.labels.length > 0) {
				helpers.each(me.chart.data.labels, function(label) {
					var labelMoment = me.parseTime(label);

					if (labelMoment.isValid()) {
						if (me.options.time.round) {
							labelMoment.startOf(me.options.time.round);
						}
						scaleLabelMoments.push(labelMoment);
					}
				}, me);

				me.firstTick = moment.min.call(me, scaleLabelMoments);
				me.lastTick = moment.max.call(me, scaleLabelMoments);
			} else {
				me.firstTick = null;
				me.lastTick = null;
			}

			helpers.each(me.chart.data.datasets, function(dataset, datasetIndex) {
				var momentsForDataset = [];
				var datasetVisible = me.chart.isDatasetVisible(datasetIndex);

				if (typeof dataset.data[0] === 'object' && dataset.data[0] !== null) {
					helpers.each(dataset.data, function(value) {
						var labelMoment = me.parseTime(me.getRightValue(value));

						if (labelMoment.isValid()) {
							if (me.options.time.round) {
								labelMoment.startOf(me.options.time.round);
							}
							momentsForDataset.push(labelMoment);

							if (datasetVisible) {
								// May have gone outside the scale ranges, make sure we keep the first and last ticks updated
								me.firstTick = me.firstTick !== null ? moment.min(me.firstTick, labelMoment) : labelMoment;
								me.lastTick = me.lastTick !== null ? moment.max(me.lastTick, labelMoment) : labelMoment;
							}
						}
					}, me);
				} else {
					// We have no labels. Use the ones from the scale
					momentsForDataset = scaleLabelMoments;
				}

				me.labelMoments.push(momentsForDataset);
			}, me);

			// Set these after we've done all the data
			if (me.options.time.min) {
				me.firstTick = me.parseTime(me.options.time.min);
			}

			if (me.options.time.max) {
				me.lastTick = me.parseTime(me.options.time.max);
			}

			// We will modify these, so clone for later
			me.firstTick = (me.firstTick || moment()).clone();
			me.lastTick = (me.lastTick || moment()).clone();
		},
		buildLabelDiffs: function() {
			var me = this;
			me.labelDiffs = [];
			var scaleLabelDiffs = [];
			// Parse common labels once
			if (me.chart.data.labels && me.chart.data.labels.length > 0) {
				helpers.each(me.chart.data.labels, function(label) {
					var labelMoment = me.parseTime(label);

					if (labelMoment.isValid()) {
						if (me.options.time.round) {
							labelMoment.startOf(me.options.time.round);
						}
						scaleLabelDiffs.push(labelMoment.diff(me.firstTick, me.tickUnit, true));
					}
				}, me);
			}

			helpers.each(me.chart.data.datasets, function(dataset) {
				var diffsForDataset = [];

				if (typeof dataset.data[0] === 'object' && dataset.data[0] !== null) {
					helpers.each(dataset.data, function(value) {
						var labelMoment = me.parseTime(me.getRightValue(value));

						if (labelMoment.isValid()) {
							if (me.options.time.round) {
								labelMoment.startOf(me.options.time.round);
							}
							diffsForDataset.push(labelMoment.diff(me.firstTick, me.tickUnit, true));
						}
					}, me);
				} else {
					// We have no labels. Use common ones
					diffsForDataset = scaleLabelDiffs;
				}

				me.labelDiffs.push(diffsForDataset);
			}, me);
		},
		buildTicks: function() {
			var me = this;

			me.ctx.save();
			var tickFontSize = helpers.getValueOrDefault(me.options.ticks.fontSize, Chart.defaults.global.defaultFontSize);
			var tickFontStyle = helpers.getValueOrDefault(me.options.ticks.fontStyle, Chart.defaults.global.defaultFontStyle);
			var tickFontFamily = helpers.getValueOrDefault(me.options.ticks.fontFamily, Chart.defaults.global.defaultFontFamily);
			var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
			me.ctx.font = tickLabelFont;

			me.ticks = [];
			me.unitScale = 1; // How much we scale the unit by, ie 2 means 2x unit per step
			me.scaleSizeInUnits = 0; // How large the scale is in the base unit (seconds, minutes, etc)

			// Set unit override if applicable
			if (me.options.time.unit) {
				me.tickUnit = me.options.time.unit || 'day';
				me.displayFormat = me.options.time.displayFormats[me.tickUnit];
				me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
				me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, 1);
			} else {
				// Determine the smallest needed unit of the time
				var innerWidth = me.isHorizontal() ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.paddingBottom);

				// Crude approximation of what the label length might be
				var tempFirstLabel = me.tickFormatFunction(me.firstTick, 0, []);
				var tickLabelWidth = me.ctx.measureText(tempFirstLabel).width;
				var cosRotation = Math.cos(helpers.toRadians(me.options.ticks.maxRotation));
				var sinRotation = Math.sin(helpers.toRadians(me.options.ticks.maxRotation));
				tickLabelWidth = (tickLabelWidth * cosRotation) + (tickFontSize * sinRotation);
				var labelCapacity = innerWidth / (tickLabelWidth);

				// Start as small as possible
				me.tickUnit = me.options.time.minUnit;
				me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
				me.displayFormat = me.options.time.displayFormats[me.tickUnit];

				var unitDefinitionIndex = 0;
				var unitDefinition = time.units[unitDefinitionIndex];

				// While we aren't ideal and we don't have units left
				while (unitDefinitionIndex < time.units.length) {
					// Can we scale this unit. If `false` we can scale infinitely
					me.unitScale = 1;

					if (helpers.isArray(unitDefinition.steps) && Math.ceil(me.scaleSizeInUnits / labelCapacity) < helpers.max(unitDefinition.steps)) {
						// Use one of the prefedined steps
						for (var idx = 0; idx < unitDefinition.steps.length; ++idx) {
							if (unitDefinition.steps[idx] >= Math.ceil(me.scaleSizeInUnits / labelCapacity)) {
								me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, unitDefinition.steps[idx]);
								break;
							}
						}

						break;
					} else if ((unitDefinition.maxStep === false) || (Math.ceil(me.scaleSizeInUnits / labelCapacity) < unitDefinition.maxStep)) {
						// We have a max step. Scale this unit
						me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, Math.ceil(me.scaleSizeInUnits / labelCapacity));
						break;
					} else {
						// Move to the next unit up
						++unitDefinitionIndex;
						unitDefinition = time.units[unitDefinitionIndex];

						me.tickUnit = unitDefinition.name;
						var leadingUnitBuffer = me.firstTick.diff(me.getMomentStartOf(me.firstTick), me.tickUnit, true);
						var trailingUnitBuffer = me.getMomentStartOf(me.lastTick.clone().add(1, me.tickUnit)).diff(me.lastTick, me.tickUnit, true);
						me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true) + leadingUnitBuffer + trailingUnitBuffer;
						me.displayFormat = me.options.time.displayFormats[unitDefinition.name];
					}
				}
			}

			var roundedStart;

			// Only round the first tick if we have no hard minimum
			if (!me.options.time.min) {
				me.firstTick = me.getMomentStartOf(me.firstTick);
				roundedStart = me.firstTick;
			} else {
				roundedStart = me.getMomentStartOf(me.firstTick);
			}

			// Only round the last tick if we have no hard maximum
			if (!me.options.time.max) {
				var roundedEnd = me.getMomentStartOf(me.lastTick);
				var delta = roundedEnd.diff(me.lastTick, me.tickUnit, true);
				if (delta < 0) {
					// Do not use end of because we need me to be in the next time unit
					me.lastTick = me.getMomentStartOf(me.lastTick.add(1, me.tickUnit));
				} else if (delta >= 0) {
					me.lastTick = roundedEnd;
				}

				me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
			}

			// Tick displayFormat override
			if (me.options.time.displayFormat) {
				me.displayFormat = me.options.time.displayFormat;
			}

			// first tick. will have been rounded correctly if options.time.min is not specified
			me.ticks.push(me.firstTick.clone());

			// For every unit in between the first and last moment, create a moment and add it to the ticks tick
			for (var i = 1; i <= me.scaleSizeInUnits; ++i) {
				var newTick = roundedStart.clone().add(i, me.tickUnit);

				// Are we greater than the max time
				if (me.options.time.max && newTick.diff(me.lastTick, me.tickUnit, true) >= 0) {
					break;
				}

				if (i % me.unitScale === 0) {
					me.ticks.push(newTick);
				}
			}

			// Always show the right tick
			var diff = me.ticks[me.ticks.length - 1].diff(me.lastTick, me.tickUnit);
			if (diff !== 0 || me.scaleSizeInUnits === 0) {
				// this is a weird case. If the <max> option is the same as the end option, we can't just diff the times because the tick was created from the roundedStart
				// but the last tick was not rounded.
				if (me.options.time.max) {
					me.ticks.push(me.lastTick.clone());
					me.scaleSizeInUnits = me.lastTick.diff(me.ticks[0], me.tickUnit, true);
				} else {
					me.ticks.push(me.lastTick.clone());
					me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
				}
			}

			me.ctx.restore();

			// Invalidate label diffs cache
			me.labelDiffs = undefined;
		},
		// Get tooltip label
		getLabelForIndex: function(index, datasetIndex) {
			var me = this;
			var label = me.chart.data.labels && index < me.chart.data.labels.length ? me.chart.data.labels[index] : '';

			if (typeof me.chart.data.datasets[datasetIndex].data[0] === 'object') {
				label = me.getRightValue(me.chart.data.datasets[datasetIndex].data[index]);
			}

			// Format nicely
			if (me.options.time.tooltipFormat) {
				label = me.parseTime(label).format(me.options.time.tooltipFormat);
			}

			return label;
		},
		// Function to format an individual tick mark
		tickFormatFunction: function(tick, index, ticks) {
			var formattedTick = tick.format(this.displayFormat);
			var tickOpts = this.options.ticks;
			var callback = helpers.getValueOrDefault(tickOpts.callback, tickOpts.userCallback);

			if (callback) {
				return callback(formattedTick, index, ticks);
			}
			return formattedTick;
		},
		convertTicksToLabels: function() {
			var me = this;
			me.tickMoments = me.ticks;
			me.ticks = me.ticks.map(me.tickFormatFunction, me);
		},
		getPixelForValue: function(value, index, datasetIndex) {
			var me = this;
			var offset = null;
			if (index !== undefined && datasetIndex !== undefined) {
				offset = me.getLabelDiff(datasetIndex, index);
			}

			if (offset === null) {
				if (!value || !value.isValid) {
					// not already a moment object
					value = me.parseTime(me.getRightValue(value));
				}
				if (value && value.isValid && value.isValid()) {
					offset = value.diff(me.firstTick, me.tickUnit, true);
				}
			}

			if (offset !== null) {
				var decimal = offset !== 0 ? offset / me.scaleSizeInUnits : offset;

				if (me.isHorizontal()) {
					var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
					var valueOffset = (innerWidth * decimal) + me.paddingLeft;

					return me.left + Math.round(valueOffset);
				}
				var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
				var heightOffset = (innerHeight * decimal) + me.paddingTop;

				return me.top + Math.round(heightOffset);
			}
		},
		getPixelForTick: function(index) {
			return this.getPixelForValue(this.tickMoments[index], null, null);
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var innerDimension = me.isHorizontal() ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.paddingBottom);
			var offset = (pixel - (me.isHorizontal() ? me.left + me.paddingLeft : me.top + me.paddingTop)) / innerDimension;
			offset *= me.scaleSizeInUnits;
			return me.firstTick.clone().add(moment.duration(offset, me.tickUnit).asSeconds(), 'seconds');
		},
		parseTime: function(label) {
			var me = this;
			if (typeof me.options.time.parser === 'string') {
				return moment(label, me.options.time.parser);
			}
			if (typeof me.options.time.parser === 'function') {
				return me.options.time.parser(label);
			}
			// Date objects
			if (typeof label.getMonth === 'function' || typeof label === 'number') {
				return moment(label);
			}
			// Moment support
			if (label.isValid && label.isValid()) {
				return label;
			}
			// Custom parsing (return an instance of moment)
			if (typeof me.options.time.format !== 'string' && me.options.time.format.call) {
				console.warn('options.time.format is deprecated and replaced by options.time.parser. See http://nnnick.github.io/Chart.js/docs-v2/#scales-time-scale');
				return me.options.time.format(label);
			}
			// Moment format parsing
			return moment(label, me.options.time.format);
		}
	});
	Chart.scaleService.registerScaleType('time', TimeScale, defaultConfig);

};

},{"1":1}]},{},[7])(7)
});
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	return function (date, mask, utc) {
		var dF = dateFormat;

		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

var strtotime = function (text, now) {
    var parsed, match, year, date, days, ranges, len, times, regex, i;

    if (!text) {
        return null;
    }
    // Unecessary spaces
    text = text.trim()
        .replace(/\s{2,}/g, ' ')
        .replace(/[\t\r\n]/g, '')
        .toLowerCase();

    if (text === 'now') {
        return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
    }
    if (!isNaN(parsed = Date.parse(text))) {
        return parsed / 1000 | 0;
    }
    if (text === 'now') {
        return new Date().getTime() / 1000; // Return seconds, not milli-seconds
    }
    if (!isNaN(parsed = Date.parse(text))) {
        return parsed / 1000;
    }

    match = text.match(/^(\d{2,4})-(\d{2})-(\d{2})(?:\s(\d{1,2}):(\d{2})(?::\d{2})?)?(?:\.(\d+)?)?$/);
    if (match) {
        year = match[1] >= 0 && match[1] <= 69 ? +match[1] + 2000 : match[1];
        return new Date(year, parseInt(match[2], 10) - 1, match[3],
            match[4] || 0, match[5] || 0, match[6] || 0, match[7] || 0) / 1000;
    }

    date = now ? new Date(now * 1000) : new Date();
    days = {
        'sun': 0,
        'mon': 1,
        'tue': 2,
        'wed': 3,
        'thu': 4,
        'fri': 5,
        'sat': 6
    };
    ranges = {
        'yea': 'FullYear',
        'mon': 'Month',
        'day': 'Date',
        'hou': 'Hours',
        'min': 'Minutes',
        'sec': 'Seconds'
    };

    function lastNext(type, range, modifier) {
        var diff, day = days[range];

        if (typeof day !== 'undefined') {
            diff = day - date.getDay();

            if (diff === 0) {
                diff = 7 * modifier;
            }
            else if (diff > 0 && type === 'last') {
                diff -= 7;
            }
            else if (diff < 0 && type === 'next') {
                diff += 7;
            }

            date.setDate(date.getDate() + diff);
        }
    }
    function process(val) {
        var splt = val.split(' '),
            type = splt[0],
            range = splt[1].substring(0, 3),
            typeIsNumber = /\d+/.test(type),
            ago = splt[2] === 'ago',
            num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

        if (typeIsNumber) {
            num *= parseInt(type, 10);
        }

        if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
            return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
        }
        if (range === 'wee') {
            return date.setDate(date.getDate() + (num * 7));
        }

        if (type === 'next' || type === 'last') {
            lastNext(type, range, num);
        }
        else if (!typeIsNumber) {
            return false;
        }
        return true;
    }

    times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
        '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
        '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
    regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

    match = text.match(new RegExp(regex, 'gi'));
    if (!match) {
        return false;
    }

    for (i = 0, len = match.length; i < len; i++) {
        if (!process(match[i])) {
            return false;
        }
    }
	
    return date;
}

Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

Date.prototype.strtotime = function (string) {
	return strtotime(string, this.getTime()/1000);
};
(function() {
    "use strict";
    var $$utils1$$hop = Object.prototype.hasOwnProperty;

    function $$utils1$$extend(obj) {
        var sources = Array.prototype.slice.call(arguments, 1),
            i, len, source, key;

        for (i = 0, len = sources.length; i < len; i += 1) {
            source = sources[i];
            if (!source) { continue; }

            for (key in source) {
                if ($$utils1$$hop.call(source, key)) {
                    obj[key] = source[key];
                }
            }
        }

        return obj;
    }

    // Purposely using the same implementation as the Intl.js `Intl` polyfill.
    // Copyright 2013 Andy Earnshaw, MIT License

    var $$es5$$realDefineProp = (function () {
        try { return !!Object.defineProperty({}, 'a', {}); }
        catch (e) { return false; }
    })();

    var $$es5$$es3 = !$$es5$$realDefineProp && !Object.prototype.__defineGetter__;

    var $$es5$$defineProperty = $$es5$$realDefineProp ? Object.defineProperty :
            function (obj, name, desc) {

        if ('get' in desc && obj.__defineGetter__) {
            obj.__defineGetter__(name, desc.get);
        } else if (!$$utils1$$hop.call(obj, name) || 'value' in desc) {
            obj[name] = desc.value;
        }
    };

    var $$es5$$objCreate = Object.create || function (proto, props) {
        var obj, k;

        function F() {}
        F.prototype = proto;
        obj = new F();

        for (k in props) {
            if ($$utils1$$hop.call(props, k)) {
                $$es5$$defineProperty(obj, k, props[k]);
            }
        }

        return obj;
    };
    var $$compiler$$default = $$compiler$$Compiler;

    function $$compiler$$Compiler(locales, formats, pluralFn) {
        this.locales  = locales;
        this.formats  = formats;
        this.pluralFn = pluralFn;
    }

    $$compiler$$Compiler.prototype.compile = function (ast) {
        this.pluralStack        = [];
        this.currentPlural      = null;
        this.pluralNumberFormat = null;

        return this.compileMessage(ast);
    };

    $$compiler$$Compiler.prototype.compileMessage = function (ast) {
        if (!(ast && ast.type === 'messageFormatPattern')) {
            throw new Error('Message AST is not of type: "messageFormatPattern"');
        }

        var elements = ast.elements,
            pattern  = [];

        var i, len, element;

        for (i = 0, len = elements.length; i < len; i += 1) {
            element = elements[i];

            switch (element.type) {
                case 'messageTextElement':
                    pattern.push(this.compileMessageText(element));
                    break;

                case 'argumentElement':
                    pattern.push(this.compileArgument(element));
                    break;

                default:
                    throw new Error('Message element does not have a valid type');
            }
        }

        return pattern;
    };

    $$compiler$$Compiler.prototype.compileMessageText = function (element) {
        // When this `element` is part of plural sub-pattern and its value contains
        // an unescaped '#', use a `PluralOffsetString` helper to properly output
        // the number with the correct offset in the string.
        if (this.currentPlural && /(^|[^\\])#/g.test(element.value)) {
            // Create a cache a NumberFormat instance that can be reused for any
            // PluralOffsetString instance in this message.
            if (!this.pluralNumberFormat) {
                this.pluralNumberFormat = new Intl.NumberFormat(this.locales);
            }

            return new $$compiler$$PluralOffsetString(
                    this.currentPlural.id,
                    this.currentPlural.format.offset,
                    this.pluralNumberFormat,
                    element.value);
        }

        // Unescape the escaped '#'s in the message text.
        return element.value.replace(/\\#/g, '#');
    };

    $$compiler$$Compiler.prototype.compileArgument = function (element) {
        var format = element.format;

        if (!format) {
            return new $$compiler$$StringFormat(element.id);
        }

        var formats  = this.formats,
            locales  = this.locales,
            pluralFn = this.pluralFn,
            options;

        switch (format.type) {
            case 'numberFormat':
                options = formats.number[format.style];
                return {
                    id    : element.id,
                    format: new Intl.NumberFormat(locales, options).format
                };

            case 'dateFormat':
                options = formats.date[format.style];
                return {
                    id    : element.id,
                    format: new Intl.DateTimeFormat(locales, options).format
                };

            case 'timeFormat':
                options = formats.time[format.style];
                return {
                    id    : element.id,
                    format: new Intl.DateTimeFormat(locales, options).format
                };

            case 'pluralFormat':
                options = this.compileOptions(element);
                return new $$compiler$$PluralFormat(
                    element.id, format.ordinal, format.offset, options, pluralFn
                );

            case 'selectFormat':
                options = this.compileOptions(element);
                return new $$compiler$$SelectFormat(element.id, options);

            default:
                throw new Error('Message element does not have a valid format type');
        }
    };

    $$compiler$$Compiler.prototype.compileOptions = function (element) {
        var format      = element.format,
            options     = format.options,
            optionsHash = {};

        // Save the current plural element, if any, then set it to a new value when
        // compiling the options sub-patterns. This conforms the spec's algorithm
        // for handling `"#"` syntax in message text.
        this.pluralStack.push(this.currentPlural);
        this.currentPlural = format.type === 'pluralFormat' ? element : null;

        var i, len, option;

        for (i = 0, len = options.length; i < len; i += 1) {
            option = options[i];

            // Compile the sub-pattern and save it under the options's selector.
            optionsHash[option.selector] = this.compileMessage(option.value);
        }

        // Pop the plural stack to put back the original current plural value.
        this.currentPlural = this.pluralStack.pop();

        return optionsHash;
    };

    // -- Compiler Helper Classes --------------------------------------------------

    function $$compiler$$StringFormat(id) {
        this.id = id;
    }

    $$compiler$$StringFormat.prototype.format = function (value) {
        if (!value) {
            return '';
        }

        return typeof value === 'string' ? value : String(value);
    };

    function $$compiler$$PluralFormat(id, useOrdinal, offset, options, pluralFn) {
        this.id         = id;
        this.useOrdinal = useOrdinal;
        this.offset     = offset;
        this.options    = options;
        this.pluralFn   = pluralFn;
    }

    $$compiler$$PluralFormat.prototype.getOption = function (value) {
        var options = this.options;

        var option = options['=' + value] ||
                options[this.pluralFn(value - this.offset, this.useOrdinal)];

        return option || options.other;
    };

    function $$compiler$$PluralOffsetString(id, offset, numberFormat, string) {
        this.id           = id;
        this.offset       = offset;
        this.numberFormat = numberFormat;
        this.string       = string;
    }

    $$compiler$$PluralOffsetString.prototype.format = function (value) {
        var number = this.numberFormat.format(value - this.offset);

        return this.string
                .replace(/(^|[^\\])#/g, '$1' + number)
                .replace(/\\#/g, '#');
    };

    function $$compiler$$SelectFormat(id, options) {
        this.id      = id;
        this.options = options;
    }

    $$compiler$$SelectFormat.prototype.getOption = function (value) {
        var options = this.options;
        return options[value] || options.other;
    };

    var intl$messageformat$parser$$default = (function() {
      /*
       * Generated by PEG.js 0.8.0.
       *
       * http://pegjs.majda.cz/
       */

      function peg$subclass(child, parent) {
        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
      }

      function SyntaxError(message, expected, found, offset, line, column) {
        this.message  = message;
        this.expected = expected;
        this.found    = found;
        this.offset   = offset;
        this.line     = line;
        this.column   = column;

        this.name     = "SyntaxError";
      }

      peg$subclass(SyntaxError, Error);

      function parse(input) {
        var options = arguments.length > 1 ? arguments[1] : {},

            peg$FAILED = {},

            peg$startRuleFunctions = { start: peg$parsestart },
            peg$startRuleFunction  = peg$parsestart,

            peg$c0 = [],
            peg$c1 = function(elements) {
                    return {
                        type    : 'messageFormatPattern',
                        elements: elements
                    };
                },
            peg$c2 = peg$FAILED,
            peg$c3 = function(text) {
                    var string = '',
                        i, j, outerLen, inner, innerLen;

                    for (i = 0, outerLen = text.length; i < outerLen; i += 1) {
                        inner = text[i];

                        for (j = 0, innerLen = inner.length; j < innerLen; j += 1) {
                            string += inner[j];
                        }
                    }

                    return string;
                },
            peg$c4 = function(messageText) {
                    return {
                        type : 'messageTextElement',
                        value: messageText
                    };
                },
            peg$c5 = /^[^ \t\n\r,.+={}#]/,
            peg$c6 = { type: "class", value: "[^ \\t\\n\\r,.+={}#]", description: "[^ \\t\\n\\r,.+={}#]" },
            peg$c7 = "{",
            peg$c8 = { type: "literal", value: "{", description: "\"{\"" },
            peg$c9 = null,
            peg$c10 = ",",
            peg$c11 = { type: "literal", value: ",", description: "\",\"" },
            peg$c12 = "}",
            peg$c13 = { type: "literal", value: "}", description: "\"}\"" },
            peg$c14 = function(id, format) {
                    return {
                        type  : 'argumentElement',
                        id    : id,
                        format: format && format[2]
                    };
                },
            peg$c15 = "number",
            peg$c16 = { type: "literal", value: "number", description: "\"number\"" },
            peg$c17 = "date",
            peg$c18 = { type: "literal", value: "date", description: "\"date\"" },
            peg$c19 = "time",
            peg$c20 = { type: "literal", value: "time", description: "\"time\"" },
            peg$c21 = function(type, style) {
                    return {
                        type : type + 'Format',
                        style: style && style[2]
                    };
                },
            peg$c22 = "plural",
            peg$c23 = { type: "literal", value: "plural", description: "\"plural\"" },
            peg$c24 = function(pluralStyle) {
                    return {
                        type   : pluralStyle.type,
                        ordinal: false,
                        offset : pluralStyle.offset || 0,
                        options: pluralStyle.options
                    };
                },
            peg$c25 = "selectordinal",
            peg$c26 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
            peg$c27 = function(pluralStyle) {
                    return {
                        type   : pluralStyle.type,
                        ordinal: true,
                        offset : pluralStyle.offset || 0,
                        options: pluralStyle.options
                    }
                },
            peg$c28 = "select",
            peg$c29 = { type: "literal", value: "select", description: "\"select\"" },
            peg$c30 = function(options) {
                    return {
                        type   : 'selectFormat',
                        options: options
                    };
                },
            peg$c31 = "=",
            peg$c32 = { type: "literal", value: "=", description: "\"=\"" },
            peg$c33 = function(selector, pattern) {
                    return {
                        type    : 'optionalFormatPattern',
                        selector: selector,
                        value   : pattern
                    };
                },
            peg$c34 = "offset:",
            peg$c35 = { type: "literal", value: "offset:", description: "\"offset:\"" },
            peg$c36 = function(number) {
                    return number;
                },
            peg$c37 = function(offset, options) {
                    return {
                        type   : 'pluralFormat',
                        offset : offset,
                        options: options
                    };
                },
            peg$c38 = { type: "other", description: "whitespace" },
            peg$c39 = /^[ \t\n\r]/,
            peg$c40 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
            peg$c41 = { type: "other", description: "optionalWhitespace" },
            peg$c42 = /^[0-9]/,
            peg$c43 = { type: "class", value: "[0-9]", description: "[0-9]" },
            peg$c44 = /^[0-9a-f]/i,
            peg$c45 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
            peg$c46 = "0",
            peg$c47 = { type: "literal", value: "0", description: "\"0\"" },
            peg$c48 = /^[1-9]/,
            peg$c49 = { type: "class", value: "[1-9]", description: "[1-9]" },
            peg$c50 = function(digits) {
                return parseInt(digits, 10);
            },
            peg$c51 = /^[^{}\\\0-\x1F \t\n\r]/,
            peg$c52 = { type: "class", value: "[^{}\\\\\\0-\\x1F \\t\\n\\r]", description: "[^{}\\\\\\0-\\x1F \\t\\n\\r]" },
            peg$c53 = "\\#",
            peg$c54 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
            peg$c55 = function() { return '\\#'; },
            peg$c56 = "\\{",
            peg$c57 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
            peg$c58 = function() { return '\u007B'; },
            peg$c59 = "\\}",
            peg$c60 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
            peg$c61 = function() { return '\u007D'; },
            peg$c62 = "\\u",
            peg$c63 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
            peg$c64 = function(digits) {
                    return String.fromCharCode(parseInt(digits, 16));
                },
            peg$c65 = function(chars) { return chars.join(''); },

            peg$currPos          = 0,
            peg$reportedPos      = 0,
            peg$cachedPos        = 0,
            peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
            peg$maxFailPos       = 0,
            peg$maxFailExpected  = [],
            peg$silentFails      = 0,

            peg$result;

        if ("startRule" in options) {
          if (!(options.startRule in peg$startRuleFunctions)) {
            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
          }

          peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
        }

        function text() {
          return input.substring(peg$reportedPos, peg$currPos);
        }

        function offset() {
          return peg$reportedPos;
        }

        function line() {
          return peg$computePosDetails(peg$reportedPos).line;
        }

        function column() {
          return peg$computePosDetails(peg$reportedPos).column;
        }

        function expected(description) {
          throw peg$buildException(
            null,
            [{ type: "other", description: description }],
            peg$reportedPos
          );
        }

        function error(message) {
          throw peg$buildException(message, null, peg$reportedPos);
        }

        function peg$computePosDetails(pos) {
          function advance(details, startPos, endPos) {
            var p, ch;

            for (p = startPos; p < endPos; p++) {
              ch = input.charAt(p);
              if (ch === "\n") {
                if (!details.seenCR) { details.line++; }
                details.column = 1;
                details.seenCR = false;
              } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                details.line++;
                details.column = 1;
                details.seenCR = true;
              } else {
                details.column++;
                details.seenCR = false;
              }
            }
          }

          if (peg$cachedPos !== pos) {
            if (peg$cachedPos > pos) {
              peg$cachedPos = 0;
              peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
            }
            advance(peg$cachedPosDetails, peg$cachedPos, pos);
            peg$cachedPos = pos;
          }

          return peg$cachedPosDetails;
        }

        function peg$fail(expected) {
          if (peg$currPos < peg$maxFailPos) { return; }

          if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
          }

          peg$maxFailExpected.push(expected);
        }

        function peg$buildException(message, expected, pos) {
          function cleanupExpected(expected) {
            var i = 1;

            expected.sort(function(a, b) {
              if (a.description < b.description) {
                return -1;
              } else if (a.description > b.description) {
                return 1;
              } else {
                return 0;
              }
            });

            while (i < expected.length) {
              if (expected[i - 1] === expected[i]) {
                expected.splice(i, 1);
              } else {
                i++;
              }
            }
          }

          function buildMessage(expected, found) {
            function stringEscape(s) {
              function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

              return s
                .replace(/\\/g,   '\\\\')
                .replace(/"/g,    '\\"')
                .replace(/\x08/g, '\\b')
                .replace(/\t/g,   '\\t')
                .replace(/\n/g,   '\\n')
                .replace(/\f/g,   '\\f')
                .replace(/\r/g,   '\\r')
                .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
                .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
                .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
                .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
            }

            var expectedDescs = new Array(expected.length),
                expectedDesc, foundDesc, i;

            for (i = 0; i < expected.length; i++) {
              expectedDescs[i] = expected[i].description;
            }

            expectedDesc = expected.length > 1
              ? expectedDescs.slice(0, -1).join(", ")
                  + " or "
                  + expectedDescs[expected.length - 1]
              : expectedDescs[0];

            foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

            return "Expected " + expectedDesc + " but " + foundDesc + " found.";
          }

          var posDetails = peg$computePosDetails(pos),
              found      = pos < input.length ? input.charAt(pos) : null;

          if (expected !== null) {
            cleanupExpected(expected);
          }

          return new SyntaxError(
            message !== null ? message : buildMessage(expected, found),
            expected,
            found,
            pos,
            posDetails.line,
            posDetails.column
          );
        }

        function peg$parsestart() {
          var s0;

          s0 = peg$parsemessageFormatPattern();

          return s0;
        }

        function peg$parsemessageFormatPattern() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parsemessageFormatElement();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsemessageFormatElement();
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c1(s1);
          }
          s0 = s1;

          return s0;
        }

        function peg$parsemessageFormatElement() {
          var s0;

          s0 = peg$parsemessageTextElement();
          if (s0 === peg$FAILED) {
            s0 = peg$parseargumentElement();
          }

          return s0;
        }

        function peg$parsemessageText() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          s1 = [];
          s2 = peg$currPos;
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsechars();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$currPos;
              s3 = peg$parse_();
              if (s3 !== peg$FAILED) {
                s4 = peg$parsechars();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parse_();
                  if (s5 !== peg$FAILED) {
                    s3 = [s3, s4, s5];
                    s2 = s3;
                  } else {
                    peg$currPos = s2;
                    s2 = peg$c2;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            }
          } else {
            s1 = peg$c2;
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c3(s1);
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parsews();
            if (s1 !== peg$FAILED) {
              s1 = input.substring(s0, peg$currPos);
            }
            s0 = s1;
          }

          return s0;
        }

        function peg$parsemessageTextElement() {
          var s0, s1;

          s0 = peg$currPos;
          s1 = peg$parsemessageText();
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c4(s1);
          }
          s0 = s1;

          return s0;
        }

        function peg$parseargument() {
          var s0, s1, s2;

          s0 = peg$parsenumber();
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = [];
            if (peg$c5.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
            if (s2 !== peg$FAILED) {
              while (s2 !== peg$FAILED) {
                s1.push(s2);
                if (peg$c5.test(input.charAt(peg$currPos))) {
                  s2 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c6); }
                }
              }
            } else {
              s1 = peg$c2;
            }
            if (s1 !== peg$FAILED) {
              s1 = input.substring(s0, peg$currPos);
            }
            s0 = s1;
          }

          return s0;
        }

        function peg$parseargumentElement() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 123) {
            s1 = peg$c7;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseargument();
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                  s5 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s6 = peg$c10;
                    peg$currPos++;
                  } else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c11); }
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parse_();
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parseelementFormat();
                      if (s8 !== peg$FAILED) {
                        s6 = [s6, s7, s8];
                        s5 = s6;
                      } else {
                        peg$currPos = s5;
                        s5 = peg$c2;
                      }
                    } else {
                      peg$currPos = s5;
                      s5 = peg$c2;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$c2;
                  }
                  if (s5 === peg$FAILED) {
                    s5 = peg$c9;
                  }
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 125) {
                        s7 = peg$c12;
                        peg$currPos++;
                      } else {
                        s7 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c13); }
                      }
                      if (s7 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c14(s3, s5);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }

          return s0;
        }

        function peg$parseelementFormat() {
          var s0;

          s0 = peg$parsesimpleFormat();
          if (s0 === peg$FAILED) {
            s0 = peg$parsepluralFormat();
            if (s0 === peg$FAILED) {
              s0 = peg$parseselectOrdinalFormat();
              if (s0 === peg$FAILED) {
                s0 = peg$parseselectFormat();
              }
            }
          }

          return s0;
        }

        function peg$parsesimpleFormat() {
          var s0, s1, s2, s3, s4, s5, s6;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 6) === peg$c15) {
            s1 = peg$c15;
            peg$currPos += 6;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c16); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c17) {
              s1 = peg$c17;
              peg$currPos += 4;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c18); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 4) === peg$c19) {
                s1 = peg$c19;
                peg$currPos += 4;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c20); }
              }
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              s3 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 44) {
                s4 = peg$c10;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c11); }
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parse_();
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsechars();
                  if (s6 !== peg$FAILED) {
                    s4 = [s4, s5, s6];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c2;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c2;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c2;
              }
              if (s3 === peg$FAILED) {
                s3 = peg$c9;
              }
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c21(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }

          return s0;
        }

        function peg$parsepluralFormat() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 6) === peg$c22) {
            s1 = peg$c22;
            peg$currPos += 6;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c23); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s3 = peg$c10;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c11); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsepluralStyle();
                  if (s5 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c24(s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }

          return s0;
        }

        function peg$parseselectOrdinalFormat() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 13) === peg$c25) {
            s1 = peg$c25;
            peg$currPos += 13;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c26); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s3 = peg$c10;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c11); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsepluralStyle();
                  if (s5 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c27(s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }

          return s0;
        }

        function peg$parseselectFormat() {
          var s0, s1, s2, s3, s4, s5, s6;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 6) === peg$c28) {
            s1 = peg$c28;
            peg$currPos += 6;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c29); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s3 = peg$c10;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c11); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                  s5 = [];
                  s6 = peg$parseoptionalFormatPattern();
                  if (s6 !== peg$FAILED) {
                    while (s6 !== peg$FAILED) {
                      s5.push(s6);
                      s6 = peg$parseoptionalFormatPattern();
                    }
                  } else {
                    s5 = peg$c2;
                  }
                  if (s5 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c30(s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }

          return s0;
        }

        function peg$parseselector() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          s1 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 61) {
            s2 = peg$c31;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsenumber();
            if (s3 !== peg$FAILED) {
              s2 = [s2, s3];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
          if (s1 !== peg$FAILED) {
            s1 = input.substring(s0, peg$currPos);
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$parsechars();
          }

          return s0;
        }

        function peg$parseoptionalFormatPattern() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8;

          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseselector();
            if (s2 !== peg$FAILED) {
              s3 = peg$parse_();
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 123) {
                  s4 = peg$c7;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c8); }
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parse_();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parsemessageFormatPattern();
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parse_();
                      if (s7 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 125) {
                          s8 = peg$c12;
                          peg$currPos++;
                        } else {
                          s8 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c13); }
                        }
                        if (s8 !== peg$FAILED) {
                          peg$reportedPos = s0;
                          s1 = peg$c33(s2, s6);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c2;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }

          return s0;
        }

        function peg$parseoffset() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 7) === peg$c34) {
            s1 = peg$c34;
            peg$currPos += 7;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c35); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              s3 = peg$parsenumber();
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c36(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }

          return s0;
        }

        function peg$parsepluralStyle() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          s1 = peg$parseoffset();
          if (s1 === peg$FAILED) {
            s1 = peg$c9;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parseoptionalFormatPattern();
              if (s4 !== peg$FAILED) {
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parseoptionalFormatPattern();
                }
              } else {
                s3 = peg$c2;
              }
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c37(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }

          return s0;
        }

        function peg$parsews() {
          var s0, s1;

          peg$silentFails++;
          s0 = [];
          if (peg$c39.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c40); }
          }
          if (s1 !== peg$FAILED) {
            while (s1 !== peg$FAILED) {
              s0.push(s1);
              if (peg$c39.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c40); }
              }
            }
          } else {
            s0 = peg$c2;
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c38); }
          }

          return s0;
        }

        function peg$parse_() {
          var s0, s1, s2;

          peg$silentFails++;
          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parsews();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsews();
          }
          if (s1 !== peg$FAILED) {
            s1 = input.substring(s0, peg$currPos);
          }
          s0 = s1;
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c41); }
          }

          return s0;
        }

        function peg$parsedigit() {
          var s0;

          if (peg$c42.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c43); }
          }

          return s0;
        }

        function peg$parsehexDigit() {
          var s0;

          if (peg$c44.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c45); }
          }

          return s0;
        }

        function peg$parsenumber() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 48) {
            s1 = peg$c46;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c47); }
          }
          if (s1 === peg$FAILED) {
            s1 = peg$currPos;
            s2 = peg$currPos;
            if (peg$c48.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c49); }
            }
            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parsedigit();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parsedigit();
              }
              if (s4 !== peg$FAILED) {
                s3 = [s3, s4];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
            if (s2 !== peg$FAILED) {
              s2 = input.substring(s1, peg$currPos);
            }
            s1 = s2;
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c50(s1);
          }
          s0 = s1;

          return s0;
        }

        function peg$parsechar() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          if (peg$c51.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c52); }
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c53) {
              s1 = peg$c53;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c54); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c55();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c56) {
                s1 = peg$c56;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c57); }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c58();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c59) {
                  s1 = peg$c59;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c60); }
                }
                if (s1 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c61();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.substr(peg$currPos, 2) === peg$c62) {
                    s1 = peg$c62;
                    peg$currPos += 2;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c63); }
                  }
                  if (s1 !== peg$FAILED) {
                    s2 = peg$currPos;
                    s3 = peg$currPos;
                    s4 = peg$parsehexDigit();
                    if (s4 !== peg$FAILED) {
                      s5 = peg$parsehexDigit();
                      if (s5 !== peg$FAILED) {
                        s6 = peg$parsehexDigit();
                        if (s6 !== peg$FAILED) {
                          s7 = peg$parsehexDigit();
                          if (s7 !== peg$FAILED) {
                            s4 = [s4, s5, s6, s7];
                            s3 = s4;
                          } else {
                            peg$currPos = s3;
                            s3 = peg$c2;
                          }
                        } else {
                          peg$currPos = s3;
                          s3 = peg$c2;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$c2;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$c2;
                    }
                    if (s3 !== peg$FAILED) {
                      s3 = input.substring(s2, peg$currPos);
                    }
                    s2 = s3;
                    if (s2 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c64(s2);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                }
              }
            }
          }

          return s0;
        }

        function peg$parsechars() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parsechar();
          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parsechar();
            }
          } else {
            s1 = peg$c2;
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c65(s1);
          }
          s0 = s1;

          return s0;
        }

        peg$result = peg$startRuleFunction();

        if (peg$result !== peg$FAILED && peg$currPos === input.length) {
          return peg$result;
        } else {
          if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail({ type: "end", description: "end of input" });
          }

          throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
        }
      }

      return {
        SyntaxError: SyntaxError,
        parse:       parse
      };
    })();

    var $$core$$default = $$core$$MessageFormat;

    // -- MessageFormat --------------------------------------------------------

    function $$core$$MessageFormat(message, locales, formats) {
        // Parse string messages into an AST.
        var ast = typeof message === 'string' ?
                $$core$$MessageFormat.__parse(message) : message;

        if (!(ast && ast.type === 'messageFormatPattern')) {
            throw new TypeError('A message must be provided as a String or AST.');
        }

        // Creates a new object with the specified `formats` merged with the default
        // formats.
        formats = this._mergeFormats($$core$$MessageFormat.formats, formats);

        // Defined first because it's used to build the format pattern.
        $$es5$$defineProperty(this, '_locale',  {value: this._resolveLocale(locales)});

        // Compile the `ast` to a pattern that is highly optimized for repeated
        // `format()` invocations. **Note:** This passes the `locales` set provided
        // to the constructor instead of just the resolved locale.
        var pluralFn = this._findPluralRuleFunction(this._locale);
        var pattern  = this._compilePattern(ast, locales, formats, pluralFn);

        // "Bind" `format()` method to `this` so it can be passed by reference like
        // the other `Intl` APIs.
        var messageFormat = this;
        this.format = function (values) {
            return messageFormat._format(pattern, values);
        };
    }

    // Default format options used as the prototype of the `formats` provided to the
    // constructor. These are used when constructing the internal Intl.NumberFormat
    // and Intl.DateTimeFormat instances.
    $$es5$$defineProperty($$core$$MessageFormat, 'formats', {
        enumerable: true,

        value: {
            number: {
                'currency': {
                    style: 'currency'
                },

                'percent': {
                    style: 'percent'
                }
            },

            date: {
                'short': {
                    month: 'numeric',
                    day  : 'numeric',
                    year : '2-digit'
                },

                'medium': {
                    month: 'short',
                    day  : 'numeric',
                    year : 'numeric'
                },

                'long': {
                    month: 'long',
                    day  : 'numeric',
                    year : 'numeric'
                },

                'full': {
                    weekday: 'long',
                    month  : 'long',
                    day    : 'numeric',
                    year   : 'numeric'
                }
            },

            time: {
                'short': {
                    hour  : 'numeric',
                    minute: 'numeric'
                },

                'medium':  {
                    hour  : 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                },

                'long': {
                    hour        : 'numeric',
                    minute      : 'numeric',
                    second      : 'numeric',
                    timeZoneName: 'short'
                },

                'full': {
                    hour        : 'numeric',
                    minute      : 'numeric',
                    second      : 'numeric',
                    timeZoneName: 'short'
                }
            }
        }
    });

    // Define internal private properties for dealing with locale data.
    $$es5$$defineProperty($$core$$MessageFormat, '__localeData__', {value: $$es5$$objCreate(null)});
    $$es5$$defineProperty($$core$$MessageFormat, '__addLocaleData', {value: function (data) {
        if (!(data && data.locale)) {
            throw new Error(
                'Locale data provided to IntlMessageFormat is missing a ' +
                '`locale` property'
            );
        }

        $$core$$MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
    }});

    // Defines `__parse()` static method as an exposed private.
    $$es5$$defineProperty($$core$$MessageFormat, '__parse', {value: intl$messageformat$parser$$default.parse});

    // Define public `defaultLocale` property which defaults to English, but can be
    // set by the developer.
    $$es5$$defineProperty($$core$$MessageFormat, 'defaultLocale', {
        enumerable: true,
        writable  : true,
        value     : undefined
    });

    $$core$$MessageFormat.prototype.resolvedOptions = function () {
        // TODO: Provide anything else?
        return {
            locale: this._locale
        };
    };

    $$core$$MessageFormat.prototype._compilePattern = function (ast, locales, formats, pluralFn) {
        var compiler = new $$compiler$$default(locales, formats, pluralFn);
        return compiler.compile(ast);
    };

    $$core$$MessageFormat.prototype._findPluralRuleFunction = function (locale) {
        var localeData = $$core$$MessageFormat.__localeData__;
        var data       = localeData[locale.toLowerCase()];

        // The locale data is de-duplicated, so we have to traverse the locale's
        // hierarchy until we find a `pluralRuleFunction` to return.
        while (data) {
            if (data.pluralRuleFunction) {
                return data.pluralRuleFunction;
            }

            data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
        }

        throw new Error(
            'Locale data added to IntlMessageFormat is missing a ' +
            '`pluralRuleFunction` for :' + locale
        );
    };

    $$core$$MessageFormat.prototype._format = function (pattern, values) {
        var result = '',
            i, len, part, id, value;

        for (i = 0, len = pattern.length; i < len; i += 1) {
            part = pattern[i];

            // Exist early for string parts.
            if (typeof part === 'string') {
                result += part;
                continue;
            }

            id = part.id;

            // Enforce that all required values are provided by the caller.
            if (!(values && $$utils1$$hop.call(values, id))) {
                throw new Error('A value must be provided for: ' + id);
            }

            value = values[id];

            // Recursively format plural and select parts' option — which can be a
            // nested pattern structure. The choosing of the option to use is
            // abstracted-by and delegated-to the part helper object.
            if (part.options) {
                result += this._format(part.getOption(value), values);
            } else {
                result += part.format(value);
            }
        }

        return result;
    };

    $$core$$MessageFormat.prototype._mergeFormats = function (defaults, formats) {
        var mergedFormats = {},
            type, mergedType;

        for (type in defaults) {
            if (!$$utils1$$hop.call(defaults, type)) { continue; }

            mergedFormats[type] = mergedType = $$es5$$objCreate(defaults[type]);

            if (formats && $$utils1$$hop.call(formats, type)) {
                $$utils1$$extend(mergedType, formats[type]);
            }
        }

        return mergedFormats;
    };

    $$core$$MessageFormat.prototype._resolveLocale = function (locales) {
        if (typeof locales === 'string') {
            locales = [locales];
        }

        // Create a copy of the array so we can push on the default locale.
        locales = (locales || []).concat($$core$$MessageFormat.defaultLocale);

        var localeData = $$core$$MessageFormat.__localeData__;
        var i, len, localeParts, data;

        // Using the set of locales + the default locale, we look for the first one
        // which that has been registered. When data does not exist for a locale, we
        // traverse its ancestors to find something that's been registered within
        // its hierarchy of locales. Since we lack the proper `parentLocale` data
        // here, we must take a naive approach to traversal.
        for (i = 0, len = locales.length; i < len; i += 1) {
            localeParts = locales[i].toLowerCase().split('-');

            while (localeParts.length) {
                data = localeData[localeParts.join('-')];
                if (data) {
                    // Return the normalized locale string; e.g., we return "en-US",
                    // instead of "en-us".
                    return data.locale;
                }

                localeParts.pop();
            }
        }

        var defaultLocale = locales.pop();
        throw new Error(
            'No locale data has been added to IntlMessageFormat for: ' +
            locales.join(', ') + ', or the default locale: ' + defaultLocale
        );
    };
    var $$en1$$default = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}};

    $$core$$default.__addLocaleData($$en1$$default);
    $$core$$default.defaultLocale = 'en';

    var intl$messageformat$$default = $$core$$default;

    var $$diff$$round = Math.round;

    function $$diff$$daysToYears(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    var $$diff$$default = function (from, to) {
        // Convert to ms timestamps.
        from = +from;
        to   = +to;

        var millisecond = $$diff$$round(to - from),
            second      = $$diff$$round(millisecond / 1000),
            minute      = $$diff$$round(second / 60),
            hour        = $$diff$$round(minute / 60),
            day         = $$diff$$round(hour / 24),
            week        = $$diff$$round(day / 7);

        var rawYears = $$diff$$daysToYears(day),
            month    = $$diff$$round(rawYears * 12),
            year     = $$diff$$round(rawYears);

        return {
            millisecond: millisecond,
            second     : second,
            minute     : minute,
            hour       : hour,
            day        : day,
            week       : week,
            month      : month,
            year       : year
        };
    };

    // Purposely using the same implementation as the Intl.js `Intl` polyfill.
    // Copyright 2013 Andy Earnshaw, MIT License

    var $$es51$$hop = Object.prototype.hasOwnProperty;
    var $$es51$$toString = Object.prototype.toString;

    var $$es51$$realDefineProp = (function () {
        try { return !!Object.defineProperty({}, 'a', {}); }
        catch (e) { return false; }
    })();

    var $$es51$$es3 = !$$es51$$realDefineProp && !Object.prototype.__defineGetter__;

    var $$es51$$defineProperty = $$es51$$realDefineProp ? Object.defineProperty :
            function (obj, name, desc) {

        if ('get' in desc && obj.__defineGetter__) {
            obj.__defineGetter__(name, desc.get);
        } else if (!$$es51$$hop.call(obj, name) || 'value' in desc) {
            obj[name] = desc.value;
        }
    };

    var $$es51$$objCreate = Object.create || function (proto, props) {
        var obj, k;

        function F() {}
        F.prototype = proto;
        obj = new F();

        for (k in props) {
            if ($$es51$$hop.call(props, k)) {
                $$es51$$defineProperty(obj, k, props[k]);
            }
        }

        return obj;
    };

    var $$es51$$arrIndexOf = Array.prototype.indexOf || function (search, fromIndex) {
        /*jshint validthis:true */
        var arr = this;
        if (!arr.length) {
            return -1;
        }

        for (var i = fromIndex || 0, max = arr.length; i < max; i++) {
            if (arr[i] === search) {
                return i;
            }
        }

        return -1;
    };

    var $$es51$$isArray = Array.isArray || function (obj) {
        return $$es51$$toString.call(obj) === '[object Array]';
    };

    var $$es51$$dateNow = Date.now || function () {
        return new Date().getTime();
    };
    var $$core1$$default = $$core1$$RelativeFormat;

    // -----------------------------------------------------------------------------

    var $$core1$$FIELDS = ['second', 'minute', 'hour', 'day', 'month', 'year'];
    var $$core1$$STYLES = ['best fit', 'numeric'];

    // -- RelativeFormat -----------------------------------------------------------

    function $$core1$$RelativeFormat(locales, options) {
        options = options || {};

        // Make a copy of `locales` if it's an array, so that it doesn't change
        // since it's used lazily.
        if ($$es51$$isArray(locales)) {
            locales = locales.concat();
        }

        $$es51$$defineProperty(this, '_locale', {value: this._resolveLocale(locales)});
        $$es51$$defineProperty(this, '_options', {value: {
            style: this._resolveStyle(options.style),
            units: this._isValidUnits(options.units) && options.units
        }});

        $$es51$$defineProperty(this, '_locales', {value: locales});
        $$es51$$defineProperty(this, '_fields', {value: this._findFields(this._locale)});
        $$es51$$defineProperty(this, '_messages', {value: $$es51$$objCreate(null)});

        // "Bind" `format()` method to `this` so it can be passed by reference like
        // the other `Intl` APIs.
        var relativeFormat = this;
        this.format = function format(date, options) {
            return relativeFormat._format(date, options);
        };
    }

    // Define internal private properties for dealing with locale data.
    $$es51$$defineProperty($$core1$$RelativeFormat, '__localeData__', {value: $$es51$$objCreate(null)});
    $$es51$$defineProperty($$core1$$RelativeFormat, '__addLocaleData', {value: function (data) {
        if (!(data && data.locale)) {
            throw new Error(
                'Locale data provided to IntlRelativeFormat is missing a ' +
                '`locale` property value'
            );
        }

        $$core1$$RelativeFormat.__localeData__[data.locale.toLowerCase()] = data;

        // Add data to IntlMessageFormat.
        intl$messageformat$$default.__addLocaleData(data);
    }});

    // Define public `defaultLocale` property which can be set by the developer, or
    // it will be set when the first RelativeFormat instance is created by
    // leveraging the resolved locale from `Intl`.
    $$es51$$defineProperty($$core1$$RelativeFormat, 'defaultLocale', {
        enumerable: true,
        writable  : true,
        value     : undefined
    });

    // Define public `thresholds` property which can be set by the developer, and
    // defaults to relative time thresholds from moment.js.
    $$es51$$defineProperty($$core1$$RelativeFormat, 'thresholds', {
        enumerable: true,

        value: {
            second: 45,  // seconds to minute
            minute: 45,  // minutes to hour
            hour  : 22,  // hours to day
            day   : 26,  // days to month
            month : 11   // months to year
        }
    });

    $$core1$$RelativeFormat.prototype.resolvedOptions = function () {
        return {
            locale: this._locale,
            style : this._options.style,
            units : this._options.units
        };
    };

    $$core1$$RelativeFormat.prototype._compileMessage = function (units) {
        // `this._locales` is the original set of locales the user specified to the
        // constructor, while `this._locale` is the resolved root locale.
        var locales        = this._locales;
        var resolvedLocale = this._locale;

        var field        = this._fields[units];
        var relativeTime = field.relativeTime;
        var future       = '';
        var past         = '';
        var i;

        for (i in relativeTime.future) {
            if (relativeTime.future.hasOwnProperty(i)) {
                future += ' ' + i + ' {' +
                    relativeTime.future[i].replace('{0}', '#') + '}';
            }
        }

        for (i in relativeTime.past) {
            if (relativeTime.past.hasOwnProperty(i)) {
                past += ' ' + i + ' {' +
                    relativeTime.past[i].replace('{0}', '#') + '}';
            }
        }

        var message = '{when, select, future {{0, plural, ' + future + '}}' +
                                     'past {{0, plural, ' + past + '}}}';

        // Create the synthetic IntlMessageFormat instance using the original
        // locales value specified by the user when constructing the the parent
        // IntlRelativeFormat instance.
        return new intl$messageformat$$default(message, locales);
    };

    $$core1$$RelativeFormat.prototype._getMessage = function (units) {
        var messages = this._messages;

        // Create a new synthetic message based on the locale data from CLDR.
        if (!messages[units]) {
            messages[units] = this._compileMessage(units);
        }

        return messages[units];
    };

    $$core1$$RelativeFormat.prototype._getRelativeUnits = function (diff, units) {
        var field = this._fields[units];

        if (field.relative) {
            return field.relative[diff];
        }
    };

    $$core1$$RelativeFormat.prototype._findFields = function (locale) {
        var localeData = $$core1$$RelativeFormat.__localeData__;
        var data       = localeData[locale.toLowerCase()];

        // The locale data is de-duplicated, so we have to traverse the locale's
        // hierarchy until we find `fields` to return.
        while (data) {
            if (data.fields) {
                return data.fields;
            }

            data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
        }

        throw new Error(
            'Locale data added to IntlRelativeFormat is missing `fields` for :' +
            locale
        );
    };

    $$core1$$RelativeFormat.prototype._format = function (date, options) {
        var now = options && options.now !== undefined ? options.now : $$es51$$dateNow();

        if (date === undefined) {
            date = now;
        }

        // Determine if the `date` and optional `now` values are valid, and throw a
        // similar error to what `Intl.DateTimeFormat#format()` would throw.
        if (!isFinite(now)) {
            throw new RangeError(
                'The `now` option provided to IntlRelativeFormat#format() is not ' +
                'in valid range.'
            );
        }

        if (!isFinite(date)) {
            throw new RangeError(
                'The date value provided to IntlRelativeFormat#format() is not ' +
                'in valid range.'
            );
        }

        var diffReport  = $$diff$$default(now, date);
        var units       = this._options.units || this._selectUnits(diffReport);
        var diffInUnits = diffReport[units];

        if (this._options.style !== 'numeric') {
            var relativeUnits = this._getRelativeUnits(diffInUnits, units);
            if (relativeUnits) {
                return relativeUnits;
            }
        }

        return this._getMessage(units).format({
            '0' : Math.abs(diffInUnits),
            when: diffInUnits < 0 ? 'past' : 'future'
        });
    };

    $$core1$$RelativeFormat.prototype._isValidUnits = function (units) {
        if (!units || $$es51$$arrIndexOf.call($$core1$$FIELDS, units) >= 0) {
            return true;
        }

        if (typeof units === 'string') {
            var suggestion = /s$/.test(units) && units.substr(0, units.length - 1);
            if (suggestion && $$es51$$arrIndexOf.call($$core1$$FIELDS, suggestion) >= 0) {
                throw new Error(
                    '"' + units + '" is not a valid IntlRelativeFormat `units` ' +
                    'value, did you mean: ' + suggestion
                );
            }
        }

        throw new Error(
            '"' + units + '" is not a valid IntlRelativeFormat `units` value, it ' +
            'must be one of: "' + $$core1$$FIELDS.join('", "') + '"'
        );
    };

    $$core1$$RelativeFormat.prototype._resolveLocale = function (locales) {
        if (typeof locales === 'string') {
            locales = [locales];
        }

        // Create a copy of the array so we can push on the default locale.
        locales = (locales || []).concat($$core1$$RelativeFormat.defaultLocale);

        var localeData = $$core1$$RelativeFormat.__localeData__;
        var i, len, localeParts, data;

        // Using the set of locales + the default locale, we look for the first one
        // which that has been registered. When data does not exist for a locale, we
        // traverse its ancestors to find something that's been registered within
        // its hierarchy of locales. Since we lack the proper `parentLocale` data
        // here, we must take a naive approach to traversal.
        for (i = 0, len = locales.length; i < len; i += 1) {
            localeParts = locales[i].toLowerCase().split('-');

            while (localeParts.length) {
                data = localeData[localeParts.join('-')];
                if (data) {
                    // Return the normalized locale string; e.g., we return "en-US",
                    // instead of "en-us".
                    return data.locale;
                }

                localeParts.pop();
            }
        }

        var defaultLocale = locales.pop();
        throw new Error(
            'No locale data has been added to IntlRelativeFormat for: ' +
            locales.join(', ') + ', or the default locale: ' + defaultLocale
        );
    };

    $$core1$$RelativeFormat.prototype._resolveStyle = function (style) {
        // Default to "best fit" style.
        if (!style) {
            return $$core1$$STYLES[0];
        }

        if ($$es51$$arrIndexOf.call($$core1$$STYLES, style) >= 0) {
            return style;
        }

        throw new Error(
            '"' + style + '" is not a valid IntlRelativeFormat `style` value, it ' +
            'must be one of: "' + $$core1$$STYLES.join('", "') + '"'
        );
    };

    $$core1$$RelativeFormat.prototype._selectUnits = function (diffReport) {
        var i, l, units;

        for (i = 0, l = $$core1$$FIELDS.length; i < l; i += 1) {
            units = $$core1$$FIELDS[i];

            if (Math.abs(diffReport[units]) < $$core1$$RelativeFormat.thresholds[units]) {
                break;
            }
        }

        return units;
    };
    var $$en2$$default = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"in {0} year","other":"in {0} years"},"past":{"one":"{0} year ago","other":"{0} years ago"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"in {0} month","other":"in {0} months"},"past":{"one":"{0} month ago","other":"{0} months ago"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"one":"in {0} hour","other":"in {0} hours"},"past":{"one":"{0} hour ago","other":"{0} hours ago"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"one":"in {0} minute","other":"in {0} minutes"},"past":{"one":"{0} minute ago","other":"{0} minutes ago"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} second","other":"in {0} seconds"},"past":{"one":"{0} second ago","other":"{0} seconds ago"}}}}};

    $$core1$$default.__addLocaleData($$en2$$default);
    $$core1$$default.defaultLocale = 'en';

    var intl$relativeformat$$default = $$core1$$default;

    var $$es52$$bind = Function.prototype.bind || function (oThis) {
        if (typeof this !== 'function') {
          // closest thing possible to the ECMAScript 5
          // internal IsCallable function
          throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
              return fToBind.apply(this instanceof fNOP
                     ? this
                     : oThis,
                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
          // native functions don't have a prototype
          fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();

        return fBound;
    };

    // Purposely using the same implementation as the Intl.js `Intl` polyfill.
    // Copyright 2013 Andy Earnshaw, MIT License

    var $$es52$$hop = Object.prototype.hasOwnProperty;

    var $$es52$$realDefineProp = (function () {
        try { return !!Object.defineProperty({}, 'a', {}); }
        catch (e) { return false; }
    })();

    var $$es52$$es3 = !$$es52$$realDefineProp && !Object.prototype.__defineGetter__;

    var $$es52$$defineProperty = $$es52$$realDefineProp ? Object.defineProperty :
            function (obj, name, desc) {

        if ('get' in desc && obj.__defineGetter__) {
            obj.__defineGetter__(name, desc.get);
        } else if (!$$es52$$hop.call(obj, name) || 'value' in desc) {
            obj[name] = desc.value;
        }
    };

    var $$es52$$objCreate = Object.create || function (proto, props) {
        var obj, k;

        function F() {}
        F.prototype = proto;
        obj = new F();

        for (k in props) {
            if ($$es52$$hop.call(props, k)) {
                $$es52$$defineProperty(obj, k, props[k]);
            }
        }

        return obj;
    };

    var intl$format$cache$$default = intl$format$cache$$createFormatCache;

    // -----------------------------------------------------------------------------

    function intl$format$cache$$createFormatCache(FormatConstructor) {
        var cache = $$es52$$objCreate(null);

        return function () {
            var args    = Array.prototype.slice.call(arguments);
            var cacheId = intl$format$cache$$getCacheId(args);
            var format  = cacheId && cache[cacheId];

            if (!format) {
                format = new ($$es52$$bind.apply(FormatConstructor, [null].concat(args)))();

                if (cacheId) {
                    cache[cacheId] = format;
                }
            }

            return format;
        };
    }

    // -- Utilities ----------------------------------------------------------------

    function intl$format$cache$$getCacheId(inputs) {
        // When JSON is not available in the runtime, we will not create a cache id.
        if (typeof JSON === 'undefined') { return; }

        var cacheId = [];

        var i, len, input;

        for (i = 0, len = inputs.length; i < len; i += 1) {
            input = inputs[i];

            if (input && typeof input === 'object') {
                cacheId.push(intl$format$cache$$orderedProps(input));
            } else {
                cacheId.push(input);
            }
        }

        return JSON.stringify(cacheId);
    }

    function intl$format$cache$$orderedProps(obj) {
        var props = [],
            keys  = [];

        var key, i, len, prop;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        var orderedKeys = keys.sort();

        for (i = 0, len = orderedKeys.length; i < len; i += 1) {
            key  = orderedKeys[i];
            prop = {};

            prop[key] = obj[key];
            props[i]  = prop;
        }

        return props;
    }

    // -----------------------------------------------------------------------------

    function $$utils$$extend(obj) {
        var sources = Array.prototype.slice.call(arguments, 1),
            i, len, source, key;

        for (i = 0, len = sources.length; i < len; i += 1) {
            source = sources[i];
            if (!source) { continue; }

            for (key in source) {
                if (source.hasOwnProperty(key)) {
                    obj[key] = source[key];
                }
            }
        }

        return obj;
    }

    // -----------------------------------------------------------------------------

    var $$helpers$$getNumberFormat   = intl$format$cache$$default(Intl.NumberFormat);
    var $$helpers$$getDateTimeFormat = intl$format$cache$$default(Intl.DateTimeFormat);
    var $$helpers$$getMessageFormat  = intl$format$cache$$default(intl$messageformat$$default);
    var $$helpers$$getRelativeFormat = intl$format$cache$$default(intl$relativeformat$$default);

    function $$helpers$$registerWith(Handlebars) {
        var SafeString  = Handlebars.SafeString,
            createFrame = Handlebars.createFrame,
            escape      = Handlebars.Utils.escapeExpression;

        var helpers = {
            intl             : intl,
            intlGet          : intlGet,
            formatDate       : formatDate,
            formatTime       : formatTime,
            formatRelative   : formatRelative,
            formatNumber     : formatNumber,
            formatMessage    : formatMessage,
            formatHTMLMessage: formatHTMLMessage,

            // Deprecated helpers (renamed):
            intlDate       : deprecate('intlDate', formatDate),
            intlTime       : deprecate('intlTime', formatTime),
            intlNumber     : deprecate('intlNumber', formatNumber),
            intlMessage    : deprecate('intlMessage', formatMessage),
            intlHTMLMessage: deprecate('intlHTMLMessage', formatHTMLMessage)
        };

        for (var name in helpers) {
            if (helpers.hasOwnProperty(name)) {
                Handlebars.registerHelper(name, helpers[name]);
            }
        }

        function deprecate(name, suggestion) {
            return function () {
                if (typeof console !== 'undefined' &&
                    typeof console.warn === 'function') {

                    console.warn(
                        '{{' + name + '}} is deprecated, use: ' +
                        '{{' + suggestion.name + '}}'
                    );
                }

                return suggestion.apply(this, arguments);
            };
        }

        // -- Helpers --------------------------------------------------------------

        function intl(options) {
            /* jshint validthis:true */

            if (!options.fn) {
                throw new Error('{{#intl}} must be invoked as a block helper');
            }

            // Create a new data frame linked the parent and create a new intl data
            // object and extend it with `options.data.intl` and `options.hash`.
            var data     = createFrame(options.data),
                intlData = $$utils$$extend({}, data.intl, options.hash);

            data.intl = intlData;

            return options.fn(this, {data: data});
        }

        function intlGet(path, options) {
            var intlData  = options.data && options.data.intl,
                pathParts = path.split('.');

            var obj, len, i;

            // Use the path to walk the Intl data to find the object at the given
            // path, and throw a descriptive error if it's not found.
            try {
                for (i = 0, len = pathParts.length; i < len; i++) {
                    obj = intlData = intlData[pathParts[i]];
                }
            } finally {
                if (obj === undefined) {
                    throw new ReferenceError('Could not find Intl object: ' + path);
                }
            }

            return obj;
        }

        function formatDate(date, format, options) {
            date = new Date(date);
            assertIsDate(date, 'A date or timestamp must be provided to {{formatDate}}');

            if (!options) {
                options = format;
                format  = null;
            }

            var locales       = options.data.intl && options.data.intl.locales;
            var formatOptions = getFormatOptions('date', format, options);

            return $$helpers$$getDateTimeFormat(locales, formatOptions).format(date);
        }

        function formatTime(date, format, options) {
            date = new Date(date);
            assertIsDate(date, 'A date or timestamp must be provided to {{formatTime}}');

            if (!options) {
                options = format;
                format  = null;
            }

            var locales       = options.data.intl && options.data.intl.locales;
            var formatOptions = getFormatOptions('time', format, options);

            return $$helpers$$getDateTimeFormat(locales, formatOptions).format(date);
        }

        function formatRelative(date, format, options) {
            date = new Date(date);
            assertIsDate(date, 'A date or timestamp must be provided to {{formatRelative}}');

            if (!options) {
                options = format;
                format  = null;
            }

            var locales       = options.data.intl && options.data.intl.locales;
            var formatOptions = getFormatOptions('relative', format, options);
            var now           = options.hash.now;

            // Remove `now` from the options passed to the `IntlRelativeFormat`
            // constructor, because it's only used when calling `format()`.
            delete formatOptions.now;

            return $$helpers$$getRelativeFormat(locales, formatOptions).format(date, {
                now: now
            });
        }

        function formatNumber(num, format, options) {
            assertIsNumber(num, 'A number must be provided to {{formatNumber}}');

            if (!options) {
                options = format;
                format  = null;
            }

            var locales       = options.data.intl && options.data.intl.locales;
            var formatOptions = getFormatOptions('number', format, options);

            return $$helpers$$getNumberFormat(locales, formatOptions).format(num);
        }

        function formatMessage(message, options) {
            if (!options) {
                options = message;
                message = null;
            }

            var hash = options.hash;

            // TODO: remove support form `hash.intlName` once Handlebars bugs with
            // subexpressions are fixed.
            if (!(message || typeof message === 'string' || hash.intlName)) {
                throw new ReferenceError(
                    '{{formatMessage}} must be provided a message or intlName'
                );
            }

            var intlData = options.data.intl || {},
                locales  = intlData.locales,
                formats  = intlData.formats;

            // Lookup message by path name. User must supply the full path to the
            // message on `options.data.intl`.
            if (!message && hash.intlName) {
                message = intlGet(hash.intlName, options);
            }

            // When `message` is a function, assume it's an IntlMessageFormat
            // instance's `format()` method passed by reference, and call it. This
            // is possible because its `this` will be pre-bound to the instance.
            if (typeof message === 'function') {
                return message(hash);
            }

            if (typeof message === 'string') {
                message = $$helpers$$getMessageFormat(message, locales, formats);
            }

            return message.format(hash);
        }

        function formatHTMLMessage() {
            /* jshint validthis:true */
            var options = [].slice.call(arguments).pop(),
                hash    = options.hash;

            var key, value;

            // Replace string properties in `options.hash` with HTML-escaped
            // strings.
            for (key in hash) {
                if (hash.hasOwnProperty(key)) {
                    value = hash[key];

                    // Escape string value.
                    if (typeof value === 'string') {
                        hash[key] = escape(value);
                    }
                }
            }

            // Return a Handlebars `SafeString`. This first unwraps the result to
            // make sure it's not returning a double-wrapped `SafeString`.
            return new SafeString(String(formatMessage.apply(this, arguments)));
        }

        // -- Utilities ------------------------------------------------------------

        function assertIsDate(date, errMsg) {
            // Determine if the `date` is valid by checking if it is finite, which
            // is the same way that `Intl.DateTimeFormat#format()` checks.
            if (!isFinite(date)) {
                throw new TypeError(errMsg);
            }
        }

        function assertIsNumber(num, errMsg) {
            if (typeof num !== 'number') {
                throw new TypeError(errMsg);
            }
        }

        function getFormatOptions(type, format, options) {
            var hash = options.hash;
            var formatOptions;

            if (format) {
                if (typeof format === 'string') {
                    formatOptions = intlGet('formats.' + type + '.' + format, options);
                }

                formatOptions = $$utils$$extend({}, formatOptions, hash);
            } else {
                formatOptions = hash;
            }

            return formatOptions;
        }
    }
    var $$en$$default = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"in {0} year","other":"in {0} years"},"past":{"one":"{0} year ago","other":"{0} years ago"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"in {0} month","other":"in {0} months"},"past":{"one":"{0} month ago","other":"{0} months ago"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"one":"in {0} hour","other":"in {0} hours"},"past":{"one":"{0} hour ago","other":"{0} hours ago"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"one":"in {0} minute","other":"in {0} minutes"},"past":{"one":"{0} minute ago","other":"{0} minutes ago"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} second","other":"in {0} seconds"},"past":{"one":"{0} second ago","other":"{0} seconds ago"}}}}};
    function $$handlebars$intl$$__addLocaleData(data) {
        intl$messageformat$$default.__addLocaleData(data);
        intl$relativeformat$$default.__addLocaleData(data);
    }

    $$handlebars$intl$$__addLocaleData($$en$$default);

    var src$main$$default = {
        registerWith   : $$helpers$$registerWith,
        __addLocaleData: $$handlebars$intl$$__addLocaleData
    };

    this['HandlebarsIntl'] = src$main$$default;
}).call(this);

//
HandlebarsIntl.__addLocaleData({"locale":"aa","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"aa-DJ","parentLocale":"aa"});
HandlebarsIntl.__addLocaleData({"locale":"aa-ER","parentLocale":"aa"});
HandlebarsIntl.__addLocaleData({"locale":"aa-ET","parentLocale":"aa"});

HandlebarsIntl.__addLocaleData({"locale":"af","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Jaar","relative":{"0":"hierdie jaar","1":"volgende jaar","-1":"verlede jaar"},"relativeTime":{"future":{"one":"Oor {0} jaar","other":"Oor {0} jaar"},"past":{"one":"{0} jaar gelede","other":"{0} jaar gelede"}}},"month":{"displayName":"Maand","relative":{"0":"vandeesmaand","1":"volgende maand","-1":"verlede maand"},"relativeTime":{"future":{"one":"Oor {0} maand","other":"Oor {0} maande"},"past":{"one":"{0} maand gelede","other":"{0} maande gelede"}}},"day":{"displayName":"Dag","relative":{"0":"vandag","1":"môre","2":"oormôre","-1":"gister","-2":"eergister"},"relativeTime":{"future":{"one":"Oor {0} dag","other":"Oor {0} dae"},"past":{"one":"{0} dag gelede","other":"{0} dae gelede"}}},"hour":{"displayName":"Uur","relativeTime":{"future":{"one":"Oor {0} uur","other":"Oor {0} uur"},"past":{"one":"{0} uur gelede","other":"{0} uur gelede"}}},"minute":{"displayName":"Minuut","relativeTime":{"future":{"one":"Oor {0} minuut","other":"Oor {0} minute"},"past":{"one":"{0} minuut gelede","other":"{0} minute gelede"}}},"second":{"displayName":"Sekonde","relative":{"0":"nou"},"relativeTime":{"future":{"one":"Oor {0} sekonde","other":"Oor {0} sekondes"},"past":{"one":"{0} sekonde gelede","other":"{0} sekondes gelede"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"af-NA","parentLocale":"af"});
HandlebarsIntl.__addLocaleData({"locale":"af-ZA","parentLocale":"af"});

HandlebarsIntl.__addLocaleData({"locale":"agq","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"kɨnûm","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"ndzɔŋ","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"utsuʔ","relative":{"0":"nɛ","1":"tsʉtsʉ","-1":"ā zūɛɛ"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"tàm","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"menè","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"sɛkɔ̀n","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"agq-CM","parentLocale":"agq"});

HandlebarsIntl.__addLocaleData({"locale":"ak","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"},"fields":{"year":{"displayName":"Afe","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Bosome","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Da","relative":{"0":"Ndɛ","1":"Ɔkyena","-1":"Ndeda"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Dɔnhwer","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Sema","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sɛkɛnd","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ak-GH","parentLocale":"ak"});

HandlebarsIntl.__addLocaleData({"locale":"am","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<=1?"one":"other"},"fields":{"year":{"displayName":"ዓመት","relative":{"0":"በዚህ ዓመት","1":"የሚቀጥለው ዓመት","-1":"ያለፈው ዓመት"},"relativeTime":{"future":{"one":"በ{0} ዓመታት ውስጥ","other":"በ{0} ዓመታት ውስጥ"},"past":{"one":"ከ{0} ዓመት በፊት","other":"ከ{0} ዓመታት በፊት"}}},"month":{"displayName":"ወር","relative":{"0":"በዚህ ወር","1":"የሚቀጥለው ወር","-1":"ያለፈው ወር"},"relativeTime":{"future":{"one":"በ{0} ወር ውስጥ","other":"በ{0} ወራት ውስጥ"},"past":{"one":"ከ{0} ወር በፊት","other":"ከ{0} ወራት በፊት"}}},"day":{"displayName":"ቀን","relative":{"0":"ዛሬ","1":"ነገ","2":"ከነገ ወዲያ","-1":"ትናንት","-2":"ከትናንት ወዲያ"},"relativeTime":{"future":{"one":"በ{0} ቀን ውስጥ","other":"በ{0} ቀናት ውስጥ"},"past":{"one":"ከ{0} ቀን በፊት","other":"ከ{0} ቀናት በፊት"}}},"hour":{"displayName":"ሰዓት","relativeTime":{"future":{"one":"በ{0} ሰዓት ውስጥ","other":"በ{0} ሰዓቶች ውስጥ"},"past":{"one":"ከ{0} ሰዓት በፊት","other":"ከ{0} ሰዓቶች በፊት"}}},"minute":{"displayName":"ደቂቃ","relativeTime":{"future":{"one":"በ{0} ደቂቃ ውስጥ","other":"በ{0} ደቂቃዎች ውስጥ"},"past":{"one":"ከ{0} ደቂቃ በፊት","other":"ከ{0} ደቂቃዎች በፊት"}}},"second":{"displayName":"ሰከንድ","relative":{"0":"አሁን"},"relativeTime":{"future":{"one":"በ{0} ሰከንድ ውስጥ","other":"በ{0} ሰከንዶች ውስጥ"},"past":{"one":"ከ{0} ሰከንድ በፊት","other":"ከ{0} ሰከንዶች በፊት"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"am-ET","parentLocale":"am"});

HandlebarsIntl.__addLocaleData({"locale":"ar","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n100=t0&&s[0].slice(-2);if(ord)return"other";return n==0?"zero":n==1?"one":n==2?"two":n100>=3&&n100<=10?"few":n100>=11&&n100<=99?"many":"other"},"fields":{"year":{"displayName":"السنة","relative":{"0":"السنة الحالية","1":"السنة التالية","-1":"السنة الماضية"},"relativeTime":{"future":{"zero":"خلال {0} من السنوات","one":"خلال {0} من السنوات","two":"خلال سنتين","few":"خلال {0} سنوات","many":"خلال {0} سنة","other":"خلال {0} من السنوات"},"past":{"zero":"قبل {0} من السنوات","one":"قبل {0} من السنوات","two":"قبل سنتين","few":"قبل {0} سنوات","many":"قبل {0} سنة","other":"قبل {0} من السنوات"}}},"month":{"displayName":"الشهر","relative":{"0":"هذا الشهر","1":"الشهر التالي","-1":"الشهر الماضي"},"relativeTime":{"future":{"zero":"خلال {0} من الشهور","one":"خلال {0} من الشهور","two":"خلال شهرين","few":"خلال {0} شهور","many":"خلال {0} شهرًا","other":"خلال {0} من الشهور"},"past":{"zero":"قبل {0} من الشهور","one":"قبل {0} من الشهور","two":"قبل شهرين","few":"قبل {0} أشهر","many":"قبل {0} شهرًا","other":"قبل {0} من الشهور"}}},"day":{"displayName":"يوم","relative":{"0":"اليوم","1":"غدًا","2":"بعد الغد","-1":"أمس","-2":"أول أمس"},"relativeTime":{"future":{"zero":"خلال {0} من الأيام","one":"خلال {0} من الأيام","two":"خلال يومين","few":"خلال {0} أيام","many":"خلال {0} يومًا","other":"خلال {0} من الأيام"},"past":{"zero":"قبل {0} من الأيام","one":"قبل {0} من الأيام","two":"قبل يومين","few":"قبل {0} أيام","many":"قبل {0} يومًا","other":"قبل {0} من الأيام"}}},"hour":{"displayName":"الساعات","relativeTime":{"future":{"zero":"خلال {0} من الساعات","one":"خلال {0} من الساعات","two":"خلال ساعتين","few":"خلال {0} ساعات","many":"خلال {0} ساعة","other":"خلال {0} من الساعات"},"past":{"zero":"قبل {0} من الساعات","one":"قبل {0} من الساعات","two":"قبل ساعتين","few":"قبل {0} ساعات","many":"قبل {0} ساعة","other":"قبل {0} من الساعات"}}},"minute":{"displayName":"الدقائق","relativeTime":{"future":{"zero":"خلال {0} من الدقائق","one":"خلال {0} من الدقائق","two":"خلال دقيقتين","few":"خلال {0} دقائق","many":"خلال {0} دقيقة","other":"خلال {0} من الدقائق"},"past":{"zero":"قبل {0} من الدقائق","one":"قبل {0} من الدقائق","two":"قبل دقيقتين","few":"قبل {0} دقائق","many":"قبل {0} دقيقة","other":"قبل {0} من الدقائق"}}},"second":{"displayName":"الثواني","relative":{"0":"الآن"},"relativeTime":{"future":{"zero":"خلال {0} من الثواني","one":"خلال {0} من الثواني","two":"خلال ثانيتين","few":"خلال {0} ثوانِ","many":"خلال {0} ثانية","other":"خلال {0} من الثواني"},"past":{"zero":"قبل {0} من الثواني","one":"قبل {0} من الثواني","two":"قبل ثانيتين","few":"قبل {0} ثوانِ","many":"قبل {0} ثانية","other":"قبل {0} من الثواني"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ar-001","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-AE","parentLocale":"ar","fields":{"year":{"displayName":"السنة","relative":{"0":"هذه السنة","1":"السنة التالية","-1":"السنة الماضية"},"relativeTime":{"future":{"zero":"خلال {0} من السنوات","one":"خلال {0} من السنوات","two":"خلال سنتين","few":"خلال {0} سنوات","many":"خلال {0} سنة","other":"خلال {0} من السنوات"},"past":{"zero":"قبل {0} من السنوات","one":"قبل {0} من السنوات","two":"قبل سنتين","few":"قبل {0} سنوات","many":"قبل {0} سنة","other":"قبل {0} من السنوات"}}},"month":{"displayName":"الشهر","relative":{"0":"هذا الشهر","1":"الشهر التالي","-1":"الشهر الماضي"},"relativeTime":{"future":{"zero":"خلال {0} من الشهور","one":"خلال {0} من الشهور","two":"خلال شهرين","few":"خلال {0} شهور","many":"خلال {0} شهرًا","other":"خلال {0} من الشهور"},"past":{"zero":"قبل {0} من الشهور","one":"قبل {0} من الشهور","two":"قبل شهرين","few":"قبل {0} أشهر","many":"قبل {0} شهرًا","other":"قبل {0} من الشهور"}}},"day":{"displayName":"يوم","relative":{"0":"اليوم","1":"غدًا","2":"بعد الغد","-1":"أمس","-2":"أول أمس"},"relativeTime":{"future":{"zero":"خلال {0} من الأيام","one":"خلال {0} من الأيام","two":"خلال يومين","few":"خلال {0} أيام","many":"خلال {0} يومًا","other":"خلال {0} من الأيام"},"past":{"zero":"قبل {0} من الأيام","one":"قبل {0} من الأيام","two":"قبل يومين","few":"قبل {0} أيام","many":"قبل {0} يومًا","other":"قبل {0} من الأيام"}}},"hour":{"displayName":"الساعات","relativeTime":{"future":{"zero":"خلال {0} من الساعات","one":"خلال {0} من الساعات","two":"خلال ساعتين","few":"خلال {0} ساعات","many":"خلال {0} ساعة","other":"خلال {0} من الساعات"},"past":{"zero":"قبل {0} من الساعات","one":"قبل {0} من الساعات","two":"قبل ساعتين","few":"قبل {0} ساعات","many":"قبل {0} ساعة","other":"قبل {0} من الساعات"}}},"minute":{"displayName":"الدقائق","relativeTime":{"future":{"zero":"خلال {0} من الدقائق","one":"خلال {0} من الدقائق","two":"خلال دقيقتين","few":"خلال {0} دقائق","many":"خلال {0} دقيقة","other":"خلال {0} من الدقائق"},"past":{"zero":"قبل {0} من الدقائق","one":"قبل {0} من الدقائق","two":"قبل دقيقتين","few":"قبل {0} دقائق","many":"قبل {0} دقيقة","other":"قبل {0} من الدقائق"}}},"second":{"displayName":"الثواني","relative":{"0":"الآن"},"relativeTime":{"future":{"zero":"خلال {0} من الثواني","one":"خلال {0} من الثواني","two":"خلال ثانيتين","few":"خلال {0} ثوانِ","many":"خلال {0} ثانية","other":"خلال {0} من الثواني"},"past":{"zero":"قبل {0} من الثواني","one":"قبل {0} من الثواني","two":"قبل ثانيتين","few":"قبل {0} ثوانِ","many":"قبل {0} ثانية","other":"قبل {0} من الثواني"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ar-BH","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-DJ","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-DZ","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-EG","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-EH","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-ER","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-IL","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-IQ","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-JO","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-KM","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-KW","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-LB","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-LY","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-MA","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-MR","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-OM","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-PS","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-QA","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-SA","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-SD","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-SO","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-SS","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-SY","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-TD","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-TN","parentLocale":"ar"});
HandlebarsIntl.__addLocaleData({"locale":"ar-YE","parentLocale":"ar"});

HandlebarsIntl.__addLocaleData({"locale":"as","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"বছৰ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"মাহ","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"দিন","relative":{"0":"today","1":"কাইলৈ","2":"পৰহিলৈ","-1":"কালি","-2":"পৰহি"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"ঘণ্টা","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"মিনিট","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"ছেকেণ্ড","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"as-IN","parentLocale":"as"});

HandlebarsIntl.__addLocaleData({"locale":"asa","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Mwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mweji","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Thiku","relative":{"0":"Iyoo","1":"Yavo","-1":"Ighuo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Thaa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Thekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"asa-TZ","parentLocale":"asa"});

HandlebarsIntl.__addLocaleData({"locale":"ast","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"añu","relative":{"0":"esti añu","1":"l’añu viniente","-1":"l’añu pasáu"},"relativeTime":{"future":{"one":"En {0} añu","other":"En {0} años"},"past":{"one":"Hai {0} añu","other":"Hai {0} años"}}},"month":{"displayName":"mes","relative":{"0":"esti mes","1":"el mes viniente","-1":"el mes pasáu"},"relativeTime":{"future":{"one":"En {0} mes","other":"En {0} meses"},"past":{"one":"Hai {0} mes","other":"Hai {0} meses"}}},"day":{"displayName":"día","relative":{"0":"güei","1":"mañana","2":"pasao mañana","-1":"ayeri","-2":"antayeri"},"relativeTime":{"future":{"one":"En {0} dia","other":"En {0} díes"},"past":{"one":"Hai {0} dia","other":"Hai {0} díes"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"En {0} hora","other":"En {0} hores"},"past":{"one":"Hai {0} hora","other":"Hai {0} hores"}}},"minute":{"displayName":"minutu","relativeTime":{"future":{"one":"En {0} minutu","other":"En {0} minutos"},"past":{"one":"Hai {0} minutu","other":"Hai {0} minutos"}}},"second":{"displayName":"segundu","relative":{"0":"now"},"relativeTime":{"future":{"one":"En {0} segundu","other":"En {0} segundos"},"past":{"one":"Hai {0} segundu","other":"Hai {0} segundos"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ast-ES","parentLocale":"ast"});

HandlebarsIntl.__addLocaleData({"locale":"az","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],i10=i.slice(-1),i100=i.slice(-2),i1000=i.slice(-3);if(ord)return i10==1||i10==2||i10==5||i10==7||i10==8||(i100==20||i100==50||i100==70||i100==80)?"one":i10==3||i10==4||(i1000==100||i1000==200||i1000==300||i1000==400||i1000==500||i1000==600||i1000==700||i1000==800||i1000==900)?"few":i==0||i10==6||(i100==40||i100==60||i100==90)?"many":"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"İl","relative":{"0":"bu il","1":"gələn il","-1":"keçən il"},"relativeTime":{"future":{"one":"{0} il ərzində","other":"{0} il ərzində"},"past":{"one":"{0} il öncə","other":"{0} il öncə"}}},"month":{"displayName":"Ay","relative":{"0":"bu ay","1":"gələn ay","-1":"keçən ay"},"relativeTime":{"future":{"one":"{0} ay ərzində","other":"{0} ay ərzində"},"past":{"one":"{0} ay öncə","other":"{0} ay öncə"}}},"day":{"displayName":"Gün","relative":{"0":"bu gün","1":"sabah","-1":"dünən"},"relativeTime":{"future":{"one":"{0} gün ərzində","other":"{0} gün ərzində"},"past":{"one":"{0} gün öncə","other":"{0} gün öncə"}}},"hour":{"displayName":"Saat","relativeTime":{"future":{"one":"{0} saat ərzində","other":"{0} saat ərzində"},"past":{"one":"{0} saat öncə","other":"{0} saat öncə"}}},"minute":{"displayName":"Dəqiqə","relativeTime":{"future":{"one":"{0} dəqiqə ərzində","other":"{0} dəqiqə ərzində"},"past":{"one":"{0} dəqiqə öncə","other":"{0} dəqiqə öncə"}}},"second":{"displayName":"Saniyə","relative":{"0":"indi"},"relativeTime":{"future":{"one":"{0} saniyə ərzində","other":"{0} saniyə ərzində"},"past":{"one":"{0} saniyə öncə","other":"{0} saniyə öncə"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"az-Cyrl","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"az-Cyrl-AZ","parentLocale":"az-Cyrl"});
HandlebarsIntl.__addLocaleData({"locale":"az-Latn","parentLocale":"az"});
HandlebarsIntl.__addLocaleData({"locale":"az-Latn-AZ","parentLocale":"az-Latn"});

HandlebarsIntl.__addLocaleData({"locale":"bas","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"ŋwìi","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"soŋ","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"kɛl","relative":{"0":"lɛ̀n","1":"yàni","-1":"yààni"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"ŋgɛŋ","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"ŋget","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"hìŋgeŋget","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"bas-CM","parentLocale":"bas"});

HandlebarsIntl.__addLocaleData({"locale":"be","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return"other";return n10==1&&n100!=11?"one":n10>=2&&n10<=4&&(n100<12||n100>14)?"few":t0&&n10==0||n10>=5&&n10<=9||n100>=11&&n100<=14?"many":"other"},"fields":{"year":{"displayName":"год","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"месяц","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"дзень","relative":{"0":"сёння","1":"заўтра","2":"паслязаўтра","-1":"учора","-2":"пазаўчора"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"гадзіна","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"хвіліна","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"секунда","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"be-BY","parentLocale":"be"});

HandlebarsIntl.__addLocaleData({"locale":"bem","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Umwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Umweshi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ubushiku","relative":{"0":"Lelo","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Insa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Mineti","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekondi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"bem-ZM","parentLocale":"bem"});

HandlebarsIntl.__addLocaleData({"locale":"bez","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Mwaha","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mwedzi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Sihu","relative":{"0":"Neng’u ni","1":"Hilawu","-1":"Igolo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"bez-TZ","parentLocale":"bez"});

HandlebarsIntl.__addLocaleData({"locale":"bg","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"година","relative":{"0":"тази година","1":"следващата година","-1":"миналата година"},"relativeTime":{"future":{"one":"след {0} година","other":"след {0} години"},"past":{"one":"преди {0} година","other":"преди {0} години"}}},"month":{"displayName":"месец","relative":{"0":"този месец","1":"следващият месец","-1":"миналият месец"},"relativeTime":{"future":{"one":"след {0} месец","other":"след {0} месеца"},"past":{"one":"преди {0} месец","other":"преди {0} месеца"}}},"day":{"displayName":"ден","relative":{"0":"днес","1":"утре","2":"вдругиден","-1":"вчера","-2":"онзи ден"},"relativeTime":{"future":{"one":"след {0} ден","other":"след {0} дни"},"past":{"one":"преди {0} ден","other":"преди {0} дни"}}},"hour":{"displayName":"час","relativeTime":{"future":{"one":"след {0} час","other":"след {0} часа"},"past":{"one":"преди {0} час","other":"преди {0} часа"}}},"minute":{"displayName":"минута","relativeTime":{"future":{"one":"след {0} минута","other":"след {0} минути"},"past":{"one":"преди {0} минута","other":"преди {0} минути"}}},"second":{"displayName":"секунда","relative":{"0":"сега"},"relativeTime":{"future":{"one":"след {0} секунда","other":"след {0} секунди"},"past":{"one":"преди {0} секунда","other":"преди {0} секунди"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"bg-BG","parentLocale":"bg"});

HandlebarsIntl.__addLocaleData({"locale":"bh","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"bm","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"san","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"kalo","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"don","relative":{"0":"bi","1":"sini","-1":"kunu"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"lɛrɛ","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"miniti","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"sekondi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"bm-Latn","parentLocale":"bm"});
HandlebarsIntl.__addLocaleData({"locale":"bm-Latn-ML","parentLocale":"bm-Latn"});
HandlebarsIntl.__addLocaleData({"locale":"bm-Nkoo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"bn","pluralRuleFunction":function (n,ord){if(ord)return n==1||n==5||n==7||n==8||n==9||n==10?"one":n==2||n==3?"two":n==4?"few":n==6?"many":"other";return n>=0&&n<=1?"one":"other"},"fields":{"year":{"displayName":"বছর","relative":{"0":"এই বছর","1":"পরের বছর","-1":"গত বছর"},"relativeTime":{"future":{"one":"{0} বছরে","other":"{0} বছরে"},"past":{"one":"{0} বছর পূর্বে","other":"{0} বছর পূর্বে"}}},"month":{"displayName":"মাস","relative":{"0":"এই মাস","1":"পরের মাস","-1":"গত মাস"},"relativeTime":{"future":{"one":"{0} মাসে","other":"{0} মাসে"},"past":{"one":"{0} মাস পূর্বে","other":"{0} মাস পূর্বে"}}},"day":{"displayName":"দিন","relative":{"0":"আজ","1":"আগামীকাল","2":"আগামী পরশু","-1":"গতকাল","-2":"গত পরশু"},"relativeTime":{"future":{"one":"{0} দিনের মধ্যে","other":"{0} দিনের মধ্যে"},"past":{"one":"{0} দিন পূর্বে","other":"{0} দিন পূর্বে"}}},"hour":{"displayName":"ঘন্টা","relativeTime":{"future":{"one":"{0} ঘন্টায়","other":"{0} ঘন্টায়"},"past":{"one":"{0} ঘন্টা আগে","other":"{0} ঘন্টা আগে"}}},"minute":{"displayName":"মিনিট","relativeTime":{"future":{"one":"{0} মিনিটে","other":"{0} মিনিটে"},"past":{"one":"{0} মিনিট পূর্বে","other":"{0} মিনিট পূর্বে"}}},"second":{"displayName":"সেকেন্ড","relative":{"0":"এখন"},"relativeTime":{"future":{"one":"{0} সেকেন্ডে","other":"{0} সেকেন্ডে"},"past":{"one":"{0} সেকেন্ড পূর্বে","other":"{0} সেকেন্ড পূর্বে"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"bn-BD","parentLocale":"bn"});
HandlebarsIntl.__addLocaleData({"locale":"bn-IN","parentLocale":"bn"});

HandlebarsIntl.__addLocaleData({"locale":"bo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"ལོ།","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"ཟླ་བ་","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"ཉིན།","relative":{"0":"དེ་རིང་","1":"སང་ཉིན་","2":"གནངས་ཉིན་ཀ་","-1":"ཁས་ས་","-2":"ཁས་ཉིན་ཀ་"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"ཆུ་ཙོ་","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"སྐར་མ།","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"སྐར་ཆ།","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"bo-CN","parentLocale":"bo"});
HandlebarsIntl.__addLocaleData({"locale":"bo-IN","parentLocale":"bo"});

HandlebarsIntl.__addLocaleData({"locale":"br","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2),n1000000=t0&&s[0].slice(-6);if(ord)return"other";return n10==1&&n100!=11&&n100!=71&&n100!=91?"one":n10==2&&n100!=12&&n100!=72&&n100!=92?"two":(n10==3||n10==4||n10==9)&&(n100<10||n100>19)&&(n100<70||n100>79)&&(n100<90||n100>99)?"few":n!=0&&t0&&n1000000==0?"many":"other"},"fields":{"year":{"displayName":"bloaz","relative":{"0":"this year","1":"next year","-1":"warlene"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"miz","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"deiz","relative":{"0":"hiziv","1":"warcʼhoazh","-1":"decʼh","-2":"dercʼhent-decʼh"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"eur","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"munut","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"eilenn","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"br-FR","parentLocale":"br"});

HandlebarsIntl.__addLocaleData({"locale":"brx","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"बोसोर","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"दान","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"सान","relative":{"0":"दिनै","1":"गाबोन","-1":"मैया"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"रिंगा","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"मिनिथ","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"सेखेन्द","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"brx-IN","parentLocale":"brx"});

HandlebarsIntl.__addLocaleData({"locale":"bs","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),i100=i.slice(-2),f10=f.slice(-1),f100=f.slice(-2);if(ord)return"other";return v0&&i10==1&&i100!=11||f10==1&&f100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)||f10>=2&&f10<=4&&(f100<12||f100>14)?"few":"other"},"fields":{"year":{"displayName":"godina","relative":{"0":"ove godine","1":"sljedeće godine","-1":"prošle godine"},"relativeTime":{"future":{"one":"za {0} godinu","few":"za {0} godine","other":"za {0} godina"},"past":{"one":"prije {0} godinu","few":"prije {0} godine","other":"prije {0} godina"}}},"month":{"displayName":"mjesec","relative":{"0":"ovaj mjesec","1":"sljedeći mjesec","-1":"prošli mjesec"},"relativeTime":{"future":{"one":"za {0} mjesec","few":"za {0} mjeseca","other":"za {0} mjeseci"},"past":{"one":"prije {0} mjesec","few":"prije {0} mjeseca","other":"prije {0} mjeseci"}}},"day":{"displayName":"dan","relative":{"0":"danas","1":"sutra","2":"prekosutra","-1":"juče","-2":"prekjuče"},"relativeTime":{"future":{"one":"za {0} dan","few":"za {0} dana","other":"za {0} dana"},"past":{"one":"prije {0} dan","few":"prije {0} dana","other":"prije {0} dana"}}},"hour":{"displayName":"sat","relativeTime":{"future":{"one":"za {0} sat","few":"za {0} sata","other":"za {0} sati"},"past":{"one":"prije {0} sat","few":"prije {0} sata","other":"prije {0} sati"}}},"minute":{"displayName":"minut","relativeTime":{"future":{"one":"za {0} minutu","few":"za {0} minute","other":"za {0} minuta"},"past":{"one":"prije {0} minutu","few":"prije {0} minute","other":"prije {0} minuta"}}},"second":{"displayName":"sekund","relative":{"0":"sada"},"relativeTime":{"future":{"one":"za {0} sekundu","few":"za {0} sekunde","other":"za {0} sekundi"},"past":{"one":"prije {0} sekundu","few":"prije {0} sekunde","other":"prije {0} sekundi"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"bs-Cyrl","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"година","relative":{"0":"Ове године","1":"Следеће године","-1":"Прошле године"},"relativeTime":{"future":{"one":"за {0} годину","few":"за {0} године","other":"за {0} година"},"past":{"one":"пре {0} годину","few":"пре {0} године","other":"пре {0} година"}}},"month":{"displayName":"месец","relative":{"0":"Овог месеца","1":"Следећег месеца","-1":"Прошлог месеца"},"relativeTime":{"future":{"one":"за {0} месец","few":"за {0} месеца","other":"за {0} месеци"},"past":{"one":"пре {0} месец","few":"пре {0} месеца","other":"пре {0} месеци"}}},"day":{"displayName":"дан","relative":{"0":"данас","1":"сутра","2":"прекосутра","-1":"јуче","-2":"прекјуче"},"relativeTime":{"future":{"one":"за {0} дан","few":"за {0} дана","other":"за {0} дана"},"past":{"one":"пре {0} дан","few":"пре {0} дана","other":"пре {0} дана"}}},"hour":{"displayName":"час","relativeTime":{"future":{"one":"за {0} сат","few":"за {0} сата","other":"за {0} сати"},"past":{"one":"пре {0} сат","few":"пре {0} сата","other":"пре {0} сати"}}},"minute":{"displayName":"минут","relativeTime":{"future":{"one":"за {0} минут","few":"за {0} минута","other":"за {0} минута"},"past":{"one":"пре {0} минут","few":"пре {0} минута","other":"пре {0} минута"}}},"second":{"displayName":"секунд","relative":{"0":"now"},"relativeTime":{"future":{"one":"за {0} секунд","few":"за {0} секунде","other":"за {0} секунди"},"past":{"one":"пре {0} секунд","few":"пре {0} секунде","other":"пре {0} секунди"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"bs-Cyrl-BA","parentLocale":"bs-Cyrl"});
HandlebarsIntl.__addLocaleData({"locale":"bs-Latn","parentLocale":"bs"});
HandlebarsIntl.__addLocaleData({"locale":"bs-Latn-BA","parentLocale":"bs-Latn"});

HandlebarsIntl.__addLocaleData({"locale":"ca","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return n==1||n==3?"one":n==2?"two":n==4?"few":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"any","relative":{"0":"enguany","1":"l’any que ve","-1":"l’any passat"},"relativeTime":{"future":{"one":"d’aquí a {0} any","other":"d’aquí a {0} anys"},"past":{"one":"fa {0} any","other":"fa {0} anys"}}},"month":{"displayName":"mes","relative":{"0":"aquest mes","1":"el mes que ve","-1":"el mes passat"},"relativeTime":{"future":{"one":"d’aquí a {0} mes","other":"d’aquí a {0} mesos"},"past":{"one":"fa {0} mes","other":"fa {0} mesos"}}},"day":{"displayName":"dia","relative":{"0":"avui","1":"demà","2":"demà passat","-1":"ahir","-2":"abans-d’ahir"},"relativeTime":{"future":{"one":"d’aquí a {0} dia","other":"d’aquí a {0} dies"},"past":{"one":"fa {0} dia","other":"fa {0} dies"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"d’aquí a {0} hora","other":"d’aquí {0} hores"},"past":{"one":"fa {0} hora","other":"fa {0} hores"}}},"minute":{"displayName":"minut","relativeTime":{"future":{"one":"d’aquí a {0} minut","other":"d’aquí a {0} minuts"},"past":{"one":"fa {0} minut","other":"fa {0} minuts"}}},"second":{"displayName":"segon","relative":{"0":"ara"},"relativeTime":{"future":{"one":"d’aquí a {0} segon","other":"d’aquí a {0} segons"},"past":{"one":"fa {0} segon","other":"fa {0} segons"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ca-AD","parentLocale":"ca"});
HandlebarsIntl.__addLocaleData({"locale":"ca-ES","parentLocale":"ca"});
HandlebarsIntl.__addLocaleData({"locale":"ca-ES-VALENCIA","parentLocale":"ca-ES"});
HandlebarsIntl.__addLocaleData({"locale":"ca-FR","parentLocale":"ca"});
HandlebarsIntl.__addLocaleData({"locale":"ca-IT","parentLocale":"ca"});

HandlebarsIntl.__addLocaleData({"locale":"cgg","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Omwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Omwezi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Eizooba","relative":{"0":"Erizooba","1":"Nyenkyakare","-1":"Nyomwabazyo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Shaaha","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Edakiika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Obucweka\u002FEsekendi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"cgg-UG","parentLocale":"cgg"});

HandlebarsIntl.__addLocaleData({"locale":"chr","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"ᏑᏕᏘᏴᏓ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"ᏏᏅᏓ","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"ᏏᎦ","relative":{"0":"ᎪᎯ ᎢᎦ","1":"ᏌᎾᎴᎢ","-1":"ᏒᎯ"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"ᏑᏣᎶᏓ","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"ᎢᏯᏔᏬᏍᏔᏅ","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"ᎠᏎᏢ","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"chr-US","parentLocale":"chr"});

HandlebarsIntl.__addLocaleData({"locale":"ckb","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"cs","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1];if(ord)return"other";return n==1&&v0?"one":i>=2&&i<=4&&v0?"few":!v0?"many":"other"},"fields":{"year":{"displayName":"Rok","relative":{"0":"tento rok","1":"příští rok","-1":"minulý rok"},"relativeTime":{"future":{"one":"za {0} rok","few":"za {0} roky","many":"za {0} roku","other":"za {0} let"},"past":{"one":"před {0} rokem","few":"před {0} lety","many":"před {0} rokem","other":"před {0} lety"}}},"month":{"displayName":"Měsíc","relative":{"0":"tento měsíc","1":"příští měsíc","-1":"minulý měsíc"},"relativeTime":{"future":{"one":"za {0} měsíc","few":"za {0} měsíce","many":"za {0} měsíce","other":"za {0} měsíců"},"past":{"one":"před {0} měsícem","few":"před {0} měsíci","many":"před {0} měsícem","other":"před {0} měsíci"}}},"day":{"displayName":"Den","relative":{"0":"dnes","1":"zítra","2":"pozítří","-1":"včera","-2":"předevčírem"},"relativeTime":{"future":{"one":"za {0} den","few":"za {0} dny","many":"za {0} dne","other":"za {0} dní"},"past":{"one":"před {0} dnem","few":"před {0} dny","many":"před {0} dnem","other":"před {0} dny"}}},"hour":{"displayName":"Hodina","relativeTime":{"future":{"one":"za {0} hodinu","few":"za {0} hodiny","many":"za {0} hodiny","other":"za {0} hodin"},"past":{"one":"před {0} hodinou","few":"před {0} hodinami","many":"před {0} hodinou","other":"před {0} hodinami"}}},"minute":{"displayName":"Minuta","relativeTime":{"future":{"one":"za {0} minutu","few":"za {0} minuty","many":"za {0} minuty","other":"za {0} minut"},"past":{"one":"před {0} minutou","few":"před {0} minutami","many":"před {0} minutou","other":"před {0} minutami"}}},"second":{"displayName":"Sekunda","relative":{"0":"nyní"},"relativeTime":{"future":{"one":"za {0} sekundu","few":"za {0} sekundy","many":"za {0} sekundy","other":"za {0} sekund"},"past":{"one":"před {0} sekundou","few":"před {0} sekundami","many":"před {0} sekundou","other":"před {0} sekundami"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"cs-CZ","parentLocale":"cs"});

HandlebarsIntl.__addLocaleData({"locale":"cy","pluralRuleFunction":function (n,ord){if(ord)return n==0||n==7||n==8||n==9?"zero":n==1?"one":n==2?"two":n==3||n==4?"few":n==5||n==6?"many":"other";return n==0?"zero":n==1?"one":n==2?"two":n==3?"few":n==6?"many":"other"},"fields":{"year":{"displayName":"Blwyddyn","relative":{"0":"eleni","1":"blwyddyn nesaf","-1":"llynedd"},"relativeTime":{"future":{"zero":"Ymhen {0} mlynedd","one":"Ymhen blwyddyn","two":"Ymhen {0} flynedd","few":"Ymhen {0} blynedd","many":"Ymhen {0} blynedd","other":"Ymhen {0} mlynedd"},"past":{"zero":"{0} o flynyddoedd yn ôl","one":"blwyddyn yn ôl","two":"{0} flynedd yn ôl","few":"{0} blynedd yn ôl","many":"{0} blynedd yn ôl","other":"{0} o flynyddoedd yn ôl"}}},"month":{"displayName":"Mis","relative":{"0":"y mis hwn","1":"mis nesaf","-1":"mis diwethaf"},"relativeTime":{"future":{"zero":"Ymhen {0} mis","one":"Ymhen mis","two":"Ymhen deufis","few":"Ymhen {0} mis","many":"Ymhen {0} mis","other":"Ymhen {0} mis"},"past":{"zero":"{0} mis yn ôl","one":"{0} mis yn ôl","two":"{0} fis yn ôl","few":"{0} mis yn ôl","many":"{0} mis yn ôl","other":"{0} mis yn ôl"}}},"day":{"displayName":"Dydd","relative":{"0":"heddiw","1":"yfory","2":"drennydd","-1":"ddoe","-2":"echdoe"},"relativeTime":{"future":{"zero":"Ymhen {0} diwrnod","one":"Ymhen diwrnod","two":"Ymhen deuddydd","few":"Ymhen tridiau","many":"Ymhen {0} diwrnod","other":"Ymhen {0} diwrnod"},"past":{"zero":"{0} diwrnod yn ôl","one":"{0} diwrnod yn ôl","two":"{0} ddiwrnod yn ôl","few":"{0} diwrnod yn ôl","many":"{0} diwrnod yn ôl","other":"{0} diwrnod yn ôl"}}},"hour":{"displayName":"Awr","relativeTime":{"future":{"zero":"Ymhen {0} awr","one":"Ymhen {0} awr","two":"Ymhen {0} awr","few":"Ymhen {0} awr","many":"Ymhen {0} awr","other":"Ymhen {0} awr"},"past":{"zero":"{0} awr yn ôl","one":"awr yn ôl","two":"{0} awr yn ôl","few":"{0} awr yn ôl","many":"{0} awr yn ôl","other":"{0} awr yn ôl"}}},"minute":{"displayName":"Munud","relativeTime":{"future":{"zero":"Ymhen {0} munud","one":"Ymhen munud","two":"Ymhen {0} funud","few":"Ymhen {0} munud","many":"Ymhen {0} munud","other":"Ymhen {0} munud"},"past":{"zero":"{0} munud yn ôl","one":"{0} munud yn ôl","two":"{0} funud yn ôl","few":"{0} munud yn ôl","many":"{0} munud yn ôl","other":"{0} munud yn ôl"}}},"second":{"displayName":"Eiliad","relative":{"0":"nawr"},"relativeTime":{"future":{"zero":"Ymhen {0} eiliad","one":"Ymhen eiliad","two":"Ymhen {0} eiliad","few":"Ymhen {0} eiliad","many":"Ymhen {0} eiliad","other":"Ymhen {0} eiliad"},"past":{"zero":"{0} eiliad yn ôl","one":"eiliad yn ôl","two":"{0} eiliad yn ôl","few":"{0} eiliad yn ôl","many":"{0} eiliad yn ôl","other":"{0} eiliad yn ôl"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"cy-GB","parentLocale":"cy"});

HandlebarsIntl.__addLocaleData({"locale":"da","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],t0=Number(s[0])==n;if(ord)return"other";return n==1||!t0&&(i==0||i==1)?"one":"other"},"fields":{"year":{"displayName":"År","relative":{"0":"i år","1":"næste år","-1":"sidste år"},"relativeTime":{"future":{"one":"om {0} år","other":"om {0} år"},"past":{"one":"for {0} år siden","other":"for {0} år siden"}}},"month":{"displayName":"Måned","relative":{"0":"denne måned","1":"næste måned","-1":"sidste måned"},"relativeTime":{"future":{"one":"om {0} måned","other":"om {0} måneder"},"past":{"one":"for {0} måned siden","other":"for {0} måneder siden"}}},"day":{"displayName":"Dag","relative":{"0":"i dag","1":"i morgen","2":"i overmorgen","-1":"i går","-2":"i forgårs"},"relativeTime":{"future":{"one":"om {0} dag","other":"om {0} dage"},"past":{"one":"for {0} dag siden","other":"for {0} dage siden"}}},"hour":{"displayName":"Time","relativeTime":{"future":{"one":"om {0} time","other":"om {0} timer"},"past":{"one":"for {0} time siden","other":"for {0} timer siden"}}},"minute":{"displayName":"Minut","relativeTime":{"future":{"one":"om {0} minut","other":"om {0} minutter"},"past":{"one":"for {0} minut siden","other":"for {0} minutter siden"}}},"second":{"displayName":"Sekund","relative":{"0":"nu"},"relativeTime":{"future":{"one":"om {0} sekund","other":"om {0} sekunder"},"past":{"one":"for {0} sekund siden","other":"for {0} sekunder siden"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"da-DK","parentLocale":"da"});
HandlebarsIntl.__addLocaleData({"locale":"da-GL","parentLocale":"da"});

HandlebarsIntl.__addLocaleData({"locale":"dav","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Mwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mori","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ituku","relative":{"0":"Idime","1":"Kesho","-1":"Iguo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"dav-KE","parentLocale":"dav"});

HandlebarsIntl.__addLocaleData({"locale":"de","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Jahr","relative":{"0":"dieses Jahr","1":"nächstes Jahr","-1":"letztes Jahr"},"relativeTime":{"future":{"one":"in {0} Jahr","other":"in {0} Jahren"},"past":{"one":"vor {0} Jahr","other":"vor {0} Jahren"}}},"month":{"displayName":"Monat","relative":{"0":"diesen Monat","1":"nächsten Monat","-1":"letzten Monat"},"relativeTime":{"future":{"one":"in {0} Monat","other":"in {0} Monaten"},"past":{"one":"vor {0} Monat","other":"vor {0} Monaten"}}},"day":{"displayName":"Tag","relative":{"0":"heute","1":"morgen","2":"übermorgen","-1":"gestern","-2":"vorgestern"},"relativeTime":{"future":{"one":"in {0} Tag","other":"in {0} Tagen"},"past":{"one":"vor {0} Tag","other":"vor {0} Tagen"}}},"hour":{"displayName":"Stunde","relativeTime":{"future":{"one":"in {0} Stunde","other":"in {0} Stunden"},"past":{"one":"vor {0} Stunde","other":"vor {0} Stunden"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"one":"in {0} Minute","other":"in {0} Minuten"},"past":{"one":"vor {0} Minute","other":"vor {0} Minuten"}}},"second":{"displayName":"Sekunde","relative":{"0":"jetzt"},"relativeTime":{"future":{"one":"in {0} Sekunde","other":"in {0} Sekunden"},"past":{"one":"vor {0} Sekunde","other":"vor {0} Sekunden"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"de-AT","parentLocale":"de"});
HandlebarsIntl.__addLocaleData({"locale":"de-BE","parentLocale":"de"});
HandlebarsIntl.__addLocaleData({"locale":"de-CH","parentLocale":"de"});
HandlebarsIntl.__addLocaleData({"locale":"de-DE","parentLocale":"de"});
HandlebarsIntl.__addLocaleData({"locale":"de-LI","parentLocale":"de"});
HandlebarsIntl.__addLocaleData({"locale":"de-LU","parentLocale":"de"});

HandlebarsIntl.__addLocaleData({"locale":"dje","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Jiiri","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Handu","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Zaari","relative":{"0":"Hõo","1":"Suba","-1":"Bi"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Guuru","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Miniti","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Miti","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"dje-NE","parentLocale":"dje"});

HandlebarsIntl.__addLocaleData({"locale":"dsb","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i100=i.slice(-2),f100=f.slice(-2);if(ord)return"other";return v0&&i100==1||f100==1?"one":v0&&i100==2||f100==2?"two":v0&&(i100==3||i100==4)||(f100==3||f100==4)?"few":"other"},"fields":{"year":{"displayName":"lěto","relative":{"0":"lětosa","1":"znowa","-1":"łoni"},"relativeTime":{"future":{"one":"za {0} lěto","two":"za {0} lěśe","few":"za {0} lěta","other":"za {0} lět"},"past":{"one":"pśed {0} lětom","two":"pśed {0} lětoma","few":"pśed {0} lětami","other":"pśed {0} lětami"}}},"month":{"displayName":"mjasec","relative":{"0":"ten mjasec","1":"pśiducy mjasec","-1":"slědny mjasec"},"relativeTime":{"future":{"one":"za {0} mjasec","two":"za {0} mjaseca","few":"za {0} mjasecy","other":"za {0} mjasecow"},"past":{"one":"pśed {0} mjasecom","two":"pśed {0} mjasecoma","few":"pśed {0} mjasecami","other":"pśed {0} mjasecami"}}},"day":{"displayName":"źeń","relative":{"0":"źinsa","1":"witśe","-1":"cora"},"relativeTime":{"future":{"one":"za {0} źeń","two":"za {0} dnja","few":"za {0} dny","other":"za {0} dnjow"},"past":{"one":"pśed {0} dnjom","two":"pśed {0} dnjoma","few":"pśed {0} dnjami","other":"pśed {0} dnjami"}}},"hour":{"displayName":"góźina","relativeTime":{"future":{"one":"za {0} góźinu","two":"za {0} góźinje","few":"za {0} góźiny","other":"za {0} góźin"},"past":{"one":"pśed {0} góźinu","two":"pśed {0} góźinoma","few":"pśed {0} góźinami","other":"pśed {0} góźinami"}}},"minute":{"displayName":"minuta","relativeTime":{"future":{"one":"za {0} minutu","two":"za {0} minuśe","few":"za {0} minuty","other":"za {0} minutow"},"past":{"one":"pśed {0} minutu","two":"pśed {0} minutoma","few":"pśed {0} minutami","other":"pśed {0} minutami"}}},"second":{"displayName":"sekunda","relative":{"0":"now"},"relativeTime":{"future":{"one":"za {0} sekundu","two":"za {0} sekunźe","few":"za {0} sekundy","other":"za {0} sekundow"},"past":{"one":"pśed {0} sekundu","two":"pśed {0} sekundoma","few":"pśed {0} sekundami","other":"pśed {0} sekundami"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"dsb-DE","parentLocale":"dsb"});

HandlebarsIntl.__addLocaleData({"locale":"dua","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"mbú","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"mɔ́di","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"búnyá","relative":{"0":"wɛ́ŋgɛ̄","1":"kíɛlɛ","-1":"kíɛlɛ nítómb́í"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"ŋgandɛ","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"ndɔkɔ","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"píndí","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"dua-CM","parentLocale":"dua"});

HandlebarsIntl.__addLocaleData({"locale":"dv","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"dyo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Emit","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Fuleeŋ","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Funak","relative":{"0":"Jaat","1":"Kajom","-1":"Fucen"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"dyo-SN","parentLocale":"dyo"});

HandlebarsIntl.__addLocaleData({"locale":"dz","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"ལོ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"ལོ་འཁོར་ {0} ནང་"},"past":{"other":"ལོ་འཁོར་ {0} ཧེ་མ་"}}},"month":{"displayName":"ཟླ་ཝ་","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"ཟླཝ་ {0} ནང་"},"past":{"other":"ཟླཝ་ {0} ཧེ་མ་"}}},"day":{"displayName":"ཚེས་","relative":{"0":"ད་རིས་","1":"ནངས་པ་","2":"གནངས་ཚེ","-1":"ཁ་ཙ་","-2":"ཁ་ཉིམ"},"relativeTime":{"future":{"other":"ཉིནམ་ {0} ནང་"},"past":{"other":"ཉིནམ་ {0} ཧེ་མ་"}}},"hour":{"displayName":"ཆུ་ཚོད","relativeTime":{"future":{"other":"ཆུ་ཚོད་ {0} ནང་"},"past":{"other":"ཆུ་ཚོད་ {0} ཧེ་མ་"}}},"minute":{"displayName":"སྐར་མ","relativeTime":{"future":{"other":"སྐར་མ་ {0} ནང་"},"past":{"other":"སྐར་མ་ {0} ཧེ་མ་"}}},"second":{"displayName":"སྐར་ཆཱ་","relative":{"0":"now"},"relativeTime":{"future":{"other":"སྐར་ཆ་ {0} ནང་"},"past":{"other":"སྐར་ཆ་ {0} ཧེ་མ་"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"dz-BT","parentLocale":"dz"});

HandlebarsIntl.__addLocaleData({"locale":"ebu","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Mwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mweri","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Mũthenya","relative":{"0":"Ũmũnthĩ","1":"Rũciũ","-1":"Ĩgoro"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Ithaa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Ndagĩka","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekondi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ebu-KE","parentLocale":"ebu"});

HandlebarsIntl.__addLocaleData({"locale":"ee","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"ƒe","relative":{"0":"ƒe sia","1":"ƒe si gbɔ na","-1":"ƒe si va yi"},"relativeTime":{"future":{"one":"le ƒe {0} me","other":"le ƒe {0} wo me"},"past":{"one":"ƒe {0} si va yi","other":"ƒe {0} si wo va yi"}}},"month":{"displayName":"ɣleti","relative":{"0":"ɣleti sia","1":"ɣleti si gbɔ na","-1":"ɣleti si va yi"},"relativeTime":{"future":{"one":"le ɣleti {0} me","other":"le ɣleti {0} wo me"},"past":{"one":"ɣleti {0} si va yi","other":"ɣleti {0} si wo va yi"}}},"day":{"displayName":"ŋkeke","relative":{"0":"egbe","1":"etsɔ si gbɔna","2":"nyitsɔ si gbɔna","-1":"etsɔ si va yi","-2":"nyitsɔ si va yi"},"relativeTime":{"future":{"one":"le ŋkeke {0} me","other":"le ŋkeke {0} wo me"},"past":{"one":"ŋkeke {0} si va yi","other":"ŋkeke {0} si wo va yi"}}},"hour":{"displayName":"gaƒoƒo","relativeTime":{"future":{"one":"le gaƒoƒo {0} me","other":"le gaƒoƒo {0} wo me"},"past":{"one":"gaƒoƒo {0} si va yi","other":"gaƒoƒo {0} si wo va yi"}}},"minute":{"displayName":"aɖabaƒoƒo","relativeTime":{"future":{"one":"le aɖabaƒoƒo {0} me","other":"le aɖabaƒoƒo {0} wo me"},"past":{"one":"aɖabaƒoƒo {0} si va yi","other":"aɖabaƒoƒo {0} si wo va yi"}}},"second":{"displayName":"sekend","relative":{"0":"fifi"},"relativeTime":{"future":{"one":"le sekend {0} me","other":"le sekend {0} wo me"},"past":{"one":"sekend {0} si va yi","other":"sekend {0} si wo va yi"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ee-GH","parentLocale":"ee"});
HandlebarsIntl.__addLocaleData({"locale":"ee-TG","parentLocale":"ee"});

HandlebarsIntl.__addLocaleData({"locale":"el","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Έτος","relative":{"0":"φέτος","1":"επόμενο έτος","-1":"προηγούμενο έτος"},"relativeTime":{"future":{"one":"σε {0} έτος","other":"σε {0} έτη"},"past":{"one":"πριν από {0} έτος","other":"πριν από {0} έτη"}}},"month":{"displayName":"Μήνας","relative":{"0":"τρέχων μήνας","1":"επόμενος μήνας","-1":"προηγούμενος μήνας"},"relativeTime":{"future":{"one":"σε {0} μήνα","other":"σε {0} μήνες"},"past":{"one":"πριν από {0} μήνα","other":"πριν από {0} μήνες"}}},"day":{"displayName":"Ημέρα","relative":{"0":"σήμερα","1":"αύριο","2":"μεθαύριο","-1":"χθες","-2":"προχθές"},"relativeTime":{"future":{"one":"σε {0} ημέρα","other":"σε {0} ημέρες"},"past":{"one":"πριν από {0} ημέρα","other":"πριν από {0} ημέρες"}}},"hour":{"displayName":"Ώρα","relativeTime":{"future":{"one":"σε {0} ώρα","other":"σε {0} ώρες"},"past":{"one":"πριν από {0} ώρα","other":"πριν από {0} ώρες"}}},"minute":{"displayName":"Λεπτό","relativeTime":{"future":{"one":"σε {0} λεπτό","other":"σε {0} λεπτά"},"past":{"one":"πριν από {0} λεπτό","other":"πριν από {0} λεπτά"}}},"second":{"displayName":"Δευτερόλεπτο","relative":{"0":"τώρα"},"relativeTime":{"future":{"one":"σε {0} δευτερόλεπτο","other":"σε {0} δευτερόλεπτα"},"past":{"one":"πριν από {0} δευτερόλεπτο","other":"πριν από {0} δευτερόλεπτα"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"el-CY","parentLocale":"el"});
HandlebarsIntl.__addLocaleData({"locale":"el-GR","parentLocale":"el"});

HandlebarsIntl.__addLocaleData({"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"in {0} year","other":"in {0} years"},"past":{"one":"{0} year ago","other":"{0} years ago"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"in {0} month","other":"in {0} months"},"past":{"one":"{0} month ago","other":"{0} months ago"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"one":"in {0} hour","other":"in {0} hours"},"past":{"one":"{0} hour ago","other":"{0} hours ago"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"one":"in {0} minute","other":"in {0} minutes"},"past":{"one":"{0} minute ago","other":"{0} minutes ago"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} second","other":"in {0} seconds"},"past":{"one":"{0} second ago","other":"{0} seconds ago"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"en-001","parentLocale":"en"});
HandlebarsIntl.__addLocaleData({"locale":"en-150","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-GB","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-AG","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-AI","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-AS","parentLocale":"en"});
HandlebarsIntl.__addLocaleData({"locale":"en-AU","parentLocale":"en-GB","fields":{"year":{"displayName":"Year","relative":{"0":"This year","1":"Next year","-1":"Last year"},"relativeTime":{"future":{"one":"in {0} year","other":"in {0} years"},"past":{"one":"{0} year ago","other":"{0} years ago"}}},"month":{"displayName":"Month","relative":{"0":"This month","1":"Next month","-1":"Last month"},"relativeTime":{"future":{"one":"in {0} month","other":"in {0} months"},"past":{"one":"{0} month ago","other":"{0} months ago"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"one":"in {0} hour","other":"in {0} hours"},"past":{"one":"{0} hour ago","other":"{0} hours ago"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"one":"in {0} minute","other":"in {0} minutes"},"past":{"one":"{0} minute ago","other":"{0} minutes ago"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} second","other":"in {0} seconds"},"past":{"one":"{0} second ago","other":"{0} seconds ago"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"en-BB","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-BE","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-BM","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-BS","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-BW","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-BZ","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-CA","parentLocale":"en"});
HandlebarsIntl.__addLocaleData({"locale":"en-CC","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-CK","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-CM","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-CX","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-DG","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-DM","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-Dsrt","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"en-ER","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-FJ","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-FK","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-FM","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-GD","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-GG","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-GH","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-GI","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-GM","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-GU","parentLocale":"en"});
HandlebarsIntl.__addLocaleData({"locale":"en-GY","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-HK","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-IE","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-IM","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-IN","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-IO","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-JE","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-JM","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-KE","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-KI","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-KN","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-KY","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-LC","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-LR","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-LS","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-MG","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-MH","parentLocale":"en"});
HandlebarsIntl.__addLocaleData({"locale":"en-MO","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-MP","parentLocale":"en"});
HandlebarsIntl.__addLocaleData({"locale":"en-MS","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-MT","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-MU","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-MW","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-MY","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-NA","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-NF","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-NG","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-NR","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-NU","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-NZ","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-PG","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-PH","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-PK","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-PN","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-PR","parentLocale":"en"});
HandlebarsIntl.__addLocaleData({"locale":"en-PW","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-RW","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-SB","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-SC","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-SD","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-SG","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-SH","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-SL","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-SS","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-SX","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-SZ","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-TC","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-TK","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-TO","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-TT","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-TV","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-TZ","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-UG","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-UM","parentLocale":"en"});
HandlebarsIntl.__addLocaleData({"locale":"en-US","parentLocale":"en"});
HandlebarsIntl.__addLocaleData({"locale":"en-US-POSIX","parentLocale":"en-US"});
HandlebarsIntl.__addLocaleData({"locale":"en-VC","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-VG","parentLocale":"en-GB"});
HandlebarsIntl.__addLocaleData({"locale":"en-VI","parentLocale":"en"});
HandlebarsIntl.__addLocaleData({"locale":"en-VU","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-WS","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-ZA","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-ZM","parentLocale":"en-001"});
HandlebarsIntl.__addLocaleData({"locale":"en-ZW","parentLocale":"en-001"});

HandlebarsIntl.__addLocaleData({"locale":"eo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"jaro","relative":{"0":"nuna jaro","1":"venonta jaro","-1":"pasinta jaro"},"relativeTime":{"future":{"one":"post {0} jaro","other":"post {0} jaroj"},"past":{"one":"antaŭ {0} jaro","other":"antaŭ {0} jaroj"}}},"month":{"displayName":"monato","relative":{"0":"nuna monato","1":"venonta monato","-1":"pasinta monato"},"relativeTime":{"future":{"one":"post {0} monato","other":"post {0} monatoj"},"past":{"one":"antaŭ {0} monato","other":"antaŭ {0} monatoj"}}},"day":{"displayName":"tago","relative":{"0":"hodiaŭ","1":"morgaŭ","-1":"hieraŭ"},"relativeTime":{"future":{"one":"post {0} tago","other":"post {0} tagoj"},"past":{"one":"antaŭ {0} tago","other":"antaŭ {0} tagoj"}}},"hour":{"displayName":"horo","relativeTime":{"future":{"one":"post {0} horo","other":"post {0} horoj"},"past":{"one":"antaŭ {0} horo","other":"antaŭ {0} horoj"}}},"minute":{"displayName":"minuto","relativeTime":{"future":{"one":"post {0} minuto","other":"post {0} minutoj"},"past":{"one":"antaŭ {0} minuto","other":"antaŭ {0} minutoj"}}},"second":{"displayName":"sekundo","relative":{"0":"now"},"relativeTime":{"future":{"one":"post {0} sekundo","other":"post {0} sekundoj"},"past":{"one":"antaŭ {0} sekundo","other":"antaŭ {0} sekundoj"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"eo-001","parentLocale":"eo"});

HandlebarsIntl.__addLocaleData({"locale":"es","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Año","relative":{"0":"este año","1":"el próximo año","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"Mes","relative":{"0":"este mes","1":"el próximo mes","-1":"el mes pasado"},"relativeTime":{"future":{"one":"dentro de {0} mes","other":"dentro de {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"Día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-1":"ayer","-2":"antes de ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"es-419","parentLocale":"es","fields":{"year":{"displayName":"Año","relative":{"0":"Este año","1":"Año próximo","-1":"Año pasado"},"relativeTime":{"future":{"one":"En {0} año","other":"En {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"Mes","relative":{"0":"Este mes","1":"Mes próximo","-1":"El mes pasado"},"relativeTime":{"future":{"one":"En {0} mes","other":"En {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"Día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-1":"ayer","-2":"antes de ayer"},"relativeTime":{"future":{"one":"En {0} día","other":"En {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"one":"En {0} hora","other":"En {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"En {0} minuto","other":"En {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"En {0} segundo","other":"En {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"es-AR","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-BO","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-CL","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-CO","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-CR","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-CU","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-DO","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-EA","parentLocale":"es"});
HandlebarsIntl.__addLocaleData({"locale":"es-EC","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-ES","parentLocale":"es"});
HandlebarsIntl.__addLocaleData({"locale":"es-GQ","parentLocale":"es"});
HandlebarsIntl.__addLocaleData({"locale":"es-GT","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-HN","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-IC","parentLocale":"es"});
HandlebarsIntl.__addLocaleData({"locale":"es-MX","parentLocale":"es-419","fields":{"year":{"displayName":"Año","relative":{"0":"este año","1":"el año próximo","-1":"el año pasado"},"relativeTime":{"future":{"one":"En {0} año","other":"En {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"Mes","relative":{"0":"este mes","1":"el mes próximo","-1":"el mes pasado"},"relativeTime":{"future":{"one":"en {0} mes","other":"en {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"Día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-1":"ayer","-2":"antes de ayer"},"relativeTime":{"future":{"one":"En {0} día","other":"En {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"one":"En {0} hora","other":"En {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"En {0} minuto","other":"En {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"En {0} segundo","other":"En {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"es-NI","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-PA","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-PE","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-PH","parentLocale":"es"});
HandlebarsIntl.__addLocaleData({"locale":"es-PR","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-PY","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-SV","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-US","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-UY","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-VE","parentLocale":"es-419"});

HandlebarsIntl.__addLocaleData({"locale":"et","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"aasta","relative":{"0":"käesolev aasta","1":"järgmine aasta","-1":"eelmine aasta"},"relativeTime":{"future":{"one":"{0} aasta pärast","other":"{0} aasta pärast"},"past":{"one":"{0} aasta eest","other":"{0} aasta eest"}}},"month":{"displayName":"kuu","relative":{"0":"käesolev kuu","1":"järgmine kuu","-1":"eelmine kuu"},"relativeTime":{"future":{"one":"{0} kuu pärast","other":"{0} kuu pärast"},"past":{"one":"{0} kuu eest","other":"{0} kuu eest"}}},"day":{"displayName":"päev","relative":{"0":"täna","1":"homme","2":"ülehomme","-1":"eile","-2":"üleeile"},"relativeTime":{"future":{"one":"{0} päeva pärast","other":"{0} päeva pärast"},"past":{"one":"{0} päeva eest","other":"{0} päeva eest"}}},"hour":{"displayName":"tund","relativeTime":{"future":{"one":"{0} tunni pärast","other":"{0} tunni pärast"},"past":{"one":"{0} tunni eest","other":"{0} tunni eest"}}},"minute":{"displayName":"minut","relativeTime":{"future":{"one":"{0} minuti pärast","other":"{0} minuti pärast"},"past":{"one":"{0} minuti eest","other":"{0} minuti eest"}}},"second":{"displayName":"sekund","relative":{"0":"nüüd"},"relativeTime":{"future":{"one":"{0} sekundi pärast","other":"{0} sekundi pärast"},"past":{"one":"{0} sekundi eest","other":"{0} sekundi eest"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"et-EE","parentLocale":"et"});

HandlebarsIntl.__addLocaleData({"locale":"eu","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Urtea","relative":{"0":"aurten","1":"hurrengo urtea","-1":"aurreko urtea"},"relativeTime":{"future":{"one":"{0} urte barru","other":"{0} urte barru"},"past":{"one":"Duela {0} urte","other":"Duela {0} urte"}}},"month":{"displayName":"Hilabetea","relative":{"0":"hilabete hau","1":"hurrengo hilabetea","-1":"aurreko hilabetea"},"relativeTime":{"future":{"one":"{0} hilabete barru","other":"{0} hilabete barru"},"past":{"one":"Duela {0} hilabete","other":"Duela {0} hilabete"}}},"day":{"displayName":"Eguna","relative":{"0":"gaur","1":"bihar","2":"etzi","-1":"atzo","-2":"herenegun"},"relativeTime":{"future":{"one":"{0} egun barru","other":"{0} egun barru"},"past":{"one":"Duela {0} egun","other":"Duela {0} egun"}}},"hour":{"displayName":"Ordua","relativeTime":{"future":{"one":"{0} ordu barru","other":"{0} ordu barru"},"past":{"one":"Duela {0} ordu","other":"Duela {0} ordu"}}},"minute":{"displayName":"Minutua","relativeTime":{"future":{"one":"{0} minutu barru","other":"{0} minutu barru"},"past":{"one":"Duela {0} minutu","other":"Duela {0} minutu"}}},"second":{"displayName":"Segundoa","relative":{"0":"orain"},"relativeTime":{"future":{"one":"{0} segundo barru","other":"{0} segundo barru"},"past":{"one":"Duela {0} segundo","other":"Duela {0} segundo"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"eu-ES","parentLocale":"eu"});

HandlebarsIntl.__addLocaleData({"locale":"ewo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"M̀bú","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Ngɔn","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Amǒs","relative":{"0":"Aná","1":"Okírí","-1":"Angogé"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Awola","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Enútɛn","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Akábəga","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ewo-CM","parentLocale":"ewo"});

HandlebarsIntl.__addLocaleData({"locale":"fa","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<=1?"one":"other"},"fields":{"year":{"displayName":"سال","relative":{"0":"امسال","1":"سال آینده","-1":"سال گذشته"},"relativeTime":{"future":{"one":"{0} سال بعد","other":"{0} سال بعد"},"past":{"one":"{0} سال پیش","other":"{0} سال پیش"}}},"month":{"displayName":"ماه","relative":{"0":"این ماه","1":"ماه آینده","-1":"ماه گذشته"},"relativeTime":{"future":{"one":"{0} ماه بعد","other":"{0} ماه بعد"},"past":{"one":"{0} ماه پیش","other":"{0} ماه پیش"}}},"day":{"displayName":"روز","relative":{"0":"امروز","1":"فردا","2":"پس‌فردا","-1":"دیروز","-2":"پریروز"},"relativeTime":{"future":{"one":"{0} روز بعد","other":"{0} روز بعد"},"past":{"one":"{0} روز پیش","other":"{0} روز پیش"}}},"hour":{"displayName":"ساعت","relativeTime":{"future":{"one":"{0} ساعت بعد","other":"{0} ساعت بعد"},"past":{"one":"{0} ساعت پیش","other":"{0} ساعت پیش"}}},"minute":{"displayName":"دقیقه","relativeTime":{"future":{"one":"{0} دقیقه بعد","other":"{0} دقیقه بعد"},"past":{"one":"{0} دقیقه پیش","other":"{0} دقیقه پیش"}}},"second":{"displayName":"ثانیه","relative":{"0":"اکنون"},"relativeTime":{"future":{"one":"{0} ثانیه بعد","other":"{0} ثانیه بعد"},"past":{"one":"{0} ثانیه پیش","other":"{0} ثانیه پیش"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"fa-AF","parentLocale":"fa"});
HandlebarsIntl.__addLocaleData({"locale":"fa-IR","parentLocale":"fa"});

HandlebarsIntl.__addLocaleData({"locale":"ff","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<2?"one":"other"},"fields":{"year":{"displayName":"Hitaande","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Lewru","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ñalnde","relative":{"0":"Hannde","1":"Jaŋngo","-1":"Haŋki"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Waktu","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Hoƴom","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Majaango","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ff-CM","parentLocale":"ff"});
HandlebarsIntl.__addLocaleData({"locale":"ff-GN","parentLocale":"ff"});
HandlebarsIntl.__addLocaleData({"locale":"ff-MR","parentLocale":"ff"});
HandlebarsIntl.__addLocaleData({"locale":"ff-SN","parentLocale":"ff"});

HandlebarsIntl.__addLocaleData({"locale":"fi","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"vuosi","relative":{"0":"tänä vuonna","1":"ensi vuonna","-1":"viime vuonna"},"relativeTime":{"future":{"one":"{0} vuoden päästä","other":"{0} vuoden päästä"},"past":{"one":"{0} vuosi sitten","other":"{0} vuotta sitten"}}},"month":{"displayName":"kuukausi","relative":{"0":"tässä kuussa","1":"ensi kuussa","-1":"viime kuussa"},"relativeTime":{"future":{"one":"{0} kuukauden päästä","other":"{0} kuukauden päästä"},"past":{"one":"{0} kuukausi sitten","other":"{0} kuukautta sitten"}}},"day":{"displayName":"päivä","relative":{"0":"tänään","1":"huomenna","2":"ylihuomenna","-1":"eilen","-2":"toissa päivänä"},"relativeTime":{"future":{"one":"{0} päivän päästä","other":"{0} päivän päästä"},"past":{"one":"{0} päivä sitten","other":"{0} päivää sitten"}}},"hour":{"displayName":"tunti","relativeTime":{"future":{"one":"{0} tunnin päästä","other":"{0} tunnin päästä"},"past":{"one":"{0} tunti sitten","other":"{0} tuntia sitten"}}},"minute":{"displayName":"minuutti","relativeTime":{"future":{"one":"{0} minuutin päästä","other":"{0} minuutin päästä"},"past":{"one":"{0} minuutti sitten","other":"{0} minuuttia sitten"}}},"second":{"displayName":"sekunti","relative":{"0":"nyt"},"relativeTime":{"future":{"one":"{0} sekunnin päästä","other":"{0} sekunnin päästä"},"past":{"one":"{0} sekunti sitten","other":"{0} sekuntia sitten"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"fi-FI","parentLocale":"fi"});

HandlebarsIntl.__addLocaleData({"locale":"fil","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),f10=f.slice(-1);if(ord)return n==1?"one":"other";return v0&&(i==1||i==2||i==3)||v0&&i10!=4&&i10!=6&&i10!=9||!v0&&f10!=4&&f10!=6&&f10!=9?"one":"other"},"fields":{"year":{"displayName":"Taon","relative":{"0":"ngayong taon","1":"susunod na taon","-1":"nakaraang taon"},"relativeTime":{"future":{"one":"sa {0} taon","other":"sa {0} (na) taon"},"past":{"one":"{0} taon ang nakalipas","other":"{0} (na) taon ang nakalipas"}}},"month":{"displayName":"Buwan","relative":{"0":"ngayong buwan","1":"susunod na buwan","-1":"nakaraang buwan"},"relativeTime":{"future":{"one":"sa {0} buwan","other":"sa {0} (na) buwan"},"past":{"one":"{0} buwan ang nakalipas","other":"{0} (na) buwan ang nakalipas"}}},"day":{"displayName":"Araw","relative":{"0":"ngayong araw","1":"bukas","2":"Samakalawa","-1":"kahapon","-2":"Araw bago ang kahapon"},"relativeTime":{"future":{"one":"sa {0} araw","other":"sa {0} (na) araw"},"past":{"one":"{0} araw ang nakalipas","other":"{0} (na) araw ang nakalipas"}}},"hour":{"displayName":"Oras","relativeTime":{"future":{"one":"sa {0} oras","other":"sa {0} (na) oras"},"past":{"one":"{0} oras ang nakalipas","other":"{0} (na) oras ang nakalipas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"sa {0} minuto","other":"sa {0} (na) minuto"},"past":{"one":"{0} minuto ang nakalipas","other":"sa {0} (na) minuto"}}},"second":{"displayName":"Segundo","relative":{"0":"ngayon"},"relativeTime":{"future":{"one":"sa {0} segundo","other":"sa {0} (na) segundo"},"past":{"one":"{0} segundo ang nakalipas","other":"{0} (na) segundo ang nakalipas"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"fil-PH","parentLocale":"fil"});

HandlebarsIntl.__addLocaleData({"locale":"fo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"ár","relative":{"0":"hetta ár","1":"næstu ár","-1":"síðstu ár"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"mánuður","relative":{"0":"henda mánuður","1":"næstu mánuður","-1":"síðstu mánuður"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"dagur","relative":{"0":"í dag","1":"á morgunn","2":"á yfirmorgunn","-1":"í gær","-2":"í fyrradag"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"klukkustund","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"mínúta","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"sekund","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"fo-FO","parentLocale":"fo"});

HandlebarsIntl.__addLocaleData({"locale":"fr","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":"other";return n>=0&&n<2?"one":"other"},"fields":{"year":{"displayName":"année","relative":{"0":"cette année","1":"l’année prochaine","-1":"l’année dernière"},"relativeTime":{"future":{"one":"dans {0} an","other":"dans {0} ans"},"past":{"one":"il y a {0} an","other":"il y a {0} ans"}}},"month":{"displayName":"mois","relative":{"0":"ce mois-ci","1":"le mois prochain","-1":"le mois dernier"},"relativeTime":{"future":{"one":"dans {0} mois","other":"dans {0} mois"},"past":{"one":"il y a {0} mois","other":"il y a {0} mois"}}},"day":{"displayName":"jour","relative":{"0":"aujourd’hui","1":"demain","2":"après-demain","-1":"hier","-2":"avant-hier"},"relativeTime":{"future":{"one":"dans {0} jour","other":"dans {0} jours"},"past":{"one":"il y a {0} jour","other":"il y a {0} jours"}}},"hour":{"displayName":"heure","relativeTime":{"future":{"one":"dans {0} heure","other":"dans {0} heures"},"past":{"one":"il y a {0} heure","other":"il y a {0} heures"}}},"minute":{"displayName":"minute","relativeTime":{"future":{"one":"dans {0} minute","other":"dans {0} minutes"},"past":{"one":"il y a {0} minute","other":"il y a {0} minutes"}}},"second":{"displayName":"seconde","relative":{"0":"maintenant"},"relativeTime":{"future":{"one":"dans {0} seconde","other":"dans {0} secondes"},"past":{"one":"il y a {0} seconde","other":"il y a {0} secondes"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"fr-BE","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-BF","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-BI","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-BJ","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-BL","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-CA","parentLocale":"fr","fields":{"year":{"displayName":"année","relative":{"0":"cette année","1":"l’année prochaine","-1":"l’année dernière"},"relativeTime":{"future":{"one":"Dans {0} an","other":"Dans {0} ans"},"past":{"one":"Il y a {0} an","other":"Il y a {0} ans"}}},"month":{"displayName":"mois","relative":{"0":"ce mois-ci","1":"le mois prochain","-1":"le mois dernier"},"relativeTime":{"future":{"one":"Dans {0} mois","other":"Dans {0} mois"},"past":{"one":"Il y a {0} mois","other":"Il y a {0} mois"}}},"day":{"displayName":"jour","relative":{"0":"aujourd’hui","1":"demain","2":"après-demain","-1":"hier","-2":"avant-hier"},"relativeTime":{"future":{"one":"Dans {0} jour","other":"Dans {0} jours"},"past":{"one":"Il y a {0} jour","other":"Il y a {0} jours"}}},"hour":{"displayName":"heure","relativeTime":{"future":{"one":"Dans {0} heure","other":"Dans {0} heures"},"past":{"one":"Il y a {0} heure","other":"Il y a {0} heures"}}},"minute":{"displayName":"minute","relativeTime":{"future":{"one":"Dans {0} minute","other":"Dans {0} minutes"},"past":{"one":"Il y a {0} minute","other":"Il y a {0} minutes"}}},"second":{"displayName":"seconde","relative":{"0":"maintenant"},"relativeTime":{"future":{"one":"Dans {0} seconde","other":"Dans {0} secondes"},"past":{"one":"Il y a {0} seconde","other":"Il y a {0} secondes"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"fr-CD","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-CF","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-CG","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-CH","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-CI","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-CM","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-DJ","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-DZ","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-FR","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-GA","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-GF","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-GN","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-GP","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-GQ","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-HT","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-KM","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-LU","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-MA","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-MC","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-MF","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-MG","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-ML","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-MQ","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-MR","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-MU","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-NC","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-NE","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-PF","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-PM","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-RE","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-RW","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-SC","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-SN","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-SY","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-TD","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-TG","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-TN","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-VU","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-WF","parentLocale":"fr"});
HandlebarsIntl.__addLocaleData({"locale":"fr-YT","parentLocale":"fr"});

HandlebarsIntl.__addLocaleData({"locale":"fur","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"an","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"ca di {0} an","other":"ca di {0} agns"},"past":{"one":"{0} an indaûr","other":"{0} agns indaûr"}}},"month":{"displayName":"mês","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"ca di {0} mês","other":"ca di {0} mês"},"past":{"one":"{0} mês indaûr","other":"{0} mês indaûr"}}},"day":{"displayName":"dì","relative":{"0":"vuê","1":"doman","2":"passantdoman","-1":"îr","-2":"îr l’altri"},"relativeTime":{"future":{"one":"ca di {0} zornade","other":"ca di {0} zornadis"},"past":{"one":"{0} zornade indaûr","other":"{0} zornadis indaûr"}}},"hour":{"displayName":"ore","relativeTime":{"future":{"one":"ca di {0} ore","other":"ca di {0} oris"},"past":{"one":"{0} ore indaûr","other":"{0} oris indaûr"}}},"minute":{"displayName":"minût","relativeTime":{"future":{"one":"ca di {0} minût","other":"ca di {0} minûts"},"past":{"one":"{0} minût indaûr","other":"{0} minûts indaûr"}}},"second":{"displayName":"secont","relative":{"0":"now"},"relativeTime":{"future":{"one":"ca di {0} secont","other":"ca di {0} seconts"},"past":{"one":"{0} secont indaûr","other":"{0} seconts indaûr"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"fur-IT","parentLocale":"fur"});

HandlebarsIntl.__addLocaleData({"locale":"fy","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Jier","relative":{"0":"dit jier","1":"folgjend jier","-1":"foarich jier"},"relativeTime":{"future":{"one":"Oer {0} jier","other":"Oer {0} jier"},"past":{"one":"{0} jier lyn","other":"{0} jier lyn"}}},"month":{"displayName":"Moanne","relative":{"0":"dizze moanne","1":"folgjende moanne","-1":"foarige moanne"},"relativeTime":{"future":{"one":"Oer {0} moanne","other":"Oer {0} moannen"},"past":{"one":"{0} moanne lyn","other":"{0} moannen lyn"}}},"day":{"displayName":"dei","relative":{"0":"vandaag","1":"morgen","2":"Oermorgen","-1":"gisteren","-2":"eergisteren"},"relativeTime":{"future":{"one":"Oer {0} dei","other":"Oer {0} deien"},"past":{"one":"{0} dei lyn","other":"{0} deien lyn"}}},"hour":{"displayName":"oere","relativeTime":{"future":{"one":"Oer {0} oere","other":"Oer {0} oere"},"past":{"one":"{0} oere lyn","other":"{0} oere lyn"}}},"minute":{"displayName":"Minút","relativeTime":{"future":{"one":"Oer {0} minút","other":"Oer {0} minuten"},"past":{"one":"{0} minút lyn","other":"{0} minuten lyn"}}},"second":{"displayName":"Sekonde","relative":{"0":"nu"},"relativeTime":{"future":{"one":"Oer {0} sekonde","other":"Oer {0} sekonden"},"past":{"one":"{0} sekonde lyn","other":"{0} sekonden lyn"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"fy-NL","parentLocale":"fy"});

HandlebarsIntl.__addLocaleData({"locale":"ga","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return"other";return n==1?"one":n==2?"two":t0&&n>=3&&n<=6?"few":t0&&n>=7&&n<=10?"many":"other"},"fields":{"year":{"displayName":"Bliain","relative":{"0":"an bhliain seo","1":"an bhliain seo chugainn","-1":"anuraidh"},"relativeTime":{"future":{"one":"i gceann {0} bhliain","two":"i gceann {0} bhliain","few":"i gceann {0} bliana","many":"i gceann {0} mbliana","other":"i gceann {0} bliain"},"past":{"one":"{0} bhliain ó shin","two":"{0} bhliain ó shin","few":"{0} bliana ó shin","many":"{0} mbliana ó shin","other":"{0} bliain ó shin"}}},"month":{"displayName":"Mí","relative":{"0":"an mhí seo","1":"an mhí seo chugainn","-1":"an mhí seo caite"},"relativeTime":{"future":{"one":"i gceann {0} mhí","two":"i gceann {0} mhí","few":"i gceann {0} mhí","many":"i gceann {0} mí","other":"i gceann {0} mí"},"past":{"one":"{0} mhí ó shin","two":"{0} mhí ó shin","few":"{0} mhí ó shin","many":"{0} mí ó shin","other":"{0} mí ó shin"}}},"day":{"displayName":"Lá","relative":{"0":"inniu","1":"amárach","2":"arú amárach","-1":"inné","-2":"arú inné"},"relativeTime":{"future":{"one":"i gceann {0} lá","two":"i gceann {0} lá","few":"i gceann {0} lá","many":"i gceann {0} lá","other":"i gceann {0} lá"},"past":{"one":"{0} lá ó shin","two":"{0} lá ó shin","few":"{0} lá ó shin","many":"{0} lá ó shin","other":"{0} lá ó shin"}}},"hour":{"displayName":"Uair","relativeTime":{"future":{"one":"i gceann {0} uair an chloig","two":"i gceann {0} uair an chloig","few":"i gceann {0} huaire an chloig","many":"i gceann {0} n-uaire an chloig","other":"i gceann {0} uair an chloig"},"past":{"one":"{0} uair an chloig ó shin","two":"{0} uair an chloig ó shin","few":"{0} huaire an chloig ó shin","many":"{0} n-uaire an chloig ó shin","other":"{0} uair an chloig ó shin"}}},"minute":{"displayName":"Nóiméad","relativeTime":{"future":{"one":"i gceann {0} nóiméad","two":"i gceann {0} nóiméad","few":"i gceann {0} nóiméad","many":"i gceann {0} nóiméad","other":"i gceann {0} nóiméad"},"past":{"one":"{0} nóiméad ó shin","two":"{0} nóiméad ó shin","few":"{0} nóiméad ó shin","many":"{0} nóiméad ó shin","other":"{0} nóiméad ó shin"}}},"second":{"displayName":"Soicind","relative":{"0":"now"},"relativeTime":{"future":{"one":"i gceann {0} soicind","two":"i gceann {0} shoicind","few":"i gceann {0} shoicind","many":"i gceann {0} soicind","other":"i gceann {0} soicind"},"past":{"one":"{0} soicind ó shin","two":"{0} shoicind ó shin","few":"{0} shoicind ó shin","many":"{0} soicind ó shin","other":"{0} soicind ó shin"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ga-IE","parentLocale":"ga"});

HandlebarsIntl.__addLocaleData({"locale":"gd","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return"other";return n==1||n==11?"one":n==2||n==12?"two":t0&&n>=3&&n<=10||t0&&n>=13&&n<=19?"few":"other"},"fields":{"year":{"displayName":"bliadhna","relative":{"0":"am bliadhna","1":"an ath-bhliadhna","-1":"an-uiridh","-2":"a-bhòn-uiridh"},"relativeTime":{"future":{"one":"an ceann {0} bhliadhna","two":"an ceann {0} bhliadhna","few":"an ceann {0} bliadhnaichean","other":"an ceann {0} bliadhna"},"past":{"one":"o chionn {0} bhliadhna","two":"o chionn {0} bhliadhna","few":"o chionn {0} bliadhnaichean","other":"o chionn {0} bliadhna"}}},"month":{"displayName":"mìos","relative":{"0":"am mìos seo","1":"an ath-mhìos","-1":"am mìos seo chaidh"},"relativeTime":{"future":{"one":"an ceann {0} mhìosa","two":"an ceann {0} mhìosa","few":"an ceann {0} mìosan","other":"an ceann {0} mìosa"},"past":{"one":"o chionn {0} mhìosa","two":"o chionn {0} mhìosa","few":"o chionn {0} mìosan","other":"o chionn {0} mìosa"}}},"day":{"displayName":"latha","relative":{"0":"an-diugh","1":"a-màireach","2":"an-earar","3":"an-eararais","-1":"an-dè","-2":"a-bhòin-dè"},"relativeTime":{"future":{"one":"an ceann {0} latha","two":"an ceann {0} latha","few":"an ceann {0} làithean","other":"an ceann {0} latha"},"past":{"one":"o chionn {0} latha","two":"o chionn {0} latha","few":"o chionn {0} làithean","other":"o chionn {0} latha"}}},"hour":{"displayName":"uair a thìde","relativeTime":{"future":{"one":"an ceann {0} uair a thìde","two":"an ceann {0} uair a thìde","few":"an ceann {0} uairean a thìde","other":"an ceann {0} uair a thìde"},"past":{"one":"o chionn {0} uair a thìde","two":"o chionn {0} uair a thìde","few":"o chionn {0} uairean a thìde","other":"o chionn {0} uair a thìde"}}},"minute":{"displayName":"mionaid","relativeTime":{"future":{"one":"an ceann {0} mhionaid","two":"an ceann {0} mhionaid","few":"an ceann {0} mionaidean","other":"an ceann {0} mionaid"},"past":{"one":"o chionn {0} mhionaid","two":"o chionn {0} mhionaid","few":"o chionn {0} mionaidean","other":"o chionn {0} mionaid"}}},"second":{"displayName":"diog","relative":{"0":"now"},"relativeTime":{"future":{"one":"an ceann {0} diog","two":"an ceann {0} dhiog","few":"an ceann {0} diogan","other":"an ceann {0} diog"},"past":{"one":"o chionn {0} diog","two":"o chionn {0} dhiog","few":"o chionn {0} diogan","other":"o chionn {0} diog"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"gd-GB","parentLocale":"gd"});

HandlebarsIntl.__addLocaleData({"locale":"gl","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Ano","relative":{"0":"este ano","1":"seguinte ano","-1":"ano pasado"},"relativeTime":{"future":{"one":"En {0} ano","other":"En {0} anos"},"past":{"one":"Hai {0} ano","other":"Hai {0} anos"}}},"month":{"displayName":"Mes","relative":{"0":"este mes","1":"mes seguinte","-1":"mes pasado"},"relativeTime":{"future":{"one":"En {0} mes","other":"En {0} meses"},"past":{"one":"Hai {0} mes","other":"Hai {0} meses"}}},"day":{"displayName":"Día","relative":{"0":"hoxe","1":"mañá","2":"pasadomañá","-1":"onte","-2":"antonte"},"relativeTime":{"future":{"one":"En {0} día","other":"En {0} días"},"past":{"one":"Hai {0} día","other":"Hai {0} días"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"one":"En {0} hora","other":"En {0} horas"},"past":{"one":"Hai {0} hora","other":"Hai {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"En {0} minuto","other":"En {0} minutos"},"past":{"one":"Hai {0} minuto","other":"Hai {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"agora"},"relativeTime":{"future":{"one":"En {0} segundo","other":"En {0} segundos"},"past":{"one":"Hai {0} segundo","other":"Hai {0} segundos"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"gl-ES","parentLocale":"gl"});

HandlebarsIntl.__addLocaleData({"locale":"gsw","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Jaar","relative":{"0":"diese Jaar","1":"nächste Jaar","-1":"letzte Jaar"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Monet","relative":{"0":"diese Monet","1":"nächste Monet","-1":"letzte Monet"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Tag","relative":{"0":"hüt","1":"moorn","2":"übermoorn","-1":"geschter","-2":"vorgeschter"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Schtund","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minuute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"gsw-CH","parentLocale":"gsw"});
HandlebarsIntl.__addLocaleData({"locale":"gsw-FR","parentLocale":"gsw"});
HandlebarsIntl.__addLocaleData({"locale":"gsw-LI","parentLocale":"gsw"});

HandlebarsIntl.__addLocaleData({"locale":"gu","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":n==2||n==3?"two":n==4?"few":n==6?"many":"other";return n>=0&&n<=1?"one":"other"},"fields":{"year":{"displayName":"વર્ષ","relative":{"0":"આ વર્ષે","1":"આવતા વર્ષે","-1":"ગયા વર્ષે"},"relativeTime":{"future":{"one":"{0} વર્ષમાં","other":"{0} વર્ષમાં"},"past":{"one":"{0} વર્ષ પહેલા","other":"{0} વર્ષ પહેલા"}}},"month":{"displayName":"મહિનો","relative":{"0":"આ મહિને","1":"આવતા મહિને","-1":"ગયા મહિને"},"relativeTime":{"future":{"one":"{0} મહિનામાં","other":"{0} મહિનામાં"},"past":{"one":"{0} મહિના પહેલા","other":"{0} મહિના પહેલા"}}},"day":{"displayName":"દિવસ","relative":{"0":"આજે","1":"આવતીકાલે","2":"પરમદિવસે","-1":"ગઈકાલે","-2":"ગયા પરમદિવસે"},"relativeTime":{"future":{"one":"{0} દિવસમાં","other":"{0} દિવસમાં"},"past":{"one":"{0} દિવસ પહેલા","other":"{0} દિવસ પહેલા"}}},"hour":{"displayName":"કલાક","relativeTime":{"future":{"one":"{0} કલાકમાં","other":"{0} કલાકમાં"},"past":{"one":"{0} કલાક પહેલા","other":"{0} કલાક પહેલા"}}},"minute":{"displayName":"મિનિટ","relativeTime":{"future":{"one":"{0} મિનિટમાં","other":"{0} મિનિટમાં"},"past":{"one":"{0} મિનિટ પહેલા","other":"{0} મિનિટ પહેલા"}}},"second":{"displayName":"સેકન્ડ","relative":{"0":"હમણાં"},"relativeTime":{"future":{"one":"{0} સેકંડમાં","other":"{0} સેકંડમાં"},"past":{"one":"{0} સેકંડ પહેલા","other":"{0} સેકંડ પહેલા"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"gu-IN","parentLocale":"gu"});

HandlebarsIntl.__addLocaleData({"locale":"guw","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"guz","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Omwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Omotienyi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Rituko","relative":{"0":"Rero","1":"Mambia","-1":"Igoro"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Ensa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Edakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Esekendi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"guz-KE","parentLocale":"guz"});

HandlebarsIntl.__addLocaleData({"locale":"gv","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],i10=i.slice(-1),i100=i.slice(-2);if(ord)return"other";return v0&&i10==1?"one":v0&&i10==2?"two":v0&&(i100==0||i100==20||i100==40||i100==60||i100==80)?"few":!v0?"many":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"gv-IM","parentLocale":"gv"});

HandlebarsIntl.__addLocaleData({"locale":"ha","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Shekara","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Wata","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Kwana","relative":{"0":"Yau","1":"Gobe","-1":"Jiya"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Awa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minti","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Daƙiƙa","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ha-Arab","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ha-Latn","parentLocale":"ha"});
HandlebarsIntl.__addLocaleData({"locale":"ha-Latn-GH","parentLocale":"ha-Latn"});
HandlebarsIntl.__addLocaleData({"locale":"ha-Latn-NE","parentLocale":"ha-Latn"});
HandlebarsIntl.__addLocaleData({"locale":"ha-Latn-NG","parentLocale":"ha-Latn"});

HandlebarsIntl.__addLocaleData({"locale":"haw","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"haw-US","parentLocale":"haw"});

HandlebarsIntl.__addLocaleData({"locale":"he","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1);if(ord)return"other";return n==1&&v0?"one":i==2&&v0?"two":v0&&(n<0||n>10)&&t0&&n10==0?"many":"other"},"fields":{"year":{"displayName":"שנה","relative":{"0":"השנה","1":"השנה הבאה","-1":"השנה שעברה"},"relativeTime":{"future":{"one":"בעוד שנה","two":"בעוד שנתיים","many":"בעוד {0} שנה","other":"בעוד {0} שנים"},"past":{"one":"לפני שנה","two":"לפני שנתיים","many":"לפני {0} שנה","other":"לפני {0} שנים"}}},"month":{"displayName":"חודש","relative":{"0":"החודש","1":"החודש הבא","-1":"החודש שעבר"},"relativeTime":{"future":{"one":"בעוד חודש","two":"בעוד חודשיים","many":"בעוד {0} חודשים","other":"בעוד {0} חודשים"},"past":{"one":"לפני חודש","two":"לפני חודשיים","many":"לפני {0} חודשים","other":"לפני {0} חודשים"}}},"day":{"displayName":"יום","relative":{"0":"היום","1":"מחר","2":"מחרתיים","-1":"אתמול","-2":"שלשום"},"relativeTime":{"future":{"one":"בעוד יום {0}","two":"בעוד יומיים","many":"בעוד {0} ימים","other":"בעוד {0} ימים"},"past":{"one":"לפני יום {0}","two":"לפני יומיים","many":"לפני {0} ימים","other":"לפני {0} ימים"}}},"hour":{"displayName":"שעה","relativeTime":{"future":{"one":"בעוד שעה","two":"בעוד שעתיים","many":"בעוד {0} שעות","other":"בעוד {0} שעות"},"past":{"one":"לפני שעה","two":"לפני שעתיים","many":"לפני {0} שעות","other":"לפני {0} שעות"}}},"minute":{"displayName":"דקה","relativeTime":{"future":{"one":"בעוד דקה","two":"בעוד שתי דקות","many":"בעוד {0} דקות","other":"בעוד {0} דקות"},"past":{"one":"לפני דקה","two":"לפני שתי דקות","many":"לפני {0} דקות","other":"לפני {0} דקות"}}},"second":{"displayName":"שנייה","relative":{"0":"עכשיו"},"relativeTime":{"future":{"one":"בעוד שנייה","two":"בעוד שתי שניות","many":"בעוד {0} שניות","other":"בעוד {0} שניות"},"past":{"one":"לפני שנייה","two":"לפני שתי שניות","many":"לפני {0} שניות","other":"לפני {0} שניות"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"he-IL","parentLocale":"he"});

HandlebarsIntl.__addLocaleData({"locale":"hi","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":n==2||n==3?"two":n==4?"few":n==6?"many":"other";return n>=0&&n<=1?"one":"other"},"fields":{"year":{"displayName":"वर्ष","relative":{"0":"इस वर्ष","1":"अगला वर्ष","-1":"पिछला वर्ष"},"relativeTime":{"future":{"one":"{0} वर्ष में","other":"{0} वर्ष में"},"past":{"one":"{0} वर्ष पहले","other":"{0} वर्ष पहले"}}},"month":{"displayName":"माह","relative":{"0":"इस माह","1":"अगला माह","-1":"पिछला माह"},"relativeTime":{"future":{"one":"{0} माह में","other":"{0} माह में"},"past":{"one":"{0} माह पहले","other":"{0} माह पहले"}}},"day":{"displayName":"दिन","relative":{"0":"आज","1":"कल","2":"परसों","-1":"कल","-2":"बीता परसों"},"relativeTime":{"future":{"one":"{0} दिन में","other":"{0} दिन में"},"past":{"one":"{0} दिन पहले","other":"{0} दिन पहले"}}},"hour":{"displayName":"घंटा","relativeTime":{"future":{"one":"{0} घंटे में","other":"{0} घंटे में"},"past":{"one":"{0} घंटे पहले","other":"{0} घंटे पहले"}}},"minute":{"displayName":"मिनट","relativeTime":{"future":{"one":"{0} मिनट में","other":"{0} मिनट में"},"past":{"one":"{0} मिनट पहले","other":"{0} मिनट पहले"}}},"second":{"displayName":"सेकंड","relative":{"0":"अब"},"relativeTime":{"future":{"one":"{0} सेकंड में","other":"{0} सेकंड में"},"past":{"one":"{0} सेकंड पहले","other":"{0} सेकंड पहले"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"hi-IN","parentLocale":"hi"});

HandlebarsIntl.__addLocaleData({"locale":"hr","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),i100=i.slice(-2),f10=f.slice(-1),f100=f.slice(-2);if(ord)return"other";return v0&&i10==1&&i100!=11||f10==1&&f100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)||f10>=2&&f10<=4&&(f100<12||f100>14)?"few":"other"},"fields":{"year":{"displayName":"Godina","relative":{"0":"ove godine","1":"sljedeće godine","-1":"prošle godine"},"relativeTime":{"future":{"one":"za {0} godinu","few":"za {0} godine","other":"za {0} godina"},"past":{"one":"prije {0} godinu","few":"prije {0} godine","other":"prije {0} godina"}}},"month":{"displayName":"Mjesec","relative":{"0":"ovaj mjesec","1":"sljedeći mjesec","-1":"prošli mjesec"},"relativeTime":{"future":{"one":"za {0} mjesec","few":"za {0} mjeseca","other":"za {0} mjeseci"},"past":{"one":"prije {0} mjesec","few":"prije {0} mjeseca","other":"prije {0} mjeseci"}}},"day":{"displayName":"Dan","relative":{"0":"danas","1":"sutra","2":"prekosutra","-1":"jučer","-2":"prekjučer"},"relativeTime":{"future":{"one":"za {0} dan","few":"za {0} dana","other":"za {0} dana"},"past":{"one":"prije {0} dan","few":"prije {0} dana","other":"prije {0} dana"}}},"hour":{"displayName":"Sat","relativeTime":{"future":{"one":"za {0} sat","few":"za {0} sata","other":"za {0} sati"},"past":{"one":"prije {0} sat","few":"prije {0} sata","other":"prije {0} sati"}}},"minute":{"displayName":"Minuta","relativeTime":{"future":{"one":"za {0} minutu","few":"za {0} minute","other":"za {0} minuta"},"past":{"one":"prije {0} minutu","few":"prije {0} minute","other":"prije {0} minuta"}}},"second":{"displayName":"Sekunda","relative":{"0":"sada"},"relativeTime":{"future":{"one":"za {0} sekundu","few":"za {0} sekunde","other":"za {0} sekundi"},"past":{"one":"prije {0} sekundu","few":"prije {0} sekunde","other":"prije {0} sekundi"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"hr-BA","parentLocale":"hr"});
HandlebarsIntl.__addLocaleData({"locale":"hr-HR","parentLocale":"hr"});

HandlebarsIntl.__addLocaleData({"locale":"hsb","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i100=i.slice(-2),f100=f.slice(-2);if(ord)return"other";return v0&&i100==1||f100==1?"one":v0&&i100==2||f100==2?"two":v0&&(i100==3||i100==4)||(f100==3||f100==4)?"few":"other"},"fields":{"year":{"displayName":"lěto","relative":{"0":"lětsa","1":"klětu","-1":"loni"},"relativeTime":{"future":{"one":"za {0} lěto","two":"za {0} lěće","few":"za {0} lěta","other":"za {0} lět"},"past":{"one":"před {0} lětom","two":"před {0} lětomaj","few":"před {0} lětami","other":"před {0} lětami"}}},"month":{"displayName":"měsac","relative":{"0":"tutón měsac","1":"přichodny měsac","-1":"zašły měsac"},"relativeTime":{"future":{"one":"za {0} měsac","two":"za {0} měsacaj","few":"za {0} měsacy","other":"za {0} měsacow"},"past":{"one":"před {0} měsacom","two":"před {0} měsacomaj","few":"před {0} měsacami","other":"před {0} měsacami"}}},"day":{"displayName":"dźeń","relative":{"0":"dźensa","1":"jutře","-1":"wčera"},"relativeTime":{"future":{"one":"za {0} dźeń","two":"za {0} dnjej","few":"za {0} dny","other":"za {0} dnjow"},"past":{"one":"před {0} dnjom","two":"před {0} dnjomaj","few":"před {0} dnjemi","other":"před {0} dnjemi"}}},"hour":{"displayName":"hodźina","relativeTime":{"future":{"one":"za {0} hodźinu","two":"za {0} hodźinje","few":"za {0} hodźiny","other":"za {0} hodźin"},"past":{"one":"před {0} hodźinu","two":"před {0} hodźinomaj","few":"před {0} hodźinami","other":"před {0} hodźinami"}}},"minute":{"displayName":"minuta","relativeTime":{"future":{"one":"za {0} minutu","two":"za {0} minuće","few":"za {0} minuty","other":"za {0} minutow"},"past":{"one":"před {0} minutu","two":"před {0} minutomaj","few":"před {0} minutami","other":"před {0} minutami"}}},"second":{"displayName":"sekunda","relative":{"0":"now"},"relativeTime":{"future":{"one":"za {0} sekundu","two":"za {0} sekundźe","few":"za {0} sekundy","other":"za {0} sekundow"},"past":{"one":"před {0} sekundu","two":"před {0} sekundomaj","few":"před {0} sekundami","other":"před {0} sekundami"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"hsb-DE","parentLocale":"hsb"});

HandlebarsIntl.__addLocaleData({"locale":"hu","pluralRuleFunction":function (n,ord){if(ord)return n==1||n==5?"one":"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"év","relative":{"0":"ez az év","1":"következő év","-1":"előző év"},"relativeTime":{"future":{"one":"{0} év múlva","other":"{0} év múlva"},"past":{"one":"{0} évvel ezelőtt","other":"{0} évvel ezelőtt"}}},"month":{"displayName":"hónap","relative":{"0":"ez a hónap","1":"következő hónap","-1":"előző hónap"},"relativeTime":{"future":{"one":"{0} hónap múlva","other":"{0} hónap múlva"},"past":{"one":"{0} hónappal ezelőtt","other":"{0} hónappal ezelőtt"}}},"day":{"displayName":"nap","relative":{"0":"ma","1":"holnap","2":"holnapután","-1":"tegnap","-2":"tegnapelőtt"},"relativeTime":{"future":{"one":"{0} nap múlva","other":"{0} nap múlva"},"past":{"one":"{0} nappal ezelőtt","other":"{0} nappal ezelőtt"}}},"hour":{"displayName":"óra","relativeTime":{"future":{"one":"{0} óra múlva","other":"{0} óra múlva"},"past":{"one":"{0} órával ezelőtt","other":"{0} órával ezelőtt"}}},"minute":{"displayName":"perc","relativeTime":{"future":{"one":"{0} perc múlva","other":"{0} perc múlva"},"past":{"one":"{0} perccel ezelőtt","other":"{0} perccel ezelőtt"}}},"second":{"displayName":"másodperc","relative":{"0":"most"},"relativeTime":{"future":{"one":"{0} másodperc múlva","other":"{0} másodperc múlva"},"past":{"one":"{0} másodperccel ezelőtt","other":"{0} másodperccel ezelőtt"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"hu-HU","parentLocale":"hu"});

HandlebarsIntl.__addLocaleData({"locale":"hy","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":"other";return n>=0&&n<2?"one":"other"},"fields":{"year":{"displayName":"Տարի","relative":{"0":"այս տարի","1":"հաջորդ տարի","-1":"անցյալ տարի"},"relativeTime":{"future":{"one":"{0} տարի անց","other":"{0} տարի անց"},"past":{"one":"{0} տարի առաջ","other":"{0} տարի առաջ"}}},"month":{"displayName":"Ամիս","relative":{"0":"այս ամիս","1":"հաջորդ ամիս","-1":"անցյալ ամիս"},"relativeTime":{"future":{"one":"{0} ամիս անց","other":"{0} ամիս անց"},"past":{"one":"{0} ամիս առաջ","other":"{0} ամիս առաջ"}}},"day":{"displayName":"Օր","relative":{"0":"այսօր","1":"վաղը","2":"վաղը չէ մյուս օրը","-1":"երեկ","-2":"երեկ չէ առաջի օրը"},"relativeTime":{"future":{"one":"{0} օր անց","other":"{0} օր անց"},"past":{"one":"{0} օր առաջ","other":"{0} օր առաջ"}}},"hour":{"displayName":"Ժամ","relativeTime":{"future":{"one":"{0} ժամ անց","other":"{0} ժամ անց"},"past":{"one":"{0} ժամ առաջ","other":"{0} ժամ առաջ"}}},"minute":{"displayName":"Րոպե","relativeTime":{"future":{"one":"{0} րոպե անց","other":"{0} րոպե անց"},"past":{"one":"{0} րոպե առաջ","other":"{0} րոպե առաջ"}}},"second":{"displayName":"Վայրկյան","relative":{"0":"այժմ"},"relativeTime":{"future":{"one":"{0} վայրկյան անց","other":"{0} վայրկյան անց"},"past":{"one":"{0} վայրկյան առաջ","other":"{0} վայրկյան առաջ"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"hy-AM","parentLocale":"hy"});

HandlebarsIntl.__addLocaleData({"locale":"ia","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ia-FR","parentLocale":"ia"});

HandlebarsIntl.__addLocaleData({"locale":"id","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Tahun","relative":{"0":"tahun ini","1":"tahun depan","-1":"tahun lalu"},"relativeTime":{"future":{"other":"Dalam {0} tahun"},"past":{"other":"{0} tahun yang lalu"}}},"month":{"displayName":"Bulan","relative":{"0":"bulan ini","1":"Bulan berikutnya","-1":"bulan lalu"},"relativeTime":{"future":{"other":"Dalam {0} bulan"},"past":{"other":"{0} bulan yang lalu"}}},"day":{"displayName":"Hari","relative":{"0":"hari ini","1":"besok","2":"lusa","-1":"kemarin","-2":"kemarin lusa"},"relativeTime":{"future":{"other":"Dalam {0} hari"},"past":{"other":"{0} hari yang lalu"}}},"hour":{"displayName":"Jam","relativeTime":{"future":{"other":"Dalam {0} jam"},"past":{"other":"{0} jam yang lalu"}}},"minute":{"displayName":"Menit","relativeTime":{"future":{"other":"Dalam {0} menit"},"past":{"other":"{0} menit yang lalu"}}},"second":{"displayName":"Detik","relative":{"0":"sekarang"},"relativeTime":{"future":{"other":"Dalam {0} detik"},"past":{"other":"{0} detik yang lalu"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"id-ID","parentLocale":"id"});

HandlebarsIntl.__addLocaleData({"locale":"ig","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Afọ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Ọnwa","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ụbọchị","relative":{"0":"Taata","1":"Echi","-1":"Nnyaafụ"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Elekere","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Nkeji","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Nkejinta","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ig-NG","parentLocale":"ig"});

HandlebarsIntl.__addLocaleData({"locale":"ii","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"ꈎ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"ꆪ","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"ꑍ","relative":{"0":"ꀃꑍ","1":"ꃆꏂꑍ","2":"ꌕꀿꑍ","-1":"ꀋꅔꉈ","-2":"ꎴꂿꋍꑍ"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"ꄮꈉ","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"ꃏ","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"ꇙ","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ii-CN","parentLocale":"ii"});

HandlebarsIntl.__addLocaleData({"locale":"in","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"is","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],t0=Number(s[0])==n,i10=i.slice(-1),i100=i.slice(-2);if(ord)return"other";return t0&&i10==1&&i100!=11||!t0?"one":"other"},"fields":{"year":{"displayName":"ár","relative":{"0":"á þessu ári","1":"á næsta ári","-1":"á síðasta ári"},"relativeTime":{"future":{"one":"eftir {0} ár","other":"eftir {0} ár"},"past":{"one":"fyrir {0} ári","other":"fyrir {0} árum"}}},"month":{"displayName":"mánuður","relative":{"0":"í þessum mánuði","1":"í næsta mánuði","-1":"í síðasta mánuði"},"relativeTime":{"future":{"one":"eftir {0} mánuð","other":"eftir {0} mánuði"},"past":{"one":"fyrir {0} mánuði","other":"fyrir {0} mánuðum"}}},"day":{"displayName":"dagur","relative":{"0":"í dag","1":"á morgun","2":"eftir tvo daga","-1":"í gær","-2":"í fyrradag"},"relativeTime":{"future":{"one":"eftir {0} dag","other":"eftir {0} daga"},"past":{"one":"fyrir {0} degi","other":"fyrir {0} dögum"}}},"hour":{"displayName":"klukkustund","relativeTime":{"future":{"one":"eftir {0} klukkustund","other":"eftir {0} klukkustundir"},"past":{"one":"fyrir {0} klukkustund","other":"fyrir {0} klukkustundum"}}},"minute":{"displayName":"mínúta","relativeTime":{"future":{"one":"eftir {0} mínútu","other":"eftir {0} mínútur"},"past":{"one":"fyrir {0} mínútu","other":"fyrir {0} mínútum"}}},"second":{"displayName":"sekúnda","relative":{"0":"núna"},"relativeTime":{"future":{"one":"eftir {0} sekúndu","other":"eftir {0} sekúndur"},"past":{"one":"fyrir {0} sekúndu","other":"fyrir {0} sekúndum"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"is-IS","parentLocale":"is"});

HandlebarsIntl.__addLocaleData({"locale":"it","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return n==11||n==8||n==80||n==800?"many":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Anno","relative":{"0":"quest’anno","1":"anno prossimo","-1":"anno scorso"},"relativeTime":{"future":{"one":"tra {0} anno","other":"tra {0} anni"},"past":{"one":"{0} anno fa","other":"{0} anni fa"}}},"month":{"displayName":"Mese","relative":{"0":"questo mese","1":"mese prossimo","-1":"mese scorso"},"relativeTime":{"future":{"one":"tra {0} mese","other":"tra {0} mesi"},"past":{"one":"{0} mese fa","other":"{0} mesi fa"}}},"day":{"displayName":"Giorno","relative":{"0":"oggi","1":"domani","2":"dopodomani","-1":"ieri","-2":"l’altro ieri"},"relativeTime":{"future":{"one":"tra {0} giorno","other":"tra {0} giorni"},"past":{"one":"{0} giorno fa","other":"{0} giorni fa"}}},"hour":{"displayName":"Ora","relativeTime":{"future":{"one":"tra {0} ora","other":"tra {0} ore"},"past":{"one":"{0} ora fa","other":"{0} ore fa"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"tra {0} minuto","other":"tra {0} minuti"},"past":{"one":"{0} minuto fa","other":"{0} minuti fa"}}},"second":{"displayName":"Secondo","relative":{"0":"ora"},"relativeTime":{"future":{"one":"tra {0} secondo","other":"tra {0} secondi"},"past":{"one":"{0} secondo fa","other":"{0} secondi fa"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"it-CH","parentLocale":"it"});
HandlebarsIntl.__addLocaleData({"locale":"it-IT","parentLocale":"it"});
HandlebarsIntl.__addLocaleData({"locale":"it-SM","parentLocale":"it"});

HandlebarsIntl.__addLocaleData({"locale":"iu","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"iw","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1);if(ord)return"other";return n==1&&v0?"one":i==2&&v0?"two":v0&&(n<0||n>10)&&t0&&n10==0?"many":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"ja","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"年","relative":{"0":"今年","1":"翌年","-1":"昨年"},"relativeTime":{"future":{"other":"{0} 年後"},"past":{"other":"{0} 年前"}}},"month":{"displayName":"月","relative":{"0":"今月","1":"翌月","-1":"先月"},"relativeTime":{"future":{"other":"{0} か月後"},"past":{"other":"{0} か月前"}}},"day":{"displayName":"日","relative":{"0":"今日","1":"明日","2":"明後日","-1":"昨日","-2":"一昨日"},"relativeTime":{"future":{"other":"{0} 日後"},"past":{"other":"{0} 日前"}}},"hour":{"displayName":"時","relativeTime":{"future":{"other":"{0} 時間後"},"past":{"other":"{0} 時間前"}}},"minute":{"displayName":"分","relativeTime":{"future":{"other":"{0} 分後"},"past":{"other":"{0} 分前"}}},"second":{"displayName":"秒","relative":{"0":"今すぐ"},"relativeTime":{"future":{"other":"{0} 秒後"},"past":{"other":"{0} 秒前"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ja-JP","parentLocale":"ja"});

HandlebarsIntl.__addLocaleData({"locale":"jbo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"jgo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"Nǔu ŋguꞋ {0}","other":"Nǔu ŋguꞋ {0}"},"past":{"one":"Ɛ́gɛ́ mɔ́ ŋguꞋ {0}","other":"Ɛ́gɛ́ mɔ́ ŋguꞋ {0}"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"Nǔu {0} saŋ","other":"Nǔu {0} saŋ"},"past":{"one":"ɛ́ gɛ́ mɔ́ pɛsaŋ {0}","other":"ɛ́ gɛ́ mɔ́ pɛsaŋ {0}"}}},"day":{"displayName":"Day","relative":{"0":"lɔꞋɔ","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"Nǔu lɛ́Ꞌ {0}","other":"Nǔu lɛ́Ꞌ {0}"},"past":{"one":"Ɛ́ gɛ́ mɔ́ lɛ́Ꞌ {0}","other":"Ɛ́ gɛ́ mɔ́ lɛ́Ꞌ {0}"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"one":"nǔu háwa {0}","other":"nǔu háwa {0}"},"past":{"one":"ɛ́ gɛ mɔ́ {0} háwa","other":"ɛ́ gɛ mɔ́ {0} háwa"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"one":"nǔu {0} minút","other":"nǔu {0} minút"},"past":{"one":"ɛ́ gɛ́ mɔ́ minút {0}","other":"ɛ́ gɛ́ mɔ́ minút {0}"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"jgo-CM","parentLocale":"jgo"});

HandlebarsIntl.__addLocaleData({"locale":"ji","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"jmc","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Maka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mori","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Mfiri","relative":{"0":"Inu","1":"Ngama","-1":"Ukou"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakyika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"jmc-TZ","parentLocale":"jmc"});

HandlebarsIntl.__addLocaleData({"locale":"jv","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"jw","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"ka","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],i100=i.slice(-2);if(ord)return i==1?"one":i==0||(i100>=2&&i100<=20||i100==40||i100==60||i100==80)?"many":"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"წელი","relative":{"0":"ამ წელს","1":"მომავალ წელს","-1":"გასულ წელს"},"relativeTime":{"future":{"one":"{0} წელიწადში","other":"{0} წელიწადში"},"past":{"one":"{0} წლის წინ","other":"{0} წლის წინ"}}},"month":{"displayName":"თვე","relative":{"0":"ამ თვეში","1":"მომავალ თვეს","-1":"გასულ თვეს"},"relativeTime":{"future":{"one":"{0} თვეში","other":"{0} თვეში"},"past":{"one":"{0} თვის წინ","other":"{0} თვის წინ"}}},"day":{"displayName":"დღე","relative":{"0":"დღეს","1":"ხვალ","2":"ზეგ","-1":"გუშინ","-2":"გუშინწინ"},"relativeTime":{"future":{"one":"{0} დღეში","other":"{0} დღეში"},"past":{"one":"{0} დღის წინ","other":"{0} დღის წინ"}}},"hour":{"displayName":"საათი","relativeTime":{"future":{"one":"{0} საათში","other":"{0} საათში"},"past":{"one":"{0} საათის წინ","other":"{0} საათის წინ"}}},"minute":{"displayName":"წუთი","relativeTime":{"future":{"one":"{0} წუთში","other":"{0} წუთში"},"past":{"one":"{0} წუთის წინ","other":"{0} წუთის წინ"}}},"second":{"displayName":"წამი","relative":{"0":"ახლა"},"relativeTime":{"future":{"one":"{0} წამში","other":"{0} წამში"},"past":{"one":"{0} წამის წინ","other":"{0} წამის წინ"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ka-GE","parentLocale":"ka"});

HandlebarsIntl.__addLocaleData({"locale":"kab","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<2?"one":"other"},"fields":{"year":{"displayName":"Aseggas","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Aggur","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ass","relative":{"0":"Ass-a","1":"Azekka","-1":"Iḍelli"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Tamert","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Tamrect","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Tasint","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"kab-DZ","parentLocale":"kab"});

HandlebarsIntl.__addLocaleData({"locale":"kaj","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"kam","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Mwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mwai","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Mũthenya","relative":{"0":"Ũmũnthĩ","1":"Ũnĩ","-1":"Ĩyoo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Ndatĩka","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"sekondi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"kam-KE","parentLocale":"kam"});

HandlebarsIntl.__addLocaleData({"locale":"kcg","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"kde","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Mwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mwedi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Lihiku","relative":{"0":"Nelo","1":"Nundu","-1":"Lido"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"kde-TZ","parentLocale":"kde"});

HandlebarsIntl.__addLocaleData({"locale":"kea","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Anu","relative":{"0":"es anu li","1":"prósimu anu","-1":"anu pasadu"},"relativeTime":{"future":{"other":"di li {0} anu"},"past":{"other":"a ten {0} anu"}}},"month":{"displayName":"Mes","relative":{"0":"es mes li","1":"prósimu mes","-1":"mes pasadu"},"relativeTime":{"future":{"other":"di li {0} mes"},"past":{"other":"a ten {0} mes"}}},"day":{"displayName":"Dia","relative":{"0":"oji","1":"manha","-1":"onti"},"relativeTime":{"future":{"other":"di li {0} dia"},"past":{"other":"a ten {0} dia"}}},"hour":{"displayName":"Ora","relativeTime":{"future":{"other":"di li {0} ora"},"past":{"other":"a ten {0} ora"}}},"minute":{"displayName":"Minutu","relativeTime":{"future":{"other":"di li {0} minutu"},"past":{"other":"a ten {0} minutu"}}},"second":{"displayName":"Sigundu","relative":{"0":"now"},"relativeTime":{"future":{"other":"di li {0} sigundu"},"past":{"other":"a ten {0} sigundu"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"kea-CV","parentLocale":"kea"});

HandlebarsIntl.__addLocaleData({"locale":"khq","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Jiiri","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Handu","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Jaari","relative":{"0":"Hõo","1":"Suba","-1":"Bi"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Guuru","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Miniti","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Miti","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"khq-ML","parentLocale":"khq"});

HandlebarsIntl.__addLocaleData({"locale":"ki","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Mwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mweri","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Mũthenya","relative":{"0":"Ũmũthĩ","1":"Rũciũ","-1":"Ira"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Ithaa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Ndagĩka","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ki-KE","parentLocale":"ki"});

HandlebarsIntl.__addLocaleData({"locale":"kk","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n10=t0&&s[0].slice(-1);if(ord)return n10==6||n10==9||t0&&n10==0&&n!=0?"many":"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Жыл","relative":{"0":"биылғы жыл","1":"келесі жыл","-1":"былтырғы жыл"},"relativeTime":{"future":{"one":"{0} жылдан кейін","other":"{0} жылдан кейін"},"past":{"one":"{0} жыл бұрын","other":"{0} жыл бұрын"}}},"month":{"displayName":"Ай","relative":{"0":"осы ай","1":"келесі ай","-1":"өткен ай"},"relativeTime":{"future":{"one":"{0} айдан кейін","other":"{0} айдан кейін"},"past":{"one":"{0} ай бұрын","other":"{0} ай бұрын"}}},"day":{"displayName":"күн","relative":{"0":"бүгін","1":"ертең","2":"арғы күні","-1":"кеше","-2":"алдыңғы күні"},"relativeTime":{"future":{"one":"{0} күннен кейін","other":"{0} күннен кейін"},"past":{"one":"{0} күн бұрын","other":"{0} күн бұрын"}}},"hour":{"displayName":"Сағат","relativeTime":{"future":{"one":"{0} сағаттан кейін","other":"{0} сағаттан кейін"},"past":{"one":"{0} сағат бұрын","other":"{0} сағат бұрын"}}},"minute":{"displayName":"Минут","relativeTime":{"future":{"one":"{0} минуттан кейін","other":"{0} минуттан кейін"},"past":{"one":"{0} минут бұрын","other":"{0} минут бұрын"}}},"second":{"displayName":"Секунд","relative":{"0":"қазір"},"relativeTime":{"future":{"one":"{0} секундтан кейін","other":"{0} секундтан кейін"},"past":{"one":"{0} секунд бұрын","other":"{0} секунд бұрын"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"kk-Cyrl","parentLocale":"kk"});
HandlebarsIntl.__addLocaleData({"locale":"kk-Cyrl-KZ","parentLocale":"kk-Cyrl"});

HandlebarsIntl.__addLocaleData({"locale":"kkj","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"muka","1":"nɛmɛnɔ","-1":"kwey"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"kkj-CM","parentLocale":"kkj"});

HandlebarsIntl.__addLocaleData({"locale":"kl","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"ukioq","relative":{"0":"manna ukioq","1":"tulleq ukioq","-1":"kingulleq ukioq"},"relativeTime":{"future":{"one":"om {0} ukioq","other":"om {0} ukioq"},"past":{"one":"for {0} ukioq siden","other":"for {0} ukioq siden"}}},"month":{"displayName":"qaammat","relative":{"0":"manna qaammat","1":"tulleq qaammat","-1":"kingulleq qaammat"},"relativeTime":{"future":{"one":"om {0} qaammat","other":"om {0} qaammat"},"past":{"one":"for {0} qaammat siden","other":"for {0} qaammat siden"}}},"day":{"displayName":"ulloq","relative":{"0":"ullumi","1":"aqagu","2":"aqaguagu","-1":"ippassaq","-2":"ippassaani"},"relativeTime":{"future":{"one":"om {0} ulloq unnuarlu","other":"om {0} ulloq unnuarlu"},"past":{"one":"for {0} ulloq unnuarlu siden","other":"for {0} ulloq unnuarlu siden"}}},"hour":{"displayName":"nalunaaquttap-akunnera","relativeTime":{"future":{"one":"om {0} nalunaaquttap-akunnera","other":"om {0} nalunaaquttap-akunnera"},"past":{"one":"for {0} nalunaaquttap-akunnera siden","other":"for {0} nalunaaquttap-akunnera siden"}}},"minute":{"displayName":"minutsi","relativeTime":{"future":{"one":"om {0} minutsi","other":"om {0} minutsi"},"past":{"one":"for {0} minutsi siden","other":"for {0} minutsi siden"}}},"second":{"displayName":"sekundi","relative":{"0":"now"},"relativeTime":{"future":{"one":"om {0} sekundi","other":"om {0} sekundi"},"past":{"one":"for {0} sekundi siden","other":"for {0} sekundi siden"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"kl-GL","parentLocale":"kl"});

HandlebarsIntl.__addLocaleData({"locale":"kln","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Kenyit","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Arawet","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Betut","relative":{"0":"Raini","1":"Mutai","-1":"Amut"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Sait","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minitit","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekondit","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"kln-KE","parentLocale":"kln"});

HandlebarsIntl.__addLocaleData({"locale":"km","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"ឆ្នាំ","relative":{"0":"ឆ្នាំ​នេះ","1":"ឆ្នាំ​ក្រោយ","-1":"ឆ្នាំ​មុន"},"relativeTime":{"future":{"other":"ក្នុង​រយៈ​ពេល {0} ឆ្នាំ"},"past":{"other":"{0} ឆ្នាំ​មុន"}}},"month":{"displayName":"ខែ","relative":{"0":"ខែ​នេះ","1":"ខែ​ក្រោយ","-1":"ខែ​មុន"},"relativeTime":{"future":{"other":"ក្នុង​រយៈ​ពេល {0} ខែ"},"past":{"other":"{0} ខែមុន"}}},"day":{"displayName":"ថ្ងៃ","relative":{"0":"ថ្ងៃ​នេះ","1":"ថ្ងៃ​ស្អែក","2":"​ខាន​ស្អែក","-1":"ម្សិលមិញ","-2":"ម្សិល​ម៉្ងៃ"},"relativeTime":{"future":{"other":"ក្នុង​រយៈ​ពេល {0} ថ្ងៃ"},"past":{"other":"{0} ថ្ងៃ​មុន"}}},"hour":{"displayName":"ម៉ោង","relativeTime":{"future":{"other":"ក្នុង​រយៈ​ពេល {0} ម៉ោង"},"past":{"other":"{0} ម៉ោង​មុន"}}},"minute":{"displayName":"នាទី","relativeTime":{"future":{"other":"ក្នុង​រយៈពេល {0} នាទី"},"past":{"other":"{0} នាទី​មុន"}}},"second":{"displayName":"វិនាទី","relative":{"0":"ឥឡូវ"},"relativeTime":{"future":{"other":"ក្នុង​រយៈពេល {0} វិនាទី"},"past":{"other":"{0} វិនាទី​មុន"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"km-KH","parentLocale":"km"});

HandlebarsIntl.__addLocaleData({"locale":"kn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<=1?"one":"other"},"fields":{"year":{"displayName":"ವರ್ಷ","relative":{"0":"ಈ ವರ್ಷ","1":"ಮುಂದಿನ ವರ್ಷ","-1":"ಕಳೆದ ವರ್ಷ"},"relativeTime":{"future":{"one":"{0} ವರ್ಷದಲ್ಲಿ","other":"{0} ವರ್ಷಗಳಲ್ಲಿ"},"past":{"one":"{0} ವರ್ಷದ ಹಿಂದೆ","other":"{0} ವರ್ಷಗಳ ಹಿಂದೆ"}}},"month":{"displayName":"ತಿಂಗಳು","relative":{"0":"ಈ ತಿಂಗಳು","1":"ಮುಂದಿನ ತಿಂಗಳು","-1":"ಕಳೆದ ತಿಂಗಳು"},"relativeTime":{"future":{"one":"{0} ತಿಂಗಳಲ್ಲಿ","other":"{0} ತಿಂಗಳುಗಳಲ್ಲಿ"},"past":{"one":"{0} ತಿಂಗಳುಗಳ ಹಿಂದೆ","other":"{0} ತಿಂಗಳುಗಳ ಹಿಂದೆ"}}},"day":{"displayName":"ದಿನ","relative":{"0":"ಇಂದು","1":"ನಾಳೆ","2":"ನಾಡಿದ್ದು","-1":"ನಿನ್ನೆ","-2":"ಮೊನ್ನೆ"},"relativeTime":{"future":{"one":"{0} ದಿನದಲ್ಲಿ","other":"{0} ದಿನಗಳಲ್ಲಿ"},"past":{"one":"{0} ದಿನದ ಹಿಂದೆ","other":"{0} ದಿನಗಳ ಹಿಂದೆ"}}},"hour":{"displayName":"ಗಂಟೆ","relativeTime":{"future":{"one":"{0} ಗಂಟೆಯಲ್ಲಿ","other":"{0} ಗಂಟೆಗಳಲ್ಲಿ"},"past":{"one":"{0} ಗಂಟೆ ಹಿಂದೆ","other":"{0} ಗಂಟೆಗಳ ಹಿಂದೆ"}}},"minute":{"displayName":"ನಿಮಿಷ","relativeTime":{"future":{"one":"{0} ನಿಮಿಷದಲ್ಲಿ","other":"{0} ನಿಮಿಷಗಳಲ್ಲಿ"},"past":{"one":"{0} ನಿಮಿಷಗಳ ಹಿಂದೆ","other":"{0} ನಿಮಿಷಗಳ ಹಿಂದೆ"}}},"second":{"displayName":"ಸೆಕೆಂಡ್","relative":{"0":"ಇದೀಗ"},"relativeTime":{"future":{"one":"{0} ಸೆಕೆಂಡ್‌ನಲ್ಲಿ","other":"{0} ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ"},"past":{"one":"{0} ಸೆಕೆಂಡ್ ಹಿಂದೆ","other":"{0} ಸೆಕೆಂಡುಗಳ ಹಿಂದೆ"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"kn-IN","parentLocale":"kn"});

HandlebarsIntl.__addLocaleData({"locale":"ko","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"년","relative":{"0":"올해","1":"내년","-1":"작년"},"relativeTime":{"future":{"other":"{0}년 후"},"past":{"other":"{0}년 전"}}},"month":{"displayName":"월","relative":{"0":"이번 달","1":"다음 달","-1":"지난달"},"relativeTime":{"future":{"other":"{0}개월 후"},"past":{"other":"{0}개월 전"}}},"day":{"displayName":"일","relative":{"0":"오늘","1":"내일","2":"모레","-1":"어제","-2":"그저께"},"relativeTime":{"future":{"other":"{0}일 후"},"past":{"other":"{0}일 전"}}},"hour":{"displayName":"시","relativeTime":{"future":{"other":"{0}시간 후"},"past":{"other":"{0}시간 전"}}},"minute":{"displayName":"분","relativeTime":{"future":{"other":"{0}분 후"},"past":{"other":"{0}분 전"}}},"second":{"displayName":"초","relative":{"0":"지금"},"relativeTime":{"future":{"other":"{0}초 후"},"past":{"other":"{0}초 전"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ko-KP","parentLocale":"ko"});
HandlebarsIntl.__addLocaleData({"locale":"ko-KR","parentLocale":"ko"});

HandlebarsIntl.__addLocaleData({"locale":"kok","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"kok-IN","parentLocale":"kok"});

HandlebarsIntl.__addLocaleData({"locale":"ks","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"ؤری","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"رٮ۪تھ","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"دۄہ","relative":{"0":"اَز","1":"پگاہ","-1":"راتھ"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"گٲنٛٹہٕ","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"مِنَٹ","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"سٮ۪کَنڑ","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ks-Arab","parentLocale":"ks"});
HandlebarsIntl.__addLocaleData({"locale":"ks-Arab-IN","parentLocale":"ks-Arab"});

HandlebarsIntl.__addLocaleData({"locale":"ksb","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Ng’waka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Ng’ezi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Siku","relative":{"0":"Evi eo","1":"Keloi","-1":"Ghuo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ksb-TZ","parentLocale":"ksb"});

HandlebarsIntl.__addLocaleData({"locale":"ksf","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Bǝk","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Ŋwíí","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ŋwós","relative":{"0":"Gɛ́ɛnǝ","1":"Ridúrǝ́","-1":"Rinkɔɔ́"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Cámɛɛn","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Mǝnít","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Háu","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ksf-CM","parentLocale":"ksf"});

HandlebarsIntl.__addLocaleData({"locale":"ksh","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0?"zero":n==1?"one":"other"},"fields":{"year":{"displayName":"Johr","relative":{"0":"diese Johr","1":"nächste Johr","-1":"läz Johr"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mohnd","relative":{"0":"diese Mohnd","1":"nächste Mohnd","-1":"lätzde Mohnd"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Daach","relative":{"0":"hück","1":"morje","2":"övvermorje","-1":"jestere","-2":"vörjestere"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Schtund","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Menutt","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekond","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ksh-DE","parentLocale":"ksh"});

HandlebarsIntl.__addLocaleData({"locale":"ku","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"kw","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"},"fields":{"year":{"displayName":"Bledhen","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mis","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Dedh","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Eur","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"kw-GB","parentLocale":"kw"});

HandlebarsIntl.__addLocaleData({"locale":"ky","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"жыл","relative":{"0":"быйыл","1":"эмдиги жылы","-1":"былтыр"},"relativeTime":{"future":{"one":"{0} жылдан кийин","other":"{0} жылдан кийин"},"past":{"one":"{0} жыл мурун","other":"{0} жыл мурун"}}},"month":{"displayName":"ай","relative":{"0":"бул айда","1":"эмдиги айда","-1":"өткөн айда"},"relativeTime":{"future":{"one":"{0} айдан кийин","other":"{0} айдан кийин"},"past":{"one":"{0} ай мурун","other":"{0} ай мурун"}}},"day":{"displayName":"күн","relative":{"0":"бүгүн","1":"эртеӊ","2":"бүрсүгүнү","-1":"кечээ","-2":"мурдагы күнү"},"relativeTime":{"future":{"one":"{0} күндөн кийин","other":"{0} күндөн кийин"},"past":{"one":"{0} күн мурун","other":"{0} күн мурун"}}},"hour":{"displayName":"саат","relativeTime":{"future":{"one":"{0} сааттан кийин","other":"{0} сааттан кийин"},"past":{"one":"{0} саат мурун","other":"{0} саат мурун"}}},"minute":{"displayName":"мүнөт","relativeTime":{"future":{"one":"{0} мүнөттөн кийин","other":"{0} мүнөттөн кийин"},"past":{"one":"{0} мүнөт мурун","other":"{0} мүнөт мурун"}}},"second":{"displayName":"секунд","relative":{"0":"азыр"},"relativeTime":{"future":{"one":"{0} секунддан кийин","other":"{0} секунддан кийин"},"past":{"one":"{0} секунд мурун","other":"{0} секунд мурун"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ky-Cyrl","parentLocale":"ky"});
HandlebarsIntl.__addLocaleData({"locale":"ky-Cyrl-KG","parentLocale":"ky-Cyrl"});

HandlebarsIntl.__addLocaleData({"locale":"lag","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0];if(ord)return"other";return n==0?"zero":(i==0||i==1)&&n!=0?"one":"other"},"fields":{"year":{"displayName":"Mwaáka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mweéri","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Sikʉ","relative":{"0":"Isikʉ","1":"Lamʉtoondo","-1":"Niijo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Sáa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakíka","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekúunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"lag-TZ","parentLocale":"lag"});

HandlebarsIntl.__addLocaleData({"locale":"lb","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Joer","relative":{"0":"dëst Joer","1":"nächst Joer","-1":"lescht Joer"},"relativeTime":{"future":{"one":"an {0} Joer","other":"a(n) {0} Joer"},"past":{"one":"virun {0} Joer","other":"viru(n) {0} Joer"}}},"month":{"displayName":"Mount","relative":{"0":"dëse Mount","1":"nächste Mount","-1":"leschte Mount"},"relativeTime":{"future":{"one":"an {0} Mount","other":"a(n) {0} Méint"},"past":{"one":"virun {0} Mount","other":"viru(n) {0} Méint"}}},"day":{"displayName":"Dag","relative":{"0":"haut","1":"muer","-1":"gëschter"},"relativeTime":{"future":{"one":"an {0} Dag","other":"a(n) {0} Deeg"},"past":{"one":"virun {0} Dag","other":"viru(n) {0} Deeg"}}},"hour":{"displayName":"Stonn","relativeTime":{"future":{"one":"an {0} Stonn","other":"a(n) {0} Stonnen"},"past":{"one":"virun {0} Stonn","other":"viru(n) {0} Stonnen"}}},"minute":{"displayName":"Minutt","relativeTime":{"future":{"one":"an {0} Minutt","other":"a(n) {0} Minutten"},"past":{"one":"virun {0} Minutt","other":"viru(n) {0} Minutten"}}},"second":{"displayName":"Sekonn","relative":{"0":"now"},"relativeTime":{"future":{"one":"an {0} Sekonn","other":"a(n) {0} Sekonnen"},"past":{"one":"virun {0} Sekonn","other":"viru(n) {0} Sekonnen"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"lb-LU","parentLocale":"lb"});

HandlebarsIntl.__addLocaleData({"locale":"lg","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Mwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mwezi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Lunaku","relative":{"0":"Lwaleero","1":"Nkya","-1":"Ggulo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saawa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakiika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Kasikonda","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"lg-UG","parentLocale":"lg"});

HandlebarsIntl.__addLocaleData({"locale":"lkt","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Ómakȟa","relative":{"0":"Lé ómakȟa kiŋ","1":"Tȟokáta ómakȟa kiŋháŋ","-1":"Ómakȟa kʼuŋ héhaŋ"},"relativeTime":{"future":{"other":"Letáŋhaŋ ómakȟa {0} kiŋháŋ"},"past":{"other":"Hékta ómakȟa {0} kʼuŋ héhaŋ"}}},"month":{"displayName":"Wí","relative":{"0":"Lé wí kiŋ","1":"Wí kiŋháŋ","-1":"Wí kʼuŋ héhaŋ"},"relativeTime":{"future":{"other":"Letáŋhaŋ wíyawapi {0} kiŋháŋ"},"past":{"other":"Hékta wíyawapi {0} kʼuŋ héhaŋ"}}},"day":{"displayName":"Aŋpétu","relative":{"0":"Lé aŋpétu kiŋ","1":"Híŋhaŋni kiŋháŋ","-1":"Lé aŋpétu kiŋ"},"relativeTime":{"future":{"other":"Letáŋhaŋ {0}-čháŋ kiŋháŋ"},"past":{"other":"Hékta {0}-čháŋ k’uŋ héhaŋ"}}},"hour":{"displayName":"Owápȟe","relativeTime":{"future":{"other":"Letáŋhaŋ owápȟe {0} kiŋháŋ"},"past":{"other":"Hékta owápȟe {0} kʼuŋ héhaŋ"}}},"minute":{"displayName":"Owápȟe oȟʼáŋkȟo","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Okpí","relative":{"0":"now"},"relativeTime":{"future":{"other":"Letáŋhaŋ okpí {0} kiŋháŋ"},"past":{"other":"Hékta okpí {0} k’uŋ héhaŋ"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"lkt-US","parentLocale":"lkt"});

HandlebarsIntl.__addLocaleData({"locale":"ln","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"},"fields":{"year":{"displayName":"Mobú","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Sánzá","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Mokɔlɔ","relative":{"0":"Lɛlɔ́","1":"Lóbi ekoyâ","-1":"Lóbi elékí"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Ngonga","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Monúti","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sɛkɔ́ndɛ","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ln-AO","parentLocale":"ln"});
HandlebarsIntl.__addLocaleData({"locale":"ln-CD","parentLocale":"ln"});
HandlebarsIntl.__addLocaleData({"locale":"ln-CF","parentLocale":"ln"});
HandlebarsIntl.__addLocaleData({"locale":"ln-CG","parentLocale":"ln"});

HandlebarsIntl.__addLocaleData({"locale":"lo","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":"other";return"other"},"fields":{"year":{"displayName":"ປີ","relative":{"0":"ປີນີ້","1":"ປີໜ້າ","-1":"ປີກາຍ"},"relativeTime":{"future":{"other":"ໃນອີກ {0} ປີ"},"past":{"other":"{0} ປີກ່ອນ"}}},"month":{"displayName":"ເດືອນ","relative":{"0":"ເດືອນນີ້","1":"ເດືອນໜ້າ","-1":"ເດືອນແລ້ວ"},"relativeTime":{"future":{"other":"ໃນອີກ {0} ເດືອນ"},"past":{"other":"{0} ເດືອນກ່ອນ"}}},"day":{"displayName":"ມື້","relative":{"0":"ມື້ນີ້","1":"ມື້ອື່ນ","2":"ມື້ຮື","-1":"ມື້ວານ","-2":"ມື້ກ່ອນ"},"relativeTime":{"future":{"other":"ໃນອີກ {0} ມື້"},"past":{"other":"{0} ມື້ກ່ອນ"}}},"hour":{"displayName":"ຊົ່ວໂມງ","relativeTime":{"future":{"other":"ໃນອີກ {0} ຊົ່ວໂມງ"},"past":{"other":"{0} ຊົ່ວໂມງກ່ອນ"}}},"minute":{"displayName":"ນາທີ","relativeTime":{"future":{"other":"{0} ໃນອີກ 0 ນາທີ"},"past":{"other":"{0} ນາທີກ່ອນ"}}},"second":{"displayName":"ວິນາທີ","relative":{"0":"ຕອນນີ້"},"relativeTime":{"future":{"other":"ໃນອີກ {0} ວິນາທີ"},"past":{"other":"{0} ວິນາທີກ່ອນ"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"lo-LA","parentLocale":"lo"});

HandlebarsIntl.__addLocaleData({"locale":"lt","pluralRuleFunction":function (n,ord){var s=String(n).split("."),f=s[1]||"",t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return"other";return n10==1&&(n100<11||n100>19)?"one":n10>=2&&n10<=9&&(n100<11||n100>19)?"few":f!=0?"many":"other"},"fields":{"year":{"displayName":"Metai","relative":{"0":"šiais metais","1":"kitais metais","-1":"praėjusiais metais"},"relativeTime":{"future":{"one":"po {0} metų","few":"po {0} metų","many":"po {0} metų","other":"po {0} metų"},"past":{"one":"prieš {0} metus","few":"prieš {0} metus","many":"prieš {0} metų","other":"prieš {0} metų"}}},"month":{"displayName":"Mėnuo","relative":{"0":"šį mėnesį","1":"kitą mėnesį","-1":"praėjusį mėnesį"},"relativeTime":{"future":{"one":"po {0} mėnesio","few":"po {0} mėnesių","many":"po {0} mėnesio","other":"po {0} mėnesių"},"past":{"one":"prieš {0} mėnesį","few":"prieš {0} mėnesius","many":"prieš {0} mėnesio","other":"prieš {0} mėnesių"}}},"day":{"displayName":"Diena","relative":{"0":"šiandien","1":"rytoj","2":"poryt","-1":"vakar","-2":"užvakar"},"relativeTime":{"future":{"one":"po {0} dienos","few":"po {0} dienų","many":"po {0} dienos","other":"po {0} dienų"},"past":{"one":"prieš {0} dieną","few":"prieš {0} dienas","many":"prieš {0} dienos","other":"prieš {0} dienų"}}},"hour":{"displayName":"Valanda","relativeTime":{"future":{"one":"po {0} valandos","few":"po {0} valandų","many":"po {0} valandos","other":"po {0} valandų"},"past":{"one":"prieš {0} valandą","few":"prieš {0} valandas","many":"prieš {0} valandos","other":"prieš {0} valandų"}}},"minute":{"displayName":"Minutė","relativeTime":{"future":{"one":"po {0} minutės","few":"po {0} minučių","many":"po {0} minutės","other":"po {0} minučių"},"past":{"one":"prieš {0} minutę","few":"prieš {0} minutes","many":"prieš {0} minutės","other":"prieš {0} minučių"}}},"second":{"displayName":"Sekundė","relative":{"0":"dabar"},"relativeTime":{"future":{"one":"po {0} sekundės","few":"po {0} sekundžių","many":"po {0} sekundės","other":"po {0} sekundžių"},"past":{"one":"prieš {0} sekundę","few":"prieš {0} sekundes","many":"prieš {0} sekundės","other":"prieš {0} sekundžių"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"lt-LT","parentLocale":"lt"});

HandlebarsIntl.__addLocaleData({"locale":"lu","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Tshidimu","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Ngondo","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Dituku","relative":{"0":"Lelu","1":"Malaba","-1":"Makelela"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Diba","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Kasunsu","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Kasunsukusu","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"lu-CD","parentLocale":"lu"});

HandlebarsIntl.__addLocaleData({"locale":"luo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"higa","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"dwe","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"chieng’","relative":{"0":"kawuono","1":"kiny","-1":"nyoro"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"saa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"dakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"nyiriri mar saa","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"luo-KE","parentLocale":"luo"});

HandlebarsIntl.__addLocaleData({"locale":"luy","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Muhiga","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mweri","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ridiku","relative":{"0":"Lero","1":"Mgamba","-1":"Mgorova"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Isaa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Idagika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"luy-KE","parentLocale":"luy"});

HandlebarsIntl.__addLocaleData({"locale":"lv","pluralRuleFunction":function (n,ord){var s=String(n).split("."),f=s[1]||"",v=f.length,t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2),f100=f.slice(-2),f10=f.slice(-1);if(ord)return"other";return t0&&n10==0||n100>=11&&n100<=19||v==2&&(f100>=11&&f100<=19)?"zero":n10==1&&n100!=11||v==2&&f10==1&&f100!=11||v!=2&&f10==1?"one":"other"},"fields":{"year":{"displayName":"Gads","relative":{"0":"šajā gadā","1":"nākamajā gadā","-1":"pagājušajā gadā"},"relativeTime":{"future":{"zero":"pēc {0} gadiem","one":"pēc {0} gada","other":"pēc {0} gadiem"},"past":{"zero":"pirms {0} gadiem","one":"pirms {0} gada","other":"pirms {0} gadiem"}}},"month":{"displayName":"Mēnesis","relative":{"0":"šajā mēnesī","1":"nākamajā mēnesī","-1":"pagājušajā mēnesī"},"relativeTime":{"future":{"zero":"pēc {0} mēnešiem","one":"pēc {0} mēneša","other":"pēc {0} mēnešiem"},"past":{"zero":"pirms {0} mēnešiem","one":"pirms {0} mēneša","other":"pirms {0} mēnešiem"}}},"day":{"displayName":"diena","relative":{"0":"šodien","1":"rīt","2":"parīt","-1":"vakar","-2":"aizvakar"},"relativeTime":{"future":{"zero":"pēc {0} dienām","one":"pēc {0} dienas","other":"pēc {0} dienām"},"past":{"zero":"pirms {0} dienām","one":"pirms {0} dienas","other":"pirms {0} dienām"}}},"hour":{"displayName":"Stundas","relativeTime":{"future":{"zero":"pēc {0} stundām","one":"pēc {0} stundas","other":"pēc {0} stundām"},"past":{"zero":"pirms {0} stundām","one":"pirms {0} stundas","other":"pirms {0} stundām"}}},"minute":{"displayName":"Minūtes","relativeTime":{"future":{"zero":"pēc {0} minūtēm","one":"pēc {0} minūtes","other":"pēc {0} minūtēm"},"past":{"zero":"pirms {0} minūtēm","one":"pirms {0} minūtes","other":"pirms {0} minūtēm"}}},"second":{"displayName":"Sekundes","relative":{"0":"tagad"},"relativeTime":{"future":{"zero":"pēc {0} sekundēm","one":"pēc {0} sekundes","other":"pēc {0} sekundēm"},"past":{"zero":"pirms {0} sekundēm","one":"pirms {0} sekundes","other":"pirms {0} sekundēm"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"lv-LV","parentLocale":"lv"});

HandlebarsIntl.__addLocaleData({"locale":"mas","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Ɔlárì","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Ɔlápà","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ɛnkɔlɔ́ŋ","relative":{"0":"Táatá","1":"Tááisérè","-1":"Ŋolé"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Ɛ́sáâ","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Oldákikaè","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"mas-KE","parentLocale":"mas"});
HandlebarsIntl.__addLocaleData({"locale":"mas-TZ","parentLocale":"mas"});

HandlebarsIntl.__addLocaleData({"locale":"mer","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Mwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mweri","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ntukũ","relative":{"0":"Narua","1":"Rũjũ","-1":"Ĩgoro"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Ĩthaa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Ndagika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekondi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"mer-KE","parentLocale":"mer"});

HandlebarsIntl.__addLocaleData({"locale":"mfe","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Lane","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mwa","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Zour","relative":{"0":"Zordi","1":"Demin","-1":"Yer"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Ler","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minit","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Segonn","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"mfe-MU","parentLocale":"mfe"});

HandlebarsIntl.__addLocaleData({"locale":"mg","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"},"fields":{"year":{"displayName":"Taona","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Volana","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Andro","relative":{"0":"Anio","1":"Rahampitso","-1":"Omaly"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Ora","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minitra","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Segondra","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"mg-MG","parentLocale":"mg"});

HandlebarsIntl.__addLocaleData({"locale":"mgh","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"yaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"mweri","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"nihuku","relative":{"0":"lel’lo","1":"me’llo","-1":"n’chana"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"isaa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"idakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"isekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"mgh-MZ","parentLocale":"mgh"});

HandlebarsIntl.__addLocaleData({"locale":"mgo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"fituʼ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"iməg","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"+{0} m","other":"+{0} m"},"past":{"one":"-{0} m","other":"-{0} m"}}},"day":{"displayName":"anəg","relative":{"0":"tèchɔ̀ŋ","1":"isu","2":"isu ywi","-1":"ikwiri"},"relativeTime":{"future":{"one":"+{0} d","other":"+{0} d"},"past":{"one":"-{0} d","other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"one":"+{0} h","other":"+{0} h"},"past":{"one":"-{0} h","other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"one":"+{0} min","other":"+{0} min"},"past":{"one":"-{0} min","other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"one":"+{0} s","other":"+{0} s"},"past":{"one":"-{0} s","other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"mgo-CM","parentLocale":"mgo"});

HandlebarsIntl.__addLocaleData({"locale":"mk","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),i100=i.slice(-2),f10=f.slice(-1);if(ord)return i10==1&&i100!=11?"one":i10==2&&i100!=12?"two":(i10==7||i10==8)&&i100!=17&&i100!=18?"many":"other";return v0&&i10==1||f10==1?"one":"other"},"fields":{"year":{"displayName":"година","relative":{"0":"оваа година","1":"следната година","-1":"минатата година"},"relativeTime":{"future":{"one":"за {0} година","other":"за {0} години"},"past":{"one":"пред {0} година","other":"пред {0} години"}}},"month":{"displayName":"Месец","relative":{"0":"овој месец","1":"следниот месец","-1":"минатиот месец"},"relativeTime":{"future":{"one":"за {0} месец","other":"за {0} месеци"},"past":{"one":"пред {0} месец","other":"пред {0} месеци"}}},"day":{"displayName":"ден","relative":{"0":"денес","1":"утре","2":"задутре","-1":"вчера","-2":"завчера"},"relativeTime":{"future":{"one":"за {0} ден","other":"за {0} дена"},"past":{"one":"пред {0} ден","other":"пред {0} дена"}}},"hour":{"displayName":"Час","relativeTime":{"future":{"one":"за {0} час","other":"за {0} часа"},"past":{"one":"пред {0} час","other":"пред {0} часа"}}},"minute":{"displayName":"Минута","relativeTime":{"future":{"one":"за {0} минута","other":"за {0} минути"},"past":{"one":"пред {0} минута","other":"пред {0} минути"}}},"second":{"displayName":"Секунда","relative":{"0":"сега"},"relativeTime":{"future":{"one":"за {0} секунда","other":"за {0} секунди"},"past":{"one":"пред {0} секунда","other":"пред {0} секунди"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"mk-MK","parentLocale":"mk"});

HandlebarsIntl.__addLocaleData({"locale":"ml","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"വർഷം","relative":{"0":"ഈ വർ‌ഷം","1":"അടുത്തവർഷം","-1":"കഴിഞ്ഞ വർഷം"},"relativeTime":{"future":{"one":"{0} വർഷത്തിൽ","other":"{0} വർഷത്തിൽ"},"past":{"one":"{0} വർഷം മുമ്പ്","other":"{0} വർഷം മുമ്പ്"}}},"month":{"displayName":"മാസം","relative":{"0":"ഈ മാസം","1":"അടുത്ത മാസം","-1":"കഴിഞ്ഞ മാസം"},"relativeTime":{"future":{"one":"{0} മാസത്തിൽ","other":"{0} മാസത്തിൽ"},"past":{"one":"{0} മാസം മുമ്പ്","other":"{0} മാസം മുമ്പ്"}}},"day":{"displayName":"ദിവസം","relative":{"0":"ഇന്ന്","1":"നാളെ","2":"മറ്റന്നാൾ","-1":"ഇന്നലെ","-2":"മിനിഞ്ഞാന്ന്"},"relativeTime":{"future":{"one":"{0} ദിവസത്തിൽ","other":"{0} ദിവസത്തിൽ"},"past":{"one":"{0} ദിവസം മുമ്പ്","other":"{0} ദിവസം മുമ്പ്"}}},"hour":{"displayName":"മണിക്കൂർ","relativeTime":{"future":{"one":"{0} മണിക്കൂറിൽ","other":"{0} മണിക്കൂറിൽ"},"past":{"one":"{0} മണിക്കൂർ മുമ്പ്","other":"{0} മണിക്കൂർ മുമ്പ്"}}},"minute":{"displayName":"മിനിട്ട്","relativeTime":{"future":{"one":"{0} മിനിറ്റിൽ","other":"{0} മിനിറ്റിൽ"},"past":{"one":"{0} മിനിറ്റ് മുമ്പ്","other":"{0} മിനിറ്റ് മുമ്പ്"}}},"second":{"displayName":"സെക്കൻറ്","relative":{"0":"ഇപ്പോൾ"},"relativeTime":{"future":{"one":"{0} സെക്കൻഡിൽ","other":"{0} സെക്കൻഡിൽ"},"past":{"one":"{0} സെക്കൻഡ് മുമ്പ്","other":"{0} സെക്കൻഡ് മുമ്പ്"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ml-IN","parentLocale":"ml"});

HandlebarsIntl.__addLocaleData({"locale":"mn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Жил","relative":{"0":"энэ жил","1":"ирэх жил","-1":"өнгөрсөн жил"},"relativeTime":{"future":{"one":"{0} жилийн дараа","other":"{0} жилийн дараа"},"past":{"one":"{0} жилийн өмнө","other":"{0} жилийн өмнө"}}},"month":{"displayName":"Сар","relative":{"0":"энэ сар","1":"ирэх сар","-1":"өнгөрсөн сар"},"relativeTime":{"future":{"one":"{0} сарын дараа","other":"{0} сарын дараа"},"past":{"one":"{0} сарын өмнө","other":"{0} сарын өмнө"}}},"day":{"displayName":"Өдөр","relative":{"0":"өнөөдөр","1":"маргааш","2":"нөгөөдөр","-1":"өчигдөр","-2":"уржигдар"},"relativeTime":{"future":{"one":"{0} өдрийн дараа","other":"{0} өдрийн дараа"},"past":{"one":"{0} өдрийн өмнө","other":"{0} өдрийн өмнө"}}},"hour":{"displayName":"Цаг","relativeTime":{"future":{"one":"{0} цагийн дараа","other":"{0} цагийн дараа"},"past":{"one":"{0} цагийн өмнө","other":"{0} цагийн өмнө"}}},"minute":{"displayName":"Минут","relativeTime":{"future":{"one":"{0} минутын дараа","other":"{0} минутын дараа"},"past":{"one":"{0} минутын өмнө","other":"{0} минутын өмнө"}}},"second":{"displayName":"Секунд","relative":{"0":"Одоо"},"relativeTime":{"future":{"one":"{0} секундын дараа","other":"{0} секундын дараа"},"past":{"one":"{0} секундын өмнө","other":"{0} секундын өмнө"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"mn-Cyrl","parentLocale":"mn"});
HandlebarsIntl.__addLocaleData({"locale":"mn-Cyrl-MN","parentLocale":"mn-Cyrl"});
HandlebarsIntl.__addLocaleData({"locale":"mn-Mong","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"mo","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n100=t0&&s[0].slice(-2);if(ord)return n==1?"one":"other";return n==1&&v0?"one":!v0||n==0||n!=1&&(n100>=1&&n100<=19)?"few":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"mr","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":n==2||n==3?"two":n==4?"few":"other";return n>=0&&n<=1?"one":"other"},"fields":{"year":{"displayName":"वर्ष","relative":{"0":"हे वर्ष","1":"पुढील वर्ष","-1":"मागील वर्ष"},"relativeTime":{"future":{"one":"{0} वर्षामध्ये","other":"{0} वर्षांमध्ये"},"past":{"one":"{0} वर्षापूर्वी","other":"{0} वर्षांपूर्वी"}}},"month":{"displayName":"महिना","relative":{"0":"हा महिना","1":"पुढील महिना","-1":"मागील महिना"},"relativeTime":{"future":{"one":"{0} महिन्यामध्ये","other":"{0} महिन्यांमध्ये"},"past":{"one":"{0} महिन्यापूर्वी","other":"{0} महिन्यांपूर्वी"}}},"day":{"displayName":"दिवस","relative":{"0":"आज","1":"उद्या","-1":"काल"},"relativeTime":{"future":{"one":"{0} दिवसामध्ये","other":"{0} दिवसांमध्ये"},"past":{"one":"{0} दिवसापूर्वी","other":"{0} दिवसांपूर्वी"}}},"hour":{"displayName":"तास","relativeTime":{"future":{"one":"{0} तासामध्ये","other":"{0} तासांमध्ये"},"past":{"one":"{0} तासापूर्वी","other":"{0} तासांपूर्वी"}}},"minute":{"displayName":"मिनिट","relativeTime":{"future":{"one":"{0} मिनिटामध्ये","other":"{0} मिनिटांमध्ये"},"past":{"one":"{0} मिनिटापूर्वी","other":"{0} मिनिटांपूर्वी"}}},"second":{"displayName":"सेकंद","relative":{"0":"आत्ता"},"relativeTime":{"future":{"one":"{0} सेकंदामध्ये","other":"{0} सेकंदांमध्ये"},"past":{"one":"{0} सेकंदापूर्वी","other":"{0} सेकंदांपूर्वी"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"mr-IN","parentLocale":"mr"});

HandlebarsIntl.__addLocaleData({"locale":"ms","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":"other";return"other"},"fields":{"year":{"displayName":"Tahun","relative":{"0":"tahun ini","1":"tahun depan","-1":"tahun lepas"},"relativeTime":{"future":{"other":"dalam {0} saat"},"past":{"other":"{0} tahun lalu"}}},"month":{"displayName":"Bulan","relative":{"0":"bulan ini","1":"bulan depan","-1":"bulan lalu"},"relativeTime":{"future":{"other":"dalam {0} bulan"},"past":{"other":"{0} bulan lalu"}}},"day":{"displayName":"Hari","relative":{"0":"hari ini","1":"esok","2":"lusa","-1":"semalam","-2":"kelmarin"},"relativeTime":{"future":{"other":"dalam {0} hari"},"past":{"other":"{0} hari lalu"}}},"hour":{"displayName":"Jam","relativeTime":{"future":{"other":"dalam {0} jam"},"past":{"other":"{0} jam yang lalu"}}},"minute":{"displayName":"Minit","relativeTime":{"future":{"other":"dalam {0} minit"},"past":{"other":"{0} minit yang lalu"}}},"second":{"displayName":"Saat","relative":{"0":"sekarang"},"relativeTime":{"future":{"other":"dalam {0} saat"},"past":{"other":"{0} saat lalu"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ms-Arab","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ms-Latn","parentLocale":"ms"});
HandlebarsIntl.__addLocaleData({"locale":"ms-Latn-BN","parentLocale":"ms-Latn"});
HandlebarsIntl.__addLocaleData({"locale":"ms-Latn-MY","parentLocale":"ms-Latn"});
HandlebarsIntl.__addLocaleData({"locale":"ms-Latn-SG","parentLocale":"ms-Latn"});

HandlebarsIntl.__addLocaleData({"locale":"mt","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n100=t0&&s[0].slice(-2);if(ord)return"other";return n==1?"one":n==0||n100>=2&&n100<=10?"few":n100>=11&&n100<=19?"many":"other"},"fields":{"year":{"displayName":"Sena","relative":{"0":"Din is-sena","1":"Is-sena d-dieħla","-1":"Is-sena li għaddiet"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"one":"{0} sena ilu","few":"{0} snin ilu","many":"{0} snin ilu","other":"{0} snin ilu"}}},"month":{"displayName":"Xahar","relative":{"0":"Dan ix-xahar","1":"Ix-xahar id-dieħel","-1":"Ix-xahar li għadda"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Jum","relative":{"0":"Illum","1":"Għada","-1":"Ilbieraħ"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Siegħa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minuta","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekonda","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"mt-MT","parentLocale":"mt"});

HandlebarsIntl.__addLocaleData({"locale":"mua","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Syii","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Fĩi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Zah’nane\u002F Comme","relative":{"0":"Tǝ’nahko","1":"Tǝ’nane","-1":"Tǝsoo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Cok comme","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Cok comme ma laŋne","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Cok comme ma laŋ tǝ biŋ","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"mua-CM","parentLocale":"mua"});

HandlebarsIntl.__addLocaleData({"locale":"my","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"နှစ်","relative":{"0":"ယခုနှစ်","1":"နောက်နှစ်","-1":"ယမန်နှစ်"},"relativeTime":{"future":{"other":"{0}နှစ်အတွင်း"},"past":{"other":"လွန်ခဲ့သော{0}နှစ်"}}},"month":{"displayName":"လ","relative":{"0":"ယခုလ","1":"နောက်လ","-1":"ယမန်လ"},"relativeTime":{"future":{"other":"{0}လအတွင်း"},"past":{"other":"လွန်ခဲ့သော{0}လ"}}},"day":{"displayName":"ရက်","relative":{"0":"ယနေ့","1":"မနက်ဖြန်","2":"သဘက်ခါ","-1":"မနေ့က","-2":"တနေ့က"},"relativeTime":{"future":{"other":"{0}ရက်အတွင်း"},"past":{"other":"လွန်ခဲ့သော{0}ရက်"}}},"hour":{"displayName":"နာရီ","relativeTime":{"future":{"other":"{0}နာရီအတွင်း"},"past":{"other":"လွန်ခဲ့သော{0}နာရီ"}}},"minute":{"displayName":"မိနစ်","relativeTime":{"future":{"other":"{0}မိနစ်အတွင်း"},"past":{"other":"လွန်ခဲ့သော{0}မိနစ်"}}},"second":{"displayName":"စက္ကန့်","relative":{"0":"ယခု"},"relativeTime":{"future":{"other":"{0}စက္ကန့်အတွင်း"},"past":{"other":"လွန်ခဲ့သော{0}စက္ကန့်"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"my-MM","parentLocale":"my"});

HandlebarsIntl.__addLocaleData({"locale":"nah","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"naq","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"},"fields":{"year":{"displayName":"Kurib","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"ǁKhâb","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Tsees","relative":{"0":"Neetsee","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Iiri","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Haib","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"ǀGâub","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"naq-NA","parentLocale":"naq"});

HandlebarsIntl.__addLocaleData({"locale":"nb","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"År","relative":{"0":"i år","1":"neste år","-1":"i fjor"},"relativeTime":{"future":{"one":"om {0} år","other":"om {0} år"},"past":{"one":"for {0} år siden","other":"for {0} år siden"}}},"month":{"displayName":"Måned","relative":{"0":"denne måneden","1":"neste måned","-1":"forrige måned"},"relativeTime":{"future":{"one":"om {0} måned","other":"om {0} måneder"},"past":{"one":"for {0} måned siden","other":"for {0} måneder siden"}}},"day":{"displayName":"Dag","relative":{"0":"i dag","1":"i morgen","2":"i overmorgen","-1":"i går","-2":"i forgårs"},"relativeTime":{"future":{"one":"om {0} døgn","other":"om {0} døgn"},"past":{"one":"for {0} døgn siden","other":"for {0} døgn siden"}}},"hour":{"displayName":"Time","relativeTime":{"future":{"one":"om {0} time","other":"om {0} timer"},"past":{"one":"for {0} time siden","other":"for {0} timer siden"}}},"minute":{"displayName":"Minutt","relativeTime":{"future":{"one":"om {0} minutt","other":"om {0} minutter"},"past":{"one":"for {0} minutt siden","other":"for {0} minutter siden"}}},"second":{"displayName":"Sekund","relative":{"0":"nå"},"relativeTime":{"future":{"one":"om {0} sekund","other":"om {0} sekunder"},"past":{"one":"for {0} sekund siden","other":"for {0} sekunder siden"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"nb-NO","parentLocale":"nb"});
HandlebarsIntl.__addLocaleData({"locale":"nb-SJ","parentLocale":"nb"});

HandlebarsIntl.__addLocaleData({"locale":"nd","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Umnyaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Inyangacale","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ilanga","relative":{"0":"Lamuhla","1":"Kusasa","-1":"Izolo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Ihola","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Umuzuzu","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Isekendi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"nd-ZW","parentLocale":"nd"});

HandlebarsIntl.__addLocaleData({"locale":"ne","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return t0&&n>=1&&n<=4?"one":"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"बर्ष","relative":{"0":"यो वर्ष","1":"अर्को वर्ष","-1":"पहिलो वर्ष"},"relativeTime":{"future":{"one":"{0} वर्षमा","other":"{0} वर्षमा"},"past":{"one":"{0} वर्ष अघि","other":"{0} वर्ष अघि"}}},"month":{"displayName":"महिना","relative":{"0":"यो महिना","1":"अर्को महिना","-1":"गएको महिना"},"relativeTime":{"future":{"one":"{0} महिनामा","other":"{0} महिनामा"},"past":{"one":"{0} महिना पहिले","other":"{0} महिना पहिले"}}},"day":{"displayName":"बार","relative":{"0":"आज","1":"भोली","-1":"हिजो","-2":"अस्ति"},"relativeTime":{"future":{"one":"{0} दिनमा","other":"{0} दिनमा"},"past":{"one":"{0} दिन पहिले","other":"{0} दिन पहिले"}}},"hour":{"displayName":"घण्टा","relativeTime":{"future":{"one":"{0} घण्टामा","other":"{0} घण्टामा"},"past":{"one":"{0} घण्टा पहिले","other":"{0} घण्टा पहिले"}}},"minute":{"displayName":"मिनेट","relativeTime":{"future":{"one":"{0} मिनेटमा","other":"{0} मिनेटमा"},"past":{"one":"{0} मिनेट पहिले","other":"{0} मिनेट पहिले"}}},"second":{"displayName":"दोस्रो","relative":{"0":"अब"},"relativeTime":{"future":{"one":"{0} सेकेण्डमा","other":"{0} सेकेण्डमा"},"past":{"one":"{0} सेकेण्ड पहिले","other":"{0} सेकेण्ड पहिले"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ne-IN","parentLocale":"ne","fields":{"year":{"displayName":"वर्ष","relative":{"0":"यो वर्ष","1":"अर्को वर्ष","-1":"पहिलो वर्ष"},"relativeTime":{"future":{"one":"{0} वर्षमा","other":"{0} वर्षमा"},"past":{"one":"{0} वर्ष अघि","other":"{0} वर्ष अघि"}}},"month":{"displayName":"महिना","relative":{"0":"यो महिना","1":"अर्को महिना","-1":"गएको महिना"},"relativeTime":{"future":{"one":"{0} महिनामा","other":"{0} महिनामा"},"past":{"one":"{0} महिना पहिले","other":"{0} महिना पहिले"}}},"day":{"displayName":"वार","relative":{"0":"आज","1":"भोली","2":"पर्सि","-1":"हिजो","-2":"अस्ति"},"relativeTime":{"future":{"one":"{0} दिनमा","other":"{0} दिनमा"},"past":{"one":"{0} दिन पहिले","other":"{0} दिन पहिले"}}},"hour":{"displayName":"घण्टा","relativeTime":{"future":{"one":"{0} घण्टामा","other":"{0} घण्टामा"},"past":{"one":"{0} घण्टा पहिले","other":"{0} घण्टा पहिले"}}},"minute":{"displayName":"मिनेट","relativeTime":{"future":{"one":"{0} मिनेटमा","other":"{0} मिनेटमा"},"past":{"one":"{0} मिनेट पहिले","other":"{0} मिनेट पहिले"}}},"second":{"displayName":"सेकेन्ड","relative":{"0":"अब"},"relativeTime":{"future":{"one":"{0} सेकेण्डमा","other":"{0} सेकेण्डमा"},"past":{"one":"{0} सेकेण्ड पहिले","other":"{0} सेकेण्ड पहिले"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ne-NP","parentLocale":"ne"});

HandlebarsIntl.__addLocaleData({"locale":"nl","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Jaar","relative":{"0":"dit jaar","1":"volgend jaar","-1":"vorig jaar"},"relativeTime":{"future":{"one":"over {0} jaar","other":"over {0} jaar"},"past":{"one":"{0} jaar geleden","other":"{0} jaar geleden"}}},"month":{"displayName":"Maand","relative":{"0":"deze maand","1":"volgende maand","-1":"vorige maand"},"relativeTime":{"future":{"one":"over {0} maand","other":"over {0} maanden"},"past":{"one":"{0} maand geleden","other":"{0} maanden geleden"}}},"day":{"displayName":"Dag","relative":{"0":"vandaag","1":"morgen","2":"overmorgen","-1":"gisteren","-2":"eergisteren"},"relativeTime":{"future":{"one":"over {0} dag","other":"over {0} dagen"},"past":{"one":"{0} dag geleden","other":"{0} dagen geleden"}}},"hour":{"displayName":"Uur","relativeTime":{"future":{"one":"over {0} uur","other":"over {0} uur"},"past":{"one":"{0} uur geleden","other":"{0} uur geleden"}}},"minute":{"displayName":"Minuut","relativeTime":{"future":{"one":"over {0} minuut","other":"over {0} minuten"},"past":{"one":"{0} minuut geleden","other":"{0} minuten geleden"}}},"second":{"displayName":"Seconde","relative":{"0":"nu"},"relativeTime":{"future":{"one":"over {0} seconde","other":"over {0} seconden"},"past":{"one":"{0} seconde geleden","other":"{0} seconden geleden"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"nl-AW","parentLocale":"nl"});
HandlebarsIntl.__addLocaleData({"locale":"nl-BE","parentLocale":"nl"});
HandlebarsIntl.__addLocaleData({"locale":"nl-BQ","parentLocale":"nl"});
HandlebarsIntl.__addLocaleData({"locale":"nl-CW","parentLocale":"nl"});
HandlebarsIntl.__addLocaleData({"locale":"nl-NL","parentLocale":"nl"});
HandlebarsIntl.__addLocaleData({"locale":"nl-SR","parentLocale":"nl"});
HandlebarsIntl.__addLocaleData({"locale":"nl-SX","parentLocale":"nl"});

HandlebarsIntl.__addLocaleData({"locale":"nmg","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Mbvu","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Ngwɛn","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Duö","relative":{"0":"Dɔl","1":"Namáná","-1":"Nakugú"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Wulā","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Mpálâ","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Nyiɛl","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"nmg-CM","parentLocale":"nmg"});

HandlebarsIntl.__addLocaleData({"locale":"nn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"år","relative":{"0":"dette år","1":"neste år","-1":"i fjor"},"relativeTime":{"future":{"one":"om {0} år","other":"om {0} år"},"past":{"one":"for {0} år siden","other":"for {0} år siden"}}},"month":{"displayName":"månad","relative":{"0":"denne månad","1":"neste månad","-1":"forrige månad"},"relativeTime":{"future":{"one":"om {0} måned","other":"om {0} måneder"},"past":{"one":"for {0} måned siden","other":"for {0} måneder siden"}}},"day":{"displayName":"dag","relative":{"0":"i dag","1":"i morgon","2":"i overmorgon","-1":"i går","-2":"i forgårs"},"relativeTime":{"future":{"one":"om {0} døgn","other":"om {0} døgn"},"past":{"one":"for {0} døgn siden","other":"for {0} døgn siden"}}},"hour":{"displayName":"time","relativeTime":{"future":{"one":"om {0} time","other":"om {0} timer"},"past":{"one":"for {0} time siden","other":"for {0} timer siden"}}},"minute":{"displayName":"minutt","relativeTime":{"future":{"one":"om {0} minutt","other":"om {0} minutter"},"past":{"one":"for {0} minutt siden","other":"for {0} minutter siden"}}},"second":{"displayName":"sekund","relative":{"0":"now"},"relativeTime":{"future":{"one":"om {0} sekund","other":"om {0} sekunder"},"past":{"one":"for {0} sekund siden","other":"for {0} sekunder siden"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"nn-NO","parentLocale":"nn"});

HandlebarsIntl.__addLocaleData({"locale":"nnh","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"ngùʼ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"lyɛ̌ʼ","relative":{"0":"lyɛ̌ʼɔɔn","1":"jǔɔ gẅie à ne ntóo","-1":"jǔɔ gẅie à ka tɔ̌g"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"fʉ̀ʼ nèm","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"nnh-CM","parentLocale":"nnh"});

HandlebarsIntl.__addLocaleData({"locale":"no","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"nqo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"nr","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"nr-ZA","parentLocale":"nr"});

HandlebarsIntl.__addLocaleData({"locale":"nso","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"nso-ZA","parentLocale":"nso"});

HandlebarsIntl.__addLocaleData({"locale":"nus","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Ruɔ̱n","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Pay","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Cäŋ","relative":{"0":"Walɛ","1":"Ruun","-1":"Pan"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Thaak","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minit","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Thɛkɛni","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"nus-SD","parentLocale":"nus"});

HandlebarsIntl.__addLocaleData({"locale":"ny","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"nyn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Omwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Omwezi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Eizooba","relative":{"0":"Erizooba","1":"Nyenkyakare","-1":"Nyomwabazyo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Shaaha","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Edakiika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Obucweka\u002FEsekendi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"nyn-UG","parentLocale":"nyn"});

HandlebarsIntl.__addLocaleData({"locale":"om","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"om-ET","parentLocale":"om"});
HandlebarsIntl.__addLocaleData({"locale":"om-KE","parentLocale":"om"});

HandlebarsIntl.__addLocaleData({"locale":"or","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"or-IN","parentLocale":"or"});

HandlebarsIntl.__addLocaleData({"locale":"os","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Аз","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Мӕй","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Бон","relative":{"0":"Абон","1":"Сом","2":"Иннӕбон","-1":"Знон","-2":"Ӕндӕрӕбон"},"relativeTime":{"future":{"one":"{0} боны фӕстӕ","other":"{0} боны фӕстӕ"},"past":{"one":"{0} бон раздӕр","other":"{0} боны размӕ"}}},"hour":{"displayName":"Сахат","relativeTime":{"future":{"one":"{0} сахаты фӕстӕ","other":"{0} сахаты фӕстӕ"},"past":{"one":"{0} сахаты размӕ","other":"{0} сахаты размӕ"}}},"minute":{"displayName":"Минут","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Секунд","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"os-GE","parentLocale":"os"});
HandlebarsIntl.__addLocaleData({"locale":"os-RU","parentLocale":"os"});

HandlebarsIntl.__addLocaleData({"locale":"pa","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"},"fields":{"year":{"displayName":"ਸਾਲ","relative":{"0":"ਇਹ ਸਾਲ","1":"ਅਗਲਾ ਸਾਲ","-1":"ਪਿਛਲਾ ਸਾਲ"},"relativeTime":{"future":{"one":"{0} ਸਾਲ ਵਿੱਚ","other":"{0} ਸਾਲਾਂ ਵਿੱਚ"},"past":{"one":"{0} ਸਾਲ ਪਹਿਲਾਂ","other":"{0} ਸਾਲ ਪਹਿਲਾਂ"}}},"month":{"displayName":"ਮਹੀਨਾ","relative":{"0":"ਇਹ ਮਹੀਨਾ","1":"ਅਗਲਾ ਮਹੀਨਾ","-1":"ਪਿਛਲਾ ਮਹੀਨਾ"},"relativeTime":{"future":{"one":"{0} ਮਹੀਨੇ ਵਿੱਚ","other":"{0} ਮਹੀਨਿਆਂ ਵਿੱਚ"},"past":{"one":"{0} ਮਹੀਨੇ ਪਹਿਲਾਂ","other":"{0} ਮਹੀਨੇ ਪਹਿਲਾਂ"}}},"day":{"displayName":"ਦਿਨ","relative":{"0":"ਅੱਜ","1":"ਭਲਕੇ","-1":"ਬੀਤਿਆ ਕੱਲ੍ਹ"},"relativeTime":{"future":{"one":"{0} ਦਿਨ ਵਿੱਚ","other":"{0} ਦਿਨਾਂ ਵਿੱਚ"},"past":{"one":"{0} ਦਿਨ ਪਹਿਲਾਂ","other":"{0} ਦਿਨ ਪਹਿਲਾਂ"}}},"hour":{"displayName":"ਘੰਟਾ","relativeTime":{"future":{"one":"{0} ਘੰਟੇ ਵਿੱਚ","other":"{0} ਘੰਟਿਆਂ ਵਿੱਚ"},"past":{"one":"{0} ਘੰਟਾ ਪਹਿਲਾਂ","other":"{0} ਘੰਟੇ ਪਹਿਲਾਂ"}}},"minute":{"displayName":"ਮਿੰਟ","relativeTime":{"future":{"one":"{0} ਮਿੰਟ ਵਿੱਚ","other":"{0} ਮਿੰਟਾਂ ਵਿੱਚ"},"past":{"one":"{0} ਮਿੰਟ ਪਹਿਲਾਂ","other":"{0} ਮਿੰਟ ਪਹਿਲਾਂ"}}},"second":{"displayName":"ਸਕਿੰਟ","relative":{"0":"ਹੁਣ"},"relativeTime":{"future":{"one":"{0} ਸਕਿੰਟ ਵਿੱਚ","other":"{0} ਸਕਿੰਟਾਂ ਵਿੱਚ"},"past":{"one":"{0} ਸਕਿੰਟ ਪਹਿਲਾਂ","other":"{0} ਸਕਿੰਟ ਪਹਿਲਾਂ"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"pa-Arab","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"ورھا","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"مہينا","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"دئن","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"گھنٹا","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"منٹ","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"pa-Arab-PK","parentLocale":"pa-Arab"});
HandlebarsIntl.__addLocaleData({"locale":"pa-Guru","parentLocale":"pa"});
HandlebarsIntl.__addLocaleData({"locale":"pa-Guru-IN","parentLocale":"pa-Guru"});

HandlebarsIntl.__addLocaleData({"locale":"pap","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"pl","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],i10=i.slice(-1),i100=i.slice(-2);if(ord)return"other";return n==1&&v0?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)?"few":v0&&i!=1&&(i10==0||i10==1)||v0&&(i10>=5&&i10<=9)||v0&&(i100>=12&&i100<=14)?"many":"other"},"fields":{"year":{"displayName":"rok","relative":{"0":"w tym roku","1":"w przyszłym roku","-1":"w zeszłym roku"},"relativeTime":{"future":{"one":"za {0} rok","few":"za {0} lata","many":"za {0} lat","other":"za {0} roku"},"past":{"one":"{0} rok temu","few":"{0} lata temu","many":"{0} lat temu","other":"{0} roku temu"}}},"month":{"displayName":"miesiąc","relative":{"0":"w tym miesiącu","1":"w przyszłym miesiącu","-1":"w zeszłym miesiącu"},"relativeTime":{"future":{"one":"za {0} miesiąc","few":"za {0} miesiące","many":"za {0} miesięcy","other":"za {0} miesiąca"},"past":{"one":"{0} miesiąc temu","few":"{0} miesiące temu","many":"{0} miesięcy temu","other":"{0} miesiąca temu"}}},"day":{"displayName":"dzień","relative":{"0":"dzisiaj","1":"jutro","2":"pojutrze","-1":"wczoraj","-2":"przedwczoraj"},"relativeTime":{"future":{"one":"za {0} dzień","few":"za {0} dni","many":"za {0} dni","other":"za {0} dnia"},"past":{"one":"{0} dzień temu","few":"{0} dni temu","many":"{0} dni temu","other":"{0} dnia temu"}}},"hour":{"displayName":"godzina","relativeTime":{"future":{"one":"za {0} godzinę","few":"za {0} godziny","many":"za {0} godzin","other":"za {0} godziny"},"past":{"one":"{0} godzinę temu","few":"{0} godziny temu","many":"{0} godzin temu","other":"{0} godziny temu"}}},"minute":{"displayName":"minuta","relativeTime":{"future":{"one":"za {0} minutę","few":"za {0} minuty","many":"za {0} minut","other":"za {0} minuty"},"past":{"one":"{0} minutę temu","few":"{0} minuty temu","many":"{0} minut temu","other":"{0} minuty temu"}}},"second":{"displayName":"sekunda","relative":{"0":"teraz"},"relativeTime":{"future":{"one":"za {0} sekundę","few":"za {0} sekundy","many":"za {0} sekund","other":"za {0} sekundy"},"past":{"one":"{0} sekundę temu","few":"{0} sekundy temu","many":"{0} sekund temu","other":"{0} sekundy temu"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"pl-PL","parentLocale":"pl"});

HandlebarsIntl.__addLocaleData({"locale":"prg","pluralRuleFunction":function (n,ord){var s=String(n).split("."),f=s[1]||"",v=f.length,t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2),f100=f.slice(-2),f10=f.slice(-1);if(ord)return"other";return t0&&n10==0||n100>=11&&n100<=19||v==2&&(f100>=11&&f100<=19)?"zero":n10==1&&n100!=11||v==2&&f10==1&&f100!=11||v!=2&&f10==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"ps","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ps-AF","parentLocale":"ps"});

HandlebarsIntl.__addLocaleData({"locale":"pt","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return"other";return t0&&n>=0&&n<=2&&n!=2?"one":"other"},"fields":{"year":{"displayName":"Ano","relative":{"0":"este ano","1":"próximo ano","-1":"ano passado"},"relativeTime":{"future":{"one":"Dentro de {0} ano","other":"Dentro de {0} anos"},"past":{"one":"Há {0} ano","other":"Há {0} anos"}}},"month":{"displayName":"Mês","relative":{"0":"este mês","1":"próximo mês","-1":"mês passado"},"relativeTime":{"future":{"one":"Dentro de {0} mês","other":"Dentro de {0} meses"},"past":{"one":"Há {0} mês","other":"Há {0} meses"}}},"day":{"displayName":"Dia","relative":{"0":"hoje","1":"amanhã","2":"depois de amanhã","-1":"ontem","-2":"anteontem"},"relativeTime":{"future":{"one":"Dentro de {0} dia","other":"Dentro de {0} dias"},"past":{"one":"Há {0} dia","other":"Há {0} dias"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"one":"Dentro de {0} hora","other":"Dentro de {0} horas"},"past":{"one":"Há {0} hora","other":"Há {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"Dentro de {0} minuto","other":"Dentro de {0} minutos"},"past":{"one":"Há {0} minuto","other":"Há {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"agora"},"relativeTime":{"future":{"one":"Dentro de {0} segundo","other":"Dentro de {0} segundos"},"past":{"one":"Há {0} segundo","other":"Há {0} segundos"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"pt-AO","parentLocale":"pt-PT"});
HandlebarsIntl.__addLocaleData({"locale":"pt-PT","parentLocale":"pt","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Ano","relative":{"0":"este ano","1":"próximo ano","-1":"ano passado"},"relativeTime":{"future":{"one":"dentro de {0} ano","other":"dentro de {0} anos"},"past":{"one":"há {0} ano","other":"há {0} anos"}}},"month":{"displayName":"Mês","relative":{"0":"este mês","1":"próximo mês","-1":"mês passado"},"relativeTime":{"future":{"one":"dentro de {0} mês","other":"dentro de {0} meses"},"past":{"one":"há {0} mês","other":"há {0} meses"}}},"day":{"displayName":"Dia","relative":{"0":"hoje","1":"amanhã","2":"depois de amanhã","-1":"ontem","-2":"anteontem"},"relativeTime":{"future":{"one":"dentro de {0} dia","other":"dentro de {0} dias"},"past":{"one":"há {0} dia","other":"há {0} dias"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"há {0} hora","other":"há {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"há {0} minuto","other":"há {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"agora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"há {0} segundo","other":"há {0} segundos"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"pt-BR","parentLocale":"pt"});
HandlebarsIntl.__addLocaleData({"locale":"pt-CV","parentLocale":"pt-PT"});
HandlebarsIntl.__addLocaleData({"locale":"pt-GW","parentLocale":"pt-PT"});
HandlebarsIntl.__addLocaleData({"locale":"pt-MO","parentLocale":"pt-PT"});
HandlebarsIntl.__addLocaleData({"locale":"pt-MZ","parentLocale":"pt-PT"});
HandlebarsIntl.__addLocaleData({"locale":"pt-ST","parentLocale":"pt-PT"});
HandlebarsIntl.__addLocaleData({"locale":"pt-TL","parentLocale":"pt-PT"});

HandlebarsIntl.__addLocaleData({"locale":"qu","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"qu-BO","parentLocale":"qu"});
HandlebarsIntl.__addLocaleData({"locale":"qu-EC","parentLocale":"qu"});
HandlebarsIntl.__addLocaleData({"locale":"qu-PE","parentLocale":"qu"});

HandlebarsIntl.__addLocaleData({"locale":"rm","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"onn","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"mais","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Tag","relative":{"0":"oz","1":"damaun","2":"puschmaun","-1":"ier","-2":"stersas"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"ura","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"minuta","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"secunda","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"rm-CH","parentLocale":"rm"});

HandlebarsIntl.__addLocaleData({"locale":"rn","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Umwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Ukwezi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Umusi","relative":{"0":"Uyu musi","1":"Ejo (hazoza)","-1":"Ejo (haheze)"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Isaha","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Umunota","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Isegonda","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"rn-BI","parentLocale":"rn"});

HandlebarsIntl.__addLocaleData({"locale":"ro","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n100=t0&&s[0].slice(-2);if(ord)return n==1?"one":"other";return n==1&&v0?"one":!v0||n==0||n!=1&&(n100>=1&&n100<=19)?"few":"other"},"fields":{"year":{"displayName":"An","relative":{"0":"anul acesta","1":"anul viitor","-1":"anul trecut"},"relativeTime":{"future":{"one":"peste {0} an","few":"peste {0} ani","other":"peste {0} de ani"},"past":{"one":"acum {0} an","few":"acum {0} ani","other":"acum {0} de ani"}}},"month":{"displayName":"Lună","relative":{"0":"luna aceasta","1":"luna viitoare","-1":"luna trecută"},"relativeTime":{"future":{"one":"peste {0} lună","few":"peste {0} luni","other":"peste {0} de luni"},"past":{"one":"acum {0} lună","few":"acum {0} luni","other":"acum {0} de luni"}}},"day":{"displayName":"Zi","relative":{"0":"azi","1":"mâine","2":"poimâine","-1":"ieri","-2":"alaltăieri"},"relativeTime":{"future":{"one":"peste {0} zi","few":"peste {0} zile","other":"peste {0} de zile"},"past":{"one":"acum {0} zi","few":"acum {0} zile","other":"acum {0} de zile"}}},"hour":{"displayName":"Oră","relativeTime":{"future":{"one":"peste {0} oră","few":"peste {0} ore","other":"peste {0} de ore"},"past":{"one":"acum {0} oră","few":"acum {0} ore","other":"acum {0} de ore"}}},"minute":{"displayName":"Minut","relativeTime":{"future":{"one":"peste {0} minut","few":"peste {0} minute","other":"peste {0} de minute"},"past":{"one":"acum {0} minut","few":"acum {0} minute","other":"acum {0} de minute"}}},"second":{"displayName":"Secundă","relative":{"0":"acum"},"relativeTime":{"future":{"one":"peste {0} secundă","few":"peste {0} secunde","other":"peste {0} de secunde"},"past":{"one":"acum {0} secundă","few":"acum {0} secunde","other":"acum {0} de secunde"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ro-MD","parentLocale":"ro"});
HandlebarsIntl.__addLocaleData({"locale":"ro-RO","parentLocale":"ro"});

HandlebarsIntl.__addLocaleData({"locale":"rof","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Muaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mweri","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Mfiri","relative":{"0":"Linu","1":"Ng’ama","-1":"Hiyo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Isaa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"rof-TZ","parentLocale":"rof"});

HandlebarsIntl.__addLocaleData({"locale":"ru","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],i10=i.slice(-1),i100=i.slice(-2);if(ord)return"other";return v0&&i10==1&&i100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)?"few":v0&&i10==0||v0&&(i10>=5&&i10<=9)||v0&&(i100>=11&&i100<=14)?"many":"other"},"fields":{"year":{"displayName":"Год","relative":{"0":"в этому году","1":"в следующем году","-1":"в прошлом году"},"relativeTime":{"future":{"one":"через {0} год","few":"через {0} года","many":"через {0} лет","other":"через {0} года"},"past":{"one":"{0} год назад","few":"{0} года назад","many":"{0} лет назад","other":"{0} года назад"}}},"month":{"displayName":"Месяц","relative":{"0":"в этом месяце","1":"в следующем месяце","-1":"в прошлом месяце"},"relativeTime":{"future":{"one":"через {0} месяц","few":"через {0} месяца","many":"через {0} месяцев","other":"через {0} месяца"},"past":{"one":"{0} месяц назад","few":"{0} месяца назад","many":"{0} месяцев назад","other":"{0} месяца назад"}}},"day":{"displayName":"День","relative":{"0":"сегодня","1":"завтра","2":"послезавтра","-1":"вчера","-2":"позавчера"},"relativeTime":{"future":{"one":"через {0} день","few":"через {0} дня","many":"через {0} дней","other":"через {0} дней"},"past":{"one":"{0} день назад","few":"{0} дня назад","many":"{0} дней назад","other":"{0} дня назад"}}},"hour":{"displayName":"Час","relativeTime":{"future":{"one":"через {0} час","few":"через {0} часа","many":"через {0} часов","other":"через {0} часа"},"past":{"one":"{0} час назад","few":"{0} часа назад","many":"{0} часов назад","other":"{0} часа назад"}}},"minute":{"displayName":"Минута","relativeTime":{"future":{"one":"через {0} минуту","few":"через {0} минуты","many":"через {0} минут","other":"через {0} минуты"},"past":{"one":"{0} минуту назад","few":"{0} минуты назад","many":"{0} минут назад","other":"{0} минуты назад"}}},"second":{"displayName":"Секунда","relative":{"0":"сейчас"},"relativeTime":{"future":{"one":"через {0} секунду","few":"через {0} секунды","many":"через {0} секунд","other":"через {0} секунды"},"past":{"one":"{0} секунду назад","few":"{0} секунды назад","many":"{0} секунд назад","other":"{0} секунды назад"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ru-BY","parentLocale":"ru"});
HandlebarsIntl.__addLocaleData({"locale":"ru-KG","parentLocale":"ru"});
HandlebarsIntl.__addLocaleData({"locale":"ru-KZ","parentLocale":"ru"});
HandlebarsIntl.__addLocaleData({"locale":"ru-MD","parentLocale":"ru"});
HandlebarsIntl.__addLocaleData({"locale":"ru-RU","parentLocale":"ru"});
HandlebarsIntl.__addLocaleData({"locale":"ru-UA","parentLocale":"ru"});

HandlebarsIntl.__addLocaleData({"locale":"rw","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"rw-RW","parentLocale":"rw"});

HandlebarsIntl.__addLocaleData({"locale":"rwk","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Maka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mori","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Mfiri","relative":{"0":"Inu","1":"Ngama","-1":"Ukou"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakyika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"rwk-TZ","parentLocale":"rwk"});

HandlebarsIntl.__addLocaleData({"locale":"sah","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Сыл","relative":{"0":"бу сыл","1":"кэлэр сыл","-1":"ааспыт сыл"},"relativeTime":{"future":{"other":"{0} сылынан"},"past":{"other":"{0} сыл ынараа өттүгэр"}}},"month":{"displayName":"Ый","relative":{"0":"бу ый","1":"аныгыскы ый","-1":"ааспыт ый"},"relativeTime":{"future":{"other":"{0} ыйынан"},"past":{"other":"{0} ый ынараа өттүгэр"}}},"day":{"displayName":"Күн","relative":{"0":"Бүгүн","1":"Сарсын","2":"Өйүүн","-1":"Бэҕэһээ","-2":"Иллэрээ күн"},"relativeTime":{"future":{"other":"{0} күнүнэн"},"past":{"other":"{0} күн ынараа өттүгэр"}}},"hour":{"displayName":"Чаас","relativeTime":{"future":{"other":"{0} чааһынан"},"past":{"other":"{0} чаас ынараа өттүгэр"}}},"minute":{"displayName":"Мүнүүтэ","relativeTime":{"future":{"other":"{0} мүнүүтэннэн"},"past":{"other":"{0} мүнүүтэ ынараа өттүгэр"}}},"second":{"displayName":"Сөкүүндэ","relative":{"0":"now"},"relativeTime":{"future":{"other":"{0} сөкүүндэннэн"},"past":{"other":"{0} сөкүүндэ ынараа өттүгэр"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sah-RU","parentLocale":"sah"});

HandlebarsIntl.__addLocaleData({"locale":"saq","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Lari","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Lapa","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Mpari","relative":{"0":"Duo","1":"Taisere","-1":"Ng’ole"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saai","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Idakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Isekondi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"saq-KE","parentLocale":"saq"});

HandlebarsIntl.__addLocaleData({"locale":"sbp","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Mwakha","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mwesi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Lusiku","relative":{"0":"Ineng’uni","1":"Pamulaawu","-1":"Imehe"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Ilisala","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Idakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Isekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sbp-TZ","parentLocale":"sbp"});

HandlebarsIntl.__addLocaleData({"locale":"se","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"},"fields":{"year":{"displayName":"jáhki","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"{0} jahki maŋŋilit","two":"{0} jahkki maŋŋilit","other":"{0} jahkki maŋŋilit"},"past":{"one":"{0} jahki árat","two":"{0} jahkki árat","other":"{0} jahkki árat"}}},"month":{"displayName":"mánnu","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"{0} mánotbadji maŋŋilit","two":"{0} mánotbadji maŋŋilit","other":"{0} mánotbadji maŋŋilit"},"past":{"one":"{0} mánotbadji árat","two":"{0} mánotbadji árat","other":"{0} mánotbadji árat"}}},"day":{"displayName":"beaivi","relative":{"0":"odne","1":"ihttin","2":"paijeelittáá","-1":"ikte","-2":"oovdebpeivvi"},"relativeTime":{"future":{"one":"{0} jándor maŋŋilit","two":"{0} jándor amaŋŋilit","other":"{0} jándora maŋŋilit"},"past":{"one":"{0} jándor árat","two":"{0} jándora árat","other":"{0} jándora árat"}}},"hour":{"displayName":"diibmu","relativeTime":{"future":{"one":"{0} diibmu maŋŋilit","two":"{0} diibmur maŋŋilit","other":"{0} diibmur maŋŋilit"},"past":{"one":"{0} diibmu árat","two":"{0} diibmur árat","other":"{0} diibmur árat"}}},"minute":{"displayName":"minuhtta","relativeTime":{"future":{"one":"{0} minuhta maŋŋilit","two":"{0} minuhtta maŋŋilit","other":"{0} minuhtta maŋŋilit"},"past":{"one":"{0} minuhta árat","two":"{0} minuhtta árat","other":"{0} minuhtta árat"}}},"second":{"displayName":"sekunda","relative":{"0":"now"},"relativeTime":{"future":{"one":"{0} sekunda maŋŋilit","two":"{0} sekundda maŋŋilit","other":"{0} sekundda maŋŋilit"},"past":{"one":"{0} sekunda árat","two":"{0} sekundda árat","other":"{0} sekundda árat"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"se-FI","parentLocale":"se","fields":{"year":{"displayName":"jahki","relative":{"0":"dán jagi","1":"boahtte jagi","-1":"mannan jagi"},"relativeTime":{"future":{"one":"{0} jagi siste","two":"{0} jagi siste","other":"{0} jagi siste"},"past":{"one":"{0} jagi árat","two":"{0} jagi árat","other":"{0} jagi árat"}}},"month":{"displayName":"mánnu","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"{0} mánotbadji maŋŋilit","two":"{0} mánotbadji maŋŋilit","other":"{0} mánotbadji maŋŋilit"},"past":{"one":"{0} mánotbadji árat","two":"{0} mánotbadji árat","other":"{0} mánotbadji árat"}}},"day":{"displayName":"beaivi","relative":{"0":"odne","1":"ihttin","2":"paijeelittáá","-1":"ikte","-2":"oovdebpeivvi"},"relativeTime":{"future":{"one":"{0} jándor maŋŋilit","two":"{0} jándor amaŋŋilit","other":"{0} jándora maŋŋilit"},"past":{"one":"{0} jándor árat","two":"{0} jándora árat","other":"{0} jándora árat"}}},"hour":{"displayName":"diibmu","relativeTime":{"future":{"one":"{0} diibmu maŋŋilit","two":"{0} diibmur maŋŋilit","other":"{0} diibmur maŋŋilit"},"past":{"one":"{0} diibmu árat","two":"{0} diibmur árat","other":"{0} diibmur árat"}}},"minute":{"displayName":"minuhtta","relativeTime":{"future":{"one":"{0} minuhta maŋŋilit","two":"{0} minuhtta maŋŋilit","other":"{0} minuhtta maŋŋilit"},"past":{"one":"{0} minuhta árat","two":"{0} minuhtta árat","other":"{0} minuhtta árat"}}},"second":{"displayName":"sekunda","relative":{"0":"now"},"relativeTime":{"future":{"one":"{0} sekunda maŋŋilit","two":"{0} sekundda maŋŋilit","other":"{0} sekundda maŋŋilit"},"past":{"one":"{0} sekunda árat","two":"{0} sekundda árat","other":"{0} sekundda árat"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"se-NO","parentLocale":"se"});
HandlebarsIntl.__addLocaleData({"locale":"se-SE","parentLocale":"se"});

HandlebarsIntl.__addLocaleData({"locale":"seh","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Chaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mwezi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ntsiku","relative":{"0":"Lero","1":"Manguana","-1":"Zuro"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Segundo","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"seh-MZ","parentLocale":"seh"});

HandlebarsIntl.__addLocaleData({"locale":"ses","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Jiiri","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Handu","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Zaari","relative":{"0":"Hõo","1":"Suba","-1":"Bi"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Guuru","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Miniti","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Miti","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ses-ML","parentLocale":"ses"});

HandlebarsIntl.__addLocaleData({"locale":"sg","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Ngû","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Nze","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Lâ","relative":{"0":"Lâsô","1":"Kêkerêke","-1":"Bîrï"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Ngbonga","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Ndurü ngbonga","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Nzîna ngbonga","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sg-CF","parentLocale":"sg"});

HandlebarsIntl.__addLocaleData({"locale":"sh","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),i100=i.slice(-2),f10=f.slice(-1),f100=f.slice(-2);if(ord)return"other";return v0&&i10==1&&i100!=11||f10==1&&f100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)||f10>=2&&f10<=4&&(f100<12||f100>14)?"few":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"shi","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return"other";return n>=0&&n<=1?"one":t0&&n>=2&&n<=10?"few":"other"},"fields":{"year":{"displayName":"ⴰⵙⴳⴳⵯⴰⵙ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"ⴰⵢⵢⵓⵔ","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"ⴰⵙⵙ","relative":{"0":"ⴰⵙⵙⴰ","1":"ⴰⵙⴽⴽⴰ","-1":"ⵉⴹⵍⵍⵉ"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"ⵜⴰⵙⵔⴰⴳⵜ","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"ⵜⵓⵙⴷⵉⴷⵜ","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"ⵜⴰⵙⵉⵏⵜ","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"shi-Latn","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"asggʷas","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"ayyur","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"ass","relative":{"0":"assa","1":"askka","-1":"iḍlli"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"tasragt","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"tusdidt","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"tasint","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"shi-Latn-MA","parentLocale":"shi-Latn"});
HandlebarsIntl.__addLocaleData({"locale":"shi-Tfng","parentLocale":"shi"});
HandlebarsIntl.__addLocaleData({"locale":"shi-Tfng-MA","parentLocale":"shi-Tfng"});

HandlebarsIntl.__addLocaleData({"locale":"si","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"";if(ord)return"other";return n==0||n==1||i==0&&f==1?"one":"other"},"fields":{"year":{"displayName":"වර්ෂය","relative":{"0":"මෙම වසර","1":"ඊළඟ වසර","-1":"පසුගිය වසර"},"relativeTime":{"future":{"one":"වසර {0} කින්","other":"වසර {0} කින්"},"past":{"one":"වසර {0}ට පෙර","other":"වසර {0}ට පෙර"}}},"month":{"displayName":"මාසය","relative":{"0":"මෙම මාසය","1":"ඊළඟ මාසය","-1":"පසුගිය මාසය"},"relativeTime":{"future":{"one":"මාස {0}කින්","other":"මාස {0}කින්"},"past":{"one":"මාස {0}කට පෙර","other":"මාස {0}කට පෙර"}}},"day":{"displayName":"දිනය","relative":{"0":"අද","1":"හෙට","2":"අනිද්දා","-1":"ඊයේ","-2":"පෙරේදා"},"relativeTime":{"future":{"one":"දින {0}න්","other":"දින {0}න්"},"past":{"one":"දින {0} ට පෙර","other":"දින {0} ට පෙර"}}},"hour":{"displayName":"පැය","relativeTime":{"future":{"one":"පැය {0} කින්","other":"පැය {0} කින්"},"past":{"one":"පැය {0}ට පෙර","other":"පැය {0}ට පෙර"}}},"minute":{"displayName":"මිනිත්තුව","relativeTime":{"future":{"one":"මිනිත්තු {0} කින්","other":"මිනිත්තු {0} කින්"},"past":{"one":"මිනිත්තු {0}ට පෙර","other":"මිනිත්තු {0}ට පෙර"}}},"second":{"displayName":"තත්පරය","relative":{"0":"දැන්"},"relativeTime":{"future":{"one":"තත්පර {0} කින්","other":"තත්පර {0} කින්"},"past":{"one":"තත්පර {0}කට පෙර","other":"තත්පර {0}කට පෙර"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"si-LK","parentLocale":"si"});

HandlebarsIntl.__addLocaleData({"locale":"sk","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1];if(ord)return"other";return n==1&&v0?"one":i>=2&&i<=4&&v0?"few":!v0?"many":"other"},"fields":{"year":{"displayName":"rok","relative":{"0":"tento rok","1":"budúci rok","-1":"minulý rok"},"relativeTime":{"future":{"one":"o {0} rok","few":"o {0} roky","many":"o {0} roka","other":"o {0} rokov"},"past":{"one":"pred {0} rokom","few":"pred {0} rokmi","many":"pred {0} rokom","other":"pred {0} rokmi"}}},"month":{"displayName":"mesiac","relative":{"0":"tento mesiac","1":"budúci mesiac","-1":"minulý mesiac"},"relativeTime":{"future":{"one":"o {0} mesiac","few":"o {0} mesiace","many":"o {0} mesiaca","other":"o {0} mesiacov"},"past":{"one":"pred {0} mesiacom","few":"pred {0} mesiacmi","many":"pred {0} mesiacom","other":"pred {0} mesiacmi"}}},"day":{"displayName":"deň","relative":{"0":"dnes","1":"zajtra","2":"pozajtra","-1":"včera","-2":"predvčerom"},"relativeTime":{"future":{"one":"o {0} deň","few":"o {0} dni","many":"o {0} dňa","other":"o {0} dní"},"past":{"one":"pred {0} dňom","few":"pred {0} dňami","many":"pred {0} dňom","other":"pred {0} dňami"}}},"hour":{"displayName":"hodina","relativeTime":{"future":{"one":"o {0} hodinu","few":"o {0} hodiny","many":"o {0} hodiny","other":"o {0} hodín"},"past":{"one":"pred {0} hodinou","few":"pred {0} hodinami","many":"pred {0} hodinou","other":"pred {0} hodinami"}}},"minute":{"displayName":"minúta","relativeTime":{"future":{"one":"o {0} minútu","few":"o {0} minúty","many":"o {0} minúty","other":"o {0} minút"},"past":{"one":"pred {0} minútou","few":"pred {0} minútami","many":"pred {0} minútou","other":"pred {0} minútami"}}},"second":{"displayName":"sekunda","relative":{"0":"teraz"},"relativeTime":{"future":{"one":"o {0} sekundu","few":"o {0} sekundy","many":"o {0} sekundy","other":"o {0} sekúnd"},"past":{"one":"pred {0} sekundou","few":"pred {0} sekundami","many":"Pred {0} sekundami","other":"pred {0} sekundami"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sk-SK","parentLocale":"sk"});

HandlebarsIntl.__addLocaleData({"locale":"sl","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],i100=i.slice(-2);if(ord)return"other";return v0&&i100==1?"one":v0&&i100==2?"two":v0&&(i100==3||i100==4)||!v0?"few":"other"},"fields":{"year":{"displayName":"Leto","relative":{"0":"letos","1":"naslednje leto","-1":"lani"},"relativeTime":{"future":{"one":"čez {0} leto","two":"čez {0} leti","few":"čez {0} leta","other":"čez {0} let"},"past":{"one":"pred {0} letom","two":"pred {0} letoma","few":"pred {0} leti","other":"pred {0} leti"}}},"month":{"displayName":"Mesec","relative":{"0":"ta mesec","1":"naslednji mesec","-1":"prejšnji mesec"},"relativeTime":{"future":{"one":"čez {0} mesec","two":"čez {0} meseca","few":"čez {0} mesece","other":"čez {0} mesecev"},"past":{"one":"pred {0} mesecem","two":"pred {0} mesecema","few":"pred {0} meseci","other":"pred {0} meseci"}}},"day":{"displayName":"Dan","relative":{"0":"danes","1":"jutri","2":"pojutrišnjem","-1":"včeraj","-2":"predvčerajšnjim"},"relativeTime":{"future":{"one":"čez {0} dan","two":"čez {0} dneva","few":"čez {0} dni","other":"čez {0} dni"},"past":{"one":"pred {0} dnevom","two":"pred {0} dnevoma","few":"pred {0} dnevi","other":"pred {0} dnevi"}}},"hour":{"displayName":"Ura","relativeTime":{"future":{"one":"čez {0} h","two":"čez {0} h","few":"čez {0} h","other":"čez {0} h"},"past":{"one":"pred {0} h","two":"pred {0} h","few":"pred {0} h","other":"pred {0} h"}}},"minute":{"displayName":"Minuta","relativeTime":{"future":{"one":"čez {0} min.","two":"čez {0} min.","few":"čez {0} min.","other":"čez {0} min."},"past":{"one":"pred {0} min.","two":"pred {0} min.","few":"pred {0} min.","other":"pred {0} min."}}},"second":{"displayName":"Sekunda","relative":{"0":"zdaj"},"relativeTime":{"future":{"one":"čez {0} sekundo","two":"čez {0} sekundi","few":"čez {0} sekunde","other":"čez {0} sekund"},"past":{"one":"pred {0} sekundo","two":"pred {0} sekundama","few":"pred {0} sekundami","other":"pred {0} sekundami"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sl-SI","parentLocale":"sl"});

HandlebarsIntl.__addLocaleData({"locale":"sma","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"smi","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"smj","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"smn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"smn-FI","parentLocale":"smn"});

HandlebarsIntl.__addLocaleData({"locale":"sms","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"sn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Gore","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mwedzi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Zuva","relative":{"0":"Nhasi","1":"Mangwana","-1":"Nezuro"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Awa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Mineti","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekondi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sn-ZW","parentLocale":"sn"});

HandlebarsIntl.__addLocaleData({"locale":"so","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Sanad","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Bil","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Maalin","relative":{"0":"Maanta","1":"Berri","-1":"Shalay"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saacad","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Daqiiqad","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Il biriqsi","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"so-DJ","parentLocale":"so"});
HandlebarsIntl.__addLocaleData({"locale":"so-ET","parentLocale":"so"});
HandlebarsIntl.__addLocaleData({"locale":"so-KE","parentLocale":"so"});
HandlebarsIntl.__addLocaleData({"locale":"so-SO","parentLocale":"so"});

HandlebarsIntl.__addLocaleData({"locale":"sq","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n==1?"one":n10==4&&n100!=14?"many":"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"vit","relative":{"0":"këtë vit","1":"vitin e ardhshëm","-1":"vitin e kaluar"},"relativeTime":{"future":{"one":"pas {0} viti","other":"pas {0} vjetësh"},"past":{"one":"para {0} viti","other":"para {0} vjetësh"}}},"month":{"displayName":"muaj","relative":{"0":"këtë muaj","1":"muajin e ardhshëm","-1":"muajin e kaluar"},"relativeTime":{"future":{"one":"pas {0} muaji","other":"pas {0} muajsh"},"past":{"one":"para {0} muaji","other":"para {0} muajsh"}}},"day":{"displayName":"ditë","relative":{"0":"sot","1":"nesër","-1":"dje"},"relativeTime":{"future":{"one":"pas {0} dite","other":"pas {0} ditësh"},"past":{"one":"para {0} dite","other":"para {0} ditësh"}}},"hour":{"displayName":"orë","relativeTime":{"future":{"one":"pas {0} ore","other":"pas {0} orësh"},"past":{"one":"para {0} ore","other":"para {0} orësh"}}},"minute":{"displayName":"minutë","relativeTime":{"future":{"one":"pas {0} minute","other":"pas {0} minutash"},"past":{"one":"para {0} minute","other":"para {0} minutash"}}},"second":{"displayName":"sekondë","relative":{"0":"tani"},"relativeTime":{"future":{"one":"pas {0} sekonde","other":"pas {0} sekondash"},"past":{"one":"para {0} sekonde","other":"para {0} sekondash"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sq-AL","parentLocale":"sq"});
HandlebarsIntl.__addLocaleData({"locale":"sq-MK","parentLocale":"sq"});
HandlebarsIntl.__addLocaleData({"locale":"sq-XK","parentLocale":"sq"});

HandlebarsIntl.__addLocaleData({"locale":"sr","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),i100=i.slice(-2),f10=f.slice(-1),f100=f.slice(-2);if(ord)return"other";return v0&&i10==1&&i100!=11||f10==1&&f100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)||f10>=2&&f10<=4&&(f100<12||f100>14)?"few":"other"},"fields":{"year":{"displayName":"година","relative":{"0":"ове године","1":"следеће године","-1":"прошле године"},"relativeTime":{"future":{"one":"за {0} годину","few":"за {0} године","other":"за {0} година"},"past":{"one":"пре {0} године","few":"пре {0} године","other":"пре {0} година"}}},"month":{"displayName":"месец","relative":{"0":"овог месеца","1":"следећег месеца","-1":"прошлог месеца"},"relativeTime":{"future":{"one":"за {0} месец","few":"за {0} месеца","other":"за {0} месеци"},"past":{"one":"пре {0} месеца","few":"пре {0} месеца","other":"пре {0} месеци"}}},"day":{"displayName":"дан","relative":{"0":"данас","1":"сутра","2":"прекосутра","-1":"јуче","-2":"прекјуче"},"relativeTime":{"future":{"one":"за {0} дан","few":"за {0} дана","other":"за {0} дана"},"past":{"one":"пре {0} дана","few":"пре {0} дана","other":"пре {0} дана"}}},"hour":{"displayName":"сат","relativeTime":{"future":{"one":"за {0} сат","few":"за {0} сата","other":"за {0} сати"},"past":{"one":"пре {0} сата","few":"пре {0} сата","other":"пре {0} сати"}}},"minute":{"displayName":"минут","relativeTime":{"future":{"one":"за {0} минут","few":"за {0} минута","other":"за {0} минута"},"past":{"one":"пре {0} минута","few":"пре {0} минута","other":"пре {0} минута"}}},"second":{"displayName":"секунд","relative":{"0":"сада"},"relativeTime":{"future":{"one":"за {0} секунду","few":"за {0} секунде","other":"за {0} секунди"},"past":{"one":"пре {0} секунде","few":"пре {0} секунде","other":"пре {0} секунди"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sr-Cyrl","parentLocale":"sr"});
HandlebarsIntl.__addLocaleData({"locale":"sr-Cyrl-BA","parentLocale":"sr-Cyrl"});
HandlebarsIntl.__addLocaleData({"locale":"sr-Cyrl-ME","parentLocale":"sr-Cyrl"});
HandlebarsIntl.__addLocaleData({"locale":"sr-Cyrl-RS","parentLocale":"sr-Cyrl"});
HandlebarsIntl.__addLocaleData({"locale":"sr-Cyrl-XK","parentLocale":"sr-Cyrl"});
HandlebarsIntl.__addLocaleData({"locale":"sr-Latn","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"godina","relative":{"0":"ove godine","1":"sledeće godine","-1":"prošle godine"},"relativeTime":{"future":{"one":"za {0} godinu","few":"za {0} godine","other":"za {0} godina"},"past":{"one":"pre {0} godine","few":"pre {0} godine","other":"pre {0} godina"}}},"month":{"displayName":"mesec","relative":{"0":"ovog meseca","1":"sledećeg meseca","-1":"prošlog meseca"},"relativeTime":{"future":{"one":"za {0} mesec","few":"za {0} meseca","other":"za {0} meseci"},"past":{"one":"pre {0} meseca","few":"pre {0} meseca","other":"pre {0} meseci"}}},"day":{"displayName":"dan","relative":{"0":"danas","1":"sutra","2":"prekosutra","-1":"juče","-2":"prekjuče"},"relativeTime":{"future":{"one":"za {0} dan","few":"za {0} dana","other":"za {0} dana"},"past":{"one":"pre {0} dana","few":"pre {0} dana","other":"pre {0} dana"}}},"hour":{"displayName":"sat","relativeTime":{"future":{"one":"za {0} sat","few":"za {0} sata","other":"za {0} sati"},"past":{"one":"pre {0} sata","few":"pre {0} sata","other":"pre {0} sati"}}},"minute":{"displayName":"minut","relativeTime":{"future":{"one":"za {0} minut","few":"za {0} minuta","other":"za {0} minuta"},"past":{"one":"pre {0} minuta","few":"pre {0} minuta","other":"pre {0} minuta"}}},"second":{"displayName":"sekund","relative":{"0":"sada"},"relativeTime":{"future":{"one":"za {0} sekundu","few":"za {0} sekunde","other":"za {0} sekundi"},"past":{"one":"pre {0} sekunde","few":"pre {0} sekunde","other":"pre {0} sekundi"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sr-Latn-BA","parentLocale":"sr-Latn"});
HandlebarsIntl.__addLocaleData({"locale":"sr-Latn-ME","parentLocale":"sr-Latn"});
HandlebarsIntl.__addLocaleData({"locale":"sr-Latn-RS","parentLocale":"sr-Latn"});
HandlebarsIntl.__addLocaleData({"locale":"sr-Latn-XK","parentLocale":"sr-Latn"});

HandlebarsIntl.__addLocaleData({"locale":"ss","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ss-SZ","parentLocale":"ss"});
HandlebarsIntl.__addLocaleData({"locale":"ss-ZA","parentLocale":"ss"});

HandlebarsIntl.__addLocaleData({"locale":"ssy","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ssy-ER","parentLocale":"ssy"});

HandlebarsIntl.__addLocaleData({"locale":"st","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"sv","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return(n10==1||n10==2)&&n100!=11&&n100!=12?"one":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"År","relative":{"0":"i år","1":"nästa år","-1":"i fjol"},"relativeTime":{"future":{"one":"om {0} år","other":"om {0} år"},"past":{"one":"för {0} år sedan","other":"för {0} år sedan"}}},"month":{"displayName":"Månad","relative":{"0":"denna månad","1":"nästa månad","-1":"förra månaden"},"relativeTime":{"future":{"one":"om {0} månad","other":"om {0} månader"},"past":{"one":"för {0} månad sedan","other":"för {0} månader sedan"}}},"day":{"displayName":"Dag","relative":{"0":"i dag","1":"i morgon","2":"i övermorgon","-1":"i går","-2":"i förrgår"},"relativeTime":{"future":{"one":"om {0} dag","other":"om {0} dagar"},"past":{"one":"för {0} dag sedan","other":"för {0} dagar sedan"}}},"hour":{"displayName":"Timme","relativeTime":{"future":{"one":"om {0} timme","other":"om {0} timmar"},"past":{"one":"för {0} timme sedan","other":"för {0} timmar sedan"}}},"minute":{"displayName":"Minut","relativeTime":{"future":{"one":"om {0} minut","other":"om {0} minuter"},"past":{"one":"för {0} minut sedan","other":"för {0} minuter sedan"}}},"second":{"displayName":"Sekund","relative":{"0":"nu"},"relativeTime":{"future":{"one":"om {0} sekund","other":"om {0} sekunder"},"past":{"one":"för {0} sekund sedan","other":"för {0} sekunder sedan"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sv-AX","parentLocale":"sv"});
HandlebarsIntl.__addLocaleData({"locale":"sv-FI","parentLocale":"sv","fields":{"year":{"displayName":"år","relative":{"0":"i år","1":"nästa år","-1":"i fjol"},"relativeTime":{"future":{"one":"om {0} år","other":"om {0} år"},"past":{"one":"för {0} år sedan","other":"för {0} år sedan"}}},"month":{"displayName":"månad","relative":{"0":"denna månad","1":"nästa månad","-1":"förra månaden"},"relativeTime":{"future":{"one":"om {0} månad","other":"om {0} månader"},"past":{"one":"för {0} månad sedan","other":"för {0} månader sedan"}}},"day":{"displayName":"dag","relative":{"0":"i dag","1":"i morgon","2":"i övermorgon","-1":"i går","-2":"i förrgår"},"relativeTime":{"future":{"one":"om {0} dag","other":"om {0} dagar"},"past":{"one":"för {0} dag sedan","other":"för {0} dagar sedan"}}},"hour":{"displayName":"Timme","relativeTime":{"future":{"one":"om {0} timme","other":"om {0} timmar"},"past":{"one":"för {0} timme sedan","other":"för {0} timmar sedan"}}},"minute":{"displayName":"minut","relativeTime":{"future":{"one":"om {0} minut","other":"om {0} minuter"},"past":{"one":"för {0} minut sedan","other":"för {0} minuter sedan"}}},"second":{"displayName":"sekund","relative":{"0":"nu"},"relativeTime":{"future":{"one":"om {0} sekund","other":"om {0} sekunder"},"past":{"one":"för {0} sekund sedan","other":"för {0} sekunder sedan"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sv-SE","parentLocale":"sv"});

HandlebarsIntl.__addLocaleData({"locale":"sw","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Mwaka","relative":{"0":"mwaka huu","1":"mwaka ujao","-1":"mwaka uliopita"},"relativeTime":{"future":{"one":"baada ya mwaka {0}","other":"baada ya miaka {0}"},"past":{"one":"mwaka {0} uliopita","other":"miaka {0} iliyopita"}}},"month":{"displayName":"Mwezi","relative":{"0":"mwezi huu","1":"mwezi ujao","-1":"mwezi uliopita"},"relativeTime":{"future":{"one":"baada ya mwezi {0}","other":"baada ya miezi {0}"},"past":{"one":"mwezi {0} uliopita","other":"miezi {0} iliyopita"}}},"day":{"displayName":"Siku","relative":{"0":"leo","1":"kesho","2":"kesho kutwa","-1":"jana","-2":"juzi"},"relativeTime":{"future":{"one":"baada ya siku {0}","other":"baada ya siku {0}"},"past":{"one":"siku {0} iliyopita","other":"siku {0} zilizopita"}}},"hour":{"displayName":"Saa","relativeTime":{"future":{"one":"baada ya saa {0}","other":"baada ya saa {0}"},"past":{"one":"saa {0} iliyopita","other":"saa {0} zilizopita"}}},"minute":{"displayName":"Dakika","relativeTime":{"future":{"one":"baada ya dakika {0}","other":"baada ya dakika {0}"},"past":{"one":"dakika {0} iliyopita","other":"dakika {0} zilizopita"}}},"second":{"displayName":"Sekunde","relative":{"0":"sasa"},"relativeTime":{"future":{"one":"baada ya sekunde {0}","other":"baada ya sekunde {0}"},"past":{"one":"Sekunde {0} iliyopita","other":"Sekunde {0} zilizopita"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"sw-KE","parentLocale":"sw"});
HandlebarsIntl.__addLocaleData({"locale":"sw-TZ","parentLocale":"sw"});
HandlebarsIntl.__addLocaleData({"locale":"sw-UG","parentLocale":"sw"});

HandlebarsIntl.__addLocaleData({"locale":"swc","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Mwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mwezi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Siku","relative":{"0":"Leo","1":"Kesho","-1":"Jana"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"swc-CD","parentLocale":"swc"});

HandlebarsIntl.__addLocaleData({"locale":"syr","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"ta","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"ஆண்டு","relative":{"0":"இந்த ஆண்டு","1":"அடுத்த ஆண்டு","-1":"கடந்த ஆண்டு"},"relativeTime":{"future":{"one":"{0} ஆண்டில்","other":"{0} ஆண்டுகளில்"},"past":{"one":"{0} ஆண்டிற்கு முன்","other":"{0} ஆண்டுகளுக்கு முன்"}}},"month":{"displayName":"மாதம்","relative":{"0":"இந்த மாதம்","1":"அடுத்த மாதம்","-1":"கடந்த மாதம்"},"relativeTime":{"future":{"one":"{0} மாதத்தில்","other":"{0} மாதங்களில்"},"past":{"one":"{0} மாதத்துக்கு முன்","other":"{0} மாதங்களுக்கு முன்"}}},"day":{"displayName":"நாள்","relative":{"0":"இன்று","1":"நாளை","2":"நாளை மறுநாள்","-1":"நேற்று","-2":"நேற்று முன் தினம்"},"relativeTime":{"future":{"one":"{0} நாளில்","other":"{0} நாட்களில்"},"past":{"one":"{0} நாளைக்கு முன்","other":"{0} நாட்களுக்கு முன்"}}},"hour":{"displayName":"மணி","relativeTime":{"future":{"one":"{0} மணிநேரத்தில்","other":"{0} மணிநேரத்தில்"},"past":{"one":"{0} மணிநேரம் முன்","other":"{0} மணிநேரம் முன்"}}},"minute":{"displayName":"நிமிடம்","relativeTime":{"future":{"one":"{0} நிமிடத்தில்","other":"{0} நிமிடங்களில்"},"past":{"one":"{0} நிமிடத்திற்கு முன்","other":"{0} நிமிடங்களுக்கு முன்"}}},"second":{"displayName":"விநாடி","relative":{"0":"இப்போது"},"relativeTime":{"future":{"one":"{0} விநாடியில்","other":"{0} விநாடிகளில்"},"past":{"one":"{0} விநாடிக்கு முன்","other":"{0} விநாடிகளுக்கு முன்"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ta-IN","parentLocale":"ta"});
HandlebarsIntl.__addLocaleData({"locale":"ta-LK","parentLocale":"ta"});
HandlebarsIntl.__addLocaleData({"locale":"ta-MY","parentLocale":"ta"});
HandlebarsIntl.__addLocaleData({"locale":"ta-SG","parentLocale":"ta"});

HandlebarsIntl.__addLocaleData({"locale":"te","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"సంవత్సరం","relative":{"0":"ఈ సంవత్సరం","1":"తదుపరి సంవత్సరం","-1":"గత సంవత్సరం"},"relativeTime":{"future":{"one":"{0} సంవత్సరంలో","other":"{0} సంవత్సరాల్లో"},"past":{"one":"{0} సంవత్సరం క్రితం","other":"{0} సంవత్సరాల క్రితం"}}},"month":{"displayName":"నెల","relative":{"0":"ఈ నెల","1":"తదుపరి నెల","-1":"గత నెల"},"relativeTime":{"future":{"one":"{0} నెలలో","other":"{0} నెలల్లో"},"past":{"one":"{0} నెల క్రితం","other":"{0} నెలల క్రితం"}}},"day":{"displayName":"దినం","relative":{"0":"ఈ రోజు","1":"రేపు","2":"ఎల్లుండి","-1":"నిన్న","-2":"మొన్న"},"relativeTime":{"future":{"one":"{0} రోజులో","other":"{0} రోజుల్లో"},"past":{"one":"{0} రోజు క్రితం","other":"{0} రోజుల క్రితం"}}},"hour":{"displayName":"గంట","relativeTime":{"future":{"one":"{0} గంటలో","other":"{0} గంటల్లో"},"past":{"one":"{0} గంట క్రితం","other":"{0} గంటల క్రితం"}}},"minute":{"displayName":"నిమిషము","relativeTime":{"future":{"one":"{0} నిమిషంలో","other":"{0} నిమిషాల్లో"},"past":{"one":"{0} నిమిషం క్రితం","other":"{0} నిమిషాల క్రితం"}}},"second":{"displayName":"క్షణం","relative":{"0":"ప్రస్తుతం"},"relativeTime":{"future":{"one":"{0} సెకన్‌లో","other":"{0} సెకన్లలో"},"past":{"one":"{0} సెకను క్రితం","other":"{0} సెకన్ల క్రితం"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"te-IN","parentLocale":"te"});

HandlebarsIntl.__addLocaleData({"locale":"teo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Ekan","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Elap","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Aparan","relative":{"0":"Lolo","1":"Moi","-1":"Jaan"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Esaa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Idakika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Isekonde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"teo-KE","parentLocale":"teo"});
HandlebarsIntl.__addLocaleData({"locale":"teo-UG","parentLocale":"teo"});

HandlebarsIntl.__addLocaleData({"locale":"th","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"ปี","relative":{"0":"ปีนี้","1":"ปีหน้า","-1":"ปีที่แล้ว"},"relativeTime":{"future":{"other":"ในอีก {0} ปี"},"past":{"other":"{0} ปีที่แล้ว"}}},"month":{"displayName":"เดือน","relative":{"0":"เดือนนี้","1":"เดือนหน้า","-1":"เดือนที่แล้ว"},"relativeTime":{"future":{"other":"ในอีก {0} เดือน"},"past":{"other":"{0} เดือนที่ผ่านมา"}}},"day":{"displayName":"วัน","relative":{"0":"วันนี้","1":"พรุ่งนี้","2":"มะรืนนี้","-1":"เมื่อวาน","-2":"เมื่อวานซืน"},"relativeTime":{"future":{"other":"ในอีก {0} วัน"},"past":{"other":"{0} วันที่ผ่านมา"}}},"hour":{"displayName":"ชั่วโมง","relativeTime":{"future":{"other":"ในอีก {0} ชั่วโมง"},"past":{"other":"{0} ชั่วโมงที่ผ่านมา"}}},"minute":{"displayName":"นาที","relativeTime":{"future":{"other":"ในอีก {0} นาที"},"past":{"other":"{0} นาทีที่ผ่านมา"}}},"second":{"displayName":"วินาที","relative":{"0":"ขณะนี้"},"relativeTime":{"future":{"other":"ในอีก {0} วินาที"},"past":{"other":"{0} วินาทีที่ผ่านมา"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"th-TH","parentLocale":"th"});

HandlebarsIntl.__addLocaleData({"locale":"ti","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ti-ER","parentLocale":"ti"});
HandlebarsIntl.__addLocaleData({"locale":"ti-ET","parentLocale":"ti"});

HandlebarsIntl.__addLocaleData({"locale":"tig","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"tk","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"tl","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),f10=f.slice(-1);if(ord)return n==1?"one":"other";return v0&&(i==1||i==2||i==3)||v0&&i10!=4&&i10!=6&&i10!=9||!v0&&f10!=4&&f10!=6&&f10!=9?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"tn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"tn-BW","parentLocale":"tn"});
HandlebarsIntl.__addLocaleData({"locale":"tn-ZA","parentLocale":"tn"});

HandlebarsIntl.__addLocaleData({"locale":"to","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"taʻu","relative":{"0":"taʻú ni","1":"taʻu kahaʻu","-1":"taʻu kuoʻosi"},"relativeTime":{"future":{"other":"ʻi he taʻu ʻe {0}"},"past":{"other":"taʻu ʻe {0} kuoʻosi"}}},"month":{"displayName":"māhina","relative":{"0":"māhiná ni","1":"māhina kahaʻu","-1":"māhina kuoʻosi"},"relativeTime":{"future":{"other":"ʻi he māhina ʻe {0}"},"past":{"other":"māhina ʻe {0} kuoʻosi"}}},"day":{"displayName":"ʻaho","relative":{"0":"ʻahó ni","1":"ʻapongipongi","2":"ʻahepongipongi","-1":"ʻaneafi","-2":"ʻaneheafi"},"relativeTime":{"future":{"other":"ʻi he ʻaho ʻe {0}"},"past":{"other":"ʻaho ʻe {0} kuoʻosi"}}},"hour":{"displayName":"houa","relativeTime":{"future":{"other":"ʻi he houa ʻe {0}"},"past":{"other":"houa ʻe {0} kuoʻosi"}}},"minute":{"displayName":"miniti","relativeTime":{"future":{"other":"ʻi he miniti ʻe {0}"},"past":{"other":"miniti ʻe {0} kuoʻosi"}}},"second":{"displayName":"sekoni","relative":{"0":"taimiʻni"},"relativeTime":{"future":{"other":"ʻi he sekoni ʻe {0}"},"past":{"other":"sekoni ʻe {0} kuoʻosi"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"to-TO","parentLocale":"to"});

HandlebarsIntl.__addLocaleData({"locale":"tr","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Yıl","relative":{"0":"bu yıl","1":"gelecek yıl","-1":"geçen yıl"},"relativeTime":{"future":{"one":"{0} yıl sonra","other":"{0} yıl sonra"},"past":{"one":"{0} yıl önce","other":"{0} yıl önce"}}},"month":{"displayName":"Ay","relative":{"0":"bu ay","1":"gelecek ay","-1":"geçen ay"},"relativeTime":{"future":{"one":"{0} ay sonra","other":"{0} ay sonra"},"past":{"one":"{0} ay önce","other":"{0} ay önce"}}},"day":{"displayName":"Gün","relative":{"0":"bugün","1":"yarın","2":"öbür gün","-1":"dün","-2":"evvelsi gün"},"relativeTime":{"future":{"one":"{0} gün sonra","other":"{0} gün sonra"},"past":{"one":"{0} gün önce","other":"{0} gün önce"}}},"hour":{"displayName":"Saat","relativeTime":{"future":{"one":"{0} saat sonra","other":"{0} saat sonra"},"past":{"one":"{0} saat önce","other":"{0} saat önce"}}},"minute":{"displayName":"Dakika","relativeTime":{"future":{"one":"{0} dakika sonra","other":"{0} dakika sonra"},"past":{"one":"{0} dakika önce","other":"{0} dakika önce"}}},"second":{"displayName":"Saniye","relative":{"0":"şimdi"},"relativeTime":{"future":{"one":"{0} saniye sonra","other":"{0} saniye sonra"},"past":{"one":"{0} saniye önce","other":"{0} saniye önce"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"tr-CY","parentLocale":"tr"});
HandlebarsIntl.__addLocaleData({"locale":"tr-TR","parentLocale":"tr"});

HandlebarsIntl.__addLocaleData({"locale":"ts","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ts-ZA","parentLocale":"ts"});

HandlebarsIntl.__addLocaleData({"locale":"twq","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Jiiri","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Handu","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Zaari","relative":{"0":"Hõo","1":"Suba","-1":"Bi"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Guuru","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Miniti","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Miti","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"twq-NE","parentLocale":"twq"});

HandlebarsIntl.__addLocaleData({"locale":"tzm","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return"other";return n==0||n==1||t0&&n>=11&&n<=99?"one":"other"},"fields":{"year":{"displayName":"Asseggas","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Ayur","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ass","relative":{"0":"Assa","1":"Asekka","-1":"Assenaṭ"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Tasragt","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Tusdat","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Tusnat","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"tzm-Latn","parentLocale":"tzm"});
HandlebarsIntl.__addLocaleData({"locale":"tzm-Latn-MA","parentLocale":"tzm-Latn"});

HandlebarsIntl.__addLocaleData({"locale":"ug","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"يىل","relative":{"0":"بۇ يىل","1":"كېلەر يىل","-1":"ئۆتكەن يىل"},"relativeTime":{"future":{"one":"{0} يىلدىن كېيىن","other":"{0} يىلدىن كېيىن"},"past":{"one":"{0} يىل ئىلگىرى","other":"{0} يىل ئىلگىرى"}}},"month":{"displayName":"ئاي","relative":{"0":"بۇ ئاي","1":"كېلەر ئاي","-1":"ئۆتكەن ئاي"},"relativeTime":{"future":{"one":"{0} ئايدىن كېيىن","other":"{0} ئايدىن كېيىن"},"past":{"one":"{0} ئاي ئىلگىرى","other":"{0} ئاي ئىلگىرى"}}},"day":{"displayName":"كۈن","relative":{"0":"بۈگۈن","1":"ئەتە","-1":"تۈنۈگۈن"},"relativeTime":{"future":{"one":"{0} كۈندىن كېيىن","other":"{0} كۈندىن كېيىن"},"past":{"one":"{0} كۈن ئىلگىرى","other":"{0} كۈن ئىلگىرى"}}},"hour":{"displayName":"سائەت","relativeTime":{"future":{"one":"{0} سائەتتىن كېيىن","other":"{0} سائەتتىن كېيىن"},"past":{"one":"{0} سائەت ئىلگىرى","other":"{0} سائەت ئىلگىرى"}}},"minute":{"displayName":"مىنۇت","relativeTime":{"future":{"one":"{0} مىنۇتتىن كېيىن","other":"{0} مىنۇتتىن كېيىن"},"past":{"one":"{0} مىنۇت ئىلگىرى","other":"{0} مىنۇت ئىلگىرى"}}},"second":{"displayName":"سېكۇنت","relative":{"0":"now"},"relativeTime":{"future":{"one":"{0} سېكۇنتتىن كېيىن","other":"{0} سېكۇنتتىن كېيىن"},"past":{"one":"{0} سېكۇنت ئىلگىرى","other":"{0} سېكۇنت ئىلگىرى"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ug-Arab","parentLocale":"ug"});
HandlebarsIntl.__addLocaleData({"locale":"ug-Arab-CN","parentLocale":"ug-Arab"});

HandlebarsIntl.__addLocaleData({"locale":"uk","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2),i10=i.slice(-1),i100=i.slice(-2);if(ord)return n10==3&&n100!=13?"few":"other";return v0&&i10==1&&i100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)?"few":v0&&i10==0||v0&&(i10>=5&&i10<=9)||v0&&(i100>=11&&i100<=14)?"many":"other"},"fields":{"year":{"displayName":"Рік","relative":{"0":"цього року","1":"наступного року","-1":"торік"},"relativeTime":{"future":{"one":"через {0} рік","few":"через {0} роки","many":"через {0} років","other":"через {0} року"},"past":{"one":"{0} рік тому","few":"{0} роки тому","many":"{0} років тому","other":"{0} року тому"}}},"month":{"displayName":"Місяць","relative":{"0":"цього місяця","1":"наступного місяця","-1":"минулого місяця"},"relativeTime":{"future":{"one":"через {0} місяць","few":"через {0} місяці","many":"через {0} місяців","other":"через {0} місяця"},"past":{"one":"{0} місяць тому","few":"{0} місяці тому","many":"{0} місяців тому","other":"{0} місяця тому"}}},"day":{"displayName":"День","relative":{"0":"сьогодні","1":"завтра","2":"післязавтра","-1":"учора","-2":"позавчора"},"relativeTime":{"future":{"one":"через {0} день","few":"через {0} дні","many":"через {0} днів","other":"через {0} дня"},"past":{"one":"{0} день тому","few":"{0} дні тому","many":"{0} днів тому","other":"{0} дня тому"}}},"hour":{"displayName":"Година","relativeTime":{"future":{"one":"через {0} годину","few":"через {0} години","many":"через {0} годин","other":"через {0} години"},"past":{"one":"{0} годину тому","few":"{0} години тому","many":"{0} годин тому","other":"{0} години тому"}}},"minute":{"displayName":"Хвилина","relativeTime":{"future":{"one":"через {0} хвилину","few":"через {0} хвилини","many":"через {0} хвилин","other":"через {0} хвилини"},"past":{"one":"{0} хвилину тому","few":"{0} хвилини тому","many":"{0} хвилин тому","other":"{0} хвилини тому"}}},"second":{"displayName":"Секунда","relative":{"0":"зараз"},"relativeTime":{"future":{"one":"через {0} секунду","few":"через {0} секунди","many":"через {0} секунд","other":"через {0} секунди"},"past":{"one":"{0} секунду тому","few":"{0} секунди тому","many":"{0} секунд тому","other":"{0} секунди тому"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"uk-UA","parentLocale":"uk"});

HandlebarsIntl.__addLocaleData({"locale":"ur","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"سال","relative":{"0":"اس سال","1":"اگلے سال","-1":"گزشتہ سال"},"relativeTime":{"future":{"one":"{0} سال میں","other":"{0} سال میں"},"past":{"one":"{0} سال پہلے","other":"{0} سال پہلے"}}},"month":{"displayName":"مہینہ","relative":{"0":"اس مہینہ","1":"اگلے مہینہ","-1":"پچھلے مہینہ"},"relativeTime":{"future":{"one":"{0} مہینہ میں","other":"{0} مہینے میں"},"past":{"one":"{0} مہینہ پہلے","other":"{0} مہینے پہلے"}}},"day":{"displayName":"دن","relative":{"0":"آج","1":"آئندہ کل","2":"آنے والا پرسوں","-1":"گزشتہ کل","-2":"گزشتہ پرسوں"},"relativeTime":{"future":{"one":"{0} دن میں","other":"{0} دنوں میں"},"past":{"one":"{0} دن پہلے","other":"{0} دنوں پہلے"}}},"hour":{"displayName":"گھنٹہ","relativeTime":{"future":{"one":"{0} گھنٹہ میں","other":"{0} گھنٹے میں"},"past":{"one":"{0} گھنٹہ پہلے","other":"{0} گھنٹے پہلے"}}},"minute":{"displayName":"منٹ","relativeTime":{"future":{"one":"{0} منٹ میں","other":"{0} منٹ میں"},"past":{"one":"{0} منٹ پہلے","other":"{0} منٹ پہلے"}}},"second":{"displayName":"سیکنڈ","relative":{"0":"اب"},"relativeTime":{"future":{"one":"{0} سیکنڈ میں","other":"{0} سیکنڈ میں"},"past":{"one":"{0} سیکنڈ پہلے","other":"{0} سیکنڈ پہلے"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ur-IN","parentLocale":"ur","fields":{"year":{"displayName":"سال","relative":{"0":"اس سال","1":"اگلے سال","-1":"گزشتہ سال"},"relativeTime":{"future":{"one":"{0} سال میں","other":"{0} سالوں میں"},"past":{"one":"{0} سال پہلے","other":"{0} سالوں پہلے"}}},"month":{"displayName":"مہینہ","relative":{"0":"اس ماہ","1":"اگلے ماہ","-1":"گزشتہ ماہ"},"relativeTime":{"future":{"one":"{0} ماہ میں","other":"{0} ماہ میں"},"past":{"one":"{0} ماہ قبل","other":"{0} ماہ قبل"}}},"day":{"displayName":"دن","relative":{"0":"آج","1":"کل","2":"آنے والا پرسوں","-1":"کل","-2":"گزشتہ پرسوں"},"relativeTime":{"future":{"one":"{0} دن میں","other":"{0} دنوں میں"},"past":{"one":"{0} دن پہلے","other":"{0} دنوں پہلے"}}},"hour":{"displayName":"گھنٹہ","relativeTime":{"future":{"one":"{0} گھنٹہ میں","other":"{0} گھنٹے میں"},"past":{"one":"{0} گھنٹہ پہلے","other":"{0} گھنٹے پہلے"}}},"minute":{"displayName":"منٹ","relativeTime":{"future":{"one":"{0} منٹ میں","other":"{0} منٹ میں"},"past":{"one":"{0} منٹ قبل","other":"{0} منٹ قبل"}}},"second":{"displayName":"سیکنڈ","relative":{"0":"اب"},"relativeTime":{"future":{"one":"{0} سیکنڈ میں","other":"{0} سیکنڈ میں"},"past":{"one":"{0} سیکنڈ قبل","other":"{0} سیکنڈ قبل"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ur-PK","parentLocale":"ur"});

HandlebarsIntl.__addLocaleData({"locale":"uz","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Yil","relative":{"0":"bu yil","1":"keyingi yil","-1":"oʻtgan yil"},"relativeTime":{"future":{"one":"{0} yildan soʻng","other":"{0} yildan soʻng"},"past":{"one":"{0} yil avval","other":"{0} yil avval"}}},"month":{"displayName":"Oy","relative":{"0":"bu oy","1":"keyingi oy","-1":"oʻtgan oy"},"relativeTime":{"future":{"one":"{0} oydan soʻng","other":"{0} oydan soʻng"},"past":{"one":"{0} oy avval","other":"{0} oy avval"}}},"day":{"displayName":"Kun","relative":{"0":"bugun","1":"ertaga","-1":"kecha"},"relativeTime":{"future":{"one":"{0} kundan soʻng","other":"{0} kundan soʻng"},"past":{"one":"{0} kun oldin","other":"{0} kun oldin"}}},"hour":{"displayName":"Soat","relativeTime":{"future":{"one":"{0} soatdan soʻng","other":"{0} soatdan soʻng"},"past":{"one":"{0} soat oldin","other":"{0} soat oldin"}}},"minute":{"displayName":"Daqiqa","relativeTime":{"future":{"one":"{0} daqiqadan soʻng","other":"{0} daqiqadan soʻng"},"past":{"one":"{0} daqiqa oldin","other":"{0} daqiqa oldin"}}},"second":{"displayName":"Soniya","relative":{"0":"hozir"},"relativeTime":{"future":{"one":"{0} soniyadan soʻng","other":"{0} soniyadan soʻng"},"past":{"one":"{0} soniya oldin","other":"{0} soniya oldin"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"uz-Arab","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"uz-Arab-AF","parentLocale":"uz-Arab"});
HandlebarsIntl.__addLocaleData({"locale":"uz-Cyrl","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Йил","relative":{"0":"бу йил","1":"кейинги йил","-1":"ўтган йил"},"relativeTime":{"future":{"one":"{0} йилдан сўнг","other":"{0} йилдан сўнг"},"past":{"one":"{0} йил аввал","other":"{0} йил аввал"}}},"month":{"displayName":"Ой","relative":{"0":"бу ой","1":"кейинги ой","-1":"ўтган ой"},"relativeTime":{"future":{"one":"{0} ойдан сўнг","other":"{0} ойдан сўнг"},"past":{"one":"{0} ой аввал","other":"{0} ой аввал"}}},"day":{"displayName":"Кун","relative":{"0":"бугун","1":"эртага","-1":"кеча"},"relativeTime":{"future":{"one":"{0} кундан сўнг","other":"{0} кундан сўнг"},"past":{"one":"{0} кун олдин","other":"{0} кун олдин"}}},"hour":{"displayName":"Соат","relativeTime":{"future":{"one":"{0} соатдан сўнг","other":"{0} соатдан сўнг"},"past":{"one":"{0} соат олдин","other":"{0} соат олдин"}}},"minute":{"displayName":"Дақиқа","relativeTime":{"future":{"one":"{0} дақиқадан сўнг","other":"{0} дақиқадан сўнг"},"past":{"one":"{0} дақиқа олдин","other":"{0} дақиқа олдин"}}},"second":{"displayName":"Сония","relative":{"0":"ҳозир"},"relativeTime":{"future":{"one":"{0} сониядан сўнг","other":"{0} сониядан сўнг"},"past":{"one":"{0} сония олдин","other":"{0} сония олдин"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"uz-Cyrl-UZ","parentLocale":"uz-Cyrl"});
HandlebarsIntl.__addLocaleData({"locale":"uz-Latn","parentLocale":"uz"});
HandlebarsIntl.__addLocaleData({"locale":"uz-Latn-UZ","parentLocale":"uz-Latn"});

HandlebarsIntl.__addLocaleData({"locale":"vai","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"ꕢꘋ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"ꕪꖃ","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"ꔎꔒ","relative":{"0":"ꗦꗷ","1":"ꔻꕯ","-1":"ꖴꖸ"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"ꕌꕎ","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"ꕆꕇ","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"ꕧꕃꕧꕪ","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"vai-Latn","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"saŋ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"kalo","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"tele","relative":{"0":"wɛlɛ","1":"sina","-1":"kunu"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"hawa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"mini","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"jaki-jaka","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"vai-Latn-LR","parentLocale":"vai-Latn"});
HandlebarsIntl.__addLocaleData({"locale":"vai-Vaii","parentLocale":"vai"});
HandlebarsIntl.__addLocaleData({"locale":"vai-Vaii-LR","parentLocale":"vai-Vaii"});

HandlebarsIntl.__addLocaleData({"locale":"ve","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"ve-ZA","parentLocale":"ve"});

HandlebarsIntl.__addLocaleData({"locale":"vi","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":"other";return"other"},"fields":{"year":{"displayName":"Năm","relative":{"0":"năm nay","1":"năm sau","-1":"năm ngoái"},"relativeTime":{"future":{"other":"trong {0} năm nữa"},"past":{"other":"{0} năm trước"}}},"month":{"displayName":"Tháng","relative":{"0":"tháng này","1":"tháng sau","-1":"tháng trước"},"relativeTime":{"future":{"other":"trong {0} tháng nữa"},"past":{"other":"{0} tháng trước"}}},"day":{"displayName":"Ngày","relative":{"0":"hôm nay","1":"ngày mai","2":"ngày kia","-1":"hôm qua","-2":"hôm kia"},"relativeTime":{"future":{"other":"trong {0} ngày nữa"},"past":{"other":"{0} ngày trước"}}},"hour":{"displayName":"Giờ","relativeTime":{"future":{"other":"trong {0} giờ nữa"},"past":{"other":"{0} giờ trước"}}},"minute":{"displayName":"Phút","relativeTime":{"future":{"other":"trong {0} phút nữa"},"past":{"other":"{0} phút trước"}}},"second":{"displayName":"Giây","relative":{"0":"bây giờ"},"relativeTime":{"future":{"other":"trong {0} giây nữa"},"past":{"other":"{0} giây trước"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"vi-VN","parentLocale":"vi"});

HandlebarsIntl.__addLocaleData({"locale":"vo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"yel","relative":{"0":"ayelo","1":"oyelo","-1":"äyelo"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"mul","relative":{"0":"amulo","1":"omulo","-1":"ämulo"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Tag","relative":{"0":"adelo","1":"odelo","2":"udelo","-1":"ädelo","-2":"edelo"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"düp","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"minut","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"sekun","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"vo-001","parentLocale":"vo"});

HandlebarsIntl.__addLocaleData({"locale":"vun","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Maka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Mori","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Mfiri","relative":{"0":"Inu","1":"Ngama","-1":"Ukou"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Saa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Dakyika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Sekunde","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"vun-TZ","parentLocale":"vun"});

HandlebarsIntl.__addLocaleData({"locale":"wa","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"wae","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Jár","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"I {0} jár","other":"I {0} jár"},"past":{"one":"vor {0} jár","other":"cor {0} jár"}}},"month":{"displayName":"Mánet","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"I {0} mánet","other":"I {0} mánet"},"past":{"one":"vor {0} mánet","other":"vor {0} mánet"}}},"day":{"displayName":"Tag","relative":{"0":"Hitte","1":"Móre","2":"Ubermóre","-1":"Gešter","-2":"Vorgešter"},"relativeTime":{"future":{"one":"i {0} tag","other":"i {0} täg"},"past":{"one":"vor {0} tag","other":"vor {0} täg"}}},"hour":{"displayName":"Schtund","relativeTime":{"future":{"one":"i {0} stund","other":"i {0} stunde"},"past":{"one":"vor {0} stund","other":"vor {0} stunde"}}},"minute":{"displayName":"Mínütta","relativeTime":{"future":{"one":"i {0} minüta","other":"i {0} minüte"},"past":{"one":"vor {0} minüta","other":"vor {0} minüte"}}},"second":{"displayName":"Sekunda","relative":{"0":"now"},"relativeTime":{"future":{"one":"i {0} sekund","other":"i {0} sekunde"},"past":{"one":"vor {0} sekund","other":"vor {0} sekunde"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"wae-CH","parentLocale":"wae"});

HandlebarsIntl.__addLocaleData({"locale":"wo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"xh","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});

HandlebarsIntl.__addLocaleData({"locale":"xog","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Omwaka","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Omwezi","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Olunaku","relative":{"0":"Olwaleelo (leelo)","1":"Enkyo","-1":"Edho"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Essawa","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Edakiika","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Obutikitiki","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"xog-UG","parentLocale":"xog"});

HandlebarsIntl.__addLocaleData({"locale":"yav","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"yɔɔŋ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"oóli","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"puɔ́sɛ́","relative":{"0":"ínaan","1":"nakinyám","-1":"púyoó"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"kisikɛl,","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"minít","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"síkɛn","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"yav-CM","parentLocale":"yav"});

HandlebarsIntl.__addLocaleData({"locale":"yi","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"יאָהר","relative":{"0":"הײַ יאָר","1":"איבער א יאָר","-1":"פֿאַראַיאָר"},"relativeTime":{"future":{"one":"איבער {0} יאָר","other":"איבער {0} יאָר"},"past":{"one":"פֿאַר {0} יאָר","other":"פֿאַר {0} יאָר"}}},"month":{"displayName":"מאנאַט","relative":{"0":"דעם חודש","1":"קומענדיקן חודש","-1":"פֿאַרגאנגענעם חודש"},"relativeTime":{"future":{"one":"איבער {0} חודש","other":"איבער {0} חדשים"},"past":{"one":"פֿאַר {0} חודש","other":"פֿאַר {0} חדשים"}}},"day":{"displayName":"טאג","relative":{"0":"היינט","1":"מארגן","-1":"נעכטן"},"relativeTime":{"future":{"one":"אין {0} טאָג אַרום","other":"אין {0} טעג אַרום"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"שעה","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"מינוט","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"סעקונדע","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"yi-001","parentLocale":"yi"});

HandlebarsIntl.__addLocaleData({"locale":"yo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Ọdún","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Osù","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ọjọ́","relative":{"0":"Òní","1":"Ọ̀la","2":"òtúùnla","-1":"Àná","-2":"íjẹta"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"wákàtí","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Ìsẹ́jú","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Ìsẹ́jú Ààyá","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"yo-BJ","parentLocale":"yo","fields":{"year":{"displayName":"Ɔdún","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Osù","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Ɔjɔ́","relative":{"0":"Òní","1":"Ɔ̀la","2":"òtúùnla","-1":"Àná","-2":"íjɛta"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"wákàtí","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Ìsɛ́jú","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Ìsɛ́jú Ààyá","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"yo-NG","parentLocale":"yo"});

HandlebarsIntl.__addLocaleData({"locale":"zgh","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"ⴰⵙⴳⴳⵯⴰⵙ","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"ⴰⵢⵢⵓⵔ","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"ⴰⵙⵙ","relative":{"0":"ⴰⵙⵙⴰ","1":"ⴰⵙⴽⴽⴰ","-1":"ⵉⴹⵍⵍⵉ"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"ⵜⴰⵙⵔⴰⴳⵜ","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"ⵜⵓⵙⴷⵉⴷⵜ","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"ⵜⴰⵙⵉⵏⵜ","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"zgh-MA","parentLocale":"zgh"});

HandlebarsIntl.__addLocaleData({"locale":"zh","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"年","relative":{"0":"今年","1":"明年","-1":"去年"},"relativeTime":{"future":{"other":"{0}年后"},"past":{"other":"{0}年前"}}},"month":{"displayName":"月","relative":{"0":"本月","1":"下个月","-1":"上个月"},"relativeTime":{"future":{"other":"{0}个月后"},"past":{"other":"{0}个月前"}}},"day":{"displayName":"日","relative":{"0":"今天","1":"明天","2":"后天","-1":"昨天","-2":"前天"},"relativeTime":{"future":{"other":"{0}天后"},"past":{"other":"{0}天前"}}},"hour":{"displayName":"小时","relativeTime":{"future":{"other":"{0}小时后"},"past":{"other":"{0}小时前"}}},"minute":{"displayName":"分钟","relativeTime":{"future":{"other":"{0}分钟后"},"past":{"other":"{0}分钟前"}}},"second":{"displayName":"秒钟","relative":{"0":"现在"},"relativeTime":{"future":{"other":"{0}秒钟后"},"past":{"other":"{0}秒钟前"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"zh-Hans","parentLocale":"zh"});
HandlebarsIntl.__addLocaleData({"locale":"zh-Hans-CN","parentLocale":"zh-Hans"});
HandlebarsIntl.__addLocaleData({"locale":"zh-Hans-HK","parentLocale":"zh-Hans","fields":{"year":{"displayName":"年","relative":{"0":"今年","1":"明年","-1":"去年"},"relativeTime":{"future":{"other":"{0}年后"},"past":{"other":"{0}年前"}}},"month":{"displayName":"月","relative":{"0":"本月","1":"下个月","-1":"上个月"},"relativeTime":{"future":{"other":"{0}个月后"},"past":{"other":"{0}个月前"}}},"day":{"displayName":"日","relative":{"0":"今天","1":"明天","2":"后天","-1":"昨天","-2":"前天"},"relativeTime":{"future":{"other":"{0}天后"},"past":{"other":"{0}天前"}}},"hour":{"displayName":"小时","relativeTime":{"future":{"other":"{0}小时后"},"past":{"other":"{0}小时前"}}},"minute":{"displayName":"分钟","relativeTime":{"future":{"other":"{0}分钟后"},"past":{"other":"{0}分钟前"}}},"second":{"displayName":"秒钟","relative":{"0":"现在"},"relativeTime":{"future":{"other":"{0}秒后"},"past":{"other":"{0}秒前"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"zh-Hans-MO","parentLocale":"zh-Hans","fields":{"year":{"displayName":"年","relative":{"0":"今年","1":"明年","-1":"去年"},"relativeTime":{"future":{"other":"{0}年后"},"past":{"other":"{0}年前"}}},"month":{"displayName":"月","relative":{"0":"本月","1":"下个月","-1":"上个月"},"relativeTime":{"future":{"other":"{0}个月后"},"past":{"other":"{0}个月前"}}},"day":{"displayName":"天","relative":{"0":"今天","1":"明天","2":"后天","-1":"昨天","-2":"前天"},"relativeTime":{"future":{"other":"{0}天后"},"past":{"other":"{0}天前"}}},"hour":{"displayName":"小时","relativeTime":{"future":{"other":"{0}小时后"},"past":{"other":"{0}小时前"}}},"minute":{"displayName":"分钟","relativeTime":{"future":{"other":"{0}分钟后"},"past":{"other":"{0}分钟前"}}},"second":{"displayName":"秒钟","relative":{"0":"现在"},"relativeTime":{"future":{"other":"{0}秒后"},"past":{"other":"{0}秒前"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"zh-Hans-SG","parentLocale":"zh-Hans","fields":{"year":{"displayName":"年","relative":{"0":"今年","1":"明年","-1":"去年"},"relativeTime":{"future":{"other":"{0}年后"},"past":{"other":"{0}年前"}}},"month":{"displayName":"月","relative":{"0":"本月","1":"下个月","-1":"上个月"},"relativeTime":{"future":{"other":"{0}个月后"},"past":{"other":"{0}个月前"}}},"day":{"displayName":"日","relative":{"0":"今天","1":"明天","2":"后天","-1":"昨天","-2":"前天"},"relativeTime":{"future":{"other":"{0}天后"},"past":{"other":"{0}天前"}}},"hour":{"displayName":"小时","relativeTime":{"future":{"other":"{0}小时后"},"past":{"other":"{0}小时前"}}},"minute":{"displayName":"分钟","relativeTime":{"future":{"other":"{0}分钟后"},"past":{"other":"{0}分钟前"}}},"second":{"displayName":"秒钟","relative":{"0":"现在"},"relativeTime":{"future":{"other":"{0}秒后"},"past":{"other":"{0}秒前"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"zh-Hant","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"年","relative":{"0":"今年","1":"明年","-1":"去年"},"relativeTime":{"future":{"other":"{0} 年後"},"past":{"other":"{0} 年前"}}},"month":{"displayName":"月","relative":{"0":"本月","1":"下個月","-1":"上個月"},"relativeTime":{"future":{"other":"{0} 個月後"},"past":{"other":"{0} 個月前"}}},"day":{"displayName":"日","relative":{"0":"今天","1":"明天","2":"後天","-1":"昨天","-2":"前天"},"relativeTime":{"future":{"other":"{0} 天後"},"past":{"other":"{0} 天前"}}},"hour":{"displayName":"小時","relativeTime":{"future":{"other":"{0} 小時後"},"past":{"other":"{0} 小時前"}}},"minute":{"displayName":"分鐘","relativeTime":{"future":{"other":"{0} 分鐘後"},"past":{"other":"{0} 分鐘前"}}},"second":{"displayName":"秒","relative":{"0":"現在"},"relativeTime":{"future":{"other":"{0} 秒後"},"past":{"other":"{0} 秒前"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"zh-Hant-HK","parentLocale":"zh-Hant","fields":{"year":{"displayName":"年","relative":{"0":"今年","1":"明年","-1":"去年"},"relativeTime":{"future":{"other":"{0} 年後"},"past":{"other":"{0} 年前"}}},"month":{"displayName":"月","relative":{"0":"本月","1":"下個月","-1":"上個月"},"relativeTime":{"future":{"other":"{0} 個月後"},"past":{"other":"{0} 個月前"}}},"day":{"displayName":"日","relative":{"0":"今日","1":"明日","2":"後日","-1":"昨日","-2":"前日"},"relativeTime":{"future":{"other":"{0} 日後"},"past":{"other":"{0} 日前"}}},"hour":{"displayName":"小時","relativeTime":{"future":{"other":"{0} 小時後"},"past":{"other":"{0} 小時前"}}},"minute":{"displayName":"分鐘","relativeTime":{"future":{"other":"{0} 分鐘後"},"past":{"other":"{0} 分鐘前"}}},"second":{"displayName":"秒","relative":{"0":"現在"},"relativeTime":{"future":{"other":"{0} 秒後"},"past":{"other":"{0} 秒前"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"zh-Hant-MO","parentLocale":"zh-Hant-HK"});
HandlebarsIntl.__addLocaleData({"locale":"zh-Hant-TW","parentLocale":"zh-Hant"});

HandlebarsIntl.__addLocaleData({"locale":"zu","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<=1?"one":"other"},"fields":{"year":{"displayName":"Unyaka","relative":{"0":"kulo nyaka","1":"unyaka ozayo","-1":"onyakeni odlule"},"relativeTime":{"future":{"one":"onyakeni ongu-{0}","other":"Eminyakeni engu-{0}"},"past":{"one":"{0} unyaka odlule","other":"{0} iminyaka edlule"}}},"month":{"displayName":"Inyanga","relative":{"0":"le nyanga","1":"inyanga ezayo","-1":"inyanga edlule"},"relativeTime":{"future":{"one":"Enyangeni engu-{0}","other":"Ezinyangeni ezingu-{0}"},"past":{"one":"{0} inyanga edlule","other":"{0} izinyanga ezedlule"}}},"day":{"displayName":"usuku","relative":{"0":"namhlanje","1":"kusasa","2":"Usuku olulandela olakusasa","-1":"izolo","-2":"Usuku olwandulela olwayizolo"},"relativeTime":{"future":{"one":"Osukwini olungu-{0}","other":"Ezinsukwini ezingu-{0}"},"past":{"one":"osukwini olungu-{0} olwedlule","other":"ezinsukwini ezingu-{0} ezedlule."}}},"hour":{"displayName":"Ihora","relativeTime":{"future":{"one":"Ehoreni elingu-{0}","other":"Emahoreni angu-{0}"},"past":{"one":"ehoreni eligu-{0} eledluli","other":"emahoreni angu-{0} edlule"}}},"minute":{"displayName":"Iminithi","relativeTime":{"future":{"one":"Kumunithi engu-{0}","other":"Emaminithini angu-{0}"},"past":{"one":"eminithini elingu-{0} eledlule","other":"amaminithi angu-{0} adlule"}}},"second":{"displayName":"Isekhondi","relative":{"0":"manje"},"relativeTime":{"future":{"one":"Kusekhondi elingu-{0}","other":"Kumasekhondi angu-{0}"},"past":{"one":"isekhondi elingu-{0} eledlule","other":"amasekhondi angu-{0} adlule"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"zu-ZA","parentLocale":"zu"});

//# sourceMappingURL=handlebars-intl-with-locales.js.map
HandlebarsIntl.__addLocaleData({"locale":"es","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"Año","relative":{"0":"este año","1":"el próximo año","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"Mes","relative":{"0":"este mes","1":"el próximo mes","-1":"el mes pasado"},"relativeTime":{"future":{"one":"dentro de {0} mes","other":"dentro de {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"Día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-1":"ayer","-2":"antes de ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"es-419","parentLocale":"es","fields":{"year":{"displayName":"Año","relative":{"0":"Este año","1":"Año próximo","-1":"Año pasado"},"relativeTime":{"future":{"one":"En {0} año","other":"En {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"Mes","relative":{"0":"Este mes","1":"Mes próximo","-1":"El mes pasado"},"relativeTime":{"future":{"one":"En {0} mes","other":"En {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"Día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-1":"ayer","-2":"antes de ayer"},"relativeTime":{"future":{"one":"En {0} día","other":"En {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"one":"En {0} hora","other":"En {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"En {0} minuto","other":"En {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"En {0} segundo","other":"En {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"es-AR","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-BO","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-CL","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-CO","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-CR","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-CU","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-DO","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-EA","parentLocale":"es"});
HandlebarsIntl.__addLocaleData({"locale":"es-EC","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-ES","parentLocale":"es"});
HandlebarsIntl.__addLocaleData({"locale":"es-GQ","parentLocale":"es"});
HandlebarsIntl.__addLocaleData({"locale":"es-GT","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-HN","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-IC","parentLocale":"es"});
HandlebarsIntl.__addLocaleData({"locale":"es-MX","parentLocale":"es-419","fields":{"year":{"displayName":"Año","relative":{"0":"este año","1":"el año próximo","-1":"el año pasado"},"relativeTime":{"future":{"one":"En {0} año","other":"En {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"Mes","relative":{"0":"este mes","1":"el mes próximo","-1":"el mes pasado"},"relativeTime":{"future":{"one":"en {0} mes","other":"en {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"Día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-1":"ayer","-2":"antes de ayer"},"relativeTime":{"future":{"one":"En {0} día","other":"En {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"one":"En {0} hora","other":"En {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"En {0} minuto","other":"En {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"En {0} segundo","other":"En {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
HandlebarsIntl.__addLocaleData({"locale":"es-NI","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-PA","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-PE","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-PH","parentLocale":"es"});
HandlebarsIntl.__addLocaleData({"locale":"es-PR","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-PY","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-SV","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-US","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-UY","parentLocale":"es-419"});
HandlebarsIntl.__addLocaleData({"locale":"es-VE","parentLocale":"es-419"});

!function(){function a(a){return a.split("").reverse().join("")}function b(a,b,c){if((a[b]||a[c])&&a[b]===a[c])throw Error(b)}function c(b,c,d,e,f,g,h,i,j,k,l,m){h=m;var n,o=l="";return g&&(m=g(m)),"number"==typeof m&&isFinite(m)?(b&&0===parseFloat(m.toFixed(b))&&(m=0),0>m&&(n=!0,m=Math.abs(m)),b&&(g=Math.pow(10,b),m=(Math.round(m*g)/g).toFixed(b)),m=m.toString(),-1!==m.indexOf(".")&&(b=m.split("."),m=b[0],d&&(l=d+b[1])),c&&(m=a(m).match(/.{1,3}/g),m=a(m.join(a(c)))),n&&i&&(o+=i),e&&(o+=e),n&&j&&(o+=j),o=o+m+l,f&&(o+=f),k&&(o=k(o,h)),o):!1}function d(a,b,c,d,e,f,g,h,i,j,k,l){var m;return a="",k&&(l=k(l)),l&&"string"==typeof l?(h&&l.substring(0,h.length)===h&&(l=l.replace(h,""),m=!0),d&&l.substring(0,d.length)===d&&(l=l.replace(d,"")),i&&l.substring(0,i.length)===i&&(l=l.replace(i,""),m=!0),e&&l.slice(-1*e.length)===e&&(l=l.slice(0,-1*e.length)),b&&(l=l.split(b).join("")),c&&(l=l.replace(c,".")),m&&(a+="-"),a=Number((a+l).replace(/[^0-9\.\-.]/g,"")),g&&(a=g(a)),"number"==typeof a&&isFinite(a)?a:!1):!1}function e(a){var c,d,e,f={};for(c=0;c<h.length;c+=1)d=h[c],e=a[d],void 0===e?f[d]="negative"!==d||f.negativeBefore?"mark"===d&&"."!==f.thousand?".":!1:"-":"decimals"===d?e>0&&8>e&&(f[d]=e):"encoder"===d||"decoder"===d||"edit"===d||"undo"===d?"function"==typeof e&&(f[d]=e):"string"==typeof e&&(f[d]=e);return b(f,"mark","thousand"),b(f,"prefix","negative"),b(f,"prefix","negativeBefore"),f}function f(a,b,c){var d,e=[];for(d=0;d<h.length;d+=1)e.push(a[h[d]]);return e.push(c),b.apply("",e)}function g(a){return this instanceof g?void("object"==typeof a&&(a=e(a),this.to=function(b){return f(a,c,b)},this.from=function(b){return f(a,d,b)})):new g(a)}var h="decimals thousand mark prefix postfix encoder decoder negativeBefore negative edit undo".split(" ");window.wNumb=g}(),function(a){if("function"==typeof define&&define.amd)define([],a);else if("object"==typeof exports){var b=require("fs");module.exports=a(),module.exports.css=function(){return b.readFileSync(__dirname+"/nouislider.min.css","utf8")}}else window.noUiSlider=a()}(function(){"use strict";function a(a){return a.filter(function(a){return this[a]?!1:this[a]=!0},{})}function b(a,b){return Math.round(a/b)*b}function c(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.defaultView||c.parentWindow,e=c.documentElement,f=d.pageXOffset;return/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(f=0),{top:b.top+d.pageYOffset-e.clientTop,left:b.left+f-e.clientLeft}}function d(a){return"number"==typeof a&&!isNaN(a)&&isFinite(a)}function e(a){var b=Math.pow(10,7);return Number((Math.round(a*b)/b).toFixed(7))}function f(a,b,c){j(a,b),setTimeout(function(){k(a,b)},c)}function g(a){return Math.max(Math.min(a,100),0)}function h(a){return Array.isArray(a)?a:[a]}function i(a){var b=a.split(".");return b.length>1?b[1].length:0}function j(a,b){a.classList?a.classList.add(b):a.className+=" "+b}function k(a,b){a.classList?a.classList.remove(b):a.className=a.className.replace(new RegExp("(^|\\b)"+b.split(" ").join("|")+"(\\b|$)","gi")," ")}function l(a,b){a.classList?a.classList.contains(b):new RegExp("(^| )"+b+"( |$)","gi").test(a.className)}function m(a,b){return 100/(b-a)}function n(a,b){return 100*b/(a[1]-a[0])}function o(a,b){return n(a,a[0]<0?b+Math.abs(a[0]):b-a[0])}function p(a,b){return b*(a[1]-a[0])/100+a[0]}function q(a,b){for(var c=1;a>=b[c];)c+=1;return c}function r(a,b,c){if(c>=a.slice(-1)[0])return 100;var d,e,f,g,h=q(c,a);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],f+o([d,e],c)/m(f,g)}function s(a,b,c){if(c>=100)return a.slice(-1)[0];var d,e,f,g,h=q(c,b);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],p([d,e],(c-f)*m(f,g))}function t(a,c,d,e){if(100===e)return e;var f,g,h=q(e,a);return d?(f=a[h-1],g=a[h],e-f>(g-f)/2?g:f):c[h-1]?a[h-1]+b(e-a[h-1],c[h-1]):e}function u(a,b,c){var e;if("number"==typeof b&&(b=[b]),"[object Array]"!==Object.prototype.toString.call(b))throw new Error("noUiSlider: 'range' contains invalid value.");if(e="min"===a?0:"max"===a?100:parseFloat(a),!d(e)||!d(b[0]))throw new Error("noUiSlider: 'range' value isn't numeric.");c.xPct.push(e),c.xVal.push(b[0]),e?c.xSteps.push(isNaN(b[1])?!1:b[1]):isNaN(b[1])||(c.xSteps[0]=b[1])}function v(a,b,c){return b?void(c.xSteps[a]=n([c.xVal[a],c.xVal[a+1]],b)/m(c.xPct[a],c.xPct[a+1])):!0}function w(a,b,c,d){this.xPct=[],this.xVal=[],this.xSteps=[d||!1],this.xNumSteps=[!1],this.snap=b,this.direction=c;var e,f=[];for(e in a)a.hasOwnProperty(e)&&f.push([a[e],e]);for(f.sort(function(a,b){return a[0]-b[0]}),e=0;e<f.length;e++)u(f[e][1],f[e][0],this);for(this.xNumSteps=this.xSteps.slice(0),e=0;e<this.xNumSteps.length;e++)v(e,this.xNumSteps[e],this)}function x(a,b){if(!d(b))throw new Error("noUiSlider: 'step' is not numeric.");a.singleStep=b}function y(a,b){if("object"!=typeof b||Array.isArray(b))throw new Error("noUiSlider: 'range' is not an object.");if(void 0===b.min||void 0===b.max)throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");a.spectrum=new w(b,a.snap,a.dir,a.singleStep)}function z(a,b){if(b=h(b),!Array.isArray(b)||!b.length||b.length>2)throw new Error("noUiSlider: 'start' option is incorrect.");a.handles=b.length,a.start=b}function A(a,b){if(a.snap=b,"boolean"!=typeof b)throw new Error("noUiSlider: 'snap' option must be a boolean.")}function B(a,b){if(a.animate=b,"boolean"!=typeof b)throw new Error("noUiSlider: 'animate' option must be a boolean.")}function C(a,b){if("lower"===b&&1===a.handles)a.connect=1;else if("upper"===b&&1===a.handles)a.connect=2;else if(b===!0&&2===a.handles)a.connect=3;else{if(b!==!1)throw new Error("noUiSlider: 'connect' option doesn't match handle count.");a.connect=0}}function D(a,b){switch(b){case"horizontal":a.ort=0;break;case"vertical":a.ort=1;break;default:throw new Error("noUiSlider: 'orientation' option is invalid.")}}function E(a,b){if(!d(b))throw new Error("noUiSlider: 'margin' option must be numeric.");if(a.margin=a.spectrum.getMargin(b),!a.margin)throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.")}function F(a,b){if(!d(b))throw new Error("noUiSlider: 'limit' option must be numeric.");if(a.limit=a.spectrum.getMargin(b),!a.limit)throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.")}function G(a,b){switch(b){case"ltr":a.dir=0;break;case"rtl":a.dir=1,a.connect=[0,2,1,3][a.connect];break;default:throw new Error("noUiSlider: 'direction' option was not recognized.")}}function H(a,b){if("string"!=typeof b)throw new Error("noUiSlider: 'behaviour' must be a string containing options.");var c=b.indexOf("tap")>=0,d=b.indexOf("drag")>=0,e=b.indexOf("fixed")>=0,f=b.indexOf("snap")>=0;a.events={tap:c||f,drag:d,fixed:e,snap:f}}function I(a,b){if(a.format=b,"function"==typeof b.to&&"function"==typeof b.from)return!0;throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.")}function J(a){var b,c={margin:0,limit:0,animate:!0,format:U};b={step:{r:!1,t:x},start:{r:!0,t:z},connect:{r:!0,t:C},direction:{r:!0,t:G},snap:{r:!1,t:A},animate:{r:!1,t:B},range:{r:!0,t:y},orientation:{r:!1,t:D},margin:{r:!1,t:E},limit:{r:!1,t:F},behaviour:{r:!0,t:H},format:{r:!1,t:I}};var d={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal"};return Object.keys(d).forEach(function(b){void 0===a[b]&&(a[b]=d[b])}),Object.keys(b).forEach(function(d){var e=b[d];if(void 0===a[d]){if(e.r)throw new Error("noUiSlider: '"+d+"' is required.");return!0}e.t(c,a[d])}),c.pips=a.pips,c.style=c.ort?"top":"left",c}function K(a,b,c){var d=a+b[0],e=a+b[1];return c?(0>d&&(e+=Math.abs(d)),e>100&&(d-=e-100),[g(d),g(e)]):[d,e]}function L(a){a.preventDefault();var b,c,d=0===a.type.indexOf("touch"),e=0===a.type.indexOf("mouse"),f=0===a.type.indexOf("pointer"),g=a;return 0===a.type.indexOf("MSPointer")&&(f=!0),d&&(b=a.changedTouches[0].pageX,c=a.changedTouches[0].pageY),(e||f)&&(b=a.clientX+window.pageXOffset,c=a.clientY+window.pageYOffset),g.points=[b,c],g.cursor=e||f,g}function M(a,b){var c=document.createElement("div"),d=document.createElement("div"),e=["-lower","-upper"];return a&&e.reverse(),j(d,T[3]),j(d,T[3]+e[b]),j(c,T[2]),c.appendChild(d),c}function N(a,b,c){switch(a){case 1:j(b,T[7]),j(c[0],T[6]);break;case 3:j(c[1],T[6]);case 2:j(c[0],T[7]);case 0:j(b,T[6])}}function O(a,b,c){var d,e=[];for(d=0;a>d;d+=1)e.push(c.appendChild(M(b,d)));return e}function P(a,b,c){j(c,T[0]),j(c,T[8+a]),j(c,T[4+b]);var d=document.createElement("div");return j(d,T[1]),c.appendChild(d),d}function Q(b,d){function e(a,b,c){if("range"===a||"steps"===a)return M.xVal;if("count"===a){var d,e=100/(b-1),f=0;for(b=[];(d=f++*e)<=100;)b.push(d);a="positions"}return"positions"===a?b.map(function(a){return M.fromStepping(c?M.getStep(a):a)}):"values"===a?c?b.map(function(a){return M.fromStepping(M.getStep(M.toStepping(a)))}):b:void 0}function m(b,c,d){var e=M.direction,f={},g=M.xVal[0],h=M.xVal[M.xVal.length-1],i=!1,j=!1,k=0;return M.direction=0,d=a(d.slice().sort(function(a,b){return a-b})),d[0]!==g&&(d.unshift(g),i=!0),d[d.length-1]!==h&&(d.push(h),j=!0),d.forEach(function(a,e){var g,h,l,m,n,o,p,q,r,s,t=a,u=d[e+1];if("steps"===c&&(g=M.xNumSteps[e]),g||(g=u-t),t!==!1&&void 0!==u)for(h=t;u>=h;h+=g){for(m=M.toStepping(h),n=m-k,q=n/b,r=Math.round(q),s=n/r,l=1;r>=l;l+=1)o=k+l*s,f[o.toFixed(5)]=["x",0];p=d.indexOf(h)>-1?1:"steps"===c?2:0,!e&&i&&(p=0),h===u&&j||(f[m.toFixed(5)]=[h,p]),k=m}}),M.direction=e,f}function n(a,b,c){function e(a){return["-normal","-large","-sub"][a]}function f(a,b,c){return'class="'+b+" "+b+"-"+h+" "+b+e(c[1])+'" style="'+d.style+": "+a+'%"'}function g(a,d){M.direction&&(a=100-a),d[1]=d[1]&&b?b(d[0],d[1]):d[1],i.innerHTML+="<div "+f(a,"noUi-marker",d)+"></div>",d[1]&&(i.innerHTML+="<div "+f(a,"noUi-value",d)+">"+c.to(d[0])+"</div>")}var h=["horizontal","vertical"][d.ort],i=document.createElement("div");return j(i,"noUi-pips"),j(i,"noUi-pips-"+h),Object.keys(a).forEach(function(b){g(b,a[b])}),i}function o(a){var b=a.mode,c=a.density||1,d=a.filter||!1,f=a.values||!1,g=a.stepped||!1,h=e(b,f,g),i=m(c,b,h),j=a.format||{to:Math.round};return I.appendChild(n(i,d,j))}function p(){return G["offset"+["Width","Height"][d.ort]]}function q(a,b){void 0!==b&&(b=Math.abs(b-d.dir)),Object.keys(R).forEach(function(c){var d=c.split(".")[0];a===d&&R[c].forEach(function(a){a(h(B()),b,r(Array.prototype.slice.call(Q)))})})}function r(a){return 1===a.length?a[0]:d.dir?a.reverse():a}function s(a,b,c,e){var f=function(b){return I.hasAttribute("disabled")?!1:l(I,T[14])?!1:(b=L(b),a===S.start&&void 0!==b.buttons&&b.buttons>1?!1:(b.calcPoint=b.points[d.ort],void c(b,e)))},g=[];return a.split(" ").forEach(function(a){b.addEventListener(a,f,!1),g.push([a,f])}),g}function t(a,b){var c,d,e=b.handles||H,f=!1,g=100*(a.calcPoint-b.start)/p(),h=e[0]===H[0]?0:1;if(c=K(g,b.positions,e.length>1),f=y(e[0],c[h],1===e.length),e.length>1){if(f=y(e[1],c[h?0:1],!1)||f)for(d=0;d<b.handles.length;d++)q("slide",d)}else f&&q("slide",h)}function u(a,b){var c=G.getElementsByClassName(T[15]),d=b.handles[0]===H[0]?0:1;c.length&&k(c[0],T[15]),a.cursor&&(document.body.style.cursor="",document.body.removeEventListener("selectstart",document.body.noUiListener));var e=document.documentElement;e.noUiListeners.forEach(function(a){e.removeEventListener(a[0],a[1])}),k(I,T[12]),q("set",d),q("change",d)}function v(a,b){var c=document.documentElement;if(1===b.handles.length&&(j(b.handles[0].children[0],T[15]),b.handles[0].hasAttribute("disabled")))return!1;a.stopPropagation();var d=s(S.move,c,t,{start:a.calcPoint,handles:b.handles,positions:[J[0],J[H.length-1]]}),e=s(S.end,c,u,{handles:b.handles});if(c.noUiListeners=d.concat(e),a.cursor){document.body.style.cursor=getComputedStyle(a.target).cursor,H.length>1&&j(I,T[12]);var f=function(){return!1};document.body.noUiListener=f,document.body.addEventListener("selectstart",f,!1)}}function w(a){var b,e,g=a.calcPoint,h=0;return a.stopPropagation(),H.forEach(function(a){h+=c(a)[d.style]}),b=h/2>g||1===H.length?0:1,g-=c(G)[d.style],e=100*g/p(),d.events.snap||f(I,T[14],300),H[b].hasAttribute("disabled")?!1:(y(H[b],e),q("slide",b),q("set",b),q("change",b),void(d.events.snap&&v(a,{handles:[H[h]]})))}function x(a){var b,c;if(!a.fixed)for(b=0;b<H.length;b+=1)s(S.start,H[b].children[0],v,{handles:[H[b]]});a.tap&&s(S.start,G,w,{handles:H}),a.drag&&(c=[G.getElementsByClassName(T[7])[0]],j(c[0],T[10]),a.fixed&&c.push(H[c[0]===H[0]?1:0].children[0]),c.forEach(function(a){s(S.start,a,v,{handles:H})}))}function y(a,b,c){var e=a!==H[0]?1:0,f=J[0]+d.margin,h=J[1]-d.margin,i=J[0]+d.limit,l=J[1]-d.limit;return H.length>1&&(b=e?Math.max(b,f):Math.min(b,h)),c!==!1&&d.limit&&H.length>1&&(b=e?Math.min(b,i):Math.max(b,l)),b=M.getStep(b),b=g(parseFloat(b.toFixed(7))),b===J[e]?!1:(a.style[d.style]=b+"%",a.previousSibling||(k(a,T[17]),b>50&&j(a,T[17])),J[e]=b,Q[e]=M.fromStepping(b),q("update",e),!0)}function z(a,b){var c,e,f;for(d.limit&&(a+=1),c=0;a>c;c+=1)e=c%2,f=b[e],null!==f&&f!==!1&&("number"==typeof f&&(f=String(f)),f=d.format.from(f),(f===!1||isNaN(f)||y(H[e],M.toStepping(f),c===3-d.dir)===!1)&&q("update",e))}function A(a){var b,c,e=h(a);for(d.dir&&d.handles>1&&e.reverse(),d.animate&&-1!==J[0]&&f(I,T[14],300),b=H.length>1?3:1,1===e.length&&(b=1),z(b,e),c=0;c<H.length;c++)q("set",c)}function B(){var a,b=[];for(a=0;a<d.handles;a+=1)b[a]=d.format.to(Q[a]);return r(b)}function C(){T.forEach(function(a){a&&k(I,a)}),I.innerHTML="",delete I.noUiSlider}function D(){var a=J.map(function(a,b){var c=M.getApplicableStep(a),d=i(String(c[2])),e=Q[b],f=100===a?null:c[2],g=Number((e-c[2]).toFixed(d)),h=0===a?null:g>=c[1]?c[2]:c[0]||!1;return[h,f]});return r(a)}function E(a,b){R[a]=R[a]||[],R[a].push(b),"update"===a.split(".")[0]&&H.forEach(function(a,b){q("update",b)})}function F(a){var b=a.split(".")[0],c=a.substring(b.length);Object.keys(R).forEach(function(a){var d=a.split(".")[0],e=a.substring(d.length);b&&b!==d||c&&c!==e||delete R[a]})}var G,H,I=b,J=[-1,-1],M=d.spectrum,Q=[],R={};if(I.noUiSlider)throw new Error("Slider was already initialized.");return G=P(d.dir,d.ort,I),H=O(d.handles,d.dir,G),N(d.connect,I,H),x(d.events),d.pips&&o(d.pips),{destroy:C,steps:D,on:E,off:F,get:B,set:A}}function R(a,b){if(!a.nodeName)throw new Error("noUiSlider.create requires a single element.");var c=J(b,a),d=Q(a,c);if(d.set(c.start),a.noUiSlider=d,b.tooltips===!0||void 0===b.tooltips){for(var e=a.getElementsByClassName("noUi-handle"),f=[],g=0;g<e.length;g++)f[g]=document.createElement("div"),e[g].appendChild(f[g]),f[g].className+="range-label",f[g].innerHTML="<span></span>",f[g]=f[g].getElementsByTagName("span")[0];a.noUiSlider.on("update",function(a,b){f[b].innerHTML=a[b]})}}var S=window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"},T=["noUi-target","noUi-base","noUi-origin","noUi-handle","noUi-horizontal","noUi-vertical","noUi-background","noUi-connect","noUi-ltr","noUi-rtl","noUi-dragable","","noUi-state-drag","","noUi-state-tap","noUi-active","","noUi-stacking"];w.prototype.getMargin=function(a){return 2===this.xPct.length?n(this.xVal,a):!1},w.prototype.toStepping=function(a){return a=r(this.xVal,this.xPct,a),this.direction&&(a=100-a),a},w.prototype.fromStepping=function(a){return this.direction&&(a=100-a),e(s(this.xVal,this.xPct,a))},w.prototype.getStep=function(a){return this.direction&&(a=100-a),a=t(this.xPct,this.xSteps,this.snap,a),this.direction&&(a=100-a),a},w.prototype.getApplicableStep=function(a){var b=q(a,this.xPct),c=100===a?2:1;return[this.xNumSteps[b-2],this.xVal[b-c],this.xNumSteps[b-c]]},w.prototype.convert=function(a){return this.getStep(this.toStepping(a))};var U={to:function(a){return a.toFixed(2)},from:Number};return{create:R}});
'use strict';

App.module('Urls', function (Urls, App, Backbone, Marionette, $, _){

    // Flag with allows to show a confirmation message while leaving the page
    Urls._preventLeavingPage = false;

    /**
     * Our navigation method for checkout, which always include the shopId+cartId
     * @param {String} key The key for the url (from the `urls.json`)
     * @param {Array} replacements The values to replace params in the url.
     * @param {Array} options Options for the `Backbone.history.navigate` function.
     */
    Urls.go = function (key, replacements, options) {

        var _options = _.extend(
            {
                'trigger': true,
                //silent:false
            },
            options
        );

        Backbone.history.navigate(Urls.get(key, replacements), _options);
        //Backbone.history.loadUrl( Backbone.history.fragment);

    };

    /**
     * "Reloads" the current page, but using a Backbone reload, not a full-page
     * reload, i.e. reloads the views.
     */
    Urls.reload = function () {
        Backbone.history.loadUrl(Backbone.history.fragment);
    };

    /**
     * Sets the variable `_preventLeavingPage` with a certain value, which
     * is used in the `window.onbeforeunload` event to show a confirmation modal
     * to avoid leaving the current page.
     * @param {Boolean} isPreventing True if it should show a prompt.
     */
    Urls.setPreventLeavingPage = function (isPreventing) {
        this._preventLeavingPage = isPreventing;
    };

});

'use strict';

App.module('Vitalis.Utils', function (Utils, App, Backbone, Marionette, $, _){

    var translations = {
        enabled: "Activo",
        disabled: "Inactivo",
        paused: "Pausado",
        temperature: "Temperatura",
        blood_pressure: "Presión arterial",
        heart_rate: "Pulso",
        respiratory_rate: "Frecuencia respiratoria",
        blood_oxygen: "Oxígeno en sangre",
        ecg: "ECG",
        diastolic_pressure: "Presión diastólica",
        systolic_pressure: "Presión sistólica"
    };

    var measures = {
        temperature: "º",
        blood_pressure: "'",
        heart_rate: "bpm",
        respiratory_rate: "rpm",
        blood_oxygen: "%",
        ecg: "?",
        diastolic_pressure: "",
        systolic_pressure: "",
        height: "cm",
        weight: "kg"
    };


    Handlebars.registerHelper('tr', function(arg){
        return translations[arg] ? translations[arg] : arg;
    });

    Handlebars.registerHelper('eq', function(arg1, arg2){
        return arg1 === arg2;
    });

    Handlebars.registerHelper('or', function(arg1, arg2){
        return arg1 || arg2;
    });

    Handlebars.registerHelper('measure', function(value, measurementType){
        var unit = measures[measurementType];
        return value + " " + unit;
    });

    Handlebars.registerHelper('concat', function(args){
        //Last argument is the options object.
        //var options = arguments[arguments.length - 1];

        var joint = '';
        //Skip the last argument.
        for(var i = 0; i < arguments.length - 1; ++i) {
            joint += arguments[i];
        }

        return joint;
    });

    var basePath = $('input[type="hidden"]#x_assets_basepath').val();
    App.BASE_PATH = basePath;

    Handlebars.registerHelper('img_url', function(path){
        return basePath + '/images/'+path;
    });

    HandlebarsIntl.registerWith(Handlebars);

    Utils.toast = function(message, callback){
        Materialize.toast(message, 3500, '', callback);
    };

    (function(){
        App.Device = $('meta[name="config:device"]').attr('content');
    })();

});
App.module('Vitalis', function () {
    $.ajaxSetup({
        timeout: 30000
    });
});
this["App"] = this["App"] || {};
this["App"]["Vitalis"] = this["App"]["Vitalis"] || {};
this["App"]["Vitalis"]["templates"] = this["App"]["Vitalis"]["templates"] || {};
this["App"]["Vitalis"]["templates"]["main"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div>Main template</div>\n\n"
    + container.escapeExpression(((helper = (helper = helpers.sarasa || (depth0 != null ? depth0.sarasa : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"sarasa","hash":{},"data":data}) : helper)))
    + "\n\n<a id=\"goto-login\" >Ir a login</a>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["home"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"home-container\" class=\"app-container\">\n\n    <div id=\"mystatus\"></div>\n\n    <div id=\"following\"></div>\n\n\n  <div class=\"fixed-action-btn\" style=\"bottom: 45px; right: 24px;\">\n    <a class=\"btn-floating btn-large waves-effect waves-light\">\n      <i class=\"large material-icons\">add</i>\n    </a>\n    <ul>\n      <li>\n      <a class=\"btn-floating tooltipped blue\" data-role=\"execute-action\" data-target=\"vitalis:new_request\" data-position=\"left\" data-delay=\"50\" data-tooltip=\"Nueva solicitud\"><i class=\"material-icons\">person_add</i></a>\n      </li>\n      <li>\n      <a class=\"btn-floating tooltipped yellow darken-4\" data-role=\"execute-action\" data-target=\"vitalis:new_module\" data-position=\"left\" data-delay=\"50\" data-tooltip=\"Registrar nuevo m&oacute;dulo\"><i class=\"material-icons\">memory</i></a>\n      </li>\n      <li>\n      <a class=\"btn-floating tooltipped green\" data-position=\"left\" data-role=\"execute-action\" data-target=\"vitalis:new_alert\" data-delay=\"50\" data-tooltip=\"Nueva alerta\"><i class=\"material-icons\">notifications_active</i></a>\n      </li>\n    </ul>\n  </div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["alert_list_empty_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div class=\"center-align\">\n        <p class=\"no-margin\"><i class=\"medium material-icons\">notifications_active</i></p>\n        <p>Todav&iacute;a no registraste ninguna alerta</p>\n        <a id=\"assign\" class=\"btn waves-effect waves-light\">Registrar</a>\n    </div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["alert_list_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {}, alias3=helpers.helperMissing;

  return "<li class=\"collection-item\">\n    <span class=\"title\">"
    + alias1(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.monitoring : depth0)) != null ? stack1.patient : stack1)) != null ? stack1.name : stack1), depth0))
    + "</span>\n    <p class=\"subtitle no-margin\">\n        "
    + alias1((helpers.tr || (depth0 && depth0.tr) || alias3).call(alias2,(depth0 != null ? depth0.measurement_type : depth0),{"name":"tr","hash":{},"data":data}))
    + " ("
    + alias1(((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias3),(typeof helper === "function" ? helper.call(alias2,{"name":"from","hash":{},"data":data}) : helper)))
    + " a "
    + alias1((helpers.measure || (depth0 && depth0.measure) || alias3).call(alias2,(depth0 != null ? depth0.to : depth0),(depth0 != null ? depth0.measurement_type : depth0),{"name":"measure","hash":{},"data":data}))
    + ")\n    </p>\n\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["alerts_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n    <div id=\"myalerts\">\n    </div>\n\n    <div class=\"fixed-action-btn\" style=\"bottom: 45px; right: 24px;\">\n        <a class=\"btn-floating btn-large waves-effect waves-light\" data-role=\"new-alert\">\n            <i class=\"large material-icons\">add</i>\n        </a>\n    </div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["new_alert_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n\n    <div class=\"container\">\n        <div id=\"patients\" class=\"pad-bottom pad-top\">\n        </div>\n\n        <div id=\"sensors\" class=\"pad-bottom\">\n        </div>\n\n        <div id=\"ranges\" class=\"pad-bottom\">\n            <label>Rango de alerta</label>\n            <div id=\"range-slider\" class=\"margin-top\">\n            </div>\n        </div>\n\n    </div>\n    <a class=\"btn btn-large waves-effect waves-light full-width goto-bottom\" data-role=\"register-alert\" >\n        Registrar alerta\n    </a>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_my_follow_requests"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div style=\"text-align: center;\">\n    <p class=\"no-margin\"><i class=\"medium material-icons\">weekend</i></p>\n    <p class=\"no-upper-margin\">No tenés más solicitudes, ¡volvé pronto para chequear nuevamente!</p>\n    </div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_other_follow_requests"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div class=\"center-align\">\n    <p class=\"no-margin\"><i class=\"medium material-icons\">weekend</i></p>\n    <p class=\"no-upper-margin\">No tenés más solicitudes de los pacientes que administras, ¡volvé pronto para chequear nuevamente!</p>\n    </div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["follow_request_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<li class=\"collection-item avatar row\">\n	<div class=\"col s12 m6 l8\">\n		<img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.requested_by : depth0)) != null ? stack1.picture_url : stack1), depth0))
    + "\" alt=\"\" class=\"circle\">\n		<span class=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.requested_by : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>\n		<p>Solicitado para "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.monitoring : depth0)) != null ? stack1.patient : stack1)) != null ? stack1.name : stack1), depth0))
    + "</p>\n	</div>\n\n    <div class=\"col s0 m6 l4 text-align-right\" >\n        <a href=\"#!\" data-role='accept-request' class=\"btn\">Aceptar</a>\n	    <a href=\"#!\" data-role='reject-request' class=\"btn btn-flat btn-secondary\">Rechazar</a>\n    </div>\n</li>\n\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["new_follow_request_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n\n<h5 class=\"subheader\">Buscar usuarios</h5>\n\n<nav>\n    <div class=\"nav-wrapper\">\n      <form id=\"search-form\">\n        <div class=\"input-field\">\n          <input id=\"search\" type=\"search\" autocomplete=\"off\" class=\"inherit-font-size\" required>\n          <label for=\"search\"><i class=\"material-icons\">search</i></label>\n          <i id=\"reset-btn\" class=\"material-icons\">close</i>\n        </div>\n      </form>\n    </div>\n</nav>\n\n<div id=\"search-results\" class=\"pad-top\"></div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["request_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n    <div id=\"my-requests\"></div>\n    <div id=\"other-requests\"></div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_following"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div style=\"text-align: center;\">\n    <p class=\"no-margin\"><i class=\"medium material-icons\">face</i></p>\n    <p class=\"no-upper-margin\">¿Tenés un familiar o amigo que usa <span class=\"brand\">Vitalis</span>?</p>\n    <a  class=\"waves-effect waves-light btn\">Seguilo</a>\n    </div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_mystatus"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div style=\"text-align: center;\">\n    <p class=\"no-margin\"><i class=\"medium material-icons\">face</i></p>\n    <p class=\"no-upper-margin\">No tenés ning&uacute;n monitoreo activo</p>\n    <a  class=\"waves-effect waves-light btn\">Empez&aacute; acá</a>\n    </div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_summary"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.picture_url : stack1), depth0))
    + "\" alt=\"\" class=\"circle\">\n    <span class=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>\n    <p class=\"blue-text text-darken-4\">En l&iacute;nea</p>\n    <a href=\"#!\" class=\"secondary-content\"><i class=\"material-icons\">keyboard_arrow_right</i></a>\n</li>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["login"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"login-container app-container\">\n    <form class=\"container\">\n        <img id=\"hero-logo\" src=\"/img/logo-white-full.png\" alt=\"Vitalis\" class=\"center-image login-logo\"/>\n\n        <div class=\"input-field col\">\n            <i class=\"material-icons prefix login-input\">email</i>\n            <input id=\"email\" class=\"login-input\" name=\"email\" type=\"email\" data-error=\"#error-email\">\n            <label for=\"email\" class=\"active\" data-error=\"Verifica este campo\">Correo electrónico</label>\n            <div id=\"error-email\"></div>\n        </div>\n        <div class=\"input-field col\">\n            <i class=\"material-icons prefix login-input\">lock_outline</i>\n            <input id=\"password\" class=\"login-input\" name=\"password\" type=\"password\" data-error=\"#error-password\">\n            <label for=\"password\" class=\"active\" data-error=\"\">Contraseña</label>\n            <div id=\"error-password\"></div>\n        </div>\n        <div class=\"center-align col s6 login-btn-wrapper\">\n            <input class=\"waves-effect waves-light btn center-align full-width login-btn\" id=\"login\" type=\"button\" value=\"Ingresar\">\n            <a id=\"forgot-password-btn\"  class=\"display-block login-link\">¿Olvidaste tu contraseña?</a>\n        </div>\n        </form>\n        <div id=\"bottom-content center-align\">\n            <span class=\"login-text\" id=\"create-account\">\n                ¿No ten&eacute;s una cuenta? <a id=\"signup-now-btn\"  class=\"login-link\">Crea una</a>\n            </span>\n        </div>\n</div>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["signup"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"login-container app-container\">\n    <div class=\"container\">\n\n        <img id=\"hero-logo\" src=\"/img/logo-white-full.png\" alt=\"Vitalis\" class=\"center-image login-logo\"/>\n\n        <!--<h5 class=\"center-align\">Unite a la comunidad</h5>-->\n\n        <div class=\"input-field\">\n            <i class=\"material-icons prefix login-input\">email</i>\n            <input id=\"email\" class=\"login-input\" name=\"email\" type=\"email\" data-error=\"#error-email\">\n            <label for=\"email\" class=\"active\" data-error=\"Verifica este campo\">Correo electrónico</label>\n            <div id=\"error-email\"></div>\n        </div>\n        <div class=\"input-field\">\n            <i class=\"material-icons prefix login-input\">lock_outline</i>\n            <input id=\"password\" class=\"login-input\" name=\"password\" type=\"password\" data-error=\"#error-password\">\n            <label for=\"password\" class=\"active\" data-error=\"\">Contraseña</label>\n            <div id=\"error-password\"></div>\n        </div>\n        <div class=\"input-field\">\n            <i class=\"material-icons prefix login-input\">lock_outline</i>\n            <input id=\"password2\" class=\"login-input\" name=\"password2\" type=\"password\" data-error=\"#error-password\">\n            <label for=\"password2\" class=\"active\" data-error=\"\">Contraseña</label>\n            <div id=\"error-password\"></div>\n        </div>\n\n        <div class=\"center-align col s6\">\n            <input class=\"waves-effect waves-light btn center-align full-width signup-btn\" id=\"signup\" type=\"button\" value=\"Registrarme\">\n             <span class=\"login-text\" id=\"create-account\">\n                <a id=\"return-to-login-btn\"  class=\"display-block login-link\">Volver</a>\n            </span>\n        </div>\n    </div>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["module_list_empty_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div class=\"center-align\">\n        <p class=\"no-margin\"><i class=\"medium material-icons\">chip</i></p>\n        <p>Todav&iacute;a no registraste ning&uacute;n m&oacute;dulo</p>\n        <a id=\"assign\" class=\"btn waves-effect waves-light\">Registrar</a>\n    </div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["module_list_item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    	<p class=\"blue-text text-darken-4\">Asignado a "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.monitoring : depth0)) != null ? stack1.patient : stack1)) != null ? stack1.name : stack1), depth0))
    + "</p>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "		<p>No asignado</p>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "            <li class=\"collection-item modal-action modal-close\" data-role='goto-monitoring'>\n                <a ><i class=\"valign-bottom material-icons\">tv</i><span>Ver monitoreo</span></a>\n            </li>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "            <li class=\"collection-item modal-action modal-close\" data-role='assign-monitoring'>\n                <a ><i class=\"valign-bottom material-icons\">add_to_queue</i><span>Comenzar nuevo monitoreo</span></a>\n            </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<li class=\"collection-item avatar row\">\n	<div class=\"col s10 m6 l8\">\n		<img src=\""
    + alias3((helpers.img_url || (depth0 && depth0.img_url) || alias2).call(alias1,"logo-64x64-color.png",{"name":"img_url","hash":{},"data":data}))
    + "\" alt=\"\" class=\"measurement-icon\">\n		<p class=\"title\">M&oacute;dulo "
    + alias3(((helper = (helper = helpers.serial_number || (depth0 != null ? depth0.serial_number : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"serial_number","hash":{},"data":data}) : helper)))
    + "</p>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.monitoring : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "	</div>\n\n    <div class=\"col s2 m6 l4 right-align no-padding\" >\n    	<a href=\"#options-modal-"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"secondary-content modal-trigger\"><i class=\"material-icons\">more_vert</i></a>\n    </div>\n\n	<div id=\"options-modal-"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"modal bottom-sheet\">\n	<h5 class=\"subheader\">Opciones</h5>\n	<div>\n	  <ul class=\"collection\">\n	  	<li class=\"collection-item modal-action\" data-role='delete-module'>\n	  		<a ><i class=\"valign-bottom material-icons\">delete</i><span>Eliminar</span></a>\n	  	</li>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.monitoring : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "\n	  	<li class=\"collection-item modal-action modal-close\" data-role='more-info'>\n	  		<a ><i class=\"valign-bottom material-icons\">info</i><span>Más informaci&oacute;n</span></a>\n	  	</li>\n	  </ul>\n	</div>\n	</div>\n\n	  	<!-- Modal Structure -->\n	<div id=\"delete-module-modal\" class=\"modal\">\n	    <div class=\"modal-content\">\n	      <h4>Eliminar m&oacute;dulo</h4>\n	      <p>¿Est&aacute; seguro que quiere eliminar este m&oacute;dulo? Este paso no se puede deshacer.</p>\n	    </div>\n	    <div class=\"modal-footer\">\n	      <a href=\"#!\" id=\"confirm-delete\" data-role=\"confirm-delete\" class=\"modal-action modal-close waves-effect waves-green btn-flat\">Eliminar</a>\n	      <a href=\"#!\" class=\"modal-action modal-close waves-effect waves-green btn-flat\">Cancelar</a>\n	    </div>\n  	</div>\n\n</li>\n\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["module_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n\n<div id=\"mymodules\"></div>\n\n\n<div class=\"fixed-action-btn\" style=\"bottom: 45px; right: 24px;\">\n    <a data-role=\"new-module\" class=\"btn-floating btn-large waves-effect waves-light\">\n        <i class=\"large material-icons\">add</i>\n    </a>\n</div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["new_module_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n    <div class=\"container\">\n        <div class=\"input-field col\">\n            <!--<i class=\"material-icons prefix login-input\">email</i>-->\n            <input id=\"email\" class=\"login-input\" name=\"serial_number\" type=\"text\" data-error=\"#error-email\">\n            <label for=\"email\" class=\"active\" data-error=\"Verifica este campo\">Número de serie</label>\n        </div>\n    </div>\n\n    <div class=\"valign-bottom\">\n        <a class=\"waves-effect waves-light btn center-align full-width login-btn btn-large\" id=\"register\" >Registrar</a>\n    </div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_page"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        	<p>"
    + container.escapeExpression((helpers.measure || (depth0 && depth0.measure) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.height : stack1),"height",{"name":"measure","hash":{},"data":data}))
    + "</p>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        	<p>"
    + container.escapeExpression((helpers.measure || (depth0 && depth0.measure) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.weight : stack1),"weight",{"name":"measure","hash":{},"data":data}))
    + "</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "<div class=\"app-container\">\n<h5 class=\"subheader\">Información del paciente</h5>\n    <ul class=\"collection\">\n    <li class=\"collection-item avatar\">\n        <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.picture_url : stack1), depth0))
    + "\" alt=\"\" class=\"circle\">\n        <span class=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.height : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.weight : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        \n        <p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.blood_type : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.blood_factor : stack1), depth0))
    + "</p>\n    </li>\n</ul>\n\n<h5 class=\"subheader\">Información de monitoreo</h5>\n<div id=\"sensors\">\n</div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_search_result_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.picture_url : stack1), depth0))
    + "\" alt=\"\" class=\"circle\">\n    <span class=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>\n    <button data-role=\"follow\" class=\"btn btn-floating secondary-content\"><i class=\"material-icons\">person_add</i></button>\n</li>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_sensor_item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <!--<i class=\"material-icons circle\">folder</i>-->\n    <img src=\""
    + alias3((helpers.img_url || (depth0 && depth0.img_url) || alias2).call(alias1,(helpers.concat || (depth0 && depth0.concat) || alias2).call(alias1,"icon_",(depth0 != null ? depth0.measurement_type : depth0),".png",{"name":"concat","hash":{},"data":data}),{"name":"img_url","hash":{},"data":data}))
    + "\" alt=\""
    + alias3((helpers.tr || (depth0 && depth0.tr) || alias2).call(alias1,(depth0 != null ? depth0.measurement_type : depth0),{"name":"tr","hash":{},"data":data}))
    + "\" class=\"measurement-icon\">\n    <span class=\"title\">"
    + alias3((helpers.tr || (depth0 && depth0.tr) || alias2).call(alias1,(depth0 != null ? depth0.measurement_type : depth0),{"name":"tr","hash":{},"data":data}))
    + "</span>\n    <p>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.last_monitoring_date : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "    </p>\n    <p "
    + ((stack1 = helpers["if"].call(alias1,(helpers.eq || (depth0 && depth0.eq) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"enabled",{"name":"eq","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n        "
    + alias3((helpers.tr || (depth0 && depth0.tr) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),{"name":"tr","hash":{},"data":data}))
    + "\n    </p>\n\n    <a href=\"#!\" class=\"last-measure secondary-content\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.last_value : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + "    </a>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.last_value : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "            Última medici&oacute;n "
    + container.escapeExpression((helpers.formatRelative || (depth0 && depth0.formatRelative) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.last_monitoring_date : depth0),{"name":"formatRelative","hash":{},"data":data}))
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "            Sin mediciones\n";
},"6":function(container,depth0,helpers,partials,data) {
    return " class=\"blue-text text-darken-4\"";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return ((stack1 = helpers["if"].call(alias1,(helpers.eq || (depth0 && depth0.eq) || helpers.helperMissing).call(alias1,(depth0 != null ? depth0.measurement_type : depth0),"blood_pressure",{"name":"eq","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(11, data, 0),"data":data})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            "
    + alias4(((helper = (helper = helpers.last_value || (depth0 != null ? depth0.last_value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"last_value","hash":{},"data":data}) : helper)))
    + "/"
    + alias4(((helper = (helper = helpers.last_value_secondary || (depth0 != null ? depth0.last_value_secondary : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"last_value_secondary","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "            "
    + container.escapeExpression((helpers.measure || (depth0 && depth0.measure) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.last_value : depth0),(depth0 != null ? depth0.measurement_type : depth0),{"name":"measure","hash":{},"data":data}))
    + "\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "        - -\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "        <a href=\"#!\" class=\"secondary-content\"><i class=\"material-icons\">keyboard_arrow_right</i></a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.intl || (depth0 && depth0.intl) || helpers.helperMissing).call(depth0 != null ? depth0 : {},{"name":"intl","hash":{"locales":"es-AR"},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_sensor_measurement_chart"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<input type=\"hidden\" id=\"measurement_type\" value=\""
    + container.escapeExpression((helpers.tr || (depth0 && depth0.tr) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.measurementType : depth0),{"name":"tr","hash":{},"data":data}))
    + "\"></input>\n<canvas id=\"chart\">\n\n</canvas>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_sensor_measurement_item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<li class=\"collection-item\">\n    <div>\n        El "
    + alias3((helpers.formatDate || (depth0 && depth0.formatDate) || alias2).call(alias1,(depth0 != null ? depth0.measurement_date : depth0),{"name":"formatDate","hash":{},"data":data}))
    + " a las "
    + alias3((helpers.formatTime || (depth0 && depth0.formatTime) || alias2).call(alias1,(depth0 != null ? depth0.measurement_date : depth0),{"name":"formatTime","hash":{"minute":"numeric","hour":"numeric"},"data":data}))
    + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.eq || (depth0 && depth0.eq) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"blood_pressure",{"name":"eq","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\n        \n    </div>\n\n</li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        	<a class=\"last-measure secondary-content\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "/"
    + alias4(((helper = (helper = helpers.value_secondary || (depth0 != null ? depth0.value_secondary : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value_secondary","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "        	<a class=\"secondary-content\">"
    + container.escapeExpression((helpers.measure || (depth0 && depth0.measure) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.value : depth0),(depth0 != null ? depth0.type : depth0),{"name":"measure","hash":{},"data":data}))
    + "</a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.intl || (depth0 && depth0.intl) || helpers.helperMissing).call(depth0 != null ? depth0 : {},{"name":"intl","hash":{"locales":"es-AR"},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_sensor_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n    <div id=\"chart\"></div>\n    <h5 class=\"subheader\">Últimas mediciones</h5>\n    <div id=\"values\"></div>\n    <div id=\"alerts\"></div>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_sensor_selection_item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "checked";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias3((helpers.img_url || (depth0 && depth0.img_url) || alias2).call(alias1,(helpers.concat || (depth0 && depth0.concat) || alias2).call(alias1,"icon_",(depth0 != null ? depth0.type : depth0),".png",{"name":"concat","hash":{},"data":data}),{"name":"img_url","hash":{},"data":data}))
    + "\" alt=\""
    + alias3((helpers.tr || (depth0 && depth0.tr) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),{"name":"tr","hash":{},"data":data}))
    + "\" class=\"measurement-icon\">\n    <span class=\"title\">"
    + alias3((helpers.tr || (depth0 && depth0.tr) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),{"name":"tr","hash":{},"data":data}))
    + "</span>\n\n    <div class=\"switch secondary-content\">\n        <label>\n            <input data-role=\"toggle-selection\" type=\"checkbox\" "
    + ((stack1 = helpers["if"].call(alias1,(helpers.eq || (depth0 && depth0.eq) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"enabled",{"name":"eq","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n            <span class=\"lever\"></span>\n        </label>\n    </div>\n</li>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["new_monitoring_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n\n    <div id=\"patient\"></div>\n\n    <div id=\"followers\"></div>\n\n    <div id=\"sensors\"></div>\n\n    <a data-role=\"init-monitoring\" class=\"waves-effect waves-light btn-large full-width\">\n        Iniciar monitoreo\n    </a>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["patients"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"home-container\" class=\"app-container\">\n    PACIENTES VIEJA\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["user_search_result_item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "        <button data-role=\"delete\" class=\"btn btn-floating btn-minimal btn-flat secondary-content\"><i class=\"material-icons\">close</i></button>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "        <button data-role=\"add\" class=\"btn btn-floating secondary-content\"><i class=\"material-icons\">person_add</i></button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias4(((helper = (helper = helpers.picture_url || (depth0 != null ? depth0.picture_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picture_url","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" class=\"circle\">\n    <span class=\"title\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.eq || (depth0 && depth0.eq) || alias2).call(alias1,(depth0 != null ? depth0.role : depth0),"delete",{"name":"eq","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["user_search_result_item_with_delete"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "checked";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias4(((helper = (helper = helpers.picture_url || (depth0 != null ? depth0.picture_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picture_url","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" class=\"circle\">\n    <span class=\"title\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n    <div class=\"switch\">\n        <label>\n            Administrador\n            <input data-role=\"admin\" type=\"checkbox\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.is_admin : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n            <span class=\"lever\"></span>\n        </label>\n    </div>\n    <button data-role=\"delete\" class=\"btn btn-floating btn-minimal btn-flat secondary-content\"><i class=\"material-icons\">close</i></button>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["mydata"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n    <form id=\"mydataForm\" class=\"container\">\n        <div class=\"input-field\">\n            <i class=\"material-icons prefix\">account_circle</i>\n            <input id=\"name\" class=\"input\" name=\"name\" type=\"text\" data-error=\"#error-name\">\n            <label for=\"name\" class=\"active\" data-error=\"Verifica este campo\">Nombre y apellido</label>\n            <div id=\"error-name\"></div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s4\">\n                <select id=\"document_type\" name=\"document_type\">\n                    <option value=\"\" disabled selected>Tipo de documento</option>\n                    <option value=\"dni\">DNI</option>\n                    <option value=\"ci\">CI</option>\n                    <option value=\"le\">LE</option>\n                    <option value=\"lc\">LC</option>\n                </select>\n            </div>\n            <div class=\"input-field col s8\">\n                <input id=\"doc_number\" name=\"doc_number\" type=\"text\" data-error=\"#error-doc_number\">\n                <label for=\"doc_number\" class=\"active\" data-error=\"Verifica este campo\">Numero de documento</label>\n                <div id=\"error-doc_number\"></div>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6\">\n                <select id=\"blood_factor\" name=\"blood_factor\">\n                    <option value=\"\" disabled selected>Factor</option>\n                    <option value=\"RH+\">RH+</option>\n                    <option value=\"RH-\">RH-</option>\n                </select>\n            </div>\n            <div class=\"input-field col s6\">\n                <select id=\"blood_type\" name=\"blood_type\">\n                    <option disabled selected>Tipo de sangre</option>\n                    <option value=\"a\">A</option>\n                    <option value=\"b\">B</option>\n                    <option value=\"ab\">AB</option>\n                    <option value=\"0\">Zero</option>\n                </select>\n            </div>\n        </div>\n        <div class=\"center-align col s6 login-btn-wrapper\">\n            <input class=\"waves-effect waves-light btn center-align full-width form-btn\" id=\"save\" type=\"submit\" value=\"Guardar\">\n        </div>\n    </form>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["collection_wrapper"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<ul class=\"collection\">\n\n</ul>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["collection_wrapper_with_title"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<h5 class=\"subheader\">"
    + container.escapeExpression(((helper = (helper = helpers.collection_title || (depth0 != null ? depth0.collection_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"collection_title","hash":{},"data":data}) : helper)))
    + "</h5>\n<ul class=\"collection\">\n\n</ul>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["collection_wrapper_with_title_and_action"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=container.lambda;

  return "<div class=\"row\">\n<div class=\"col s10 m10 l10\">\n	<h5 class=\"subheader\">"
    + alias1(((helper = (helper = helpers.collection_title || (depth0 != null ? depth0.collection_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"collection_title","hash":{},"data":data}) : helper)))
    + "</h5>\n</div>\n<div class=\"col s2 m2 l2 right-align\">\n	<a  data-role=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.action : depth0)) != null ? stack1.role : stack1), depth0))
    + "\"><i class=\"material-icons\">"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.action : depth0)) != null ? stack1.icon : stack1), depth0))
    + "</i></a>\n</div>\n</div>\n<ul class=\"collection\">\n\n</ul>\n<div id=\"action-container\"></div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["content"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "||CONTENTO||";
},"useData":true});
this["App"]["Vitalis"]["templates"]["footer"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "||FUTER||";
},"useData":true});
this["App"]["Vitalis"]["templates"]["header"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<ul id=\"nav-mobile\" class=\"side-nav top-of-the-rock\">\n    <li>\n        <div class=\"userView row\">\n\n            <div class=\"col s9 m9 l9\">\n                <img class=\"background\" src=\"/img/navbar-background.png\">\n                <a href=\"#!user\"><img class=\"circle\" src=\""
    + alias4(((helper = (helper = helpers.picture_url || (depth0 != null ? depth0.picture_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picture_url","hash":{},"data":data}) : helper)))
    + "\"></a>\n                <a href=\"#!name\"><span class=\"white-text name\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span></a>\n                <a href=\"#!email\"><span class=\"white-text email\">"
    + alias4(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"email","hash":{},"data":data}) : helper)))
    + "</span></a>\n            </div>\n            <div class=\"col s3 m3 l3\" id=\"logout-div\">\n                <a href=\"#!email\" data-role=\"navbar-link\" data-link=\"vitalis:logout\"><i class=\"white-text material-icons\">exit_to_app</i></a>\n            </div>\n\n\n    </div></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:home\"><i class=\"material-icons\">home</i>Página principal</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:mydata\"><i class=\"material-icons\">assignment</i>Mis datos</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:requests\"><i class=\"material-icons\">person_add</i>Solicitudes</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:alerts\"><i class=\"material-icons\">notifications_active</i>Alertas</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:patients\"><i class=\"material-icons\">group</i>Usuarios monitoreados</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:modules\"><i class=\"material-icons\">memory</i>Módulos</a></li>\n    <li><div class=\"divider\"></div></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:medics\"><i class=\"material-icons\">perm_identity</i>Médicos</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:settings\"><i class=\"material-icons\">settings</i>Configuración</a></li>\n    <li><div class=\"divider\"></div></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:logout\"><i class=\"material-icons\">exit_to_app</i>Salir</a></li>\n\n</ul>\n\n<div id=\"header-container\">\n\n<div id=\"preloader-header\" class=\"progress no-margin hidden\">\n    <div class=\"indeterminate\"></div>\n</div>\n\n<nav>\n    <div class=\"nav-wrapper\">\n\n        <a id=\"menu-btn\"  data-activates=\"nav-mobile\" class=\"button-collapse pad-left\"><i class=\"material-icons\">menu</i></a>\n\n        <a  class=\"brand-logo\">Vitalis</a>\n        <ul class=\"right\">\n            <li>\n                <a  data-activates=\"nav-mobile\" >\n                    <i class=\"material-icons\">notifications</i>\n                </a>\n            </li>\n        </ul>\n    </div>\n</nav>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["header"] = this["App"]["Vitalis"]["templates"]["header"] || {};
this["App"]["Vitalis"]["templates"]["header"]["inner"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <a class=\"brand-logo\">"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <a class=\"nav-title\">"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "            <ul class=\"right\">\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                <li>\n                    <a  data-role=\"secondary-action\">\n                        <i class=\"material-icons\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.secondary_action : depth0)) != null ? stack1.icon : stack1), depth0))
    + "</i>\n                    </a>\n                </li>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.menu : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                <li>\n                    <a  data-activates='menu-dropdown' class=\"dropdown-button\" data-constrainwidth=\"false\" data-beloworigin=\"true\">\n                        <i class=\"material-icons\">more_vert</i>\n                    </a>\n\n                    <ul id='menu-dropdown' class='dropdown-content'>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.menu : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    </ul>\n\n                </li>\n\n                ";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                            <li data-role=\"menu-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><a href=\"#!\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "            </ul>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "<div id=\"header-container\">\n\n    <div id=\"preloader-header\" class=\"progress no-margin hidden\">\n        <div class=\"indeterminate\"></div>\n    </div>\n\n    <nav>\n        <div class=\"nav-wrapper\">\n\n            <a id=\"back-btn\"  data-role='back-btn' data-activates=\"nav-mobile\" class=\"button-collapse pad-left\"><i class=\"material-icons\">keyboard_arrow_left</i></a>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.useBrandAsTitle : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.or || (depth0 && depth0.or) || alias2).call(alias1,(depth0 != null ? depth0.secondary_action : depth0),(depth0 != null ? depth0.menu : depth0),{"name":"or","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.secondary_action : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(helpers.or || (depth0 && depth0.or) || alias2).call(alias1,(depth0 != null ? depth0.secondary_action : depth0),(depth0 != null ? depth0.menu : depth0),{"name":"or","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n\n\n\n        </div>\n    </nav>\n</div>\n\n<div id=\"actionable-container\"></div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["loginheader"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"preloader-header\" class=\"progress no-margin hidden\">\n    <div class=\"indeterminate\"></div>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["navbar"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});
this["App"]["Vitalis"]["templates"]["select_option_img_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});
this["App"]["Vitalis"]["templates"]["select_wrapper_with_title"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <option value=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-icon=\""
    + alias4(((helper = (helper = helpers.picture_url || (depth0 != null ? depth0.picture_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picture_url","hash":{},"data":data}) : helper)))
    + "\" class=\"circle left\">\n                "
    + alias4((helpers.tr || (depth0 && depth0.tr) || alias2).call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"tr","hash":{},"data":data}))
    + "\n            </option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<!--<h5 class=\"subheader\">"
    + alias4(((helper = (helper = helpers.collection_title || (depth0 != null ? depth0.collection_title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"collection_title","hash":{},"data":data}) : helper)))
    + "</h5>-->\n<div class=\"input-field col s12\">\n    <select id=\""
    + alias4(((helper = (helper = helpers.select_id || (depth0 != null ? depth0.select_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"select_id","hash":{},"data":data}) : helper)))
    + "\" class=\"collection-select\">\n        <option value=\"\" disabled selected>"
    + alias4(((helper = (helper = helpers.default_option || (depth0 != null ? depth0.default_option : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"default_option","hash":{},"data":data}) : helper)))
    + "</option>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </select>\n    <label>"
    + alias4(((helper = (helper = helpers.collection_title || (depth0 != null ? depth0.collection_title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"collection_title","hash":{},"data":data}) : helper)))
    + "</label>\n</div>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_follower_assignment_result_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div class=\"center-align\">\n        <p>Todavía no asignaste a ningún seguidor</p>\n        <a id=\"assign\" class=\"btn waves-effect waves-light\">Asignar</a>\n    </div>\n    <div id=\"search-users-container\"></div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_patient_assignment_result_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n	<div class=\"center-align\">\n		<p>Todavía no asignaste a ningún paciente</p>\n		<a id=\"assign\" class=\"btn waves-effect waves-light\">Asignar</a>\n	</div>\n	<div id=\"search-users-container\"></div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["patient_assignment_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias4(((helper = (helper = helpers.picture_url || (depth0 != null ? depth0.picture_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picture_url","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" class=\"circle\">\n    <span class=\"title\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n</li>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["user_search_modal_single_selection_wrapper"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"search-users\" class=\"modal full-width no-margin\">\n	<div class=\"modal-content\">\n		<h4>Buscar usuarios</h4>\n		<nav>\n		    <div class=\"nav-wrapper\">\n		      <form id=\"search-form\">\n		        <div class=\"input-field\">\n		          <input id=\"search\" type=\"search\" autocomplete=\"off\" class=\"inherit-font-size\" required>\n		          <label for=\"search\"><i class=\"material-icons\">search</i></label>\n		          <i id=\"reset-btn\" class=\"material-icons\">close</i>\n		        </div>\n		      </form>\n		    </div>\n		</nav>\n\n		<div id=\"search-results\" class=\"pad-top\"></div>\n\n		</div>\n	</div>\n</div>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["user_search_result_wrapper"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"input-field\">\n	<select class=\"icons\"></select>\n</div>";
},"useData":true});
App.Urls.set(({
  "es": {
    "vitalis:index": "",
    "vitalis:login": "login",
    "vitalis:signup": "signup",
    "vitalis:home": "app",
    "vitalis:patients": "app/patients",
    "vitalis:monitoring": "app/monitoring/:id",
    "vitalis:requests": "app/requests",
    "vitalis:new_request": "app/requests/new",
    "vitalis:mydata": "app/mydata",
    "vitalis:modules": "app/modules",
    "vitalis:new_monitoring": "app/modules/:moduleId/new_monitoring",
    "vitalis:measurements": "app/monitoring/:monitoringId/sensors/:measurementType",
    "vitalis:new_module": "app/modules/new",
    "vitalis:alerts": "app/alerts",
    "vitalis:new_alert": "app/alerts/new"
  }
})[App.Config.lang]);
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    var Urls    = App.module('Urls');

    (function(){
        var content = $('meta[name="config:device"]').attr('content');

        Models.API_ROOT_URL = content == "cordova" ? "http://83f066d2.ngrok.io" : "";

    })();

    function fetch(args, options){

        $('#preloader-header').removeClass('hidden');

        args = args || {};

        var onError = args.error || function(model, response, options){};
        var onSuccess = args.success || function(model, response, options){};

        args.beforeSend = function(xhr){
            this.url = Models.API_ROOT_URL + this.url;
            xhr.setRequestHeader('X-Auth-Token', localStorage.getItem('accesstoken'));
        };

        args.error = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            if(response.status === 401){
                $('.modal').closeModal();
                Urls.go('vitalis:login');
            } else {
                onError(model, response, options);
            }
        };

        args.success = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            onSuccess(model, response, options);
        };

        return Backbone.Model.prototype.fetch.call(this, args, options);
    }

    function destroy(args, options){

        $('#preloader-header').removeClass('hidden');

        args = args || {};

        var onError = args.error || function(model, response, options){};
        var onSuccess = args.success || function(model, response, options){};

        args.beforeSend = function(xhr){
            this.url = Models.API_ROOT_URL + this.url;
            xhr.setRequestHeader('X-Auth-Token', localStorage.getItem('accesstoken'));
        };

        args.error = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            if(response.status === 401){
                $('.modal').closeModal();
                Urls.go('vitalis:login')
            } else {
                onError(model, response, options);
            }
        };

        args.success = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            onSuccess(model, response, options);
        };

        return Backbone.Model.prototype.destroy.call(this, args, options);
    }

    function save(args, options){
        $('#preloader-header').removeClass('hidden');

        args = args || {};
        options = options || {};

        var onError = options.error || function(model, response, options){};
        var onSuccess = options.success || function(model, response, options){};

        options.beforeSend = function(xhr){
            this.url = Models.API_ROOT_URL + this.url;
            xhr.setRequestHeader('X-Auth-Token', localStorage.getItem('accesstoken'));
        };

        options.error = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            if(response.status === 401){
                $('.modal').closeModal();
                Urls.go('vitalis:login')
            } else {
                onError(model, response, options);
            }
        };

        options.success = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            onSuccess(model, response, options);
        };


        return Backbone.Model.prototype.save.call(this, args, options);
    }


    Models.AbstractModel = Backbone.Model.extend({
        fetch: fetch,
        save: save,
        destroy: destroy
    });

    Models.AbstractCollection = Backbone.Collection.extend({
        fetch: fetch,
        save: save,
        destroy: destroy
    });

    //var sync = Backbone.sync;
    //Backbone.sync = function(method, model, options){
    //    options.beforeSend = function(){
    //        this.url = API_ROOT_URL + this.url;
    //    };
    //    return sync.call(this, method, model, options);
    //};


});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Alert = Models.AbstractModel.extend({
        urlRoot: '/api/app/alerts/'
    });

    Models.AlertList = Models.AbstractCollection.extend({
        model: Models.Alert,
        url: '/api/app/alerts/'
    });

});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.DeviceToken = Models.AbstractModel.extend({
        urlRoot: '/api/app/devicetokens/'
    });


});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.FollowRequest = Models.AbstractModel.extend({});

    Models.MyFollowRequestsList = Models.AbstractCollection.extend({
        model: Models.FollowRequest,
        url: '/api/app/request/myPendingRequests'
    });

    Models.OtherFollowRequestsList = Models.AbstractCollection.extend({
        model: Models.FollowRequest,
        url: '/api/app/request/otherPendingRequests'
    });

    Models.NewFollowRequest = Models.FollowRequest.extend({
        url: "/api/app/request/"
    });
});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.MonitoringFollower = Models.AbstractModel.extend({
        idAttribute: 'monitoring_id',
        url: function(){
            var monitoringId = this.get('monitoring_id');
            return '/api/app/monitorings/' + monitoringId + "/follower";
        }
    });

});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Followee = Backbone.Model.extend({
        defaults: {
            'email': null,
            'name': 'Local',
            'picture_url': 'https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-9/13321745_10154178340059144_6375953951169924641_n.jpg?oh=d947fda977c1f25690f6ebe18721c2c7&oe=58616839&__gda__=1483568380_2f73224ebfe735922bd2bb150593bcf5'
        }
    })

    Models.Following = Models.AbstractCollection.extend({
        model: Models.Followee,
        url: '/api/app/home/following'
    });
});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Home = Backbone.Model.extend({
        url: '/api/home'
    });
});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Login = Backbone.Model.extend({
        defaults: {
            'email': null,
            'password': null
        },
        url: '/api/access/login'
    });
});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Measurement = Backbone.Model.extend({
    });

    Models.MeasurementList = Models.AbstractCollection.extend({
        model: Models.Measurement,

        url: function(){
            var monitoringId = this.models[0].get('monitoringId');
            var measurementType = this.models[0].get('measurementType');

            return '/api/app/monitorings/'+ monitoringId + '/sensors/' + measurementType;
        }
    });
});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Module = Models.AbstractModel.extend({
        url: '/api/app/modules/'
    });

    Models.ModulesList = Models.AbstractCollection.extend({
        model: Models.Module,
        url: '/api/app/modules/'
    });

});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Monitoring = Models.AbstractModel.extend({
        urlRoot: '/api/app/monitorings'
    });

    Models.MonitoringsList = Models.AbstractCollection.extend({
        model: Models.Monitoring,
        url: '/api/app/monitorings/'
    });

    Models.ModuleMonitoring = Models.AbstractModel.extend({
        url: function(){
            var moduleId = this.get('module_id');
            return '/api/app/modules/'+ moduleId + '/monitorings';
        }
    });

});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.MyStatusItem = Backbone.Model.extend({

    });

    Models.MyStatus = Models.AbstractCollection.extend({
        url: '/api/app/home/mystatus'
    });
});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.PatientStatus = Models.AbstractModel.extend({
        defaults: {
            'email': null,
            'name': 'Local',
            'picture_url': 'https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-9/13321745_10154178340059144_6375953951169924641_n.jpg?oh=d947fda977c1f25690f6ebe18721c2c7&oe=58616839&__gda__=1483568380_2f73224ebfe735922bd2bb150593bcf5'
        },
        urlRoot: '/api/app/monitorings/'
    });

    Models.MonitoringsSearchList = Models.AbstractCollection.extend({
    	url: "/api/app/monitorings/search"
    });
});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Sensor = Backbone.Model.extend({
        defaults: {
            status: "disabled"
        }
    });

    Models.Sensors = Models.AbstractCollection.extend({
        model: Models.Sensor,
        url: '/api/app/home/monitorings/'
    });

    Models.AvailableSensors = Models.AbstractCollection.extend({
        model: Models.Sensor,
        url: '/api/app/sensors/'
    });
});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Signup = Backbone.Model.extend({
        defaults: {
            'email': null,
            'password': null
        },
        url: '/api/access/signup'
    });
});
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.User = Models.AbstractModel.extend({
        defaults: {
            'email': 'invalid@email.com',
            'name': 'Local',
            'picture_url': 'https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-9/13321745_10154178340059144_6375953951169924641_n.jpg?oh=d947fda977c1f25690f6ebe18721c2c7&oe=58616839&__gda__=1483568380_2f73224ebfe735922bd2bb150593bcf5'
        },
        url: '/api/app/users/profile'
    });


    Models.UserSearchList =  Models.AbstractCollection.extend({
    	url: "/api/app/users/search",
    	model: Models.User
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    Views.AbstractListView = Marionette.CompositeView.extend({
        template: App.Vitalis.templates.collection_wrapper_with_title,
        childViewContainer: "ul.collection",

        templateHelpers: function() {
            return {
                collection_title: this.getOption('title')
            }
        }
    });

    Views.GenericSelectView = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.select_wrapper_with_title,
        //childViewContainer: "select.collection-select",

        ui: {
           select: 'select.collection-select'
        },

        events: {
            'change @ui.select': 'onSelectOptionChange'
        },

        templateHelpers: function() {

            return {
                collection_title: this.getOption('title'),
                select_id: this.getOption('select_id'),
                default_option: this.getOption('default_option'),
                items: this.getOption('items')
            }
        },

        onShow: function(){
            $('select').material_select();
        },

        onSelectOptionChange: function (e) {
            var option = e.target.value;
            this.trigger('option:changed', option);
        }

    });

    Views.AbstractActionableListView = Views.AbstractListView.extend({
        template: App.Vitalis.templates.collection_wrapper_with_title_and_action,

        templateHelpers: function(){
            return {
                collection_title: this.getOption('title'),
                action: this.getOption('action')
            }
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.AlertListEmptyItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.alert_list_empty_item,
        ui: {
            'emptyCard': 'li.collection-item > div > a'
        },

        events:{
            'click @ui.emptyCard': 'newAlert'
        },

        newAlert: function(){
            Urls.go('vitalis:new_alert');
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.AlertListItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.alert_list_item,
        ui: {
            monitoringCard: 'li.collection-item',
            assignMonitoringButton: "li[data-role='assign-monitoring']",
            gotoMonitoringButton: "li[data-role='goto-monitoring']",
            deleteModuleButton: "li[data-role='delete-module']",
            moreInfoButton: "li[data-role='more-info']",
            confirmDeleteButton: "a[data-role='confirm-delete']"
        },

        events:{
            'click @ui.assignMonitoringButton': 'assignMonitoring',
            'click @ui.deleteModuleButton': 'deleteModule',
            'click @ui.moreInfoButton': 'goToModule',
            'click @ui.confirmDeleteButton': 'confirmDelete',
            'click @ui.gotoMonitoringButton': 'gotoMonitoring'
        },

        onShow: function(){
            $(document).ready(function(){
                // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
                $('.modal-trigger').leanModal();
            });
        },

        assignMonitoring: function(){
            var moduleId = this.model.get('id');
            Urls.go('vitalis:new_monitoring', [moduleId]);
        },

        deleteModule: function(){
            $('#delete-module-modal').openModal();
        },

        confirmDelete: function(){
            var serialNumber = this.model.get("serial_number");
            $('.modal').closeModal();
            this.model.destroy({success: function(){
                var message = "Eliminaste el módulo " + serialNumber;
                Utils.toast(message);
            }});
        },

        gotoMonitoring: function(){
            var monitoringId = this.model.get('monitoring').id;
            Urls.go('vitalis:monitoring', [monitoringId]);
        },

        goToModule: function(){

        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.AlertListView = Views.AbstractListView.extend({

        childView: App.Vitalis.Views.AlertListItemView,
        emptyView: App.Vitalis.Views.AlertListEmptyItem,

        initialize: function(){
            this.collection.fetch();
        },

        childEvents: {
            // This callback will be called whenever a child is rendered or emits a `render` event
            destroy: function(child) {
                this.collection.remove(child.model);
                //this.render();
            }
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');


    Views.NewAlertPage = Marionette.LayoutView.extend({

        template: App.Vitalis.templates.new_alert_page,

        ui: {
            registerButton: 'a[data-role="register-alert"]'
        },

        events: {
            'click @ui.registerButton': 'registerAlert'
        },

        regions: {
            patients: 'div#patients',
            sensors: 'div#sensors',
            ranges: 'div#ranges'
        },

        initialize: function(){

            $(document).ready(function() {
                $('select').material_select();
            });
        },

        onShow: function(){

            var self        = this;
            var following   = new Vitalis.Models.Following();
            var sensors     = new Vitalis.Models.AvailableSensors();

            following.fetch({
                success: function(collection, response, options) {

                    var flattenedMonitorings = collection.models.map(function(model) {
                        return {
                            id: model.get('id'),
                            picture_url: model.get('patient').picture_url,
                            name: model.get('patient').name
                        }
                    });

                    var followingSelectView = new Views.GenericSelectView({
                        title: 'Paciente',
                        select_id: 'patients',
                        default_option: 'Selecciona un paciente',
                        items: flattenedMonitorings
                    });

                    followingSelectView.on('option:changed', function(monitoringId){
                        self.model.set('monitoring_id', monitoringId);
                    });

                    self.getRegion('patients').show(followingSelectView);
                }
            });

            sensors.fetch({
                success: function(collection, response, options) {

                    var flattenedMonitorings = collection.models.map(function(model) {
                        return {
                            id: model.get('type'),
                            picture_url: null,
                            name: model.get('type')
                        }
                    });

                    var followingSelectView = new Views.GenericSelectView({
                        title: 'Sensor',
                        select_id: 'patients',
                        default_option: 'Selecciona un sensor',
                        items: flattenedMonitorings
                    });

                    followingSelectView.on('option:changed', function(measurementType){
                        self.model.set('measurement_type', measurementType);
                    });
                    self.getRegion('sensors').show(followingSelectView);
                }
            });

            var slider = $('#range-slider')[0];
            noUiSlider.create(slider, {
                start: [20, 80],
                connect: true,
                step: 1,
                behaviour: 'drag',
                range: {
                    'min': 0,
                    'max': 100
                },
                format: wNumb({
                    decimals: 0
                })
            });

            slider.noUiSlider.on('change', function(){
                var values = slider.noUiSlider.get();
                self.model.set("from", values[0]);
                self.model.set("to", values[1]);
            });
        },

        registerAlert: function(event){
            this.model.save({}, {
                success: function(model, response, options){
                    Utils.toast('Alerta registrada');
                    Urls.go('vitalis:alerts');
                }
            })
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.AlertsPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.alerts_page,

        ui: {
            addAlertButton: 'a[data-role="new-alert"]'
        },

        events: {
            'click @ui.addAlertButton': 'addAlert'
        },

        regions: {
            myalerts: '#myalerts'
        },

        onShow: function(){
            var emptyView       = Views.AlertListEmptyItem;
            var alertsList     = new Vitalis.Models.AlertList();
            var alertsListView = new Views.AlertListView({
                collection: alertsList,
                title: "Alertas actuales",
                emptyView: emptyView
            });

            this.getRegion('myalerts').show(alertsListView);
        },

        addAlert: function(event){
            Urls.go('vitalis:new_alert');
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MyFollowRequestsEmptyItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.empty_my_follow_requests,
        ui: {
            'emptyCard': 'li.collection-item > div > a'
        },

        events:{
            'click @ui.emptyCard': 'sendRequest'
        },

        registerModule: function(){
            Urls.go('vitalis:requests');
        }
    });

    Views.OtherFollowRequestsEmptyItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.empty_other_follow_requests,
        ui: {
            'emptyCard': 'li.collection-item > div > a'
        },

        events:{
            'click @ui.emptyCard': 'sendRequest'
        },

        registerModule: function(){
            Urls.go('vitalis:requests');
        }
    });

});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.FollowRequestItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.follow_request_item,
        ui: {
            'monitoringCard': 'li.collection-item',
            'acceptButton': "[data-role='accept-request']",
            'rejectButton': "[data-role='reject-request']"
        },

        events:{
            'click @ui.monitoringCard': 'goToMonitoring',
            'click @ui.acceptButton': 'acceptFollowRequest',
            'click @ui.rejectButton': 'rejectFollowRequest'

        },

        onShow: function(){
            $(document).ready(function(){
                // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
                $('.modal-trigger').leanModal();
            });
        },

        acceptFollowRequest: function(){
            var self = this;

            this.model.save({status:'accepted'}, {
                            success: function(){
                                self.destroy();

                                var requesterName = self.model.get("requested_by").name;
                                var message = "Aceptaste la solicitud de " + requesterName;
                                Utils.toast(message);
                            }
            });
        },

        rejectFollowRequest: function(){
            var self = this;

            this.model.save({status: 'rejected'}, {success: function(){

                self.destroy();

                var requesterName = self.model.get("requested_by").name;
                var message = "Rechazaste la solicitud de " + requesterName;
                Utils.toast(message);

            }});
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.FollowRequestsList = Marionette.CompositeView.extend({

        template: App.Vitalis.templates.collection_wrapper_with_title,
        childViewContainer: "ul.collection",
        childView: App.Vitalis.Views.FollowRequestItem,

        templateHelpers: function() {
            return {
                collection_title: this.getOption('title')
            }
        },

        initialize: function(){
            this.collection.fetch();
        },

        childEvents: {
            // This callback will be called whenever a child is rendered or emits a `render` event
            destroy: function(child) {
                this.collection.remove(child.model);
            }
        }
  
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.NewFollowRequestPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.new_follow_request_page,

        ui: {
            searchField: 'input#search',
            resetButton: 'i#reset-btn',
            searchForm: 'form#search-form'
        },

        events: {
            'keyup @ui.searchField': 'search',
            'click @ui.resetButton': 'resetSearch',
            'submit @ui.searchForm': 'onSubmit'
        },

        regions: {
            searchResults: 'div#search-results'
        },

        onShow: function(){
            var monitoringsList = new Vitalis.Models.MonitoringsSearchList();
            var searchResultsView = new App.Vitalis.Views.FollowRequestUserSearchResultListView({collection: monitoringsList,
                                                                                            title: "Resultados de búsqueda"});

            this.collection = monitoringsList;
            this.getRegion('searchResults').show(searchResultsView);
        },

        search: function(e){
            var searchQuery = e.target.value;
            var self = this;
            if(searchQuery.length > 3){
                this.collection.fetch({data: $.param({query: searchQuery})});
            } else {
                this.collection.reset();
            }
        },

        resetSearch: function(){
            $(this.ui.searchField).val('');
            this.collection.reset();
        },

        onSubmit: function(e){
            e.preventDefault();
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.FollowRequestPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.request_page,

        regions: {
            myRequests: 'div#my-requests',
            otherRequests: 'div#other-requests'
        },

        onShow: function(){
            var myRequestsCollection = new Vitalis.Models.MyFollowRequestsList();
            var otherRequestsCollection = new Vitalis.Models.OtherFollowRequestsList();

            var myRequestsEmptyView = App.Vitalis.Views.MyFollowRequestsEmptyItem;
            var otherRequestsEmptyView = App.Vitalis.Views.OtherFollowRequestsEmptyItem;

            var myRequestsView = new App.Vitalis.Views.FollowRequestsList({collection: myRequestsCollection, emptyView: myRequestsEmptyView, title: "Mis solicitudes"});
            var otherRequestsView = new App.Vitalis.Views.FollowRequestsList({collection: otherRequestsCollection, emptyView: otherRequestsEmptyView, title: "Otras solicitudes"});

            this.getRegion('myRequests').show(myRequestsView);
            this.getRegion('otherRequests').show(otherRequestsView);
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Footer = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.footer
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.InnerHeader = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.header.inner,

        ui: {
            backButton: 'a[data-role="back-btn"]',
            secondaryActionButton: 'a[data-role="secondary-action"]',
            menuOption: 'li[data-role^="menu-"]'
        },

        regions: {
            actionableContainer: 'div#actionable-container'
        },

        events:{
            'click @ui.backButton': 'goBack',
            'click @ui.secondaryActionButton': 'executeSecondaryAction',
            'click @ui.menuOption' : 'executeMenuAction'
        },

        templateHelpers: function(){
            var useBrandAsTitle = this.getOption('title') === undefined
            var title = useBrandAsTitle ? "Vitalis" : this.getOption('title');
            return {
                useBrandAsTitle: useBrandAsTitle,
                title: title,
                secondary_action: this.getOption('secondary_action'),
                menu: this.getOption('menu')
            }
        },

        onShow: function(){
            $('.dropdown-button').dropdown({
                    inDuration: 300,
                    outDuration: 225,
                    constrain_width: true, // Does not change width of dropdown to that of the activator
                    hover: true, // Activate on hover
                    gutter: 0, // Spacing from edge
                    belowOrigin: true, // Displays dropdown below the button
                    alignment: 'left' // Displays dropdown with edge aligned to the left of button
                }
            );
        },

        goBack: function(a){
            if(window.history.state == null){
                Urls.go('vitalis:home');
            } else {
                window.history.back();
            }
        },

        executeSecondaryAction: function(event){
            var secondaryActionOption = this.getOption('secondary_action');
            secondaryActionOption.action(event);
        },

        executeMenuAction: function(event){
            var trigger = event.target;
            var menuOptions = this.getOption('menu');
            for(var index in menuOptions.options){
                var option = menuOptions.options[index];
                if(option.id == [trigger.id]){
                    var actionableContainer = this.getRegion('actionableContainer');
                    option.action(event, actionableContainer);
                    break;
                }
            }
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    Views.LoginHeader = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.loginheader,
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Header = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.header,

        initialize: function(){
            var self = this;
            this.model.fetch({success: function(){
                self.render();
                self.onShow();
            }});
        },

        ui: {
             'navbarLinks': 'a[data-role="navbar-link"]'
        },

        events:{
            'click @ui.navbarLinks': 'goToLink'
        },

        onShow: function(){
            $(".button-collapse").sideNav({
                closeOnClick: true
            });
        },

        goToLink: function(a){
            Urls.go(a.target.attributes["data-link"].value);
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Home = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.home,

        ui: {
            actionButtons: 'a[data-role="execute-action"]'
        },

        events: {
            'click @ui.actionButtons': 'executeAction'
        },

        regions: {
            myStatus: "#mystatus",
            following: "#following"
        },

        onShow: function(){
            var myStatusEmptyView = App.Vitalis.Views.MonitoringMyStatusSummaryEmptyItem;
            var followingEmptyView = App.Vitalis.Views.MonitoringFollowingSummaryEmptyItem;

            var myStatusView = new App.Vitalis.Views.MonitoringSummaryListWithTitle({collection: new Vitalis.Models.MyStatus(), emptyView: myStatusEmptyView, title: "Mi estado"});
            var followingView = new App.Vitalis.Views.MonitoringSummaryListWithTitle({collection: new Vitalis.Models.Following(), emptyView: followingEmptyView, title: "Siguiendo"});

            this.getRegion('myStatus').show(myStatusView);
            this.getRegion('following').show(followingView);

            $(document).ready(function(){
                $('.tooltipped').tooltip({delay: 50});
            });
        },

        executeAction: function(event){
            //parentElement porque siempre agarra el <i> en lugar del <a>
            $('.tooltipped').tooltip('remove');
            var target = event.target.parentElement.getAttribute('data-target');
            Urls.go(target);
        },



    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    var Models      = App.module('Vitalis.Models');

    var ENTER_KEY = 13;

    Views.Login = Marionette.LayoutView.extend({

        template: App.Vitalis.templates.login,

        ui: {
            'inputs': 'input[type=email], input[type=password]',
            'login_button': 'input#login',
            'signup': 'a#signup-now-btn'

        },

        events: {
            'click @ui.login_button': 'onLogin',
            'blur @ui.inputs': 'setModelData',
            'click @ui.signup': 'signup',
            'keydown': 'keyaction'
        },

        keyaction: function(e){
            if(e.which === ENTER_KEY){
                this.setModelData(e);
                this.onLogin();
            }
        },

        onShow: function(){
            console.log('show login');
            $(document).ready(function() {
                Materialize.updateTextFields();
                $('.modal').closeModal();
            });

            // Check if user is already logged in
            if(localStorage.getItem('accesstoken')){
                $.ajax({
                    url: Models.API_ROOT_URL + '/api/access/validate',
                    method: 'POST',
                    data: JSON.stringify({
                        "access_token": localStorage.getItem('accesstoken')
                    }),
                    success: function(){
                        Urls.go('vitalis:home');
                    },
                    error: function(){
                    }
                });
            }
        },

        onLogin: function(){
            $('#preloader-header').removeClass('hidden');
            // FIXME: Validaciones y timeout

            var headers = {
                'Content-Type': 'application/json',
                'Accepts': 'application/json'
            };

            if(localStorage.getItem('devicetoken')){
                headers['X-Device-Token'] = localStorage.getItem('devicetoken');
            }

            $.ajax({
                url: Models.API_ROOT_URL + '/api/access/login',
                method: 'POST',
                data: JSON.stringify({
                    email: this.model.get('email'),
                    password: this.model.get('password'),
                }),
                headers: headers,
                success: function(data){
                    localStorage.setItem('accesstoken', data.token);
                    $('#preloader-header').addClass('hidden');

                    Urls.go("vitalis:home");
                },
                error: function(error){
                    var message = null;
                    switch(error.responseJSON.error){
                        case 'internal_server_error': message = '¡Ups! Tenemos un problema. Intenta más tarde'; break;
                        case 'invalid_credentials': message = 'Usuario o contraseña incorrecto'; break;
                        case 'incomplete_credentials': message = 'Completa usuario y contraseña'; break;
                        default: message = '¡Ups! Tenemos un problema. Intenta más tarde'; break;
                    }
                    $('#preloader-header').addClass('hidden');
                    Materialize.toast(message, 3500, '', function(){})
                }
            });
        },

        signup: function(){
            Urls.go('vitalis:signup');
        },

        setModelData: function(event){
            this.model.set(event.target.name, event.target.value);
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls    = App.module('Urls'),
        Header  = App.module('Header');


    Views.Main = Marionette.LayoutView.extend({

        className: 'ch-box',

        template: App.Vitalis.templates.main,

        ui: {
            goto_login_button: 'a#goto-login'
        },
        events:{
          'click @ui.goto_login_button': 'goToLogin'
        },
        templateHelpers: function() {
            return {
                sarasa: 'seba'
            }
        },

        onShow: function(){
            console.log('show');
        },

        goToLogin: function(){
            Urls.go('vitalis:login');
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.ModuleListEmptyItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.module_list_empty_item,
        ui: {
            'emptyCard': 'li.collection-item > div > a'
        },

        events:{
            'click @ui.emptyCard': 'registerModule'
        },

        registerModule: function(){
            Urls.go('vitalis:new_module');
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.ModuleListItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.module_list_item,
        ui: {
            monitoringCard: 'li.collection-item',
            assignMonitoringButton: "li[data-role='assign-monitoring']",
            gotoMonitoringButton: "li[data-role='goto-monitoring']",
            deleteModuleButton: "li[data-role='delete-module']",
            moreInfoButton: "li[data-role='more-info']",
            confirmDeleteButton: "a[data-role='confirm-delete']"
        },

        events:{
            'click @ui.assignMonitoringButton': 'assignMonitoring',
            'click @ui.deleteModuleButton': 'deleteModule',
            'click @ui.moreInfoButton': 'goToModule',
            'click @ui.confirmDeleteButton': 'confirmDelete',
            'click @ui.gotoMonitoringButton': 'gotoMonitoring'
        },

        onShow: function(){
            $(document).ready(function(){
                // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
                $('.modal-trigger').leanModal();
            });
        },

        assignMonitoring: function(){
            var moduleId = this.model.get('id');
            Urls.go('vitalis:new_monitoring', [moduleId]);
        },

        deleteModule: function(){
            $('#delete-module-modal').openModal();
        },

        confirmDelete: function(){
            var serialNumber = this.model.get("serial_number");
            $('.modal').closeModal();
            this.model.destroy({success: function(){
                var message = "Eliminaste el módulo " + serialNumber;
                Utils.toast(message);
            }});
        },

        gotoMonitoring: function(){
            var monitoringId = this.model.get('monitoring').id;
            Urls.go('vitalis:monitoring', [monitoringId]);
        },

        goToModule: function(){

        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.ModulesListView = Views.AbstractListView.extend({

        childView: App.Vitalis.Views.ModuleListItemView,
        emptyView: App.Vitalis.Views.ModuleListEmptyItem,

        initialize: function(){
            this.collection.fetch();
        },

        childEvents: {
            // This callback will be called whenever a child is rendered or emits a `render` event
            destroy: function(child) {
                this.collection.remove(child.model);
                //this.render();
            }
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.NewModulePage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.new_module_page,

        ui: {
            inputs: 'input[type="text"]',
            registerButton: 'a#register'

        },

        events: {
            'blur @ui.inputs': 'setModelData',
            'click @ui.registerButton': 'registerModule'
        },

        initialize: function(){
            this.model = new Vitalis.Models.Module();
        },

        onShow: function(){
            $(document).ready(function(){
                Materialize.updateTextFields();
            });
        },

        setModelData: function(event){
            this.model.set(event.target.name, event.target.value);
        },

        registerModule: function(event){
            var self = this;
            this.model.save({}, {success: function(){
                var message = 'Registraste correctamente el módulo ' + self.model.get('serial_number');
                Utils.toast(message);
                Urls.go('vitalis:modules');
            }, error: function(){
                var message = 'El módulo ' + self.model.get('serial_number') + 'ya se encuentra registrado';
                Utils.toast(message);
            }});
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.ModulesPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.module_page,

        ui: {
            addModuleButton: 'a[data-role="new-module"]'

        },

        events: {
            'click @ui.addModuleButton': 'addModule'
        },

        regions: {
            myModules: '#mymodules'
        },

        onShow: function(){
            var emptyView       = Views.ModuleListEmptyItem;
            var modulesList     = new Vitalis.Models.ModulesList();
            var modulesListView = new App.Vitalis.Views.ModulesListView({
                                                        collection: modulesList,
                                                        title: "Información módulos",
                                                        emptyView: emptyView
            });

            this.getRegion('myModules').show(modulesListView);
        },

        addModule: function(event){
            Urls.go('vitalis:new_module');
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringFollowerAssignmentEmptyItem = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.empty_follower_assignment_result_item,
        ui: {
            'emptyCard': 'li.collection-item > div > a',
            searchUsersModal: 'div#search-users.modal'
        },

        regions: {
            searchUsersContainer: 'div#search-users-container'
        },

        events:{
            'click @ui.emptyCard': 'assignFollower'
        },

        assignFollower: function(){
            var searchUsersModal = new Vitalis.Views.UserSearchSingleSelectionModal();
            var self = this;
            searchUsersModal.on('add:user', function(args){
                console.log('add:user@empty_view');
                self.trigger('add:user', args.model);
            });
            this.getRegion('searchUsersContainer').show(searchUsersModal);
        }

    });
});
'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringFollowerAssignmentItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.user_search_result_item_with_delete,

        ui: {
            addButton: 'button[data-role="add"]',
            deleteButton: 'button[data-role="delete"]',
            'adminCheckbox': 'input[data-role="admin"]'
        },

        events: {
            'click @ui.adminCheckbox': 'updateAdmin'
        },

        triggers:{
            'click @ui.addButton': 'add:user',
            'click @ui.deleteButton': 'remove:user'
        },

        templateHelpers: function(){
            var role = this.getOption('role');
            return {
                role: role
            };
        },

        updateAdmin: function(event){
            var input = event.target;
            var isChecked = $(input).is(":checked");
            this.model.set('is_admin', isChecked);
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringFollowerAssignmentListView = Views.AbstractActionableListView.extend({
        childView: App.Vitalis.Views.MonitoringFollowerAssignmentItemView,

        ui: {
            addButton: 'a[data-role="addFollower"]'
        },

        regions: {
            searchUsersContainer: 'div#action-container'
        },

        events: {
            'click @ui.addButton': 'showAddUserModal'
        },

        showAddUserModal: function(){
            var searchUsersModal = new Vitalis.Views.UserSearchSingleSelectionModal({});
            var self = this;
            searchUsersModal.on('add:user', function(args){
                console.log('add:user@empty_item');
                self.addUser(args, args.model)
            });

            this.getRegion('searchUsersContainer').show(searchUsersModal);

        },

        childEvents: {
            'add:user': 'addUser',
            'remove:user': 'removeUser',
            'before:render': 'doBeforeRender'
        },

        addUser: function(args, model) {
            console.log('add:user@final_list_view');
            $('.modal').closeModal();
            this.collection.add(model);
            //this.getRegion('searchUsersContainer').destroy();
            this._reInitializeRegions();
            this.render();
        },

        removeUser: function(args, model) {
            $('.modal').closeModal();
            this.collection.remove(args.model);

            this.render();
        },

        doBeforeRender: function(a, b){
            b.options.role = 'delete';
        },

        initialize: function(options) {
            //give this composite view a LayoutView behaviour with added region manager
            this.regionManager = new Marionette.RegionManager();
            _.each(["_initializeRegions", "_initRegionManager",
                "_buildRegions", "addRegion", "addRegions",
                "removeRegion", "getRegion", "getRegions",
                "_reInitializeRegions", "getRegionManager"], function(prop) {
                Marionette.CompositeView.prototype[prop] = Marionette.LayoutView.prototype[prop];
            });
            var that = this;
            _.each(this.regions, function(value, key) {
                var region = that.addRegion(key, value);
                that[key] = region;
            });

            if(this.getOption('prefetch')){
                this.collection.fetch();
            }
        },

        onDestroy: function() {
            this.regionManager.destroy();
        }


    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringPatientAssignmentEmptyItem = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.empty_patient_assignment_result_item,

        ui: {
            emptyCard: 'li.collection-item > div > a',
            searchUsersModal: 'div#search-users.modal'
        },

        regions: {
            searchUsersContainer: 'div#search-users-container'
        },

        events:{
            'click @ui.emptyCard': 'assignPatient'
        },

        assignPatient: function(){
            var searchUsersModal = new Vitalis.Views.UserSearchSingleSelectionModal({
                                                                        extra_params: {
                                                                            exclude_with_monitoring: true
                                                                        }
            });

            var self = this;
            searchUsersModal.on('add:user', function(args){
                console.log('add:user@empty_item');
                self.trigger('add:user', args.model);
            });
            this.getRegion('searchUsersContainer').show(searchUsersModal);
        }
    });
});
'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringPatientAssignmentItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.user_search_result_item,
        //template: App.Vitalis.templates.monitoring_search_result_item,

        ui: {
            addButton: 'button[data-role="add"]',
            deleteButton: 'button[data-role="delete"]',
        },

        triggers:{
            'click @ui.addButton': 'add:user',
            'click @ui.deleteButton': 'remove:user'
        },

        templateHelpers: function(){
            var role = this.getOption('role');
            return {
                role: role
            };
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringPatientAssignmentListView = Views.AbstractListView.extend({
        childView: App.Vitalis.Views.MonitoringPatientAssignmentItemView,

        ui: {
           addButton: 'a[data-role="addFollower"]'
        },

        regions: {
            searchUsersContainer: 'div#action-container'
        },

        events: {
            'click @ui.addButton': 'showAddUserModal'
        },

        childEvents: {
            'add:user': 'addUser',
            'remove:user': 'removeUser',
            'before:render': 'doBeforeRender'
        },

        addUser: function(args, model) {
            console.log('add:user@final_list_view');
            $('.modal').closeModal();
            this.collection.add(model);

            this.render();
        },

        removeUser: function(args, model) {
            $('.modal').closeModal();
            this.collection.remove(args.model);

            this.render();
        },

        doBeforeRender: function(a, b){
            b.options.role = 'delete';
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.NewMonitoringPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.new_monitoring_page,

        ui: {
            initMonitoringButton: 'a[data-role="init-monitoring"]'
        },

        events: {
            'click @ui.initMonitoringButton': 'initMonitoring'
        },

        regions: {
            patient: 'div#patient',
            followers: 'div#followers',
            sensors: 'div#sensors'
        },

        onShow: function(){
            var emptyPatientItemView = Vitalis.Views.MonitoringPatientAssignmentEmptyItem;
            var emptyFollowerItemView = Vitalis.Views.MonitoringFollowerAssignmentEmptyItem;

            var GenericList = Backbone.Collection.extend({});

            var patientsList = new GenericList();
            var followersList = new GenericList();
            var sensorsList = new Vitalis.Models.AvailableSensors();

            var patientView = new Vitalis.Views.MonitoringPatientAssignmentListView({
                                                                    emptyView: emptyPatientItemView,
                                                                    title: "Asignar paciente",
                                                                    collection: patientsList
            });

            var followersView = new Vitalis.Views.MonitoringFollowerAssignmentListView({
                                                                    emptyView: emptyFollowerItemView,
                                                                    title: "Asignar seguidores",
                                                                    collection: followersList,
                                                                    action: {
                                                                        icon: 'add',
                                                                        role: 'addFollower'
                                                                    }
            });

            var sensorsView = new Vitalis.Views.MonitoringSensorSelectionListView({
                title: "Asignar sensores",
                collection: sensorsList
            });

            this.model.set('patient', patientsList);
            this.model.set('followers', followersList);
            this.model.set('sensors', sensorsList);

            this.getRegion('patient').show(patientView);
            this.getRegion('followers').show(followersView);
            this.getRegion('sensors').show(sensorsView);
        },

        initMonitoring: function(event){
            this.model.save({}, { success: function(){
                Urls.go('vitalis:modules');
                var message = "Monitoreo en línea";
                Utils.toast(message, 3500, '', function(){});
            }});
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.monitoring_page,

        regions: {
            sensors: '#sensors'
        },

        initialize: function(){
            var self = this;
            this.model.fetch({success: function(){
                self.render();

                var sensors = self.model.get('sensors');

                sensors.forEach(function(sensor){
                    sensor.monitoring_id = self.model.get('id');
                });

                var sensorsCollection = new Vitalis.Models.Sensors(sensors);
                var sensorsView = new App.Vitalis.Views.MonitoringSensorList({collection: sensorsCollection});

                self.getRegion('sensors').show(sensorsView);

            }});
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.SearchMonitoringsResultsItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.monitoring_search_result_item,
        ui: {
            followButton: 'button[data-role="follow"]'
        },

        events:{
            'click @ui.followButton': 'followMonitoring'
        },

        followMonitoring: function(event){
            var monitoringId = this.model.get("id");
            var request = new Vitalis.Models.NewFollowRequest({monitoring_id: monitoringId});
            var followButton = event.target;

            request.save({}, {success: function(){
                Utils.toast("Solicitud enviada");

                $(followButton).text('check');
                // $(followButton).text('Solicitud enviada');
                $(followButton).parent().prop('disabled', true);

            }});

        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.SearchMonitoringsResultsListView = Marionette.CompositeView.extend({
        template: App.Vitalis.templates.collection_wrapper_with_title,
        childViewContainer: "ul.collection",
        childView: App.Vitalis.Views.MonitoringPatientAssignmentItemView,

        templateHelpers: function() {
            return {
                collection_title: this.getOption('title')
            }
        },

        childEvents:{
            'add:user': function(args){
                console.log('add:user@search_list_view');
                this.trigger('add:user', args);
            }
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.monitoring_sensor_item,
        ui: {
            'monitoringCard': 'li.collection-item'
        },

        events:{
            'click @ui.monitoringCard': 'goToMonitoring'
        },

        goToMonitoring: function(){
            var monitoringId = this.model.get("monitoring_id");
            var measurementType = this.model.get("measurement_type");
            if(this.model.get('last_value')){
                Urls.go('vitalis:measurements', [monitoringId, measurementType]);
            }
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorList = Views.AbstractListView.extend({
        childView: App.Vitalis.Views.MonitoringSensorItem
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorMeasurementChart = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.monitoring_sensor_measurement_chart,

        ui: {
            chartCanvas: 'canvas#chart',
            measurementType: 'input#measurement_type'
        },

        templateHelpers: function(){
            return {
                measurementType: this.collection.measurementType
            }
        },

        onShow: function(){

            var ctx = $(this.ui.chartCanvas);
            var measurementType = $(this.ui.measurementType).val();

            var labels          = [];
            var values          = [];
            var secondaryValues = [];

            this.collection.models.forEach(function(model){
                labels.unshift(new Date(model.get('measurement_date')).format('HH:MM'));
                values.unshift(model.get('value'));
                if(model.get('value_secondary')){
                    secondaryValues.unshift(model.get('value_secondary'));    
                }
            });

            var datasets = [];

            datasets.push({
                borderColor: "#4bc0c0",
                data: values
            });

            if(secondaryValues.length > 0){
                datasets.push({
                    borderColor: "#9966ff",
                    data: secondaryValues
                });                
            }

            var myChart = new Chart(ctx, {
                type: 'line',
                data:  {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    title: {
                        display: true,
                        text: measurementType,
                        fontColor: '#9e9e9e'
                    },
                    legend: {
                        display: false,
                        fontColor: '#9e9e9e'
                    }
                }
            });
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorMeasurementItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.monitoring_sensor_measurement_item
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorMeasurementList = Marionette.CompositeView.extend({

        template: App.Vitalis.templates.collection_wrapper_with_title,
        childViewContainer: "ul.collection",
        childView: App.Vitalis.Views.MonitoringSensorMeasurementItem,

        templateHelpers: function() {
            return {
                collection_title: this.getOption('title')
            }
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.monitoring_sensor_page,

        regions: {
            chart: '#chart',
            values: '#values',
            alerts: '#alerts'
        },

        initialize: function(){
            var self = this;
            var measurementType = self.model.models[0].get('measurementType');
            this.model.fetch({success:function(){
                self.render();
                self.model.measurementType = measurementType;

                var chartView = new App.Vitalis.Views.MonitoringSensorMeasurementChart({collection: self.model, measurementType: measurementType});
                var sensorsView = new App.Vitalis.Views.MonitoringSensorMeasurementList({collection: self.model});

                self.getRegion('chart').show(chartView);
                self.getRegion('values').show(sensorsView);

            }});
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorSelectionItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.monitoring_sensor_selection_item,

        ui: {
          toggleSelectionButton: 'input[data-role="toggle-selection"]'
        },

        events: {
            'click @ui.toggleSelectionButton': 'toggleSelection'
        },

        toggleSelection: function(event){
            var input = event.target;
            var isChecked = $(input).is(":checked");

            var status = isChecked ? "enabled" : "disabled";
            this.model.set('status', status);
        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorSelectionListView = Views.AbstractListView.extend({
        childView: App.Vitalis.Views.MonitoringSensorSelectionItem,

        initialize: function(){
            this.collection.fetch();
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringFollowingSummaryEmptyItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.empty_following,
        ui: {
            'emptyCard': 'li.collection-item > div > a'
        },

        events:{
            'click @ui.emptyCard': 'sendRequest'
        },

        sendRequest: function(){
            Urls.go('vitalis:new_request');
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSummaryItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.monitoring_summary,
        ui: {
            'monitoringCard': 'li.collection-item'
        },

        events:{
            'click @ui.monitoringCard': 'goToMonitoring'
        },

        goToMonitoring: function(){
            var monitoringId = this.model.get("id");
            Urls.go('vitalis:monitoring', [monitoringId]);
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSummaryListWithTitle = Marionette.CompositeView.extend({

        template: App.Vitalis.templates.collection_wrapper_with_title,
        childViewContainer: "ul.collection",
        childView: App.Vitalis.Views.MonitoringSummaryItem,

        initialize: function(){
            this.collection.fetch();
        },

        templateHelpers: function() {
            return {
                collection_title: this.getOption('title')
            }
        },

        onShow: function(){
            console.log("MonitoringSummaryList shown");
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringMyStatusSummaryEmptyItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.empty_mystatus,
        ui: {
            'emptyCard': 'li.collection-item > div > a'
        },

        events:{
            'click @ui.emptyCard': 'registerModule'
        },

        registerModule: function(){
            Urls.go('vitalis:modules');
        }
    });
});
// main.layout.view.js
'use strict';
App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {
    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    var ENTER_KEY = 13;
    Views.MyData = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.mydata,
        ui: {
            'inputs': 'input, select',
        },

        events: {
            'submit #mydataForm': 'onSubmit',
            'blur @ui.inputs': 'setModelData',
            'change @ui.inputs': 'setModelData',
            'keydown': 'keyaction'
        },
        initialize: function(){
            var self = this;
            this.model.fetch().then(function(){
                self.render();
                //var sensorsCollection = new Vitalis.Models.Sensors(self.model.get('sensors'));
                //var sensorsView = new App.Vitalis.Views.MonitoringSensorMeasurementList({collection: sensorsCollection});
                //self.getRegion('sensors').show(sensorsView);
            });
        },

        onRender: function(){
            $(document).ready(function() {
                $('select').material_select();
                Materialize.updateTextFields();
            });
        },

        keyaction: function(e){
            if(e.which === ENTER_KEY){
                this.setModelData(e);
            }
        },

        onSubmit: function() {
            this.model.save({}, {beforeSend : function(xhr){
                xhr.setRequestHeader('X-Auth-Token', localStorage.getItem('accesstoken'));
            }});
            return false;
        },

        setModelData: function(event){
            this.model.set(event.target.name, event.target.value);
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Patients = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.patients,

        //regions: {
        //    myStatus: "#mystatus",
        //    following: "#following > ul.collection"
        //},

        onShow: function(){
            //var self = this;
            //var myStatusView = new App.Vitalis.Views.MyStatus({model: new Vitalis.Models.MyStatus()});
            //var followingView = new App.Vitalis.Views.Following({collection: new Vitalis.Models.Following()});
            //
            //
            //myStatusView.model.fetch({beforeSend: function(xhr){
            //    xhr.setRequestHeader('X-Auth-Token', localStorage.getItem('accesstoken'));
            //}}).then(function(){
            //    self.getRegion('myStatus').show(myStatusView);
            //});
            //
            //followingView.collection.fetch({beforeSend: function(xhr){
            //    xhr.setRequestHeader('X-Auth-Token', localStorage.getItem('accesstoken'));
            //}}).then(function(){
            //    self.getRegion('following').show(followingView);
            //});

        }

    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Signup = Marionette.LayoutView.extend({

        template: App.Vitalis.templates.signup,

        ui: {
            'inputs': 'input[type=email], input[type=password]',
            'signup_button': 'input#signup',
            'return': "a#return-to-login-btn"
        },

        events: {
            'blur @ui.inputs': 'setModelData',
            'click @ui.signup_button': 'signup',
            'click @ui.return': 'returnToLogin'
        },

        onShow: function () {
            $(document).ready(function () {
                Materialize.updateTextFields();
            });
        },

        signup: function(){

            if(!this.model.get("email") || !this.model.get("password") || !this.model.get("password2")){
                Materialize.toast("Completa los datos", 3500, '', function(){});
            } else if(this.model.get("password") !== this.model.get("password2")){
                Materialize.toast("Verifica que coincidan tus contraseñas", 3500, '', function(){});
            } else {
                $('#preloader-header').removeClass('hidden');
                $.ajax({
                        url: '/api/access/signup',
                        method: 'POST',
                        data: JSON.stringify({
                            email: this.model.get('email'),
                            password: this.model.get('password'),
                            password2: this.model.get('password2')
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Accepts': 'application/json'
                        },
                        success: function(){
                            $('#preloader-header').addClass('hidden');
                            Urls.go("vitalis:login");
                            Materialize.toast("¡Bienvenido! Ahora podés entrar", 3500, '', function(){})
                        },
                        error: function(error){
                            $('#preloader-header').addClass('hidden');
                            var message = null;
                            switch(error.responseJSON.error){
                                case 'internal_server_error': message = '¡Ups! Tenemos un problema. Intenta de nuevo'; break;
                                case 'user_already_exists': message = 'Ya hay un usuario registrado con este email'; break;
                                case 'passwords_mismatch': message = 'Verifica que coincidan tus contraseñas'; break;
                                case 'incomplete_credentials': message = 'Completa usuario y contraseña'; break;
                                case 'email_already_registered': message = 'Ya hay un usuario registrado con este email'; break;
                                default: message = '¡Ups! Tenemos un problema. Intenta de nuevo'; break;
                            }
                            Materialize.toast(message, 3500, '', function(){})
                        }
                })

            }


                //this.model.save({timeout: 2000},
                //    {
                //        success: function(data){
                //            $('#preloader-header').addClass('hidden');
                //            Urls.go("vitalis:login");
                //        },
                //        error: function(model, error){
                //            var message;
                //            switch(error.responseJSON.error){
                //                case 'internal_server_error': message = '¡Ups! Tenemos un problema. Intenta más tarde'; break;
                //                case 'user_already_exists': message = 'Ya hay un usuario registrado con este email'; break;
                //                case 'passwords_mismatch': message = 'Verifica que coincidan tus contraseñas'; break;
                //                case 'incomplete_credentials': message = 'Completa usuario y contraseña'; break;
                //                case 'email_already_registered': message = 'Ya hay un usuario registrado con este email'; break;
                //                default: message = '¡Ups! Tenemos un problema. Intenta más tarde'; break;
                //            }
                //            $('#preloader-header').addClass('hidden');
                //            Materialize.toast(message, 3500, '', function(){})
                //        }
                //    });
            //}
        },

        setModelData: function(event){
            this.model.set(event.target.name, event.target.value);
        },

        returnToLogin: function(){
            Urls.go("vitalis:login");
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.UserSearchSingleSelectionModal = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.user_search_modal_single_selection_wrapper,
        childViewContainer: "div#search-results",

        ui: {
            searchField: 'input#search',
            resetButton: 'i#reset-btn',
            searchForm: 'form#search-form'
        },

        events: {
            'keyup @ui.searchField': 'search',
            'click @ui.resetButton': 'resetSearch',
            'submit @ui.searchForm': 'onSubmit'
        },

        regions: {
            searchResults: 'div#search-results'
        },

        onShow: function(){
            var monitoringsList = new Vitalis.Models.UserSearchList();
            var searchResultsView = new App.Vitalis.Views.SearchMonitoringsResultsListView({collection: monitoringsList,
                                                                                            title: "Resultados de búsqueda"});
            var self = this;
            searchResultsView.on('add:user', function(args){
                console.log('add:user@modal_search_view');
                self.trigger('add:user', args);
            })

            this.collection = monitoringsList;
            this.getRegion('searchResults').show(searchResultsView);

            $(document).ready(function(){
                $('.modal').openModal();
            });
        },

        search: function(e){
            var searchQuery = e.target.value;

            var extraParams = this.getOption('extra_params');

            var searchParams = {query: searchQuery};

            if(extraParams){
                for(param in extraParams){
                    searchParams[param] = extraParams[param];
                }
            }


            if(searchQuery.length > 3){
                this.collection.fetch({data: $.param(searchParams)});
            } else {
                this.collection.reset();
            }
        },

        resetSearch: function(){
            $(this.ui.searchField).val('');
            this.collection.reset();
        },

        onSubmit: function(e){
            e.preventDefault();
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.FollowRequestUserSearchResultItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.monitoring_search_result_item,
        ui: {
            addButton: 'button[data-role="follow"]'
        },

        events:{
            'click @ui.addButton': 'addUser'
        },

        addUser: function(event){

            var monitoringId = this.model.get("id");

            var request = new Vitalis.Models.NewFollowRequest({monitoring_id: monitoringId});
            var followButton = event.target;

            request.save({}, {success: function(){
                Utils.toast("Solicitud enviada");

                $(followButton).text('check');
                // $(followButton).text('Solicitud enviada');
                $(followButton).parent().prop('disabled', true);
            }});

        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.FollowRequestUserSearchResultListView = Views.AbstractListView.extend({
        childView: App.Vitalis.Views.FollowRequestUserSearchResultItemView
    });
});
// router.js

'use strict';

App.module('Vitalis.Router', function (Router, App, Backbone, Marionette, $, _) {

    var Urls    = App.module('Urls'),
        Vitalis = App.module('Vitalis'),
        Utils   = App.module('Vitalis.Utils'),
        controller = {};

    controller.index = function () {
        var mainLayoutView = new App.Vitalis.Views.Main();
        App.main.show(mainLayoutView);
    };

    controller.login = function(){
        var loginView = new App.Vitalis.Views.Login({model: new Vitalis.Models.Login()});
        var headerView = new App.Vitalis.Views.LoginHeader();

        App.header.show(headerView);
        App.main.show(loginView);
    };

    controller.signup = function(){
        var signupView = new App.Vitalis.Views.Signup({model: new Vitalis.Models.Signup()});
        var headerView = new App.Vitalis.Views.LoginHeader();

        App.header.show(headerView);
        App.main.show(signupView);
    };

    controller.home = function(){
        var homeView = new App.Vitalis.Views.Home({model: new Vitalis.Models.Home()});
        var headerView = new App.Vitalis.Views.Header({model: new Vitalis.Models.User()});

        App.header.show(headerView);
        App.main.show(homeView);

    };

    controller.monitoring = function(monitoringId){
        var monitoringPageView = new App.Vitalis.Views.MonitoringPage({model: new Vitalis.Models.PatientStatus({id: monitoringId})});
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({
            title: "Ver monitoreo",
            menu: {
                options: [
                    {
                        id: 'finish_monitoring',
                        label: "Finalizar monitoreo",
                        action: function(event, container){
                            var monitoring = new Vitalis.Models.Monitoring({id: monitoringId});

                            monitoring.destroy({
                                        success: function(){
                                                    Utils.toast("Monitoreo finalizado");
                                                    Urls.go('vitalis:home');
                                        },
                                        error: function(){
                                            Utils.toast("Ups! No pudimos finalizar el monitoreo");
                                        }
                            });
                        }
                    },
                    {
                        id: 'stop-following',
                        label: 'Dejar de seguir',
                        action: function(event, container){
                            var follower = new Vitalis.Models.MonitoringFollower({monitoring_id: monitoringId});

                            follower.destroy({
                                url: '/api/app/monitorings/' + monitoringId + "/follower",
                                success: function(){
                                    Utils.toast("Listo! Ya dejaste de seguir este monitoreo");
                                    Urls.go('vitalis:home');
                                },
                                error: function(){
                                    Utils.toast("Ups! No pudimos ejecutar esta acción");
                                }
                            });

                        }
                    }
                ]

            }
        });

        App.header.show(innerHeaderView);
        App.main.show(monitoringPageView);

    };

    controller.patients = function(){
        var patientsView = new App.Vitalis.Views.Patients();
        App.main.show(patientsView);
    };


    controller.measurements = function(monitoringId, measurementType){
        var monitoringPageView = new App.Vitalis.Views.MonitoringSensorPage({model: new Vitalis.Models.MeasurementList({monitoringId: monitoringId, measurementType: measurementType})});
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Ver mediciones"});

        App.header.show(innerHeaderView);
        App.main.show(monitoringPageView);
    };

    controller.requests = function(){
        var followRequestPage = new App.Vitalis.Views.FollowRequestPage();
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({   title: "Mis solicitudes",
                                                                    secondary_action: {
                                                                        icon: 'person_add',
                                                                        action: function(event){
                                                                            Urls.go('vitalis:new_request');
                                                                        }
                                                                }});

        App.header.show(innerHeaderView);
        App.main.show(followRequestPage);

    };

    controller.new_request = function(){
        var newFollowRequestPage = new App.Vitalis.Views.NewFollowRequestPage();
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Nueva solicitud"});

        App.header.show(innerHeaderView);
        App.main.show(newFollowRequestPage);
    };

    controller.modules = function(){
        var modulesPage = new App.Vitalis.Views.ModulesPage();
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Mis módulos"});

        App.header.show(innerHeaderView);
        App.main.show(modulesPage);
    };

    controller.new_monitoring = function(moduleId){
        var monitoring = new Vitalis.Models.ModuleMonitoring({module_id: moduleId});

        var newMonitoringPage = new App.Vitalis.Views.NewMonitoringPage({model: monitoring});
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Nuevo monitoreo"});

        App.header.show(innerHeaderView);
        App.main.show(newMonitoringPage);
    };

    controller.new_module = function(){
        var newModulePage = new App.Vitalis.Views.NewModulePage();
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Nuevo módulo"});

        App.header.show(innerHeaderView);
        App.main.show(newModulePage);
    };

    controller.mydata = function() {
        var mydataView = new App.Vitalis.Views.MyData({model: new Vitalis.Models.User()});
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Mis datos"});
        App.header.show(innerHeaderView);
        App.main.show(mydataView);
    };
    controller.alerts = function(){
        var alertsPage = new App.Vitalis.Views.AlertsPage();
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Mis alertas"});

        App.header.show(innerHeaderView);
        App.main.show(alertsPage);

    };

    controller.new_alert = function(){

        var alert = new Vitalis.Models.Alert();

        var newAlertPage = new App.Vitalis.Views.NewAlertPage({model: alert});
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Nueva alerta"});

        App.header.show(innerHeaderView);
        App.main.show(newAlertPage);

    };


    /**
     * Vitalis.Controller
     */
    App.Vitalis.Controller = controller;

    /**
     * Vitalis.Router
     */
    var routes = {};

    function addRoute(name) {
        routes[Urls.get('vitalis:' + name)] = name;
    }
    addRoute('index');
    addRoute('login');
    addRoute('signup');
    addRoute('home');
    addRoute('patients');
    addRoute('measurements');
    addRoute('mydata');
    addRoute('monitoring');
    addRoute('requests');
    addRoute('new_request');
    addRoute('modules');
    addRoute('new_monitoring');
    addRoute('new_module');
    addRoute('alerts');
    addRoute('new_alert');

    App.Vitalis.Router = Marionette.AppRouter.extend({
        'appRoutes': routes,
        'controller': controller
    });
});
// vitalis.module.js

'use strict';

App.module('Vitalis', function (Vitalis, App, Backbone, Marionette, $, _) {

    //var Header = App.module('Header');

    App.Events = _.extend({}, Backbone.Events);
    Vitalis.Cache = {};

    Vitalis.onStart = function() {
        new Vitalis.Router();

        startModels();
    };

    function startModels(){
    }

});