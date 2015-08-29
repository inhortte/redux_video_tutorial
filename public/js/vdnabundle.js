(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction (sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' &&
            Object.prototype.toString.call(sth) === '[object Function]';
    }


    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear, janX = createUTCDate(year, 0, 1 + week1Jan), d = janX.getUTCDay(), dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toObject     = toObject;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],2:[function(require,module,exports){
// -----------------------------------
// { categoryName:
//   { interestName:
//     { source: 'facebook',
//       clicks: 5,
//       added: Date.now() },
//     ...
// -----------------------------------

module.exports = {
  staticInterests: {
    music:              { source: 'ticketpro', clicks: 31, added: Date.now(), selected: true,
                          related: 'rock music,jazz,concerts,opera' },
    "french actors":    { source: 'ticketpro', clicks: 37, added: Date.now(), selected: false,
                          related: 'drama,film' },
    actors:             { source: 'ticketpro', clicks: 35, added: Date.now(), selected: false,
                          related: 'czech film, film' },
    spirituality:       { source: 'ticketpro', clicks: 18, added: Date.now(), selected: false,
                          related: 'literature,music' },
    "czech film":       { source: 'ticketpro', clicks: 54, added: Date.now(), selected: false,
                          related: 'film,actors' },
    "rock music":       { source: 'ticketpro', clicks: 12, added: Date.now(), selected: false,
                          related: 'music' },
    "world music":      { source: 'ticketpro', clicks: 10, added: Date.now(), selected: false,
                          related: 'music' },
    jazz:               { source: 'ticketpro', clicks: 16, added: Date.now(), selected: true,
                          related: 'music' },
    technology:         { source: 'ticketpro', clicks: 19, added: Date.now(), selected: false,
                          related: 'health,science' },
    health:             { source: 'ticketpro', clicks: 20, added: Date.now(), selected: true,
                          related: 'science,dental' },
    dental:             { source: 'ticketpro', clicks: 21, added: Date.now(), selected: false,
                          related: 'health' },
    comics:             { source: 'ticketpro', clicks: 34, added: Date.now(), selected: false,
                          related: 'humor,literature' },
    humor:              { source: 'ticketpro', clicks: 10, added: Date.now(), selected: false,
                          related: 'actors,literature' },
    literature:         { source: 'ticketpro', clicks: 11, added: Date.now(), selected: false,
                          related: 'theater,comics' },
    science:            { source: 'ticketpro', clicks: 13, added: Date.now(), selected: false,
                          related: 'technology,health' },
    drama:              { source: 'ticketpro', clicks: 19, added: Date.now(), selected: false,
                          related: 'theater,film,literature' },
    theater:            { source: 'ticketpro', clicks: 20, added: Date.now(), selected: false,
                          related: 'drama,literature,opera' },
    film:               { source: 'ticketpro', clicks: 21, added: Date.now(), selected: false,
                          related: 'drama,literature,comics' },
    concerts:           { source: 'ticketpro', clicks: 30, added: Date.now(), selected: false,
                          related: 'music,theater' },
    "contemporary art": { source: 'ticketpro', clicks: 18, added: Date.now(), selected: true,
                          related: 'literature,film,theater' },
    opera:              { source: 'ticketpro', clicks: 25, added: Date.now(), selected: false,
                          related: 'music,theater' },
    fitness:            { source: 'ticketpro', clicks: 16, added: Date.now(), selected: false,
                          related: 'health,science' }
  },

  capitalize: function(s) {
    return(s[0].toUpperCase() + s.substr(1));
  },

  blinkNodes: function() {
    console.log('blinkNodes!!!!!!');
    var that = this;
    var selectedInterests = Object.keys(this.staticInterests).filter(function(interest) {
      return that.staticInterests[interest]['selected'];
    }).reduce(function(is, i) {
      is[i] = that.staticInterests[i];
      return is;
    }, {});
    var selectedInterestKeys = Object.keys(selectedInterests);
    console.log(JSON.stringify(selectedInterestKeys));

    $("*[vdnaclass]").each(function(index, el) {
      if($(el).attr('vdnaclass').split(/,/).reduce(function(showOrHide, keyword) {
        return showOrHide || (selectedInterestKeys.indexOf(keyword) > -1);
      }, false)) {
        // console.log('showing ' + $(el).attr('vdnaclass'));
        $(el).show();
      } else {
        // console.log('hiding ' + $(el).attr('vdnaclass'));
        $(el).hide();
      }
    });
  },

  /*
   addInterest: function(category, interest) {
     staticData[category][interest] = { category: category, source: 'vdna', clicks: 1, added: Date.now(), selected: true };
   },
   */

  addInterest: function(interest) {
    if(this.staticInterests[interest] !== undefined) {
      this.staticInterests[interest]['selected'] = true;
      this.blinkNodes();
      // React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
      return true;
    } else {
      return false;
    }
  },

  /*
   var addRelatedInterest = function(category, interest) {
     staticData[category][interest]['selected'] = true;
     React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
   },
   */

  addRelatedInterest: function(interest) {
    this.staticInterests[interest]['selected'] = true;
    this.blinkNodes();
    // React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
  },

  /*
   unLikeAnInterest: function(category, interest) {
     staticData[category][interest]['selected'] = false;
     React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
   },
   */

  unLikeAnInterest: function(interest) {
    this.staticInterests[interest]['selected'] = false;
    this.blinkNodes();
    // React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
  }
};

},{}],3:[function(require,module,exports){
module.exports = {
  facebook: [
    {
      cnet:        { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                     related: 'technology,helth,science' },
      "jazz dock": { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                     related: 'music,jazz,concerts' }
    },
    {
      "new scientist": { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                         related: 'science,literature' },
      "divadlo archa": { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                         related: 'music,theater,concerts' }
    },
    {
      hiking:    { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                   related: 'health,fitness' },
      recycling: { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                   related: 'technology' }
    }
  ]
};

},{}],4:[function(require,module,exports){
'use strict';

var Moment = require('moment');
var data = require('vdna/static_data');
var variableData = require('vdna/variable_data');
// var Autocomplete = require('react-autocomplete/lib/main.js');
// var Combobox = Autocomplete.Combobox;
// var ComboboxOption = Autocomplete.ComboboxOption;

// -------------------------------------------------
// Autocomplete code
// -------------------------------------------------

var Autocomplete = React.createClass({
  displayName: 'Autocomplete',

  componentDidMount: function componentDidMount() {
    this._setInputFromValue();
    var highlightedIndex;
    var that = this;
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 13:
          // enter.
          console.log('ENTER!');
          that.props.addLikeDone();
          break;
        case 9:
          // tab
          console.log('TAB!');
          that._setFromHighlighted();
          break;
        case 38:
          // up
          highlightedIndex = that._highlightedIndex();
          console.log('UP! ' + highlightedIndex);
          if (highlightedIndex > 0) {
            that.setState({ highlightedValue: that._currentMatches()[highlightedIndex - 1] });
          }
          break;
        case 40:
          // down
          highlightedIndex = that._highlightedIndex();
          console.log('DOWN! ' + highlightedIndex);
          if (highlightedIndex === -1) {
            that.setState({ highlightedValue: that._currentMatches()[0] });
          } else if (highlightedIndex < that._currentMatches().length - 1) {
            that.setState({ highlightedValue: that._currentMatches()[highlightedIndex + 1] });
          }
          break;
      }
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      defaultValue: 'apple',
      limitToList: true,
      maxItemsShown: 8,
      sourceUrl: null,
      defaultList: ['apple', 'banana', 'orange', 'grape', 'cherry'],
      alsoSearchValues: false,
      loadUrlOnce: true,
      selectAllTextOnClick: true,
      onNoMatch: function onNoMatch(state) {}
    };
  },
  getInitialState: function getInitialState() {
    return {
      list: this.props.defaultList,
      currentValue: this.props.defaultValue,
      highlightedValue: this.props.defaultValue,
      showEntries: false
    };
  },
  render: function render() {
    var entries = this.state.showEntries ? React.createElement(
      'ol',
      { style: { position: 'absolute', backgroundColor: 'white', color: 'black', listStyle: 'none', padding: 0, margin: 0 }, onMouseLeave: this._onEntryMouseOut },
      this._renderMatches()
    ) : '';
    return React.createElement(
      'div',
      null,
      React.createElement('input', { id: this.props.inputId, className: this.props.className, ref: 'autoInput', onChange: this._onChange, onFocus: this._onFocus, onBlur: this._onBlur, onClick: this._onInputClick }),
      entries
    );
  },
  _currentMatches: function _currentMatches() {
    var that = this;
    var cm = this.state.list.filter(function (entry) {
      return entry.indexOf(that._input()) > -1;
    });
    return cm;
  },
  _input: function _input() {
    if (!this.isMounted()) {
      return '';
    } else {
      return React.findDOMNode(this.refs.autoInput).value;
    }
  },
  _renderMatches: function _renderMatches() {
    var that = this;
    return this._currentMatches().slice(0, this.props.maxItemsShown).map(function (entry, index) {
      return React.createElement(AutocompleteEntry, { highlighted: entry === that.state.highlightedValue, key: entry, value: entry, onEntryClick: that._onEntryClick, onEntryMouseOver: that._onEntryMouseOver });
    });
  },
  _highlightedIndex: function _highlightedIndex() {
    var that = this;
    var foundIndex = -1;
    this._currentMatches().forEach(function (entry, index) {
      if (entry === that.state.highlightedValue) {
        foundIndex = index;
      }
    });
    return foundIndex;
  },
  _updateHighlightedValue: function _updateHighlightedValue() {
    var newValue;
    var highlightedIndex = this._highlightedIndex();
    if (highlightedIndex < 0) {
      newValue = this.state.list[0];
    } else {
      newValue = this.state.list[highlightedIndex];
    }
    this.setState({ highlightedValue: newValue });
  },
  _setInputFromValue: function _setInputFromValue() {
    React.findDOMNode(this.refs.autoInput).value = this.state.currentValue;
  },
  _setValueFromInput: function _setValueFromInput() {
    var inputText = React.findDOMNode(this.refs.autoInput).value;
    var foundEntries = this.state.list.filter(function (entry) {
      return entry.indexOf(inputText) > -1;
    });
    if (foundEntries.length > 0) {
      this.setState({
        currentValue: foundEntries[0],
        highlightedValue: foundEntries[0]
      });
    } else {
      this.props.onNoMatch(this.state);
      if (this.props.limitToList) {
        this.setState({
          currentValue: this.props.defaultValue,
          highlightedValue: this.props.defaultValue
        });
      }
    }
  },
  _setFromHighlighted: function _setFromHighlighted() {
    this.setState({
      currentValue: this.state.highlightedValue
    }, function () {
      this._setInputFromValue();
    });
  },
  _onChange: function _onChange() {
    this._setValueFromInput();
  },
  _onFocus: function _onFocus() {
    this.setState({ showEntries: true });
  },
  _onBlur: function _onBlur() {
    this._setFromHighlighted();
    this.setState({ showEntries: false });
  },
  _onEntryClick: function _onEntryClick(entry) {
    this.setState({
      currentValue: entry
    }, function () {
      this._setInputFromValue();
    });
  },
  _onEntryMouseOver: function _onEntryMouseOver(entry) {
    this.setState({ highlightedValue: entry });
  },
  _onEntryMouseOut: function _onEntryMouseOut(entry) {
    this.setState({ highlightedValue: this.currentValue });
  },
  _onInputClick: function _onInputClick() {
    React.findDOMNode(this.refs.autoInput).select();
  }
});

var AutocompleteEntry = React.createClass({
  displayName: 'AutocompleteEntry',

  getInitialState: function getInitialState() {
    return { hover: false };
  },
  _onClick: function _onClick() {
    this.props.onEntryClick(this.props.value);
  },
  _onMouseOver: function _onMouseOver() {
    this.props.onEntryMouseOver(this.props.value);
  },
  render: function render() {
    return React.createElement(
      'li',
      { style: { backgroundColor: this.props.highlighted ? 'hsl(90, 50%, 50%)' : '', zIndex: 9999, cursor: 'pointer' }, onMouseDown: this._onClick, onMouseOver: this._onMouseOver },
      this.props.value
    );
  }
});

// ---------------
// end Autocomplete
// ---------------

function reRender() {
  React.render(React.createElement(VdnaMenu, { tabList: tabList }), document.getElementById('vdnamenu'));
};

var tabList = [{ id: 1, href: 'profile', text: 'Edit My Profile', selected: true }, { id: 2, href: 'notifications', text: 'View Notifications', selected: false }, { id: 3, href: 'import', text: 'Import and Sync', selected: false }, { id: 4, href: 'settings', text: 'Change Settings', selected: false }, { id: 5, href: 'privacy', text: 'Privacy', selected: false }, { id: 6, href: 'about', text: 'About', selected: false }];

var VdnaMenu = React.createClass({
  displayName: 'VdnaMenu',

  getInitialState: function getInitialState() {
    return {
      tabList: this.props.tabList,
      currentTab: 1
    };
  },
  changeTab: function changeTab(tabId) {
    var newTabList = tabList.map(function (tab) {
      tab.selected = tab.id === tabId;
      return tab;
    });
    this.setState({
      tabList: newTabList,
      currentTab: tabId
    });
  },
  render: function render() {
    var tabContent;
    switch (this.state.currentTab) {
      case 1:
        tabContent = React.createElement(MyProfile, null);
        break;
      case 2:
        tabContent = React.createElement(Notifications, null);
        break;
      case 3:
        tabContent = React.createElement(Import, null);
        break;
      case 4:
        tabContent = React.createElement(Settings, null);
        break;
      case 5:
        tabContent = React.createElement(Privacy, null);
        break;
      case 6:
        tabContent = React.createElement(About, null);
        break;
      default:
        tabContent = React.createElement(MyProfile, null);
    }
    return React.createElement(
      'section',
      { className: 'vdna' },
      React.createElement(
        'div',
        { className: 'vdna-body' },
        React.createElement(
          'div',
          { className: 'container' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(Tabs, { tabList: this.state.tabList, changeTab: this.changeTab }),
            React.createElement(
              'div',
              { className: 'main-content col-xs-8 col-xs-offset-4 col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2' },
              React.createElement(
                'div',
                { className: 'tab-content' },
                tabContent
              )
            )
          )
        ),
        React.createElement(CloseVdna, null)
      )
    );
  }
});

var OpenVdna = React.createClass({
  displayName: 'OpenVdna',

  handleClick: function handleClick() {
    $("#vdnamenu").show();
    $("#openVdna").hide();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        { 'data-toggle': 'tooltip', title: 'Click to open VDNA', id: 'openVdna', className: 'btn btn-sm btn-primary openVdna', onClick: this.handleClick },
        'Open vDNA'
      )
    );
  }
});

var CloseVdna = React.createClass({
  displayName: 'CloseVdna',

  handleClick: function handleClick() {
    $("#vdnamenu").hide();
    $("#openVdna").show();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        { 'data-toggle': 'tooltip', title: 'Click to close', className: 'closeVdna', style: { cursor: 'pointer' }, onClick: this.handleClick },
        React.createElement('span', { className: 'fa fa-power-off' })
      )
    );
  }
});

var Tabs = React.createClass({
  displayName: 'Tabs',

  render: function render() {
    var that = this;
    var tabListNodes = this.props.tabList.map(function (tab, index) {
      return React.createElement(Tab, { changeTab: that.props.changeTab, key: tab.href, id: tab.href, tab: tab });
    });
    return React.createElement(
      'div',
      { className: 'sidebar col-xs-4 col-sm-3 col-lg-2' },
      React.createElement(
        'nav',
        { className: 'navbar navbar-default', role: 'navigation' },
        React.createElement(
          'ul',
          { className: 'nav navbar-nav', role: 'tablist' },
          tabListNodes
        )
      )
    );
  }
});

var Tab = React.createClass({
  displayName: 'Tab',

  handleClick: function handleClick() {
    this.props.changeTab(this.props.tab.id);
  },
  render: function render() {
    return React.createElement(
      'li',
      { role: 'presentation', className: this.props.tab.selected ? 'active' : '' },
      React.createElement(
        'a',
        { href: this.props.tab.href, 'aria-controls': this.props.tab.href, role: 'tab', 'data-toggle': 'tab', onClick: this.handleClick },
        this.props.tab.text
      )
    );
  }
});

var MyProfileHeader = React.createClass({
  displayName: 'MyProfileHeader',

  render: function render() {
    return React.createElement(
      'header',
      { className: 'page-header' },
      React.createElement(
        'div',
        { className: 'media' },
        React.createElement(
          'div',
          { className: 'media-left' },
          React.createElement('span', { className: 'fa fa-2x fa-user' })
        ),
        React.createElement(
          'div',
          { className: 'media-body' },
          React.createElement(
            'h1',
            { className: 'media-heading' },
            'Your profile ',
            React.createElement(
              'small',
              null,
              'at'
            ),
            ' [site.com]'
          )
        )
      )
    );
  }
});

var MyProfileCategories = React.createClass({
  displayName: 'MyProfileCategories',

  handleChange: function handleChange() {
    console.log(React.findDOMNode(this.refs.category).value);
    this.props.getCategoryOnChange(React.findDOMNode(this.refs.category).value);
  },
  getInitialState: function getInitialState() {
    return {
      categories: this.props.categories
    };
  },
  render: function render() {
    var that = this;
    var categoryNodes = this.state.categories.map(function (category) {
      return React.createElement(MyProfileCategory, { category: category });
    });
    return React.createElement(
      'div',
      { className: 'form-group form-group-sm' },
      React.createElement(
        'label',
        { htmlFor: 'category', className: 'col-sm-2 control-label' },
        'Category'
      ),
      React.createElement(
        'div',
        { className: 'col-sm-10' },
        React.createElement(
          'select',
          { className: 'selectpicker', id: 'category', ref: 'category', onChange: this.handleChange },
          categoryNodes
        )
      )
    );
  }
});

var MyProfileCategory = React.createClass({
  displayName: 'MyProfileCategory',

  render: function render() {
    return React.createElement(
      'option',
      { value: this.props.category, ref: this.props.category },
      data.capitalize(this.props.category)
    );
  }
});

var MyProfilePrivacy = React.createClass({
  displayName: 'MyProfilePrivacy',

  componentDidMount: function componentDidMount() {
    $("#privacySettingSlider").slider({ min: 1, max: 5, step: 1, value: 3 });
    $("#privacySettingSlider").on("slide", function (n) {
      n.value === 1 ? $("#privacySettingSliderVal").text("20") : n.value === 2 ? $("#privacySettingSliderVal").text("40") : n.value === 3 ? $("#privacySettingSliderVal").text("60") : n.value === 4 ? $("#privacySettingSliderVal").text("80") : n.value === 5 && $("#privacySettingSliderVal").text("100");
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'form-group form-group-sm' },
      React.createElement(
        'label',
        { htmlFor: 'inputEmail3', className: 'col-sm-2 control-label' },
        'Privacy'
      ),
      React.createElement(
        'div',
        { className: 'col-sm-6' },
        React.createElement('input', { id: 'privacySettingSlider', type: 'text' })
      ),
      React.createElement(
        'div',
        { className: 'col-sm-2' },
        'Sharing ',
        React.createElement(
          'span',
          { id: 'privacySettingSliderVal' },
          '60'
        ),
        '%'
      )
    );
  }
});

var MyProfileInterests = React.createClass({
  displayName: 'MyProfileInterests',

  showDetails: function showDetails(interest, details) {
    console.log(interest + ": " + JSON.stringify(details));
    this.setState({ currentInterest: interest, currentDetails: details });
  },
  getInitialState: function getInitialState() {
    return { currentInterest: null,
      currentDetails: {},
      addInterestCollapsed: true };
  },
  componentDidMount: function componentDidMount() {
    data.blinkNodes();
  },
  showAddLike: function showAddLike() {
    this.setState({ addInterestCollapsed: false });
  },
  hideAddLike: function hideAddLike() {
    this.setState({ addInterestCollapsed: true });
  },
  render: function render() {
    var that = this;
    var currentInterests = Object.keys(this.props.interests).reduce(function (is, i) {
      if (that.props.interests[i]['selected']) {
        is[i] = that.props.interests[i];
      }
      return is;
    }, {});
    var interestNodes = Object.keys(this.props.interests).filter(function (interest) {
      return that.props.interests[interest]['selected'];
    }).map(function (interest) {
      return React.createElement(MyProfileInterest, { key: interest, interest: interest, showDetails: that.showDetails.bind(that, interest, that.props.interests[interest]) });
    });
    /*
    var relatedInterests = Object.keys(this.props.interests).filter(function(interest) {
      return !that.props.interests[interest]['selected'];
    });
     */
    var relatedInterests = this.state.currentInterest ? this.state.currentDetails['related'].split(/,/) : [];
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'form-group form-group-sm' },
        React.createElement(
          'label',
          { className: 'col-sm-2 control-label' },
          'Interests'
        ),
        React.createElement(
          'div',
          { className: 'col-sm-6' },
          React.createElement(
            'div',
            { className: 'panel panel-interests' },
            React.createElement(
              'div',
              { className: 'panel-body' },
              interestNodes
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'col-sm-4 col-bottom' },
          React.createElement(
            'button',
            { type: 'submit', className: 'btn btn-sm btn-default' },
            'Import'
          ),
          React.createElement(
            'button',
            { id: 'addLike', onClick: this.showAddLike, type: 'submit', role: 'button', className: 'btn btn-sm btn-success', 'aria-expanded': 'false', 'aria-controls': 'addLike' },
            React.createElement('span', { className: 'glyphicon glyphicon-plus' }),
            ' Add'
          )
        )
      ),
      React.createElement(MyProfileAddAnInterest, { interests: currentInterests, collapse: this.state.addInterestCollapsed, hideAddLike: this.hideAddLike }),
      React.createElement(MyProfileLikeDetails, { currentInterest: this.state.currentInterest, currentDetails: this.state.currentDetails, relatedInterests: relatedInterests, collapse: false })
    );
  }
});

var MyProfileInterest = React.createClass({
  displayName: 'MyProfileInterest',

  handleClick: function handleClick() {
    this.props.showDetails();
  },
  render: function render() {
    return React.createElement(
      'span',
      { className: 'btn btn-sm btn-default', ref: 'interestSpan', title: this.props.interest, key: this.props.interest, role: 'button', onClick: this.handleClick },
      data.capitalize(this.props.interest)
    );
  }
});

var MyProfileAddAnInterest = React.createClass({
  displayName: 'MyProfileAddAnInterest',

  render: function render() {
    var currentInterestKeys = Object.keys(this.props.interests);
    var availableInterestKeys = Object.keys(data.staticInterests).filter(function (interestKey) {
      return currentInterestKeys.indexOf(interestKey) == -1;
    });
    var baseDivStyles = ['form-group', 'form-group-sm'];
    var availableInterestNodes = availableInterestKeys.map(function (interest) {
      return React.createElement(MyProfileAvailableInterest, { availableInterest: interest });
    });
    if (this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    return React.createElement(
      'div',
      { className: baseDivStyles.join(' '), id: 'addAnInterest' },
      React.createElement(
        'label',
        { className: 'col-sm-2 control-label' },
        'Add a like'
      ),
      React.createElement(
        'div',
        { className: 'col-sm-6' },
        availableInterestNodes
      )
    );
  }
});

var MyProfileAvailableInterest = React.createClass({
  displayName: 'MyProfileAvailableInterest',

  addInterest: function addInterest() {
    data.addInterest(this.props.availableInterest);
    reRender();
  },
  render: function render() {
    return React.createElement(
      'span',
      { className: 'btn btn-sm btn-default', ref: 'interestSpan', title: this.props.availableInterest, key: this.props.availableInterest, role: 'button', onClick: this.addInterest },
      data.capitalize(this.props.availableInterest)
    );
  }
});

/* It's quite a pity to have to comment this out...
var MyProfileAddAnInterest = React.createClass({
  addLikeDone: function() {
    console.log($("#addInterestInput").val());
    if(data.addInterest($("#addInterestInput").val())) {
      this.props.hideAddLike();
    }
    $("#addInterestInput").val("");
    reRender();
  },
  render: function() {
    var currentInterestKeys = Object.keys(this.props.interests);
    console.log('current interests: ' + JSON.stringify(currentInterestKeys));
    var availableInterestKeys = Object.keys(data.staticInterests).filter(function(interestKey) {
      return currentInterestKeys.indexOf(interestKey) == -1;
    });
    console.log('available interests: ' + JSON.stringify(availableInterestKeys));
    var baseDivStyles = ['form-group', 'form-group-sm'];
    if(this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    console.log('Add a like: "' + baseDivStyles.join(' ') + '"');
    return (
      <div className={baseDivStyles.join(' ')} id="addAnInterest">
        <label className="col-sm-2 control-label">Add a like</label>
        <div className="col-sm-6">
          <Autocomplete inputId="addInterestInput" defaultValue={''} defaultList={availableInterestKeys} className="form-control" addLikeDone={this.addLikeDone} />
        </div>
        <div className="col-sm-2">
          <button type="button" className="btn btn-sm btn-default" onClick={this.addLikeDone}>Done</button>
        </div>
      </div>
    );
  }
});
*/

var MyProfileLikeDetails = React.createClass({
  displayName: 'MyProfileLikeDetails',

  removeInterest: function removeInterest() {
    // data.unLikeAnInterest(this.props.category, this.props.currentInterest);
    data.unLikeAnInterest(this.props.currentInterest);
    reRender();
  },
  render: function render() {
    var that = this;
    var relatedInterestNodes = this.props.relatedInterests.map(function (interest) {
      return(
        // <MyProfileRelatedInterest category={that.props.category} relatedInterest={interest} />
        React.createElement(MyProfileRelatedInterest, { relatedInterest: interest })
      );
    });
    var baseDivStyles = ['form-group', 'form-group-sm'];
    if (this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    var html;
    if (this.props.currentInterest) {
      html = React.createElement(
        'div',
        { className: baseDivStyles.join(' '), id: 'likeDetails' },
        React.createElement(
          'div',
          { className: 'col-sm-6 col-sm-offset-2' },
          React.createElement(
            'div',
            { className: 'well well-sm' },
            React.createElement(
              'div',
              { className: 'row' },
              React.createElement(
                'div',
                { className: 'col-xs-4' },
                React.createElement(
                  'button',
                  { type: 'button', className: 'btn btn-sm btn-primary' },
                  this.props.currentInterest
                )
              ),
              React.createElement(
                'div',
                { className: 'col-xs-8' },
                React.createElement(
                  'ul',
                  { className: 'list-inline' },
                  React.createElement(
                    'li',
                    null,
                    React.createElement(
                      'small',
                      null,
                      React.createElement(
                        'strong',
                        null,
                        'Total clicks:'
                      ),
                      ' ',
                      this.props.currentDetails['clicks']
                    )
                  ),
                  React.createElement(
                    'li',
                    null,
                    React.createElement(
                      'small',
                      null,
                      React.createElement(
                        'strong',
                        null,
                        'Source:'
                      ),
                      ' Imported from ',
                      data.capitalize(this.props.currentDetails['source']),
                      React.createElement('br', null),
                      'Added on ',
                      Moment(this.props.currentDetails['added']).format("DD MMM YYYY")
                    )
                  )
                )
              )
            )
          ),
          React.createElement(
            'p',
            null,
            React.createElement(
              'strong',
              null,
              'Related interests:'
            ),
            relatedInterestNodes
          )
        ),
        React.createElement(
          'div',
          { className: 'col-sm-4' },
          React.createElement(
            'button',
            { type: 'submit', role: 'button', className: 'btn btn-sm btn-default remove-like', 'aria-expanded': 'true', 'aria-controls': 'removeLike', onClick: this.removeInterest },
            'Remove'
          )
        )
      );
    } else {
      html = React.createElement('div', { className: baseDivStyles.join(' '), id: 'likeDetails' });
    }
    return React.createElement(
      'div',
      null,
      html
    );
  }
});

var MyProfileRelatedInterest = React.createClass({
  displayName: 'MyProfileRelatedInterest',

  addInterest: function addInterest() {
    // data.addRelatedInterest(this.props.category, this.props.relatedInterest);
    data.addRelatedInterest(this.props.relatedInterest);
    reRender();
  },
  render: function render() {
    return React.createElement(
      'span',
      { className: 'btn btn-sm btn-default', ref: 'interestSpan', title: this.props.relatedInterest, key: this.props.relatedInterest, role: 'button', onClick: this.addInterest },
      data.capitalize(this.props.relatedInterest)
    );
  }
});

var MyProfile = React.createClass({
  displayName: 'MyProfile',

  getInitialState: function getInitialState() {
    return {
      // category: Object.keys(staticData)[0],
      // interests: staticData[Object.keys(staticData)[0]]
      interests: data.staticInterests
    };
  },
  getCategoryOnChange: function getCategoryOnChange(category) {
    console.log(JSON.stringify(data.staticData[category]));
    this.setState({ category: category,
      interests: data.staticData[category] });
  },
  render: function render() {
    return React.createElement(
      'div',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'profile' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(MyProfileHeader, null),
        React.createElement(
          'div',
          { className: 'form-horizontal' },
          React.createElement(MyProfilePrivacy, null),
          React.createElement(MyProfileInterests, { interests: this.state.interests, setInterests: this.setInterests })
        )
      )
    );
  }
});

var Notifications = React.createClass({
  displayName: 'Notifications',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'notifications' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h1',
            null,
            'Notifications ',
            React.createElement(
              'small',
              null,
              'from'
            ),
            ' [site.com]'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-12' },
            React.createElement(
              'table',
              { className: 'table table-notifications' },
              React.createElement(
                'thead',
                null,
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { colSpan: '2' },
                    React.createElement(
                      'p',
                      null,
                      'Site.com has requested to add following interests to your profile.',
                      React.createElement('br', null),
                      React.createElement(
                        'small',
                        null,
                        'See ',
                        React.createElement(
                          'a',
                          { href: '#' },
                          'settings'
                        ),
                        ' to change the default behavior for this window.'
                      )
                    )
                  ),
                  React.createElement(
                    'th',
                    null,
                    React.createElement(
                      'nav',
                      { className: 'table-filter text-right' },
                      React.createElement(
                        'ul',
                        { className: 'list-inline' },
                        React.createElement(
                          'li',
                          { className: 'text-muted' },
                          'Show:'
                        ),
                        React.createElement(
                          'li',
                          null,
                          React.createElement(
                            'a',
                            { href: '#' },
                            'Pending'
                          )
                        ),
                        React.createElement(
                          'li',
                          null,
                          React.createElement(
                            'a',
                            { href: '#' },
                            'Accepted'
                          )
                        ),
                        React.createElement(
                          'li',
                          null,
                          React.createElement(
                            'a',
                            { href: '#' },
                            'Rejected'
                          )
                        ),
                        React.createElement(
                          'li',
                          { className: 'active' },
                          React.createElement(
                            'a',
                            { href: '#' },
                            'All'
                          )
                        )
                      )
                    )
                  )
                )
              ),
              React.createElement(
                'tbody',
                null,
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { scope: 'row' },
                    React.createElement(
                      'span',
                      { className: 'btn btn btn-sm btn-default' },
                      'Tennis'
                    )
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'ul',
                      { className: 'list-inline' },
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Category: ',
                          React.createElement(
                            'strong',
                            null,
                            'Sports'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Source: Imported from ',
                          React.createElement(
                            'strong',
                            null,
                            'Facebook'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Requested on @DateTime.Now'
                        )
                      )
                    )
                  ),
                  React.createElement(
                    'td',
                    { className: 'text-right' },
                    React.createElement(
                      'div',
                      { className: 'btn-group', role: 'group', 'aria-label': '...' },
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-success' },
                        React.createElement('span', { className: 'fa fa-check' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Approve'
                        )
                      ),
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-danger' },
                        React.createElement('span', { className: 'fa fa-remove' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Remove'
                        )
                      )
                    )
                  )
                ),
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { scope: 'row' },
                    React.createElement(
                      'span',
                      { className: 'btn btn-sm btn-default' },
                      'Skiing'
                    )
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'ul',
                      { className: 'list-inline' },
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Category: ',
                          React.createElement(
                            'strong',
                            null,
                            'Sports'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Source: Imported from ',
                          React.createElement(
                            'strong',
                            null,
                            'Facebook'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Requested on @DateTime.Now'
                        )
                      )
                    )
                  ),
                  React.createElement(
                    'td',
                    { className: 'text-right' },
                    React.createElement(
                      'div',
                      { className: 'btn-group', role: 'group', 'aria-label': '...' },
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-success' },
                        React.createElement('span', { className: 'fa fa-check' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Approve'
                        )
                      ),
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-danger' },
                        React.createElement('span', { className: 'fa fa-remove' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Remove'
                        )
                      )
                    )
                  )
                ),
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { scope: 'row' },
                    React.createElement(
                      'span',
                      { className: 'btn btn btn-sm btn-default' },
                      'Windsurfing'
                    )
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'ul',
                      { className: 'list-inline' },
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Category: ',
                          React.createElement(
                            'strong',
                            null,
                            'Sports'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Source: Imported from ',
                          React.createElement(
                            'strong',
                            null,
                            'Facebook'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Requested on @DateTime.Now'
                        )
                      )
                    )
                  ),
                  React.createElement(
                    'td',
                    { className: 'text-right' },
                    React.createElement(
                      'div',
                      { className: 'btn-group', role: 'group', 'aria-label': '...' },
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-success' },
                        React.createElement('span', { className: 'fa fa-check' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Approve'
                        )
                      ),
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-danger' },
                        React.createElement('span', { className: 'fa fa-remove' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Remove'
                        )
                      )
                    )
                  )
                )
              )
            ),
            React.createElement(
              'nav',
              { className: 'text-right' },
              React.createElement(
                'ul',
                { className: 'pagination' },
                React.createElement(
                  'li',
                  { className: 'disabled' },
                  React.createElement(
                    'a',
                    { 'aria-label': 'Previous', href: '#' },
                    React.createElement(
                      'span',
                      { 'aria-hidden': 'true' },
                      '« Previous'
                    )
                  )
                ),
                React.createElement(
                  'li',
                  { className: 'active' },
                  React.createElement(
                    'a',
                    { href: '#' },
                    '1 ',
                    React.createElement(
                      'span',
                      { className: 'sr-only' },
                      '(current)'
                    )
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '2'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '3'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '4'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '5'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { 'aria-label': 'Next', href: '#' },
                    React.createElement(
                      'span',
                      { 'aria-hidden': 'true' },
                      'Next »'
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }
});

var Import = React.createClass({
  displayName: 'Import',

  facebookConnect: function facebookConnect() {
    if (variableData.facebook.length > 0) {
      console.log(JSON.stringify(variableData.facebook.shift()));
    } else {
      console.log('none left...');
    }
  },
  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'import' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h3',
            null,
            '...your interests across apps and devices.'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-6 col-lg-4' },
            React.createElement(
              'p',
              { className: 'lead' },
              'Connect with Facebook!'
            ),
            React.createElement(
              'div',
              { className: 'pull-left' },
              React.createElement(
                'strong',
                null,
                'Last sync:'
              ),
              ' 25 interests (5 new)',
              React.createElement('br', null),
              React.createElement(
                'strong',
                null,
                'Last synced on:'
              ),
              ' @DateTime.Now'
            ),
            React.createElement(
              'button',
              { className: 'btn btn-sm btn-default pull-right', onClick: this.facebookConnect },
              'Connect'
            )
          ),
          React.createElement(
            'div',
            { className: 'col-xs-6 col-lg-4 col-lg-offset-1' },
            React.createElement(
              'p',
              { className: 'lead' },
              'Import your pins from Pinterest!'
            ),
            React.createElement(
              'div',
              { className: 'pull-left' },
              React.createElement(
                'strong',
                null,
                'Last sync:'
              ),
              ' 25 interests (5 new)',
              React.createElement('br', null),
              React.createElement(
                'strong',
                null,
                'Last synced on:'
              ),
              ' @DateTime.Now'
            ),
            React.createElement(
              'a',
              { href: '#', className: 'btn btn-sm btn-default pull-right' },
              'Import'
            )
          )
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-12 col-lg-9' },
            React.createElement(
              'h3',
              null,
              'Try your app!'
            ),
            React.createElement(
              'p',
              null,
              'Like controlling the web??? We thought so. Our nifty app lets you take it to the next level and puts all your internet-wide preferences in one central place so you can quickly and easily view and accept your notifications with a few steps.'
            ),
            React.createElement(
              'div',
              { className: 'pull-left' },
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-default' },
                'download for android'
              ),
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-default' },
                'download for iphone'
              )
            ),
            React.createElement(
              'div',
              { className: 'pull-right' },
              'Got an app? Now ',
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-default' },
                'Generate a sync code!'
              )
            )
          )
        )
      )
    );
  }
});

var Settings = React.createClass({
  displayName: 'Settings',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'settings' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h1',
            null,
            'Settings ',
            React.createElement(
              'small',
              null,
              'on'
            ),
            ' [site.com]'
          ),
          React.createElement(
            'p',
            null,
            'You are in control! Change your settings here.'
          )
        ),
        React.createElement(
          'div',
          { className: 'form-horizontal' },
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'personalization', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Personalization'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement('input', { type: 'checkbox', name: 'personalization', className: 'switch' })
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'sorting', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Sorting'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement(
                'select',
                { 'class': 'selectpicker', id: 'sorting' },
                React.createElement(
                  'option',
                  null,
                  'Your interests'
                ),
                React.createElement(
                  'option',
                  null,
                  'Site default'
                )
              )
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'autosave', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Autosave'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement('input', { type: 'checkbox', name: 'autosave', className: 'switch' })
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'delete', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Delete my profile ',
              React.createElement(
                'small',
                null,
                'at'
              ),
              ' ',
              React.createElement(
                'i',
                null,
                '[site.com]'
              )
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-danger' },
                'Delete'
              )
            )
          )
        )
      )
    );
  }
});

var Privacy = React.createClass({
  displayName: 'Privacy',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'privacy' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h1',
            null,
            'Privacy'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-10' },
            React.createElement(
              'p',
              { className: 'lead' },
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.'
            ),
            React.createElement(
              'p',
              null,
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.'
            )
          )
        )
      )
    );
  }
});

var About = React.createClass({
  displayName: 'About',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'about' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement('img', { src: '/images/logo-zivter.png', alt: '' })
        )
      )
    );
  }
});

reRender();

/*
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" type="text/css" href="Content/vdna.min.css">
    <script type="text/javascript" src="Scripts/modernizr-2.6.2.js"></script>
  </head>
  <body>

    <!-- vdna app -->
    <section class="vdna">
      <div class="vdna-body">

	<!-- container -->
	<div class="container">
	  <div class="row">

	    <!-- sidebar ----------------------------------------------------------------------------------------->
	    <div class="sidebar col-xs-4 col-sm-3 col-lg-2">

	    </div><!-- /sidebar ---------------------------------------------------------------------------------->

	    <!-- main content -->
	    <div class="main-content col-xs-8 col-xs-offset-4 col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2">
	      <div class="tab-content">

		<!-- section: my profile ------------------------------------------------------>

		    </div><!-- /my profile form -->

		  </div>
		</section><!-- /section: my profile -------------------------------------------->

		<!-- section: notifications ------------------------------------------------------>
                <!-- /section: notifications ----------------------------------------------------->

		<!-- section: import ----------------------------------------------------------------->
                <!-- /section: import ---------------------------------------------------------------->

		<!-- section: settings ------------------------------------------------------------------>
                <!-- section: settings ------------------------------------------------------------------>

		<!-- section: privacy ---------------------------------------------------------------------->
                <!-- /section: privacy ------------------------------------------------------------------->

		<!-- section: about ------------------------------------------------------------------------->
                <!-- /section: about ---------------------------------------------------------------------->

	      </div>
	    </div><!-- /main content -->

	  </div>

	  <!-- close app -->
	  <a href="#closeVdna" data-toggle="tooltip" title="Click to close" class="closeVdna"><span class="fa fa-power-off"></span></a>

	</div><!-- /container -->

	<!-- open app -->
	<a href="#openVdna" data-toggle="tooltip" title="Click to open VDNA" class="btn btn-sm btn-primary openVdna">Open vDNA</a>
      </div>
    </section><!-- /vdna app -->

    <!-- Website placeholder -->
    <img src="Content/images/ticketpro.png" alt="" />

    <!-- Scripts -->
    <script type="text/javascript" src="Scripts/bundles/jquery.js"></script>
    <script type="text/javascript" src="Scripts/bundles/bootstrap.js"></script>
    <script type="text/javascript" src="Scripts/bundles/vdna.js"></script>

  </body>
</html>
*/
/* <OpenVdna /> */ /*<strong>Category:</strong> {data.capitalize(this.props.currentDetails['category'])}<br />*/ /*<MyProfileCategories categories={Object.keys(data.staticData)} getCategoryOnChange={this.getCategoryOnChange} />*/ /*<MyProfileInterests category={this.state.category} interests={this.state.interests} setInterests={this.setInterests} />*/ /* <a href="#" className="btn btn-sm btn-default pull-right">Connect</a> */


},{"moment":1,"vdna/static_data":2,"vdna/variable_data":3}]},{},[4]);
