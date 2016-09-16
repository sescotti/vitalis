// Backbone.Radio v1.0.4
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n(require("underscore"),require("backbone")):"function"==typeof define&&define.amd?define(["underscore","backbone"],n):(e.Backbone=e.Backbone||{},e.Backbone.Radio=n(e._,e.Backbone))}(this,function(e,n){"use strict";function t(e,n,t,r){var o=e[n];return t&&t!==o.callback&&t!==o.callback._callback||r&&r!==o.context?void 0:(delete e[n],!0)}function r(n,r,o,i){n||(n={});for(var s=r?[r]:e.keys(n),u=!1,a=0,c=s.length;c>a;a++)r=s[a],n[r]&&t(n,r,o,i)&&(u=!0);return u}function o(n){return l[n]||(l[n]=e.bind(a.log,a,n))}function i(n){return e.isFunction(n)?n:function(){return n}}e="default"in e?e["default"]:e,n="default"in n?n["default"]:n;var s={};s["typeof"]="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};var u=n.Radio,a=n.Radio={};a.VERSION="1.0.4",a.noConflict=function(){return n.Radio=u,this},a.DEBUG=!1,a._debugText=function(e,n,t){return e+(t?" on the "+t+" channel":"")+': "'+n+'"'},a.debugLog=function(e,n,t){a.DEBUG&&console&&console.warn&&console.warn(a._debugText(e,n,t))};var c=/\s+/;a._eventsApi=function(n,t,r,o){if(!r)return!1;var i={};if("object"===("undefined"==typeof r?"undefined":s["typeof"](r))){for(var u in r){var a=n[t].apply(n,[u,r[u]].concat(o));c.test(u)?e.extend(i,a):i[u]=a}return i}if(c.test(r)){for(var l=r.split(c),f=0,h=l.length;h>f;f++)i[l[f]]=n[t].apply(n,[l[f]].concat(o));return i}return!1},a._callHandler=function(e,n,t){var r=t[0],o=t[1],i=t[2];switch(t.length){case 0:return e.call(n);case 1:return e.call(n,r);case 2:return e.call(n,r,o);case 3:return e.call(n,r,o,i);default:return e.apply(n,t)}};var l={};e.extend(a,{log:function(n,t){if("undefined"!=typeof console){var r=e.toArray(arguments).slice(2);console.log("["+n+'] "'+t+'"',r)}},tuneIn:function(e){var n=a.channel(e);return n._tunedIn=!0,n.on("all",o(e)),this},tuneOut:function(e){var n=a.channel(e);return n._tunedIn=!1,n.off("all",o(e)),delete l[e],this}}),a.Requests={request:function(n){var t=e.toArray(arguments).slice(1),r=a._eventsApi(this,"request",n,t);if(r)return r;var o=this.channelName,i=this._requests;if(o&&this._tunedIn&&a.log.apply(this,[o,n].concat(t)),i&&(i[n]||i["default"])){var s=i[n]||i["default"];return t=i[n]?t:arguments,a._callHandler(s.callback,s.context,t)}a.debugLog("An unhandled request was fired",n,o)},reply:function(e,n,t){return a._eventsApi(this,"reply",e,[n,t])?this:(this._requests||(this._requests={}),this._requests[e]&&a.debugLog("A request was overwritten",e,this.channelName),this._requests[e]={callback:i(n),context:t||this},this)},replyOnce:function(n,t,r){if(a._eventsApi(this,"replyOnce",n,[t,r]))return this;var o=this,s=e.once(function(){return o.stopReplying(n),i(t).apply(this,arguments)});return this.reply(n,s,r)},stopReplying:function(e,n,t){return a._eventsApi(this,"stopReplying",e)?this:(e||n||t?r(this._requests,e,n,t)||a.debugLog("Attempted to remove the unregistered request",e,this.channelName):delete this._requests,this)}},a._channels={},a.channel=function(e){if(!e)throw new Error("You must provide a name for the channel.");return a._channels[e]?a._channels[e]:a._channels[e]=new a.Channel(e)},a.Channel=function(e){this.channelName=e},e.extend(a.Channel.prototype,n.Events,a.Requests,{reset:function(){return this.off(),this.stopListening(),this.stopReplying(),this}});var f,h,d=[n.Events,a.Requests];return e.each(d,function(n){e.each(n,function(n,t){a[t]=function(n){return h=e.toArray(arguments).slice(1),f=this.channel(n),f[t].apply(f,h)}})}),a.reset=function(n){var t=n?[this._channels[n]]:this._channels;e.each(t,function(e){e.reset()})},a});
//# sourceMappingURL=backbone.radio.min.js.map

/**
 * jquery.mask.js
 * @version: v1.14.0
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at http://blog.igorescobar.com
 *
 * Copyright (c) 2012 Igor Escobar http://blog.igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* jshint laxbreak: true */
/* global define, jQuery, Zepto */

'use strict';

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
(function (factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }

}(function ($) {

    var Mask = function (el, mask, options) {

        var p = {
            invalid: [],
            getCaret: function () {
                try {
                    var sel,
                        pos = 0,
                        ctrl = el.get(0),
                        dSel = document.selection,
                        cSelStart = ctrl.selectionStart;

                    // IE Support
                    if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                        sel = dSel.createRange();
                        sel.moveStart('character', -p.val().length);
                        pos = sel.text.length;
                    }
                    // Firefox support
                    else if (cSelStart || cSelStart === '0') {
                        pos = cSelStart;
                    }

                    return pos;
                } catch (e) {}
            },
            setCaret: function(pos) {
                try {
                    if (el.is(':focus')) {
                        var range, ctrl = el.get(0);

                        // Firefox, WebKit, etc..
                        if (ctrl.setSelectionRange) {
                            ctrl.focus();
                            ctrl.setSelectionRange(pos, pos);
                        } else { // IE
                            range = ctrl.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }
                } catch (e) {}
            },
            events: function() {
                el
                .on('keydown.mask', function(e) {
                    el.data('mask-keycode', e.keyCode || e.which);
                })
                .on($.jMaskGlobals.useInput ? 'input.mask' : 'keyup.mask', p.behaviour)
                .on('paste.mask drop.mask', function() {
                    setTimeout(function() {
                        el.keydown().keyup();
                    }, 100);
                })
                .on('change.mask', function(){
                    el.data('changed', true);
                })
                .on('blur.mask', function(){
                    if (oldValue !== p.val() && !el.data('changed')) {
                        el.trigger('change');
                    }
                    el.data('changed', false);
                })
                // it's very important that this callback remains in this position
                // otherwhise oldValue it's going to work buggy
                .on('blur.mask', function() {
                    oldValue = p.val();
                })
                // select all text on focus
                .on('focus.mask', function (e) {
                    if (options.selectOnFocus === true) {
                        $(e.target).select();
                    }
                })
                // clear the value if it not complete the mask
                .on('focusout.mask', function() {
                    if (options.clearIfNotMatch && !regexMask.test(p.val())) {
                       p.val('');
                   }
                });
            },
            getRegexMask: function() {
                var maskChunks = [], translation, pattern, optional, recursive, oRecursive, r;

                for (var i = 0; i < mask.length; i++) {
                    translation = jMask.translation[mask.charAt(i)];

                    if (translation) {

                        pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                        optional = translation.optional;
                        recursive = translation.recursive;

                        if (recursive) {
                            maskChunks.push(mask.charAt(i));
                            oRecursive = {digit: mask.charAt(i), pattern: pattern};
                        } else {
                            maskChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
                        }

                    } else {
                        maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                    }
                }

                r = maskChunks.join('');

                if (oRecursive) {
                    r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                         .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
                }

                return new RegExp(r);
            },
            destroyEvents: function() {
                el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
            },
            val: function(v) {
                var isInput = el.is('input'),
                    method = isInput ? 'val' : 'text',
                    r;

                if (arguments.length > 0) {
                    if (el[method]() !== v) {
                        el[method](v);
                    }
                    r = el;
                } else {
                    r = el[method]();
                }

                return r;
            },
            getMCharsBeforeCount: function(index, onCleanVal) {
                for (var count = 0, i = 0, maskL = mask.length; i < maskL && i < index; i++) {
                    if (!jMask.translation[mask.charAt(i)]) {
                        index = onCleanVal ? index + 1 : index;
                        count++;
                    }
                }
                return count;
            },
            caretPos: function (originalCaretPos, oldLength, newLength, maskDif) {
                var translation = jMask.translation[mask.charAt(Math.min(originalCaretPos - 1, mask.length - 1))];

                return !translation ? p.caretPos(originalCaretPos + 1, oldLength, newLength, maskDif)
                                    : Math.min(originalCaretPos + newLength - oldLength - maskDif, newLength);
            },
            behaviour: function(e) {
                e = e || window.event;
                p.invalid = [];

                var keyCode = el.data('mask-keycode');

                if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
                    var caretPos    = p.getCaret(),
                        currVal     = p.val(),
                        currValL    = currVal.length,
                        newVal      = p.getMasked(),
                        newValL     = newVal.length,
                        maskDif     = p.getMCharsBeforeCount(newValL - 1) - p.getMCharsBeforeCount(currValL - 1),
                        changeCaret = caretPos < currValL;

                    p.val(newVal);

                    if (changeCaret) {
                        // Avoid adjusting caret on backspace or delete
                        if (!(keyCode === 8 || keyCode === 46)) {
                            caretPos = p.caretPos(caretPos, currValL, newValL, maskDif);
                        }
                        p.setCaret(caretPos);
                    }

                    return p.callbacks(e);
                }
            },
            getMasked: function(skipMaskChars, val) {
                var buf = [],
                    value = val === undefined ? p.val() : val + '',
                    m = 0, maskLen = mask.length,
                    v = 0, valLen = value.length,
                    offset = 1, addMethod = 'push',
                    resetPos = -1,
                    lastMaskChar,
                    check;

                if (options.reverse) {
                    addMethod = 'unshift';
                    offset = -1;
                    lastMaskChar = 0;
                    m = maskLen - 1;
                    v = valLen - 1;
                    check = function () {
                        return m > -1 && v > -1;
                    };
                } else {
                    lastMaskChar = maskLen - 1;
                    check = function () {
                        return m < maskLen && v < valLen;
                    };
                }

                while (check()) {
                    var maskDigit = mask.charAt(m),
                        valDigit = value.charAt(v),
                        translation = jMask.translation[maskDigit];

                    if (translation) {
                        if (valDigit.match(translation.pattern)) {
                            buf[addMethod](valDigit);
                             if (translation.recursive) {
                                if (resetPos === -1) {
                                    resetPos = m;
                                } else if (m === lastMaskChar) {
                                    m = resetPos - offset;
                                }

                                if (lastMaskChar === resetPos) {
                                    m -= offset;
                                }
                            }
                            m += offset;
                        } else if (translation.optional) {
                            m += offset;
                            v -= offset;
                        } else if (translation.fallback) {
                            buf[addMethod](translation.fallback);
                            m += offset;
                            v -= offset;
                        } else {
                          p.invalid.push({p: v, v: valDigit, e: translation.pattern});
                        }
                        v += offset;
                    } else {
                        if (!skipMaskChars) {
                            buf[addMethod](maskDigit);
                        }

                        if (valDigit === maskDigit) {
                            v += offset;
                        }

                        m += offset;
                    }
                }

                var lastMaskCharDigit = mask.charAt(lastMaskChar);
                if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
                    buf.push(lastMaskCharDigit);
                }

                return buf.join('');
            },
            callbacks: function (e) {
                var val = p.val(),
                    changed = val !== oldValue,
                    defaultArgs = [val, e, el, options],
                    callback = function(name, criteria, args) {
                        if (typeof options[name] === 'function' && criteria) {
                            options[name].apply(this, args);
                        }
                    };

                callback('onChange', changed === true, defaultArgs);
                callback('onKeyPress', changed === true, defaultArgs);
                callback('onComplete', val.length === mask.length, defaultArgs);
                callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
            }
        };

        el = $(el);
        var jMask = this, oldValue = p.val(), regexMask;

        mask = typeof mask === 'function' ? mask(p.val(), undefined, el,  options) : mask;


        // public methods
        jMask.mask = mask;
        jMask.options = options;
        jMask.remove = function() {
            var caret = p.getCaret();
            p.destroyEvents();
            p.val(jMask.getCleanVal());
            p.setCaret(caret - p.getMCharsBeforeCount(caret));
            return el;
        };

        // get value without mask
        jMask.getCleanVal = function() {
           return p.getMasked(true);
        };

        // get masked value without the value being in the input or element
        jMask.getMaskedVal = function(val) {
           return p.getMasked(false, val);
        };

       jMask.init = function(onlyMask) {
            onlyMask = onlyMask || false;
            options = options || {};

            jMask.clearIfNotMatch  = $.jMaskGlobals.clearIfNotMatch;
            jMask.byPassKeys       = $.jMaskGlobals.byPassKeys;
            jMask.translation      = $.extend({}, $.jMaskGlobals.translation, options.translation);

            jMask = $.extend(true, {}, jMask, options);

            regexMask = p.getRegexMask();

            if (onlyMask === false) {

                if (options.placeholder) {
                    el.attr('placeholder' , options.placeholder);
                }

                // this is necessary, otherwise if the user submit the form
                // and then press the "back" button, the autocomplete will erase
                // the data. Works fine on IE9+, FF, Opera, Safari.
                if (el.data('mask')) {
                  el.attr('autocomplete', 'off');
                }

                p.destroyEvents();
                p.events();

                var caret = p.getCaret();
                p.val(p.getMasked());
                p.setCaret(caret + p.getMCharsBeforeCount(caret, true));

            } else {
                p.events();
                p.val(p.getMasked());
            }
        };

        jMask.init(!el.is('input'));
    };

    $.maskWatchers = {};
    var HTMLAttributes = function () {
        var input = $(this),
            options = {},
            prefix = 'data-mask-',
            mask = input.attr('data-mask');

        if (input.attr(prefix + 'reverse')) {
            options.reverse = true;
        }

        if (input.attr(prefix + 'clearifnotmatch')) {
            options.clearIfNotMatch = true;
        }

        if (input.attr(prefix + 'selectonfocus') === 'true') {
           options.selectOnFocus = true;
        }

        if (notSameMaskObject(input, mask, options)) {
            return input.data('mask', new Mask(this, mask, options));
        }
    },
    notSameMaskObject = function(field, mask, options) {
        options = options || {};
        var maskObject = $(field).data('mask'),
            stringify = JSON.stringify,
            value = $(field).val() || $(field).text();
        try {
            if (typeof mask === 'function') {
                mask = mask(value);
            }
            return typeof maskObject !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
        } catch (e) {}
    },
    eventSupported = function(eventName) {
        var el = document.createElement('div'), isSupported;

        eventName = 'on' + eventName;
        isSupported = (eventName in el);

        if ( !isSupported ) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] === 'function';
        }
        el = null;

        return isSupported;
    };

    $.fn.mask = function(mask, options) {
        options = options || {};
        var selector = this.selector,
            globals = $.jMaskGlobals,
            interval = globals.watchInterval,
            watchInputs = options.watchInputs || globals.watchInputs,
            maskFunction = function() {
                if (notSameMaskObject(this, mask, options)) {
                    return $(this).data('mask', new Mask(this, mask, options));
                }
            };

        $(this).each(maskFunction);

        if (selector && selector !== '' && watchInputs) {
            clearInterval($.maskWatchers[selector]);
            $.maskWatchers[selector] = setInterval(function(){
                $(document).find(selector).each(maskFunction);
            }, interval);
        }
        return this;
    };

    $.fn.masked = function(val) {
        return this.data('mask').getMaskedVal(val);
    };

    $.fn.unmask = function() {
        clearInterval($.maskWatchers[this.selector]);
        delete $.maskWatchers[this.selector];
        return this.each(function() {
            var dataMask = $(this).data('mask');
            if (dataMask) {
                dataMask.remove().removeData('mask');
            }
        });
    };

    $.fn.cleanVal = function() {
        return this.data('mask').getCleanVal();
    };

    $.applyDataMask = function(selector) {
        selector = selector || $.jMaskGlobals.maskElements;
        var $selector = (selector instanceof $) ? selector : $(selector);
        $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
    };

    var globals = {
        maskElements: 'input,td,span,div',
        dataMaskAttr: '*[data-mask]',
        dataMask: true,
        watchInterval: 300,
        watchInputs: true,
        useInput: eventSupported('input'),
        watchDataMask: false,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            '0': {pattern: /\d/},
            '9': {pattern: /\d/, optional: true},
            '#': {pattern: /\d/, recursive: true},
            'A': {pattern: /[a-zA-Z0-9]/},
            'S': {pattern: /[a-zA-Z]/}
        }
    };

    $.jMaskGlobals = $.jMaskGlobals || {};
    globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

    // looking for inputs with data-mask attribute
    if (globals.dataMask) {
        $.applyDataMask();
    }

    setInterval(function() {
        if ($.jMaskGlobals.watchDataMask) {
            $.applyDataMask();
        }
    }, globals.watchInterval);
}));

/*!
 * jQuery Mobile Events
 * By: Sam Delgado (http://offcolorapp.com), Ben Major (http://www.ben-major.co.uk), and hachigoro (https://github.com/hachigoro)
 *
 * Copyright 2011, Ben Major - Copyright 2015, Sam Delgado
 * Licensed under the MIT License:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

var $ = window.$ || global.$ || require('jquery');

$.attrFn = $.attrFn || {};

// navigator.userAgent.toLowerCase() isn't reliable for Chrome installs
// on mobile devices. As such, we will create a boolean isChromeDesktop
// The reason that we need to do this is because Chrome annoyingly
// purports support for touch events even if the underlying hardware
// does not!
var agent = navigator.userAgent.toLowerCase();

var isChromeDesktop = (agent.indexOf('chrome') > -1 && ((agent.indexOf('windows') > -1) || (agent.indexOf('macintosh') > -1) || (agent.indexOf('linux') > -1)) && agent.indexOf('mobile') < 0 && agent.indexOf('android') < 0);

var settings = {
  tap_pixel_range: 5,
  swipe_h_threshold: 50,
  swipe_v_threshold: 50,
  taphold_threshold: 750,

  touch_capable: (window.navigator.msPointerEnabled) ? false : ('ontouchstart' in window && !isChromeDesktop),
  orientation_support: ('orientation' in window && 'onorientationchange' in window),

  startevent: (window.navigator.msPointerEnabled) ? 'MSPointerDown' : (('ontouchstart' in window && !isChromeDesktop) ? 'touchstart' : 'mousedown'),
  endevent: (window.navigator.msPointerEnabled) ? 'MSPointerUp'   : (('ontouchstart' in window && !isChromeDesktop) ? 'touchend' : 'mouseup'),
  moveevent: (window.navigator.msPointerEnabled) ? 'MSPointerMove' : (('ontouchstart' in window && !isChromeDesktop) ? 'touchmove' : 'mousemove'),
  tapevent: ('ontouchstart' in window && !isChromeDesktop) ? 'tap' : 'click',
  scrollevent: ('ontouchstart' in window && !isChromeDesktop) ? 'touchmove' : 'scroll',

  hold_timer: null,
  tap_timer: null
};

// Convenience functions:
$.isTouchCapable = function() { return settings.touch_capable; };
$.getStartEvent = function() { return settings.startevent; };
$.getEndEvent = function() { return settings.endevent; };
$.getMoveEvent = function() { return settings.moveevent; };
$.getTapEvent = function() { return settings.tapevent; };
$.getScrollEvent = function() { return settings.scrollevent; };

// Add Event shortcuts:
$.each(['tapstart', 'tapend', 'tapmove', 'tap', 'tap2', 'tap3', 'tap4', 'hold', 'swipe', 'swipeup', 'swiperight', 'swipedown', 'swipeleft', 'swipeend', 'scrollstart', 'scrollend', 'orientationchange'], function (i, name) {

  $.fn[name] = function (fn) {
    return fn ? this.on(name, fn) : this.trigger(name);
  };

  $.attrFn[name] = true;

});

// tapstart Event:
$.event.special.tapstart = {

  setup: function () {

    var thisObject = this;
    var $this = $(thisObject);

    $this.on(settings.startevent, function tapStartFunc(e) {

      $this.data('callee', tapStartFunc);

      if (e.which && e.which !== 1) {
        return false;
      }

      var origEvent = e.originalEvent;
      var touchData = {
        'position': {
          'x': ((settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX),
          'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
        },
        'offset': {
          'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
          'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
        },
        'time': Date.now(),
        'target': e.target
      };

      triggerCustomEvent(thisObject, 'tapstart', e, touchData);
      return true;

    });

  },

  remove: function () {
    $(this).off(settings.startevent, $(this).data.callee);
  }

};

// tapmove Event:
$.event.special.tapmove = {

	setup: function() {

    var thisObject = this;
    var $this = $(thisObject);

    $this.on(settings.moveevent, function tapMoveFunc(e) {

      $this.data('callee', tapMoveFunc);

      var origEvent = e.originalEvent;
      var touchData = {
        'position': {
          'x': ((settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX),
          'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
        },
        'offset': {
          'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
          'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
        },
        'time': Date.now(),
        'target': e.target
      };

      triggerCustomEvent(thisObject, 'tapmove', e, touchData);
      return true;

    });

  },

  remove: function() {
    $(this).off(settings.moveevent, $(this).data.callee);
  }

};

// tapend Event:
$.event.special.tapend = {

  setup: function () {

    var thisObject = this;
    var $this = $(thisObject);

    $this.on(settings.endevent, function tapEndFunc(e) {

      // Touch event data:
      $this.data('callee', tapEndFunc);

      var origEvent = e.originalEvent;
      var touchData = {
        'position': {
          'x': (settings.touch_capable) ? origEvent.changedTouches[0].screenX : e.screenX,
          'y': (settings.touch_capable) ? origEvent.changedTouches[0].screenY : e.screenY
        },
        'offset': {
          'x': (settings.touch_capable) ? origEvent.changedTouches[0].pageX - origEvent.changedTouches[0].target.offsetLeft : e.offsetX,
          'y': (settings.touch_capable) ? origEvent.changedTouches[0].pageY - origEvent.changedTouches[0].target.offsetTop : e.offsetY
        },
        'time': Date.now(),
        'target': e.target
      };

      triggerCustomEvent(thisObject, 'tapend', e, touchData);
      return true;

    });

  },

  remove: function () {
    $(this).off(settings.endevent, $(this).data.callee);
  }

};

// hold Event:
$.event.special.hold = {

  setup: function () {

    var thisObject = this;
    var $this = $(thisObject);
    var origTarget;
    var start_pos = {x: 0, y: 0};
    var end_x = 0;
    var end_y = 0;

    $this.on(settings.startevent, function tapHoldFunc1(e) {

      if (e.which && e.which !== 1) {
        return false;
      } else {

        $this.data('tapheld', false);
        origTarget = e.target;

        var origEvent = e.originalEvent;
        var start_time = Date.now();

        var startPosition = {
          'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
          'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
        };

        var startOffset = {
          'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
          'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
        };

        start_pos.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
        start_pos.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;

        end_x = start_pos.x;
        end_y = start_pos.y;

        settings.hold_timer = window.setTimeout(function () {

          var diff_x = (start_pos.x - end_x);
          var diff_y = (start_pos.y - end_y);

          if (e.target == origTarget && ((start_pos.x == end_x && start_pos.y == end_y) || (diff_x >= -(settings.tap_pixel_range) && diff_x <= settings.tap_pixel_range && diff_y >= -(settings.tap_pixel_range) && diff_y <= settings.tap_pixel_range))) {

            $this.data('tapheld', true);

            var end_time = Date.now();

            var endPosition = {
              'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
              'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
            };

            var endOffset = {
              'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
              'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
            };

            var duration = end_time - start_time;

            // Build the touch data:
            var touchData = {
              'startTime': start_time,
              'endTime': end_time,
              'startPosition': startPosition,
              'startOffset': startOffset,
              'endPosition': endPosition,
              'endOffset': endOffset,
              'duration': duration,
              'target': e.target
            };

            $this.data('callee1', tapHoldFunc1);
            triggerCustomEvent(thisObject, 'hold', e, touchData);

          }

        }, settings.taphold_threshold);

        return true;

      }

    })

    .on(settings.endevent, function tapHoldFunc2() {

      $this.data('callee2', tapHoldFunc2);
      $this.data('tapheld', false);
      window.clearTimeout(settings.hold_timer);

    })

    .on(settings.moveevent, function tapHoldFunc3(e) {

      $this.data('callee3', tapHoldFunc3);

      end_x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
      end_y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;

    });

  },

  remove: function () {
    $(this).off(settings.startevent, $(this).data.callee1).off(settings.endevent, $(this).data.callee2).off(settings.moveevent, $(this).data.callee3);
  }

};

// tap Event:
$.event.special.tap = {

  setup: function () {

    var thisObject = this;
    var $this = $(thisObject);
    var started = false;
    var origTarget = null;
    var start_time;
    var start_pos = {x: 0, y: 0};
    var touches;

    $this.on(settings.startevent, function tapFunc1(e) {

      $this.data('callee1', tapFunc1);

      if (e.which && e.which !== 1) {
        return false;
      } else {

        started = true;
        start_pos.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
        start_pos.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
        start_time = Date.now();
        origTarget = e.target;

        touches = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches : [ e ];
        return true;

      }

    })

    .on(settings.endevent, function tapFunc2(e) {

      $this.data('callee2', tapFunc2);

      // Only trigger if they've started, and the target matches:
      var end_x = (e.originalEvent.targetTouches) ? e.originalEvent.changedTouches[0].pageX : e.pageX;
      var end_y = (e.originalEvent.targetTouches) ? e.originalEvent.changedTouches[0].pageY : e.pageY;
      var diff_x = (start_pos.x - end_x);
      var diff_y = (start_pos.y - end_y);
      var eventName;

      if (origTarget == e.target && started && ((Date.now() - start_time) < settings.taphold_threshold) && ((start_pos.x == end_x && start_pos.y == end_y) || (diff_x >= -(settings.tap_pixel_range) && diff_x <= settings.tap_pixel_range && diff_y >= -(settings.tap_pixel_range) && diff_y <= settings.tap_pixel_range))) {

        var origEvent = e.originalEvent;
        var touchData = [];

        for (var i=0; i<touches.length; i++) {

          var touch = {
            'position': {
              'x': (settings.touch_capable) ? origEvent.changedTouches[i].screenX : e.screenX,
              'y': (settings.touch_capable) ? origEvent.changedTouches[i].screenY : e.screenY
            },
            'offset': {
              'x': (settings.touch_capable) ? origEvent.changedTouches[i].pageX - origEvent.changedTouches[i].target.offsetLeft : e.offsetX,
              'y': (settings.touch_capable) ? origEvent.changedTouches[i].pageY - origEvent.changedTouches[i].target.offsetTop : e.offsetY
            },
            'time': Date.now(),
            'target': e.target
          };

          touchData.push(touch);

        }

        switch (touches.length) {
          case 1:
            eventName = 'tap';
            break;

          case 2:
            eventName = 'tap2';
            break;

          case 3:
            eventName = 'tap3';
            break;

          case 4:
            eventName = 'tap4';
            break;
        }

        triggerCustomEvent(thisObject, eventName, e, touchData);

      }

    });

  },

  remove: function () {
    $(this).off(settings.startevent, $(this).data.callee1).off(settings.endevent, $(this).data.callee2);
  }

};

// swipe Event (also handles swipeup, swiperight, swipedown and swipeleft):
$.event.special.swipe = {

  setup: function () {

    var thisObject = this;
    var $this = $(thisObject);
    var started = false;
    var hasSwiped = false;
    var originalCoord = {x: 0, y: 0};
    var finalCoord = {x: 0, y: 0};
    var startEvnt;

    // Screen touched, store the original coordinate

    function touchStart(e) {

      $this = $(e.currentTarget);
      $this.data('callee1', touchStart);
      originalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
      originalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
      finalCoord.x = originalCoord.x;
      finalCoord.y = originalCoord.y;
      started = true;
      var origEvent = e.originalEvent;

      // Read event data into our startEvt:
      startEvnt = {
          'position': {
              'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
              'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
          },
          'offset': {
              'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
              'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
          },
          'time': Date.now(),
          'target': e.target
      };

    }

    // Store coordinates as finger is swiping

    function touchMove(e) {

      $this = $(e.currentTarget);
      $this.data('callee2', touchMove);
      finalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
      finalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;

      var swipedir;

      // We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
      var ele_x_threshold = ($this.parent().data('xthreshold')) ? $this.parent().data('xthreshold') : $this.data('xthreshold'),
          ele_y_threshold = ($this.parent().data('ythreshold')) ? $this.parent().data('ythreshold') : $this.data('ythreshold'),
          h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : settings.swipe_h_threshold,
          v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : settings.swipe_v_threshold;

      if (originalCoord.y > finalCoord.y && (originalCoord.y - finalCoord.y > v_threshold)) {
          swipedir = 'swipeup';
      }
      if (originalCoord.x < finalCoord.x && (finalCoord.x - originalCoord.x > h_threshold)) {
          swipedir = 'swiperight';
      }
      if (originalCoord.y < finalCoord.y && (finalCoord.y - originalCoord.y > v_threshold)) {
          swipedir = 'swipedown';
      }
      if (originalCoord.x > finalCoord.x && (originalCoord.x - finalCoord.x > h_threshold)) {
          swipedir = 'swipeleft';
      }
      if (swipedir != undefined && started) {
          originalCoord.x = 0;
          originalCoord.y = 0;
          finalCoord.x = 0;
          finalCoord.y = 0;
          started = false;

          // Read event data into our endEvnt:
          var origEvent = e.originalEvent;
          var endEvnt = {
              'position': {
                  'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                  'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
              },
              'offset': {
                  'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
                  'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
              },
              'time': Date.now(),
              'target': e.target
          };

          // Calculate the swipe amount (normalized):
          var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
              yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);

          var touchData = {
              'startEvnt': startEvnt,
              'endEvnt': endEvnt,
              'direction': swipedir.replace('swipe', ''),
              'xAmount': xAmount,
              'yAmount': yAmount,
              'duration': endEvnt.time - startEvnt.time
          };
          hasSwiped = true;
          $this.trigger('swipe', touchData).trigger(swipedir, touchData);
      }

    }

    function touchEnd(e) {

      $this = $(e.currentTarget);
      var swipedir = "";
      $this.data('callee3', touchEnd);

      if (hasSwiped) {

        // We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
        var ele_x_threshold = $this.data('xthreshold'),
            ele_y_threshold = $this.data('ythreshold'),
            h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : settings.swipe_h_threshold,
            v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : settings.swipe_v_threshold;

        var origEvent = e.originalEvent;
        var endEvnt = {
            'position': {
                'x': (settings.touch_capable) ? origEvent.changedTouches[0].screenX : e.screenX,
                'y': (settings.touch_capable) ? origEvent.changedTouches[0].screenY : e.screenY
            },
            'offset': {
                'x': (settings.touch_capable) ? origEvent.changedTouches[0].pageX - origEvent.changedTouches[0].target.offsetLeft : e.offsetX,
                'y': (settings.touch_capable) ? origEvent.changedTouches[0].pageY - origEvent.changedTouches[0].target.offsetTop : e.offsetY
            },
            'time': Date.now(),
            'target': e.target
        };

        // Read event data into our endEvnt:
        if (startEvnt.position.y > endEvnt.position.y && (startEvnt.position.y - endEvnt.position.y > v_threshold)) {
            swipedir = 'swipeup';
        }
        if (startEvnt.position.x < endEvnt.position.x && (endEvnt.position.x - startEvnt.position.x > h_threshold)) {
            swipedir = 'swiperight';
        }
        if (startEvnt.position.y < endEvnt.position.y && (endEvnt.position.y - startEvnt.position.y > v_threshold)) {
            swipedir = 'swipedown';
        }
        if (startEvnt.position.x > endEvnt.position.x && (startEvnt.position.x - endEvnt.position.x > h_threshold)) {
            swipedir = 'swipeleft';
        }

        // Calculate the swipe amount (normalized):
        var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
            yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);

        var touchData = {
            'startEvnt': startEvnt,
            'endEvnt': endEvnt,
            'direction': swipedir.replace('swipe', ''),
            'xAmount': xAmount,
            'yAmount': yAmount,
            'duration': endEvnt.time - startEvnt.time
        };
        $this.trigger('swipeend', touchData);

      }

      started = false;
      hasSwiped = false;

    }

    $this.on(settings.startevent, touchStart);
    $this.on(settings.moveevent, touchMove);
    $this.on(settings.endevent, touchEnd);

  },

  remove: function () {
    $(this).off(settings.startevent, $(this).data.callee1).off(settings.moveevent, $(this).data.callee2).off(settings.endevent, $(this).data.callee3);
  }

};

// scrollstart Event (also handles scrollend):
$.event.special.scrollstart = {

  setup: function () {

    var thisObject = this;
    var $this = $(thisObject);
    var scrolling;
    var timer;

    function trigger(event, state) {
      scrolling = state;
      triggerCustomEvent(thisObject, scrolling ? 'scrollstart' : 'scrollend', event);
    }

    // iPhone triggers scroll after a small delay; use touchmove instead
    $this.on(settings.scrollevent, function scrollFunc(event) {

      $this.data('callee', scrollFunc);

      if (!scrolling) {
        trigger(event, true);
      }

      clearTimeout(timer);

      timer = setTimeout(function () {
        trigger(event, false);
      }, 50);

    });

  },

  remove: function () {
    $(this).off(settings.scrollevent, $(this).data.callee);
  }

};

// This is the orientation change (largely borrowed from jQuery Mobile):
var win = $(window);
var special_event;
var get_orientation;
var last_orientation;
var initial_orientation_is_landscape;
var initial_orientation_is_default;
var portrait_map = {
  '0': true,
  '180': true
};

if (settings.orientation_support) {

  var ww = window.innerWidth || win.width();
  var wh = window.innerHeight || win.height();
  var landscape_threshold = 50;

  initial_orientation_is_landscape = ww > wh && (ww - wh) > landscape_threshold;
  initial_orientation_is_default = portrait_map[window.orientation];

  if ((initial_orientation_is_landscape && initial_orientation_is_default) || (!initial_orientation_is_landscape && !initial_orientation_is_default)) {

    portrait_map = {
      '-90': true,
      '90': true
    };

  }

}

$.event.special.orientationchange = special_event = {

  setup: function () {

    // If the event is supported natively, return false so that jQuery
    // will on to the event using DOM methods.
    if (settings.orientation_support) {
      return false;
    }

    // Get the current orientation to avoid initial double-triggering.
    last_orientation = get_orientation();

    win.on('throttledresize', handler);
    return true;

  },

  teardown: function () {

    if (settings.orientation_support) {
      return false;
    }

    win.off('throttledresize', handler);
    return true;

  },

  add: function (handleObj) {

    // Save a reference to the bound event handler.
    var old_handler = handleObj.handler;

    handleObj.handler = function (event) {
      event.orientation = get_orientation();
      return old_handler.apply(this, arguments);
    };

  }

};

// If the event is not supported natively, this handler will be bound to
// the window resize event to simulate the orientationchange event.

function handler() {

  // Get the current orientation.
  var orientation = get_orientation();

  if (orientation !== last_orientation) {
    // The orientation has changed, so trigger the orientationchange event.
    last_orientation = orientation;
    win.trigger("orientationchange");
  }

}

$.event.special.orientationchange.orientation = get_orientation = function () {

  var isPortrait = true;
  var elem = document.documentElement;

  if (settings.orientation_support) {
    isPortrait = portrait_map[window.orientation];
  } else {
    isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
  }

  return isPortrait ? 'portrait' : 'landscape';

};

// throttle Handler:
$.event.special.throttledresize = {

  setup: function () {
    $(this).on('resize', throttle_handler);
  },

  teardown: function () {
    $(this).off('resize', throttle_handler);
  }

};

var throttle = 250;
var lastCall = 0;
var heldCall;
var curr;
var diff;

var throttle_handler = function () {

  curr = Date.now();
  diff = curr - lastCall;

  if (diff >= throttle) {

    lastCall = curr;
    $(this).trigger('throttledresize');

  } else {

    if (heldCall) {
      window.clearTimeout(heldCall);
    }

    // Promise a held call will still execute
    heldCall = window.setTimeout(handler, throttle - diff);

  }

};

// Trigger a custom event:
function triggerCustomEvent(obj, eventType, event, touchData) {

  var originalType = event.type;
  event.type = eventType;

  $.event.dispatch.call(obj, event, touchData);
  event.type = originalType;

}

// Correctly on anything we've overloaded:
$.each({

  scrollend: 'scrollstart',
  swipeup: 'swipe',
  swiperight: 'swipe',
  swipedown: 'swipe',
  swipeleft: 'swipe',
  swipeend: 'swipe',
  tap2: 'tap'

}, function (e, srcE) {

  $.event.special[e] = {

    setup: function () {
      $(this).on(srcE, $.noop);
    }

  };

});

/*! jQuery Mockjax
 * A Plugin providing simple and flexible mocking of ajax requests and responses
 * 
 * Version: 2.2.0
 * Home: https://github.com/jakerella/jquery-mockjax
 * Copyright (c) 2016 Jordan Kasper, formerly appendTo;
 * NOTE: This repository was taken over by Jordan Kasper (@jakerella) October, 2014
 * 
 * Dual licensed under the MIT or GPL licenses.
 * http://opensource.org/licenses/MIT OR http://www.gnu.org/licenses/gpl-2.0.html
 */
!function(a,b){"use strict";if("function"==typeof define&&define.amd&&define.amd.jQuery)define(["jquery"],function(c){return b(c,a)});else{if("object"!=typeof exports)return b(a.jQuery||a.$,a);module.exports=b}}(this,function(a,b){"use strict";function c(c){void 0===b.DOMParser&&b.ActiveXObject&&(b.DOMParser=function(){},DOMParser.prototype.parseFromString=function(a){var b=new ActiveXObject("Microsoft.XMLDOM");return b.async="false",b.loadXML(a),b});try{var d=(new DOMParser).parseFromString(c,"text/xml");if(!a.isXMLDoc(d))throw new Error("Unable to parse XML");var e=a("parsererror",d);if(1===e.length)throw new Error("Error: "+a(d).text());return d}catch(f){var g=void 0===f.name?f:f.name+": "+f.message;return void a(document).trigger("xmlParseError",[g])}}function d(b,c){C.debug(b,["Checking mock data against request data",b,c]);var f=!0;if(a.isFunction(b))return!!b(c);if("string"==typeof c){if(a.isFunction(b.test))return b.test(c);if("object"!=typeof b)return b===c;c=e(c)}return a.each(b,function(e){return void 0===c[e]?f=!1:void("object"==typeof c[e]&&null!==c[e]?(f&&a.isArray(c[e])&&(f=a.isArray(b[e])&&c[e].length===b[e].length),f=f&&d(b[e],c[e])):f=b[e]&&a.isFunction(b[e].test)?f&&b[e].test(c[e]):f&&b[e]===c[e])}),f}function e(a){var b,c,d,e,f={},g=String(a).split(/&/);for(b=0,c=g.length;c>b;++b){d=g[b];try{d=decodeURIComponent(d.replace(/\+/g," ")),d=d.split(/=/)}catch(h){continue}f[d[0]]?(f[d[0]].splice||(e=f[d[0]],f[d[0]]=[],f[d[0]].push(e)),f[d[0]].push(d[1])):f[d[0]]=d[1]}return C.debug(null,["Getting query params from string",a,f]),f}function f(b,c){return b[c]===a.mockjaxSettings[c]}function g(b,c){if(a.isFunction(b))return b(c);if(a.isFunction(b.url.test)){if(!b.url.test(c.url))return null}else{var e=b.namespace||a.mockjaxSettings.namespace;if(e){var f=[e,b.url].join("/");f=f.replace(/(\/+)/g,"/"),b.url=f}var g=b.url.indexOf("*");if(b.url!==c.url&&-1===g||!new RegExp(b.url.replace(/[-[\]{}()+?.,\\^$|#\s]/g,"\\$&").replace(/\*/g,".+")).test(c.url))return null}if(b.requestHeaders){if(void 0===c.headers)return null;var h=!1;if(a.each(b.requestHeaders,function(a,b){var d=c.headers[a];return d!==b?(h=!0,!1):void 0}),h)return null}return!b.data||c.data&&d(b.data,c.data)?b&&b.type&&b.type.toLowerCase()!==c.type.toLowerCase()?null:b:null}function h(a){return"number"==typeof a&&a>=0}function i(b){if(a.isArray(b)&&2===b.length){var c=b[0],d=b[1];if(h(c)&&h(d))return Math.floor(Math.random()*(d-c))+c}else if(h(b))return b;return B}function j(b,d,e){C.debug(b,["Sending fake XHR request",b,d,e]);var g=function(f){return function(){return function(){this.status=b.status,this.statusText=b.statusText,this.readyState=1;var g=function(){this.readyState=4;var e;"json"===d.dataType&&"object"==typeof b.responseText?this.responseText=JSON.stringify(b.responseText):"xml"===d.dataType?"string"==typeof b.responseXML?(this.responseXML=c(b.responseXML),this.responseText=b.responseXML):this.responseXML=b.responseXML:"object"==typeof b.responseText&&null!==b.responseText?(b.contentType="application/json",this.responseText=JSON.stringify(b.responseText)):this.responseText=b.responseText,"number"!=typeof b.status&&"string"!=typeof b.status||(this.status=b.status),"string"==typeof b.statusText&&(this.statusText=b.statusText),e=this.onload||this.onreadystatechange,a.isFunction(e)?(b.isTimeout&&(this.status=-1),e.call(this,b.isTimeout?"timeout":void 0)):b.isTimeout&&(this.status=-1)};if(a.isFunction(b.response)){if(2===b.response.length)return void b.response(e,function(){g.call(f)});b.response(e)}g.call(f)}.apply(f)}}(this);b.proxy?(C.info(b,["Retrieving proxy file: "+b.proxy,b]),v({global:!1,url:b.proxy,type:b.proxyType,data:b.data,async:d.async,dataType:"script"===d.dataType?"text/plain":d.dataType,complete:function(a){b.responseXML=b.responseText=a.responseText,f(b,"status")&&(b.status=a.status),f(b,"statusText")&&(b.statusText=a.statusText),d.async===!1?g():this.responseTimer=setTimeout(g,i(b.responseTime))}})):d.async===!1?g():this.responseTimer=setTimeout(g,i(b.responseTime))}function k(b,c,d,e){return C.debug(b,["Creating new mock XHR object",b,c,d,e]),b=a.extend(!0,{},a.mockjaxSettings,b),"undefined"==typeof b.headers&&(b.headers={}),"undefined"==typeof c.headers&&(c.headers={}),b.contentType&&(b.headers["content-type"]=b.contentType),{status:b.status,statusText:b.statusText,readyState:1,open:function(){},send:function(){e.fired=!0,j.call(this,b,c,d)},abort:function(){clearTimeout(this.responseTimer)},setRequestHeader:function(a,b){c.headers[a]=b},getResponseHeader:function(a){return b.headers&&b.headers[a]?b.headers[a]:"last-modified"===a.toLowerCase()?b.lastModified||(new Date).toString():"etag"===a.toLowerCase()?b.etag||"":"content-type"===a.toLowerCase()?b.contentType||"text/plain":void 0},getAllResponseHeaders:function(){var c="";return b.contentType&&(b.headers["Content-Type"]=b.contentType),a.each(b.headers,function(a,b){c+=a+": "+b+"\n"}),c}}}function l(a,b,c){if(m(a),a.dataType="json",a.data&&z.test(a.data)||z.test(a.url)){p(a,b,c);var d=/^(\w+:)?\/\/([^\/?#]+)/,e=d.exec(a.url),f=e&&(e[1]&&e[1]!==location.protocol||e[2]!==location.host);if(a.dataType="script","GET"===a.type.toUpperCase()&&f){var g=n(a,b,c);return g?g:!0}}return null}function m(a){"GET"===a.type.toUpperCase()?z.test(a.url)||(a.url+=(/\?/.test(a.url)?"&":"?")+(a.jsonp||"callback")+"=?"):a.data&&z.test(a.data)||(a.data=(a.data?a.data+"&":"")+(a.jsonp||"callback")+"=?")}function n(b,c,d){C.debug(c,["Performing JSONP request",c,b,d]);var e=d&&d.context||b,f=a.Deferred?new a.Deferred:null;if(c.response&&a.isFunction(c.response))c.response(d);else if("object"==typeof c.responseText)a.globalEval("("+JSON.stringify(c.responseText)+")");else{if(c.proxy)return C.info(c,["Performing JSONP proxy request: "+c.proxy,c]),v({global:!1,url:c.proxy,type:c.proxyType,data:c.data,dataType:"script"===b.dataType?"text/plain":b.dataType,complete:function(d){a.globalEval("("+d.responseText+")"),o(b,c,e,f)}}),f;a.globalEval("("+("string"==typeof c.responseText?'"'+c.responseText+'"':c.responseText)+")")}return o(b,c,e,f),f}function o(b,c,d,e){var f;setTimeout(function(){if(q(b,d,c),r(b,d),e){try{f=a.parseJSON(c.responseText)}catch(g){}e.resolveWith(d,[f||c.responseText]),C.log(c,["JSONP mock call complete",c,e])}},i(c.responseTime))}function p(a,c,d){var e=d&&d.context||a,f="string"==typeof a.jsonpCallback&&a.jsonpCallback||"jsonp"+A++;a.data&&(a.data=(a.data+"").replace(z,"="+f+"$1")),a.url=a.url.replace(z,"="+f+"$1"),b[f]=b[f]||function(){q(a,e,c),r(a,e),b[f]=void 0;try{delete b[f]}catch(d){}},a.jsonpCallback=f}function q(b,c,d){b.success&&b.success.call(c,d.responseText||"","success",{}),b.global&&(b.context?a(b.context):a.event).trigger("ajaxSuccess",[{},b])}function r(b,c){b.complete&&b.complete.call(c,{statusText:"success",status:200},"success"),b.global&&(b.context?a(b.context):a.event).trigger("ajaxComplete",[{},b]),b.global&&!--a.active&&a.event.trigger("ajaxStop")}function s(b,c){var d,e,f,h;C.debug(null,["Ajax call intercepted",b,c]),"object"==typeof b?(c=b,b=void 0):(c=c||{},c.url=b||c.url),e=a.ajaxSetup({},c),e.type=e.method=e.method||e.type,h=function(b,d){var e=c[b.toLowerCase()];return function(){a.isFunction(e)&&e.apply(this,[].slice.call(arguments)),d["onAfter"+b]()}};for(var i=0;i<w.length;i++)if(w[i]){if(f=g(w[i],e))return a.mockjaxSettings.retainAjaxCalls&&x.push(e),C.info(f,["MOCK "+e.type.toUpperCase()+": "+e.url,a.ajaxSetup({},e)]),e.dataType&&"JSONP"===e.dataType.toUpperCase()&&(d=l(e,f,c))?d:(c.crossDomain=!1,f.cache=e.cache,f.timeout=e.timeout,f.global=e.global,f.isTimeout&&(f.responseTime>1?c.timeout=f.responseTime-1:(f.responseTime=2,c.timeout=1)),a.isFunction(f.onAfterSuccess)&&(c.success=h("Success",f)),a.isFunction(f.onAfterError)&&(c.error=h("Error",f)),a.isFunction(f.onAfterComplete)&&(c.complete=h("Complete",f)),t(f,c),function(b,c,e,f){d=v.call(a,a.extend(!0,{},e,{xhr:function(){return k(b,c,e,f)}}))}(f,e,c,w[i]),d);C.debug(w[i],["Mock does not match request",b,e])}if(C.log(null,["No mock matched to request",b,c]),a.mockjaxSettings.retainAjaxCalls&&y.push(c),a.mockjaxSettings.throwUnmocked===!0)throw new Error("AJAX not mocked: "+c.url);return v.apply(a,[c])}function t(a,b){if(a.url instanceof RegExp&&a.hasOwnProperty("urlParams")){var c=a.url.exec(b.url);if(1!==c.length){c.shift();var d=0,e=c.length,f=a.urlParams.length,g=Math.min(e,f),h={};for(d;g>d;d++){var i=a.urlParams[d];h[i]=c[d]}b.urlParams=h}}}function u(a){var b,c,d,e=[],f=a instanceof RegExp?function(b){return a.test(b)}:function(b){return a===b};for(b=0,c=w.length;c>b;b++)d=w[b],f(d.url)?C.log(d,["Clearing mock: "+(d&&d.url),d]):e.push(d);return e}var v=a.ajax,w=[],x=[],y=[],z=/=\?(&|$)/,A=(new Date).getTime(),B=500;a.extend({ajax:s});var C={_log:function(b,c,d){var e=a.mockjaxSettings.logging;return b&&"undefined"!=typeof b.logging&&(e=b.logging),d=0===d?d:d||D.LOG,c=c.splice?c:[c],e===!1||d>e?void 0:a.mockjaxSettings.log?a.mockjaxSettings.log(b,c[1]||c[0]):a.mockjaxSettings.logger&&a.mockjaxSettings.logger[a.mockjaxSettings.logLevelMethods[d]]?a.mockjaxSettings.logger[a.mockjaxSettings.logLevelMethods[d]].apply(a.mockjaxSettings.logger,c):void 0},debug:function(a,b){return C._log(a,b,D.DEBUG)},log:function(a,b){return C._log(a,b,D.LOG)},info:function(a,b){return C._log(a,b,D.INFO)},warn:function(a,b){return C._log(a,b,D.WARN)},error:function(a,b){return C._log(a,b,D.ERROR)}},D={DEBUG:4,LOG:3,INFO:2,WARN:1,ERROR:0};return a.mockjaxSettings={log:null,logger:b.console,logging:2,logLevelMethods:["error","warn","info","log","debug"],namespace:null,status:200,statusText:"OK",responseTime:B,isTimeout:!1,throwUnmocked:!1,retainAjaxCalls:!0,contentType:"text/plain",response:"",responseText:"",responseXML:"",proxy:"",proxyType:"GET",lastModified:null,etag:"",headers:{etag:"IJF@H#@923uf8023hFO@I#H#","content-type":"text/plain"}},a.mockjax=function(b){if(a.isArray(b))return a.map(b,function(b){return a.mockjax(b)});var c=w.length;return w[c]=b,C.log(b,["Created new mock handler",b]),c},a.mockjax._logger=C,a.mockjax.clear=function(a){"string"==typeof a||a instanceof RegExp?w=u(a):a||0===a?(C.log(w[a],["Clearing mock: "+(w[a]&&w[a].url),w[a]]),w[a]=null):(C.log(null,"Clearing all mocks"),w=[]),x=[],y=[]},a.mockjax.clearRetainedAjaxCalls=function(){x=[],y=[],C.debug(null,"Cleared retained ajax calls")},a.mockjax.handler=function(a){return 1===arguments.length?w[a]:void 0},a.mockjax.mockedAjaxCalls=function(){return x},a.mockjax.unfiredHandlers=function(){for(var a=[],b=0,c=w.length;c>b;b++){var d=w[b];null===d||d.fired||a.push(d)}return a},a.mockjax.unmockedAjaxCalls=function(){return y},a.mockjax});