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
    "la rioja":         { source: 'ticketpro', clicks: 32, added: Date.now(), selected: false,
                          related: 'spain' },
    "castille y león":  { source: 'ticketpro', clicks: 45, added: Date.now(), selected: false,
                          related: 'spain' },
    spain:              { source: 'ticketpro', clicks: 20, added: Date.now(), selected: false,
                          related: 'la rioja,castille y león' },
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
'use strict';

var Moment = require('moment');
var data = require('vdna/static_data');
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

  addLikeDone: function addLikeDone() {
    console.log($("#addInterestInput").val());
    if (data.addInterest($("#addInterestInput").val())) {
      this.props.hideAddLike();
    }
    $("#addInterestInput").val("");
    reRender();
  },
  render: function render() {
    var currentInterestKeys = Object.keys(this.props.interests);
    console.log('current interests: ' + JSON.stringify(currentInterestKeys));
    var availableInterestKeys = Object.keys(data.staticInterests).filter(function (interestKey) {
      return currentInterestKeys.indexOf(interestKey) == -1;
    });
    console.log('available interests: ' + JSON.stringify(availableInterestKeys));
    var baseDivStyles = ['form-group', 'form-group-sm'];
    if (this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    console.log('Add a like: "' + baseDivStyles.join(' ') + '"');
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
        React.createElement(Autocomplete, { inputId: 'addInterestInput', defaultValue: '', defaultList: availableInterestKeys, className: 'form-control', addLikeDone: this.addLikeDone })
      ),
      React.createElement(
        'div',
        { className: 'col-sm-2' },
        React.createElement(
          'button',
          { type: 'button', className: 'btn btn-sm btn-default', onClick: this.addLikeDone },
          'Done'
        )
      )
    );
  }
});

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
              'a',
              { href: '#', className: 'btn btn-sm btn-default pull-right' },
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
/* <OpenVdna /> */ /* <input type="text" className="form-control" ref="addAnInterestInput" id="addAnInterestInput" /> */ /*<strong>Category:</strong> {data.capitalize(this.props.currentDetails['category'])}<br />*/ /*<MyProfileCategories categories={Object.keys(data.staticData)} getCategoryOnChange={this.getCategoryOnChange} />*/ /*<MyProfileInterests category={this.state.category} interests={this.state.interests} setInterests={this.setInterests} />*/


},{"moment":1,"vdna/static_data":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9tb21lbnQvbW9tZW50LmpzIiwiL2hvbWUvcG9sYXJpcy9ydW1tYWdpbmdfcm91bmQvbm9kZS5qcy90cC1yZWFjdC9ub2RlX21vZHVsZXMvdmRuYS9zdGF0aWNfZGF0YS5qcyIsIi9ob21lL3BvbGFyaXMvcnVtbWFnaW5nX3JvdW5kL25vZGUuanMvdHAtcmVhY3QvcHVibGljL2pzL3ZkbmFtZW51LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7RUFFRTtBQUNGLGtCQUFrQixDQUFDLHFHQUFxRyxDQUFDLDZGQUE2RixDQUFDLG9IQUFvSCxDQUFDLDJIQUEySDtBQUN2YyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyEgbW9tZW50LmpzXG4vLyEgdmVyc2lvbiA6IDIuMTAuNlxuLy8hIGF1dGhvcnMgOiBUaW0gV29vZCwgSXNrcmVuIENoZXJuZXYsIE1vbWVudC5qcyBjb250cmlidXRvcnNcbi8vISBsaWNlbnNlIDogTUlUXG4vLyEgbW9tZW50anMuY29tXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgZ2xvYmFsLm1vbWVudCA9IGZhY3RvcnkoKVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBob29rQ2FsbGJhY2s7XG5cbiAgICBmdW5jdGlvbiB1dGlsc19ob29rc19faG9va3MgKCkge1xuICAgICAgICByZXR1cm4gaG9va0NhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBpcyBkb25lIHRvIHJlZ2lzdGVyIHRoZSBtZXRob2QgY2FsbGVkIHdpdGggbW9tZW50KClcbiAgICAvLyB3aXRob3V0IGNyZWF0aW5nIGNpcmN1bGFyIGRlcGVuZGVuY2llcy5cbiAgICBmdW5jdGlvbiBzZXRIb29rQ2FsbGJhY2sgKGNhbGxiYWNrKSB7XG4gICAgICAgIGhvb2tDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQXJyYXkoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXRlKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCBpbnN0YW5jZW9mIERhdGUgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hcChhcnIsIGZuKSB7XG4gICAgICAgIHZhciByZXMgPSBbXSwgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcmVzLnB1c2goZm4oYXJyW2ldLCBpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNPd25Qcm9wKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLCBiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRlbmQoYSwgYikge1xuICAgICAgICBmb3IgKHZhciBpIGluIGIpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGIsIGkpKSB7XG4gICAgICAgICAgICAgICAgYVtpXSA9IGJbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzT3duUHJvcChiLCAndG9TdHJpbmcnKSkge1xuICAgICAgICAgICAgYS50b1N0cmluZyA9IGIudG9TdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzT3duUHJvcChiLCAndmFsdWVPZicpKSB7XG4gICAgICAgICAgICBhLnZhbHVlT2YgPSBiLnZhbHVlT2Y7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVfdXRjX19jcmVhdGVVVEMgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCB0cnVlKS51dGMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0UGFyc2luZ0ZsYWdzKCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGRlZXAgY2xvbmUgdGhpcyBvYmplY3QuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbXB0eSAgICAgICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIHVudXNlZFRva2VucyAgICA6IFtdLFxuICAgICAgICAgICAgdW51c2VkSW5wdXQgICAgIDogW10sXG4gICAgICAgICAgICBvdmVyZmxvdyAgICAgICAgOiAtMixcbiAgICAgICAgICAgIGNoYXJzTGVmdE92ZXIgICA6IDAsXG4gICAgICAgICAgICBudWxsSW5wdXQgICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIGludmFsaWRNb250aCAgICA6IG51bGwsXG4gICAgICAgICAgICBpbnZhbGlkRm9ybWF0ICAgOiBmYWxzZSxcbiAgICAgICAgICAgIHVzZXJJbnZhbGlkYXRlZCA6IGZhbHNlLFxuICAgICAgICAgICAgaXNvICAgICAgICAgICAgIDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJzaW5nRmxhZ3MobSkge1xuICAgICAgICBpZiAobS5fcGYgPT0gbnVsbCkge1xuICAgICAgICAgICAgbS5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX3BmO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkX19pc1ZhbGlkKG0pIHtcbiAgICAgICAgaWYgKG0uX2lzVmFsaWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGZsYWdzID0gZ2V0UGFyc2luZ0ZsYWdzKG0pO1xuICAgICAgICAgICAgbS5faXNWYWxpZCA9ICFpc05hTihtLl9kLmdldFRpbWUoKSkgJiZcbiAgICAgICAgICAgICAgICBmbGFncy5vdmVyZmxvdyA8IDAgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuZW1wdHkgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZE1vbnRoICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLmludmFsaWRXZWVrZGF5ICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLm51bGxJbnB1dCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5pbnZhbGlkRm9ybWF0ICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLnVzZXJJbnZhbGlkYXRlZDtcblxuICAgICAgICAgICAgaWYgKG0uX3N0cmljdCkge1xuICAgICAgICAgICAgICAgIG0uX2lzVmFsaWQgPSBtLl9pc1ZhbGlkICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmNoYXJzTGVmdE92ZXIgPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MudW51c2VkVG9rZW5zLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy5iaWdIb3VyID09PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX2lzVmFsaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRfX2NyZWF0ZUludmFsaWQgKGZsYWdzKSB7XG4gICAgICAgIHZhciBtID0gY3JlYXRlX3V0Y19fY3JlYXRlVVRDKE5hTik7XG4gICAgICAgIGlmIChmbGFncyAhPSBudWxsKSB7XG4gICAgICAgICAgICBleHRlbmQoZ2V0UGFyc2luZ0ZsYWdzKG0pLCBmbGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MobSkudXNlckludmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cblxuICAgIHZhciBtb21lbnRQcm9wZXJ0aWVzID0gdXRpbHNfaG9va3NfX2hvb2tzLm1vbWVudFByb3BlcnRpZXMgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGNvcHlDb25maWcodG8sIGZyb20pIHtcbiAgICAgICAgdmFyIGksIHByb3AsIHZhbDtcblxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2lzQU1vbWVudE9iamVjdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pc0FNb21lbnRPYmplY3QgPSBmcm9tLl9pc0FNb21lbnRPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2kgPSBmcm9tLl9pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9mID0gZnJvbS5fZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fbCA9IGZyb20uX2w7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9zdHJpY3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fc3RyaWN0ID0gZnJvbS5fc3RyaWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fdHptICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3R6bSA9IGZyb20uX3R6bTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2lzVVRDICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2lzVVRDID0gZnJvbS5faXNVVEM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9vZmZzZXQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fb2Zmc2V0ID0gZnJvbS5fb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fcGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fcGYgPSBnZXRQYXJzaW5nRmxhZ3MoZnJvbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9sb2NhbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fbG9jYWxlID0gZnJvbS5fbG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vbWVudFByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChpIGluIG1vbWVudFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICBwcm9wID0gbW9tZW50UHJvcGVydGllc1tpXTtcbiAgICAgICAgICAgICAgICB2YWwgPSBmcm9tW3Byb3BdO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICB0b1twcm9wXSA9IHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdG87XG4gICAgfVxuXG4gICAgdmFyIHVwZGF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcblxuICAgIC8vIE1vbWVudCBwcm90b3R5cGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gTW9tZW50KGNvbmZpZykge1xuICAgICAgICBjb3B5Q29uZmlnKHRoaXMsIGNvbmZpZyk7XG4gICAgICAgIHRoaXMuX2QgPSBuZXcgRGF0ZShjb25maWcuX2QgIT0gbnVsbCA/IGNvbmZpZy5fZC5nZXRUaW1lKCkgOiBOYU4pO1xuICAgICAgICAvLyBQcmV2ZW50IGluZmluaXRlIGxvb3AgaW4gY2FzZSB1cGRhdGVPZmZzZXQgY3JlYXRlcyBuZXcgbW9tZW50XG4gICAgICAgIC8vIG9iamVjdHMuXG4gICAgICAgIGlmICh1cGRhdGVJblByb2dyZXNzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNNb21lbnQgKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTW9tZW50IHx8IChvYmogIT0gbnVsbCAmJiBvYmouX2lzQU1vbWVudE9iamVjdCAhPSBudWxsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNGbG9vciAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JbnQoYXJndW1lbnRGb3JDb2VyY2lvbikge1xuICAgICAgICB2YXIgY29lcmNlZE51bWJlciA9ICthcmd1bWVudEZvckNvZXJjaW9uLFxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChjb2VyY2VkTnVtYmVyICE9PSAwICYmIGlzRmluaXRlKGNvZXJjZWROdW1iZXIpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGFic0Zsb29yKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBhcmVBcnJheXMoYXJyYXkxLCBhcnJheTIsIGRvbnRDb252ZXJ0KSB7XG4gICAgICAgIHZhciBsZW4gPSBNYXRoLm1pbihhcnJheTEubGVuZ3RoLCBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGxlbmd0aERpZmYgPSBNYXRoLmFicyhhcnJheTEubGVuZ3RoIC0gYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBkaWZmcyA9IDAsXG4gICAgICAgICAgICBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgoZG9udENvbnZlcnQgJiYgYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHx8XG4gICAgICAgICAgICAgICAgKCFkb250Q29udmVydCAmJiB0b0ludChhcnJheTFbaV0pICE9PSB0b0ludChhcnJheTJbaV0pKSkge1xuICAgICAgICAgICAgICAgIGRpZmZzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpZmZzICsgbGVuZ3RoRGlmZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBMb2NhbGUoKSB7XG4gICAgfVxuXG4gICAgdmFyIGxvY2FsZXMgPSB7fTtcbiAgICB2YXIgZ2xvYmFsTG9jYWxlO1xuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplTG9jYWxlKGtleSkge1xuICAgICAgICByZXR1cm4ga2V5ID8ga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnXycsICctJykgOiBrZXk7XG4gICAgfVxuXG4gICAgLy8gcGljayB0aGUgbG9jYWxlIGZyb20gdGhlIGFycmF5XG4gICAgLy8gdHJ5IFsnZW4tYXUnLCAnZW4tZ2InXSBhcyAnZW4tYXUnLCAnZW4tZ2InLCAnZW4nLCBhcyBpbiBtb3ZlIHRocm91Z2ggdGhlIGxpc3QgdHJ5aW5nIGVhY2hcbiAgICAvLyBzdWJzdHJpbmcgZnJvbSBtb3N0IHNwZWNpZmljIHRvIGxlYXN0LCBidXQgbW92ZSB0byB0aGUgbmV4dCBhcnJheSBpdGVtIGlmIGl0J3MgYSBtb3JlIHNwZWNpZmljIHZhcmlhbnQgdGhhbiB0aGUgY3VycmVudCByb290XG4gICAgZnVuY3Rpb24gY2hvb3NlTG9jYWxlKG5hbWVzKSB7XG4gICAgICAgIHZhciBpID0gMCwgaiwgbmV4dCwgbG9jYWxlLCBzcGxpdDtcblxuICAgICAgICB3aGlsZSAoaSA8IG5hbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgc3BsaXQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaV0pLnNwbGl0KCctJyk7XG4gICAgICAgICAgICBqID0gc3BsaXQubGVuZ3RoO1xuICAgICAgICAgICAgbmV4dCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpICsgMV0pO1xuICAgICAgICAgICAgbmV4dCA9IG5leHQgPyBuZXh0LnNwbGl0KCctJykgOiBudWxsO1xuICAgICAgICAgICAgd2hpbGUgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShzcGxpdC5zbGljZSgwLCBqKS5qb2luKCctJykpO1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5leHQgJiYgbmV4dC5sZW5ndGggPj0gaiAmJiBjb21wYXJlQXJyYXlzKHNwbGl0LCBuZXh0LCB0cnVlKSA+PSBqIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvL3RoZSBuZXh0IGFycmF5IGl0ZW0gaXMgYmV0dGVyIHRoYW4gYSBzaGFsbG93ZXIgc3Vic3RyaW5nIG9mIHRoaXMgb25lXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBqLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZExvY2FsZShuYW1lKSB7XG4gICAgICAgIHZhciBvbGRMb2NhbGUgPSBudWxsO1xuICAgICAgICAvLyBUT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZWdpc3RlciBhbmQgbG9hZCBhbGwgdGhlIGxvY2FsZXMgaW4gTm9kZVxuICAgICAgICBpZiAoIWxvY2FsZXNbbmFtZV0gJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2xkTG9jYWxlID0gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgICAgICAgICAgICAgIHJlcXVpcmUoJy4vbG9jYWxlLycgKyBuYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIGRlZmluZUxvY2FsZSBjdXJyZW50bHkgYWxzbyBzZXRzIHRoZSBnbG9iYWwgbG9jYWxlLCB3ZVxuICAgICAgICAgICAgICAgIC8vIHdhbnQgdG8gdW5kbyB0aGF0IGZvciBsYXp5IGxvYWRlZCBsb2NhbGVzXG4gICAgICAgICAgICAgICAgbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZShvbGRMb2NhbGUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGxvYWQgbG9jYWxlIGFuZCB0aGVuIHNldCB0aGUgZ2xvYmFsIGxvY2FsZS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbiAgICAvLyBsb2NhbGUga2V5LlxuICAgIGZ1bmN0aW9uIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUgKGtleSwgdmFsdWVzKSB7XG4gICAgICAgIHZhciBkYXRhO1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRlZmluZUxvY2FsZShrZXksIHZhbHVlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gbW9tZW50LmR1cmF0aW9uLl9sb2NhbGUgPSBtb21lbnQuX2xvY2FsZSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgZ2xvYmFsTG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmaW5lTG9jYWxlIChuYW1lLCB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKHZhbHVlcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWVzLmFiYnIgPSBuYW1lO1xuICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IGxvY2FsZXNbbmFtZV0gfHwgbmV3IExvY2FsZSgpO1xuICAgICAgICAgICAgbG9jYWxlc1tuYW1lXS5zZXQodmFsdWVzKTtcblxuICAgICAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdCBmb3Igbm93OiBhbHNvIHNldCB0aGUgbG9jYWxlXG4gICAgICAgICAgICBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKG5hbWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHVzZWZ1bCBmb3IgdGVzdGluZ1xuICAgICAgICAgICAgZGVsZXRlIGxvY2FsZXNbbmFtZV07XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJldHVybnMgbG9jYWxlIGRhdGFcbiAgICBmdW5jdGlvbiBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlIChrZXkpIHtcbiAgICAgICAgdmFyIGxvY2FsZTtcblxuICAgICAgICBpZiAoa2V5ICYmIGtleS5fbG9jYWxlICYmIGtleS5fbG9jYWxlLl9hYmJyKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkuX2xvY2FsZS5fYWJicjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0FycmF5KGtleSkpIHtcbiAgICAgICAgICAgIC8vc2hvcnQtY2lyY3VpdCBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5ID0gW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hvb3NlTG9jYWxlKGtleSk7XG4gICAgfVxuXG4gICAgdmFyIGFsaWFzZXMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFVuaXRBbGlhcyAodW5pdCwgc2hvcnRoYW5kKSB7XG4gICAgICAgIHZhciBsb3dlckNhc2UgPSB1bml0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGFsaWFzZXNbbG93ZXJDYXNlXSA9IGFsaWFzZXNbbG93ZXJDYXNlICsgJ3MnXSA9IGFsaWFzZXNbc2hvcnRoYW5kXSA9IHVuaXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplVW5pdHModW5pdHMpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB1bml0cyA9PT0gJ3N0cmluZycgPyBhbGlhc2VzW3VuaXRzXSB8fCBhbGlhc2VzW3VuaXRzLnRvTG93ZXJDYXNlKCldIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZU9iamVjdFVuaXRzKGlucHV0T2JqZWN0KSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSB7fSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wLFxuICAgICAgICAgICAgcHJvcDtcblxuICAgICAgICBmb3IgKHByb3AgaW4gaW5wdXRPYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGlucHV0T2JqZWN0LCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wID0gbm9ybWFsaXplVW5pdHMocHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dFtub3JtYWxpemVkUHJvcF0gPSBpbnB1dE9iamVjdFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZElucHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VHZXRTZXQgKHVuaXQsIGtlZXBUaW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZ2V0X3NldF9fc2V0KHRoaXMsIHVuaXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIGtlZXBUaW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldF9zZXRfX2dldCh0aGlzLCB1bml0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRfc2V0X19nZXQgKG1vbSwgdW5pdCkge1xuICAgICAgICByZXR1cm4gbW9tLl9kWydnZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0X3NldF9fc2V0IChtb20sIHVuaXQsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0odmFsdWUpO1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldCAodW5pdHMsIHZhbHVlKSB7XG4gICAgICAgIHZhciB1bml0O1xuICAgICAgICBpZiAodHlwZW9mIHVuaXRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZm9yICh1bml0IGluIHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXQodW5pdCwgdW5pdHNbdW5pdF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNbdW5pdHNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHNdKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB6ZXJvRmlsbChudW1iZXIsIHRhcmdldExlbmd0aCwgZm9yY2VTaWduKSB7XG4gICAgICAgIHZhciBhYnNOdW1iZXIgPSAnJyArIE1hdGguYWJzKG51bWJlciksXG4gICAgICAgICAgICB6ZXJvc1RvRmlsbCA9IHRhcmdldExlbmd0aCAtIGFic051bWJlci5sZW5ndGgsXG4gICAgICAgICAgICBzaWduID0gbnVtYmVyID49IDA7XG4gICAgICAgIHJldHVybiAoc2lnbiA/IChmb3JjZVNpZ24gPyAnKycgOiAnJykgOiAnLScpICtcbiAgICAgICAgICAgIE1hdGgucG93KDEwLCBNYXRoLm1heCgwLCB6ZXJvc1RvRmlsbCkpLnRvU3RyaW5nKCkuc3Vic3RyKDEpICsgYWJzTnVtYmVyO1xuICAgIH1cblxuICAgIHZhciBmb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KE1vfE1NP00/TT98RG98REREb3xERD9EP0Q/fGRkZD9kP3xkbz98d1tvfHddP3xXW298V10/fFF8WVlZWVlZfFlZWVlZfFlZWVl8WVl8Z2coZ2dnPyk/fEdHKEdHRz8pP3xlfEV8YXxBfGhoP3xISD98bW0/fHNzP3xTezEsOX18eHxYfHp6P3xaWj98LikvZztcblxuICAgIHZhciBsb2NhbEZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTFRTfExUfExMP0w/TD98bHsxLDR9KS9nO1xuXG4gICAgdmFyIGZvcm1hdEZ1bmN0aW9ucyA9IHt9O1xuXG4gICAgdmFyIGZvcm1hdFRva2VuRnVuY3Rpb25zID0ge307XG5cbiAgICAvLyB0b2tlbjogICAgJ00nXG4gICAgLy8gcGFkZGVkOiAgIFsnTU0nLCAyXVxuICAgIC8vIG9yZGluYWw6ICAnTW8nXG4gICAgLy8gY2FsbGJhY2s6IGZ1bmN0aW9uICgpIHsgdGhpcy5tb250aCgpICsgMSB9XG4gICAgZnVuY3Rpb24gYWRkRm9ybWF0VG9rZW4gKHRva2VuLCBwYWRkZWQsIG9yZGluYWwsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBmdW5jID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2NhbGxiYWNrXSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhZGRlZCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbcGFkZGVkWzBdXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gemVyb0ZpbGwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBwYWRkZWRbMV0sIHBhZGRlZFsyXSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcmRpbmFsKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tvcmRpbmFsXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkub3JkaW5hbChmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRva2VuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5tYXRjaCgvXFxbW1xcc1xcU10vKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1xcXFwvZywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gZm9ybWF0Lm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpLCBpLCBsZW5ndGg7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV0pIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobW9tKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gJyc7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYXJyYXlbaV0gaW5zdGFuY2VvZiBGdW5jdGlvbiA/IGFycmF5W2ldLmNhbGwobW9tLCBmb3JtYXQpIDogYXJyYXlbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIGZvcm1hdCBkYXRlIHVzaW5nIG5hdGl2ZSBkYXRlIG9iamVjdFxuICAgIGZ1bmN0aW9uIGZvcm1hdE1vbWVudChtLCBmb3JtYXQpIHtcbiAgICAgICAgaWYgKCFtLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG0ubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBleHBhbmRGb3JtYXQoZm9ybWF0LCBtLmxvY2FsZURhdGEoKSk7XG4gICAgICAgIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdID0gZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0gfHwgbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCk7XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKG0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGFuZEZvcm1hdChmb3JtYXQsIGxvY2FsZSkge1xuICAgICAgICB2YXIgaSA9IDU7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLmxvbmdEYXRlRm9ybWF0KGlucHV0KSB8fCBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICB3aGlsZSAoaSA+PSAwICYmIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy50ZXN0KGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKGxvY2FsRm9ybWF0dGluZ1Rva2VucywgcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKTtcbiAgICAgICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICB9XG5cbiAgICB2YXIgbWF0Y2gxICAgICAgICAgPSAvXFxkLzsgICAgICAgICAgICAvLyAgICAgICAwIC0gOVxuICAgIHZhciBtYXRjaDIgICAgICAgICA9IC9cXGRcXGQvOyAgICAgICAgICAvLyAgICAgIDAwIC0gOTlcbiAgICB2YXIgbWF0Y2gzICAgICAgICAgPSAvXFxkezN9LzsgICAgICAgICAvLyAgICAgMDAwIC0gOTk5XG4gICAgdmFyIG1hdGNoNCAgICAgICAgID0gL1xcZHs0fS87ICAgICAgICAgLy8gICAgMDAwMCAtIDk5OTlcbiAgICB2YXIgbWF0Y2g2ICAgICAgICAgPSAvWystXT9cXGR7Nn0vOyAgICAvLyAtOTk5OTk5IC0gOTk5OTk5XG4gICAgdmFyIG1hdGNoMXRvMiAgICAgID0gL1xcZFxcZD8vOyAgICAgICAgIC8vICAgICAgIDAgLSA5OVxuICAgIHZhciBtYXRjaDF0bzMgICAgICA9IC9cXGR7MSwzfS87ICAgICAgIC8vICAgICAgIDAgLSA5OTlcbiAgICB2YXIgbWF0Y2gxdG80ICAgICAgPSAvXFxkezEsNH0vOyAgICAgICAvLyAgICAgICAwIC0gOTk5OVxuICAgIHZhciBtYXRjaDF0bzYgICAgICA9IC9bKy1dP1xcZHsxLDZ9LzsgIC8vIC05OTk5OTkgLSA5OTk5OTlcblxuICAgIHZhciBtYXRjaFVuc2lnbmVkICA9IC9cXGQrLzsgICAgICAgICAgIC8vICAgICAgIDAgLSBpbmZcbiAgICB2YXIgbWF0Y2hTaWduZWQgICAgPSAvWystXT9cXGQrLzsgICAgICAvLyAgICAtaW5mIC0gaW5mXG5cbiAgICB2YXIgbWF0Y2hPZmZzZXQgICAgPSAvWnxbKy1dXFxkXFxkOj9cXGRcXGQvZ2k7IC8vICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxuXG4gICAgdmFyIG1hdGNoVGltZXN0YW1wID0gL1srLV0/XFxkKyhcXC5cXGR7MSwzfSk/LzsgLy8gMTIzNDU2Nzg5IDEyMzQ1Njc4OS4xMjNcblxuICAgIC8vIGFueSB3b3JkIChvciB0d28pIGNoYXJhY3RlcnMgb3IgbnVtYmVycyBpbmNsdWRpbmcgdHdvL3RocmVlIHdvcmQgbW9udGggaW4gYXJhYmljLlxuICAgIHZhciBtYXRjaFdvcmQgPSAvWzAtOV0qWydhLXpcXHUwMEEwLVxcdTA1RkZcXHUwNzAwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdK3xbXFx1MDYwMC1cXHUwNkZGXFwvXSsoXFxzKj9bXFx1MDYwMC1cXHUwNkZGXSspezEsMn0vaTtcblxuICAgIHZhciByZWdleGVzID0ge307XG5cbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uIChzdGgpIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzIzMjVcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBzdGggPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdGgpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gYWRkUmVnZXhUb2tlbiAodG9rZW4sIHJlZ2V4LCBzdHJpY3RSZWdleCkge1xuICAgICAgICByZWdleGVzW3Rva2VuXSA9IGlzRnVuY3Rpb24ocmVnZXgpID8gcmVnZXggOiBmdW5jdGlvbiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiAoaXNTdHJpY3QgJiYgc3RyaWN0UmVnZXgpID8gc3RyaWN0UmVnZXggOiByZWdleDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4gKHRva2VuLCBjb25maWcpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHJlZ2V4ZXMsIHRva2VuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAodW5lc2NhcGVGb3JtYXQodG9rZW4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWdleGVzW3Rva2VuXShjb25maWcuX3N0cmljdCwgY29uZmlnLl9sb2NhbGUpO1xuICAgIH1cblxuICAgIC8vIENvZGUgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM1NjE0OTMvaXMtdGhlcmUtYS1yZWdleHAtZXNjYXBlLWZ1bmN0aW9uLWluLWphdmFzY3JpcHRcbiAgICBmdW5jdGlvbiB1bmVzY2FwZUZvcm1hdChzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoJ1xcXFwnLCAnJykucmVwbGFjZSgvXFxcXChcXFspfFxcXFwoXFxdKXxcXFsoW15cXF1cXFtdKilcXF18XFxcXCguKS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgcDEsIHAyLCBwMywgcDQpIHtcbiAgICAgICAgICAgIHJldHVybiBwMSB8fCBwMiB8fCBwMyB8fCBwNDtcbiAgICAgICAgfSkucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG4gICAgfVxuXG4gICAgdmFyIHRva2VucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkUGFyc2VUb2tlbiAodG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBpLCBmdW5jID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0b2tlbiA9IFt0b2tlbl07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGZ1bmMgPSBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbY2FsbGJhY2tdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbltpXV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkV2Vla1BhcnNlVG9rZW4gKHRva2VuLCBjYWxsYmFjaykge1xuICAgICAgICBhZGRQYXJzZVRva2VuKHRva2VuLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgICAgICBjb25maWcuX3cgPSBjb25maWcuX3cgfHwge307XG4gICAgICAgICAgICBjYWxsYmFjayhpbnB1dCwgY29uZmlnLl93LCBjb25maWcsIHRva2VuKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIGlucHV0LCBjb25maWcpIHtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwgJiYgaGFzT3duUHJvcCh0b2tlbnMsIHRva2VuKSkge1xuICAgICAgICAgICAgdG9rZW5zW3Rva2VuXShpbnB1dCwgY29uZmlnLl9hLCBjb25maWcsIHRva2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBZRUFSID0gMDtcbiAgICB2YXIgTU9OVEggPSAxO1xuICAgIHZhciBEQVRFID0gMjtcbiAgICB2YXIgSE9VUiA9IDM7XG4gICAgdmFyIE1JTlVURSA9IDQ7XG4gICAgdmFyIFNFQ09ORCA9IDU7XG4gICAgdmFyIE1JTExJU0VDT05EID0gNjtcblxuICAgIGZ1bmN0aW9uIGRheXNJbk1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCArIDEsIDApKS5nZXRVVENEYXRlKCk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ00nLCBbJ01NJywgMl0sICdNbycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9udGgoKSArIDE7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ21vbnRoJywgJ00nKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ00nLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NJywgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignTU1NJywgIG1hdGNoV29yZCk7XG4gICAgYWRkUmVnZXhUb2tlbignTU1NTScsIG1hdGNoV29yZCk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnTScsICdNTSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9IHRvSW50KGlucHV0KSAtIDE7XG4gICAgfSk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnTU1NJywgJ01NTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB2YXIgbW9udGggPSBjb25maWcuX2xvY2FsZS5tb250aHNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGZpbmQgYSBtb250aCBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWQuXG4gICAgICAgIGlmIChtb250aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhcnJheVtNT05USF0gPSBtb250aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRNb250aCA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZU1vbnRocyA9ICdKYW51YXJ5X0ZlYnJ1YXJ5X01hcmNoX0FwcmlsX01heV9KdW5lX0p1bHlfQXVndXN0X1NlcHRlbWJlcl9PY3RvYmVyX05vdmVtYmVyX0RlY2VtYmVyJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRocyAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzW20ubW9udGgoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydCA9ICdKYW5fRmViX01hcl9BcHJfTWF5X0p1bl9KdWxfQXVnX1NlcF9PY3RfTm92X0RlYycuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHNTaG9ydCAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRbbS5tb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHNQYXJzZSAobW9udGhOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICBpZiAoIXRoaXMuX21vbnRoc1BhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICBtb20gPSBjcmVhdGVfdXRjX19jcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgIXRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykucmVwbGFjZSgnLicsICcnKSArICckJywgJ2knKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXN0cmljdCAmJiAhdGhpcy5fbW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdNTU1NJyAmJiB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdNTU0nICYmIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzdHJpY3QgJiYgdGhpcy5fbW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBzZXRNb250aCAobW9tLCB2YWx1ZSkge1xuICAgICAgICB2YXIgZGF5T2ZNb250aDtcblxuICAgICAgICAvLyBUT0RPOiBNb3ZlIHRoaXMgb3V0IG9mIGhlcmUhXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG1vbS5sb2NhbGVEYXRhKCkubW9udGhzUGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgLy8gVE9ETzogQW5vdGhlciBzaWxlbnQgZmFpbHVyZT9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRheU9mTW9udGggPSBNYXRoLm1pbihtb20uZGF0ZSgpLCBkYXlzSW5Nb250aChtb20ueWVhcigpLCB2YWx1ZSkpO1xuICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgJ01vbnRoJ10odmFsdWUsIGRheU9mTW9udGgpO1xuICAgICAgICByZXR1cm4gbW9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldE1vbnRoICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgc2V0TW9udGgodGhpcywgdmFsdWUpO1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdldF9zZXRfX2dldCh0aGlzLCAnTW9udGgnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERheXNJbk1vbnRoICgpIHtcbiAgICAgICAgcmV0dXJuIGRheXNJbk1vbnRoKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3cgKG0pIHtcbiAgICAgICAgdmFyIG92ZXJmbG93O1xuICAgICAgICB2YXIgYSA9IG0uX2E7XG5cbiAgICAgICAgaWYgKGEgJiYgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID09PSAtMikge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPVxuICAgICAgICAgICAgICAgIGFbTU9OVEhdICAgICAgIDwgMCB8fCBhW01PTlRIXSAgICAgICA+IDExICA/IE1PTlRIIDpcbiAgICAgICAgICAgICAgICBhW0RBVEVdICAgICAgICA8IDEgfHwgYVtEQVRFXSAgICAgICAgPiBkYXlzSW5Nb250aChhW1lFQVJdLCBhW01PTlRIXSkgPyBEQVRFIDpcbiAgICAgICAgICAgICAgICBhW0hPVVJdICAgICAgICA8IDAgfHwgYVtIT1VSXSAgICAgICAgPiAyNCB8fCAoYVtIT1VSXSA9PT0gMjQgJiYgKGFbTUlOVVRFXSAhPT0gMCB8fCBhW1NFQ09ORF0gIT09IDAgfHwgYVtNSUxMSVNFQ09ORF0gIT09IDApKSA/IEhPVVIgOlxuICAgICAgICAgICAgICAgIGFbTUlOVVRFXSAgICAgIDwgMCB8fCBhW01JTlVURV0gICAgICA+IDU5ICA/IE1JTlVURSA6XG4gICAgICAgICAgICAgICAgYVtTRUNPTkRdICAgICAgPCAwIHx8IGFbU0VDT05EXSAgICAgID4gNTkgID8gU0VDT05EIDpcbiAgICAgICAgICAgICAgICBhW01JTExJU0VDT05EXSA8IDAgfHwgYVtNSUxMSVNFQ09ORF0gPiA5OTkgPyBNSUxMSVNFQ09ORCA6XG4gICAgICAgICAgICAgICAgLTE7XG5cbiAgICAgICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MobSkuX292ZXJmbG93RGF5T2ZZZWFyICYmIChvdmVyZmxvdyA8IFlFQVIgfHwgb3ZlcmZsb3cgPiBEQVRFKSkge1xuICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gREFURTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID0gb3ZlcmZsb3c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YXJuKG1zZykge1xuICAgICAgICBpZiAodXRpbHNfaG9va3NfX2hvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9PT0gZmFsc2UgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdEZXByZWNhdGlvbiB3YXJuaW5nOiAnICsgbXNnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZShtc2csIGZuKSB7XG4gICAgICAgIHZhciBmaXJzdFRpbWUgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybiBleHRlbmQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICAgICAgICAgIHdhcm4obXNnICsgJ1xcbicgKyAobmV3IEVycm9yKCkpLnN0YWNrKTtcbiAgICAgICAgICAgICAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LCBmbik7XG4gICAgfVxuXG4gICAgdmFyIGRlcHJlY2F0aW9ucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlU2ltcGxlKG5hbWUsIG1zZykge1xuICAgICAgICBpZiAoIWRlcHJlY2F0aW9uc1tuYW1lXSkge1xuICAgICAgICAgICAgd2Fybihtc2cpO1xuICAgICAgICAgICAgZGVwcmVjYXRpb25zW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPSBmYWxzZTtcblxuICAgIHZhciBmcm9tX3N0cmluZ19faXNvUmVnZXggPSAvXlxccyooPzpbKy1dXFxkezZ9fFxcZHs0fSktKD86KFxcZFxcZC1cXGRcXGQpfChXXFxkXFxkJCl8KFdcXGRcXGQtXFxkKXwoXFxkXFxkXFxkKSkoKFR8ICkoXFxkXFxkKDpcXGRcXGQoOlxcZFxcZChcXC5cXGQrKT8pPyk/KT8oW1xcK1xcLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvO1xuXG4gICAgdmFyIGlzb0RhdGVzID0gW1xuICAgICAgICBbJ1lZWVlZWS1NTS1ERCcsIC9bKy1dXFxkezZ9LVxcZHsyfS1cXGR7Mn0vXSxcbiAgICAgICAgWydZWVlZLU1NLUREJywgL1xcZHs0fS1cXGR7Mn0tXFxkezJ9L10sXG4gICAgICAgIFsnR0dHRy1bV11XVy1FJywgL1xcZHs0fS1XXFxkezJ9LVxcZC9dLFxuICAgICAgICBbJ0dHR0ctW1ddV1cnLCAvXFxkezR9LVdcXGR7Mn0vXSxcbiAgICAgICAgWydZWVlZLURERCcsIC9cXGR7NH0tXFxkezN9L11cbiAgICBdO1xuXG4gICAgLy8gaXNvIHRpbWUgZm9ybWF0cyBhbmQgcmVnZXhlc1xuICAgIHZhciBpc29UaW1lcyA9IFtcbiAgICAgICAgWydISDptbTpzcy5TU1NTJywgLyhUfCApXFxkXFxkOlxcZFxcZDpcXGRcXGRcXC5cXGQrL10sXG4gICAgICAgIFsnSEg6bW06c3MnLCAvKFR8IClcXGRcXGQ6XFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICBbJ0hIOm1tJywgLyhUfCApXFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICBbJ0hIJywgLyhUfCApXFxkXFxkL11cbiAgICBdO1xuXG4gICAgdmFyIGFzcE5ldEpzb25SZWdleCA9IC9eXFwvP0RhdGVcXCgoXFwtP1xcZCspL2k7XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdFxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21JU08oY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBsLFxuICAgICAgICAgICAgc3RyaW5nID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgbWF0Y2ggPSBmcm9tX3N0cmluZ19faXNvUmVnZXguZXhlYyhzdHJpbmcpO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaXNvID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29EYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvRGF0ZXNbaV1bMV0uZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fZiA9IGlzb0RhdGVzW2ldWzBdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvVGltZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzb1RpbWVzW2ldWzFdLmV4ZWMoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaFs2XSBzaG91bGQgYmUgJ1QnIG9yIHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fZiArPSAobWF0Y2hbNl0gfHwgJyAnKSArIGlzb1RpbWVzW2ldWzBdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RyaW5nLm1hdGNoKG1hdGNoT2Zmc2V0KSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fZiArPSAnWic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0IG9yIGZhbGxiYWNrXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZyhjb25maWcpIHtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBhc3BOZXRKc29uUmVnZXguZXhlYyhjb25maWcuX2kpO1xuXG4gICAgICAgIGlmIChtYXRjaGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgrbWF0Y2hlZFsxXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcuX2lzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLl9pc1ZhbGlkO1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1dGlsc19ob29rc19faG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2sgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQgY29uc3RydWN0aW9uIGZhbGxzIGJhY2sgdG8ganMgRGF0ZS4gVGhpcyBpcyAnICtcbiAgICAgICAgJ2Rpc2NvdXJhZ2VkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdXBjb21pbmcgbWFqb3IgJyArXG4gICAgICAgICdyZWxlYXNlLiBQbGVhc2UgcmVmZXIgdG8gJyArXG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQwNyBmb3IgbW9yZSBpbmZvLicsXG4gICAgICAgIGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5faSArIChjb25maWcuX3VzZVVUQyA/ICcgVVRDJyA6ICcnKSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlRGF0ZSAoeSwgbSwgZCwgaCwgTSwgcywgbXMpIHtcbiAgICAgICAgLy9jYW4ndCBqdXN0IGFwcGx5KCkgdG8gY3JlYXRlIGEgZGF0ZTpcbiAgICAgICAgLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MTM0OC9pbnN0YW50aWF0aW5nLWEtamF2YXNjcmlwdC1vYmplY3QtYnktY2FsbGluZy1wcm90b3R5cGUtY29uc3RydWN0b3ItYXBwbHlcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcyk7XG5cbiAgICAgICAgLy90aGUgZGF0ZSBjb25zdHJ1Y3RvciBkb2Vzbid0IGFjY2VwdCB5ZWFycyA8IDE5NzBcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldEZ1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVUQ0RhdGUgKHkpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShudWxsLCBhcmd1bWVudHMpKTtcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVknLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy55ZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVknLCAgIDRdLCAgICAgICAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVknLCAgNV0sICAgICAgIDAsICd5ZWFyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZWVknLCA2LCB0cnVlXSwgMCwgJ3llYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygneWVhcicsICd5Jyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdZJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVknLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVknLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZWScsICBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVlZJywgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ1lZWVlZJywgJ1lZWVlZWSddLCBZRUFSKTtcbiAgICBhZGRQYXJzZVRva2VuKCdZWVlZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IGlucHV0Lmxlbmd0aCA9PT0gMiA/IHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCkgOiB0b0ludChpbnB1dCk7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignWVknLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W1lFQVJdID0gdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIGRheXNJblllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih5ZWFyKSA/IDM2NiA6IDM2NTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0xlYXBZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuICh5ZWFyICUgNCA9PT0gMCAmJiB5ZWFyICUgMTAwICE9PSAwKSB8fCB5ZWFyICUgNDAwID09PSAwO1xuICAgIH1cblxuICAgIC8vIEhPT0tTXG5cbiAgICB1dGlsc19ob29rc19faG9va3MucGFyc2VUd29EaWdpdFllYXIgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRvSW50KGlucHV0KSArICh0b0ludChpbnB1dCkgPiA2OCA/IDE5MDAgOiAyMDAwKTtcbiAgICB9O1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldFllYXIgPSBtYWtlR2V0U2V0KCdGdWxsWWVhcicsIGZhbHNlKTtcblxuICAgIGZ1bmN0aW9uIGdldElzTGVhcFllYXIgKCkge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih0aGlzLnllYXIoKSk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3cnLCBbJ3d3JywgMl0sICd3bycsICd3ZWVrJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ1cnLCBbJ1dXJywgMl0sICdXbycsICdpc29XZWVrJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3dlZWsnLCAndycpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2VlaycsICdXJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd3JywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignd3cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignVycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1dXJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWyd3JywgJ3d3JywgJ1cnLCAnV1cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW4uc3Vic3RyKDAsIDEpXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vIGZpcnN0RGF5T2ZXZWVrICAgICAgIDAgPSBzdW4sIDYgPSBzYXRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICB0aGUgZGF5IG9mIHRoZSB3ZWVrIHRoYXQgc3RhcnRzIHRoZSB3ZWVrXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgKHVzdWFsbHkgc3VuZGF5IG9yIG1vbmRheSlcbiAgICAvLyBmaXJzdERheU9mV2Vla09mWWVhciAwID0gc3VuLCA2ID0gc2F0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgdGhlIGZpcnN0IHdlZWsgaXMgdGhlIHdlZWsgdGhhdCBjb250YWlucyB0aGUgZmlyc3RcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICBvZiB0aGlzIGRheSBvZiB0aGUgd2Vla1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIChlZy4gSVNPIHdlZWtzIHVzZSB0aHVyc2RheSAoNCkpXG4gICAgZnVuY3Rpb24gd2Vla09mWWVhcihtb20sIGZpcnN0RGF5T2ZXZWVrLCBmaXJzdERheU9mV2Vla09mWWVhcikge1xuICAgICAgICB2YXIgZW5kID0gZmlyc3REYXlPZldlZWtPZlllYXIgLSBmaXJzdERheU9mV2VlayxcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayA9IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIC0gbW9tLmRheSgpLFxuICAgICAgICAgICAgYWRqdXN0ZWRNb21lbnQ7XG5cblxuICAgICAgICBpZiAoZGF5c1RvRGF5T2ZXZWVrID4gZW5kKSB7XG4gICAgICAgICAgICBkYXlzVG9EYXlPZldlZWsgLT0gNztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXlzVG9EYXlPZldlZWsgPCBlbmQgLSA3KSB7XG4gICAgICAgICAgICBkYXlzVG9EYXlPZldlZWsgKz0gNztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkanVzdGVkTW9tZW50ID0gbG9jYWxfX2NyZWF0ZUxvY2FsKG1vbSkuYWRkKGRheXNUb0RheU9mV2VlaywgJ2QnKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdlZWs6IE1hdGguY2VpbChhZGp1c3RlZE1vbWVudC5kYXlPZlllYXIoKSAvIDcpLFxuICAgICAgICAgICAgeWVhcjogYWRqdXN0ZWRNb21lbnQueWVhcigpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlV2VlayAobW9tKSB7XG4gICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKG1vbSwgdGhpcy5fd2Vlay5kb3csIHRoaXMuX3dlZWsuZG95KS53ZWVrO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2VlayA9IHtcbiAgICAgICAgZG93IDogMCwgLy8gU3VuZGF5IGlzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgICAgIGRveSA6IDYgIC8vIFRoZSB3ZWVrIHRoYXQgY29udGFpbnMgSmFuIDFzdCBpcyB0aGUgZmlyc3Qgd2VlayBvZiB0aGUgeWVhci5cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlRmlyc3REYXlPZldlZWsgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vlay5kb3c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlRmlyc3REYXlPZlllYXIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vlay5kb3k7XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHdlZWsgPSB0aGlzLmxvY2FsZURhdGEoKS53ZWVrKHRoaXMpO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPV2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHdlZWsgPSB3ZWVrT2ZZZWFyKHRoaXMsIDEsIDQpLndlZWs7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignREREJywgWydEREREJywgM10sICdERERvJywgJ2RheU9mWWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdkYXlPZlllYXInLCAnREREJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdEREQnLCAgbWF0Y2gxdG8zKTtcbiAgICBhZGRSZWdleFRva2VuKCdEREREJywgbWF0Y2gzKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnREREJywgJ0REREQnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy9odHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT193ZWVrX2RhdGUjQ2FsY3VsYXRpbmdfYV9kYXRlX2dpdmVuX3RoZV95ZWFyLjJDX3dlZWtfbnVtYmVyX2FuZF93ZWVrZGF5XG4gICAgZnVuY3Rpb24gZGF5T2ZZZWFyRnJvbVdlZWtzKHllYXIsIHdlZWssIHdlZWtkYXksIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyLCBmaXJzdERheU9mV2Vlaykge1xuICAgICAgICB2YXIgd2VlazFKYW4gPSA2ICsgZmlyc3REYXlPZldlZWsgLSBmaXJzdERheU9mV2Vla09mWWVhciwgamFuWCA9IGNyZWF0ZVVUQ0RhdGUoeWVhciwgMCwgMSArIHdlZWsxSmFuKSwgZCA9IGphblguZ2V0VVRDRGF5KCksIGRheU9mWWVhcjtcbiAgICAgICAgaWYgKGQgPCBmaXJzdERheU9mV2Vlaykge1xuICAgICAgICAgICAgZCArPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgd2Vla2RheSA9IHdlZWtkYXkgIT0gbnVsbCA/IDEgKiB3ZWVrZGF5IDogZmlyc3REYXlPZldlZWs7XG5cbiAgICAgICAgZGF5T2ZZZWFyID0gMSArIHdlZWsxSmFuICsgNyAqICh3ZWVrIC0gMSkgLSBkICsgd2Vla2RheTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcjogZGF5T2ZZZWFyID4gMCA/IHllYXIgOiB5ZWFyIC0gMSxcbiAgICAgICAgICAgIGRheU9mWWVhcjogZGF5T2ZZZWFyID4gMCA/ICBkYXlPZlllYXIgOiBkYXlzSW5ZZWFyKHllYXIgLSAxKSArIGRheU9mWWVhclxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldERheU9mWWVhciAoaW5wdXQpIHtcbiAgICAgICAgdmFyIGRheU9mWWVhciA9IE1hdGgucm91bmQoKHRoaXMuY2xvbmUoKS5zdGFydE9mKCdkYXknKSAtIHRoaXMuY2xvbmUoKS5zdGFydE9mKCd5ZWFyJykpIC8gODY0ZTUpICsgMTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBkYXlPZlllYXIgOiB0aGlzLmFkZCgoaW5wdXQgLSBkYXlPZlllYXIpLCAnZCcpO1xuICAgIH1cblxuICAgIC8vIFBpY2sgdGhlIGZpcnN0IGRlZmluZWQgb2YgdHdvIG9yIHRocmVlIGFyZ3VtZW50cy5cbiAgICBmdW5jdGlvbiBkZWZhdWx0cyhhLCBiLCBjKSB7XG4gICAgICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMpIHtcbiAgICAgICAgICAgIHJldHVybiBbbm93LmdldFVUQ0Z1bGxZZWFyKCksIG5vdy5nZXRVVENNb250aCgpLCBub3cuZ2V0VVRDRGF0ZSgpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW25vdy5nZXRGdWxsWWVhcigpLCBub3cuZ2V0TW9udGgoKSwgbm93LmdldERhdGUoKV07XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBhbiBhcnJheSB0byBhIGRhdGUuXG4gICAgLy8gdGhlIGFycmF5IHNob3VsZCBtaXJyb3IgdGhlIHBhcmFtZXRlcnMgYmVsb3dcbiAgICAvLyBub3RlOiBhbGwgdmFsdWVzIHBhc3QgdGhlIHllYXIgYXJlIG9wdGlvbmFsIGFuZCB3aWxsIGRlZmF1bHQgdG8gdGhlIGxvd2VzdCBwb3NzaWJsZSB2YWx1ZS5cbiAgICAvLyBbeWVhciwgbW9udGgsIGRheSAsIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaXNlY29uZF1cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tQXJyYXkgKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgZGF0ZSwgaW5wdXQgPSBbXSwgY3VycmVudERhdGUsIHllYXJUb1VzZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKTtcblxuICAgICAgICAvL2NvbXB1dGUgZGF5IG9mIHRoZSB5ZWFyIGZyb20gd2Vla3MgYW5kIHdlZWtkYXlzXG4gICAgICAgIGlmIChjb25maWcuX3cgJiYgY29uZmlnLl9hW0RBVEVdID09IG51bGwgJiYgY29uZmlnLl9hW01PTlRIXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgdGhlIGRheSBvZiB0aGUgeWVhciBpcyBzZXQsIGZpZ3VyZSBvdXQgd2hhdCBpdCBpc1xuICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIpIHtcbiAgICAgICAgICAgIHllYXJUb1VzZSA9IGRlZmF1bHRzKGNvbmZpZy5fYVtZRUFSXSwgY3VycmVudERhdGVbWUVBUl0pO1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXJUb1VzZSkpIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dEYXlPZlllYXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRlID0gY3JlYXRlVVRDRGF0ZSh5ZWFyVG9Vc2UsIDAsIGNvbmZpZy5fZGF5T2ZZZWFyKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtNT05USF0gPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgICAgICAgICBjb25maWcuX2FbREFURV0gPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZmF1bHQgdG8gY3VycmVudCBkYXRlLlxuICAgICAgICAvLyAqIGlmIG5vIHllYXIsIG1vbnRoLCBkYXkgb2YgbW9udGggYXJlIGdpdmVuLCBkZWZhdWx0IHRvIHRvZGF5XG4gICAgICAgIC8vICogaWYgZGF5IG9mIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG1vbnRoIGFuZCB5ZWFyXG4gICAgICAgIC8vICogaWYgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgb25seSB5ZWFyXG4gICAgICAgIC8vICogaWYgeWVhciBpcyBnaXZlbiwgZG9uJ3QgZGVmYXVsdCBhbnl0aGluZ1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMyAmJiBjb25maWcuX2FbaV0gPT0gbnVsbDsgKytpKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IGN1cnJlbnREYXRlW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gWmVybyBvdXQgd2hhdGV2ZXIgd2FzIG5vdCBkZWZhdWx0ZWQsIGluY2x1ZGluZyB0aW1lXG4gICAgICAgIGZvciAoOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IChjb25maWcuX2FbaV0gPT0gbnVsbCkgPyAoaSA9PT0gMiA/IDEgOiAwKSA6IGNvbmZpZy5fYVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGZvciAyNDowMDowMC4wMDBcbiAgICAgICAgaWYgKGNvbmZpZy5fYVtIT1VSXSA9PT0gMjQgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbTUlOVVRFXSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtTRUNPTkRdID09PSAwICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW01JTExJU0VDT05EXSA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9uZXh0RGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2QgPSAoY29uZmlnLl91c2VVVEMgPyBjcmVhdGVVVENEYXRlIDogY3JlYXRlRGF0ZSkuYXBwbHkobnVsbCwgaW5wdXQpO1xuICAgICAgICAvLyBBcHBseSB0aW1lem9uZSBvZmZzZXQgZnJvbSBpbnB1dC4gVGhlIGFjdHVhbCB1dGNPZmZzZXQgY2FuIGJlIGNoYW5nZWRcbiAgICAgICAgLy8gd2l0aCBwYXJzZVpvbmUuXG4gICAgICAgIGlmIChjb25maWcuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2Quc2V0VVRDTWludXRlcyhjb25maWcuX2QuZ2V0VVRDTWludXRlcygpIC0gY29uZmlnLl90em0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fbmV4dERheSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMjQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKSB7XG4gICAgICAgIHZhciB3LCB3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3ksIHRlbXA7XG5cbiAgICAgICAgdyA9IGNvbmZpZy5fdztcbiAgICAgICAgaWYgKHcuR0cgIT0gbnVsbCB8fCB3LlcgIT0gbnVsbCB8fCB3LkUgIT0gbnVsbCkge1xuICAgICAgICAgICAgZG93ID0gMTtcbiAgICAgICAgICAgIGRveSA9IDQ7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IFdlIG5lZWQgdG8gdGFrZSB0aGUgY3VycmVudCBpc29XZWVrWWVhciwgYnV0IHRoYXQgZGVwZW5kcyBvblxuICAgICAgICAgICAgLy8gaG93IHdlIGludGVycHJldCBub3cgKGxvY2FsLCB1dGMsIGZpeGVkIG9mZnNldCkuIFNvIGNyZWF0ZVxuICAgICAgICAgICAgLy8gYSBub3cgdmVyc2lvbiBvZiBjdXJyZW50IGNvbmZpZyAodGFrZSBsb2NhbC91dGMvb2Zmc2V0IGZsYWdzLCBhbmRcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBub3cpLlxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZWZhdWx0cyh3LkdHLCBjb25maWcuX2FbWUVBUl0sIHdlZWtPZlllYXIobG9jYWxfX2NyZWF0ZUxvY2FsKCksIDEsIDQpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcuVywgMSk7XG4gICAgICAgICAgICB3ZWVrZGF5ID0gZGVmYXVsdHMody5FLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvdyA9IGNvbmZpZy5fbG9jYWxlLl93ZWVrLmRvdztcbiAgICAgICAgICAgIGRveSA9IGNvbmZpZy5fbG9jYWxlLl93ZWVrLmRveTtcblxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZWZhdWx0cyh3LmdnLCBjb25maWcuX2FbWUVBUl0sIHdlZWtPZlllYXIobG9jYWxfX2NyZWF0ZUxvY2FsKCksIGRvdywgZG95KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LncsIDEpO1xuXG4gICAgICAgICAgICBpZiAody5kICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyB3ZWVrZGF5IC0tIGxvdyBkYXkgbnVtYmVycyBhcmUgY29uc2lkZXJlZCBuZXh0IHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5kO1xuICAgICAgICAgICAgICAgIGlmICh3ZWVrZGF5IDwgZG93KSB7XG4gICAgICAgICAgICAgICAgICAgICsrd2VlaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHcuZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9jYWwgd2Vla2RheSAtLSBjb3VudGluZyBzdGFydHMgZnJvbSBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IHcuZSArIGRvdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IGRvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3ksIGRvdyk7XG5cbiAgICAgICAgY29uZmlnLl9hW1lFQVJdID0gdGVtcC55ZWFyO1xuICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRlbXAuZGF5T2ZZZWFyO1xuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5JU09fODYwMSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgZm9ybWF0IHN0cmluZ1xuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKSB7XG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhpcyB0byBhbm90aGVyIHBhcnQgb2YgdGhlIGNyZWF0aW9uIGZsb3cgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzXG4gICAgICAgIGlmIChjb25maWcuX2YgPT09IHV0aWxzX2hvb2tzX19ob29rcy5JU09fODYwMSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbUlTTyhjb25maWcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9hID0gW107XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGlzIGFycmF5IGlzIHVzZWQgdG8gbWFrZSBhIERhdGUsIGVpdGhlciB3aXRoIGBuZXcgRGF0ZWAgb3IgYERhdGUuVVRDYFxuICAgICAgICB2YXIgc3RyaW5nID0gJycgKyBjb25maWcuX2ksXG4gICAgICAgICAgICBpLCBwYXJzZWRJbnB1dCwgdG9rZW5zLCB0b2tlbiwgc2tpcHBlZCxcbiAgICAgICAgICAgIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoID0gMDtcblxuICAgICAgICB0b2tlbnMgPSBleHBhbmRGb3JtYXQoY29uZmlnLl9mLCBjb25maWcuX2xvY2FsZSkubWF0Y2goZm9ybWF0dGluZ1Rva2VucykgfHwgW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICBwYXJzZWRJbnB1dCA9IChzdHJpbmcubWF0Y2goZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKSB8fCBbXSlbMF07XG4gICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBza2lwcGVkID0gc3RyaW5nLnN1YnN0cigwLCBzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkpO1xuICAgICAgICAgICAgICAgIGlmIChza2lwcGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkSW5wdXQucHVzaChza2lwcGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnNsaWNlKHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSArIHBhcnNlZElucHV0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCArPSBwYXJzZWRJbnB1dC5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkb24ndCBwYXJzZSBpZiBpdCdzIG5vdCBhIGtub3duIHRva2VuXG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBwYXJzZWRJbnB1dCwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbmZpZy5fc3RyaWN0ICYmICFwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCByZW1haW5pbmcgdW5wYXJzZWQgaW5wdXQgbGVuZ3RoIHRvIHRoZSBzdHJpbmdcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuY2hhcnNMZWZ0T3ZlciA9IHN0cmluZ0xlbmd0aCAtIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGg7XG4gICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkSW5wdXQucHVzaChzdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xlYXIgXzEyaCBmbGFnIGlmIGhvdXIgaXMgPD0gMTJcbiAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPD0gMTIgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPiAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIGhhbmRsZSBtZXJpZGllbVxuICAgICAgICBjb25maWcuX2FbSE9VUl0gPSBtZXJpZGllbUZpeFdyYXAoY29uZmlnLl9sb2NhbGUsIGNvbmZpZy5fYVtIT1VSXSwgY29uZmlnLl9tZXJpZGllbSk7XG5cbiAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIG1lcmlkaWVtRml4V3JhcCAobG9jYWxlLCBob3VyLCBtZXJpZGllbSkge1xuICAgICAgICB2YXIgaXNQbTtcblxuICAgICAgICBpZiAobWVyaWRpZW0gPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbm90aGluZyB0byBkb1xuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZS5tZXJpZGllbUhvdXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5tZXJpZGllbUhvdXIoaG91ciwgbWVyaWRpZW0pO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsZS5pc1BNICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEZhbGxiYWNrXG4gICAgICAgICAgICBpc1BtID0gbG9jYWxlLmlzUE0obWVyaWRpZW0pO1xuICAgICAgICAgICAgaWYgKGlzUG0gJiYgaG91ciA8IDEyKSB7XG4gICAgICAgICAgICAgICAgaG91ciArPSAxMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNQbSAmJiBob3VyID09PSAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5vdCBzdXBwb3NlZCB0byBoYXBwZW5cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgdGVtcENvbmZpZyxcbiAgICAgICAgICAgIGJlc3RNb21lbnQsXG5cbiAgICAgICAgICAgIHNjb3JlVG9CZWF0LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9mLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZEZvcm1hdCA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbmZpZy5fZi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VycmVudFNjb3JlID0gMDtcbiAgICAgICAgICAgIHRlbXBDb25maWcgPSBjb3B5Q29uZmlnKHt9LCBjb25maWcpO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wQ29uZmlnLl91c2VVVEMgPSBjb25maWcuX3VzZVVUQztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBDb25maWcuX2YgPSBjb25maWcuX2ZbaV07XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KHRlbXBDb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkX19pc1ZhbGlkKHRlbXBDb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFueSBpbnB1dCB0aGF0IHdhcyBub3QgcGFyc2VkIGFkZCBhIHBlbmFsdHkgZm9yIHRoYXQgZm9ybWF0XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLmNoYXJzTGVmdE92ZXI7XG5cbiAgICAgICAgICAgIC8vb3IgdG9rZW5zXG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLnVudXNlZFRva2Vucy5sZW5ndGggKiAxMDtcblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLnNjb3JlID0gY3VycmVudFNjb3JlO1xuXG4gICAgICAgICAgICBpZiAoc2NvcmVUb0JlYXQgPT0gbnVsbCB8fCBjdXJyZW50U2NvcmUgPCBzY29yZVRvQmVhdCkge1xuICAgICAgICAgICAgICAgIHNjb3JlVG9CZWF0ID0gY3VycmVudFNjb3JlO1xuICAgICAgICAgICAgICAgIGJlc3RNb21lbnQgPSB0ZW1wQ29uZmlnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXh0ZW5kKGNvbmZpZywgYmVzdE1vbWVudCB8fCB0ZW1wQ29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tT2JqZWN0KGNvbmZpZykge1xuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaSA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGNvbmZpZy5faSk7XG4gICAgICAgIGNvbmZpZy5fYSA9IFtpLnllYXIsIGkubW9udGgsIGkuZGF5IHx8IGkuZGF0ZSwgaS5ob3VyLCBpLm1pbnV0ZSwgaS5zZWNvbmQsIGkubWlsbGlzZWNvbmRdO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUZyb21Db25maWcgKGNvbmZpZykge1xuICAgICAgICB2YXIgcmVzID0gbmV3IE1vbWVudChjaGVja092ZXJmbG93KHByZXBhcmVDb25maWcoY29uZmlnKSkpO1xuICAgICAgICBpZiAocmVzLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICAvLyBBZGRpbmcgaXMgc21hcnQgZW5vdWdoIGFyb3VuZCBEU1RcbiAgICAgICAgICAgIHJlcy5hZGQoMSwgJ2QnKTtcbiAgICAgICAgICAgIHJlcy5fbmV4dERheSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcGFyZUNvbmZpZyAoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGNvbmZpZy5fZjtcblxuICAgICAgICBjb25maWcuX2xvY2FsZSA9IGNvbmZpZy5fbG9jYWxlIHx8IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoY29uZmlnLl9sKTtcblxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgKGZvcm1hdCA9PT0gdW5kZWZpbmVkICYmIGlucHV0ID09PSAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWxpZF9fY3JlYXRlSW52YWxpZCh7bnVsbElucHV0OiB0cnVlfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnLl9pID0gaW5wdXQgPSBjb25maWcuX2xvY2FsZS5wcmVwYXJzZShpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNNb21lbnQoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vbWVudChjaGVja092ZXJmbG93KGlucHV0KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShmb3JtYXQpKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tSW5wdXQoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faTtcbiAgICAgICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK2lucHV0KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nKGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYSA9IG1hcChpbnB1dC5zbGljZSgwKSwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChvYmosIDEwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKGlucHV0KSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoaW5wdXQpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gZnJvbSBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGlucHV0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlTG9jYWxPclVUQyAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIGlzVVRDKSB7XG4gICAgICAgIHZhciBjID0ge307XG5cbiAgICAgICAgaWYgKHR5cGVvZihsb2NhbGUpID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHN0cmljdCA9IGxvY2FsZTtcbiAgICAgICAgICAgIGxvY2FsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBvYmplY3QgY29uc3RydWN0aW9uIG11c3QgYmUgZG9uZSB0aGlzIHdheS5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MjNcbiAgICAgICAgYy5faXNBTW9tZW50T2JqZWN0ID0gdHJ1ZTtcbiAgICAgICAgYy5fdXNlVVRDID0gYy5faXNVVEMgPSBpc1VUQztcbiAgICAgICAgYy5fbCA9IGxvY2FsZTtcbiAgICAgICAgYy5faSA9IGlucHV0O1xuICAgICAgICBjLl9mID0gZm9ybWF0O1xuICAgICAgICBjLl9zdHJpY3QgPSBzdHJpY3Q7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUZyb21Db25maWcoYyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxfX2NyZWF0ZUxvY2FsIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgZmFsc2UpO1xuICAgIH1cblxuICAgIHZhciBwcm90b3R5cGVNaW4gPSBkZXByZWNhdGUoXG4gICAgICAgICAnbW9tZW50KCkubWluIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWluIGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNTQ4JyxcbiAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICB2YXIgb3RoZXIgPSBsb2NhbF9fY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICByZXR1cm4gb3RoZXIgPCB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICAgfVxuICAgICApO1xuXG4gICAgdmFyIHByb3RvdHlwZU1heCA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudCgpLm1heCBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1heCBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OCcsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvdGhlciA9IGxvY2FsX19jcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIG90aGVyID4gdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBQaWNrIGEgbW9tZW50IG0gZnJvbSBtb21lbnRzIHNvIHRoYXQgbVtmbl0ob3RoZXIpIGlzIHRydWUgZm9yIGFsbFxuICAgIC8vIG90aGVyLiBUaGlzIHJlbGllcyBvbiB0aGUgZnVuY3Rpb24gZm4gdG8gYmUgdHJhbnNpdGl2ZS5cbiAgICAvL1xuICAgIC8vIG1vbWVudHMgc2hvdWxkIGVpdGhlciBiZSBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cyBvciBhbiBhcnJheSwgd2hvc2VcbiAgICAvLyBmaXJzdCBlbGVtZW50IGlzIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzLlxuICAgIGZ1bmN0aW9uIHBpY2tCeShmbiwgbW9tZW50cykge1xuICAgICAgICB2YXIgcmVzLCBpO1xuICAgICAgICBpZiAobW9tZW50cy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShtb21lbnRzWzBdKSkge1xuICAgICAgICAgICAgbW9tZW50cyA9IG1vbWVudHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtb21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsX19jcmVhdGVMb2NhbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IG1vbWVudHNbMF07XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBtb21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoIW1vbWVudHNbaV0uaXNWYWxpZCgpIHx8IG1vbWVudHNbaV1bZm5dKHJlcykpIHtcbiAgICAgICAgICAgICAgICByZXMgPSBtb21lbnRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVXNlIFtdLnNvcnQgaW5zdGVhZD9cbiAgICBmdW5jdGlvbiBtaW4gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0JlZm9yZScsIGFyZ3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1heCAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQWZ0ZXInLCBhcmdzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBEdXJhdGlvbiAoZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGR1cmF0aW9uKSxcbiAgICAgICAgICAgIHllYXJzID0gbm9ybWFsaXplZElucHV0LnllYXIgfHwgMCxcbiAgICAgICAgICAgIHF1YXJ0ZXJzID0gbm9ybWFsaXplZElucHV0LnF1YXJ0ZXIgfHwgMCxcbiAgICAgICAgICAgIG1vbnRocyA9IG5vcm1hbGl6ZWRJbnB1dC5tb250aCB8fCAwLFxuICAgICAgICAgICAgd2Vla3MgPSBub3JtYWxpemVkSW5wdXQud2VlayB8fCAwLFxuICAgICAgICAgICAgZGF5cyA9IG5vcm1hbGl6ZWRJbnB1dC5kYXkgfHwgMCxcbiAgICAgICAgICAgIGhvdXJzID0gbm9ybWFsaXplZElucHV0LmhvdXIgfHwgMCxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBub3JtYWxpemVkSW5wdXQubWludXRlIHx8IDAsXG4gICAgICAgICAgICBzZWNvbmRzID0gbm9ybWFsaXplZElucHV0LnNlY29uZCB8fCAwLFxuICAgICAgICAgICAgbWlsbGlzZWNvbmRzID0gbm9ybWFsaXplZElucHV0Lm1pbGxpc2Vjb25kIHx8IDA7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50YXRpb24gZm9yIGRhdGVBZGRSZW1vdmVcbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gK21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICBzZWNvbmRzICogMWUzICsgLy8gMTAwMFxuICAgICAgICAgICAgbWludXRlcyAqIDZlNCArIC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgaG91cnMgKiAzNmU1OyAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAvLyBCZWNhdXNlIG9mIGRhdGVBZGRSZW1vdmUgdHJlYXRzIDI0IGhvdXJzIGFzIGRpZmZlcmVudCBmcm9tIGFcbiAgICAgICAgLy8gZGF5IHdoZW4gd29ya2luZyBhcm91bmQgRFNULCB3ZSBuZWVkIHRvIHN0b3JlIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9kYXlzID0gK2RheXMgK1xuICAgICAgICAgICAgd2Vla3MgKiA3O1xuICAgICAgICAvLyBJdCBpcyBpbXBvc3NpYmxlIHRyYW5zbGF0ZSBtb250aHMgaW50byBkYXlzIHdpdGhvdXQga25vd2luZ1xuICAgICAgICAvLyB3aGljaCBtb250aHMgeW91IGFyZSBhcmUgdGFsa2luZyBhYm91dCwgc28gd2UgaGF2ZSB0byBzdG9yZVxuICAgICAgICAvLyBpdCBzZXBhcmF0ZWx5LlxuICAgICAgICB0aGlzLl9tb250aHMgPSArbW9udGhzICtcbiAgICAgICAgICAgIHF1YXJ0ZXJzICogMyArXG4gICAgICAgICAgICB5ZWFycyAqIDEyO1xuXG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcblxuICAgICAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKCk7XG5cbiAgICAgICAgdGhpcy5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEdXJhdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEdXJhdGlvbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvZmZzZXQgKHRva2VuLCBzZXBhcmF0b3IpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnV0Y09mZnNldCgpO1xuICAgICAgICAgICAgdmFyIHNpZ24gPSAnKyc7XG4gICAgICAgICAgICBpZiAob2Zmc2V0IDwgMCkge1xuICAgICAgICAgICAgICAgIG9mZnNldCA9IC1vZmZzZXQ7XG4gICAgICAgICAgICAgICAgc2lnbiA9ICctJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzaWduICsgemVyb0ZpbGwofn4ob2Zmc2V0IC8gNjApLCAyKSArIHNlcGFyYXRvciArIHplcm9GaWxsKH5+KG9mZnNldCkgJSA2MCwgMik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9mZnNldCgnWicsICc6Jyk7XG4gICAgb2Zmc2V0KCdaWicsICcnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1onLCAgbWF0Y2hPZmZzZXQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1paJywgbWF0Y2hPZmZzZXQpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydaJywgJ1paJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgIGNvbmZpZy5fdHptID0gb2Zmc2V0RnJvbVN0cmluZyhpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyB0aW1lem9uZSBjaHVua2VyXG4gICAgLy8gJysxMDowMCcgPiBbJzEwJywgICcwMCddXG4gICAgLy8gJy0xNTMwJyAgPiBbJy0xNScsICczMCddXG4gICAgdmFyIGNodW5rT2Zmc2V0ID0gLyhbXFwrXFwtXXxcXGRcXGQpL2dpO1xuXG4gICAgZnVuY3Rpb24gb2Zmc2V0RnJvbVN0cmluZyhzdHJpbmcpIHtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSAoKHN0cmluZyB8fCAnJykubWF0Y2gobWF0Y2hPZmZzZXQpIHx8IFtdKTtcbiAgICAgICAgdmFyIGNodW5rICAgPSBtYXRjaGVzW21hdGNoZXMubGVuZ3RoIC0gMV0gfHwgW107XG4gICAgICAgIHZhciBwYXJ0cyAgID0gKGNodW5rICsgJycpLm1hdGNoKGNodW5rT2Zmc2V0KSB8fCBbJy0nLCAwLCAwXTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSArKHBhcnRzWzFdICogNjApICsgdG9JbnQocGFydHNbMl0pO1xuXG4gICAgICAgIHJldHVybiBwYXJ0c1swXSA9PT0gJysnID8gbWludXRlcyA6IC1taW51dGVzO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhIG1vbWVudCBmcm9tIGlucHV0LCB0aGF0IGlzIGxvY2FsL3V0Yy96b25lIGVxdWl2YWxlbnQgdG8gbW9kZWwuXG4gICAgZnVuY3Rpb24gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCBtb2RlbCkge1xuICAgICAgICB2YXIgcmVzLCBkaWZmO1xuICAgICAgICBpZiAobW9kZWwuX2lzVVRDKSB7XG4gICAgICAgICAgICByZXMgPSBtb2RlbC5jbG9uZSgpO1xuICAgICAgICAgICAgZGlmZiA9IChpc01vbWVudChpbnB1dCkgfHwgaXNEYXRlKGlucHV0KSA/ICtpbnB1dCA6ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpKSAtICgrcmVzKTtcbiAgICAgICAgICAgIC8vIFVzZSBsb3ctbGV2ZWwgYXBpLCBiZWNhdXNlIHRoaXMgZm4gaXMgbG93LWxldmVsIGFwaS5cbiAgICAgICAgICAgIHJlcy5fZC5zZXRUaW1lKCtyZXMuX2QgKyBkaWZmKTtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQocmVzLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCkubG9jYWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERhdGVPZmZzZXQgKG0pIHtcbiAgICAgICAgLy8gT24gRmlyZWZveC4yNCBEYXRlI2dldFRpbWV6b25lT2Zmc2V0IHJldHVybnMgYSBmbG9hdGluZyBwb2ludC5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvcHVsbC8xODcxXG4gICAgICAgIHJldHVybiAtTWF0aC5yb3VuZChtLl9kLmdldFRpbWV6b25lT2Zmc2V0KCkgLyAxNSkgKiAxNTtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBhIG1vbWVudCBpcyBtdXRhdGVkLlxuICAgIC8vIEl0IGlzIGludGVuZGVkIHRvIGtlZXAgdGhlIG9mZnNldCBpbiBzeW5jIHdpdGggdGhlIHRpbWV6b25lLlxuICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIC8vIGtlZXBMb2NhbFRpbWUgPSB0cnVlIG1lYW5zIG9ubHkgY2hhbmdlIHRoZSB0aW1lem9uZSwgd2l0aG91dFxuICAgIC8vIGFmZmVjdGluZyB0aGUgbG9jYWwgaG91ci4gU28gNTozMToyNiArMDMwMCAtLVt1dGNPZmZzZXQoMiwgdHJ1ZSldLS0+XG4gICAgLy8gNTozMToyNiArMDIwMCBJdCBpcyBwb3NzaWJsZSB0aGF0IDU6MzE6MjYgZG9lc24ndCBleGlzdCB3aXRoIG9mZnNldFxuICAgIC8vICswMjAwLCBzbyB3ZSBhZGp1c3QgdGhlIHRpbWUgYXMgbmVlZGVkLCB0byBiZSB2YWxpZC5cbiAgICAvL1xuICAgIC8vIEtlZXBpbmcgdGhlIHRpbWUgYWN0dWFsbHkgYWRkcy9zdWJ0cmFjdHMgKG9uZSBob3VyKVxuICAgIC8vIGZyb20gdGhlIGFjdHVhbCByZXByZXNlbnRlZCB0aW1lLiBUaGF0IGlzIHdoeSB3ZSBjYWxsIHVwZGF0ZU9mZnNldFxuICAgIC8vIGEgc2Vjb25kIHRpbWUuIEluIGNhc2UgaXQgd2FudHMgdXMgdG8gY2hhbmdlIHRoZSBvZmZzZXQgYWdhaW5cbiAgICAvLyBfY2hhbmdlSW5Qcm9ncmVzcyA9PSB0cnVlIGNhc2UsIHRoZW4gd2UgaGF2ZSB0byBhZGp1c3QsIGJlY2F1c2VcbiAgICAvLyB0aGVyZSBpcyBubyBzdWNoIHRpbWUgaW4gdGhlIGdpdmVuIHRpbWV6b25lLlxuICAgIGZ1bmN0aW9uIGdldFNldE9mZnNldCAoaW5wdXQsIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX29mZnNldCB8fCAwLFxuICAgICAgICAgICAgbG9jYWxBZGp1c3Q7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gb2Zmc2V0RnJvbVN0cmluZyhpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoaW5wdXQpIDwgMTYpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0ICogNjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzVVRDICYmIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICBsb2NhbEFkanVzdCA9IGdldERhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9vZmZzZXQgPSBpbnB1dDtcbiAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChsb2NhbEFkanVzdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQobG9jYWxBZGp1c3QsICdtJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2Zmc2V0ICE9PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlmICgha2VlcExvY2FsVGltZSB8fCB0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QodGhpcywgY3JlYXRlX19jcmVhdGVEdXJhdGlvbihpbnB1dCAtIG9mZnNldCwgJ20nKSwgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gb2Zmc2V0IDogZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldFpvbmUgKGlucHV0LCBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gLWlucHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldChpbnB1dCwga2VlcExvY2FsVGltZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC10aGlzLnV0Y09mZnNldCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9VVEMgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvTG9jYWwgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzVVRDKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJ0cmFjdChnZXREYXRlT2Zmc2V0KHRoaXMpLCAnbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3R6bSkge1xuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQodGhpcy5fdHptKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5faSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KG9mZnNldEZyb21TdHJpbmcodGhpcy5faSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc0FsaWduZWRIb3VyT2Zmc2V0IChpbnB1dCkge1xuICAgICAgICBpbnB1dCA9IGlucHV0ID8gbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KS51dGNPZmZzZXQoKSA6IDA7XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLnV0Y09mZnNldCgpIC0gaW5wdXQpICUgNjAgPT09IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXlsaWdodFNhdmluZ1RpbWUgKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCgwKS51dGNPZmZzZXQoKSB8fFxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCg1KS51dGNPZmZzZXQoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lU2hpZnRlZCAoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5faXNEU1RTaGlmdGVkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzRFNUU2hpZnRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjID0ge307XG5cbiAgICAgICAgY29weUNvbmZpZyhjLCB0aGlzKTtcbiAgICAgICAgYyA9IHByZXBhcmVDb25maWcoYyk7XG5cbiAgICAgICAgaWYgKGMuX2EpIHtcbiAgICAgICAgICAgIHZhciBvdGhlciA9IGMuX2lzVVRDID8gY3JlYXRlX3V0Y19fY3JlYXRlVVRDKGMuX2EpIDogbG9jYWxfX2NyZWF0ZUxvY2FsKGMuX2EpO1xuICAgICAgICAgICAgdGhpcy5faXNEU1RTaGlmdGVkID0gdGhpcy5pc1ZhbGlkKCkgJiZcbiAgICAgICAgICAgICAgICBjb21wYXJlQXJyYXlzKGMuX2EsIG90aGVyLnRvQXJyYXkoKSkgPiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faXNEU1RTaGlmdGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5faXNEU1RTaGlmdGVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTG9jYWwgKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuX2lzVVRDO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVXRjT2Zmc2V0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVXRjICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDICYmIHRoaXMuX29mZnNldCA9PT0gMDtcbiAgICB9XG5cbiAgICB2YXIgYXNwTmV0UmVnZXggPSAvKFxcLSk/KD86KFxcZCopXFwuKT8oXFxkKylcXDooXFxkKykoPzpcXDooXFxkKylcXC4/KFxcZHszfSk/KT8vO1xuXG4gICAgLy8gZnJvbSBodHRwOi8vZG9jcy5jbG9zdXJlLWxpYnJhcnkuZ29vZ2xlY29kZS5jb20vZ2l0L2Nsb3N1cmVfZ29vZ19kYXRlX2RhdGUuanMuc291cmNlLmh0bWxcbiAgICAvLyBzb21ld2hhdCBtb3JlIGluIGxpbmUgd2l0aCA0LjQuMy4yIDIwMDQgc3BlYywgYnV0IGFsbG93cyBkZWNpbWFsIGFueXdoZXJlXG4gICAgdmFyIGNyZWF0ZV9faXNvUmVnZXggPSAvXigtKT9QKD86KD86KFswLTksLl0qKVkpPyg/OihbMC05LC5dKilNKT8oPzooWzAtOSwuXSopRCk/KD86VCg/OihbMC05LC5dKilIKT8oPzooWzAtOSwuXSopTSk/KD86KFswLTksLl0qKVMpPyk/fChbMC05LC5dKilXKSQvO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlX19jcmVhdGVEdXJhdGlvbiAoaW5wdXQsIGtleSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBpbnB1dCxcbiAgICAgICAgICAgIC8vIG1hdGNoaW5nIGFnYWluc3QgcmVnZXhwIGlzIGV4cGVuc2l2ZSwgZG8gaXQgb24gZGVtYW5kXG4gICAgICAgICAgICBtYXRjaCA9IG51bGwsXG4gICAgICAgICAgICBzaWduLFxuICAgICAgICAgICAgcmV0LFxuICAgICAgICAgICAgZGlmZlJlcztcblxuICAgICAgICBpZiAoaXNEdXJhdGlvbihpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIG1zIDogaW5wdXQuX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgICAgICBkICA6IGlucHV0Ll9kYXlzLFxuICAgICAgICAgICAgICAgIE0gIDogaW5wdXQuX21vbnRoc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uW2tleV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24ubWlsbGlzZWNvbmRzID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBhc3BOZXRSZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5ICA6IDAsXG4gICAgICAgICAgICAgICAgZCAgOiB0b0ludChtYXRjaFtEQVRFXSkgICAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBoICA6IHRvSW50KG1hdGNoW0hPVVJdKSAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIG0gIDogdG9JbnQobWF0Y2hbTUlOVVRFXSkgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgcyAgOiB0b0ludChtYXRjaFtTRUNPTkRdKSAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBtcyA6IHRvSW50KG1hdGNoW01JTExJU0VDT05EXSkgKiBzaWduXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gY3JlYXRlX19pc29SZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5IDogcGFyc2VJc28obWF0Y2hbMl0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIE0gOiBwYXJzZUlzbyhtYXRjaFszXSwgc2lnbiksXG4gICAgICAgICAgICAgICAgZCA6IHBhcnNlSXNvKG1hdGNoWzRdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBoIDogcGFyc2VJc28obWF0Y2hbNV0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIG0gOiBwYXJzZUlzbyhtYXRjaFs2XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgcyA6IHBhcnNlSXNvKG1hdGNoWzddLCBzaWduKSxcbiAgICAgICAgICAgICAgICB3IDogcGFyc2VJc28obWF0Y2hbOF0sIHNpZ24pXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGR1cmF0aW9uID09IG51bGwpIHsvLyBjaGVja3MgZm9yIG51bGwgb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcgJiYgKCdmcm9tJyBpbiBkdXJhdGlvbiB8fCAndG8nIGluIGR1cmF0aW9uKSkge1xuICAgICAgICAgICAgZGlmZlJlcyA9IG1vbWVudHNEaWZmZXJlbmNlKGxvY2FsX19jcmVhdGVMb2NhbChkdXJhdGlvbi5mcm9tKSwgbG9jYWxfX2NyZWF0ZUxvY2FsKGR1cmF0aW9uLnRvKSk7XG5cbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgICAgICBkdXJhdGlvbi5tcyA9IGRpZmZSZXMubWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgZHVyYXRpb24uTSA9IGRpZmZSZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0ID0gbmV3IER1cmF0aW9uKGR1cmF0aW9uKTtcblxuICAgICAgICBpZiAoaXNEdXJhdGlvbihpbnB1dCkgJiYgaGFzT3duUHJvcChpbnB1dCwgJ19sb2NhbGUnKSkge1xuICAgICAgICAgICAgcmV0Ll9sb2NhbGUgPSBpbnB1dC5fbG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uLmZuID0gRHVyYXRpb24ucHJvdG90eXBlO1xuXG4gICAgZnVuY3Rpb24gcGFyc2VJc28gKGlucCwgc2lnbikge1xuICAgICAgICAvLyBXZSdkIG5vcm1hbGx5IHVzZSB+fmlucCBmb3IgdGhpcywgYnV0IHVuZm9ydHVuYXRlbHkgaXQgYWxzb1xuICAgICAgICAvLyBjb252ZXJ0cyBmbG9hdHMgdG8gaW50cy5cbiAgICAgICAgLy8gaW5wIG1heSBiZSB1bmRlZmluZWQsIHNvIGNhcmVmdWwgY2FsbGluZyByZXBsYWNlIG9uIGl0LlxuICAgICAgICB2YXIgcmVzID0gaW5wICYmIHBhcnNlRmxvYXQoaW5wLnJlcGxhY2UoJywnLCAnLicpKTtcbiAgICAgICAgLy8gYXBwbHkgc2lnbiB3aGlsZSB3ZSdyZSBhdCBpdFxuICAgICAgICByZXR1cm4gKGlzTmFOKHJlcykgPyAwIDogcmVzKSAqIHNpZ247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcikge1xuICAgICAgICB2YXIgcmVzID0ge21pbGxpc2Vjb25kczogMCwgbW9udGhzOiAwfTtcblxuICAgICAgICByZXMubW9udGhzID0gb3RoZXIubW9udGgoKSAtIGJhc2UubW9udGgoKSArXG4gICAgICAgICAgICAob3RoZXIueWVhcigpIC0gYmFzZS55ZWFyKCkpICogMTI7XG4gICAgICAgIGlmIChiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykuaXNBZnRlcihvdGhlcikpIHtcbiAgICAgICAgICAgIC0tcmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcy5taWxsaXNlY29uZHMgPSArb3RoZXIgLSArKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcikge1xuICAgICAgICB2YXIgcmVzO1xuICAgICAgICBvdGhlciA9IGNsb25lV2l0aE9mZnNldChvdGhlciwgYmFzZSk7XG4gICAgICAgIGlmIChiYXNlLmlzQmVmb3JlKG90aGVyKSkge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMgPSBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKG90aGVyLCBiYXNlKTtcbiAgICAgICAgICAgIHJlcy5taWxsaXNlY29uZHMgPSAtcmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIHJlcy5tb250aHMgPSAtcmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlQWRkZXIoZGlyZWN0aW9uLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsLCBwZXJpb2QpIHtcbiAgICAgICAgICAgIHZhciBkdXIsIHRtcDtcbiAgICAgICAgICAgIC8vaW52ZXJ0IHRoZSBhcmd1bWVudHMsIGJ1dCBjb21wbGFpbiBhYm91dCBpdFxuICAgICAgICAgICAgaWYgKHBlcmlvZCAhPT0gbnVsbCAmJiAhaXNOYU4oK3BlcmlvZCkpIHtcbiAgICAgICAgICAgICAgICBkZXByZWNhdGVTaW1wbGUobmFtZSwgJ21vbWVudCgpLicgKyBuYW1lICArICcocGVyaW9kLCBudW1iZXIpIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgbW9tZW50KCkuJyArIG5hbWUgKyAnKG51bWJlciwgcGVyaW9kKS4nKTtcbiAgICAgICAgICAgICAgICB0bXAgPSB2YWw7IHZhbCA9IHBlcmlvZDsgcGVyaW9kID0gdG1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWwgPSB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/ICt2YWwgOiB2YWw7XG4gICAgICAgICAgICBkdXIgPSBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKHZhbCwgcGVyaW9kKTtcbiAgICAgICAgICAgIGFkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QodGhpcywgZHVyLCBkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCAobW9tLCBkdXJhdGlvbiwgaXNBZGRpbmcsIHVwZGF0ZU9mZnNldCkge1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gZHVyYXRpb24uX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgIGRheXMgPSBkdXJhdGlvbi5fZGF5cyxcbiAgICAgICAgICAgIG1vbnRocyA9IGR1cmF0aW9uLl9tb250aHM7XG4gICAgICAgIHVwZGF0ZU9mZnNldCA9IHVwZGF0ZU9mZnNldCA9PSBudWxsID8gdHJ1ZSA6IHVwZGF0ZU9mZnNldDtcblxuICAgICAgICBpZiAobWlsbGlzZWNvbmRzKSB7XG4gICAgICAgICAgICBtb20uX2Quc2V0VGltZSgrbW9tLl9kICsgbWlsbGlzZWNvbmRzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXlzKSB7XG4gICAgICAgICAgICBnZXRfc2V0X19zZXQobW9tLCAnRGF0ZScsIGdldF9zZXRfX2dldChtb20sICdEYXRlJykgKyBkYXlzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb250aHMpIHtcbiAgICAgICAgICAgIHNldE1vbnRoKG1vbSwgZ2V0X3NldF9fZ2V0KG1vbSwgJ01vbnRoJykgKyBtb250aHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZU9mZnNldCkge1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldChtb20sIGRheXMgfHwgbW9udGhzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhZGRfc3VidHJhY3RfX2FkZCAgICAgID0gY3JlYXRlQWRkZXIoMSwgJ2FkZCcpO1xuICAgIHZhciBhZGRfc3VidHJhY3RfX3N1YnRyYWN0ID0gY3JlYXRlQWRkZXIoLTEsICdzdWJ0cmFjdCcpO1xuXG4gICAgZnVuY3Rpb24gbW9tZW50X2NhbGVuZGFyX19jYWxlbmRhciAodGltZSwgZm9ybWF0cykge1xuICAgICAgICAvLyBXZSB3YW50IHRvIGNvbXBhcmUgdGhlIHN0YXJ0IG9mIHRvZGF5LCB2cyB0aGlzLlxuICAgICAgICAvLyBHZXR0aW5nIHN0YXJ0LW9mLXRvZGF5IGRlcGVuZHMgb24gd2hldGhlciB3ZSdyZSBsb2NhbC91dGMvb2Zmc2V0IG9yIG5vdC5cbiAgICAgICAgdmFyIG5vdyA9IHRpbWUgfHwgbG9jYWxfX2NyZWF0ZUxvY2FsKCksXG4gICAgICAgICAgICBzb2QgPSBjbG9uZVdpdGhPZmZzZXQobm93LCB0aGlzKS5zdGFydE9mKCdkYXknKSxcbiAgICAgICAgICAgIGRpZmYgPSB0aGlzLmRpZmYoc29kLCAnZGF5cycsIHRydWUpLFxuICAgICAgICAgICAgZm9ybWF0ID0gZGlmZiA8IC02ID8gJ3NhbWVFbHNlJyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IC0xID8gJ2xhc3RXZWVrJyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDAgPyAnbGFzdERheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAxID8gJ3NhbWVEYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMiA/ICduZXh0RGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDcgPyAnbmV4dFdlZWsnIDogJ3NhbWVFbHNlJztcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KGZvcm1hdHMgJiYgZm9ybWF0c1tmb3JtYXRdIHx8IHRoaXMubG9jYWxlRGF0YSgpLmNhbGVuZGFyKGZvcm1hdCwgdGhpcywgbG9jYWxfX2NyZWF0ZUxvY2FsKG5vdykpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9uZSAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgTW9tZW50KHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQWZ0ZXIgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcyA+ICtpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSBpc01vbWVudChpbnB1dCkgPyAraW5wdXQgOiArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dE1zIDwgK3RoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQmVmb3JlIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGlucHV0TXM7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModHlwZW9mIHVuaXRzICE9PSAndW5kZWZpbmVkJyA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgaW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMgPCAraW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dE1zID0gaXNNb21lbnQoaW5wdXQpID8gK2lucHV0IDogK2xvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMuY2xvbmUoKS5lbmRPZih1bml0cykgPCBpbnB1dE1zO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNCZXR3ZWVuIChmcm9tLCB0bywgdW5pdHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNBZnRlcihmcm9tLCB1bml0cykgJiYgdGhpcy5pc0JlZm9yZSh0bywgdW5pdHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzU2FtZSAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBpbnB1dE1zO1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzIHx8ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzID09PSAraW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dE1zID0gK2xvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gKyh0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykpIDw9IGlucHV0TXMgJiYgaW5wdXRNcyA8PSArKHRoaXMuY2xvbmUoKS5lbmRPZih1bml0cykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlmZiAoaW5wdXQsIHVuaXRzLCBhc0Zsb2F0KSB7XG4gICAgICAgIHZhciB0aGF0ID0gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCB0aGlzKSxcbiAgICAgICAgICAgIHpvbmVEZWx0YSA9ICh0aGF0LnV0Y09mZnNldCgpIC0gdGhpcy51dGNPZmZzZXQoKSkgKiA2ZTQsXG4gICAgICAgICAgICBkZWx0YSwgb3V0cHV0O1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3llYXInIHx8IHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgIG91dHB1dCA9IG1vbnRoRGlmZih0aGlzLCB0aGF0KTtcbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0IC8gMztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodW5pdHMgPT09ICd5ZWFyJykge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCAvIDEyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsdGEgPSB0aGlzIC0gdGhhdDtcbiAgICAgICAgICAgIG91dHB1dCA9IHVuaXRzID09PSAnc2Vjb25kJyA/IGRlbHRhIC8gMWUzIDogLy8gMTAwMFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnbWludXRlJyA/IGRlbHRhIC8gNmU0IDogLy8gMTAwMCAqIDYwXG4gICAgICAgICAgICAgICAgdW5pdHMgPT09ICdob3VyJyA/IGRlbHRhIC8gMzZlNSA6IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgICAgICAgICAgdW5pdHMgPT09ICdkYXknID8gKGRlbHRhIC0gem9uZURlbHRhKSAvIDg2NGU1IDogLy8gMTAwMCAqIDYwICogNjAgKiAyNCwgbmVnYXRlIGRzdFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnd2VlaycgPyAoZGVsdGEgLSB6b25lRGVsdGEpIC8gNjA0OGU1IDogLy8gMTAwMCAqIDYwICogNjAgKiAyNCAqIDcsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgICAgICBkZWx0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXNGbG9hdCA/IG91dHB1dCA6IGFic0Zsb29yKG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9udGhEaWZmIChhLCBiKSB7XG4gICAgICAgIC8vIGRpZmZlcmVuY2UgaW4gbW9udGhzXG4gICAgICAgIHZhciB3aG9sZU1vbnRoRGlmZiA9ICgoYi55ZWFyKCkgLSBhLnllYXIoKSkgKiAxMikgKyAoYi5tb250aCgpIC0gYS5tb250aCgpKSxcbiAgICAgICAgICAgIC8vIGIgaXMgaW4gKGFuY2hvciAtIDEgbW9udGgsIGFuY2hvciArIDEgbW9udGgpXG4gICAgICAgICAgICBhbmNob3IgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmLCAnbW9udGhzJyksXG4gICAgICAgICAgICBhbmNob3IyLCBhZGp1c3Q7XG5cbiAgICAgICAgaWYgKGIgLSBhbmNob3IgPCAwKSB7XG4gICAgICAgICAgICBhbmNob3IyID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiAtIDEsICdtb250aHMnKTtcbiAgICAgICAgICAgIC8vIGxpbmVhciBhY3Jvc3MgdGhlIG1vbnRoXG4gICAgICAgICAgICBhZGp1c3QgPSAoYiAtIGFuY2hvcikgLyAoYW5jaG9yIC0gYW5jaG9yMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbmNob3IyID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiArIDEsICdtb250aHMnKTtcbiAgICAgICAgICAgIC8vIGxpbmVhciBhY3Jvc3MgdGhlIG1vbnRoXG4gICAgICAgICAgICBhZGp1c3QgPSAoYiAtIGFuY2hvcikgLyAoYW5jaG9yMiAtIGFuY2hvcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLSh3aG9sZU1vbnRoRGlmZiArIGFkanVzdCk7XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmRlZmF1bHRGb3JtYXQgPSAnWVlZWS1NTS1ERFRISDptbTpzc1onO1xuXG4gICAgZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X2Zvcm1hdF9fdG9JU09TdHJpbmcgKCkge1xuICAgICAgICB2YXIgbSA9IHRoaXMuY2xvbmUoKS51dGMoKTtcbiAgICAgICAgaWYgKDAgPCBtLnllYXIoKSAmJiBtLnllYXIoKSA8PSA5OTk5KSB7XG4gICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gbmF0aXZlIGltcGxlbWVudGF0aW9uIGlzIH41MHggZmFzdGVyLCB1c2UgaXQgd2hlbiB3ZSBjYW5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b0RhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sICdZWVlZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdCAoaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IGZvcm1hdE1vbWVudCh0aGlzLCBpbnB1dFN0cmluZyB8fCB1dGlsc19ob29rc19faG9va3MuZGVmYXVsdEZvcm1hdCk7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbSAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlX19jcmVhdGVEdXJhdGlvbih7dG86IHRoaXMsIGZyb206IHRpbWV9KS5sb2NhbGUodGhpcy5sb2NhbGUoKSkuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb21Ob3cgKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbShsb2NhbF9fY3JlYXRlTG9jYWwoKSwgd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG8gKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24oe2Zyb206IHRoaXMsIHRvOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b05vdyAod2l0aG91dFN1ZmZpeCkge1xuICAgICAgICByZXR1cm4gdGhpcy50byhsb2NhbF9fY3JlYXRlTG9jYWwoKSwgd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlIChrZXkpIHtcbiAgICAgICAgdmFyIG5ld0xvY2FsZURhdGE7XG5cbiAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3TG9jYWxlRGF0YSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIGlmIChuZXdMb2NhbGVEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2NhbGUgPSBuZXdMb2NhbGVEYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGFuZyA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudCgpLmxhbmcoKSBpcyBkZXByZWNhdGVkLiBJbnN0ZWFkLCB1c2UgbW9tZW50KCkubG9jYWxlRGF0YSgpIHRvIGdldCB0aGUgbGFuZ3VhZ2UgY29uZmlndXJhdGlvbi4gVXNlIG1vbWVudCgpLmxvY2FsZSgpIHRvIGNoYW5nZSBsYW5ndWFnZXMuJyxcbiAgICAgICAgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVEYXRhICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE9mICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgLy8gdGhlIGZvbGxvd2luZyBzd2l0Y2ggaW50ZW50aW9uYWxseSBvbWl0cyBicmVhayBrZXl3b3Jkc1xuICAgICAgICAvLyB0byB1dGlsaXplIGZhbGxpbmcgdGhyb3VnaCB0aGUgY2FzZXMuXG4gICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgICAgICB0aGlzLm1vbnRoKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgdGhpcy5kYXRlKDEpO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgY2FzZSAnaXNvV2Vlayc6XG4gICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgICB0aGlzLmhvdXJzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdob3VyJzpcbiAgICAgICAgICAgIHRoaXMubWludXRlcygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnbWludXRlJzpcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kcygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnc2Vjb25kJzpcbiAgICAgICAgICAgIHRoaXMubWlsbGlzZWNvbmRzKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Vla3MgYXJlIGEgc3BlY2lhbCBjYXNlXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgICAgICB0aGlzLndlZWtkYXkoMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXRzID09PSAnaXNvV2VlaycpIHtcbiAgICAgICAgICAgIHRoaXMuaXNvV2Vla2RheSgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHF1YXJ0ZXJzIGFyZSBhbHNvIHNwZWNpYWxcbiAgICAgICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgIHRoaXMubW9udGgoTWF0aC5mbG9vcih0aGlzLm1vbnRoKCkgLyAzKSAqIDMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kT2YgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICBpZiAodW5pdHMgPT09IHVuZGVmaW5lZCB8fCB1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRPZih1bml0cykuYWRkKDEsICh1bml0cyA9PT0gJ2lzb1dlZWsnID8gJ3dlZWsnIDogdW5pdHMpKS5zdWJ0cmFjdCgxLCAnbXMnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b190eXBlX192YWx1ZU9mICgpIHtcbiAgICAgICAgcmV0dXJuICt0aGlzLl9kIC0gKCh0aGlzLl9vZmZzZXQgfHwgMCkgKiA2MDAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5peCAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKCt0aGlzIC8gMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9EYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldCA/IG5ldyBEYXRlKCt0aGlzKSA6IHRoaXMuX2Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9BcnJheSAoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIFttLnllYXIoKSwgbS5tb250aCgpLCBtLmRhdGUoKSwgbS5ob3VyKCksIG0ubWludXRlKCksIG0uc2Vjb25kKCksIG0ubWlsbGlzZWNvbmQoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9PYmplY3QgKCkge1xuICAgICAgICB2YXIgbSA9IHRoaXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyczogbS55ZWFyKCksXG4gICAgICAgICAgICBtb250aHM6IG0ubW9udGgoKSxcbiAgICAgICAgICAgIGRhdGU6IG0uZGF0ZSgpLFxuICAgICAgICAgICAgaG91cnM6IG0uaG91cnMoKSxcbiAgICAgICAgICAgIG1pbnV0ZXM6IG0ubWludXRlcygpLFxuICAgICAgICAgICAgc2Vjb25kczogbS5zZWNvbmRzKCksXG4gICAgICAgICAgICBtaWxsaXNlY29uZHM6IG0ubWlsbGlzZWNvbmRzKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfdmFsaWRfX2lzVmFsaWQgKCkge1xuICAgICAgICByZXR1cm4gdmFsaWRfX2lzVmFsaWQodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2luZ0ZsYWdzICgpIHtcbiAgICAgICAgcmV0dXJuIGV4dGVuZCh7fSwgZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkQXQgKCkge1xuICAgICAgICByZXR1cm4gZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpLm92ZXJmbG93O1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnZ2cnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53ZWVrWWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydHRycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzb1dlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBhZGRXZWVrWWVhckZvcm1hdFRva2VuICh0b2tlbiwgZ2V0dGVyKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKDAsIFt0b2tlbiwgdG9rZW4ubGVuZ3RoXSwgMCwgZ2V0dGVyKTtcbiAgICB9XG5cbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdnZ2dnJywgICAgICd3ZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2dnJywgICAgJ3dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHRycsICAnaXNvV2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHRycsICdpc29XZWVrWWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrWWVhcicsICdnZycpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla1llYXInLCAnR0cnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0cnLCAgICAgIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdnJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignR0cnLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHR0dHJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbiAgICBhZGRSZWdleFRva2VuKCdnZ2dnZycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2dnZ2cnLCAnZ2dnZ2cnLCAnR0dHRycsICdHR0dHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMildID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydnZycsICdHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbl0gPSB1dGlsc19ob29rc19faG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gd2Vla3NJblllYXIoeWVhciwgZG93LCBkb3kpIHtcbiAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIobG9jYWxfX2NyZWF0ZUxvY2FsKFt5ZWFyLCAxMSwgMzEgKyBkb3cgLSBkb3ldKSwgZG93LCBkb3kpLndlZWs7XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2Vla1llYXIgKGlucHV0KSB7XG4gICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3csIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRveSkueWVhcjtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoKGlucHV0IC0geWVhciksICd5Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPV2Vla1llYXIgKGlucHV0KSB7XG4gICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS55ZWFyO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHllYXIgOiB0aGlzLmFkZCgoaW5wdXQgLSB5ZWFyKSwgJ3knKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJU09XZWVrc0luWWVhciAoKSB7XG4gICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgMSwgNCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0V2Vla3NJblllYXIgKCkge1xuICAgICAgICB2YXIgd2Vla0luZm8gPSB0aGlzLmxvY2FsZURhdGEoKS5fd2VlaztcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1EnLCAwLCAwLCAncXVhcnRlcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdxdWFydGVyJywgJ1EnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1EnLCBtYXRjaDEpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1EnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9ICh0b0ludChpbnB1dCkgLSAxKSAqIDM7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRRdWFydGVyIChpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IE1hdGguY2VpbCgodGhpcy5tb250aCgpICsgMSkgLyAzKSA6IHRoaXMubW9udGgoKGlucHV0IC0gMSkgKiAzICsgdGhpcy5tb250aCgpICUgMyk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0QnLCBbJ0REJywgMl0sICdEbycsICdkYXRlJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RhdGUnLCAnRCcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignRCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGlzU3RyaWN0ID8gbG9jYWxlLl9vcmRpbmFsUGFyc2UgOiBsb2NhbGUuX29yZGluYWxQYXJzZUxlbmllbnQ7XG4gICAgfSk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnRCcsICdERCddLCBEQVRFKTtcbiAgICBhZGRQYXJzZVRva2VuKCdEbycsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbREFURV0gPSB0b0ludChpbnB1dC5tYXRjaChtYXRjaDF0bzIpWzBdLCAxMCk7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0RGF5T2ZNb250aCA9IG1ha2VHZXRTZXQoJ0RhdGUnLCB0cnVlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkJywgMCwgJ2RvJywgJ2RheScpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNNaW4odGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGRkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZScsIDAsIDAsICd3ZWVrZGF5Jyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ0UnLCAwLCAwLCAnaXNvV2Vla2RheScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdkYXknLCAnZCcpO1xuICAgIGFkZFVuaXRBbGlhcygnd2Vla2RheScsICdlJyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrZGF5JywgJ0UnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2QnLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2UnLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0UnLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2RkJywgICBtYXRjaFdvcmQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2RkZCcsICBtYXRjaFdvcmQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2RkZGQnLCBtYXRjaFdvcmQpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydkZCcsICdkZGQnLCAnZGRkZCddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZykge1xuICAgICAgICB2YXIgd2Vla2RheSA9IGNvbmZpZy5fbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZ2V0IGEgd2Vla2RheSBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWRcbiAgICAgICAgaWYgKHdlZWtkYXkgIT0gbnVsbCkge1xuICAgICAgICAgICAgd2Vlay5kID0gd2Vla2RheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRXZWVrZGF5ID0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZCcsICdlJywgJ0UnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW5dID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gcGFyc2VXZWVrZGF5KGlucHV0LCBsb2NhbGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNOYU4oaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoaW5wdXQsIDEwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlucHV0ID0gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5cyA9ICdTdW5kYXlfTW9uZGF5X1R1ZXNkYXlfV2VkbmVzZGF5X1RodXJzZGF5X0ZyaWRheV9TYXR1cmRheScuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5cyAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNbbS5kYXkoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0ID0gJ1N1bl9Nb25fVHVlX1dlZF9UaHVfRnJpX1NhdCcuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1Nob3J0IChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0W20uZGF5KCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXNNaW4gPSAnU3VfTW9fVHVfV2VfVGhfRnJfU2EnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNNaW4gKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluW20uZGF5KCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzUGFyc2UgKHdlZWtkYXlOYW1lKSB7XG4gICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSB0aGlzLl93ZWVrZGF5c1BhcnNlIHx8IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgbW9tID0gbG9jYWxfX2NyZWF0ZUxvY2FsKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy53ZWVrZGF5cyhtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzU2hvcnQobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c01pbihtb20sICcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZldlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciBkYXkgPSB0aGlzLl9pc1VUQyA/IHRoaXMuX2QuZ2V0VVRDRGF5KCkgOiB0aGlzLl9kLmdldERheSgpO1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaW5wdXQgPSBwYXJzZVdlZWtkYXkoaW5wdXQsIHRoaXMubG9jYWxlRGF0YSgpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZChpbnB1dCAtIGRheSwgJ2QnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkYXk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRMb2NhbGVEYXlPZldlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gKHRoaXMuZGF5KCkgKyA3IC0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93KSAlIDc7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2Vla2RheSA6IHRoaXMuYWRkKGlucHV0IC0gd2Vla2RheSwgJ2QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09EYXlPZldlZWsgKGlucHV0KSB7XG4gICAgICAgIC8vIGJlaGF2ZXMgdGhlIHNhbWUgYXMgbW9tZW50I2RheSBleGNlcHRcbiAgICAgICAgLy8gYXMgYSBnZXR0ZXIsIHJldHVybnMgNyBpbnN0ZWFkIG9mIDAgKDEtNyByYW5nZSBpbnN0ZWFkIG9mIDAtNilcbiAgICAgICAgLy8gYXMgYSBzZXR0ZXIsIHN1bmRheSBzaG91bGQgYmVsb25nIHRvIHRoZSBwcmV2aW91cyB3ZWVrLlxuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHRoaXMuZGF5KCkgfHwgNyA6IHRoaXMuZGF5KHRoaXMuZGF5KCkgJSA3ID8gaW5wdXQgOiBpbnB1dCAtIDcpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdIJywgWydISCcsIDJdLCAwLCAnaG91cicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdoJywgWydoaCcsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCkgJSAxMiB8fCAxMjtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIG1lcmlkaWVtICh0b2tlbiwgbG93ZXJjYXNlKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubWVyaWRpZW0odGhpcy5ob3VycygpLCB0aGlzLm1pbnV0ZXMoKSwgbG93ZXJjYXNlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbWVyaWRpZW0oJ2EnLCB0cnVlKTtcbiAgICBtZXJpZGllbSgnQScsIGZhbHNlKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnaG91cicsICdoJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBmdW5jdGlvbiBtYXRjaE1lcmlkaWVtIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUuX21lcmlkaWVtUGFyc2U7XG4gICAgfVxuXG4gICAgYWRkUmVnZXhUb2tlbignYScsICBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdBJywgIG1hdGNoTWVyaWRpZW0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0gnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdoJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignSEgnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignaGgnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnSCcsICdISCddLCBIT1VSKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnYScsICdBJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2lzUG0gPSBjb25maWcuX2xvY2FsZS5pc1BNKGlucHV0KTtcbiAgICAgICAgY29uZmlnLl9tZXJpZGllbSA9IGlucHV0O1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oWydoJywgJ2hoJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG4gICAgfSk7XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICBmdW5jdGlvbiBsb2NhbGVJc1BNIChpbnB1dCkge1xuICAgICAgICAvLyBJRTggUXVpcmtzIE1vZGUgJiBJRTcgU3RhbmRhcmRzIE1vZGUgZG8gbm90IGFsbG93IGFjY2Vzc2luZyBzdHJpbmdzIGxpa2UgYXJyYXlzXG4gICAgICAgIC8vIFVzaW5nIGNoYXJBdCBzaG91bGQgYmUgbW9yZSBjb21wYXRpYmxlLlxuICAgICAgICByZXR1cm4gKChpbnB1dCArICcnKS50b0xvd2VyQ2FzZSgpLmNoYXJBdCgwKSA9PT0gJ3AnKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZU1lcmlkaWVtUGFyc2UgPSAvW2FwXVxcLj9tP1xcLj8vaTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNZXJpZGllbSAoaG91cnMsIG1pbnV0ZXMsIGlzTG93ZXIpIHtcbiAgICAgICAgaWYgKGhvdXJzID4gMTEpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ3BtJyA6ICdQTSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdhbScgOiAnQU0nO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICAvLyBTZXR0aW5nIHRoZSBob3VyIHNob3VsZCBrZWVwIHRoZSB0aW1lLCBiZWNhdXNlIHRoZSB1c2VyIGV4cGxpY2l0bHlcbiAgICAvLyBzcGVjaWZpZWQgd2hpY2ggaG91ciBoZSB3YW50cy4gU28gdHJ5aW5nIHRvIG1haW50YWluIHRoZSBzYW1lIGhvdXIgKGluXG4gICAgLy8gYSBuZXcgdGltZXpvbmUpIG1ha2VzIHNlbnNlLiBBZGRpbmcvc3VidHJhY3RpbmcgaG91cnMgZG9lcyBub3QgZm9sbG93XG4gICAgLy8gdGhpcyBydWxlLlxuICAgIHZhciBnZXRTZXRIb3VyID0gbWFrZUdldFNldCgnSG91cnMnLCB0cnVlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdtJywgWydtbScsIDJdLCAwLCAnbWludXRlJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ21pbnV0ZScsICdtJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdtJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignbW0nLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ20nLCAnbW0nXSwgTUlOVVRFKTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRNaW51dGUgPSBtYWtlR2V0U2V0KCdNaW51dGVzJywgZmFsc2UpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3MnLCBbJ3NzJywgMl0sIDAsICdzZWNvbmQnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnc2Vjb25kJywgJ3MnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3MnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdzcycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRQYXJzZVRva2VuKFsncycsICdzcyddLCBTRUNPTkQpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldFNlY29uZCA9IG1ha2VHZXRTZXQoJ1NlY29uZHMnLCBmYWxzZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignUycsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIH5+KHRoaXMubWlsbGlzZWNvbmQoKSAvIDEwMCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIH5+KHRoaXMubWlsbGlzZWNvbmQoKSAvIDEwKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTJywgM10sIDAsICdtaWxsaXNlY29uZCcpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTUycsIDRdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTJywgNV0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTUycsIDZdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTUycsIDddLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1NTJywgOF0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1NTUycsIDldLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDAwO1xuICAgIH0pO1xuXG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ21pbGxpc2Vjb25kJywgJ21zJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdTJywgICAgbWF0Y2gxdG8zLCBtYXRjaDEpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTJywgICBtYXRjaDF0bzMsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignU1NTJywgIG1hdGNoMXRvMywgbWF0Y2gzKTtcblxuICAgIHZhciB0b2tlbjtcbiAgICBmb3IgKHRva2VuID0gJ1NTU1MnOyB0b2tlbi5sZW5ndGggPD0gOTsgdG9rZW4gKz0gJ1MnKSB7XG4gICAgICAgIGFkZFJlZ2V4VG9rZW4odG9rZW4sIG1hdGNoVW5zaWduZWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTXMoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01JTExJU0VDT05EXSA9IHRvSW50KCgnMC4nICsgaW5wdXQpICogMTAwMCk7XG4gICAgfVxuXG4gICAgZm9yICh0b2tlbiA9ICdTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgICAgICBhZGRQYXJzZVRva2VuKHRva2VuLCBwYXJzZU1zKTtcbiAgICB9XG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldE1pbGxpc2Vjb25kID0gbWFrZUdldFNldCgnTWlsbGlzZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3onLCAgMCwgMCwgJ3pvbmVBYmJyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ3p6JywgMCwgMCwgJ3pvbmVOYW1lJyk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRab25lQWJiciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdVVEMnIDogJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZU5hbWUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnIDogJyc7XG4gICAgfVxuXG4gICAgdmFyIG1vbWVudFByb3RvdHlwZV9fcHJvdG8gPSBNb21lbnQucHJvdG90eXBlO1xuXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5hZGQgICAgICAgICAgPSBhZGRfc3VidHJhY3RfX2FkZDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmNhbGVuZGFyICAgICA9IG1vbWVudF9jYWxlbmRhcl9fY2FsZW5kYXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5jbG9uZSAgICAgICAgPSBjbG9uZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRpZmYgICAgICAgICA9IGRpZmY7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5lbmRPZiAgICAgICAgPSBlbmRPZjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmZvcm1hdCAgICAgICA9IGZvcm1hdDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmZyb20gICAgICAgICA9IGZyb207XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mcm9tTm93ICAgICAgPSBmcm9tTm93O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG8gICAgICAgICAgID0gdG87XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b05vdyAgICAgICAgPSB0b05vdztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmdldCAgICAgICAgICA9IGdldFNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmludmFsaWRBdCAgICA9IGludmFsaWRBdDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzQWZ0ZXIgICAgICA9IGlzQWZ0ZXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0JlZm9yZSAgICAgPSBpc0JlZm9yZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzQmV0d2VlbiAgICA9IGlzQmV0d2VlbjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzU2FtZSAgICAgICA9IGlzU2FtZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVmFsaWQgICAgICA9IG1vbWVudF92YWxpZF9faXNWYWxpZDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxhbmcgICAgICAgICA9IGxhbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5sb2NhbGUgICAgICAgPSBsb2NhbGU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5sb2NhbGVEYXRhICAgPSBsb2NhbGVEYXRhO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWF4ICAgICAgICAgID0gcHJvdG90eXBlTWF4O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWluICAgICAgICAgID0gcHJvdG90eXBlTWluO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ucGFyc2luZ0ZsYWdzID0gcGFyc2luZ0ZsYWdzO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc2V0ICAgICAgICAgID0gZ2V0U2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc3RhcnRPZiAgICAgID0gc3RhcnRPZjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnN1YnRyYWN0ICAgICA9IGFkZF9zdWJ0cmFjdF9fc3VidHJhY3Q7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0FycmF5ICAgICAgPSB0b0FycmF5O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9PYmplY3QgICAgID0gdG9PYmplY3Q7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0RhdGUgICAgICAgPSB0b0RhdGU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0lTT1N0cmluZyAgPSBtb21lbnRfZm9ybWF0X190b0lTT1N0cmluZztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvSlNPTiAgICAgICA9IG1vbWVudF9mb3JtYXRfX3RvSVNPU3RyaW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9TdHJpbmcgICAgID0gdG9TdHJpbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by51bml4ICAgICAgICAgPSB1bml4O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udmFsdWVPZiAgICAgID0gdG9fdHlwZV9fdmFsdWVPZjtcblxuICAgIC8vIFllYXJcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnllYXIgICAgICAgPSBnZXRTZXRZZWFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNMZWFwWWVhciA9IGdldElzTGVhcFllYXI7XG5cbiAgICAvLyBXZWVrIFllYXJcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWtZZWFyICAgID0gZ2V0U2V0V2Vla1llYXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrWWVhciA9IGdldFNldElTT1dlZWtZZWFyO1xuXG4gICAgLy8gUXVhcnRlclxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ucXVhcnRlciA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8ucXVhcnRlcnMgPSBnZXRTZXRRdWFydGVyO1xuXG4gICAgLy8gTW9udGhcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1vbnRoICAgICAgID0gZ2V0U2V0TW9udGg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXlzSW5Nb250aCA9IGdldERheXNJbk1vbnRoO1xuXG4gICAgLy8gV2Vla1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2VlayAgICAgICAgICAgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWtzICAgICAgICA9IGdldFNldFdlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrICAgICAgICA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla3MgICAgID0gZ2V0U2V0SVNPV2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWtzSW5ZZWFyICAgID0gZ2V0V2Vla3NJblllYXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrc0luWWVhciA9IGdldElTT1dlZWtzSW5ZZWFyO1xuXG4gICAgLy8gRGF5XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXRlICAgICAgID0gZ2V0U2V0RGF5T2ZNb250aDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRheSAgICAgICAgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRheXMgICAgICAgICAgICAgPSBnZXRTZXREYXlPZldlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrZGF5ICAgID0gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla2RheSA9IGdldFNldElTT0RheU9mV2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRheU9mWWVhciAgPSBnZXRTZXREYXlPZlllYXI7XG5cbiAgICAvLyBIb3VyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5ob3VyID0gbW9tZW50UHJvdG90eXBlX19wcm90by5ob3VycyA9IGdldFNldEhvdXI7XG5cbiAgICAvLyBNaW51dGVcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbnV0ZSA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWludXRlcyA9IGdldFNldE1pbnV0ZTtcblxuICAgIC8vIFNlY29uZFxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc2Vjb25kID0gbW9tZW50UHJvdG90eXBlX19wcm90by5zZWNvbmRzID0gZ2V0U2V0U2Vjb25kO1xuXG4gICAgLy8gTWlsbGlzZWNvbmRcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbGxpc2Vjb25kID0gbW9tZW50UHJvdG90eXBlX19wcm90by5taWxsaXNlY29uZHMgPSBnZXRTZXRNaWxsaXNlY29uZDtcblxuICAgIC8vIE9mZnNldFxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udXRjT2Zmc2V0ICAgICAgICAgICAgPSBnZXRTZXRPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by51dGMgICAgICAgICAgICAgICAgICA9IHNldE9mZnNldFRvVVRDO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubG9jYWwgICAgICAgICAgICAgICAgPSBzZXRPZmZzZXRUb0xvY2FsO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ucGFyc2Vab25lICAgICAgICAgICAgPSBzZXRPZmZzZXRUb1BhcnNlZE9mZnNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmhhc0FsaWduZWRIb3VyT2Zmc2V0ID0gaGFzQWxpZ25lZEhvdXJPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0RTVCAgICAgICAgICAgICAgICA9IGlzRGF5bGlnaHRTYXZpbmdUaW1lO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNEU1RTaGlmdGVkICAgICAgICAgPSBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0xvY2FsICAgICAgICAgICAgICA9IGlzTG9jYWw7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1V0Y09mZnNldCAgICAgICAgICA9IGlzVXRjT2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNVdGMgICAgICAgICAgICAgICAgPSBpc1V0YztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVVRDICAgICAgICAgICAgICAgID0gaXNVdGM7XG5cbiAgICAvLyBUaW1lem9uZVxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uem9uZUFiYnIgPSBnZXRab25lQWJicjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnpvbmVOYW1lID0gZ2V0Wm9uZU5hbWU7XG5cbiAgICAvLyBEZXByZWNhdGlvbnNcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRhdGVzICA9IGRlcHJlY2F0ZSgnZGF0ZXMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIGRhdGUgaW5zdGVhZC4nLCBnZXRTZXREYXlPZk1vbnRoKTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1vbnRocyA9IGRlcHJlY2F0ZSgnbW9udGhzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb250aCBpbnN0ZWFkJywgZ2V0U2V0TW9udGgpO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ueWVhcnMgID0gZGVwcmVjYXRlKCd5ZWFycyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgeWVhciBpbnN0ZWFkJywgZ2V0U2V0WWVhcik7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by56b25lICAgPSBkZXByZWNhdGUoJ21vbWVudCgpLnpvbmUgaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudCgpLnV0Y09mZnNldCBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTc3OScsIGdldFNldFpvbmUpO1xuXG4gICAgdmFyIG1vbWVudFByb3RvdHlwZSA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG87XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfX2NyZWF0ZVVuaXggKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQgKiAxMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfX2NyZWF0ZUluWm9uZSAoKSB7XG4gICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5wYXJzZVpvbmUoKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdENhbGVuZGFyID0ge1xuICAgICAgICBzYW1lRGF5IDogJ1tUb2RheSBhdF0gTFQnLFxuICAgICAgICBuZXh0RGF5IDogJ1tUb21vcnJvdyBhdF0gTFQnLFxuICAgICAgICBuZXh0V2VlayA6ICdkZGRkIFthdF0gTFQnLFxuICAgICAgICBsYXN0RGF5IDogJ1tZZXN0ZXJkYXkgYXRdIExUJyxcbiAgICAgICAgbGFzdFdlZWsgOiAnW0xhc3RdIGRkZGQgW2F0XSBMVCcsXG4gICAgICAgIHNhbWVFbHNlIDogJ0wnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZV9jYWxlbmRhcl9fY2FsZW5kYXIgKGtleSwgbW9tLCBub3cpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX2NhbGVuZGFyW2tleV07XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb3V0cHV0ID09PSAnZnVuY3Rpb24nID8gb3V0cHV0LmNhbGwobW9tLCBub3cpIDogb3V0cHV0O1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQgPSB7XG4gICAgICAgIExUUyAgOiAnaDptbTpzcyBBJyxcbiAgICAgICAgTFQgICA6ICdoOm1tIEEnLFxuICAgICAgICBMICAgIDogJ01NL0REL1lZWVknLFxuICAgICAgICBMTCAgIDogJ01NTU0gRCwgWVlZWScsXG4gICAgICAgIExMTCAgOiAnTU1NTSBELCBZWVlZIGg6bW0gQScsXG4gICAgICAgIExMTEwgOiAnZGRkZCwgTU1NTSBELCBZWVlZIGg6bW0gQSdcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbG9uZ0RhdGVGb3JtYXQgKGtleSkge1xuICAgICAgICB2YXIgZm9ybWF0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSxcbiAgICAgICAgICAgIGZvcm1hdFVwcGVyID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5LnRvVXBwZXJDYXNlKCldO1xuXG4gICAgICAgIGlmIChmb3JtYXQgfHwgIWZvcm1hdFVwcGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSA9IGZvcm1hdFVwcGVyLnJlcGxhY2UoL01NTU18TU18RER8ZGRkZC9nLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsLnNsaWNlKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdEludmFsaWREYXRlID0gJ0ludmFsaWQgZGF0ZSc7XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkRGF0ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZhbGlkRGF0ZTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdE9yZGluYWwgPSAnJWQnO1xuICAgIHZhciBkZWZhdWx0T3JkaW5hbFBhcnNlID0gL1xcZHsxLDJ9LztcblxuICAgIGZ1bmN0aW9uIG9yZGluYWwgKG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JkaW5hbC5yZXBsYWNlKCclZCcsIG51bWJlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlUGFyc2VQb3N0Rm9ybWF0IChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdFJlbGF0aXZlVGltZSA9IHtcbiAgICAgICAgZnV0dXJlIDogJ2luICVzJyxcbiAgICAgICAgcGFzdCAgIDogJyVzIGFnbycsXG4gICAgICAgIHMgIDogJ2EgZmV3IHNlY29uZHMnLFxuICAgICAgICBtICA6ICdhIG1pbnV0ZScsXG4gICAgICAgIG1tIDogJyVkIG1pbnV0ZXMnLFxuICAgICAgICBoICA6ICdhbiBob3VyJyxcbiAgICAgICAgaGggOiAnJWQgaG91cnMnLFxuICAgICAgICBkICA6ICdhIGRheScsXG4gICAgICAgIGRkIDogJyVkIGRheXMnLFxuICAgICAgICBNICA6ICdhIG1vbnRoJyxcbiAgICAgICAgTU0gOiAnJWQgbW9udGhzJyxcbiAgICAgICAgeSAgOiAnYSB5ZWFyJyxcbiAgICAgICAgeXkgOiAnJWQgeWVhcnMnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlX19yZWxhdGl2ZVRpbWUgKG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW3N0cmluZ107XG4gICAgICAgIHJldHVybiAodHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJykgP1xuICAgICAgICAgICAgb3V0cHV0KG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkgOlxuICAgICAgICAgICAgb3V0cHV0LnJlcGxhY2UoLyVkL2ksIG51bWJlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFzdEZ1dHVyZSAoZGlmZiwgb3V0cHV0KSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgICAgIHJldHVybiB0eXBlb2YgZm9ybWF0ID09PSAnZnVuY3Rpb24nID8gZm9ybWF0KG91dHB1dCkgOiBmb3JtYXQucmVwbGFjZSgvJXMvaSwgb3V0cHV0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVfc2V0X19zZXQgKGNvbmZpZykge1xuICAgICAgICB2YXIgcHJvcCwgaTtcbiAgICAgICAgZm9yIChpIGluIGNvbmZpZykge1xuICAgICAgICAgICAgcHJvcCA9IGNvbmZpZ1tpXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXNbaV0gPSBwcm9wO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzWydfJyArIGldID0gcHJvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBMZW5pZW50IG9yZGluYWwgcGFyc2luZyBhY2NlcHRzIGp1c3QgYSBudW1iZXIgaW4gYWRkaXRpb24gdG9cbiAgICAgICAgLy8gbnVtYmVyICsgKHBvc3NpYmx5KSBzdHVmZiBjb21pbmcgZnJvbSBfb3JkaW5hbFBhcnNlTGVuaWVudC5cbiAgICAgICAgdGhpcy5fb3JkaW5hbFBhcnNlTGVuaWVudCA9IG5ldyBSZWdFeHAodGhpcy5fb3JkaW5hbFBhcnNlLnNvdXJjZSArICd8JyArICgvXFxkezEsMn0vKS5zb3VyY2UpO1xuICAgIH1cblxuICAgIHZhciBwcm90b3R5cGVfX3Byb3RvID0gTG9jYWxlLnByb3RvdHlwZTtcblxuICAgIHByb3RvdHlwZV9fcHJvdG8uX2NhbGVuZGFyICAgICAgID0gZGVmYXVsdENhbGVuZGFyO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uY2FsZW5kYXIgICAgICAgID0gbG9jYWxlX2NhbGVuZGFyX19jYWxlbmRhcjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9sb25nRGF0ZUZvcm1hdCA9IGRlZmF1bHRMb25nRGF0ZUZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmxvbmdEYXRlRm9ybWF0ICA9IGxvbmdEYXRlRm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX2ludmFsaWREYXRlICAgID0gZGVmYXVsdEludmFsaWREYXRlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uaW52YWxpZERhdGUgICAgID0gaW52YWxpZERhdGU7XG4gICAgcHJvdG90eXBlX19wcm90by5fb3JkaW5hbCAgICAgICAgPSBkZWZhdWx0T3JkaW5hbDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm9yZGluYWwgICAgICAgICA9IG9yZGluYWw7XG4gICAgcHJvdG90eXBlX19wcm90by5fb3JkaW5hbFBhcnNlICAgPSBkZWZhdWx0T3JkaW5hbFBhcnNlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucHJlcGFyc2UgICAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucG9zdGZvcm1hdCAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3JlbGF0aXZlVGltZSAgID0gZGVmYXVsdFJlbGF0aXZlVGltZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnJlbGF0aXZlVGltZSAgICA9IHJlbGF0aXZlX19yZWxhdGl2ZVRpbWU7XG4gICAgcHJvdG90eXBlX19wcm90by5wYXN0RnV0dXJlICAgICAgPSBwYXN0RnV0dXJlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uc2V0ICAgICAgICAgICAgID0gbG9jYWxlX3NldF9fc2V0O1xuXG4gICAgLy8gTW9udGhcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRocyAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHM7XG4gICAgcHJvdG90eXBlX19wcm90by5fbW9udGhzICAgICAgPSBkZWZhdWx0TG9jYWxlTW9udGhzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubW9udGhzU2hvcnQgID0gICAgICAgIGxvY2FsZU1vbnRoc1Nob3J0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21vbnRoc1Nob3J0ID0gZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubW9udGhzUGFyc2UgID0gICAgICAgIGxvY2FsZU1vbnRoc1BhcnNlO1xuXG4gICAgLy8gV2Vla1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2VlayA9IGxvY2FsZVdlZWs7XG4gICAgcHJvdG90eXBlX19wcm90by5fd2VlayA9IGRlZmF1bHRMb2NhbGVXZWVrO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uZmlyc3REYXlPZlllYXIgPSBsb2NhbGVGaXJzdERheU9mWWVhcjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmZpcnN0RGF5T2ZXZWVrID0gbG9jYWxlRmlyc3REYXlPZldlZWs7XG5cbiAgICAvLyBEYXkgb2YgV2Vla1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2Vla2RheXMgICAgICAgPSAgICAgICAgbG9jYWxlV2Vla2RheXM7XG4gICAgcHJvdG90eXBlX19wcm90by5fd2Vla2RheXMgICAgICA9IGRlZmF1bHRMb2NhbGVXZWVrZGF5cztcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzTWluICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzTWluO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzTWluICAgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXNNaW47XG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5c1Nob3J0ICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c1Nob3J0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzU2hvcnQgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzUGFyc2UgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzUGFyc2U7XG5cbiAgICAvLyBIb3Vyc1xuICAgIHByb3RvdHlwZV9fcHJvdG8uaXNQTSA9IGxvY2FsZUlzUE07XG4gICAgcHJvdG90eXBlX19wcm90by5fbWVyaWRpZW1QYXJzZSA9IGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubWVyaWRpZW0gPSBsb2NhbGVNZXJpZGllbTtcblxuICAgIGZ1bmN0aW9uIGxpc3RzX19nZXQgKGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBzZXR0ZXIpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoKTtcbiAgICAgICAgdmFyIHV0YyA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQygpLnNldChzZXR0ZXIsIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIGxvY2FsZVtmaWVsZF0odXRjLCBmb3JtYXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3QgKGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBjb3VudCwgc2V0dGVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZm9ybWF0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0c19fZ2V0KGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBzZXR0ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIG91dFtpXSA9IGxpc3RzX19nZXQoZm9ybWF0LCBpLCBmaWVsZCwgc2V0dGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0TW9udGhzIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICdtb250aHMnLCAxMiwgJ21vbnRoJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RNb250aHNTaG9ydCAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnbW9udGhzU2hvcnQnLCAxMiwgJ21vbnRoJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RXZWVrZGF5cyAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnd2Vla2RheXMnLCA3LCAnZGF5Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RXZWVrZGF5c1Nob3J0IChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5c1Nob3J0JywgNywgJ2RheScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0V2Vla2RheXNNaW4gKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzTWluJywgNywgJ2RheScpO1xuICAgIH1cblxuICAgIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUoJ2VuJywge1xuICAgICAgICBvcmRpbmFsUGFyc2U6IC9cXGR7MSwyfSh0aHxzdHxuZHxyZCkvLFxuICAgICAgICBvcmRpbmFsIDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICAgICAgdmFyIGIgPSBudW1iZXIgJSAxMCxcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSAodG9JbnQobnVtYmVyICUgMTAwIC8gMTApID09PSAxKSA/ICd0aCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAxKSA/ICdzdCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAyKSA/ICduZCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAzKSA/ICdyZCcgOiAndGgnO1xuICAgICAgICAgICAgcmV0dXJuIG51bWJlciArIG91dHB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5sYW5nID0gZGVwcmVjYXRlKCdtb21lbnQubGFuZyBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZSBpbnN0ZWFkLicsIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUpO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5sYW5nRGF0YSA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmdEYXRhIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlRGF0YSBpbnN0ZWFkLicsIGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUpO1xuXG4gICAgdmFyIG1hdGhBYnMgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2Fic19fYWJzICgpIHtcbiAgICAgICAgdmFyIGRhdGEgICAgICAgICAgID0gdGhpcy5fZGF0YTtcblxuICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPSBtYXRoQWJzKHRoaXMuX21pbGxpc2Vjb25kcyk7XG4gICAgICAgIHRoaXMuX2RheXMgICAgICAgICA9IG1hdGhBYnModGhpcy5fZGF5cyk7XG4gICAgICAgIHRoaXMuX21vbnRocyAgICAgICA9IG1hdGhBYnModGhpcy5fbW9udGhzKTtcblxuICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyAgPSBtYXRoQWJzKGRhdGEubWlsbGlzZWNvbmRzKTtcbiAgICAgICAgZGF0YS5zZWNvbmRzICAgICAgID0gbWF0aEFicyhkYXRhLnNlY29uZHMpO1xuICAgICAgICBkYXRhLm1pbnV0ZXMgICAgICAgPSBtYXRoQWJzKGRhdGEubWludXRlcyk7XG4gICAgICAgIGRhdGEuaG91cnMgICAgICAgICA9IG1hdGhBYnMoZGF0YS5ob3Vycyk7XG4gICAgICAgIGRhdGEubW9udGhzICAgICAgICA9IG1hdGhBYnMoZGF0YS5tb250aHMpO1xuICAgICAgICBkYXRhLnllYXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEueWVhcnMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QgKGR1cmF0aW9uLCBpbnB1dCwgdmFsdWUsIGRpcmVjdGlvbikge1xuICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKGlucHV0LCB2YWx1ZSk7XG5cbiAgICAgICAgZHVyYXRpb24uX21pbGxpc2Vjb25kcyArPSBkaXJlY3Rpb24gKiBvdGhlci5fbWlsbGlzZWNvbmRzO1xuICAgICAgICBkdXJhdGlvbi5fZGF5cyAgICAgICAgICs9IGRpcmVjdGlvbiAqIG90aGVyLl9kYXlzO1xuICAgICAgICBkdXJhdGlvbi5fbW9udGhzICAgICAgICs9IGRpcmVjdGlvbiAqIG90aGVyLl9tb250aHM7XG5cbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBhZGQoMSwgJ3MnKSBvciBhZGQoZHVyYXRpb24pXG4gICAgZnVuY3Rpb24gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGQgKGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBpbnB1dCwgdmFsdWUsIDEpO1xuICAgIH1cblxuICAgIC8vIHN1cHBvcnRzIG9ubHkgMi4wLXN0eWxlIHN1YnRyYWN0KDEsICdzJykgb3Igc3VidHJhY3QoZHVyYXRpb24pXG4gICAgZnVuY3Rpb24gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19zdWJ0cmFjdCAoaW5wdXQsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGlucHV0LCB2YWx1ZSwgLTEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFic0NlaWwgKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ1YmJsZSAoKSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG4gICAgICAgIHZhciBkYXlzICAgICAgICAgPSB0aGlzLl9kYXlzO1xuICAgICAgICB2YXIgbW9udGhzICAgICAgID0gdGhpcy5fbW9udGhzO1xuICAgICAgICB2YXIgZGF0YSAgICAgICAgID0gdGhpcy5fZGF0YTtcbiAgICAgICAgdmFyIHNlY29uZHMsIG1pbnV0ZXMsIGhvdXJzLCB5ZWFycywgbW9udGhzRnJvbURheXM7XG5cbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIG1peCBvZiBwb3NpdGl2ZSBhbmQgbmVnYXRpdmUgdmFsdWVzLCBidWJibGUgZG93biBmaXJzdFxuICAgICAgICAvLyBjaGVjazogaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzIxNjZcbiAgICAgICAgaWYgKCEoKG1pbGxpc2Vjb25kcyA+PSAwICYmIGRheXMgPj0gMCAmJiBtb250aHMgPj0gMCkgfHxcbiAgICAgICAgICAgICAgICAobWlsbGlzZWNvbmRzIDw9IDAgJiYgZGF5cyA8PSAwICYmIG1vbnRocyA8PSAwKSkpIHtcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kcyArPSBhYnNDZWlsKG1vbnRoc1RvRGF5cyhtb250aHMpICsgZGF5cykgKiA4NjRlNTtcbiAgICAgICAgICAgIGRheXMgPSAwO1xuICAgICAgICAgICAgbW9udGhzID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgY29kZSBidWJibGVzIHVwIHZhbHVlcywgc2VlIHRoZSB0ZXN0cyBmb3JcbiAgICAgICAgLy8gZXhhbXBsZXMgb2Ygd2hhdCB0aGF0IG1lYW5zLlxuICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcyAlIDEwMDA7XG5cbiAgICAgICAgc2Vjb25kcyAgICAgICAgICAgPSBhYnNGbG9vcihtaWxsaXNlY29uZHMgLyAxMDAwKTtcbiAgICAgICAgZGF0YS5zZWNvbmRzICAgICAgPSBzZWNvbmRzICUgNjA7XG5cbiAgICAgICAgbWludXRlcyAgICAgICAgICAgPSBhYnNGbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgICBkYXRhLm1pbnV0ZXMgICAgICA9IG1pbnV0ZXMgJSA2MDtcblxuICAgICAgICBob3VycyAgICAgICAgICAgICA9IGFic0Zsb29yKG1pbnV0ZXMgLyA2MCk7XG4gICAgICAgIGRhdGEuaG91cnMgICAgICAgID0gaG91cnMgJSAyNDtcblxuICAgICAgICBkYXlzICs9IGFic0Zsb29yKGhvdXJzIC8gMjQpO1xuXG4gICAgICAgIC8vIGNvbnZlcnQgZGF5cyB0byBtb250aHNcbiAgICAgICAgbW9udGhzRnJvbURheXMgPSBhYnNGbG9vcihkYXlzVG9Nb250aHMoZGF5cykpO1xuICAgICAgICBtb250aHMgKz0gbW9udGhzRnJvbURheXM7XG4gICAgICAgIGRheXMgLT0gYWJzQ2VpbChtb250aHNUb0RheXMobW9udGhzRnJvbURheXMpKTtcblxuICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgIHllYXJzID0gYWJzRmxvb3IobW9udGhzIC8gMTIpO1xuICAgICAgICBtb250aHMgJT0gMTI7XG5cbiAgICAgICAgZGF0YS5kYXlzICAgPSBkYXlzO1xuICAgICAgICBkYXRhLm1vbnRocyA9IG1vbnRocztcbiAgICAgICAgZGF0YS55ZWFycyAgPSB5ZWFycztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzVG9Nb250aHMgKGRheXMpIHtcbiAgICAgICAgLy8gNDAwIHllYXJzIGhhdmUgMTQ2MDk3IGRheXMgKHRha2luZyBpbnRvIGFjY291bnQgbGVhcCB5ZWFyIHJ1bGVzKVxuICAgICAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxMiBtb250aHMgPT09IDQ4MDBcbiAgICAgICAgcmV0dXJuIGRheXMgKiA0ODAwIC8gMTQ2MDk3O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbnRoc1RvRGF5cyAobW9udGhzKSB7XG4gICAgICAgIC8vIHRoZSByZXZlcnNlIG9mIGRheXNUb01vbnRoc1xuICAgICAgICByZXR1cm4gbW9udGhzICogMTQ2MDk3IC8gNDgwMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcyAodW5pdHMpIHtcbiAgICAgICAgdmFyIGRheXM7XG4gICAgICAgIHZhciBtb250aHM7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG5cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgaWYgKHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgIGRheXMgICA9IHRoaXMuX2RheXMgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgbW9udGhzID0gdGhpcy5fbW9udGhzICsgZGF5c1RvTW9udGhzKGRheXMpO1xuICAgICAgICAgICAgcmV0dXJuIHVuaXRzID09PSAnbW9udGgnID8gbW9udGhzIDogbW9udGhzIC8gMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBoYW5kbGUgbWlsbGlzZWNvbmRzIHNlcGFyYXRlbHkgYmVjYXVzZSBvZiBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyAoaXNzdWUgIzE4NjcpXG4gICAgICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyArIE1hdGgucm91bmQobW9udGhzVG9EYXlzKHRoaXMuX21vbnRocykpO1xuICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWsnICAgOiByZXR1cm4gZGF5cyAvIDcgICAgICsgbWlsbGlzZWNvbmRzIC8gNjA0OGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RheScgICAgOiByZXR1cm4gZGF5cyAgICAgICAgICsgbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnaG91cicgICA6IHJldHVybiBkYXlzICogMjQgICAgKyBtaWxsaXNlY29uZHMgLyAzNmU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ21pbnV0ZScgOiByZXR1cm4gZGF5cyAqIDE0NDAgICsgbWlsbGlzZWNvbmRzIC8gNmU0O1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NlY29uZCcgOiByZXR1cm4gZGF5cyAqIDg2NDAwICsgbWlsbGlzZWNvbmRzIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBNYXRoLmZsb29yIHByZXZlbnRzIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIGhlcmVcbiAgICAgICAgICAgICAgICBjYXNlICdtaWxsaXNlY29uZCc6IHJldHVybiBNYXRoLmZsb29yKGRheXMgKiA4NjRlNSkgKyBtaWxsaXNlY29uZHM7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHVuaXQgJyArIHVuaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSB0aGlzLmFzKCdtcycpP1xuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FzX192YWx1ZU9mICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICB0aGlzLl9kYXlzICogODY0ZTUgK1xuICAgICAgICAgICAgKHRoaXMuX21vbnRocyAlIDEyKSAqIDI1OTJlNiArXG4gICAgICAgICAgICB0b0ludCh0aGlzLl9tb250aHMgLyAxMikgKiAzMTUzNmU2XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUFzIChhbGlhcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXMoYWxpYXMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBhc01pbGxpc2Vjb25kcyA9IG1ha2VBcygnbXMnKTtcbiAgICB2YXIgYXNTZWNvbmRzICAgICAgPSBtYWtlQXMoJ3MnKTtcbiAgICB2YXIgYXNNaW51dGVzICAgICAgPSBtYWtlQXMoJ20nKTtcbiAgICB2YXIgYXNIb3VycyAgICAgICAgPSBtYWtlQXMoJ2gnKTtcbiAgICB2YXIgYXNEYXlzICAgICAgICAgPSBtYWtlQXMoJ2QnKTtcbiAgICB2YXIgYXNXZWVrcyAgICAgICAgPSBtYWtlQXMoJ3cnKTtcbiAgICB2YXIgYXNNb250aHMgICAgICAgPSBtYWtlQXMoJ00nKTtcbiAgICB2YXIgYXNZZWFycyAgICAgICAgPSBtYWtlQXMoJ3knKTtcblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2dldF9fZ2V0ICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHMgKyAncyddKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUdldHRlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtuYW1lXTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgbWlsbGlzZWNvbmRzID0gbWFrZUdldHRlcignbWlsbGlzZWNvbmRzJyk7XG4gICAgdmFyIHNlY29uZHMgICAgICA9IG1ha2VHZXR0ZXIoJ3NlY29uZHMnKTtcbiAgICB2YXIgbWludXRlcyAgICAgID0gbWFrZUdldHRlcignbWludXRlcycpO1xuICAgIHZhciBob3VycyAgICAgICAgPSBtYWtlR2V0dGVyKCdob3VycycpO1xuICAgIHZhciBkYXlzICAgICAgICAgPSBtYWtlR2V0dGVyKCdkYXlzJyk7XG4gICAgdmFyIG1vbnRocyAgICAgICA9IG1ha2VHZXR0ZXIoJ21vbnRocycpO1xuICAgIHZhciB5ZWFycyAgICAgICAgPSBtYWtlR2V0dGVyKCd5ZWFycycpO1xuXG4gICAgZnVuY3Rpb24gd2Vla3MgKCkge1xuICAgICAgICByZXR1cm4gYWJzRmxvb3IodGhpcy5kYXlzKCkgLyA3KTtcbiAgICB9XG5cbiAgICB2YXIgcm91bmQgPSBNYXRoLnJvdW5kO1xuICAgIHZhciB0aHJlc2hvbGRzID0ge1xuICAgICAgICBzOiA0NSwgIC8vIHNlY29uZHMgdG8gbWludXRlXG4gICAgICAgIG06IDQ1LCAgLy8gbWludXRlcyB0byBob3VyXG4gICAgICAgIGg6IDIyLCAgLy8gaG91cnMgdG8gZGF5XG4gICAgICAgIGQ6IDI2LCAgLy8gZGF5cyB0byBtb250aFxuICAgICAgICBNOiAxMSAgIC8vIG1vbnRocyB0byB5ZWFyXG4gICAgfTtcblxuICAgIC8vIGhlbHBlciBmdW5jdGlvbiBmb3IgbW9tZW50LmZuLmZyb20sIG1vbWVudC5mbi5mcm9tTm93LCBhbmQgbW9tZW50LmR1cmF0aW9uLmZuLmh1bWFuaXplXG4gICAgZnVuY3Rpb24gc3Vic3RpdHV0ZVRpbWVBZ28oc3RyaW5nLCBudW1iZXIsIHdpdGhvdXRTdWZmaXgsIGlzRnV0dXJlLCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5yZWxhdGl2ZVRpbWUobnVtYmVyIHx8IDEsICEhd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHVyYXRpb25faHVtYW5pemVfX3JlbGF0aXZlVGltZSAocG9zTmVnRHVyYXRpb24sIHdpdGhvdXRTdWZmaXgsIGxvY2FsZSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKHBvc05lZ0R1cmF0aW9uKS5hYnMoKTtcbiAgICAgICAgdmFyIHNlY29uZHMgID0gcm91bmQoZHVyYXRpb24uYXMoJ3MnKSk7XG4gICAgICAgIHZhciBtaW51dGVzICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdtJykpO1xuICAgICAgICB2YXIgaG91cnMgICAgPSByb3VuZChkdXJhdGlvbi5hcygnaCcpKTtcbiAgICAgICAgdmFyIGRheXMgICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ2QnKSk7XG4gICAgICAgIHZhciBtb250aHMgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdNJykpO1xuICAgICAgICB2YXIgeWVhcnMgICAgPSByb3VuZChkdXJhdGlvbi5hcygneScpKTtcblxuICAgICAgICB2YXIgYSA9IHNlY29uZHMgPCB0aHJlc2hvbGRzLnMgJiYgWydzJywgc2Vjb25kc10gIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA9PT0gMSAgICAgICAgICAmJiBbJ20nXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzIDwgdGhyZXNob2xkcy5tICYmIFsnbW0nLCBtaW51dGVzXSB8fFxuICAgICAgICAgICAgICAgIGhvdXJzICAgPT09IDEgICAgICAgICAgJiYgWydoJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgaG91cnMgICA8IHRocmVzaG9sZHMuaCAmJiBbJ2hoJywgaG91cnNdICAgfHxcbiAgICAgICAgICAgICAgICBkYXlzICAgID09PSAxICAgICAgICAgICYmIFsnZCddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIGRheXMgICAgPCB0aHJlc2hvbGRzLmQgJiYgWydkZCcsIGRheXNdICAgIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzICA9PT0gMSAgICAgICAgICAmJiBbJ00nXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBtb250aHMgIDwgdGhyZXNob2xkcy5NICYmIFsnTU0nLCBtb250aHNdICB8fFxuICAgICAgICAgICAgICAgIHllYXJzICAgPT09IDEgICAgICAgICAgJiYgWyd5J10gICAgICAgICAgIHx8IFsneXknLCB5ZWFyc107XG5cbiAgICAgICAgYVsyXSA9IHdpdGhvdXRTdWZmaXg7XG4gICAgICAgIGFbM10gPSArcG9zTmVnRHVyYXRpb24gPiAwO1xuICAgICAgICBhWzRdID0gbG9jYWxlO1xuICAgICAgICByZXR1cm4gc3Vic3RpdHV0ZVRpbWVBZ28uYXBwbHkobnVsbCwgYSk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCBhIHRocmVzaG9sZCBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgZnVuY3Rpb24gZHVyYXRpb25faHVtYW5pemVfX2dldFNldFJlbGF0aXZlVGltZVRocmVzaG9sZCAodGhyZXNob2xkLCBsaW1pdCkge1xuICAgICAgICBpZiAodGhyZXNob2xkc1t0aHJlc2hvbGRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGltaXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRocmVzaG9sZHNbdGhyZXNob2xkXTtcbiAgICAgICAgfVxuICAgICAgICB0aHJlc2hvbGRzW3RocmVzaG9sZF0gPSBsaW1pdDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaHVtYW5pemUgKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IHRoaXMubG9jYWxlRGF0YSgpO1xuICAgICAgICB2YXIgb3V0cHV0ID0gZHVyYXRpb25faHVtYW5pemVfX3JlbGF0aXZlVGltZSh0aGlzLCAhd2l0aFN1ZmZpeCwgbG9jYWxlKTtcblxuICAgICAgICBpZiAod2l0aFN1ZmZpeCkge1xuICAgICAgICAgICAgb3V0cHV0ID0gbG9jYWxlLnBhc3RGdXR1cmUoK3RoaXMsIG91dHB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbG9jYWxlLnBvc3Rmb3JtYXQob3V0cHV0KTtcbiAgICB9XG5cbiAgICB2YXIgaXNvX3N0cmluZ19fYWJzID0gTWF0aC5hYnM7XG5cbiAgICBmdW5jdGlvbiBpc29fc3RyaW5nX190b0lTT1N0cmluZygpIHtcbiAgICAgICAgLy8gZm9yIElTTyBzdHJpbmdzIHdlIGRvIG5vdCB1c2UgdGhlIG5vcm1hbCBidWJibGluZyBydWxlczpcbiAgICAgICAgLy8gICogbWlsbGlzZWNvbmRzIGJ1YmJsZSB1cCB1bnRpbCB0aGV5IGJlY29tZSBob3Vyc1xuICAgICAgICAvLyAgKiBkYXlzIGRvIG5vdCBidWJibGUgYXQgYWxsXG4gICAgICAgIC8vICAqIG1vbnRocyBidWJibGUgdXAgdW50aWwgdGhleSBiZWNvbWUgeWVhcnNcbiAgICAgICAgLy8gVGhpcyBpcyBiZWNhdXNlIHRoZXJlIGlzIG5vIGNvbnRleHQtZnJlZSBjb252ZXJzaW9uIGJldHdlZW4gaG91cnMgYW5kIGRheXNcbiAgICAgICAgLy8gKHRoaW5rIG9mIGNsb2NrIGNoYW5nZXMpXG4gICAgICAgIC8vIGFuZCBhbHNvIG5vdCBiZXR3ZWVuIGRheXMgYW5kIG1vbnRocyAoMjgtMzEgZGF5cyBwZXIgbW9udGgpXG4gICAgICAgIHZhciBzZWNvbmRzID0gaXNvX3N0cmluZ19fYWJzKHRoaXMuX21pbGxpc2Vjb25kcykgLyAxMDAwO1xuICAgICAgICB2YXIgZGF5cyAgICAgICAgID0gaXNvX3N0cmluZ19fYWJzKHRoaXMuX2RheXMpO1xuICAgICAgICB2YXIgbW9udGhzICAgICAgID0gaXNvX3N0cmluZ19fYWJzKHRoaXMuX21vbnRocyk7XG4gICAgICAgIHZhciBtaW51dGVzLCBob3VycywgeWVhcnM7XG5cbiAgICAgICAgLy8gMzYwMCBzZWNvbmRzIC0+IDYwIG1pbnV0ZXMgLT4gMSBob3VyXG4gICAgICAgIG1pbnV0ZXMgICAgICAgICAgID0gYWJzRmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgaG91cnMgICAgICAgICAgICAgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgICAgICBzZWNvbmRzICU9IDYwO1xuICAgICAgICBtaW51dGVzICU9IDYwO1xuXG4gICAgICAgIC8vIDEyIG1vbnRocyAtPiAxIHllYXJcbiAgICAgICAgeWVhcnMgID0gYWJzRmxvb3IobW9udGhzIC8gMTIpO1xuICAgICAgICBtb250aHMgJT0gMTI7XG5cblxuICAgICAgICAvLyBpbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vZG9yZGlsbGUvbW9tZW50LWlzb2R1cmF0aW9uL2Jsb2IvbWFzdGVyL21vbWVudC5pc29kdXJhdGlvbi5qc1xuICAgICAgICB2YXIgWSA9IHllYXJzO1xuICAgICAgICB2YXIgTSA9IG1vbnRocztcbiAgICAgICAgdmFyIEQgPSBkYXlzO1xuICAgICAgICB2YXIgaCA9IGhvdXJzO1xuICAgICAgICB2YXIgbSA9IG1pbnV0ZXM7XG4gICAgICAgIHZhciBzID0gc2Vjb25kcztcbiAgICAgICAgdmFyIHRvdGFsID0gdGhpcy5hc1NlY29uZHMoKTtcblxuICAgICAgICBpZiAoIXRvdGFsKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBzYW1lIGFzIEMjJ3MgKE5vZGEpIGFuZCBweXRob24gKGlzb2RhdGUpLi4uXG4gICAgICAgICAgICAvLyBidXQgbm90IG90aGVyIEpTIChnb29nLmRhdGUpXG4gICAgICAgICAgICByZXR1cm4gJ1AwRCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHRvdGFsIDwgMCA/ICctJyA6ICcnKSArXG4gICAgICAgICAgICAnUCcgK1xuICAgICAgICAgICAgKFkgPyBZICsgJ1knIDogJycpICtcbiAgICAgICAgICAgIChNID8gTSArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAoRCA/IEQgKyAnRCcgOiAnJykgK1xuICAgICAgICAgICAgKChoIHx8IG0gfHwgcykgPyAnVCcgOiAnJykgK1xuICAgICAgICAgICAgKGggPyBoICsgJ0gnIDogJycpICtcbiAgICAgICAgICAgIChtID8gbSArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAocyA/IHMgKyAnUycgOiAnJyk7XG4gICAgfVxuXG4gICAgdmFyIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8gPSBEdXJhdGlvbi5wcm90b3R5cGU7XG5cbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFicyAgICAgICAgICAgID0gZHVyYXRpb25fYWJzX19hYnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hZGQgICAgICAgICAgICA9IGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uc3VidHJhY3QgICAgICAgPSBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX3N1YnRyYWN0O1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXMgICAgICAgICAgICAgPSBhcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzTWlsbGlzZWNvbmRzID0gYXNNaWxsaXNlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc1NlY29uZHMgICAgICA9IGFzU2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzTWludXRlcyAgICAgID0gYXNNaW51dGVzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNIb3VycyAgICAgICAgPSBhc0hvdXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNEYXlzICAgICAgICAgPSBhc0RheXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc1dlZWtzICAgICAgICA9IGFzV2Vla3M7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc01vbnRocyAgICAgICA9IGFzTW9udGhzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNZZWFycyAgICAgICAgPSBhc1llYXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udmFsdWVPZiAgICAgICAgPSBkdXJhdGlvbl9hc19fdmFsdWVPZjtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLl9idWJibGUgICAgICAgID0gYnViYmxlO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uZ2V0ICAgICAgICAgICAgPSBkdXJhdGlvbl9nZXRfX2dldDtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLm1pbGxpc2Vjb25kcyAgID0gbWlsbGlzZWNvbmRzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uc2Vjb25kcyAgICAgICAgPSBzZWNvbmRzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubWludXRlcyAgICAgICAgPSBtaW51dGVzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uaG91cnMgICAgICAgICAgPSBob3VycztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmRheXMgICAgICAgICAgID0gZGF5cztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLndlZWtzICAgICAgICAgID0gd2Vla3M7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5tb250aHMgICAgICAgICA9IG1vbnRocztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnllYXJzICAgICAgICAgID0geWVhcnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5odW1hbml6ZSAgICAgICA9IGh1bWFuaXplO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9JU09TdHJpbmcgICAgPSBpc29fc3RyaW5nX190b0lTT1N0cmluZztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnRvU3RyaW5nICAgICAgID0gaXNvX3N0cmluZ19fdG9JU09TdHJpbmc7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b0pTT04gICAgICAgICA9IGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubG9jYWxlICAgICAgICAgPSBsb2NhbGU7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5sb2NhbGVEYXRhICAgICA9IGxvY2FsZURhdGE7XG5cbiAgICAvLyBEZXByZWNhdGlvbnNcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnRvSXNvU3RyaW5nID0gZGVwcmVjYXRlKCd0b0lzb1N0cmluZygpIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdG9JU09TdHJpbmcoKSBpbnN0ZWFkIChub3RpY2UgdGhlIGNhcGl0YWxzKScsIGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nKTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmxhbmcgPSBsYW5nO1xuXG4gICAgLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1gnLCAwLCAwLCAndW5peCcpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd4JywgMCwgMCwgJ3ZhbHVlT2YnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3gnLCBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignWCcsIG1hdGNoVGltZXN0YW1wKTtcbiAgICBhZGRQYXJzZVRva2VuKCdYJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHBhcnNlRmxvYXQoaW5wdXQsIDEwKSAqIDEwMDApO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ3gnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUodG9JbnQoaW5wdXQpKTtcbiAgICB9KTtcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnZlcnNpb24gPSAnMi4xMC42JztcblxuICAgIHNldEhvb2tDYWxsYmFjayhsb2NhbF9fY3JlYXRlTG9jYWwpO1xuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmZuICAgICAgICAgICAgICAgICAgICA9IG1vbWVudFByb3RvdHlwZTtcbiAgICB1dGlsc19ob29rc19faG9va3MubWluICAgICAgICAgICAgICAgICAgID0gbWluO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5tYXggICAgICAgICAgICAgICAgICAgPSBtYXg7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnV0YyAgICAgICAgICAgICAgICAgICA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQztcbiAgICB1dGlsc19ob29rc19faG9va3MudW5peCAgICAgICAgICAgICAgICAgID0gbW9tZW50X19jcmVhdGVVbml4O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5tb250aHMgICAgICAgICAgICAgICAgPSBsaXN0c19fbGlzdE1vbnRocztcbiAgICB1dGlsc19ob29rc19faG9va3MuaXNEYXRlICAgICAgICAgICAgICAgID0gaXNEYXRlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5sb2NhbGUgICAgICAgICAgICAgICAgPSBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5pbnZhbGlkICAgICAgICAgICAgICAgPSB2YWxpZF9fY3JlYXRlSW52YWxpZDtcbiAgICB1dGlsc19ob29rc19faG9va3MuZHVyYXRpb24gICAgICAgICAgICAgID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbjtcbiAgICB1dGlsc19ob29rc19faG9va3MuaXNNb21lbnQgICAgICAgICAgICAgID0gaXNNb21lbnQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLndlZWtkYXlzICAgICAgICAgICAgICA9IGxpc3RzX19saXN0V2Vla2RheXM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlWm9uZSAgICAgICAgICAgICA9IG1vbWVudF9fY3JlYXRlSW5ab25lO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5sb2NhbGVEYXRhICAgICAgICAgICAgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5pc0R1cmF0aW9uICAgICAgICAgICAgPSBpc0R1cmF0aW9uO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5tb250aHNTaG9ydCAgICAgICAgICAgPSBsaXN0c19fbGlzdE1vbnRoc1Nob3J0O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy53ZWVrZGF5c01pbiAgICAgICAgICAgPSBsaXN0c19fbGlzdFdlZWtkYXlzTWluO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5kZWZpbmVMb2NhbGUgICAgICAgICAgPSBkZWZpbmVMb2NhbGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLndlZWtkYXlzU2hvcnQgICAgICAgICA9IGxpc3RzX19saXN0V2Vla2RheXNTaG9ydDtcbiAgICB1dGlsc19ob29rc19faG9va3Mubm9ybWFsaXplVW5pdHMgICAgICAgID0gbm9ybWFsaXplVW5pdHM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnJlbGF0aXZlVGltZVRocmVzaG9sZCA9IGR1cmF0aW9uX2h1bWFuaXplX19nZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQ7XG5cbiAgICB2YXIgX21vbWVudCA9IHV0aWxzX2hvb2tzX19ob29rcztcblxuICAgIHJldHVybiBfbW9tZW50O1xuXG59KSk7IiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHsgY2F0ZWdvcnlOYW1lOlxuLy8gICB7IGludGVyZXN0TmFtZTpcbi8vICAgICB7IHNvdXJjZTogJ2ZhY2Vib29rJyxcbi8vICAgICAgIGNsaWNrczogNSxcbi8vICAgICAgIGFkZGVkOiBEYXRlLm5vdygpIH0sXG4vLyAgICAgLi4uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3RhdGljSW50ZXJlc3RzOiB7XG4gICAgbXVzaWM6ICAgICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMzEsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ3JvY2sgbXVzaWMsamF6eixjb25jZXJ0cyxvcGVyYScgfSxcbiAgICBcImZyZW5jaCBhY3RvcnNcIjogICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDM3LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnZHJhbWEsZmlsbScgfSxcbiAgICBhY3RvcnM6ICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAzNSwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ2N6ZWNoIGZpbG0sIGZpbG0nIH0sXG4gICAgXCJsYSByaW9qYVwiOiAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAzMiwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ3NwYWluJyB9LFxuICAgIFwiY2FzdGlsbGUgeSBsZcOzblwiOiAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDQ1LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnc3BhaW4nIH0sXG4gICAgc3BhaW46ICAgICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMjAsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdsYSByaW9qYSxjYXN0aWxsZSB5IGxlw7NuJyB9LFxuICAgIHNwaXJpdHVhbGl0eTogICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDE4LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnbGl0ZXJhdHVyZSxtdXNpYycgfSxcbiAgICBcImN6ZWNoIGZpbG1cIjogICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDU0LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnZmlsbSxhY3RvcnMnIH0sXG4gICAgXCJyb2NrIG11c2ljXCI6ICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAxMiwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ211c2ljJyB9LFxuICAgIFwid29ybGQgbXVzaWNcIjogICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTAsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdtdXNpYycgfSxcbiAgICBqYXp6OiAgICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAxNiwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnbXVzaWMnIH0sXG4gICAgdGVjaG5vbG9neTogICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTksIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdoZWFsdGgsc2NpZW5jZScgfSxcbiAgICBoZWFsdGg6ICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAyMCwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnc2NpZW5jZSxkZW50YWwnIH0sXG4gICAgZGVudGFsOiAgICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMjEsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdoZWFsdGgnIH0sXG4gICAgY29taWNzOiAgICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMzQsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdodW1vcixsaXRlcmF0dXJlJyB9LFxuICAgIGh1bW9yOiAgICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDEwLCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnYWN0b3JzLGxpdGVyYXR1cmUnIH0sXG4gICAgbGl0ZXJhdHVyZTogICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTEsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICd0aGVhdGVyLGNvbWljcycgfSxcbiAgICBzY2llbmNlOiAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAxMywgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ3RlY2hub2xvZ3ksaGVhbHRoJyB9LFxuICAgIGRyYW1hOiAgICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDE5LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAndGhlYXRlcixmaWxtLGxpdGVyYXR1cmUnIH0sXG4gICAgdGhlYXRlcjogICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMjAsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdkcmFtYSxsaXRlcmF0dXJlLG9wZXJhJyB9LFxuICAgIGZpbG06ICAgICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDIxLCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnZHJhbWEsbGl0ZXJhdHVyZSxjb21pY3MnIH0sXG4gICAgY29uY2VydHM6ICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMzAsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdtdXNpYyx0aGVhdGVyJyB9LFxuICAgIFwiY29udGVtcG9yYXJ5IGFydFwiOiB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTgsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ2xpdGVyYXR1cmUsZmlsbSx0aGVhdGVyJyB9LFxuICAgIG9wZXJhOiAgICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDI1LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnbXVzaWMsdGhlYXRlcicgfSxcbiAgICBmaXRuZXNzOiAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAxNiwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ2hlYWx0aCxzY2llbmNlJyB9XG4gIH0sXG5cbiAgY2FwaXRhbGl6ZTogZnVuY3Rpb24ocykge1xuICAgIHJldHVybihzWzBdLnRvVXBwZXJDYXNlKCkgKyBzLnN1YnN0cigxKSk7XG4gIH0sXG5cbiAgYmxpbmtOb2RlczogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ2JsaW5rTm9kZXMhISEhISEnKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHNlbGVjdGVkSW50ZXJlc3RzID0gT2JqZWN0LmtleXModGhpcy5zdGF0aWNJbnRlcmVzdHMpLmZpbHRlcihmdW5jdGlvbihpbnRlcmVzdCkge1xuICAgICAgcmV0dXJuIHRoYXQuc3RhdGljSW50ZXJlc3RzW2ludGVyZXN0XVsnc2VsZWN0ZWQnXTtcbiAgICB9KS5yZWR1Y2UoZnVuY3Rpb24oaXMsIGkpIHtcbiAgICAgIGlzW2ldID0gdGhhdC5zdGF0aWNJbnRlcmVzdHNbaV07XG4gICAgICByZXR1cm4gaXM7XG4gICAgfSwge30pO1xuICAgIHZhciBzZWxlY3RlZEludGVyZXN0S2V5cyA9IE9iamVjdC5rZXlzKHNlbGVjdGVkSW50ZXJlc3RzKTtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShzZWxlY3RlZEludGVyZXN0S2V5cykpO1xuXG4gICAgJChcIipbdmRuYWNsYXNzXVwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgaWYoJChlbCkuYXR0cigndmRuYWNsYXNzJykuc3BsaXQoLywvKS5yZWR1Y2UoZnVuY3Rpb24oc2hvd09ySGlkZSwga2V5d29yZCkge1xuICAgICAgICByZXR1cm4gc2hvd09ySGlkZSB8fCAoc2VsZWN0ZWRJbnRlcmVzdEtleXMuaW5kZXhPZihrZXl3b3JkKSA+IC0xKTtcbiAgICAgIH0sIGZhbHNlKSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnc2hvd2luZyAnICsgJChlbCkuYXR0cigndmRuYWNsYXNzJykpO1xuICAgICAgICAkKGVsKS5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnaGlkaW5nICcgKyAkKGVsKS5hdHRyKCd2ZG5hY2xhc3MnKSk7XG4gICAgICAgICQoZWwpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKlxuICAgYWRkSW50ZXJlc3Q6IGZ1bmN0aW9uKGNhdGVnb3J5LCBpbnRlcmVzdCkge1xuICAgICBzdGF0aWNEYXRhW2NhdGVnb3J5XVtpbnRlcmVzdF0gPSB7IGNhdGVnb3J5OiBjYXRlZ29yeSwgc291cmNlOiAndmRuYScsIGNsaWNrczogMSwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiB0cnVlIH07XG4gICB9LFxuICAgKi9cblxuICBhZGRJbnRlcmVzdDogZnVuY3Rpb24oaW50ZXJlc3QpIHtcbiAgICBpZih0aGlzLnN0YXRpY0ludGVyZXN0c1tpbnRlcmVzdF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zdGF0aWNJbnRlcmVzdHNbaW50ZXJlc3RdWydzZWxlY3RlZCddID0gdHJ1ZTtcbiAgICAgIHRoaXMuYmxpbmtOb2RlcygpO1xuICAgICAgLy8gUmVhY3QucmVuZGVyKDxWZG5hTWVudSAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZkbmFtZW51JykpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgLypcbiAgIHZhciBhZGRSZWxhdGVkSW50ZXJlc3QgPSBmdW5jdGlvbihjYXRlZ29yeSwgaW50ZXJlc3QpIHtcbiAgICAgc3RhdGljRGF0YVtjYXRlZ29yeV1baW50ZXJlc3RdWydzZWxlY3RlZCddID0gdHJ1ZTtcbiAgICAgUmVhY3QucmVuZGVyKDxWZG5hTWVudSAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZkbmFtZW51JykpO1xuICAgfSxcbiAgICovXG5cbiAgYWRkUmVsYXRlZEludGVyZXN0OiBmdW5jdGlvbihpbnRlcmVzdCkge1xuICAgIHRoaXMuc3RhdGljSW50ZXJlc3RzW2ludGVyZXN0XVsnc2VsZWN0ZWQnXSA9IHRydWU7XG4gICAgdGhpcy5ibGlua05vZGVzKCk7XG4gICAgLy8gUmVhY3QucmVuZGVyKDxWZG5hTWVudSAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZkbmFtZW51JykpO1xuICB9LFxuXG4gIC8qXG4gICB1bkxpa2VBbkludGVyZXN0OiBmdW5jdGlvbihjYXRlZ29yeSwgaW50ZXJlc3QpIHtcbiAgICAgc3RhdGljRGF0YVtjYXRlZ29yeV1baW50ZXJlc3RdWydzZWxlY3RlZCddID0gZmFsc2U7XG4gICAgIFJlYWN0LnJlbmRlcig8VmRuYU1lbnUgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZG5hbWVudScpKTtcbiAgIH0sXG4gICAqL1xuXG4gIHVuTGlrZUFuSW50ZXJlc3Q6IGZ1bmN0aW9uKGludGVyZXN0KSB7XG4gICAgdGhpcy5zdGF0aWNJbnRlcmVzdHNbaW50ZXJlc3RdWydzZWxlY3RlZCddID0gZmFsc2U7XG4gICAgdGhpcy5ibGlua05vZGVzKCk7XG4gICAgLy8gUmVhY3QucmVuZGVyKDxWZG5hTWVudSAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZkbmFtZW51JykpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJ3ZkbmEvc3RhdGljX2RhdGEnKTtcbi8vIHZhciBBdXRvY29tcGxldGUgPSByZXF1aXJlKCdyZWFjdC1hdXRvY29tcGxldGUvbGliL21haW4uanMnKTtcbi8vIHZhciBDb21ib2JveCA9IEF1dG9jb21wbGV0ZS5Db21ib2JveDtcbi8vIHZhciBDb21ib2JveE9wdGlvbiA9IEF1dG9jb21wbGV0ZS5Db21ib2JveE9wdGlvbjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXV0b2NvbXBsZXRlIGNvZGVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEF1dG9jb21wbGV0ZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdBdXRvY29tcGxldGUnLFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9zZXRJbnB1dEZyb21WYWx1ZSgpO1xuICAgIHZhciBoaWdobGlnaHRlZEluZGV4O1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAvLyBlbnRlci5cbiAgICAgICAgICBjb25zb2xlLmxvZygnRU5URVIhJyk7XG4gICAgICAgICAgdGhhdC5wcm9wcy5hZGRMaWtlRG9uZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgLy8gdGFiXG4gICAgICAgICAgY29uc29sZS5sb2coJ1RBQiEnKTtcbiAgICAgICAgICB0aGF0Ll9zZXRGcm9tSGlnaGxpZ2h0ZWQoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAvLyB1cFxuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXggPSB0aGF0Ll9oaWdobGlnaHRlZEluZGV4KCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1VQISAnICsgaGlnaGxpZ2h0ZWRJbmRleCk7XG4gICAgICAgICAgaWYgKGhpZ2hsaWdodGVkSW5kZXggPiAwKSB7XG4gICAgICAgICAgICB0aGF0LnNldFN0YXRlKHsgaGlnaGxpZ2h0ZWRWYWx1ZTogdGhhdC5fY3VycmVudE1hdGNoZXMoKVtoaWdobGlnaHRlZEluZGV4IC0gMV0gfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgIC8vIGRvd25cbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4ID0gdGhhdC5faGlnaGxpZ2h0ZWRJbmRleCgpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdET1dOISAnICsgaGlnaGxpZ2h0ZWRJbmRleCk7XG4gICAgICAgICAgaWYgKGhpZ2hsaWdodGVkSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aGF0LnNldFN0YXRlKHsgaGlnaGxpZ2h0ZWRWYWx1ZTogdGhhdC5fY3VycmVudE1hdGNoZXMoKVswXSB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGhpZ2hsaWdodGVkSW5kZXggPCB0aGF0Ll9jdXJyZW50TWF0Y2hlcygpLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHRoYXQuc2V0U3RhdGUoeyBoaWdobGlnaHRlZFZhbHVlOiB0aGF0Ll9jdXJyZW50TWF0Y2hlcygpW2hpZ2hsaWdodGVkSW5kZXggKyAxXSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogJ2FwcGxlJyxcbiAgICAgIGxpbWl0VG9MaXN0OiB0cnVlLFxuICAgICAgbWF4SXRlbXNTaG93bjogOCxcbiAgICAgIHNvdXJjZVVybDogbnVsbCxcbiAgICAgIGRlZmF1bHRMaXN0OiBbJ2FwcGxlJywgJ2JhbmFuYScsICdvcmFuZ2UnLCAnZ3JhcGUnLCAnY2hlcnJ5J10sXG4gICAgICBhbHNvU2VhcmNoVmFsdWVzOiBmYWxzZSxcbiAgICAgIGxvYWRVcmxPbmNlOiB0cnVlLFxuICAgICAgc2VsZWN0QWxsVGV4dE9uQ2xpY2s6IHRydWUsXG4gICAgICBvbk5vTWF0Y2g6IGZ1bmN0aW9uIG9uTm9NYXRjaChzdGF0ZSkge31cbiAgICB9O1xuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGlzdDogdGhpcy5wcm9wcy5kZWZhdWx0TGlzdCxcbiAgICAgIGN1cnJlbnRWYWx1ZTogdGhpcy5wcm9wcy5kZWZhdWx0VmFsdWUsXG4gICAgICBoaWdobGlnaHRlZFZhbHVlOiB0aGlzLnByb3BzLmRlZmF1bHRWYWx1ZSxcbiAgICAgIHNob3dFbnRyaWVzOiBmYWxzZVxuICAgIH07XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBlbnRyaWVzID0gdGhpcy5zdGF0ZS5zaG93RW50cmllcyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnb2wnLFxuICAgICAgeyBzdHlsZTogeyBwb3NpdGlvbjogJ2Fic29sdXRlJywgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLCBjb2xvcjogJ2JsYWNrJywgbGlzdFN0eWxlOiAnbm9uZScsIHBhZGRpbmc6IDAsIG1hcmdpbjogMCB9LCBvbk1vdXNlTGVhdmU6IHRoaXMuX29uRW50cnlNb3VzZU91dCB9LFxuICAgICAgdGhpcy5fcmVuZGVyTWF0Y2hlcygpXG4gICAgKSA6ICcnO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7IGlkOiB0aGlzLnByb3BzLmlucHV0SWQsIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUsIHJlZjogJ2F1dG9JbnB1dCcsIG9uQ2hhbmdlOiB0aGlzLl9vbkNoYW5nZSwgb25Gb2N1czogdGhpcy5fb25Gb2N1cywgb25CbHVyOiB0aGlzLl9vbkJsdXIsIG9uQ2xpY2s6IHRoaXMuX29uSW5wdXRDbGljayB9KSxcbiAgICAgIGVudHJpZXNcbiAgICApO1xuICB9LFxuICBfY3VycmVudE1hdGNoZXM6IGZ1bmN0aW9uIF9jdXJyZW50TWF0Y2hlcygpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGNtID0gdGhpcy5zdGF0ZS5saXN0LmZpbHRlcihmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgIHJldHVybiBlbnRyeS5pbmRleE9mKHRoYXQuX2lucHV0KCkpID4gLTE7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNtO1xuICB9LFxuICBfaW5wdXQ6IGZ1bmN0aW9uIF9pbnB1dCgpIHtcbiAgICBpZiAoIXRoaXMuaXNNb3VudGVkKCkpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5hdXRvSW5wdXQpLnZhbHVlO1xuICAgIH1cbiAgfSxcbiAgX3JlbmRlck1hdGNoZXM6IGZ1bmN0aW9uIF9yZW5kZXJNYXRjaGVzKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudE1hdGNoZXMoKS5zbGljZSgwLCB0aGlzLnByb3BzLm1heEl0ZW1zU2hvd24pLm1hcChmdW5jdGlvbiAoZW50cnksIGluZGV4KSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChBdXRvY29tcGxldGVFbnRyeSwgeyBoaWdobGlnaHRlZDogZW50cnkgPT09IHRoYXQuc3RhdGUuaGlnaGxpZ2h0ZWRWYWx1ZSwga2V5OiBlbnRyeSwgdmFsdWU6IGVudHJ5LCBvbkVudHJ5Q2xpY2s6IHRoYXQuX29uRW50cnlDbGljaywgb25FbnRyeU1vdXNlT3ZlcjogdGhhdC5fb25FbnRyeU1vdXNlT3ZlciB9KTtcbiAgICB9KTtcbiAgfSxcbiAgX2hpZ2hsaWdodGVkSW5kZXg6IGZ1bmN0aW9uIF9oaWdobGlnaHRlZEluZGV4KCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgZm91bmRJbmRleCA9IC0xO1xuICAgIHRoaXMuX2N1cnJlbnRNYXRjaGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoZW50cnksIGluZGV4KSB7XG4gICAgICBpZiAoZW50cnkgPT09IHRoYXQuc3RhdGUuaGlnaGxpZ2h0ZWRWYWx1ZSkge1xuICAgICAgICBmb3VuZEluZGV4ID0gaW5kZXg7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZvdW5kSW5kZXg7XG4gIH0sXG4gIF91cGRhdGVIaWdobGlnaHRlZFZhbHVlOiBmdW5jdGlvbiBfdXBkYXRlSGlnaGxpZ2h0ZWRWYWx1ZSgpIHtcbiAgICB2YXIgbmV3VmFsdWU7XG4gICAgdmFyIGhpZ2hsaWdodGVkSW5kZXggPSB0aGlzLl9oaWdobGlnaHRlZEluZGV4KCk7XG4gICAgaWYgKGhpZ2hsaWdodGVkSW5kZXggPCAwKSB7XG4gICAgICBuZXdWYWx1ZSA9IHRoaXMuc3RhdGUubGlzdFswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3VmFsdWUgPSB0aGlzLnN0YXRlLmxpc3RbaGlnaGxpZ2h0ZWRJbmRleF07XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBoaWdobGlnaHRlZFZhbHVlOiBuZXdWYWx1ZSB9KTtcbiAgfSxcbiAgX3NldElucHV0RnJvbVZhbHVlOiBmdW5jdGlvbiBfc2V0SW5wdXRGcm9tVmFsdWUoKSB7XG4gICAgUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmF1dG9JbnB1dCkudmFsdWUgPSB0aGlzLnN0YXRlLmN1cnJlbnRWYWx1ZTtcbiAgfSxcbiAgX3NldFZhbHVlRnJvbUlucHV0OiBmdW5jdGlvbiBfc2V0VmFsdWVGcm9tSW5wdXQoKSB7XG4gICAgdmFyIGlucHV0VGV4dCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5hdXRvSW5wdXQpLnZhbHVlO1xuICAgIHZhciBmb3VuZEVudHJpZXMgPSB0aGlzLnN0YXRlLmxpc3QuZmlsdGVyKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgcmV0dXJuIGVudHJ5LmluZGV4T2YoaW5wdXRUZXh0KSA+IC0xO1xuICAgIH0pO1xuICAgIGlmIChmb3VuZEVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRWYWx1ZTogZm91bmRFbnRyaWVzWzBdLFxuICAgICAgICBoaWdobGlnaHRlZFZhbHVlOiBmb3VuZEVudHJpZXNbMF1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLm9uTm9NYXRjaCh0aGlzLnN0YXRlKTtcbiAgICAgIGlmICh0aGlzLnByb3BzLmxpbWl0VG9MaXN0KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGN1cnJlbnRWYWx1ZTogdGhpcy5wcm9wcy5kZWZhdWx0VmFsdWUsXG4gICAgICAgICAgaGlnaGxpZ2h0ZWRWYWx1ZTogdGhpcy5wcm9wcy5kZWZhdWx0VmFsdWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBfc2V0RnJvbUhpZ2hsaWdodGVkOiBmdW5jdGlvbiBfc2V0RnJvbUhpZ2hsaWdodGVkKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFZhbHVlOiB0aGlzLnN0YXRlLmhpZ2hsaWdodGVkVmFsdWVcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9zZXRJbnB1dEZyb21WYWx1ZSgpO1xuICAgIH0pO1xuICB9LFxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLl9zZXRWYWx1ZUZyb21JbnB1dCgpO1xuICB9LFxuICBfb25Gb2N1czogZnVuY3Rpb24gX29uRm9jdXMoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dFbnRyaWVzOiB0cnVlIH0pO1xuICB9LFxuICBfb25CbHVyOiBmdW5jdGlvbiBfb25CbHVyKCkge1xuICAgIHRoaXMuX3NldEZyb21IaWdobGlnaHRlZCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93RW50cmllczogZmFsc2UgfSk7XG4gIH0sXG4gIF9vbkVudHJ5Q2xpY2s6IGZ1bmN0aW9uIF9vbkVudHJ5Q2xpY2soZW50cnkpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRWYWx1ZTogZW50cnlcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9zZXRJbnB1dEZyb21WYWx1ZSgpO1xuICAgIH0pO1xuICB9LFxuICBfb25FbnRyeU1vdXNlT3ZlcjogZnVuY3Rpb24gX29uRW50cnlNb3VzZU92ZXIoZW50cnkpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaGlnaGxpZ2h0ZWRWYWx1ZTogZW50cnkgfSk7XG4gIH0sXG4gIF9vbkVudHJ5TW91c2VPdXQ6IGZ1bmN0aW9uIF9vbkVudHJ5TW91c2VPdXQoZW50cnkpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaGlnaGxpZ2h0ZWRWYWx1ZTogdGhpcy5jdXJyZW50VmFsdWUgfSk7XG4gIH0sXG4gIF9vbklucHV0Q2xpY2s6IGZ1bmN0aW9uIF9vbklucHV0Q2xpY2soKSB7XG4gICAgUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmF1dG9JbnB1dCkuc2VsZWN0KCk7XG4gIH1cbn0pO1xuXG52YXIgQXV0b2NvbXBsZXRlRW50cnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnQXV0b2NvbXBsZXRlRW50cnknLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7IGhvdmVyOiBmYWxzZSB9O1xuICB9LFxuICBfb25DbGljazogZnVuY3Rpb24gX29uQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5vbkVudHJ5Q2xpY2sodGhpcy5wcm9wcy52YWx1ZSk7XG4gIH0sXG4gIF9vbk1vdXNlT3ZlcjogZnVuY3Rpb24gX29uTW91c2VPdmVyKCkge1xuICAgIHRoaXMucHJvcHMub25FbnRyeU1vdXNlT3Zlcih0aGlzLnByb3BzLnZhbHVlKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnbGknLFxuICAgICAgeyBzdHlsZTogeyBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuaGlnaGxpZ2h0ZWQgPyAnaHNsKDkwLCA1MCUsIDUwJSknIDogJycsIHpJbmRleDogOTk5OSwgY3Vyc29yOiAncG9pbnRlcicgfSwgb25Nb3VzZURvd246IHRoaXMuX29uQ2xpY2ssIG9uTW91c2VPdmVyOiB0aGlzLl9vbk1vdXNlT3ZlciB9LFxuICAgICAgdGhpcy5wcm9wcy52YWx1ZVxuICAgICk7XG4gIH1cbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS1cbi8vIGVuZCBBdXRvY29tcGxldGVcbi8vIC0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiByZVJlbmRlcigpIHtcbiAgUmVhY3QucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVmRuYU1lbnUsIHsgdGFiTGlzdDogdGFiTGlzdCB9KSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZkbmFtZW51JykpO1xufTtcblxudmFyIHRhYkxpc3QgPSBbeyBpZDogMSwgaHJlZjogJ3Byb2ZpbGUnLCB0ZXh0OiAnRWRpdCBNeSBQcm9maWxlJywgc2VsZWN0ZWQ6IHRydWUgfSwgeyBpZDogMiwgaHJlZjogJ25vdGlmaWNhdGlvbnMnLCB0ZXh0OiAnVmlldyBOb3RpZmljYXRpb25zJywgc2VsZWN0ZWQ6IGZhbHNlIH0sIHsgaWQ6IDMsIGhyZWY6ICdpbXBvcnQnLCB0ZXh0OiAnSW1wb3J0IGFuZCBTeW5jJywgc2VsZWN0ZWQ6IGZhbHNlIH0sIHsgaWQ6IDQsIGhyZWY6ICdzZXR0aW5ncycsIHRleHQ6ICdDaGFuZ2UgU2V0dGluZ3MnLCBzZWxlY3RlZDogZmFsc2UgfSwgeyBpZDogNSwgaHJlZjogJ3ByaXZhY3knLCB0ZXh0OiAnUHJpdmFjeScsIHNlbGVjdGVkOiBmYWxzZSB9LCB7IGlkOiA2LCBocmVmOiAnYWJvdXQnLCB0ZXh0OiAnQWJvdXQnLCBzZWxlY3RlZDogZmFsc2UgfV07XG5cbnZhciBWZG5hTWVudSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdWZG5hTWVudScsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRhYkxpc3Q6IHRoaXMucHJvcHMudGFiTGlzdCxcbiAgICAgIGN1cnJlbnRUYWI6IDFcbiAgICB9O1xuICB9LFxuICBjaGFuZ2VUYWI6IGZ1bmN0aW9uIGNoYW5nZVRhYih0YWJJZCkge1xuICAgIHZhciBuZXdUYWJMaXN0ID0gdGFiTGlzdC5tYXAoZnVuY3Rpb24gKHRhYikge1xuICAgICAgdGFiLnNlbGVjdGVkID0gdGFiLmlkID09PSB0YWJJZDtcbiAgICAgIHJldHVybiB0YWI7XG4gICAgfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0YWJMaXN0OiBuZXdUYWJMaXN0LFxuICAgICAgY3VycmVudFRhYjogdGFiSWRcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHRhYkNvbnRlbnQ7XG4gICAgc3dpdGNoICh0aGlzLnN0YXRlLmN1cnJlbnRUYWIpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGFiQ29udGVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXlQcm9maWxlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KE5vdGlmaWNhdGlvbnMsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgdGFiQ29udGVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1wb3J0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIHRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFNldHRpbmdzLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDU6XG4gICAgICAgIHRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFByaXZhY3ksIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNjpcbiAgICAgICAgdGFiQ29udGVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWJvdXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZSwgbnVsbCk7XG4gICAgfVxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3NlY3Rpb24nLFxuICAgICAgeyBjbGFzc05hbWU6ICd2ZG5hJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAndmRuYS1ib2R5JyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29udGFpbmVyJyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncm93JyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJzLCB7IHRhYkxpc3Q6IHRoaXMuc3RhdGUudGFiTGlzdCwgY2hhbmdlVGFiOiB0aGlzLmNoYW5nZVRhYiB9KSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ21haW4tY29udGVudCBjb2wteHMtOCBjb2wteHMtb2Zmc2V0LTQgY29sLXNtLTkgY29sLXNtLW9mZnNldC0zIGNvbC1sZy0xMCBjb2wtbGctb2Zmc2V0LTInIH0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICd0YWItY29udGVudCcgfSxcbiAgICAgICAgICAgICAgICB0YWJDb250ZW50XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2xvc2VWZG5hLCBudWxsKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgT3BlblZkbmEgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnT3BlblZkbmEnLFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcbiAgICAkKFwiI3ZkbmFtZW51XCIpLnNob3coKTtcbiAgICAkKFwiI29wZW5WZG5hXCIpLmhpZGUoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnc3BhbicsXG4gICAgICAgIHsgJ2RhdGEtdG9nZ2xlJzogJ3Rvb2x0aXAnLCB0aXRsZTogJ0NsaWNrIHRvIG9wZW4gVkROQScsIGlkOiAnb3BlblZkbmEnLCBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1wcmltYXJ5IG9wZW5WZG5hJywgb25DbGljazogdGhpcy5oYW5kbGVDbGljayB9LFxuICAgICAgICAnT3BlbiB2RE5BJ1xuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgQ2xvc2VWZG5hID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0Nsb3NlVmRuYScsXG5cbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xuICAgICQoXCIjdmRuYW1lbnVcIikuaGlkZSgpO1xuICAgICQoXCIjb3BlblZkbmFcIikuc2hvdygpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdzcGFuJyxcbiAgICAgICAgeyAnZGF0YS10b2dnbGUnOiAndG9vbHRpcCcsIHRpdGxlOiAnQ2xpY2sgdG8gY2xvc2UnLCBjbGFzc05hbWU6ICdjbG9zZVZkbmEnLCBzdHlsZTogeyBjdXJzb3I6ICdwb2ludGVyJyB9LCBvbkNsaWNrOiB0aGlzLmhhbmRsZUNsaWNrIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2ZhIGZhLXBvd2VyLW9mZicgfSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIFRhYnMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVGFicycsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHZhciB0YWJMaXN0Tm9kZXMgPSB0aGlzLnByb3BzLnRhYkxpc3QubWFwKGZ1bmN0aW9uICh0YWIsIGluZGV4KSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChUYWIsIHsgY2hhbmdlVGFiOiB0aGF0LnByb3BzLmNoYW5nZVRhYiwga2V5OiB0YWIuaHJlZiwgaWQ6IHRhYi5ocmVmLCB0YWI6IHRhYiB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgeyBjbGFzc05hbWU6ICdzaWRlYmFyIGNvbC14cy00IGNvbC1zbS0zIGNvbC1sZy0yJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ25hdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnbmF2YmFyIG5hdmJhci1kZWZhdWx0Jywgcm9sZTogJ25hdmlnYXRpb24nIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ3VsJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ25hdiBuYXZiYXItbmF2Jywgcm9sZTogJ3RhYmxpc3QnIH0sXG4gICAgICAgICAgdGFiTGlzdE5vZGVzXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIFRhYiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUYWInLFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcbiAgICB0aGlzLnByb3BzLmNoYW5nZVRhYih0aGlzLnByb3BzLnRhYi5pZCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2xpJyxcbiAgICAgIHsgcm9sZTogJ3ByZXNlbnRhdGlvbicsIGNsYXNzTmFtZTogdGhpcy5wcm9wcy50YWIuc2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICcnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnYScsXG4gICAgICAgIHsgaHJlZjogdGhpcy5wcm9wcy50YWIuaHJlZiwgJ2FyaWEtY29udHJvbHMnOiB0aGlzLnByb3BzLnRhYi5ocmVmLCByb2xlOiAndGFiJywgJ2RhdGEtdG9nZ2xlJzogJ3RhYicsIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQ2xpY2sgfSxcbiAgICAgICAgdGhpcy5wcm9wcy50YWIudGV4dFxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTXlQcm9maWxlSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ015UHJvZmlsZUhlYWRlcicsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnaGVhZGVyJyxcbiAgICAgIHsgY2xhc3NOYW1lOiAncGFnZS1oZWFkZXInIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdtZWRpYScgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ21lZGlhLWxlZnQnIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiAnZmEgZmEtMnggZmEtdXNlcicgfSlcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ21lZGlhLWJvZHknIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdoMScsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ21lZGlhLWhlYWRpbmcnIH0sXG4gICAgICAgICAgICAnWW91ciBwcm9maWxlICcsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAnYXQnXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgJyBbc2l0ZS5jb21dJ1xuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTXlQcm9maWxlQ2F0ZWdvcmllcyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNeVByb2ZpbGVDYXRlZ29yaWVzJyxcblxuICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uIGhhbmRsZUNoYW5nZSgpIHtcbiAgICBjb25zb2xlLmxvZyhSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY2F0ZWdvcnkpLnZhbHVlKTtcbiAgICB0aGlzLnByb3BzLmdldENhdGVnb3J5T25DaGFuZ2UoUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmNhdGVnb3J5KS52YWx1ZSk7XG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjYXRlZ29yaWVzOiB0aGlzLnByb3BzLmNhdGVnb3JpZXNcbiAgICB9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGNhdGVnb3J5Tm9kZXMgPSB0aGlzLnN0YXRlLmNhdGVnb3JpZXMubWFwKGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXlQcm9maWxlQ2F0ZWdvcnksIHsgY2F0ZWdvcnk6IGNhdGVnb3J5IH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogJ2Zvcm0tZ3JvdXAgZm9ybS1ncm91cC1zbScgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgIHsgaHRtbEZvcjogJ2NhdGVnb3J5JywgY2xhc3NOYW1lOiAnY29sLXNtLTIgY29udHJvbC1sYWJlbCcgfSxcbiAgICAgICAgJ0NhdGVnb3J5J1xuICAgICAgKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS0xMCcgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnc2VsZWN0JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ3NlbGVjdHBpY2tlcicsIGlkOiAnY2F0ZWdvcnknLCByZWY6ICdjYXRlZ29yeScsIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZSB9LFxuICAgICAgICAgIGNhdGVnb3J5Tm9kZXNcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTXlQcm9maWxlQ2F0ZWdvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTXlQcm9maWxlQ2F0ZWdvcnknLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ29wdGlvbicsXG4gICAgICB7IHZhbHVlOiB0aGlzLnByb3BzLmNhdGVnb3J5LCByZWY6IHRoaXMucHJvcHMuY2F0ZWdvcnkgfSxcbiAgICAgIGRhdGEuY2FwaXRhbGl6ZSh0aGlzLnByb3BzLmNhdGVnb3J5KVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTXlQcm9maWxlUHJpdmFjeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNeVByb2ZpbGVQcml2YWN5JyxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclwiKS5zbGlkZXIoeyBtaW46IDEsIG1heDogNSwgc3RlcDogMSwgdmFsdWU6IDMgfSk7XG4gICAgJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclwiKS5vbihcInNsaWRlXCIsIGZ1bmN0aW9uIChuKSB7XG4gICAgICBuLnZhbHVlID09PSAxID8gJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclZhbFwiKS50ZXh0KFwiMjBcIikgOiBuLnZhbHVlID09PSAyID8gJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclZhbFwiKS50ZXh0KFwiNDBcIikgOiBuLnZhbHVlID09PSAzID8gJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclZhbFwiKS50ZXh0KFwiNjBcIikgOiBuLnZhbHVlID09PSA0ID8gJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclZhbFwiKS50ZXh0KFwiODBcIikgOiBuLnZhbHVlID09PSA1ICYmICQoXCIjcHJpdmFjeVNldHRpbmdTbGlkZXJWYWxcIikudGV4dChcIjEwMFwiKTtcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgeyBodG1sRm9yOiAnaW5wdXRFbWFpbDMnLCBjbGFzc05hbWU6ICdjb2wtc20tMiBjb250cm9sLWxhYmVsJyB9LFxuICAgICAgICAnUHJpdmFjeSdcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wtc20tNicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7IGlkOiAncHJpdmFjeVNldHRpbmdTbGlkZXInLCB0eXBlOiAndGV4dCcgfSlcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wtc20tMicgfSxcbiAgICAgICAgJ1NoYXJpbmcgJyxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgeyBpZDogJ3ByaXZhY3lTZXR0aW5nU2xpZGVyVmFsJyB9LFxuICAgICAgICAgICc2MCdcbiAgICAgICAgKSxcbiAgICAgICAgJyUnXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBNeVByb2ZpbGVJbnRlcmVzdHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTXlQcm9maWxlSW50ZXJlc3RzJyxcblxuICBzaG93RGV0YWlsczogZnVuY3Rpb24gc2hvd0RldGFpbHMoaW50ZXJlc3QsIGRldGFpbHMpIHtcbiAgICBjb25zb2xlLmxvZyhpbnRlcmVzdCArIFwiOiBcIiArIEpTT04uc3RyaW5naWZ5KGRldGFpbHMpKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEludGVyZXN0OiBpbnRlcmVzdCwgY3VycmVudERldGFpbHM6IGRldGFpbHMgfSk7XG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7IGN1cnJlbnRJbnRlcmVzdDogbnVsbCxcbiAgICAgIGN1cnJlbnREZXRhaWxzOiB7fSxcbiAgICAgIGFkZEludGVyZXN0Q29sbGFwc2VkOiB0cnVlIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBkYXRhLmJsaW5rTm9kZXMoKTtcbiAgfSxcbiAgc2hvd0FkZExpa2U6IGZ1bmN0aW9uIHNob3dBZGRMaWtlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBhZGRJbnRlcmVzdENvbGxhcHNlZDogZmFsc2UgfSk7XG4gIH0sXG4gIGhpZGVBZGRMaWtlOiBmdW5jdGlvbiBoaWRlQWRkTGlrZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgYWRkSW50ZXJlc3RDb2xsYXBzZWQ6IHRydWUgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgY3VycmVudEludGVyZXN0cyA9IE9iamVjdC5rZXlzKHRoaXMucHJvcHMuaW50ZXJlc3RzKS5yZWR1Y2UoZnVuY3Rpb24gKGlzLCBpKSB7XG4gICAgICBpZiAodGhhdC5wcm9wcy5pbnRlcmVzdHNbaV1bJ3NlbGVjdGVkJ10pIHtcbiAgICAgICAgaXNbaV0gPSB0aGF0LnByb3BzLmludGVyZXN0c1tpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpcztcbiAgICB9LCB7fSk7XG4gICAgdmFyIGludGVyZXN0Tm9kZXMgPSBPYmplY3Qua2V5cyh0aGlzLnByb3BzLmludGVyZXN0cykuZmlsdGVyKGZ1bmN0aW9uIChpbnRlcmVzdCkge1xuICAgICAgcmV0dXJuIHRoYXQucHJvcHMuaW50ZXJlc3RzW2ludGVyZXN0XVsnc2VsZWN0ZWQnXTtcbiAgICB9KS5tYXAoZnVuY3Rpb24gKGludGVyZXN0KSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNeVByb2ZpbGVJbnRlcmVzdCwgeyBrZXk6IGludGVyZXN0LCBpbnRlcmVzdDogaW50ZXJlc3QsIHNob3dEZXRhaWxzOiB0aGF0LnNob3dEZXRhaWxzLmJpbmQodGhhdCwgaW50ZXJlc3QsIHRoYXQucHJvcHMuaW50ZXJlc3RzW2ludGVyZXN0XSkgfSk7XG4gICAgfSk7XG4gICAgLypcclxuICAgIHZhciByZWxhdGVkSW50ZXJlc3RzID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5pbnRlcmVzdHMpLmZpbHRlcihmdW5jdGlvbihpbnRlcmVzdCkge1xyXG4gICAgICByZXR1cm4gIXRoYXQucHJvcHMuaW50ZXJlc3RzW2ludGVyZXN0XVsnc2VsZWN0ZWQnXTtcclxuICAgIH0pO1xyXG4gICAgICovXG4gICAgdmFyIHJlbGF0ZWRJbnRlcmVzdHMgPSB0aGlzLnN0YXRlLmN1cnJlbnRJbnRlcmVzdCA/IHRoaXMuc3RhdGUuY3VycmVudERldGFpbHNbJ3JlbGF0ZWQnXS5zcGxpdCgvLC8pIDogW107XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdmb3JtLWdyb3VwIGZvcm0tZ3JvdXAtc20nIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS0yIGNvbnRyb2wtbGFiZWwnIH0sXG4gICAgICAgICAgJ0ludGVyZXN0cydcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS02JyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncGFuZWwgcGFuZWwtaW50ZXJlc3RzJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncGFuZWwtYm9keScgfSxcbiAgICAgICAgICAgICAgaW50ZXJlc3ROb2Rlc1xuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS00IGNvbC1ib3R0b20nIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgeyB0eXBlOiAnc3VibWl0JywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCcgfSxcbiAgICAgICAgICAgICdJbXBvcnQnXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICB7IGlkOiAnYWRkTGlrZScsIG9uQ2xpY2s6IHRoaXMuc2hvd0FkZExpa2UsIHR5cGU6ICdzdWJtaXQnLCByb2xlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tc3VjY2VzcycsICdhcmlhLWV4cGFuZGVkJzogJ2ZhbHNlJywgJ2FyaWEtY29udHJvbHMnOiAnYWRkTGlrZScgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2dseXBoaWNvbiBnbHlwaGljb24tcGx1cycgfSksXG4gICAgICAgICAgICAnIEFkZCdcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZUFkZEFuSW50ZXJlc3QsIHsgaW50ZXJlc3RzOiBjdXJyZW50SW50ZXJlc3RzLCBjb2xsYXBzZTogdGhpcy5zdGF0ZS5hZGRJbnRlcmVzdENvbGxhcHNlZCwgaGlkZUFkZExpa2U6IHRoaXMuaGlkZUFkZExpa2UgfSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZUxpa2VEZXRhaWxzLCB7IGN1cnJlbnRJbnRlcmVzdDogdGhpcy5zdGF0ZS5jdXJyZW50SW50ZXJlc3QsIGN1cnJlbnREZXRhaWxzOiB0aGlzLnN0YXRlLmN1cnJlbnREZXRhaWxzLCByZWxhdGVkSW50ZXJlc3RzOiByZWxhdGVkSW50ZXJlc3RzLCBjb2xsYXBzZTogZmFsc2UgfSlcbiAgICApO1xuICB9XG59KTtcblxudmFyIE15UHJvZmlsZUludGVyZXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ015UHJvZmlsZUludGVyZXN0JyxcblxuICBoYW5kbGVDbGljazogZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5zaG93RGV0YWlscygpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdzcGFuJyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCcsIHJlZjogJ2ludGVyZXN0U3BhbicsIHRpdGxlOiB0aGlzLnByb3BzLmludGVyZXN0LCBrZXk6IHRoaXMucHJvcHMuaW50ZXJlc3QsIHJvbGU6ICdidXR0b24nLCBvbkNsaWNrOiB0aGlzLmhhbmRsZUNsaWNrIH0sXG4gICAgICBkYXRhLmNhcGl0YWxpemUodGhpcy5wcm9wcy5pbnRlcmVzdClcbiAgICApO1xuICB9XG59KTtcblxudmFyIE15UHJvZmlsZUFkZEFuSW50ZXJlc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTXlQcm9maWxlQWRkQW5JbnRlcmVzdCcsXG5cbiAgYWRkTGlrZURvbmU6IGZ1bmN0aW9uIGFkZExpa2VEb25lKCkge1xuICAgIGNvbnNvbGUubG9nKCQoXCIjYWRkSW50ZXJlc3RJbnB1dFwiKS52YWwoKSk7XG4gICAgaWYgKGRhdGEuYWRkSW50ZXJlc3QoJChcIiNhZGRJbnRlcmVzdElucHV0XCIpLnZhbCgpKSkge1xuICAgICAgdGhpcy5wcm9wcy5oaWRlQWRkTGlrZSgpO1xuICAgIH1cbiAgICAkKFwiI2FkZEludGVyZXN0SW5wdXRcIikudmFsKFwiXCIpO1xuICAgIHJlUmVuZGVyKCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBjdXJyZW50SW50ZXJlc3RLZXlzID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5pbnRlcmVzdHMpO1xuICAgIGNvbnNvbGUubG9nKCdjdXJyZW50IGludGVyZXN0czogJyArIEpTT04uc3RyaW5naWZ5KGN1cnJlbnRJbnRlcmVzdEtleXMpKTtcbiAgICB2YXIgYXZhaWxhYmxlSW50ZXJlc3RLZXlzID0gT2JqZWN0LmtleXMoZGF0YS5zdGF0aWNJbnRlcmVzdHMpLmZpbHRlcihmdW5jdGlvbiAoaW50ZXJlc3RLZXkpIHtcbiAgICAgIHJldHVybiBjdXJyZW50SW50ZXJlc3RLZXlzLmluZGV4T2YoaW50ZXJlc3RLZXkpID09IC0xO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKCdhdmFpbGFibGUgaW50ZXJlc3RzOiAnICsgSlNPTi5zdHJpbmdpZnkoYXZhaWxhYmxlSW50ZXJlc3RLZXlzKSk7XG4gICAgdmFyIGJhc2VEaXZTdHlsZXMgPSBbJ2Zvcm0tZ3JvdXAnLCAnZm9ybS1ncm91cC1zbSddO1xuICAgIGlmICh0aGlzLnByb3BzLmNvbGxhcHNlKSB7XG4gICAgICBiYXNlRGl2U3R5bGVzLnB1c2goJ2NvbGxhcHNlJyk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdBZGQgYSBsaWtlOiBcIicgKyBiYXNlRGl2U3R5bGVzLmpvaW4oJyAnKSArICdcIicpO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogYmFzZURpdlN0eWxlcy5qb2luKCcgJyksIGlkOiAnYWRkQW5JbnRlcmVzdCcgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXNtLTIgY29udHJvbC1sYWJlbCcgfSxcbiAgICAgICAgJ0FkZCBhIGxpa2UnXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXNtLTYnIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXV0b2NvbXBsZXRlLCB7IGlucHV0SWQ6ICdhZGRJbnRlcmVzdElucHV0JywgZGVmYXVsdFZhbHVlOiAnJywgZGVmYXVsdExpc3Q6IGF2YWlsYWJsZUludGVyZXN0S2V5cywgY2xhc3NOYW1lOiAnZm9ybS1jb250cm9sJywgYWRkTGlrZURvbmU6IHRoaXMuYWRkTGlrZURvbmUgfSlcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wtc20tMicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICB7IHR5cGU6ICdidXR0b24nLCBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1kZWZhdWx0Jywgb25DbGljazogdGhpcy5hZGRMaWtlRG9uZSB9LFxuICAgICAgICAgICdEb25lJ1xuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBNeVByb2ZpbGVMaWtlRGV0YWlscyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNeVByb2ZpbGVMaWtlRGV0YWlscycsXG5cbiAgcmVtb3ZlSW50ZXJlc3Q6IGZ1bmN0aW9uIHJlbW92ZUludGVyZXN0KCkge1xuICAgIC8vIGRhdGEudW5MaWtlQW5JbnRlcmVzdCh0aGlzLnByb3BzLmNhdGVnb3J5LCB0aGlzLnByb3BzLmN1cnJlbnRJbnRlcmVzdCk7XG4gICAgZGF0YS51bkxpa2VBbkludGVyZXN0KHRoaXMucHJvcHMuY3VycmVudEludGVyZXN0KTtcbiAgICByZVJlbmRlcigpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHJlbGF0ZWRJbnRlcmVzdE5vZGVzID0gdGhpcy5wcm9wcy5yZWxhdGVkSW50ZXJlc3RzLm1hcChmdW5jdGlvbiAoaW50ZXJlc3QpIHtcbiAgICAgIHJldHVybihcbiAgICAgICAgLy8gPE15UHJvZmlsZVJlbGF0ZWRJbnRlcmVzdCBjYXRlZ29yeT17dGhhdC5wcm9wcy5jYXRlZ29yeX0gcmVsYXRlZEludGVyZXN0PXtpbnRlcmVzdH0gLz5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNeVByb2ZpbGVSZWxhdGVkSW50ZXJlc3QsIHsgcmVsYXRlZEludGVyZXN0OiBpbnRlcmVzdCB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgICB2YXIgYmFzZURpdlN0eWxlcyA9IFsnZm9ybS1ncm91cCcsICdmb3JtLWdyb3VwLXNtJ107XG4gICAgaWYgKHRoaXMucHJvcHMuY29sbGFwc2UpIHtcbiAgICAgIGJhc2VEaXZTdHlsZXMucHVzaCgnY29sbGFwc2UnKTtcbiAgICB9XG4gICAgdmFyIGh0bWw7XG4gICAgaWYgKHRoaXMucHJvcHMuY3VycmVudEludGVyZXN0KSB7XG4gICAgICBodG1sID0gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiBiYXNlRGl2U3R5bGVzLmpvaW4oJyAnKSwgaWQ6ICdsaWtlRGV0YWlscycgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS02IGNvbC1zbS1vZmZzZXQtMicgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3dlbGwgd2VsbC1zbScgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3JvdycgfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy00JyB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ2J1dHRvbicsIGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLXByaW1hcnknIH0sXG4gICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmN1cnJlbnRJbnRlcmVzdFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy04JyB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAndWwnLFxuICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWlubGluZScgfSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAnVG90YWwgY2xpY2tzOidcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICcgJyxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmN1cnJlbnREZXRhaWxzWydjbGlja3MnXVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdTb3VyY2U6J1xuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgJyBJbXBvcnRlZCBmcm9tICcsXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YS5jYXBpdGFsaXplKHRoaXMucHJvcHMuY3VycmVudERldGFpbHNbJ3NvdXJjZSddKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdicicsIG51bGwpLFxuICAgICAgICAgICAgICAgICAgICAgICdBZGRlZCBvbiAnLFxuICAgICAgICAgICAgICAgICAgICAgIE1vbWVudCh0aGlzLnByb3BzLmN1cnJlbnREZXRhaWxzWydhZGRlZCddKS5mb3JtYXQoXCJERCBNTU0gWVlZWVwiKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAnUmVsYXRlZCBpbnRlcmVzdHM6J1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHJlbGF0ZWRJbnRlcmVzdE5vZGVzXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXNtLTQnIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgeyB0eXBlOiAnc3VibWl0Jywgcm9sZTogJ2J1dHRvbicsIGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRlZmF1bHQgcmVtb3ZlLWxpa2UnLCAnYXJpYS1leHBhbmRlZCc6ICd0cnVlJywgJ2FyaWEtY29udHJvbHMnOiAncmVtb3ZlTGlrZScsIG9uQ2xpY2s6IHRoaXMucmVtb3ZlSW50ZXJlc3QgfSxcbiAgICAgICAgICAgICdSZW1vdmUnXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBodG1sID0gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6IGJhc2VEaXZTdHlsZXMuam9pbignICcpLCBpZDogJ2xpa2VEZXRhaWxzJyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICBodG1sXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBNeVByb2ZpbGVSZWxhdGVkSW50ZXJlc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTXlQcm9maWxlUmVsYXRlZEludGVyZXN0JyxcblxuICBhZGRJbnRlcmVzdDogZnVuY3Rpb24gYWRkSW50ZXJlc3QoKSB7XG4gICAgLy8gZGF0YS5hZGRSZWxhdGVkSW50ZXJlc3QodGhpcy5wcm9wcy5jYXRlZ29yeSwgdGhpcy5wcm9wcy5yZWxhdGVkSW50ZXJlc3QpO1xuICAgIGRhdGEuYWRkUmVsYXRlZEludGVyZXN0KHRoaXMucHJvcHMucmVsYXRlZEludGVyZXN0KTtcbiAgICByZVJlbmRlcigpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdzcGFuJyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCcsIHJlZjogJ2ludGVyZXN0U3BhbicsIHRpdGxlOiB0aGlzLnByb3BzLnJlbGF0ZWRJbnRlcmVzdCwga2V5OiB0aGlzLnByb3BzLnJlbGF0ZWRJbnRlcmVzdCwgcm9sZTogJ2J1dHRvbicsIG9uQ2xpY2s6IHRoaXMuYWRkSW50ZXJlc3QgfSxcbiAgICAgIGRhdGEuY2FwaXRhbGl6ZSh0aGlzLnByb3BzLnJlbGF0ZWRJbnRlcmVzdClcbiAgICApO1xuICB9XG59KTtcblxudmFyIE15UHJvZmlsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNeVByb2ZpbGUnLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBjYXRlZ29yeTogT2JqZWN0LmtleXMoc3RhdGljRGF0YSlbMF0sXG4gICAgICAvLyBpbnRlcmVzdHM6IHN0YXRpY0RhdGFbT2JqZWN0LmtleXMoc3RhdGljRGF0YSlbMF1dXG4gICAgICBpbnRlcmVzdHM6IGRhdGEuc3RhdGljSW50ZXJlc3RzXG4gICAgfTtcbiAgfSxcbiAgZ2V0Q2F0ZWdvcnlPbkNoYW5nZTogZnVuY3Rpb24gZ2V0Q2F0ZWdvcnlPbkNoYW5nZShjYXRlZ29yeSkge1xuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGRhdGEuc3RhdGljRGF0YVtjYXRlZ29yeV0pKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgY2F0ZWdvcnk6IGNhdGVnb3J5LFxuICAgICAgaW50ZXJlc3RzOiBkYXRhLnN0YXRpY0RhdGFbY2F0ZWdvcnldIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgeyByb2xlOiAndGFicGFuZWwnLCBjbGFzc05hbWU6ICd0YWItcGFuZSBmYWRlIGFjdGl2ZSBpbicsIGlkOiAncHJvZmlsZScgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbnRhaW5lcicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNeVByb2ZpbGVIZWFkZXIsIG51bGwpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZm9ybS1ob3Jpem9udGFsJyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXlQcm9maWxlUHJpdmFjeSwgbnVsbCksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNeVByb2ZpbGVJbnRlcmVzdHMsIHsgaW50ZXJlc3RzOiB0aGlzLnN0YXRlLmludGVyZXN0cywgc2V0SW50ZXJlc3RzOiB0aGlzLnNldEludGVyZXN0cyB9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBOb3RpZmljYXRpb25zID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ05vdGlmaWNhdGlvbnMnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3NlY3Rpb24nLFxuICAgICAgeyByb2xlOiAndGFicGFuZWwnLCBjbGFzc05hbWU6ICd0YWItcGFuZSBmYWRlIGFjdGl2ZSBpbicsIGlkOiAnbm90aWZpY2F0aW9ucycgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbnRhaW5lcicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnaGVhZGVyJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ3BhZ2UtaGVhZGVyJyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnaDEnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICdOb3RpZmljYXRpb25zICcsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAnZnJvbSdcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICAnIFtzaXRlLmNvbV0nXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAncm93JyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXhzLTEyJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICd0YWJsZSB0YWJsZS1ub3RpZmljYXRpb25zJyB9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICd0aGVhZCcsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ3RyJyxcbiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAndGgnLFxuICAgICAgICAgICAgICAgICAgICB7IGNvbFNwYW46ICcyJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICdwJyxcbiAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICdTaXRlLmNvbSBoYXMgcmVxdWVzdGVkIHRvIGFkZCBmb2xsb3dpbmcgaW50ZXJlc3RzIHRvIHlvdXIgcHJvZmlsZS4nLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2JyJywgbnVsbCksXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1NlZSAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc2V0dGluZ3MnXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgJyB0byBjaGFuZ2UgdGhlIGRlZmF1bHQgYmVoYXZpb3IgZm9yIHRoaXMgd2luZG93LidcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAndGgnLFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICduYXYnLFxuICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAndGFibGUtZmlsdGVyIHRleHQtcmlnaHQnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICd1bCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2xpc3QtaW5saW5lJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICd0ZXh0LW11dGVkJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnU2hvdzonXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUGVuZGluZydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FjY2VwdGVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVqZWN0ZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2FjdGl2ZScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQWxsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICd0Ym9keScsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ3RyJyxcbiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAndGgnLFxuICAgICAgICAgICAgICAgICAgICB7IHNjb3BlOiAncm93JyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2J0biBidG4gYnRuLXNtIGJ0bi1kZWZhdWx0JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICdUZW5uaXMnXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAndGQnLFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICd1bCcsXG4gICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWlubGluZScgfSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnQ2F0ZWdvcnk6ICcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU3BvcnRzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnU291cmNlOiBJbXBvcnRlZCBmcm9tICcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRmFjZWJvb2snXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdSZXF1ZXN0ZWQgb24gQERhdGVUaW1lLk5vdydcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAndGQnLFxuICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3RleHQtcmlnaHQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdidG4tZ3JvdXAnLCByb2xlOiAnZ3JvdXAnLCAnYXJpYS1sYWJlbCc6ICcuLi4nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1saW5rIGJ0bi1zdWNjZXNzJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiAnZmEgZmEtY2hlY2snIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2hpZGRlbi14cycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FwcHJvdmUnXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICdidXR0b24nLCBjbGFzc05hbWU6ICdidG4gYnRuLWxpbmsgYnRuLWRhbmdlcicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2ZhIGZhLXJlbW92ZScgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnaGlkZGVuLXhzJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVtb3ZlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICd0cicsXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3RoJyxcbiAgICAgICAgICAgICAgICAgICAgeyBzY29wZTogJ3JvdycgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1kZWZhdWx0JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICdTa2lpbmcnXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAndGQnLFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICd1bCcsXG4gICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWlubGluZScgfSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnQ2F0ZWdvcnk6ICcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU3BvcnRzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnU291cmNlOiBJbXBvcnRlZCBmcm9tICcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRmFjZWJvb2snXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdSZXF1ZXN0ZWQgb24gQERhdGVUaW1lLk5vdydcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAndGQnLFxuICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3RleHQtcmlnaHQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdidG4tZ3JvdXAnLCByb2xlOiAnZ3JvdXAnLCAnYXJpYS1sYWJlbCc6ICcuLi4nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1saW5rIGJ0bi1zdWNjZXNzJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiAnZmEgZmEtY2hlY2snIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2hpZGRlbi14cycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FwcHJvdmUnXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICdidXR0b24nLCBjbGFzc05hbWU6ICdidG4gYnRuLWxpbmsgYnRuLWRhbmdlcicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2ZhIGZhLXJlbW92ZScgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnaGlkZGVuLXhzJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVtb3ZlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICd0cicsXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3RoJyxcbiAgICAgICAgICAgICAgICAgICAgeyBzY29wZTogJ3JvdycgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdidG4gYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnV2luZHN1cmZpbmcnXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAndGQnLFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICd1bCcsXG4gICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWlubGluZScgfSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnQ2F0ZWdvcnk6ICcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU3BvcnRzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnU291cmNlOiBJbXBvcnRlZCBmcm9tICcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRmFjZWJvb2snXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdSZXF1ZXN0ZWQgb24gQERhdGVUaW1lLk5vdydcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAndGQnLFxuICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3RleHQtcmlnaHQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdidG4tZ3JvdXAnLCByb2xlOiAnZ3JvdXAnLCAnYXJpYS1sYWJlbCc6ICcuLi4nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1saW5rIGJ0bi1zdWNjZXNzJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiAnZmEgZmEtY2hlY2snIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2hpZGRlbi14cycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FwcHJvdmUnXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICdidXR0b24nLCBjbGFzc05hbWU6ICdidG4gYnRuLWxpbmsgYnRuLWRhbmdlcicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2ZhIGZhLXJlbW92ZScgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnaGlkZGVuLXhzJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVtb3ZlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICduYXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3RleHQtcmlnaHQnIH0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ3VsJyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3BhZ2luYXRpb24nIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2Rpc2FibGVkJyB9LFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICB7ICdhcmlhLWxhYmVsJzogJ1ByZXZpb3VzJywgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgIHsgJ2FyaWEtaGlkZGVuJzogJ3RydWUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJ8KrIFByZXZpb3VzJ1xuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnYWN0aXZlJyB9LFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICAnMSAnLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3NyLW9ubHknIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJyhjdXJyZW50KSdcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICAnMidcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgeyBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgJzMnXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgICc0J1xuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICAnNSdcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgeyAnYXJpYS1sYWJlbCc6ICdOZXh0JywgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgIHsgJ2FyaWEtaGlkZGVuJzogJ3RydWUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJ05leHQgwrsnXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIEltcG9ydCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdJbXBvcnQnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3NlY3Rpb24nLFxuICAgICAgeyByb2xlOiAndGFicGFuZWwnLCBjbGFzc05hbWU6ICd0YWItcGFuZSBmYWRlIGFjdGl2ZSBpbicsIGlkOiAnaW1wb3J0JyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29udGFpbmVyJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdoZWFkZXInLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAncGFnZS1oZWFkZXInIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdoMycsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgJy4uLnlvdXIgaW50ZXJlc3RzIGFjcm9zcyBhcHBzIGFuZCBkZXZpY2VzLidcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdyb3cnIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wteHMtNiBjb2wtbGctNCcgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdwJyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdsZWFkJyB9LFxuICAgICAgICAgICAgICAnQ29ubmVjdCB3aXRoIEZhY2Vib29rISdcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdwdWxsLWxlZnQnIH0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAnTGFzdCBzeW5jOidcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgJyAyNSBpbnRlcmVzdHMgKDUgbmV3KScsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2JyJywgbnVsbCksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAnTGFzdCBzeW5jZWQgb246J1xuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAnIEBEYXRlVGltZS5Ob3cnXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICB7IGhyZWY6ICcjJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCBwdWxsLXJpZ2h0JyB9LFxuICAgICAgICAgICAgICAnQ29ubmVjdCdcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXhzLTYgY29sLWxnLTQgY29sLWxnLW9mZnNldC0xJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2xlYWQnIH0sXG4gICAgICAgICAgICAgICdJbXBvcnQgeW91ciBwaW5zIGZyb20gUGludGVyZXN0ISdcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdwdWxsLWxlZnQnIH0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAnTGFzdCBzeW5jOidcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgJyAyNSBpbnRlcmVzdHMgKDUgbmV3KScsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2JyJywgbnVsbCksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAnTGFzdCBzeW5jZWQgb246J1xuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAnIEBEYXRlVGltZS5Ob3cnXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICB7IGhyZWY6ICcjJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCBwdWxsLXJpZ2h0JyB9LFxuICAgICAgICAgICAgICAnSW1wb3J0J1xuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaHInLCBudWxsKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ3JvdycgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy0xMiBjb2wtbGctOScgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdoMycsXG4gICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICdUcnkgeW91ciBhcHAhJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdwJyxcbiAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgJ0xpa2UgY29udHJvbGxpbmcgdGhlIHdlYj8/PyBXZSB0aG91Z2h0IHNvLiBPdXIgbmlmdHkgYXBwIGxldHMgeW91IHRha2UgaXQgdG8gdGhlIG5leHQgbGV2ZWwgYW5kIHB1dHMgYWxsIHlvdXIgaW50ZXJuZXQtd2lkZSBwcmVmZXJlbmNlcyBpbiBvbmUgY2VudHJhbCBwbGFjZSBzbyB5b3UgY2FuIHF1aWNrbHkgYW5kIGVhc2lseSB2aWV3IGFuZCBhY2NlcHQgeW91ciBub3RpZmljYXRpb25zIHdpdGggYSBmZXcgc3RlcHMuJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3B1bGwtbGVmdCcgfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgeyBocmVmOiAnIycsIGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRlZmF1bHQnIH0sXG4gICAgICAgICAgICAgICAgJ2Rvd25sb2FkIGZvciBhbmRyb2lkJ1xuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCcgfSxcbiAgICAgICAgICAgICAgICAnZG93bmxvYWQgZm9yIGlwaG9uZSdcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3B1bGwtcmlnaHQnIH0sXG4gICAgICAgICAgICAgICdHb3QgYW4gYXBwPyBOb3cgJyxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgeyBocmVmOiAnIycsIGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRlZmF1bHQnIH0sXG4gICAgICAgICAgICAgICAgJ0dlbmVyYXRlIGEgc3luYyBjb2RlISdcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgU2V0dGluZ3MgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU2V0dGluZ3MnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3NlY3Rpb24nLFxuICAgICAgeyByb2xlOiAndGFicGFuZWwnLCBjbGFzc05hbWU6ICd0YWItcGFuZSBmYWRlIGFjdGl2ZSBpbicsIGlkOiAnc2V0dGluZ3MnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb250YWluZXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2hlYWRlcicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdwYWdlLWhlYWRlcicgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2gxJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAnU2V0dGluZ3MgJyxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICdvbidcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICAnIFtzaXRlLmNvbV0nXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICdZb3UgYXJlIGluIGNvbnRyb2whIENoYW5nZSB5b3VyIHNldHRpbmdzIGhlcmUuJ1xuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2Zvcm0taG9yaXpvbnRhbCcgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2Zvcm0tZ3JvdXAgZm9ybS1ncm91cC1zbScgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgICAgIHsgaHRtbEZvcjogJ3BlcnNvbmFsaXphdGlvbicsIGNsYXNzTmFtZTogJ2NvbC14cy03IGNvbC1zbS01IGNvbC1tZC00IGNvbC1sZy0zIGNvbnRyb2wtbGFiZWwnIH0sXG4gICAgICAgICAgICAgICdQZXJzb25hbGl6YXRpb24nXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXhzLTUgY29sLXNtLTcgY29sLW1kLTggY29sLWxnLTknIH0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JywgeyB0eXBlOiAnY2hlY2tib3gnLCBuYW1lOiAncGVyc29uYWxpemF0aW9uJywgY2xhc3NOYW1lOiAnc3dpdGNoJyB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaHInLCBudWxsKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2Zvcm0tZ3JvdXAgZm9ybS1ncm91cC1zbScgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgICAgIHsgaHRtbEZvcjogJ3NvcnRpbmcnLCBjbGFzc05hbWU6ICdjb2wteHMtNyBjb2wtc20tNSBjb2wtbWQtNCBjb2wtbGctMyBjb250cm9sLWxhYmVsJyB9LFxuICAgICAgICAgICAgICAnU29ydGluZydcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wteHMtNSBjb2wtc20tNyBjb2wtbWQtOCBjb2wtbGctOScgfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnc2VsZWN0JyxcbiAgICAgICAgICAgICAgICB7ICdjbGFzcyc6ICdzZWxlY3RwaWNrZXInLCBpZDogJ3NvcnRpbmcnIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICdvcHRpb24nLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICdZb3VyIGludGVyZXN0cydcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAnb3B0aW9uJyxcbiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAnU2l0ZSBkZWZhdWx0J1xuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaHInLCBudWxsKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2Zvcm0tZ3JvdXAgZm9ybS1ncm91cC1zbScgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgICAgIHsgaHRtbEZvcjogJ2F1dG9zYXZlJywgY2xhc3NOYW1lOiAnY29sLXhzLTcgY29sLXNtLTUgY29sLW1kLTQgY29sLWxnLTMgY29udHJvbC1sYWJlbCcgfSxcbiAgICAgICAgICAgICAgJ0F1dG9zYXZlJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy01IGNvbC1zbS03IGNvbC1tZC04IGNvbC1sZy05JyB9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdpbnB1dCcsIHsgdHlwZTogJ2NoZWNrYm94JywgbmFtZTogJ2F1dG9zYXZlJywgY2xhc3NOYW1lOiAnc3dpdGNoJyB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaHInLCBudWxsKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2Zvcm0tZ3JvdXAgZm9ybS1ncm91cC1zbScgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgICAgIHsgaHRtbEZvcjogJ2RlbGV0ZScsIGNsYXNzTmFtZTogJ2NvbC14cy03IGNvbC1zbS01IGNvbC1tZC00IGNvbC1sZy0zIGNvbnRyb2wtbGFiZWwnIH0sXG4gICAgICAgICAgICAgICdEZWxldGUgbXkgcHJvZmlsZSAnLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAnYXQnXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICcgJyxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnaScsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAnW3NpdGUuY29tXSdcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy01IGNvbC1zbS03IGNvbC1tZC04IGNvbC1sZy05JyB9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGFuZ2VyJyB9LFxuICAgICAgICAgICAgICAgICdEZWxldGUnXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIFByaXZhY3kgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnUHJpdmFjeScsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnc2VjdGlvbicsXG4gICAgICB7IHJvbGU6ICd0YWJwYW5lbCcsIGNsYXNzTmFtZTogJ3RhYi1wYW5lIGZhZGUgYWN0aXZlIGluJywgaWQ6ICdwcml2YWN5JyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29udGFpbmVyJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdoZWFkZXInLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAncGFnZS1oZWFkZXInIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdoMScsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgJ1ByaXZhY3knXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAncm93JyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXhzLTEwJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2xlYWQnIH0sXG4gICAgICAgICAgICAgICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LiBJbnRlZ2VyIG5lYyBvZGlvLiBQcmFlc2VudCBsaWJlcm8uIFNlZCBjdXJzdXMgYW50ZSBkYXBpYnVzIGRpYW0uIFNlZCBuaXNpLiBOdWxsYSBxdWlzIHNlbSBhdCBuaWJoIGVsZW1lbnR1bSBpbXBlcmRpZXQuJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdwJyxcbiAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuIEludGVnZXIgbmVjIG9kaW8uIFByYWVzZW50IGxpYmVyby4gU2VkIGN1cnN1cyBhbnRlIGRhcGlidXMgZGlhbS4gU2VkIG5pc2kuIE51bGxhIHF1aXMgc2VtIGF0IG5pYmggZWxlbWVudHVtIGltcGVyZGlldC4nXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBBYm91dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdBYm91dCcsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnc2VjdGlvbicsXG4gICAgICB7IHJvbGU6ICd0YWJwYW5lbCcsIGNsYXNzTmFtZTogJ3RhYi1wYW5lIGZhZGUgYWN0aXZlIGluJywgaWQ6ICdhYm91dCcgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbnRhaW5lcicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnaGVhZGVyJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ3BhZ2UtaGVhZGVyJyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2ltZycsIHsgc3JjOiAnL2ltYWdlcy9sb2dvLXppdnRlci5wbmcnLCBhbHQ6ICcnIH0pXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxucmVSZW5kZXIoKTtcblxuLypcclxuPCFET0NUWVBFIGh0bWw+XHJcbjxodG1sPlxyXG4gIDxoZWFkPlxyXG4gICAgPG1ldGEgY2hhcnNldD1cInV0Zi04XCIgLz5cclxuICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCI+XHJcbiAgICA8dGl0bGU+PC90aXRsZT5cclxuICAgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwiQ29udGVudC92ZG5hLm1pbi5jc3NcIj5cclxuICAgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIlNjcmlwdHMvbW9kZXJuaXpyLTIuNi4yLmpzXCI+PC9zY3JpcHQ+XHJcbiAgPC9oZWFkPlxyXG4gIDxib2R5PlxyXG5cclxuICAgIDwhLS0gdmRuYSBhcHAgLS0+XHJcbiAgICA8c2VjdGlvbiBjbGFzcz1cInZkbmFcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInZkbmEtYm9keVwiPlxyXG5cclxuXHQ8IS0tIGNvbnRhaW5lciAtLT5cclxuXHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XHJcblx0ICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcblxyXG5cdCAgICA8IS0tIHNpZGViYXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcblx0ICAgIDxkaXYgY2xhc3M9XCJzaWRlYmFyIGNvbC14cy00IGNvbC1zbS0zIGNvbC1sZy0yXCI+XHJcblxyXG5cdCAgICA8L2Rpdj48IS0tIC9zaWRlYmFyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcblxyXG5cdCAgICA8IS0tIG1haW4gY29udGVudCAtLT5cclxuXHQgICAgPGRpdiBjbGFzcz1cIm1haW4tY29udGVudCBjb2wteHMtOCBjb2wteHMtb2Zmc2V0LTQgY29sLXNtLTkgY29sLXNtLW9mZnNldC0zIGNvbC1sZy0xMCBjb2wtbGctb2Zmc2V0LTJcIj5cclxuXHQgICAgICA8ZGl2IGNsYXNzPVwidGFiLWNvbnRlbnRcIj5cclxuXHJcblx0XHQ8IS0tIHNlY3Rpb246IG15IHByb2ZpbGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG5cclxuXHRcdCAgICA8L2Rpdj48IS0tIC9teSBwcm9maWxlIGZvcm0gLS0+XHJcblxyXG5cdFx0ICA8L2Rpdj5cclxuXHRcdDwvc2VjdGlvbj48IS0tIC9zZWN0aW9uOiBteSBwcm9maWxlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG5cclxuXHRcdDwhLS0gc2VjdGlvbjogbm90aWZpY2F0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcbiAgICAgICAgICAgICAgICA8IS0tIC9zZWN0aW9uOiBub3RpZmljYXRpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG5cclxuXHRcdDwhLS0gc2VjdGlvbjogaW1wb3J0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG4gICAgICAgICAgICAgICAgPCEtLSAvc2VjdGlvbjogaW1wb3J0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcblxyXG5cdFx0PCEtLSBzZWN0aW9uOiBzZXR0aW5ncyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcbiAgICAgICAgICAgICAgICA8IS0tIHNlY3Rpb246IHNldHRpbmdzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuXHJcblx0XHQ8IS0tIHNlY3Rpb246IHByaXZhY3kgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuICAgICAgICAgICAgICAgIDwhLS0gL3NlY3Rpb246IHByaXZhY3kgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuXHJcblx0XHQ8IS0tIHNlY3Rpb246IGFib3V0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcbiAgICAgICAgICAgICAgICA8IS0tIC9zZWN0aW9uOiBhYm91dCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG5cclxuXHQgICAgICA8L2Rpdj5cclxuXHQgICAgPC9kaXY+PCEtLSAvbWFpbiBjb250ZW50IC0tPlxyXG5cclxuXHQgIDwvZGl2PlxyXG5cclxuXHQgIDwhLS0gY2xvc2UgYXBwIC0tPlxyXG5cdCAgPGEgaHJlZj1cIiNjbG9zZVZkbmFcIiBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIiB0aXRsZT1cIkNsaWNrIHRvIGNsb3NlXCIgY2xhc3M9XCJjbG9zZVZkbmFcIj48c3BhbiBjbGFzcz1cImZhIGZhLXBvd2VyLW9mZlwiPjwvc3Bhbj48L2E+XHJcblxyXG5cdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cclxuXHJcblx0PCEtLSBvcGVuIGFwcCAtLT5cclxuXHQ8YSBocmVmPVwiI29wZW5WZG5hXCIgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCIgdGl0bGU9XCJDbGljayB0byBvcGVuIFZETkFcIiBjbGFzcz1cImJ0biBidG4tc20gYnRuLXByaW1hcnkgb3BlblZkbmFcIj5PcGVuIHZETkE8L2E+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9zZWN0aW9uPjwhLS0gL3ZkbmEgYXBwIC0tPlxyXG5cclxuICAgIDwhLS0gV2Vic2l0ZSBwbGFjZWhvbGRlciAtLT5cclxuICAgIDxpbWcgc3JjPVwiQ29udGVudC9pbWFnZXMvdGlja2V0cHJvLnBuZ1wiIGFsdD1cIlwiIC8+XHJcblxyXG4gICAgPCEtLSBTY3JpcHRzIC0tPlxyXG4gICAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiU2NyaXB0cy9idW5kbGVzL2pxdWVyeS5qc1wiPjwvc2NyaXB0PlxyXG4gICAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiU2NyaXB0cy9idW5kbGVzL2Jvb3RzdHJhcC5qc1wiPjwvc2NyaXB0PlxyXG4gICAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiU2NyaXB0cy9idW5kbGVzL3ZkbmEuanNcIj48L3NjcmlwdD5cclxuXHJcbiAgPC9ib2R5PlxyXG48L2h0bWw+XHJcbiovXG4vKiA8T3BlblZkbmEgLz4gKi8gLyogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgcmVmPVwiYWRkQW5JbnRlcmVzdElucHV0XCIgaWQ9XCJhZGRBbkludGVyZXN0SW5wdXRcIiAvPiAqLyAvKjxzdHJvbmc+Q2F0ZWdvcnk6PC9zdHJvbmc+IHtkYXRhLmNhcGl0YWxpemUodGhpcy5wcm9wcy5jdXJyZW50RGV0YWlsc1snY2F0ZWdvcnknXSl9PGJyIC8+Ki8gLyo8TXlQcm9maWxlQ2F0ZWdvcmllcyBjYXRlZ29yaWVzPXtPYmplY3Qua2V5cyhkYXRhLnN0YXRpY0RhdGEpfSBnZXRDYXRlZ29yeU9uQ2hhbmdlPXt0aGlzLmdldENhdGVnb3J5T25DaGFuZ2V9IC8+Ki8gLyo8TXlQcm9maWxlSW50ZXJlc3RzIGNhdGVnb3J5PXt0aGlzLnN0YXRlLmNhdGVnb3J5fSBpbnRlcmVzdHM9e3RoaXMuc3RhdGUuaW50ZXJlc3RzfSBzZXRJbnRlcmVzdHM9e3RoaXMuc2V0SW50ZXJlc3RzfSAvPiovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM0J2YkdGeWFYTXZjblZ0YldGbmFXNW5YM0p2ZFc1a0wyNXZaR1V1YW5NdmRIQXRjbVZoWTNRdmNIVmliR2xqTDJwekwzWmtibUZ0Wlc1MUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPMEZCUVVFc1NVRkJTU3hOUVVGTkxFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUXk5Q0xFbEJRVWtzU1VGQlNTeEhRVUZITEU5QlFVOHNRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZET3pzN096czdPenM3UVVGVGRrTXNTVUZCU1N4WlFVRlpMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTI1RExHMUNRVUZwUWl4RlFVRkZMRFpDUVVGWE8wRkJRelZDTEZGQlFVa3NRMEZCUXl4clFrRkJhMElzUlVGQlJTeERRVUZETzBGQlF6RkNMRkZCUVVrc1owSkJRV2RDTEVOQlFVTTdRVUZEY2tJc1VVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEyaENMRmxCUVZFc1EwRkJReXhUUVVGVExFZEJRVWNzVlVGQlV5eERRVUZETEVWQlFVVTdRVUZETDBJc1kwRkJUeXhEUVVGRExFTkJRVU1zVDBGQlR6dEJRVU5rTEdGQlFVc3NSVUZCUlRzN1FVRkRUQ3hwUWtGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOMFFpeGpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRE8wRkJRM3BDTEdkQ1FVRk5PMEZCUVVFc1FVRkRVaXhoUVVGTExFTkJRVU03TzBGQlEwb3NhVUpCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdRVUZEY0VJc1kwRkJTU3hEUVVGRExHMUNRVUZ0UWl4RlFVRkZMRU5CUVVNN1FVRkRNMElzWjBKQlFVMDdRVUZCUVN4QlFVTlNMR0ZCUVVzc1JVRkJSVHM3UVVGRFRDd3dRa0ZCWjBJc1IwRkJSeXhKUVVGSkxFTkJRVU1zYVVKQlFXbENMRVZCUVVVc1EwRkJRenRCUVVNMVF5eHBRa0ZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFZEJRVWNzWjBKQlFXZENMRU5CUVVNc1EwRkJRenRCUVVOMlF5eGpRVUZITEdkQ1FVRm5RaXhIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU4yUWl4blFrRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEZRVUZETEdkQ1FVRm5RaXhGUVVGRkxFbEJRVWtzUTBGQlF5eGxRVUZsTEVWQlFVVXNRMEZCUXl4blFrRkJaMElzUjBGQlJ5eERRVUZETEVOQlFVTXNSVUZCUXl4RFFVRkRMRU5CUVVNN1YwRkRha1k3UVVGRFJDeG5Ra0ZCVFR0QlFVRkJMRUZCUTFJc1lVRkJTeXhGUVVGRk96dEJRVU5NTERCQ1FVRm5RaXhIUVVGSExFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1JVRkJSU3hEUVVGRE8wRkJRelZETEdsQ1FVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUjBGQlJ5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wRkJRM3BETEdOQlFVY3NaMEpCUVdkQ0xFdEJRVXNzUTBGQlF5eERRVUZETEVWQlFVVTdRVUZETVVJc1owSkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNSVUZCUXl4blFrRkJaMElzUlVGQlJTeEpRVUZKTEVOQlFVTXNaVUZCWlN4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eERRVUZETzFkQlF6bEVMRTFCUVUwc1NVRkJSeXhuUWtGQlowSXNSMEZCUnl4SlFVRkpMRU5CUVVNc1pVRkJaU3hGUVVGRkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNSVUZCUlR0QlFVTTVSQ3huUWtGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkRMR2RDUVVGblFpeEZRVUZGTEVsQlFVa3NRMEZCUXl4bFFVRmxMRVZCUVVVc1EwRkJReXhuUWtGQlowSXNSMEZCUnl4RFFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFTkJRVU03VjBGRGFrWTdRVUZEUkN4blFrRkJUVHRCUVVGQkxFOUJRMVE3UzBGRFJpeERRVUZETzBkQlEwZzdRVUZEUkN4cFFrRkJaU3hGUVVGRkxESkNRVUZYTzBGQlF6RkNMRmRCUVU4N1FVRkRUQ3hyUWtGQldTeEZRVUZGTEU5QlFVODdRVUZEY2tJc2FVSkJRVmNzUlVGQlJTeEpRVUZKTzBGQlEycENMRzFDUVVGaExFVkJRVVVzUTBGQlF6dEJRVU5vUWl4bFFVRlRMRVZCUVVVc1NVRkJTVHRCUVVObUxHbENRVUZYTEVWQlFVVXNRMEZCUlN4UFFVRlBMRVZCUVVVc1VVRkJVU3hGUVVGRkxGRkJRVkVzUlVGQlJTeFBRVUZQTEVWQlFVVXNVVUZCVVN4RFFVRkZPMEZCUXk5RUxITkNRVUZuUWl4RlFVRkZMRXRCUVVzN1FVRkRka0lzYVVKQlFWY3NSVUZCUlN4SlFVRkpPMEZCUTJwQ0xEQkNRVUZ2UWl4RlFVRkZMRWxCUVVrN1FVRkRNVUlzWlVGQlV5eEZRVUZGTEcxQ1FVRlRMRXRCUVVzc1JVRkJSU3hGUVVGRk8wdEJRemxDTEVOQlFVTTdSMEZEU0R0QlFVTkVMR2xDUVVGbExFVkJRVVVzTWtKQlFWYzdRVUZETVVJc1YwRkJUenRCUVVOTUxGVkJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjN1FVRkROVUlzYTBKQlFWa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGbEJRVms3UVVGRGNrTXNjMEpCUVdkQ0xFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4WlFVRlpPMEZCUTNwRExHbENRVUZYTEVWQlFVVXNTMEZCU3p0TFFVTnVRaXhEUVVGRE8wZEJRMGc3UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVVVGQlNTeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhYUVVGWExFZEJRemxDT3p0UlFVRkpMRXRCUVVzc1JVRkJSU3hGUVVGRExGRkJRVkVzUlVGQlJTeFZRVUZWTEVWQlFVVXNaVUZCWlN4RlFVRkZMRTlCUVU4c1JVRkJSU3hMUVVGTExFVkJRVVVzVDBGQlR5eEZRVUZGTEZOQlFWTXNSVUZCUlN4TlFVRk5MRVZCUVVVc1QwRkJUeXhGUVVGRkxFTkJRVU1zUlVGQlJTeE5RVUZOTEVWQlFVVXNRMEZCUXl4RlFVRkRMRUZCUVVNc1JVRkJReXhaUVVGWkxFVkJRVVVzU1VGQlNTeERRVUZETEdkQ1FVRm5RaXhCUVVGRE8wMUJRVVVzU1VGQlNTeERRVUZETEdOQlFXTXNSVUZCUlR0TFFVRk5MRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRM0JOTEZkQlEwVTdPenROUVVORkxDdENRVUZQTEVWQlFVVXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUVVGQlF5eEZRVUZETEZOQlFWTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUVVGQlF5eEZRVUZETEVkQlFVY3NSVUZCUXl4WFFVRlhMRVZCUVVNc1VVRkJVU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFRRVUZUTEVGQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExGRkJRVkVzUVVGQlF5eEZRVUZETEUxQlFVMHNSVUZCUlN4SlFVRkpMRU5CUVVNc1QwRkJUeXhCUVVGRExFVkJRVU1zVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4aFFVRmhMRUZCUVVNc1IwRkJSenROUVVOMFRDeFBRVUZQTzB0QlEwb3NRMEZEVGp0SFFVTklPMEZCUTBRc2FVSkJRV1VzUlVGQlJTd3lRa0ZCVnp0QlFVTXhRaXhSUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZEYUVJc1VVRkJTU3hGUVVGRkxFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExGVkJRVk1zUzBGQlN5eEZRVUZGTzBGQlF6bERMR0ZCUVU4c1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVU14UXl4RFFVRkRMRU5CUVVNN1FVRkRTQ3hYUVVGUExFVkJRVVVzUTBGQlF6dEhRVU5ZTzBGQlEwUXNVVUZCVFN4RlFVRkZMR3RDUVVGWE8wRkJRMnBDTEZGQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhGUVVGRkxFVkJRVVU3UVVGRGNFSXNZVUZCVHl4RlFVRkZMRU5CUVVNN1MwRkRXQ3hOUVVGTk8wRkJRMHdzWVVGQlR5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRPMHRCUTNKRU8wZEJRMFk3UVVGRFJDeG5Ra0ZCWXl4RlFVRkZMREJDUVVGWE8wRkJRM3BDTEZGQlFVa3NTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVOb1FpeFhRVUZQTEVsQlFVa3NRMEZCUXl4bFFVRmxMRVZCUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1lVRkJZU3hEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWTXNTMEZCU3l4RlFVRkZMRXRCUVVzc1JVRkJSVHRCUVVNeFJpeGhRVU5GTEc5Q1FVRkRMR2xDUVVGcFFpeEpRVUZETEZkQlFWY3NSVUZCUlN4TFFVRkxMRXRCUVVzc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eG5Ra0ZCWjBJc1FVRkJReXhGUVVGRExFZEJRVWNzUlVGQlJTeExRVUZMTEVGQlFVTXNSVUZCUXl4TFFVRkxMRVZCUVVVc1MwRkJTeXhCUVVGRExFVkJRVU1zV1VGQldTeEZRVUZGTEVsQlFVa3NRMEZCUXl4aFFVRmhMRUZCUVVNc1JVRkJReXhuUWtGQlowSXNSVUZCUlN4SlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVGQlFVTXNSMEZCUnl4RFFVTXZTenRMUVVOSUxFTkJRVU1zUTBGQlF6dEhRVU5LTzBGQlEwUXNiVUpCUVdsQ0xFVkJRVVVzTmtKQlFWYzdRVUZETlVJc1VVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEyaENMRkZCUVVrc1ZVRkJWU3hIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzQkNMRkZCUVVrc1EwRkJReXhsUVVGbExFVkJRVVVzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVXl4TFFVRkxMRVZCUVVVc1MwRkJTeXhGUVVGRk8wRkJRM0JFTEZWQlFVY3NTMEZCU3l4TFFVRkxMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zWjBKQlFXZENMRVZCUVVVN1FVRkRlRU1zYTBKQlFWVXNSMEZCUnl4TFFVRkxMRU5CUVVNN1QwRkRjRUk3UzBGRFJpeERRVUZETEVOQlFVTTdRVUZEU0N4WFFVRlBMRlZCUVZVc1EwRkJRenRIUVVOdVFqdEJRVU5FTEhsQ1FVRjFRaXhGUVVGRkxHMURRVUZYTzBGQlEyeERMRkZCUVVrc1VVRkJVU3hEUVVGRE8wRkJRMklzVVVGQlNTeG5Ra0ZCWjBJc1IwRkJSeXhKUVVGSkxFTkJRVU1zYVVKQlFXbENMRVZCUVVVc1EwRkJRenRCUVVOb1JDeFJRVUZITEdkQ1FVRm5RaXhIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU4yUWl4alFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRMMElzVFVGQlRUdEJRVU5NTEdOQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wdEJRemxETzBGQlEwUXNVVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhGUVVGRExHZENRVUZuUWl4RlFVRkZMRkZCUVZFc1JVRkJReXhEUVVGRExFTkJRVU03UjBGRE4wTTdRVUZEUkN4dlFrRkJhMElzUlVGQlJTdzRRa0ZCVnp0QlFVTTNRaXhUUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1dVRkJXU3hEUVVGRE8wZEJRM2hGTzBGQlEwUXNiMEpCUVd0Q0xFVkJRVVVzT0VKQlFWYzdRVUZETjBJc1VVRkJTU3hUUVVGVExFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEV0QlFVc3NRMEZCUXp0QlFVTTNSQ3hSUVVGSkxGbEJRVmtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zVlVGQlV5eExRVUZMTEVWQlFVVTdRVUZEZUVRc1lVRkJUeXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRM1JETEVOQlFVTXNRMEZCUXp0QlFVTklMRkZCUVVjc1dVRkJXU3hEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVWQlFVVTdRVUZETVVJc1ZVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEc5Q1FVRlpMRVZCUVVVc1dVRkJXU3hEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU0zUWl4M1FrRkJaMElzUlVGQlJTeFpRVUZaTEVOQlFVTXNRMEZCUXl4RFFVRkRPMDlCUTJ4RExFTkJRVU1zUTBGQlF6dExRVU5LTEUxQlFVMDdRVUZEVEN4VlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRha01zVlVGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjc1JVRkJSVHRCUVVONlFpeFpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRPMEZCUTFvc2MwSkJRVmtzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmxCUVZrN1FVRkRja01zTUVKQlFXZENMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFpRVUZaTzFOQlF6RkRMRU5CUVVNc1EwRkJRenRQUVVOS08wdEJRMFk3UjBGRFJqdEJRVU5FTEhGQ1FVRnRRaXhGUVVGRkxDdENRVUZYTzBGQlF6bENMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRFdpeHJRa0ZCV1N4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zWjBKQlFXZENPMHRCUXpGRExFVkJRVVVzV1VGQlZ6dEJRVU5hTEZWQlFVa3NRMEZCUXl4clFrRkJhMElzUlVGQlJTeERRVUZETzB0QlF6TkNMRU5CUVVNc1EwRkJRenRIUVVOS08wRkJRMFFzVjBGQlV5eEZRVUZGTEhGQ1FVRlhPMEZCUTNCQ0xGRkJRVWtzUTBGQlF5eHJRa0ZCYTBJc1JVRkJSU3hEUVVGRE8wZEJRek5DTzBGQlEwUXNWVUZCVVN4RlFVRkZMRzlDUVVGWE8wRkJRMjVDTEZGQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJReXhYUVVGWExFVkJRVVVzU1VGQlNTeEZRVUZETEVOQlFVTXNRMEZCUXp0SFFVTndRenRCUVVORUxGTkJRVThzUlVGQlJTeHRRa0ZCVnp0QlFVTnNRaXhSUVVGSkxFTkJRVU1zYlVKQlFXMUNMRVZCUVVVc1EwRkJRenRCUVVNelFpeFJRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVNc1YwRkJWeXhGUVVGRkxFdEJRVXNzUlVGQlF5eERRVUZETEVOQlFVTTdSMEZEY2tNN1FVRkRSQ3hsUVVGaExFVkJRVVVzZFVKQlFWTXNTMEZCU3l4RlFVRkZPMEZCUXpkQ0xGRkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEV2l4clFrRkJXU3hGUVVGRkxFdEJRVXM3UzBGRGNFSXNSVUZCUlN4WlFVRlhPMEZCUTFvc1ZVRkJTU3hEUVVGRExHdENRVUZyUWl4RlFVRkZMRU5CUVVNN1MwRkRNMElzUTBGQlF5eERRVUZETzBkQlEwbzdRVUZEUkN4dFFrRkJhVUlzUlVGQlJTd3lRa0ZCVXl4TFFVRkxMRVZCUVVVN1FVRkRha01zVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkRMR2RDUVVGblFpeEZRVUZGTEV0QlFVc3NSVUZCUXl4RFFVRkRMRU5CUVVNN1IwRkRNVU03UVVGRFJDeHJRa0ZCWjBJc1JVRkJSU3d3UWtGQlV5eExRVUZMTEVWQlFVVTdRVUZEYUVNc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEZRVUZETEdkQ1FVRm5RaXhGUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZaTEVWQlFVTXNRMEZCUXl4RFFVRkRPMGRCUTNSRU8wRkJRMFFzWlVGQllTeEZRVUZGTEhsQ1FVRlhPMEZCUTNoQ0xGTkJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXp0SFFVTnFSRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4SlFVRkpMR2xDUVVGcFFpeEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU40UXl4cFFrRkJaU3hGUVVGRkxESkNRVUZYTzBGQlF6RkNMRmRCUVU4c1JVRkJReXhMUVVGTExFVkJRVVVzUzBGQlN5eEZRVUZETEVOQlFVTTdSMEZEZGtJN1FVRkRSQ3hWUVVGUkxFVkJRVVVzYjBKQlFWYzdRVUZEYmtJc1VVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEhRVU16UXp0QlFVTkVMR05CUVZrc1JVRkJSU3gzUWtGQlZ6dEJRVU4yUWl4UlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHZENRVUZuUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdSMEZETDBNN1FVRkRSQ3hSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1YwRkRSVHM3VVVGQlNTeExRVUZMTEVWQlFVVXNSVUZCUXl4bFFVRmxMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVkQlFVY3NiVUpCUVcxQ0xFZEJRVWNzUlVGQlJTeEZRVUZGTEUxQlFVMHNSVUZCUlN4SlFVRkpMRVZCUVVVc1RVRkJUU3hGUVVGRkxGTkJRVk1zUlVGQlF5eEJRVUZETEVWQlFVTXNWMEZCVnl4RlFVRkZMRWxCUVVrc1EwRkJReXhSUVVGUkxFRkJRVU1zUlVGQlF5eFhRVUZYTEVWQlFVVXNTVUZCU1N4RFFVRkRMRmxCUVZrc1FVRkJRenROUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3p0TFFVRk5MRU5CUTNKTk8wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPenM3T3p0QlFVMUlMRk5CUVZNc1VVRkJVU3hIUVVGSE8wRkJRMnhDTEU5QlFVc3NRMEZCUXl4TlFVRk5MRU5CUTFZc2IwSkJRVU1zVVVGQlVTeEpRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRUZCUVVNc1IwRkJSeXhGUVVNNVFpeFJRVUZSTEVOQlFVTXNZMEZCWXl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVOd1F5eERRVUZETzBOQlEwZ3NRMEZCUXpzN1FVRkZSaXhKUVVGSkxFOUJRVThzUjBGQlJ5eERRVU5hTEVWQlFVVXNSVUZCUlN4RlFVRkZMRU5CUVVNc1JVRkJSU3hKUVVGSkxFVkJRVVVzVTBGQlV5eEZRVUZGTEVsQlFVa3NSVUZCUlN4cFFrRkJhVUlzUlVGQlJTeFJRVUZSTEVWQlFVVXNTVUZCU1N4RlFVRkZMRVZCUTI1RkxFVkJRVVVzUlVGQlJTeEZRVUZGTEVOQlFVTXNSVUZCUlN4SlFVRkpMRVZCUVVVc1pVRkJaU3hGUVVGRkxFbEJRVWtzUlVGQlJTeHZRa0ZCYjBJc1JVRkJSU3hSUVVGUkxFVkJRVVVzUzBGQlN5eEZRVUZGTEVWQlF6ZEZMRVZCUVVVc1JVRkJSU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRWxCUVVrc1JVRkJSU3hwUWtGQmFVSXNSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhGUVVGRkxFVkJRMjVGTEVWQlFVVXNSVUZCUlN4RlFVRkZMRU5CUVVNc1JVRkJSU3hKUVVGSkxFVkJRVVVzVlVGQlZTeEZRVUZGTEVsQlFVa3NSVUZCUlN4cFFrRkJhVUlzUlVGQlJTeFJRVUZSTEVWQlFVVXNTMEZCU3l4RlFVRkZMRVZCUTNKRkxFVkJRVVVzUlVGQlJTeEZRVUZGTEVOQlFVTXNSVUZCUlN4SlFVRkpMRVZCUVVVc1UwRkJVeXhGUVVGRkxFbEJRVWtzUlVGQlJTeFRRVUZUTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1JVRkJSU3hGUVVNMVJDeEZRVUZGTEVWQlFVVXNSVUZCUlN4RFFVRkRMRVZCUVVVc1NVRkJTU3hGUVVGRkxFOUJRVThzUlVGQlJTeEpRVUZKTEVWQlFVVXNUMEZCVHl4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFVkJRVVVzUTBGRGVrUXNRMEZCUXpzN1FVRkZSaXhKUVVGSkxGRkJRVkVzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGREwwSXNhVUpCUVdVc1JVRkJSU3d5UWtGQlZ6dEJRVU14UWl4WFFVRlBPMEZCUTB3c1lVRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHp0QlFVTXpRaXhuUWtGQlZTeEZRVUZGTEVOQlFVTTdTMEZEWkN4RFFVRkRPMGRCUTBnN1FVRkRSQ3hYUVVGVExFVkJRVVVzYlVKQlFWTXNTMEZCU3l4RlFVRkZPMEZCUTNwQ0xGRkJRVWtzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJVeXhIUVVGSExFVkJRVVU3UVVGRGVrTXNVMEZCUnl4RFFVRkRMRkZCUVZFc1IwRkJSeXhIUVVGSExFTkJRVU1zUlVGQlJTeExRVUZMTEV0QlFVc3NRMEZCUXp0QlFVTm9ReXhoUVVGUExFZEJRVWNzUTBGQlF6dExRVU5hTEVOQlFVTXNRMEZCUXp0QlFVTklMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRFdpeGhRVUZQTEVWQlFVVXNWVUZCVlR0QlFVTnVRaXhuUWtGQlZTeEZRVUZGTEV0QlFVczdTMEZEYkVJc1EwRkJReXhEUVVGRE8wZEJRMG83UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVVVGQlNTeFZRVUZWTEVOQlFVTTdRVUZEWml4WlFVRlBMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVlVGQlZUdEJRVU14UWl4WFFVRkxMRU5CUVVNN1FVRkRTaXhyUWtGQlZTeEhRVUZITEc5Q1FVRkRMRk5CUVZNc1QwRkJSeXhEUVVGRE8wRkJRek5DTEdOQlFVMDdRVUZCUVN4QlFVTlNMRmRCUVVzc1EwRkJRenRCUVVOS0xHdENRVUZWTEVkQlFVY3NiMEpCUVVNc1lVRkJZU3hQUVVGSExFTkJRVU03UVVGREwwSXNZMEZCVFR0QlFVRkJMRUZCUTFJc1YwRkJTeXhEUVVGRE8wRkJRMG9zYTBKQlFWVXNSMEZCUnl4dlFrRkJReXhOUVVGTkxFOUJRVWNzUTBGQlF6dEJRVU40UWl4alFVRk5PMEZCUVVFc1FVRkRVaXhYUVVGTExFTkJRVU03UVVGRFNpeHJRa0ZCVlN4SFFVRkhMRzlDUVVGRExGRkJRVkVzVDBGQlJ5eERRVUZETzBGQlF6RkNMR05CUVUwN1FVRkJRU3hCUVVOU0xGZEJRVXNzUTBGQlF6dEJRVU5LTEd0Q1FVRlZMRWRCUVVjc2IwSkJRVU1zVDBGQlR5eFBRVUZITEVOQlFVTTdRVUZEZWtJc1kwRkJUVHRCUVVGQkxFRkJRMUlzVjBGQlN5eERRVUZETzBGQlEwb3NhMEpCUVZVc1IwRkJSeXh2UWtGQlF5eExRVUZMTEU5QlFVY3NRMEZCUXp0QlFVTjJRaXhqUVVGTk8wRkJRVUVzUVVGRFVqdEJRVU5GTEd0Q1FVRlZMRWRCUVVjc2IwSkJRVU1zVTBGQlV5eFBRVUZITEVOQlFVTTdRVUZCUVN4TFFVTTVRanRCUVVORUxGZEJRMFU3TzFGQlFWTXNVMEZCVXl4RlFVRkRMRTFCUVUwN1RVRkRka0k3TzFWQlFVc3NVMEZCVXl4RlFVRkRMRmRCUVZjN1VVRkRlRUk3TzFsQlFVc3NVMEZCVXl4RlFVRkRMRmRCUVZjN1ZVRkRlRUk3TzJOQlFVc3NVMEZCVXl4RlFVRkRMRXRCUVVzN1dVRkRiRUlzYjBKQlFVTXNTVUZCU1N4SlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRVUZCUXl4RlFVRkRMRk5CUVZNc1JVRkJSU3hKUVVGSkxFTkJRVU1zVTBGQlV5eEJRVUZETEVkQlFVYzdXVUZEYUVVN08yZENRVUZMTEZOQlFWTXNSVUZCUXl3d1JrRkJNRVk3WTBGRGRrYzdPMnRDUVVGTExGTkJRVk1zUlVGQlF5eGhRVUZoTzJkQ1FVTjZRaXhWUVVGVk8yVkJRMUE3WVVGRFJqdFhRVU5HTzFOQlEwWTdVVUZEVGl4dlFrRkJReXhUUVVGVExFOUJRVWM3VDBGRlZEdExRVU5GTEVOQlExWTdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZKTEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZETDBJc1lVRkJWeXhGUVVGRkxIVkNRVUZYTzBGQlEzUkNMRXRCUVVNc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXp0QlFVTjBRaXhMUVVGRExFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNN1IwRkRka0k3UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdPMDFCUTB3N08xVkJRVTBzWlVGQldTeFRRVUZUTEVWQlFVTXNTMEZCU3l4RlFVRkRMRzlDUVVGdlFpeEZRVUZETEVWQlFVVXNSVUZCUXl4VlFVRlZMRVZCUVVNc1UwRkJVeXhGUVVGRExHbERRVUZwUXl4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eEJRVUZET3p0UFFVVTNTRHRMUVVOSUxFTkJRMDQ3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hKUVVGSkxGTkJRVk1zUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGRGFFTXNZVUZCVnl4RlFVRkZMSFZDUVVGWE8wRkJRM1JDTEV0QlFVTXNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGQlF6dEJRVU4wUWl4TFFVRkRMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTTdSMEZEZGtJN1FVRkRSQ3hSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1YwRkRSVHM3TzAxQlEwdzdPMVZCUVUwc1pVRkJXU3hUUVVGVExFVkJRVU1zUzBGQlN5eEZRVUZETEdkQ1FVRm5RaXhGUVVGRExGTkJRVk1zUlVGQlF5eFhRVUZYTEVWQlFVTXNTMEZCU3l4RlFVRkZMRVZCUVVNc1RVRkJUU3hGUVVGRkxGTkJRVk1zUlVGQlF5eEJRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhYUVVGWExFRkJRVU03VVVGRGRFZ3NPRUpCUVUwc1UwRkJVeXhGUVVGRExHbENRVUZwUWl4SFFVRlJPMDlCUTNCRE8wdEJRMGdzUTBGRFRqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFbEJRVWtzU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU16UWl4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNVVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRMmhDTEZGQlFVa3NXVUZCV1N4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlRMRWRCUVVjc1JVRkJSU3hMUVVGTExFVkJRVVU3UVVGRE4wUXNZVUZEUlN4dlFrRkJReXhIUVVGSExFbEJRVU1zVTBGQlV5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhCUVVGRExFVkJRVU1zUjBGQlJ5eEZRVUZGTEVkQlFVY3NRMEZCUXl4SlFVRkpMRUZCUVVNc1JVRkJReXhGUVVGRkxFVkJRVVVzUjBGQlJ5eERRVUZETEVsQlFVa3NRVUZCUXl4RlFVRkRMRWRCUVVjc1JVRkJSU3hIUVVGSExFRkJRVU1zUjBGQlJ5eERRVU12UlR0TFFVTklMRU5CUVVNc1EwRkJRenRCUVVOSUxGZEJRMFU3TzFGQlFVc3NVMEZCVXl4RlFVRkRMRzlEUVVGdlF6dE5RVU5xUkRzN1ZVRkJTeXhUUVVGVExFVkJRVU1zZFVKQlFYVkNMRVZCUVVNc1NVRkJTU3hGUVVGRExGbEJRVms3VVVGRGRFUTdPMWxCUVVrc1UwRkJVeXhGUVVGRExHZENRVUZuUWl4RlFVRkRMRWxCUVVrc1JVRkJReXhUUVVGVE8xVkJRekZETEZsQlFWazdVMEZEVmp0UFFVTkVPMHRCUTBZc1EwRkRUanRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVrc1IwRkJSeXhIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVNeFFpeGhRVUZYTEVWQlFVVXNkVUpCUVZjN1FVRkRkRUlzVVVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1IwRkRla003UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdVVUZCU1N4SlFVRkpMRVZCUVVNc1kwRkJZeXhGUVVGRExGTkJRVk1zUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFZEJRVWNzVVVGQlVTeEhRVUZITEVWQlFVVXNRVUZCUXp0TlFVTjZSVHM3VlVGQlJ5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeEJRVUZETEVWQlFVTXNhVUpCUVdVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4QlFVRkRMRVZCUVVNc1NVRkJTU3hGUVVGRExFdEJRVXNzUlVGQlF5eGxRVUZaTEV0QlFVc3NSVUZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExGZEJRVmNzUVVGQlF6dFJRVU4wU0N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTzA5QlEyeENPMHRCUTBRc1EwRkRURHRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVrc1pVRkJaU3hIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVOMFF5eFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdVVUZCVVN4VFFVRlRMRVZCUVVNc1lVRkJZVHROUVVNM1FqczdWVUZCU3l4VFFVRlRMRVZCUVVNc1QwRkJUenRSUVVOd1FqczdXVUZCU3l4VFFVRlRMRVZCUVVNc1dVRkJXVHRWUVVONlFpdzRRa0ZCVFN4VFFVRlRMRVZCUVVNc2EwSkJRV3RDTEVkQlFWRTdVMEZEZEVNN1VVRkRUanM3V1VGQlN5eFRRVUZUTEVWQlFVTXNXVUZCV1R0VlFVTjZRanM3WTBGQlNTeFRRVUZUTEVWQlFVTXNaVUZCWlRzN1dVRkJZenM3T3p0aFFVRnBRanM3VjBGQlowSTdVMEZEZUVVN1QwRkRSanRMUVVORExFTkJRMVE3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hKUVVGSkxHMUNRVUZ0UWl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTXhReXhqUVVGWkxFVkJRVVVzZDBKQlFWYzdRVUZEZGtJc1YwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRla1FzVVVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1IwRkROMFU3UVVGRFJDeHBRa0ZCWlN4RlFVRkZMREpDUVVGWE8wRkJRekZDTEZkQlFVODdRVUZEVEN4blFrRkJWU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNWVUZCVlR0TFFVTnNReXhEUVVGRE8wZEJRMGc3UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVVVGQlNTeEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTJoQ0xGRkJRVWtzWVVGQllTeEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZUTEZGQlFWRXNSVUZCUlR0QlFVTXZSQ3hoUVVORkxHOUNRVUZETEdsQ1FVRnBRaXhKUVVGRExGRkJRVkVzUlVGQlJTeFJRVUZSTEVGQlFVTXNSMEZCUnl4RFFVTjZRenRMUVVOSUxFTkJRVU1zUTBGQlF6dEJRVU5JTEZkQlEwVTdPMUZCUVVzc1UwRkJVeXhGUVVGRExEQkNRVUV3UWp0TlFVTjJRenM3VlVGQlR5eFBRVUZQTEVWQlFVTXNWVUZCVlN4RlFVRkRMRk5CUVZNc1JVRkJReXgzUWtGQmQwSTdPMDlCUVdsQ08wMUJRemRGT3p0VlFVRkxMRk5CUVZNc1JVRkJReXhYUVVGWE8xRkJRM2hDT3p0WlFVRlJMRk5CUVZNc1JVRkJReXhqUVVGakxFVkJRVU1zUlVGQlJTeEZRVUZETEZWQlFWVXNSVUZCUXl4SFFVRkhMRVZCUVVNc1ZVRkJWU3hGUVVGRExGRkJRVkVzUlVGQlJTeEpRVUZKTEVOQlFVTXNXVUZCV1N4QlFVRkRPMVZCUTNaR0xHRkJRV0U3VTBGRFVEdFBRVU5NTzB0QlEwWXNRMEZEVGp0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dEJRVVZJTEVsQlFVa3NhVUpCUVdsQ0xFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRM2hETEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFhRVU5GT3p0UlFVRlJMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRVUZCUXl4RlFVRkRMRWRCUVVjc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRVUZCUXp0TlFVTXhSQ3hKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRE8wdEJRemxDTEVOQlExUTdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZKTEdkQ1FVRm5RaXhIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVOMlF5eHRRa0ZCYVVJc1JVRkJSU3cyUWtGQlZ6dEJRVU0xUWl4TFFVRkRMRU5CUVVNc2RVSkJRWFZDTEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1JVRkJReXhIUVVGSExFVkJRVU1zUTBGQlF5eEZRVUZETEVkQlFVY3NSVUZCUXl4RFFVRkRMRVZCUVVNc1NVRkJTU3hGUVVGRExFTkJRVU1zUlVGQlF5eExRVUZMTEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1EwRkJRenRCUVVOb1JTeExRVUZETEVOQlFVTXNkVUpCUVhWQ0xFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNUMEZCVHl4RlFVRkZMRlZCUVZNc1EwRkJReXhGUVVGRk8wRkJRMnBFTEU5QlFVTXNRMEZCUXl4TFFVRkxMRXRCUVVzc1EwRkJReXhIUVVOWUxFTkJRVU1zUTBGQlF5d3dRa0ZCTUVJc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZEZUVNc1EwRkJReXhEUVVGRExFdEJRVXNzUzBGQlJ5eERRVUZETEVkQlExZ3NRMEZCUXl4RFFVRkRMREJDUVVFd1FpeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVONFF5eERRVUZETEVOQlFVTXNTMEZCU3l4TFFVRkhMRU5CUVVNc1IwRkRXQ3hEUVVGRExFTkJRVU1zTUVKQlFUQkNMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlEzaERMRU5CUVVNc1EwRkJReXhMUVVGTExFdEJRVWNzUTBGQlF5eEhRVU5ZTEVOQlFVTXNRMEZCUXl3d1FrRkJNRUlzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkRlRU1zUTBGQlF5eERRVUZETEV0QlFVc3NTMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExEQkNRVUV3UWl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzB0QlF6VkVMRU5CUVVNc1EwRkJRenRIUVVOS08wRkJRMFFzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPMEZCUTJwQ0xGZEJRMFU3TzFGQlFVc3NVMEZCVXl4RlFVRkRMREJDUVVFd1FqdE5RVU4yUXpzN1ZVRkJUeXhQUVVGUExFVkJRVU1zWVVGQllTeEZRVUZETEZOQlFWTXNSVUZCUXl4M1FrRkJkMEk3TzA5QlFXZENPMDFCUXk5Rk96dFZRVUZMTEZOQlFWTXNSVUZCUXl4VlFVRlZPMUZCUTNaQ0xDdENRVUZQTEVWQlFVVXNSVUZCUXl4elFrRkJjMElzUlVGQlF5eEpRVUZKTEVWQlFVTXNUVUZCVFN4SFFVRkhPMDlCUXpORE8wMUJRMDQ3TzFWQlFVc3NVMEZCVXl4RlFVRkRMRlZCUVZVN08xRkJRVk03TzFsQlFVMHNSVUZCUlN4RlFVRkRMSGxDUVVGNVFqczdVMEZCVlRzN1QwRkJUenRMUVVOcVJpeERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlNTeHJRa0ZCYTBJc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkRla01zWVVGQlZ5eEZRVUZGTEhGQ1FVRlRMRkZCUVZFc1JVRkJSU3hQUVVGUExFVkJRVVU3UVVGRGRrTXNWMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFZEJRVWNzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU4yUkN4UlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVU1zWlVGQlpTeEZRVUZGTEZGQlFWRXNSVUZCUlN4alFVRmpMRVZCUVVVc1QwRkJUeXhGUVVGRExFTkJRVU1zUTBGQlF6dEhRVU55UlR0QlFVTkVMR2xDUVVGbExFVkJRVVVzTWtKQlFWYzdRVUZETVVJc1YwRkJUeXhGUVVGRExHVkJRV1VzUlVGQlJTeEpRVUZKTzBGQlEzSkNMRzlDUVVGakxFVkJRVVVzUlVGQlJUdEJRVU5zUWl3d1FrRkJiMElzUlVGQlJTeEpRVUZKTEVWQlFVTXNRMEZCUXp0SFFVTnlRenRCUVVORUxHMUNRVUZwUWl4RlFVRkZMRFpDUVVGWE8wRkJRelZDTEZGQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRIUVVOdVFqdEJRVU5FTEdGQlFWY3NSVUZCUlN4MVFrRkJWenRCUVVOMFFpeFJRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVNc2IwSkJRVzlDTEVWQlFVVXNTMEZCU3l4RlFVRkRMRU5CUVVNc1EwRkJRenRIUVVNNVF6dEJRVU5FTEdGQlFWY3NSVUZCUlN4MVFrRkJWenRCUVVOMFFpeFJRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVNc2IwSkJRVzlDTEVWQlFVVXNTVUZCU1N4RlFVRkRMRU5CUVVNc1EwRkJRenRIUVVNM1F6dEJRVU5FTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFJRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRhRUlzVVVGQlNTeG5Ra0ZCWjBJc1IwRkJSeXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEZWQlFWTXNSVUZCUlN4RlFVRkZMRU5CUVVNc1JVRkJSVHRCUVVNNVJTeFZRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEZWQlFWVXNRMEZCUXl4RlFVRkZPMEZCUTNSRExGVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UFFVTnFRenRCUVVORUxHRkJRVThzUlVGQlJTeERRVUZETzB0QlExZ3NSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJRenRCUVVOUUxGRkJRVWtzWVVGQllTeEhRVUZITEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJVeXhSUVVGUkxFVkJRVVU3UVVGRE9VVXNZVUZCVHl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRMUVVOdVJDeERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZNc1VVRkJVU3hGUVVGRk8wRkJRM2hDTEdGQlEwVXNiMEpCUVVNc2FVSkJRV2xDTEVsQlFVTXNSMEZCUnl4RlFVRkZMRkZCUVZFc1FVRkJReXhGUVVGRExGRkJRVkVzUlVGQlJTeFJRVUZSTEVGQlFVTXNSVUZCUXl4WFFVRlhMRVZCUVVVc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhCUVVGRExFZEJRVWNzUTBGRE5VazdTMEZEU0N4RFFVRkRMRU5CUVVNN096czdPenRCUVUxSUxGRkJRVWtzWjBKQlFXZENMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eGxRVUZsTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhqUVVGakxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU42Unl4WFFVTkZPenM3VFVGRFJUczdWVUZCU3l4VFFVRlRMRVZCUVVNc01FSkJRVEJDTzFGQlEzWkRPenRaUVVGUExGTkJRVk1zUlVGQlF5eDNRa0ZCZDBJN08xTkJRV3RDTzFGQlF6TkVPenRaUVVGTExGTkJRVk1zUlVGQlF5eFZRVUZWTzFWQlEzWkNPenRqUVVGTExGTkJRVk1zUlVGQlF5eDFRa0ZCZFVJN1dVRkRjRU03TzJkQ1FVRkxMRk5CUVZNc1JVRkJReXhaUVVGWk8yTkJRM3BDTEdGQlFXRTdZVUZEVkR0WFFVTkdPMU5CUTBZN1VVRkRUanM3V1VGQlN5eFRRVUZUTEVWQlFVTXNjVUpCUVhGQ08xVkJRMnhET3p0alFVRlJMRWxCUVVrc1JVRkJReXhSUVVGUkxFVkJRVU1zVTBGQlV5eEZRVUZETEhkQ1FVRjNRanM3VjBGQlowSTdWVUZEZUVVN08yTkJRVkVzUlVGQlJTeEZRVUZETEZOQlFWTXNSVUZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExGZEJRVmNzUVVGQlF5eEZRVUZETEVsQlFVa3NSVUZCUXl4UlFVRlJMRVZCUVVNc1NVRkJTU3hGUVVGRExGRkJRVkVzUlVGQlF5eFRRVUZUTEVWQlFVTXNkMEpCUVhkQ0xFVkJRVU1zYVVKQlFXTXNUMEZCVHl4RlFVRkRMR2xDUVVGakxGTkJRVk03V1VGQlF5dzRRa0ZCVFN4VFFVRlRMRVZCUVVNc01FSkJRVEJDTEVkQlFWRTdPMWRCUVdFN1UwRkRlRTQ3VDBGRFJqdE5RVU5PTEc5Q1FVRkRMSE5DUVVGelFpeEpRVUZETEZOQlFWTXNSVUZCUlN4blFrRkJaMElzUVVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHOUNRVUZ2UWl4QlFVRkRMRVZCUVVNc1YwRkJWeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFhRVUZYTEVGQlFVTXNSMEZCUnp0TlFVTnFTU3h2UWtGQlF5eHZRa0ZCYjBJc1NVRkJReXhsUVVGbExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4bFFVRmxMRUZCUVVNc1JVRkJReXhqUVVGakxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4alFVRmpMRUZCUVVNc1JVRkJReXhuUWtGQlowSXNSVUZCUlN4blFrRkJaMElzUVVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUlN4TFFVRkxMRUZCUVVNc1IwRkJSenRMUVVOcVN5eERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlNTeHBRa0ZCYVVJc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkRlRU1zWVVGQlZ5eEZRVUZGTEhWQ1FVRlhPMEZCUTNSQ0xGRkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNN1IwRkRNVUk3UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdVVUZCVFN4VFFVRlRMRVZCUVVNc2QwSkJRWGRDTEVWQlFVTXNSMEZCUnl4RlFVRkRMR05CUVdNc1JVRkJReXhMUVVGTExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRUZCUVVNc1JVRkJReXhIUVVGSExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRUZCUVVNc1JVRkJReXhKUVVGSkxFVkJRVU1zVVVGQlVTeEZRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1YwRkJWeXhCUVVGRE8wMUJRM1pLTEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTTdTMEZEYUVNc1EwRkRVRHRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVrc2MwSkJRWE5DTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlF6ZERMR0ZCUVZjc1JVRkJSU3gxUWtGQlZ6dEJRVU4wUWl4WFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETEVOQlFVTTdRVUZETVVNc1VVRkJSeXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eERRVUZETEVkQlFVY3NSVUZCUlN4RFFVRkRMRVZCUVVVN1FVRkRha1FzVlVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJRenRMUVVNeFFqdEJRVU5FTEV0QlFVTXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJRenRCUVVNdlFpeFpRVUZSTEVWQlFVVXNRMEZCUXp0SFFVTmFPMEZCUTBRc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRkZCUVVrc2JVSkJRVzFDTEVkQlFVY3NUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUXpWRUxGZEJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNjVUpCUVhGQ0xFZEJRVWNzU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEZWtVc1VVRkJTU3h4UWtGQmNVSXNSMEZCUnl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJVeXhYUVVGWExFVkJRVVU3UVVGRGVrWXNZVUZCVHl4dFFrRkJiVUlzUTBGQlF5eFBRVUZQTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRGRrUXNRMEZCUXl4RFFVRkRPMEZCUTBnc1YwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eDFRa0ZCZFVJc1IwRkJSeXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEhGQ1FVRnhRaXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU0zUlN4UlFVRkpMR0ZCUVdFc1IwRkJSeXhEUVVGRExGbEJRVmtzUlVGQlJTeGxRVUZsTEVOQlFVTXNRMEZCUXp0QlFVTndSQ3hSUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RlFVRkZPMEZCUTNSQ0xHMUNRVUZoTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wdEJRMmhETzBGQlEwUXNWMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhsUVVGbExFZEJRVWNzWVVGQllTeERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU0zUkN4WFFVTkZPenRSUVVGTExGTkJRVk1zUlVGQlJTeGhRVUZoTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhCUVVGRExFVkJRVU1zUlVGQlJTeEZRVUZETEdWQlFXVTdUVUZEZWtRN08xVkJRVThzVTBGQlV5eEZRVUZETEhkQ1FVRjNRanM3VDBGQmJVSTdUVUZETlVRN08xVkJRVXNzVTBGQlV5eEZRVUZETEZWQlFWVTdVVUZGZGtJc2IwSkJRVU1zV1VGQldTeEpRVUZETEU5QlFVOHNSVUZCUXl4clFrRkJhMElzUlVGQlF5eFpRVUZaTEVWQlFVVXNSVUZCUlN4QlFVRkRMRVZCUVVNc1YwRkJWeXhGUVVGRkxIRkNRVUZ4UWl4QlFVRkRMRVZCUVVNc1UwRkJVeXhGUVVGRExHTkJRV01zUlVGQlF5eFhRVUZYTEVWQlFVVXNTVUZCU1N4RFFVRkRMRmRCUVZjc1FVRkJReXhIUVVGSE8wOUJRM0pLTzAxQlEwNDdPMVZCUVVzc1UwRkJVeXhGUVVGRExGVkJRVlU3VVVGRGRrSTdPMWxCUVZFc1NVRkJTU3hGUVVGRExGRkJRVkVzUlVGQlF5eFRRVUZUTEVWQlFVTXNkMEpCUVhkQ0xFVkJRVU1zVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4WFFVRlhMRUZCUVVNN08xTkJRV003VDBGRE4wWTdTMEZEUml4RFFVTk9PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NTVUZCU1N4dlFrRkJiMElzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGRE0wTXNaMEpCUVdNc1JVRkJSU3d3UWtGQlZ6czdRVUZGZWtJc1VVRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVTTdRVUZEYkVRc1dVRkJVU3hGUVVGRkxFTkJRVU03UjBGRFdqdEJRVU5FTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFJRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRhRUlzVVVGQlNTeHZRa0ZCYjBJc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZUTEZGQlFWRXNSVUZCUlR0QlFVTTFSVHM3UVVGRlNTdzBRa0ZCUXl4M1FrRkJkMElzU1VGQlF5eGxRVUZsTEVWQlFVVXNVVUZCVVN4QlFVRkRMRWRCUVVjN1VVRkRla1E3UzBGRFNDeERRVUZETEVOQlFVTTdRVUZEU0N4UlFVRkpMR0ZCUVdFc1IwRkJSeXhEUVVGRExGbEJRVmtzUlVGQlJTeGxRVUZsTEVOQlFVTXNRMEZCUXp0QlFVTndSQ3hSUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RlFVRkZPMEZCUTNSQ0xHMUNRVUZoTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wdEJRMmhETzBGQlEwUXNVVUZCU1N4SlFVRkpMRU5CUVVNN1FVRkRWQ3hSUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNaVUZCWlN4RlFVRkZPMEZCUXpkQ0xGVkJRVWtzUjBGRFJqczdWVUZCU3l4VFFVRlRMRVZCUVVVc1lVRkJZU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNRVUZCUXl4RlFVRkRMRVZCUVVVc1JVRkJReXhoUVVGaE8xRkJRM1pFT3p0WlFVRkxMRk5CUVZNc1JVRkJReXd3UWtGQk1FSTdWVUZEZGtNN08yTkJRVXNzVTBGQlV5eEZRVUZETEdOQlFXTTdXVUZETTBJN08yZENRVUZMTEZOQlFWTXNSVUZCUXl4TFFVRkxPMk5CUTJ4Q096dHJRa0ZCU3l4VFFVRlRMRVZCUVVNc1ZVRkJWVHRuUWtGRGRrSTdPMjlDUVVGUkxFbEJRVWtzUlVGQlF5eFJRVUZSTEVWQlFVTXNVMEZCVXl4RlFVRkRMSGRDUVVGM1FqdHJRa0ZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHVkJRV1U3YVVKQlFWVTdaVUZETVVZN1kwRkRUanM3YTBKQlFVc3NVMEZCVXl4RlFVRkRMRlZCUVZVN1owSkJRM1pDT3p0dlFrRkJTU3hUUVVGVExFVkJRVU1zWVVGQllUdHJRa0ZEZWtJN096dHZRa0ZEUlRzN08zTkNRVVZGT3pzN08zVkNRVUU0UWpzN2MwSkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4alFVRmpMRU5CUVVNc1VVRkJVU3hEUVVGRE8zRkNRVU0zUkR0dFFrRkRURHRyUWtGRFREczdPMjlDUVVORk96czdjMEpCUTBVN096czdkVUpCUVhkQ096dHpRa0ZCWjBJc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMR05CUVdNc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dHpRa0ZCUXl3clFrRkJUVHM3YzBKQlEzcEdMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEdOQlFXTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eGhRVUZoTEVOQlFVTTdjVUpCUTNCRk8yMUNRVU5NTzJsQ1FVTkdPMlZCUTBRN1lVRkRSanRYUVVOR08xVkJRMDQ3T3p0WlFVTkZPenM3TzJGQlFXMURPMWxCUTJ4RExHOUNRVUZ2UWp0WFFVTnVRanRUUVVOQk8xRkJRMDQ3TzFsQlFVc3NVMEZCVXl4RlFVRkRMRlZCUVZVN1ZVRkRka0k3TzJOQlFWRXNTVUZCU1N4RlFVRkRMRkZCUVZFc1JVRkJReXhKUVVGSkxFVkJRVU1zVVVGQlVTeEZRVUZETEZOQlFWTXNSVUZCUXl4dlEwRkJiME1zUlVGQlF5eHBRa0ZCWXl4TlFVRk5MRVZCUVVNc2FVSkJRV01zV1VGQldTeEZRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1kwRkJZeXhCUVVGRE96dFhRVUZuUWp0VFFVTTFTenRQUVVOR0xFTkJRVU03UzBGRFZpeE5RVUZOTzBGQlEwd3NWVUZCU1N4SFFVRkhMRFpDUVVGTExGTkJRVk1zUlVGQlJTeGhRVUZoTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhCUVVGRExFVkJRVU1zUlVGQlJTeEZRVUZETEdGQlFXRXNSMEZCVHl4RFFVRkRPMHRCUTNwRk8wRkJRMFFzVjBGRFJUczdPMDFCUTBjc1NVRkJTVHRMUVVOR0xFTkJRMHc3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hKUVVGSkxIZENRVUYzUWl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTXZReXhoUVVGWExFVkJRVVVzZFVKQlFWYzdPMEZCUlhSQ0xGRkJRVWtzUTBGQlF5eHJRa0ZCYTBJc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEdWQlFXVXNRMEZCUXl4RFFVRkRPMEZCUTNCRUxGbEJRVkVzUlVGQlJTeERRVUZETzBkQlExbzdRVUZEUkN4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNWMEZEUlRzN1VVRkJUU3hUUVVGVExFVkJRVU1zZDBKQlFYZENMRVZCUVVNc1IwRkJSeXhGUVVGRExHTkJRV01zUlVGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhsUVVGbExFRkJRVU1zUlVGQlF5eEhRVUZITEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhsUVVGbExFRkJRVU1zUlVGQlF5eEpRVUZKTEVWQlFVTXNVVUZCVVN4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eEJRVUZETzAxQlEzSkxMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4bFFVRmxMRU5CUVVNN1MwRkRka01zUTBGRFVEdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFbEJRVWtzVTBGQlV5eEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU5vUXl4cFFrRkJaU3hGUVVGRkxESkNRVUZYTzBGQlF6RkNMRmRCUVU4N096dEJRVWRNTEdWQlFWTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1pVRkJaVHRMUVVOb1F5eERRVUZETzBkQlEwZzdRVUZEUkN4eFFrRkJiVUlzUlVGQlJTdzJRa0ZCVXl4UlFVRlJMRVZCUVVVN1FVRkRkRU1zVjBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM1pFTEZGQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJReXhSUVVGUkxFVkJRVVVzVVVGQlVUdEJRVU5zUWl4bFFVRlRMRVZCUVVVc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eFJRVUZSTEVOQlFVTXNSVUZCUXl4RFFVRkRMRU5CUVVNN1IwRkRka1E3UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdVVUZCU3l4SlFVRkpMRVZCUVVNc1ZVRkJWU3hGUVVGRExGTkJRVk1zUlVGQlF5eDVRa0ZCZVVJc1JVRkJReXhGUVVGRkxFVkJRVU1zVTBGQlV6dE5RVU51UlRzN1ZVRkJTeXhUUVVGVExFVkJRVU1zVjBGQlZ6dFJRVVY0UWl4dlFrRkJReXhsUVVGbExFOUJRVWM3VVVGRmJrSTdPMWxCUVVzc1UwRkJVeXhGUVVGRExHbENRVUZwUWp0VlFVYzVRaXh2UWtGQlF5eG5Ra0ZCWjBJc1QwRkJSenRWUVVWd1FpeHZRa0ZCUXl4clFrRkJhMElzU1VGQlF5eFRRVUZUTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFRkJRVU1zUlVGQlF5eFpRVUZaTEVWQlFVVXNTVUZCU1N4RFFVRkRMRmxCUVZrc1FVRkJReXhIUVVGSE8xTkJSWEJHTzA5QlEwWTdTMEZEUml4RFFVTk9PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NTVUZCU1N4aFFVRmhMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTNCRExGRkJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhYUVVORk96dFJRVUZUTEVsQlFVa3NSVUZCUXl4VlFVRlZMRVZCUVVNc1UwRkJVeXhGUVVGRExIbENRVUY1UWl4RlFVRkRMRVZCUVVVc1JVRkJReXhsUVVGbE8wMUJRemRGT3p0VlFVRkxMRk5CUVZNc1JVRkJReXhYUVVGWE8xRkJRM2hDT3p0WlFVRlJMRk5CUVZNc1JVRkJReXhoUVVGaE8xVkJRemRDT3pzN08xbEJRV3RDT3pzN08yRkJRVzFDT3p0WFFVRm5RanRUUVVNNVF6dFJRVU5VT3p0WlFVRkxMRk5CUVZNc1JVRkJReXhMUVVGTE8xVkJRMnhDT3p0alFVRkxMRk5CUVZNc1JVRkJReXhYUVVGWE8xbEJRM2hDT3p0blFrRkJUeXhUUVVGVExFVkJRVU1zTWtKQlFUSkNPMk5CUXpGRE96czdaMEpCUTBVN096dHJRa0ZEUlRzN2MwSkJRVWtzVDBGQlR5eEZRVUZETEVkQlFVYzdiMEpCUTJJN096czdjMEpCUTI5RkxDdENRVUZOTzNOQ1FVTjRSVHM3T3p0M1FrRkJWenM3TkVKQlFVY3NTVUZCU1N4RlFVRkRMRWRCUVVjN08zbENRVUZoT3p0MVFrRkJkMFE3Y1VKQlEzcEdPMjFDUVVORU8ydENRVU5NT3pzN2IwSkJRMFU3TzNkQ1FVRkxMRk5CUVZNc1JVRkJReXg1UWtGQmVVSTdjMEpCUTNSRE96c3dRa0ZCU1N4VFFVRlRMRVZCUVVNc1lVRkJZVHQzUWtGRGVrSTdPelJDUVVGSkxGTkJRVk1zUlVGQlF5eFpRVUZaT3p0NVFrRkJWenQzUWtGRGNrTTdPenN3UWtGQlNUczdPRUpCUVVjc1NVRkJTU3hGUVVGRExFZEJRVWM3T3pKQ1FVRlpPM2xDUVVGTE8zZENRVU5vUXpzN096QkNRVUZKT3pzNFFrRkJSeXhKUVVGSkxFVkJRVU1zUjBGQlJ6czdNa0pCUVdFN2VVSkJRVXM3ZDBKQlEycERPenM3TUVKQlFVazdPemhDUVVGSExFbEJRVWtzUlVGQlF5eEhRVUZIT3pzeVFrRkJZVHQ1UWtGQlN6dDNRa0ZEYWtNN096UkNRVUZKTEZOQlFWTXNSVUZCUXl4UlFVRlJPekJDUVVGRE96czRRa0ZCUnl4SlFVRkpMRVZCUVVNc1IwRkJSenM3TWtKQlFWRTdlVUpCUVVzN2RVSkJRelZETzNGQ1FVTkVPMjFDUVVOSU8ybENRVU5HTzJWQlEwTTdZMEZEVWpzN08yZENRVU5GT3pzN2EwSkJRMFU3TzNOQ1FVRkpMRXRCUVVzc1JVRkJReXhMUVVGTE8yOUNRVU5pT3p0M1FrRkJUU3hUUVVGVExFVkJRVU1zTkVKQlFUUkNPenR4UWtGQll6dHRRa0ZEZGtRN2EwSkJRMHc3T3p0dlFrRkRSVHM3ZDBKQlFVa3NVMEZCVXl4RlFVRkRMR0ZCUVdFN2MwSkJRM3BDT3pzN2QwSkJRMFU3T3pzN01FSkJRMWs3T3pzN01rSkJRWFZDTzNsQ1FVTXpRanQxUWtGRFREdHpRa0ZEVERzN08zZENRVU5GT3pzN096QkNRVU4zUWpzN096c3lRa0ZCZVVJN2VVSkJRM3BETzNWQ1FVTk1PM05DUVVOTU96czdkMEpCUTBVN096czdlVUpCUlZFN2RVSkJRMHc3Y1VKQlEwWTdiVUpCUTBZN2EwSkJRMHc3TzNOQ1FVRkpMRk5CUVZNc1JVRkJReXhaUVVGWk8yOUNRVU40UWpzN2QwSkJRVXNzVTBGQlV5eEZRVUZETEZkQlFWY3NSVUZCUXl4SlFVRkpMRVZCUVVNc1QwRkJUeXhGUVVGRExHTkJRVmNzUzBGQlN6dHpRa0ZEZEVRN096QkNRVUZSTEVsQlFVa3NSVUZCUXl4UlFVRlJMRVZCUVVNc1UwRkJVeXhGUVVGRExEQkNRVUV3UWp0M1FrRkRlRVFzT0VKQlFVMHNVMEZCVXl4RlFVRkRMR0ZCUVdFc1IwRkJVVHQzUWtGRGNrTTdPelJDUVVGTkxGTkJRVk1zUlVGQlF5eFhRVUZYT3p0NVFrRkJaVHQxUWtGRGJrTTdjMEpCUTFRN096QkNRVUZSTEVsQlFVa3NSVUZCUXl4UlFVRlJMRVZCUVVNc1UwRkJVeXhGUVVGRExIbENRVUY1UWp0M1FrRkRka1FzT0VKQlFVMHNVMEZCVXl4RlFVRkRMR05CUVdNc1IwRkJVVHQzUWtGRGRFTTdPelJDUVVGTkxGTkJRVk1zUlVGQlF5eFhRVUZYT3p0NVFrRkJZenQxUWtGRGJFTTdjVUpCUTB3N2JVSkJRMGc3YVVKQlEwWTdaMEpCUTB3N096dHJRa0ZEUlRzN2MwSkJRVWtzUzBGQlN5eEZRVUZETEV0QlFVczdiMEpCUTJJN08zZENRVUZOTEZOQlFWTXNSVUZCUXl4M1FrRkJkMEk3TzNGQ1FVRmpPMjFDUVVOdVJEdHJRa0ZEVERzN08yOUNRVU5GT3p0M1FrRkJTU3hUUVVGVExFVkJRVU1zWVVGQllUdHpRa0ZEZWtJN096dDNRa0ZEUlRzN096c3dRa0ZEV1RzN096c3lRa0ZCZFVJN2VVSkJRek5DTzNWQ1FVTk1PM05DUVVOTU96czdkMEpCUTBVN096czdNRUpCUTNkQ096czdPekpDUVVGNVFqdDVRa0ZEZWtNN2RVSkJRMHc3YzBKQlEwdzdPenQzUWtGRFJUczdPenQ1UWtGRlVUdDFRa0ZEVER0eFFrRkRSanR0UWtGRFJqdHJRa0ZEVERzN2MwSkJRVWtzVTBGQlV5eEZRVUZETEZsQlFWazdiMEpCUTNoQ096dDNRa0ZCU3l4VFFVRlRMRVZCUVVNc1YwRkJWeXhGUVVGRExFbEJRVWtzUlVGQlF5eFBRVUZQTEVWQlFVTXNZMEZCVnl4TFFVRkxPM05DUVVOMFJEczdNRUpCUVZFc1NVRkJTU3hGUVVGRExGRkJRVkVzUlVGQlF5eFRRVUZUTEVWQlFVTXNNRUpCUVRCQ08zZENRVU40UkN3NFFrRkJUU3hUUVVGVExFVkJRVU1zWVVGQllTeEhRVUZSTzNkQ1FVTnlRenM3TkVKQlFVMHNVMEZCVXl4RlFVRkRMRmRCUVZjN08zbENRVUZsTzNWQ1FVTnVRenR6UWtGRFZEczdNRUpCUVZFc1NVRkJTU3hGUVVGRExGRkJRVkVzUlVGQlF5eFRRVUZUTEVWQlFVTXNlVUpCUVhsQ08zZENRVU4yUkN3NFFrRkJUU3hUUVVGVExFVkJRVU1zWTBGQll5eEhRVUZSTzNkQ1FVTjBRenM3TkVKQlFVMHNVMEZCVXl4RlFVRkRMRmRCUVZjN08zbENRVUZqTzNWQ1FVTnNRenR4UWtGRFREdHRRa0ZEU0R0cFFrRkRSanRuUWtGRFREczdPMnRDUVVORk96dHpRa0ZCU1N4TFFVRkxMRVZCUVVNc1MwRkJTenR2UWtGRFlqczdkMEpCUVUwc1UwRkJVeXhGUVVGRExEUkNRVUUwUWpzN2NVSkJRVzFDTzIxQ1FVTTFSRHRyUWtGRFREczdPMjlDUVVORk96dDNRa0ZCU1N4VFFVRlRMRVZCUVVNc1lVRkJZVHR6UWtGRGVrSTdPenQzUWtGRFJUczdPenN3UWtGRFdUczdPenN5UWtGQmRVSTdlVUpCUXpOQ08zVkNRVU5NTzNOQ1FVTk1PenM3ZDBKQlEwVTdPenM3TUVKQlEzZENPenM3T3pKQ1FVRjVRanQ1UWtGRGVrTTdkVUpCUTB3N2MwSkJRMHc3T3p0M1FrRkRSVHM3T3p0NVFrRkZVVHQxUWtGRFREdHhRa0ZEUmp0dFFrRkRSanRyUWtGRFREczdjMEpCUVVrc1UwRkJVeXhGUVVGRExGbEJRVms3YjBKQlEzaENPenQzUWtGQlN5eFRRVUZUTEVWQlFVTXNWMEZCVnl4RlFVRkRMRWxCUVVrc1JVRkJReXhQUVVGUExFVkJRVU1zWTBGQlZ5eExRVUZMTzNOQ1FVTjBSRHM3TUVKQlFWRXNTVUZCU1N4RlFVRkRMRkZCUVZFc1JVRkJReXhUUVVGVExFVkJRVU1zTUVKQlFUQkNPM2RDUVVONFJDdzRRa0ZCVFN4VFFVRlRMRVZCUVVNc1lVRkJZU3hIUVVGUk8zZENRVU55UXpzN05FSkJRVTBzVTBGQlV5eEZRVUZETEZkQlFWYzdPM2xDUVVGbE8zVkNRVU51UXp0elFrRkRWRHM3TUVKQlFWRXNTVUZCU1N4RlFVRkRMRkZCUVZFc1JVRkJReXhUUVVGVExFVkJRVU1zZVVKQlFYbENPM2RDUVVOMlJDdzRRa0ZCVFN4VFFVRlRMRVZCUVVNc1kwRkJZeXhIUVVGUk8zZENRVU4wUXpzN05FSkJRVTBzVTBGQlV5eEZRVUZETEZkQlFWYzdPM2xDUVVGak8zVkNRVU5zUXp0eFFrRkRURHR0UWtGRFNEdHBRa0ZEUmp0bFFVTkRPMkZCUTBZN1dVRkRVanM3WjBKQlFVc3NVMEZCVXl4RlFVRkRMRmxCUVZrN1kwRkRla0k3TzJ0Q1FVRkpMRk5CUVZNc1JVRkJReXhaUVVGWk8yZENRVU40UWpzN2IwSkJRVWtzVTBGQlV5eEZRVUZETEZWQlFWVTdhMEpCUVVNN08zTkNRVUZITEdOQlFWY3NWVUZCVlN4RlFVRkRMRWxCUVVrc1JVRkJReXhIUVVGSE8yOUNRVUZET3p0M1FrRkJUU3hsUVVGWkxFMUJRVTA3TzNGQ1FVRnJRanR0UWtGQlNUdHBRa0ZCU3p0blFrRkRPVWM3TzI5Q1FVRkpMRk5CUVZNc1JVRkJReXhSUVVGUk8ydENRVUZET3p0elFrRkJSeXhKUVVGSkxFVkJRVU1zUjBGQlJ6czdiMEpCUVVjN08zZENRVUZOTEZOQlFWTXNSVUZCUXl4VFFVRlRPenR4UWtGQmFVSTdiVUpCUVVrN2FVSkJRVXM3WjBKQlEzaEdPenM3YTBKQlFVazdPM05DUVVGSExFbEJRVWtzUlVGQlF5eEhRVUZIT3p0dFFrRkJUVHRwUWtGQlN6dG5Ra0ZETVVJN096dHJRa0ZCU1RzN2MwSkJRVWNzU1VGQlNTeEZRVUZETEVkQlFVYzdPMjFDUVVGTk8ybENRVUZMTzJkQ1FVTXhRanM3TzJ0Q1FVRkpPenR6UWtGQlJ5eEpRVUZKTEVWQlFVTXNSMEZCUnpzN2JVSkJRVTA3YVVKQlFVczdaMEpCUXpGQ096czdhMEpCUVVrN08zTkNRVUZITEVsQlFVa3NSVUZCUXl4SFFVRkhPenR0UWtGQlRUdHBRa0ZCU3p0blFrRkRNVUk3T3p0clFrRkJTVHM3YzBKQlFVY3NZMEZCVnl4TlFVRk5MRVZCUVVNc1NVRkJTU3hGUVVGRExFZEJRVWM3YjBKQlFVTTdPM2RDUVVGTkxHVkJRVmtzVFVGQlRUczdjVUpCUVdNN2JVSkJRVWs3YVVKQlFVczdaVUZET1VVN1lVRkRSRHRYUVVOR08xTkJRMFk3VDBGRFJqdExRVU5GTEVOQlExWTdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZKTEUxQlFVMHNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZETjBJc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRmRCUTBVN08xRkJRVk1zU1VGQlNTeEZRVUZETEZWQlFWVXNSVUZCUXl4VFFVRlRMRVZCUVVNc2VVSkJRWGxDTEVWQlFVTXNSVUZCUlN4RlFVRkRMRkZCUVZFN1RVRkRkRVU3TzFWQlFVc3NVMEZCVXl4RlFVRkRMRmRCUVZjN1VVRkRlRUk3TzFsQlFWRXNVMEZCVXl4RlFVRkRMR0ZCUVdFN1ZVRkROMEk3T3pzN1YwRkJiVVE3VTBGRE5VTTdVVUZEVkRzN1dVRkJTeXhUUVVGVExFVkJRVU1zUzBGQlN6dFZRVU5zUWpzN1kwRkJTeXhUUVVGVExFVkJRVU1zYlVKQlFXMUNPMWxCUTJoRE96dG5Ra0ZCUnl4VFFVRlRMRVZCUVVNc1RVRkJUVHM3WVVGQk1rSTdXVUZET1VNN08yZENRVUZMTEZOQlFWTXNSVUZCUXl4WFFVRlhPMk5CUTNoQ096czdPMlZCUVRKQ096dGpRVUZ4UWl3clFrRkJUVHRqUVVOMFJEczdPenRsUVVGblF6czdZVUZETlVJN1dVRkRUanM3WjBKQlFVY3NTVUZCU1N4RlFVRkRMRWRCUVVjc1JVRkJReXhUUVVGVExFVkJRVU1zYlVOQlFXMURPenRoUVVGWk8xZEJRMnBGTzFWQlEwNDdPMk5CUVVzc1UwRkJVeXhGUVVGRExHMURRVUZ0UXp0WlFVTm9SRHM3WjBKQlFVY3NVMEZCVXl4RlFVRkRMRTFCUVUwN08yRkJRWEZETzFsQlEzaEVPenRuUWtGQlN5eFRRVUZUTEVWQlFVTXNWMEZCVnp0alFVTjRRanM3T3p0bFFVRXlRanM3WTBGQmNVSXNLMEpCUVUwN1kwRkRkRVE3T3pzN1pVRkJaME03TzJGQlF6VkNPMWxCUTA0N08yZENRVUZITEVsQlFVa3NSVUZCUXl4SFFVRkhMRVZCUVVNc1UwRkJVeXhGUVVGRExHMURRVUZ0UXpzN1lVRkJWenRYUVVOb1JUdFRRVU5HTzFGQlEwNHNLMEpCUVUwN1VVRkRUanM3V1VGQlN5eFRRVUZUTEVWQlFVTXNTMEZCU3p0VlFVTnNRanM3WTBGQlN5eFRRVUZUTEVWQlFVTXNiMEpCUVc5Q08xbEJRMnBET3pzN08yRkJRWE5DTzFsQlEzUkNPenM3TzJGQlFYTlFPMWxCUTNSUU96dG5Ra0ZCU3l4VFFVRlRMRVZCUVVNc1YwRkJWenRqUVVONFFqczdhMEpCUVVjc1NVRkJTU3hGUVVGRExFZEJRVWNzUlVGQlF5eFRRVUZUTEVWQlFVTXNkMEpCUVhkQ096dGxRVUY1UWp0alFVTjJSVHM3YTBKQlFVY3NTVUZCU1N4RlFVRkRMRWRCUVVjc1JVRkJReXhUUVVGVExFVkJRVU1zZDBKQlFYZENPenRsUVVGM1FqdGhRVU5zUlR0WlFVTk9PenRuUWtGQlN5eFRRVUZUTEVWQlFVTXNXVUZCV1RzN1kwRkRWRHM3YTBKQlFVY3NTVUZCU1N4RlFVRkRMRWRCUVVjc1JVRkJReXhUUVVGVExFVkJRVU1zZDBKQlFYZENPenRsUVVFd1FqdGhRVU53Ump0WFFVTkdPMU5CUTBZN1QwRkRSanRMUVVORkxFTkJRMVk3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hKUVVGSkxGRkJRVkVzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGREwwSXNVVUZCVFN4RlFVRkZMR3RDUVVGWE8wRkJRMnBDTEZkQlEwVTdPMUZCUVZNc1NVRkJTU3hGUVVGRExGVkJRVlVzUlVGQlF5eFRRVUZUTEVWQlFVTXNlVUpCUVhsQ0xFVkJRVU1zUlVGQlJTeEZRVUZETEZWQlFWVTdUVUZEZUVVN08xVkJRVXNzVTBGQlV5eEZRVUZETEZkQlFWYzdVVUZEZUVJN08xbEJRVkVzVTBGQlV5eEZRVUZETEdGQlFXRTdWVUZETjBJN096czdXVUZCWVRzN096dGhRVUZwUWpzN1YwRkJaMEk3VlVGRE9VTTdPenM3VjBGQmNVUTdVMEZET1VNN1VVRkRWRHM3V1VGQlN5eFRRVUZUTEVWQlFVTXNhVUpCUVdsQ08xVkJRemxDT3p0alFVRkxMRk5CUVZNc1JVRkJReXd3UWtGQk1FSTdXVUZEZGtNN08yZENRVUZQTEU5QlFVOHNSVUZCUXl4cFFrRkJhVUlzUlVGQlF5eFRRVUZUTEVWQlFVTXNiVVJCUVcxRU96dGhRVUYzUWp0WlFVTjBTRHM3WjBKQlFVc3NVMEZCVXl4RlFVRkRMSEZEUVVGeFF6dGpRVU5zUkN3clFrRkJUeXhKUVVGSkxFVkJRVU1zVlVGQlZTeEZRVUZETEVsQlFVa3NSVUZCUXl4cFFrRkJhVUlzUlVGQlF5eFRRVUZUTEVWQlFVTXNVVUZCVVN4SFFVRkhPMkZCUXk5RU8xZEJRMFk3VlVGRFRpd3JRa0ZCVFR0VlFVTk9PenRqUVVGTExGTkJRVk1zUlVGQlF5d3dRa0ZCTUVJN1dVRkRka003TzJkQ1FVRlBMRTlCUVU4c1JVRkJReXhUUVVGVExFVkJRVU1zVTBGQlV5eEZRVUZETEcxRVFVRnRSRHM3WVVGQlowSTdXVUZEZEVjN08yZENRVUZMTEZOQlFWTXNSVUZCUXl4eFEwRkJjVU03WTBGRGJFUTdPMnRDUVVGUkxGTkJRVTBzWTBGQll5eEZRVUZETEVWQlFVVXNSVUZCUXl4VFFVRlRPMmRDUVVOMlF6czdPenRwUWtGQkswSTdaMEpCUXk5Q096czdPMmxDUVVFMlFqdGxRVU4wUWp0aFFVTk1PMWRCUTBZN1ZVRkRUaXdyUWtGQlRUdFZRVU5PT3p0alFVRkxMRk5CUVZNc1JVRkJReXd3UWtGQk1FSTdXVUZEZGtNN08yZENRVUZQTEU5QlFVOHNSVUZCUXl4VlFVRlZMRVZCUVVNc1UwRkJVeXhGUVVGRExHMUVRVUZ0UkRzN1lVRkJhVUk3V1VGRGVFYzdPMmRDUVVGTExGTkJRVk1zUlVGQlF5eHhRMEZCY1VNN1kwRkRiRVFzSzBKQlFVOHNTVUZCU1N4RlFVRkRMRlZCUVZVc1JVRkJReXhKUVVGSkxFVkJRVU1zVlVGQlZTeEZRVUZETEZOQlFWTXNSVUZCUXl4UlFVRlJMRWRCUVVjN1lVRkRlRVE3VjBGRFJqdFZRVU5PTEN0Q1FVRk5PMVZCUTA0N08yTkJRVXNzVTBGQlV5eEZRVUZETERCQ1FVRXdRanRaUVVOMlF6czdaMEpCUVU4c1QwRkJUeXhGUVVGRExGRkJRVkVzUlVGQlF5eFRRVUZUTEVWQlFVTXNiVVJCUVcxRU96dGpRVUZ0UWpzN096dGxRVUZwUWpzN1kwRkJRenM3T3p0bFFVRnBRanRoUVVGUk8xbEJRMjVLT3p0blFrRkJTeXhUUVVGVExFVkJRVU1zY1VOQlFYRkRPMk5CUTJ4RU96dHJRa0ZCUnl4SlFVRkpMRVZCUVVNc1IwRkJSeXhGUVVGRExGTkJRVk1zUlVGQlF5eDFRa0ZCZFVJN08yVkJRVmM3WVVGRGNFUTdWMEZEUmp0VFFVTkdPMDlCUTBZN1MwRkRSU3hEUVVOV08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1NVRkJTU3hQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRemxDTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFhRVU5GT3p0UlFVRlRMRWxCUVVrc1JVRkJReXhWUVVGVkxFVkJRVU1zVTBGQlV5eEZRVUZETEhsQ1FVRjVRaXhGUVVGRExFVkJRVVVzUlVGQlF5eFRRVUZUTzAxQlEzWkZPenRWUVVGTExGTkJRVk1zUlVGQlF5eFhRVUZYTzFGQlEzaENPenRaUVVGUkxGTkJRVk1zUlVGQlF5eGhRVUZoTzFWQlF6ZENPenM3TzFkQlFXZENPMU5CUTFRN1VVRkRWRHM3V1VGQlN5eFRRVUZUTEVWQlFVTXNTMEZCU3p0VlFVTnNRanM3WTBGQlN5eFRRVUZUTEVWQlFVTXNWMEZCVnp0WlFVTjRRanM3WjBKQlFVY3NVMEZCVXl4RlFVRkRMRTFCUVUwN08yRkJRVzlNTzFsQlEzWk5PenM3TzJGQlFYTk1PMWRCUTJ4TU8xTkJRMFk3VDBGRFJqdExRVU5GTEVOQlExWTdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZKTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZETlVJc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRmRCUTBVN08xRkJRVk1zU1VGQlNTeEZRVUZETEZWQlFWVXNSVUZCUXl4VFFVRlRMRVZCUVVNc2VVSkJRWGxDTEVWQlFVTXNSVUZCUlN4RlFVRkRMRTlCUVU4N1RVRkRja1U3TzFWQlFVc3NVMEZCVXl4RlFVRkRMRmRCUVZjN1VVRkRlRUk3TzFsQlFWRXNVMEZCVXl4RlFVRkRMR0ZCUVdFN1ZVRkROMElzTmtKQlFVc3NSMEZCUnl4RlFVRkRMSGxDUVVGNVFpeEZRVUZETEVkQlFVY3NSVUZCUXl4RlFVRkZMRWRCUVVjN1UwRkRja003VDBGRFREdExRVU5GTEVOQlExWTdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeFJRVUZSTEVWQlFVVXNRMEZCUXlJc0ltWnBiR1VpT2lJdmFHOXRaUzl3YjJ4aGNtbHpMM0oxYlcxaFoybHVaMTl5YjNWdVpDOXViMlJsTG1wekwzUndMWEpsWVdOMEwzQjFZbXhwWXk5cWN5OTJaRzVoYldWdWRTNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW5aaGNpQk5iMjFsYm5RZ1BTQnlaWEYxYVhKbEtDZHRiMjFsYm5RbktUdGNjbHh1ZG1GeUlHUmhkR0VnUFNCeVpYRjFhWEpsS0NkMlpHNWhMM04wWVhScFkxOWtZWFJoSnlrN1hISmNiaTh2SUhaaGNpQkJkWFJ2WTI5dGNHeGxkR1VnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQzFoZFhSdlkyOXRjR3hsZEdVdmJHbGlMMjFoYVc0dWFuTW5LVHRjY2x4dUx5OGdkbUZ5SUVOdmJXSnZZbTk0SUQwZ1FYVjBiMk52YlhCc1pYUmxMa052YldKdlltOTRPMXh5WEc0dkx5QjJZWElnUTI5dFltOWliM2hQY0hScGIyNGdQU0JCZFhSdlkyOXRjR3hsZEdVdVEyOXRZbTlpYjNoUGNIUnBiMjQ3WEhKY2JseHlYRzR2THlBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYSEpjYmk4dklFRjFkRzlqYjIxd2JHVjBaU0JqYjJSbFhISmNiaTh2SUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNjbHh1WEhKY2JuWmhjaUJCZFhSdlkyOXRjR3hsZEdVZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYSEpjYmlBZ1kyOXRjRzl1Wlc1MFJHbGtUVzkxYm5RNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdkR2hwY3k1ZmMyVjBTVzV3ZFhSR2NtOXRWbUZzZFdVb0tUdGNjbHh1SUNBZ0lIWmhjaUJvYVdkb2JHbG5hSFJsWkVsdVpHVjRPMXh5WEc0Z0lDQWdkbUZ5SUhSb1lYUWdQU0IwYUdsek8xeHlYRzRnSUNBZ1pHOWpkVzFsYm5RdWIyNXJaWGxrYjNkdUlEMGdablZ1WTNScGIyNG9aU2tnZTF4eVhHNGdJQ0FnSUNCemQybDBZMmdvWlM1clpYbERiMlJsS1NCN1hISmNiaUFnSUNBZ0lDQWdZMkZ6WlNBeE16b2dMeThnWlc1MFpYSXVYSEpjYmlBZ0lDQWdJQ0FnSUNCamIyNXpiMnhsTG14dlp5Z25SVTVVUlZJaEp5azdYSEpjYmlBZ0lDQWdJQ0FnSUNCMGFHRjBMbkJ5YjNCekxtRmtaRXhwYTJWRWIyNWxLQ2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2NseHVJQ0FnSUNBZ0lDQmpZWE5sSURrNklDOHZJSFJoWWx4eVhHNGdJQ0FnSUNBZ0lDQWdZMjl1YzI5c1pTNXNiMmNvSjFSQlFpRW5LVHRjY2x4dUlDQWdJQ0FnSUNBZ0lIUm9ZWFF1WDNObGRFWnliMjFJYVdkb2JHbG5hSFJsWkNncE8xeHlYRzRnSUNBZ0lDQWdJQ0FnWW5KbFlXczdYSEpjYmlBZ0lDQWdJQ0FnWTJGelpTQXpPRG9nTHk4Z2RYQmNjbHh1SUNBZ0lDQWdJQ0FnSUdocFoyaHNhV2RvZEdWa1NXNWtaWGdnUFNCMGFHRjBMbDlvYVdkb2JHbG5hSFJsWkVsdVpHVjRLQ2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQmpiMjV6YjJ4bExteHZaeWduVlZBaElDY2dLeUJvYVdkb2JHbG5hSFJsWkVsdVpHVjRLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lHbG1LR2hwWjJoc2FXZG9kR1ZrU1c1a1pYZ2dQaUF3S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb1lYUXVjMlYwVTNSaGRHVW9lMmhwWjJoc2FXZG9kR1ZrVm1Gc2RXVTZJSFJvWVhRdVgyTjFjbkpsYm5STllYUmphR1Z6S0NsYmFHbG5hR3hwWjJoMFpXUkpibVJsZUNBdElERmRmU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnSUNCaWNtVmhhenRjY2x4dUlDQWdJQ0FnSUNCallYTmxJRFF3T2lBdkx5QmtiM2R1WEhKY2JpQWdJQ0FnSUNBZ0lDQm9hV2RvYkdsbmFIUmxaRWx1WkdWNElEMGdkR2hoZEM1ZmFHbG5hR3hwWjJoMFpXUkpibVJsZUNncE8xeHlYRzRnSUNBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVzYjJjb0owUlBWMDRoSUNjZ0t5Qm9hV2RvYkdsbmFIUmxaRWx1WkdWNEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUdsbUtHaHBaMmhzYVdkb2RHVmtTVzVrWlhnZ1BUMDlJQzB4S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb1lYUXVjMlYwVTNSaGRHVW9lMmhwWjJoc2FXZG9kR1ZrVm1Gc2RXVTZJSFJvWVhRdVgyTjFjbkpsYm5STllYUmphR1Z6S0NsYk1GMTlLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lIMGdaV3h6WlNCcFppaG9hV2RvYkdsbmFIUmxaRWx1WkdWNElEd2dkR2hoZEM1ZlkzVnljbVZ1ZEUxaGRHTm9aWE1vS1M1c1pXNW5kR2dnTFNBeEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9ZWFF1YzJWMFUzUmhkR1VvZTJocFoyaHNhV2RvZEdWa1ZtRnNkV1U2SUhSb1lYUXVYMk4xY25KbGJuUk5ZWFJqYUdWektDbGJhR2xuYUd4cFoyaDBaV1JKYm1SbGVDQXJJREZkZlNrN1hISmNiaUFnSUNBZ0lDQWdJQ0I5WEhKY2JpQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2NseHVJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZUdGNjbHh1SUNCOUxGeHlYRzRnSUdkbGRFUmxabUYxYkhSUWNtOXdjem9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnZTF4eVhHNGdJQ0FnSUNCa1pXWmhkV3gwVm1Gc2RXVTZJQ2RoY0hCc1pTY3NYSEpjYmlBZ0lDQWdJR3hwYldsMFZHOU1hWE4wT2lCMGNuVmxMRnh5WEc0Z0lDQWdJQ0J0WVhoSmRHVnRjMU5vYjNkdU9pQTRMRnh5WEc0Z0lDQWdJQ0J6YjNWeVkyVlZjbXc2SUc1MWJHd3NYSEpjYmlBZ0lDQWdJR1JsWm1GMWJIUk1hWE4wT2lCYklDZGhjSEJzWlNjc0lDZGlZVzVoYm1FbkxDQW5iM0poYm1kbEp5d2dKMmR5WVhCbEp5d2dKMk5vWlhKeWVTY2dYU3hjY2x4dUlDQWdJQ0FnWVd4emIxTmxZWEpqYUZaaGJIVmxjem9nWm1Gc2MyVXNYSEpjYmlBZ0lDQWdJR3h2WVdSVmNteFBibU5sT2lCMGNuVmxMRnh5WEc0Z0lDQWdJQ0J6Wld4bFkzUkJiR3hVWlhoMFQyNURiR2xqYXpvZ2RISjFaU3hjY2x4dUlDQWdJQ0FnYjI1T2IwMWhkR05vT2lCbWRXNWpkR2x2YmloemRHRjBaU2tnZTMxY2NseHVJQ0FnSUgwN1hISmNiaUFnZlN4Y2NseHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnY21WMGRYSnVJSHRjY2x4dUlDQWdJQ0FnYkdsemREb2dkR2hwY3k1d2NtOXdjeTVrWldaaGRXeDBUR2x6ZEN4Y2NseHVJQ0FnSUNBZ1kzVnljbVZ1ZEZaaGJIVmxPaUIwYUdsekxuQnliM0J6TG1SbFptRjFiSFJXWVd4MVpTeGNjbHh1SUNBZ0lDQWdhR2xuYUd4cFoyaDBaV1JXWVd4MVpUb2dkR2hwY3k1d2NtOXdjeTVrWldaaGRXeDBWbUZzZFdVc1hISmNiaUFnSUNBZ0lITm9iM2RGYm5SeWFXVnpPaUJtWVd4elpWeHlYRzRnSUNBZ2ZUdGNjbHh1SUNCOUxGeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMllYSWdaVzUwY21sbGN5QTlJSFJvYVhNdWMzUmhkR1V1YzJodmQwVnVkSEpwWlhNZ1AxeHlYRzRnSUNBZ0lDQWdJQ0FnUEc5c0lITjBlV3hsUFh0N2NHOXphWFJwYjI0NklDZGhZbk52YkhWMFpTY3NJR0poWTJ0bmNtOTFibVJEYjJ4dmNqb2dKM2RvYVhSbEp5d2dZMjlzYjNJNklDZGliR0ZqYXljc0lHeHBjM1JUZEhsc1pUb2dKMjV2Ym1VbkxDQndZV1JrYVc1bk9pQXdMQ0J0WVhKbmFXNDZJREI5ZlNCdmJrMXZkWE5sVEdWaGRtVTllM1JvYVhNdVgyOXVSVzUwY25sTmIzVnpaVTkxZEgwK2UzUm9hWE11WDNKbGJtUmxjazFoZEdOb1pYTW9LWDA4TDI5c1BpQTZJQ2NuTzF4eVhHNGdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnUEdScGRqNWNjbHh1SUNBZ0lDQWdJQ0E4YVc1d2RYUWdhV1E5ZTNSb2FYTXVjSEp2Y0hNdWFXNXdkWFJKWkgwZ1kyeGhjM05PWVcxbFBYdDBhR2x6TG5CeWIzQnpMbU5zWVhOelRtRnRaWDBnY21WbVBWd2lZWFYwYjBsdWNIVjBYQ0lnYjI1RGFHRnVaMlU5ZTNSb2FYTXVYMjl1UTJoaGJtZGxmU0J2YmtadlkzVnpQWHQwYUdsekxsOXZia1p2WTNWemZTQnZia0pzZFhJOWUzUm9hWE11WDI5dVFteDFjbjBnYjI1RGJHbGphejE3ZEdocGN5NWZiMjVKYm5CMWRFTnNhV05yZlNBdlBseHlYRzRnSUNBZ0lDQWdJSHRsYm5SeWFXVnpmVnh5WEc0Z0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDazdYSEpjYmlBZ2ZTeGNjbHh1SUNCZlkzVnljbVZ1ZEUxaGRHTm9aWE02SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2RtRnlJSFJvWVhRZ1BTQjBhR2x6TzF4eVhHNGdJQ0FnZG1GeUlHTnRJRDBnZEdocGN5NXpkR0YwWlM1c2FYTjBMbVpwYkhSbGNpaG1kVzVqZEdsdmJpaGxiblJ5ZVNrZ2UxeHlYRzRnSUNBZ0lDQnlaWFIxY200Z1pXNTBjbmt1YVc1a1pYaFBaaWgwYUdGMExsOXBibkIxZENncEtTQStJQzB4TzF4eVhHNGdJQ0FnZlNrN1hISmNiaUFnSUNCeVpYUjFjbTRnWTIwN1hISmNiaUFnZlN4Y2NseHVJQ0JmYVc1d2RYUTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnYVdZb0lYUm9hWE11YVhOTmIzVnVkR1ZrS0NrcElIdGNjbHh1SUNBZ0lDQWdjbVYwZFhKdUlDY25PMXh5WEc0Z0lDQWdmU0JsYkhObElIdGNjbHh1SUNBZ0lDQWdjbVYwZFhKdUlGSmxZV04wTG1acGJtUkVUMDFPYjJSbEtIUm9hWE11Y21WbWN5NWhkWFJ2U1c1d2RYUXBMblpoYkhWbE8xeHlYRzRnSUNBZ2ZWeHlYRzRnSUgwc1hISmNiaUFnWDNKbGJtUmxjazFoZEdOb1pYTTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZG1GeUlIUm9ZWFFnUFNCMGFHbHpPMXh5WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDJOMWNuSmxiblJOWVhSamFHVnpLQ2t1YzJ4cFkyVW9NQ3dnZEdocGN5NXdjbTl3Y3k1dFlYaEpkR1Z0YzFOb2IzZHVLUzV0WVhBb1puVnVZM1JwYjI0b1pXNTBjbmtzSUdsdVpHVjRLU0I3WEhKY2JpQWdJQ0FnSUhKbGRIVnliaUFvWEhKY2JpQWdJQ0FnSUNBZ1BFRjFkRzlqYjIxd2JHVjBaVVZ1ZEhKNUlHaHBaMmhzYVdkb2RHVmtQWHRsYm5SeWVTQTlQVDBnZEdoaGRDNXpkR0YwWlM1b2FXZG9iR2xuYUhSbFpGWmhiSFZsZlNCclpYazllMlZ1ZEhKNWZTQjJZV3gxWlQxN1pXNTBjbmw5SUc5dVJXNTBjbmxEYkdsamF6MTdkR2hoZEM1ZmIyNUZiblJ5ZVVOc2FXTnJmU0J2YmtWdWRISjVUVzkxYzJWUGRtVnlQWHQwYUdGMExsOXZia1Z1ZEhKNVRXOTFjMlZQZG1WeWZTQXZQbHh5WEc0Z0lDQWdJQ0FwTzF4eVhHNGdJQ0FnZlNrN1hISmNiaUFnZlN4Y2NseHVJQ0JmYUdsbmFHeHBaMmgwWldSSmJtUmxlRG9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMllYSWdkR2hoZENBOUlIUm9hWE03WEhKY2JpQWdJQ0IyWVhJZ1ptOTFibVJKYm1SbGVDQTlJQzB4TzF4eVhHNGdJQ0FnZEdocGN5NWZZM1Z5Y21WdWRFMWhkR05vWlhNb0tTNW1iM0pGWVdOb0tHWjFibU4wYVc5dUtHVnVkSEo1TENCcGJtUmxlQ2tnZTF4eVhHNGdJQ0FnSUNCcFppaGxiblJ5ZVNBOVBUMGdkR2hoZEM1emRHRjBaUzVvYVdkb2JHbG5hSFJsWkZaaGJIVmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ1ptOTFibVJKYm1SbGVDQTlJR2x1WkdWNE8xeHlYRzRnSUNBZ0lDQjlYSEpjYmlBZ0lDQjlLVHRjY2x4dUlDQWdJSEpsZEhWeWJpQm1iM1Z1WkVsdVpHVjRPMXh5WEc0Z0lIMHNYSEpjYmlBZ1gzVndaR0YwWlVocFoyaHNhV2RvZEdWa1ZtRnNkV1U2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2RtRnlJRzVsZDFaaGJIVmxPMXh5WEc0Z0lDQWdkbUZ5SUdocFoyaHNhV2RvZEdWa1NXNWtaWGdnUFNCMGFHbHpMbDlvYVdkb2JHbG5hSFJsWkVsdVpHVjRLQ2s3WEhKY2JpQWdJQ0JwWmlob2FXZG9iR2xuYUhSbFpFbHVaR1Y0SUR3Z01Da2dlMXh5WEc0Z0lDQWdJQ0J1WlhkV1lXeDFaU0E5SUhSb2FYTXVjM1JoZEdVdWJHbHpkRnN3WFR0Y2NseHVJQ0FnSUgwZ1pXeHpaU0I3WEhKY2JpQWdJQ0FnSUc1bGQxWmhiSFZsSUQwZ2RHaHBjeTV6ZEdGMFpTNXNhWE4wVzJocFoyaHNhV2RvZEdWa1NXNWtaWGhkTzF4eVhHNGdJQ0FnZlZ4eVhHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdhR2xuYUd4cFoyaDBaV1JXWVd4MVpUb2dibVYzVm1Gc2RXVjlLVHRjY2x4dUlDQjlMRnh5WEc0Z0lGOXpaWFJKYm5CMWRFWnliMjFXWVd4MVpUb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0JTWldGamRDNW1hVzVrUkU5TlRtOWtaU2gwYUdsekxuSmxabk11WVhWMGIwbHVjSFYwS1M1MllXeDFaU0E5SUhSb2FYTXVjM1JoZEdVdVkzVnljbVZ1ZEZaaGJIVmxPMXh5WEc0Z0lIMHNYSEpjYmlBZ1gzTmxkRlpoYkhWbFJuSnZiVWx1Y0hWME9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJSFpoY2lCcGJuQjFkRlJsZUhRZ1BTQlNaV0ZqZEM1bWFXNWtSRTlOVG05a1pTaDBhR2x6TG5KbFpuTXVZWFYwYjBsdWNIVjBLUzUyWVd4MVpUdGNjbHh1SUNBZ0lIWmhjaUJtYjNWdVpFVnVkSEpwWlhNZ1BTQjBhR2x6TG5OMFlYUmxMbXhwYzNRdVptbHNkR1Z5S0daMWJtTjBhVzl1S0dWdWRISjVLU0I3WEhKY2JpQWdJQ0FnSUhKbGRIVnliaUJsYm5SeWVTNXBibVJsZUU5bUtHbHVjSFYwVkdWNGRDa2dQaUF0TVR0Y2NseHVJQ0FnSUgwcE8xeHlYRzRnSUNBZ2FXWW9abTkxYm1SRmJuUnlhV1Z6TG14bGJtZDBhQ0ErSURBcElIdGNjbHh1SUNBZ0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1hISmNiaUFnSUNBZ0lDQWdZM1Z5Y21WdWRGWmhiSFZsT2lCbWIzVnVaRVZ1ZEhKcFpYTmJNRjBzWEhKY2JpQWdJQ0FnSUNBZ2FHbG5hR3hwWjJoMFpXUldZV3gxWlRvZ1ptOTFibVJGYm5SeWFXVnpXekJkWEhKY2JpQWdJQ0FnSUgwcE8xeHlYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2NseHVJQ0FnSUNBZ2RHaHBjeTV3Y205d2N5NXZiazV2VFdGMFkyZ29kR2hwY3k1emRHRjBaU2s3WEhKY2JpQWdJQ0FnSUdsbUtIUm9hWE11Y0hKdmNITXViR2x0YVhSVWIweHBjM1FwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0Y2NseHVJQ0FnSUNBZ0lDQWdJR04xY25KbGJuUldZV3gxWlRvZ2RHaHBjeTV3Y205d2N5NWtaV1poZFd4MFZtRnNkV1VzWEhKY2JpQWdJQ0FnSUNBZ0lDQm9hV2RvYkdsbmFIUmxaRlpoYkhWbE9pQjBhR2x6TG5CeWIzQnpMbVJsWm1GMWJIUldZV3gxWlZ4eVhHNGdJQ0FnSUNBZ0lIMHBPMXh5WEc0Z0lDQWdJQ0I5WEhKY2JpQWdJQ0I5WEhKY2JpQWdmU3hjY2x4dUlDQmZjMlYwUm5KdmJVaHBaMmhzYVdkb2RHVmtPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMXh5WEc0Z0lDQWdJQ0JqZFhKeVpXNTBWbUZzZFdVNklIUm9hWE11YzNSaGRHVXVhR2xuYUd4cFoyaDBaV1JXWVd4MVpWeHlYRzRnSUNBZ2ZTd2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0FnSUhSb2FYTXVYM05sZEVsdWNIVjBSbkp2YlZaaGJIVmxLQ2s3WEhKY2JpQWdJQ0I5S1R0Y2NseHVJQ0I5TEZ4eVhHNGdJRjl2YmtOb1lXNW5aVG9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMGFHbHpMbDl6WlhSV1lXeDFaVVp5YjIxSmJuQjFkQ2dwTzF4eVhHNGdJSDBzWEhKY2JpQWdYMjl1Um05amRYTTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdjMmh2ZDBWdWRISnBaWE02SUhSeWRXVjlLVHRjY2x4dUlDQjlMRnh5WEc0Z0lGOXZia0pzZFhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdkR2hwY3k1ZmMyVjBSbkp2YlVocFoyaHNhV2RvZEdWa0tDazdYSEpjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0emFHOTNSVzUwY21sbGN6b2dabUZzYzJWOUtUdGNjbHh1SUNCOUxGeHlYRzRnSUY5dmJrVnVkSEo1UTJ4cFkyczZJR1oxYm1OMGFXOXVLR1Z1ZEhKNUtTQjdYSEpjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0Y2NseHVJQ0FnSUNBZ1kzVnljbVZ1ZEZaaGJIVmxPaUJsYm5SeWVWeHlYRzRnSUNBZ2ZTd2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0FnSUhSb2FYTXVYM05sZEVsdWNIVjBSbkp2YlZaaGJIVmxLQ2s3WEhKY2JpQWdJQ0I5S1R0Y2NseHVJQ0I5TEZ4eVhHNGdJRjl2YmtWdWRISjVUVzkxYzJWUGRtVnlPaUJtZFc1amRHbHZiaWhsYm5SeWVTa2dlMXh5WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN2FHbG5hR3hwWjJoMFpXUldZV3gxWlRvZ1pXNTBjbmw5S1R0Y2NseHVJQ0I5TEZ4eVhHNGdJRjl2YmtWdWRISjVUVzkxYzJWUGRYUTZJR1oxYm1OMGFXOXVLR1Z1ZEhKNUtTQjdYSEpjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0b2FXZG9iR2xuYUhSbFpGWmhiSFZsT2lCMGFHbHpMbU4xY25KbGJuUldZV3gxWlgwcE8xeHlYRzRnSUgwc1hISmNiaUFnWDI5dVNXNXdkWFJEYkdsamF6b2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0JTWldGamRDNW1hVzVrUkU5TlRtOWtaU2gwYUdsekxuSmxabk11WVhWMGIwbHVjSFYwS1M1elpXeGxZM1FvS1R0Y2NseHVJQ0I5WEhKY2JuMHBPMXh5WEc1Y2NseHVkbUZ5SUVGMWRHOWpiMjF3YkdWMFpVVnVkSEo1SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHlYRzRnSUdkbGRFbHVhWFJwWVd4VGRHRjBaVG9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnZTJodmRtVnlPaUJtWVd4elpYMDdYSEpjYmlBZ2ZTeGNjbHh1SUNCZmIyNURiR2xqYXpvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TG5CeWIzQnpMbTl1Ulc1MGNubERiR2xqYXloMGFHbHpMbkJ5YjNCekxuWmhiSFZsS1R0Y2NseHVJQ0I5TEZ4eVhHNGdJRjl2YmsxdmRYTmxUM1psY2pvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TG5CeWIzQnpMbTl1Ulc1MGNubE5iM1Z6WlU5MlpYSW9kR2hwY3k1d2NtOXdjeTUyWVd4MVpTazdYSEpjYmlBZ2ZTeGNjbHh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2NtVjBkWEp1SUNoY2NseHVJQ0FnSUNBZ1BHeHBJSE4wZVd4bFBYdDdZbUZqYTJkeWIzVnVaRU52Ykc5eU9pQjBhR2x6TG5CeWIzQnpMbWhwWjJoc2FXZG9kR1ZrSUQ4Z0oyaHpiQ2c1TUN3Z05UQWxMQ0ExTUNVcEp5QTZJQ2NuTENCNlNXNWtaWGc2SURrNU9Ua3NJR04xY25OdmNqb2dKM0J2YVc1MFpYSW5mWDBnYjI1TmIzVnpaVVJ2ZDI0OWUzUm9hWE11WDI5dVEyeHBZMnQ5SUc5dVRXOTFjMlZQZG1WeVBYdDBhR2x6TGw5dmJrMXZkWE5sVDNabGNuMCtlM1JvYVhNdWNISnZjSE11ZG1Gc2RXVjlQQzlzYVQ1Y2NseHVJQ0FnSUNrN1hISmNiaUFnZlZ4eVhHNTlLVHRjY2x4dVhISmNiaTh2SUMwdExTMHRMUzB0TFMwdExTMHRMVnh5WEc0dkx5QmxibVFnUVhWMGIyTnZiWEJzWlhSbFhISmNiaTh2SUMwdExTMHRMUzB0TFMwdExTMHRMVnh5WEc1Y2NseHVablZ1WTNScGIyNGdjbVZTWlc1a1pYSW9LU0I3WEhKY2JpQWdVbVZoWTNRdWNtVnVaR1Z5S0Z4eVhHNGdJQ0FnUEZaa2JtRk5aVzUxSUhSaFlreHBjM1E5ZTNSaFlreHBjM1I5SUM4K0xGeHlYRzRnSUNBZ1pHOWpkVzFsYm5RdVoyVjBSV3hsYldWdWRFSjVTV1FvSjNaa2JtRnRaVzUxSnlsY2NseHVJQ0FwTzF4eVhHNTlPMXh5WEc1Y2NseHVkbUZ5SUhSaFlreHBjM1FnUFNCYlhISmNiaUFnZXlCcFpEb2dNU3dnYUhKbFpqb2dKM0J5YjJacGJHVW5MQ0IwWlhoME9pQW5SV1JwZENCTmVTQlFjbTltYVd4bEp5d2djMlZzWldOMFpXUTZJSFJ5ZFdVZ2ZTeGNjbHh1SUNCN0lHbGtPaUF5TENCb2NtVm1PaUFuYm05MGFXWnBZMkYwYVc5dWN5Y3NJSFJsZUhRNklDZFdhV1YzSUU1dmRHbG1hV05oZEdsdmJuTW5MQ0J6Wld4bFkzUmxaRG9nWm1Gc2MyVWdmU3hjY2x4dUlDQjdJR2xrT2lBekxDQm9jbVZtT2lBbmFXMXdiM0owSnl3Z2RHVjRkRG9nSjBsdGNHOXlkQ0JoYm1RZ1UzbHVZeWNzSUhObGJHVmpkR1ZrT2lCbVlXeHpaU0I5TEZ4eVhHNGdJSHNnYVdRNklEUXNJR2h5WldZNklDZHpaWFIwYVc1bmN5Y3NJSFJsZUhRNklDZERhR0Z1WjJVZ1UyVjBkR2x1WjNNbkxDQnpaV3hsWTNSbFpEb2dabUZzYzJVZ2ZTeGNjbHh1SUNCN0lHbGtPaUExTENCb2NtVm1PaUFuY0hKcGRtRmplU2NzSUhSbGVIUTZJQ2RRY21sMllXTjVKeXdnYzJWc1pXTjBaV1E2SUdaaGJITmxJSDBzWEhKY2JpQWdleUJwWkRvZ05pd2dhSEpsWmpvZ0oyRmliM1YwSnl3Z2RHVjRkRG9nSjBGaWIzVjBKeXdnYzJWc1pXTjBaV1E2SUdaaGJITmxJSDFjY2x4dVhUdGNjbHh1WEhKY2JuWmhjaUJXWkc1aFRXVnVkU0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2NseHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnY21WMGRYSnVJSHRjY2x4dUlDQWdJQ0FnZEdGaVRHbHpkRG9nZEdocGN5NXdjbTl3Y3k1MFlXSk1hWE4wTEZ4eVhHNGdJQ0FnSUNCamRYSnlaVzUwVkdGaU9pQXhYSEpjYmlBZ0lDQjlPMXh5WEc0Z0lIMHNYSEpjYmlBZ1kyaGhibWRsVkdGaU9pQm1kVzVqZEdsdmJpaDBZV0pKWkNrZ2UxeHlYRzRnSUNBZ2RtRnlJRzVsZDFSaFlreHBjM1FnUFNCMFlXSk1hWE4wTG0xaGNDaG1kVzVqZEdsdmJpaDBZV0lwSUh0Y2NseHVJQ0FnSUNBZ2RHRmlMbk5sYkdWamRHVmtJRDBnZEdGaUxtbGtJRDA5UFNCMFlXSkpaRHRjY2x4dUlDQWdJQ0FnY21WMGRYSnVJSFJoWWp0Y2NseHVJQ0FnSUgwcE8xeHlYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WEhKY2JpQWdJQ0FnSUhSaFlreHBjM1E2SUc1bGQxUmhZa3hwYzNRc1hISmNiaUFnSUNBZ0lHTjFjbkpsYm5SVVlXSTZJSFJoWWtsa1hISmNiaUFnSUNCOUtUdGNjbHh1SUNCOUxGeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMllYSWdkR0ZpUTI5dWRHVnVkRHRjY2x4dUlDQWdJSE4zYVhSamFDaDBhR2x6TG5OMFlYUmxMbU4xY25KbGJuUlVZV0lwSUh0Y2NseHVJQ0FnSUNBZ1kyRnpaU0F4T2x4eVhHNGdJQ0FnSUNBZ0lIUmhZa052Ym5SbGJuUWdQU0E4VFhsUWNtOW1hV3hsSUM4K08xeHlYRzRnSUNBZ0lDQWdJR0p5WldGck8xeHlYRzRnSUNBZ0lDQmpZWE5sSURJNlhISmNiaUFnSUNBZ0lDQWdkR0ZpUTI5dWRHVnVkQ0E5SUR4T2IzUnBabWxqWVhScGIyNXpJQzgrTzF4eVhHNGdJQ0FnSUNBZ0lHSnlaV0ZyTzF4eVhHNGdJQ0FnSUNCallYTmxJRE02WEhKY2JpQWdJQ0FnSUNBZ2RHRmlRMjl1ZEdWdWRDQTlJRHhKYlhCdmNuUWdMejQ3WEhKY2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEhKY2JpQWdJQ0FnSUdOaGMyVWdORHBjY2x4dUlDQWdJQ0FnSUNCMFlXSkRiMjUwWlc1MElEMGdQRk5sZEhScGJtZHpJQzgrTzF4eVhHNGdJQ0FnSUNBZ0lHSnlaV0ZyTzF4eVhHNGdJQ0FnSUNCallYTmxJRFU2WEhKY2JpQWdJQ0FnSUNBZ2RHRmlRMjl1ZEdWdWRDQTlJRHhRY21sMllXTjVJQzgrTzF4eVhHNGdJQ0FnSUNBZ0lHSnlaV0ZyTzF4eVhHNGdJQ0FnSUNCallYTmxJRFk2WEhKY2JpQWdJQ0FnSUNBZ2RHRmlRMjl1ZEdWdWRDQTlJRHhCWW05MWRDQXZQanRjY2x4dUlDQWdJQ0FnSUNCaWNtVmhhenRjY2x4dUlDQWdJQ0FnWkdWbVlYVnNkRHBjY2x4dUlDQWdJQ0FnSUNCMFlXSkRiMjUwWlc1MElEMGdQRTE1VUhKdlptbHNaU0F2UGp0Y2NseHVJQ0FnSUgxY2NseHVJQ0FnSUhKbGRIVnliaUFvWEhKY2JpQWdJQ0FnSUR4elpXTjBhVzl1SUdOc1lYTnpUbUZ0WlQxY0luWmtibUZjSWo1Y2NseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luWmtibUV0WW05a2VWd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKamIyNTBZV2x1WlhKY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKeWIzZGNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4VkdGaWN5QjBZV0pNYVhOMFBYdDBhR2x6TG5OMFlYUmxMblJoWWt4cGMzUjlJR05vWVc1blpWUmhZajE3ZEdocGN5NWphR0Z1WjJWVVlXSjlJQzgrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p0WVdsdUxXTnZiblJsYm5RZ1kyOXNMWGh6TFRnZ1kyOXNMWGh6TFc5bVpuTmxkQzAwSUdOdmJDMXpiUzA1SUdOdmJDMXpiUzF2Wm1aelpYUXRNeUJqYjJ3dGJHY3RNVEFnWTI5c0xXeG5MVzltWm5ObGRDMHlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5SaFlpMWpiMjUwWlc1MFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUh0MFlXSkRiMjUwWlc1MGZWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBOFEyeHZjMlZXWkc1aElDOCtYSEpjYmlBZ0lDQWdJQ0FnSUNCN0x5b2dQRTl3Wlc1V1pHNWhJQzgrSUNvdmZWeHlYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQThMM05sWTNScGIyNCtYSEpjYmlBZ0lDQXBPMXh5WEc0Z0lIMWNjbHh1ZlNrN1hISmNibHh5WEc1MllYSWdUM0JsYmxaa2JtRWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEhKY2JpQWdhR0Z1Wkd4bFEyeHBZMnM2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0pDaGNJaU4yWkc1aGJXVnVkVndpS1M1emFHOTNLQ2s3WEhKY2JpQWdJQ0FrS0Z3aUkyOXdaVzVXWkc1aFhDSXBMbWhwWkdVb0tUdGNjbHh1SUNCOUxGeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnS0Z4eVhHNGdJQ0FnSUNBOFpHbDJQbHh5WEc1Y2REeHpjR0Z1SUdSaGRHRXRkRzluWjJ4bFBWd2lkRzl2YkhScGNGd2lJSFJwZEd4bFBWd2lRMnhwWTJzZ2RHOGdiM0JsYmlCV1JFNUJYQ0lnYVdROVhDSnZjR1Z1Vm1SdVlWd2lJR05zWVhOelRtRnRaVDFjSW1KMGJpQmlkRzR0YzIwZ1luUnVMWEJ5YVcxaGNua2diM0JsYmxaa2JtRmNJaUJ2YmtOc2FXTnJQWHQwYUdsekxtaGhibVJzWlVOc2FXTnJmVDVjY2x4dUlDQWdJQ0FnSUNBZ0lFOXdaVzRnZGtST1FWeHlYRzRnSUNBZ0lDQWdJRHd2YzNCaGJqNWNjbHh1SUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1EyeHZjMlZXWkc1aElEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh5WEc0Z0lHaGhibVJzWlVOc2FXTnJPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUNRb1hDSWpkbVJ1WVcxbGJuVmNJaWt1YUdsa1pTZ3BPMXh5WEc0Z0lDQWdKQ2hjSWlOdmNHVnVWbVJ1WVZ3aUtTNXphRzkzS0NrN1hISmNiaUFnZlN4Y2NseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnUEdScGRqNWNjbHh1WEhROGMzQmhiaUJrWVhSaExYUnZaMmRzWlQxY0luUnZiMngwYVhCY0lpQjBhWFJzWlQxY0lrTnNhV05ySUhSdklHTnNiM05sWENJZ1kyeGhjM05PWVcxbFBWd2lZMnh2YzJWV1pHNWhYQ0lnYzNSNWJHVTllM3RqZFhKemIzSTZJQ2R3YjJsdWRHVnlKMzE5SUc5dVEyeHBZMnM5ZTNSb2FYTXVhR0Z1Wkd4bFEyeHBZMnQ5UGx4eVhHNGdJQ0FnSUNBZ0lDQWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2labUVnWm1FdGNHOTNaWEl0YjJabVhDSStQQzl6Y0dGdVBseHlYRzRnSUNBZ0lDQWdJRHd2YzNCaGJqNWNjbHh1SUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1ZHRmljeUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2NseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZG1GeUlIUm9ZWFFnUFNCMGFHbHpPMXh5WEc0Z0lDQWdkbUZ5SUhSaFlreHBjM1JPYjJSbGN5QTlJSFJvYVhNdWNISnZjSE11ZEdGaVRHbHpkQzV0WVhBb1puVnVZM1JwYjI0b2RHRmlMQ0JwYm1SbGVDa2dlMXh5WEc0Z0lDQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0FnSUR4VVlXSWdZMmhoYm1kbFZHRmlQWHQwYUdGMExuQnliM0J6TG1Ob1lXNW5aVlJoWW4wZ2EyVjVQWHQwWVdJdWFISmxabjBnYVdROWUzUmhZaTVvY21WbWZTQjBZV0k5ZTNSaFluMGdMejVjY2x4dUlDQWdJQ0FnS1R0Y2NseHVJQ0FnSUgwcE8xeHlYRzRnSUNBZ2NtVjBkWEp1SUNoY2NseHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKemFXUmxZbUZ5SUdOdmJDMTRjeTAwSUdOdmJDMXpiUzB6SUdOdmJDMXNaeTB5WENJK1hISmNiaUFnSUNBZ0lDQWdQRzVoZGlCamJHRnpjMDVoYldVOVhDSnVZWFppWVhJZ2JtRjJZbUZ5TFdSbFptRjFiSFJjSWlCeWIyeGxQVndpYm1GMmFXZGhkR2x2Ymx3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnUEhWc0lHTnNZWE56VG1GdFpUMWNJbTVoZGlCdVlYWmlZWEl0Ym1GMlhDSWdjbTlzWlQxY0luUmhZbXhwYzNSY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2UzUmhZa3hwYzNST2IyUmxjMzFjY2x4dUlDQWdJQ0FnSUNBZ0lEd3ZkV3crWEhKY2JpQWdJQ0FnSUNBZ1BDOXVZWFkrWEhKY2JpQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdLVHRjY2x4dUlDQjlYSEpjYm4wcE8xeHlYRzVjY2x4dWRtRnlJRlJoWWlBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNjbHh1SUNCb1lXNWtiR1ZEYkdsamF6b2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0IwYUdsekxuQnliM0J6TG1Ob1lXNW5aVlJoWWloMGFHbHpMbkJ5YjNCekxuUmhZaTVwWkNrN1hISmNiaUFnZlN4Y2NseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnUEd4cElISnZiR1U5WENKd2NtVnpaVzUwWVhScGIyNWNJaUJqYkdGemMwNWhiV1U5ZTNSb2FYTXVjSEp2Y0hNdWRHRmlMbk5sYkdWamRHVmtJRDhnSjJGamRHbDJaU2NnT2lBbkozMCtYSEpjYmlBZ0lDQWdJQ0FnUEdFZ2FISmxaajE3ZEdocGN5NXdjbTl3Y3k1MFlXSXVhSEpsWm4wZ1lYSnBZUzFqYjI1MGNtOXNjejE3ZEdocGN5NXdjbTl3Y3k1MFlXSXVhSEpsWm4wZ2NtOXNaVDFjSW5SaFlsd2lJR1JoZEdFdGRHOW5aMnhsUFZ3aWRHRmlYQ0lnYjI1RGJHbGphejE3ZEdocGN5NW9ZVzVrYkdWRGJHbGphMzArWEhKY2JpQWdJQ0FnSUNBZ0lDQjdkR2hwY3k1d2NtOXdjeTUwWVdJdWRHVjRkSDFjY2x4dUlDQWdJQ0FnSUNBOEwyRStYSEpjYmlBZ0lDQWdJRHd2YkdrK1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1RYbFFjbTltYVd4bFNHVmhaR1Z5SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnS0Z4eVhHNGdJQ0FnSUNBOGFHVmhaR1Z5SUdOc1lYTnpUbUZ0WlQxY0luQmhaMlV0YUdWaFpHVnlYQ0krWEhKY2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKdFpXUnBZVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSnRaV1JwWVMxc1pXWjBYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbVpoSUdaaExUSjRJR1poTFhWelpYSmNJajQ4TDNOd1lXNCtYSEpjYmlBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWJXVmthV0V0WW05a2VWd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThhREVnWTJ4aGMzTk9ZVzFsUFZ3aWJXVmthV0V0YUdWaFpHbHVaMXdpUGxsdmRYSWdjSEp2Wm1sc1pTQThjMjFoYkd3K1lYUThMM050WVd4c1BpQmJjMmwwWlM1amIyMWRQQzlvTVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQThMMmhsWVdSbGNqNWNjbHh1SUNBZ0lDazdYSEpjYmlBZ2ZWeHlYRzU5S1R0Y2NseHVYSEpjYm5aaGNpQk5lVkJ5YjJacGJHVkRZWFJsWjI5eWFXVnpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJR2hoYm1Sc1pVTm9ZVzVuWlRvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQmpiMjV6YjJ4bExteHZaeWhTWldGamRDNW1hVzVrUkU5TlRtOWtaU2gwYUdsekxuSmxabk11WTJGMFpXZHZjbmtwTG5aaGJIVmxLVHRjY2x4dUlDQWdJSFJvYVhNdWNISnZjSE11WjJWMFEyRjBaV2R2Y25sUGJrTm9ZVzVuWlNoU1pXRmpkQzVtYVc1a1JFOU5UbTlrWlNoMGFHbHpMbkpsWm5NdVkyRjBaV2R2Y25rcExuWmhiSFZsS1R0Y2NseHVJQ0I5TEZ4eVhHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdlMXh5WEc0Z0lDQWdJQ0JqWVhSbFoyOXlhV1Z6T2lCMGFHbHpMbkJ5YjNCekxtTmhkR1ZuYjNKcFpYTmNjbHh1SUNBZ0lIMDdYSEpjYmlBZ2ZTeGNjbHh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2RtRnlJSFJvWVhRZ1BTQjBhR2x6TzF4eVhHNGdJQ0FnZG1GeUlHTmhkR1ZuYjNKNVRtOWtaWE1nUFNCMGFHbHpMbk4wWVhSbExtTmhkR1ZuYjNKcFpYTXViV0Z3S0daMWJtTjBhVzl1S0dOaGRHVm5iM0o1S1NCN1hISmNiaUFnSUNBZ0lISmxkSFZ5YmloY2NseHVJQ0FnSUNBZ0lDQThUWGxRY205bWFXeGxRMkYwWldkdmNua2dZMkYwWldkdmNuazllMk5oZEdWbmIzSjVmU0F2UGx4eVhHNGdJQ0FnSUNBcE8xeHlYRzRnSUNBZ2ZTazdYSEpjYmlBZ0lDQnlaWFIxY200Z0tGeHlYRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltWnZjbTB0WjNKdmRYQWdabTl5YlMxbmNtOTFjQzF6YlZ3aVBseHlYRzRnSUNBZ0lDQWdJRHhzWVdKbGJDQm9kRzFzUm05eVBWd2lZMkYwWldkdmNubGNJaUJqYkdGemMwNWhiV1U5WENKamIyd3RjMjB0TWlCamIyNTBjbTlzTFd4aFltVnNYQ0krUTJGMFpXZHZjbms4TDJ4aFltVnNQbHh5WEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5c0xYTnRMVEV3WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0E4YzJWc1pXTjBJR05zWVhOelRtRnRaVDFjSW5ObGJHVmpkSEJwWTJ0bGNsd2lJR2xrUFZ3aVkyRjBaV2R2Y25sY0lpQnlaV1k5WENKallYUmxaMjl5ZVZ3aUlHOXVRMmhoYm1kbFBYdDBhR2x6TG1oaGJtUnNaVU5vWVc1blpYMCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIdGpZWFJsWjI5eWVVNXZaR1Z6ZlZ4eVhHNGdJQ0FnSUNBZ0lDQWdQQzl6Wld4bFkzUStYSEpjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0tUdGNjbHh1SUNCOVhISmNibjBwTzF4eVhHNWNjbHh1ZG1GeUlFMTVVSEp2Wm1sc1pVTmhkR1ZuYjNKNUlEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh5WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQnlaWFIxY200Z0tGeHlYRzRnSUNBZ0lDQThiM0IwYVc5dUlIWmhiSFZsUFh0MGFHbHpMbkJ5YjNCekxtTmhkR1ZuYjNKNWZTQnlaV1k5ZTNSb2FYTXVjSEp2Y0hNdVkyRjBaV2R2Y25sOVBseHlYRzRnSUNBZ0lDQWdJSHRrWVhSaExtTmhjR2wwWVd4cGVtVW9kR2hwY3k1d2NtOXdjeTVqWVhSbFoyOXllU2w5WEhKY2JpQWdJQ0FnSUR3dmIzQjBhVzl1UGx4eVhHNGdJQ0FnS1R0Y2NseHVJQ0I5WEhKY2JuMHBPMXh5WEc1Y2NseHVkbUZ5SUUxNVVISnZabWxzWlZCeWFYWmhZM2tnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hISmNiaUFnWTI5dGNHOXVaVzUwUkdsa1RXOTFiblE2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0pDaGNJaU53Y21sMllXTjVVMlYwZEdsdVoxTnNhV1JsY2x3aUtTNXpiR2xrWlhJb2UyMXBiam94TEcxaGVEbzFMSE4wWlhBNk1TeDJZV3gxWlRvemZTazdYSEpjYmlBZ0lDQWtLRndpSTNCeWFYWmhZM2xUWlhSMGFXNW5VMnhwWkdWeVhDSXBMbTl1S0Z3aWMyeHBaR1ZjSWl3Z1puVnVZM1JwYjI0b2Jpa2dlMXh5WEc0Z0lDQWdJQ0J1TG5aaGJIVmxJRDA5UFNBeElEOWNjbHh1SUNBZ0lDQWdJQ0FrS0Z3aUkzQnlhWFpoWTNsVFpYUjBhVzVuVTJ4cFpHVnlWbUZzWENJcExuUmxlSFFvWENJeU1Gd2lLU0E2WEhKY2JpQWdJQ0FnSUNBZ2JpNTJZV3gxWlQwOVBUSWdQMXh5WEc0Z0lDQWdJQ0FnSUNRb1hDSWpjSEpwZG1GamVWTmxkSFJwYm1kVGJHbGtaWEpXWVd4Y0lpa3VkR1Y0ZENoY0lqUXdYQ0lwSURwY2NseHVJQ0FnSUNBZ0lDQnVMblpoYkhWbFBUMDlNeUEvWEhKY2JpQWdJQ0FnSUNBZ0pDaGNJaU53Y21sMllXTjVVMlYwZEdsdVoxTnNhV1JsY2xaaGJGd2lLUzUwWlhoMEtGd2lOakJjSWlrZ09seHlYRzRnSUNBZ0lDQWdJRzR1ZG1Gc2RXVTlQVDAwSUQ5Y2NseHVJQ0FnSUNBZ0lDQWtLRndpSTNCeWFYWmhZM2xUWlhSMGFXNW5VMnhwWkdWeVZtRnNYQ0lwTG5SbGVIUW9YQ0k0TUZ3aUtTQTZYSEpjYmlBZ0lDQWdJQ0FnYmk1MllXeDFaVDA5UFRVZ0ppWWdKQ2hjSWlOd2NtbDJZV041VTJWMGRHbHVaMU5zYVdSbGNsWmhiRndpS1M1MFpYaDBLRndpTVRBd1hDSXBPMXh5WEc0Z0lDQWdmU2s3WEhKY2JpQWdmU3hjY2x4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdjbVYwZFhKdUlDaGNjbHh1SUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSm1iM0p0TFdkeWIzVndJR1p2Y20wdFozSnZkWEF0YzIxY0lqNWNjbHh1SUNBZ0lDQWdJQ0E4YkdGaVpXd2dhSFJ0YkVadmNqMWNJbWx1Y0hWMFJXMWhhV3d6WENJZ1kyeGhjM05PWVcxbFBWd2lZMjlzTFhOdExUSWdZMjl1ZEhKdmJDMXNZV0psYkZ3aVBsQnlhWFpoWTNrOEwyeGhZbVZzUGx4eVhHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWE50TFRaY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4cGJuQjFkQ0JwWkQxY0luQnlhWFpoWTNsVFpYUjBhVzVuVTJ4cFpHVnlYQ0lnZEhsd1pUMWNJblJsZUhSY0lpQXZQbHh5WEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5c0xYTnRMVEpjSWo1VGFHRnlhVzVuSUR4emNHRnVJR2xrUFZ3aWNISnBkbUZqZVZObGRIUnBibWRUYkdsa1pYSldZV3hjSWo0Mk1Ed3ZjM0JoYmo0bFBDOWthWFkrWEhKY2JpQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdLVHRjY2x4dUlDQjlYSEpjYm4wcE8xeHlYRzVjY2x4dWRtRnlJRTE1VUhKdlptbHNaVWx1ZEdWeVpYTjBjeUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2NseHVJQ0J6YUc5M1JHVjBZV2xzY3pvZ1puVnVZM1JwYjI0b2FXNTBaWEpsYzNRc0lHUmxkR0ZwYkhNcElIdGNjbHh1SUNBZ0lHTnZibk52YkdVdWJHOW5LR2x1ZEdWeVpYTjBJQ3NnWENJNklGd2lJQ3NnU2xOUFRpNXpkSEpwYm1kcFpua29aR1YwWVdsc2N5a3BPMXh5WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1kzVnljbVZ1ZEVsdWRHVnlaWE4wT2lCcGJuUmxjbVZ6ZEN3Z1kzVnljbVZ1ZEVSbGRHRnBiSE02SUdSbGRHRnBiSE45S1R0Y2NseHVJQ0I5TEZ4eVhHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdlMk4xY25KbGJuUkpiblJsY21WemREb2diblZzYkN4Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWTNWeWNtVnVkRVJsZEdGcGJITTZJSHQ5TEZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JoWkdSSmJuUmxjbVZ6ZEVOdmJHeGhjSE5sWkRvZ2RISjFaWDA3WEhKY2JpQWdmU3hjY2x4dUlDQmpiMjF3YjI1bGJuUkVhV1JOYjNWdWREb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0JrWVhSaExtSnNhVzVyVG05a1pYTW9LVHRjY2x4dUlDQjlMRnh5WEc0Z0lITm9iM2RCWkdSTWFXdGxPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMkZrWkVsdWRHVnlaWE4wUTI5c2JHRndjMlZrT2lCbVlXeHpaWDBwTzF4eVhHNGdJSDBzWEhKY2JpQWdhR2xrWlVGa1pFeHBhMlU2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WVdSa1NXNTBaWEpsYzNSRGIyeHNZWEJ6WldRNklIUnlkV1Y5S1R0Y2NseHVJQ0I5TEZ4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0IyWVhJZ2RHaGhkQ0E5SUhSb2FYTTdYSEpjYmlBZ0lDQjJZWElnWTNWeWNtVnVkRWx1ZEdWeVpYTjBjeUE5SUU5aWFtVmpkQzVyWlhsektIUm9hWE11Y0hKdmNITXVhVzUwWlhKbGMzUnpLUzV5WldSMVkyVW9ablZ1WTNScGIyNG9hWE1zSUdrcElIdGNjbHh1SUNBZ0lDQWdhV1lvZEdoaGRDNXdjbTl3Y3k1cGJuUmxjbVZ6ZEhOYmFWMWJKM05sYkdWamRHVmtKMTBwSUh0Y2NseHVJQ0FnSUNBZ0lDQnBjMXRwWFNBOUlIUm9ZWFF1Y0hKdmNITXVhVzUwWlhKbGMzUnpXMmxkTzF4eVhHNGdJQ0FnSUNCOVhISmNiaUFnSUNBZ0lISmxkSFZ5YmlCcGN6dGNjbHh1SUNBZ0lIMHNJSHQ5S1R0Y2NseHVJQ0FnSUhaaGNpQnBiblJsY21WemRFNXZaR1Z6SUQwZ1QySnFaV04wTG10bGVYTW9kR2hwY3k1d2NtOXdjeTVwYm5SbGNtVnpkSE1wTG1acGJIUmxjaWhtZFc1amRHbHZiaWhwYm5SbGNtVnpkQ2tnZTF4eVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEdoaGRDNXdjbTl3Y3k1cGJuUmxjbVZ6ZEhOYmFXNTBaWEpsYzNSZFd5ZHpaV3hsWTNSbFpDZGRPMXh5WEc0Z0lDQWdmU2t1YldGd0tHWjFibU4wYVc5dUtHbHVkR1Z5WlhOMEtTQjdYSEpjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YSEpjYmlBZ0lDQWdJQ0FnUEUxNVVISnZabWxzWlVsdWRHVnlaWE4wSUd0bGVUMTdhVzUwWlhKbGMzUjlJR2x1ZEdWeVpYTjBQWHRwYm5SbGNtVnpkSDBnYzJodmQwUmxkR0ZwYkhNOWUzUm9ZWFF1YzJodmQwUmxkR0ZwYkhNdVltbHVaQ2gwYUdGMExDQnBiblJsY21WemRDd2dkR2hoZEM1d2NtOXdjeTVwYm5SbGNtVnpkSE5iYVc1MFpYSmxjM1JkS1gwZ0x6NWNjbHh1SUNBZ0lDQWdLVHRjY2x4dUlDQWdJSDBwTzF4eVhHNGdJQ0FnTHlwY2NseHVJQ0FnSUhaaGNpQnlaV3hoZEdWa1NXNTBaWEpsYzNSeklEMGdUMkpxWldOMExtdGxlWE1vZEdocGN5NXdjbTl3Y3k1cGJuUmxjbVZ6ZEhNcExtWnBiSFJsY2lobWRXNWpkR2x2YmlocGJuUmxjbVZ6ZENrZ2UxeHlYRzRnSUNBZ0lDQnlaWFIxY200Z0lYUm9ZWFF1Y0hKdmNITXVhVzUwWlhKbGMzUnpXMmx1ZEdWeVpYTjBYVnNuYzJWc1pXTjBaV1FuWFR0Y2NseHVJQ0FnSUgwcE8xeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjJZWElnY21Wc1lYUmxaRWx1ZEdWeVpYTjBjeUE5SUhSb2FYTXVjM1JoZEdVdVkzVnljbVZ1ZEVsdWRHVnlaWE4wSUQ4Z2RHaHBjeTV6ZEdGMFpTNWpkWEp5Wlc1MFJHVjBZV2xzYzFzbmNtVnNZWFJsWkNkZExuTndiR2wwS0M4c0x5a2dPaUJiWFR0Y2NseHVJQ0FnSUhKbGRIVnliaUFvWEhKY2JpQWdJQ0FnSUR4a2FYWStYSEpjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0ptYjNKdExXZHliM1Z3SUdadmNtMHRaM0p2ZFhBdGMyMWNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lEeHNZV0psYkNCamJHRnpjMDVoYldVOVhDSmpiMnd0YzIwdE1pQmpiMjUwY205c0xXeGhZbVZzWENJK1NXNTBaWEpsYzNSelBDOXNZV0psYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMjlzTFhOdExUWmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSndZVzVsYkNCd1lXNWxiQzFwYm5SbGNtVnpkSE5jSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5CaGJtVnNMV0p2WkhsY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlMmx1ZEdWeVpYTjBUbTlrWlhOOVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1OdmJDMXpiUzAwSUdOdmJDMWliM1IwYjIxY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHSjFkSFJ2YmlCMGVYQmxQVndpYzNWaWJXbDBYQ0lnWTJ4aGMzTk9ZVzFsUFZ3aVluUnVJR0owYmkxemJTQmlkRzR0WkdWbVlYVnNkRndpUGtsdGNHOXlkRHd2WW5WMGRHOXVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThZblYwZEc5dUlHbGtQVndpWVdSa1RHbHJaVndpSUc5dVEyeHBZMnM5ZTNSb2FYTXVjMmh2ZDBGa1pFeHBhMlY5SUhSNWNHVTlYQ0p6ZFdKdGFYUmNJaUJ5YjJ4bFBWd2lZblYwZEc5dVhDSWdZMnhoYzNOT1lXMWxQVndpWW5SdUlHSjBiaTF6YlNCaWRHNHRjM1ZqWTJWemMxd2lJR0Z5YVdFdFpYaHdZVzVrWldROVhDSm1ZV3h6WlZ3aUlHRnlhV0V0WTI5dWRISnZiSE05WENKaFpHUk1hV3RsWENJK1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aVoyeDVjR2hwWTI5dUlHZHNlWEJvYVdOdmJpMXdiSFZ6WENJK1BDOXpjR0Z1UGlCQlpHUThMMkoxZEhSdmJqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUR4TmVWQnliMlpwYkdWQlpHUkJia2x1ZEdWeVpYTjBJR2x1ZEdWeVpYTjBjejE3WTNWeWNtVnVkRWx1ZEdWeVpYTjBjMzBnWTI5c2JHRndjMlU5ZTNSb2FYTXVjM1JoZEdVdVlXUmtTVzUwWlhKbGMzUkRiMnhzWVhCelpXUjlJR2hwWkdWQlpHUk1hV3RsUFh0MGFHbHpMbWhwWkdWQlpHUk1hV3RsZlNBdlBseHlYRzRnSUNBZ0lDQWdJRHhOZVZCeWIyWnBiR1ZNYVd0bFJHVjBZV2xzY3lCamRYSnlaVzUwU1c1MFpYSmxjM1E5ZTNSb2FYTXVjM1JoZEdVdVkzVnljbVZ1ZEVsdWRHVnlaWE4wZlNCamRYSnlaVzUwUkdWMFlXbHNjejE3ZEdocGN5NXpkR0YwWlM1amRYSnlaVzUwUkdWMFlXbHNjMzBnY21Wc1lYUmxaRWx1ZEdWeVpYTjBjejE3Y21Wc1lYUmxaRWx1ZEdWeVpYTjBjMzBnWTI5c2JHRndjMlU5ZTJaaGJITmxmU0F2UGx4eVhHNGdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ2s3WEhKY2JpQWdmVnh5WEc1OUtUdGNjbHh1WEhKY2JuWmhjaUJOZVZCeWIyWnBiR1ZKYm5SbGNtVnpkQ0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2NseHVJQ0JvWVc1a2JHVkRiR2xqYXpvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TG5CeWIzQnpMbk5vYjNkRVpYUmhhV3h6S0NrN1hISmNiaUFnZlN4Y2NseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpWW5SdUlHSjBiaTF6YlNCaWRHNHRaR1ZtWVhWc2RGd2lJSEpsWmoxY0ltbHVkR1Z5WlhOMFUzQmhibHdpSUhScGRHeGxQWHQwYUdsekxuQnliM0J6TG1sdWRHVnlaWE4wZlNCclpYazllM1JvYVhNdWNISnZjSE11YVc1MFpYSmxjM1I5SUhKdmJHVTlYQ0ppZFhSMGIyNWNJaUJ2YmtOc2FXTnJQWHQwYUdsekxtaGhibVJzWlVOc2FXTnJmVDVjY2x4dUlDQWdJQ0FnSUNCN1pHRjBZUzVqWVhCcGRHRnNhWHBsS0hSb2FYTXVjSEp2Y0hNdWFXNTBaWEpsYzNRcGZWeHlYRzRnSUNBZ0lDQThMM053WVc0K1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1RYbFFjbTltYVd4bFFXUmtRVzVKYm5SbGNtVnpkQ0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2NseHVJQ0JoWkdSTWFXdGxSRzl1WlRvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQmpiMjV6YjJ4bExteHZaeWdrS0Z3aUkyRmtaRWx1ZEdWeVpYTjBTVzV3ZFhSY0lpa3VkbUZzS0NrcE8xeHlYRzRnSUNBZ2FXWW9aR0YwWVM1aFpHUkpiblJsY21WemRDZ2tLRndpSTJGa1pFbHVkR1Z5WlhOMFNXNXdkWFJjSWlrdWRtRnNLQ2twS1NCN1hISmNiaUFnSUNBZ0lIUm9hWE11Y0hKdmNITXVhR2xrWlVGa1pFeHBhMlVvS1R0Y2NseHVJQ0FnSUgxY2NseHVJQ0FnSUNRb1hDSWpZV1JrU1c1MFpYSmxjM1JKYm5CMWRGd2lLUzUyWVd3b1hDSmNJaWs3WEhKY2JpQWdJQ0J5WlZKbGJtUmxjaWdwTzF4eVhHNGdJSDBzWEhKY2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJSFpoY2lCamRYSnlaVzUwU1c1MFpYSmxjM1JMWlhseklEMGdUMkpxWldOMExtdGxlWE1vZEdocGN5NXdjbTl3Y3k1cGJuUmxjbVZ6ZEhNcE8xeHlYRzRnSUNBZ1kyOXVjMjlzWlM1c2IyY29KMk4xY25KbGJuUWdhVzUwWlhKbGMzUnpPaUFuSUNzZ1NsTlBUaTV6ZEhKcGJtZHBabmtvWTNWeWNtVnVkRWx1ZEdWeVpYTjBTMlY1Y3lrcE8xeHlYRzRnSUNBZ2RtRnlJR0YyWVdsc1lXSnNaVWx1ZEdWeVpYTjBTMlY1Y3lBOUlFOWlhbVZqZEM1clpYbHpLR1JoZEdFdWMzUmhkR2xqU1c1MFpYSmxjM1J6S1M1bWFXeDBaWElvWm5WdVkzUnBiMjRvYVc1MFpYSmxjM1JMWlhrcElIdGNjbHh1SUNBZ0lDQWdjbVYwZFhKdUlHTjFjbkpsYm5SSmJuUmxjbVZ6ZEV0bGVYTXVhVzVrWlhoUFppaHBiblJsY21WemRFdGxlU2tnUFQwZ0xURTdYSEpjYmlBZ0lDQjlLVHRjY2x4dUlDQWdJR052Ym5OdmJHVXViRzluS0NkaGRtRnBiR0ZpYkdVZ2FXNTBaWEpsYzNSek9pQW5JQ3NnU2xOUFRpNXpkSEpwYm1kcFpua29ZWFpoYVd4aFlteGxTVzUwWlhKbGMzUkxaWGx6S1NrN1hISmNiaUFnSUNCMllYSWdZbUZ6WlVScGRsTjBlV3hsY3lBOUlGc25abTl5YlMxbmNtOTFjQ2NzSUNkbWIzSnRMV2R5YjNWd0xYTnRKMTA3WEhKY2JpQWdJQ0JwWmloMGFHbHpMbkJ5YjNCekxtTnZiR3hoY0hObEtTQjdYSEpjYmlBZ0lDQWdJR0poYzJWRWFYWlRkSGxzWlhNdWNIVnphQ2duWTI5c2JHRndjMlVuS1R0Y2NseHVJQ0FnSUgxY2NseHVJQ0FnSUdOdmJuTnZiR1V1Ykc5bktDZEJaR1FnWVNCc2FXdGxPaUJjSWljZ0t5QmlZWE5sUkdsMlUzUjViR1Z6TG1wdmFXNG9KeUFuS1NBcklDZGNJaWNwTzF4eVhHNGdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTllMkpoYzJWRWFYWlRkSGxzWlhNdWFtOXBiaWduSUNjcGZTQnBaRDFjSW1Ga1pFRnVTVzUwWlhKbGMzUmNJajVjY2x4dUlDQWdJQ0FnSUNBOGJHRmlaV3dnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWE50TFRJZ1kyOXVkSEp2YkMxc1lXSmxiRndpUGtGa1pDQmhJR3hwYTJVOEwyeGhZbVZzUGx4eVhHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWE50TFRaY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUhzdktpQThhVzV3ZFhRZ2RIbHdaVDFjSW5SbGVIUmNJaUJqYkdGemMwNWhiV1U5WENKbWIzSnRMV052Ym5SeWIyeGNJaUJ5WldZOVhDSmhaR1JCYmtsdWRHVnlaWE4wU1c1d2RYUmNJaUJwWkQxY0ltRmtaRUZ1U1c1MFpYSmxjM1JKYm5CMWRGd2lJQzgrSUNvdmZWeHlYRzRnSUNBZ0lDQWdJQ0FnUEVGMWRHOWpiMjF3YkdWMFpTQnBibkIxZEVsa1BWd2lZV1JrU1c1MFpYSmxjM1JKYm5CMWRGd2lJR1JsWm1GMWJIUldZV3gxWlQxN0p5ZDlJR1JsWm1GMWJIUk1hWE4wUFh0aGRtRnBiR0ZpYkdWSmJuUmxjbVZ6ZEV0bGVYTjlJR05zWVhOelRtRnRaVDFjSW1admNtMHRZMjl1ZEhKdmJGd2lJR0ZrWkV4cGEyVkViMjVsUFh0MGFHbHpMbUZrWkV4cGEyVkViMjVsZlNBdlBseHlYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMjlzTFhOdExUSmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lEeGlkWFIwYjI0Z2RIbHdaVDFjSW1KMWRIUnZibHdpSUdOc1lYTnpUbUZ0WlQxY0ltSjBiaUJpZEc0dGMyMGdZblJ1TFdSbFptRjFiSFJjSWlCdmJrTnNhV05yUFh0MGFHbHpMbUZrWkV4cGEyVkViMjVsZlQ1RWIyNWxQQzlpZFhSMGIyNCtYSEpjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0tUdGNjbHh1SUNCOVhISmNibjBwTzF4eVhHNWNjbHh1ZG1GeUlFMTVVSEp2Wm1sc1pVeHBhMlZFWlhSaGFXeHpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJSEpsYlc5MlpVbHVkR1Z5WlhOME9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQzh2SUdSaGRHRXVkVzVNYVd0bFFXNUpiblJsY21WemRDaDBhR2x6TG5CeWIzQnpMbU5oZEdWbmIzSjVMQ0IwYUdsekxuQnliM0J6TG1OMWNuSmxiblJKYm5SbGNtVnpkQ2s3WEhKY2JpQWdJQ0JrWVhSaExuVnVUR2xyWlVGdVNXNTBaWEpsYzNRb2RHaHBjeTV3Y205d2N5NWpkWEp5Wlc1MFNXNTBaWEpsYzNRcE8xeHlYRzRnSUNBZ2NtVlNaVzVrWlhJb0tUdGNjbHh1SUNCOUxGeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMllYSWdkR2hoZENBOUlIUm9hWE03WEhKY2JpQWdJQ0IyWVhJZ2NtVnNZWFJsWkVsdWRHVnlaWE4wVG05a1pYTWdQU0IwYUdsekxuQnliM0J6TG5KbGJHRjBaV1JKYm5SbGNtVnpkSE11YldGd0tHWjFibU4wYVc5dUtHbHVkR1Z5WlhOMEtTQjdYSEpjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YSEpjYmlBZ0lDQWdJQ0FnTHk4Z1BFMTVVSEp2Wm1sc1pWSmxiR0YwWldSSmJuUmxjbVZ6ZENCallYUmxaMjl5ZVQxN2RHaGhkQzV3Y205d2N5NWpZWFJsWjI5eWVYMGdjbVZzWVhSbFpFbHVkR1Z5WlhOMFBYdHBiblJsY21WemRIMGdMejVjY2x4dUlDQWdJQ0FnSUNBZ0lEeE5lVkJ5YjJacGJHVlNaV3hoZEdWa1NXNTBaWEpsYzNRZ2NtVnNZWFJsWkVsdWRHVnlaWE4wUFh0cGJuUmxjbVZ6ZEgwZ0x6NWNjbHh1SUNBZ0lDQWdLVHRjY2x4dUlDQWdJSDBwTzF4eVhHNGdJQ0FnZG1GeUlHSmhjMlZFYVhaVGRIbHNaWE1nUFNCYkoyWnZjbTB0WjNKdmRYQW5MQ0FuWm05eWJTMW5jbTkxY0MxemJTZGRPMXh5WEc0Z0lDQWdhV1lvZEdocGN5NXdjbTl3Y3k1amIyeHNZWEJ6WlNrZ2UxeHlYRzRnSUNBZ0lDQmlZWE5sUkdsMlUzUjViR1Z6TG5CMWMyZ29KMk52Ykd4aGNITmxKeWs3WEhKY2JpQWdJQ0I5WEhKY2JpQWdJQ0IyWVhJZ2FIUnRiRHRjY2x4dUlDQWdJR2xtS0hSb2FYTXVjSEp2Y0hNdVkzVnljbVZ1ZEVsdWRHVnlaWE4wS1NCN1hISmNiaUFnSUNBZ0lHaDBiV3dnUFZ4eVhHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFh0aVlYTmxSR2wyVTNSNWJHVnpMbXB2YVc0b0p5QW5LWDBnYVdROVhDSnNhV3RsUkdWMFlXbHNjMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmpiMnd0YzIwdE5pQmpiMnd0YzIwdGIyWm1jMlYwTFRKY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKM1pXeHNJSGRsYkd3dGMyMWNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbkp2ZDF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmpiMnd0ZUhNdE5Gd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFluVjBkRzl1SUhSNWNHVTlYQ0ppZFhSMGIyNWNJaUJqYkdGemMwNWhiV1U5WENKaWRHNGdZblJ1TFhOdElHSjBiaTF3Y21sdFlYSjVYQ0krZTNSb2FYTXVjSEp2Y0hNdVkzVnljbVZ1ZEVsdWRHVnlaWE4wZlR3dlluVjBkRzl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1OdmJDMTRjeTA0WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHgxYkNCamJHRnpjMDVoYldVOVhDSnNhWE4wTFdsdWJHbHVaVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZXk4cVBITjBjbTl1Wno1RFlYUmxaMjl5ZVRvOEwzTjBjbTl1Wno0Z2UyUmhkR0V1WTJGd2FYUmhiR2w2WlNoMGFHbHpMbkJ5YjNCekxtTjFjbkpsYm5SRVpYUmhhV3h6V3lkallYUmxaMjl5ZVNkZEtYMDhZbklnTHo0cUwzMWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wY205dVp6NVViM1JoYkNCamJHbGphM002UEM5emRISnZibWMrSUh0MGFHbHpMbkJ5YjNCekxtTjFjbkpsYm5SRVpYUmhhV3h6V3lkamJHbGphM01uWFgxY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmMyMWhiR3crWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YkdrK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMyMWhiR3crWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRISnZibWMrVTI5MWNtTmxPand2YzNSeWIyNW5QaUJKYlhCdmNuUmxaQ0JtY205dElIdGtZWFJoTG1OaGNHbDBZV3hwZW1Vb2RHaHBjeTV3Y205d2N5NWpkWEp5Wlc1MFJHVjBZV2xzYzFzbmMyOTFjbU5sSjEwcGZUeGljaUF2UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCQlpHUmxaQ0J2YmlCN1RXOXRaVzUwS0hSb2FYTXVjSEp2Y0hNdVkzVnljbVZ1ZEVSbGRHRnBiSE5iSjJGa1pHVmtKMTBwTG1admNtMWhkQ2hjSWtSRUlFMU5UU0JaV1ZsWlhDSXBmVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzVnNQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThjRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSeWIyNW5QbEpsYkdGMFpXUWdhVzUwWlhKbGMzUnpPand2YzNSeWIyNW5QbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSHR5Wld4aGRHVmtTVzUwWlhKbGMzUk9iMlJsYzMxY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5d1BseHlYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1OdmJDMXpiUzAwWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4aWRYUjBiMjRnZEhsd1pUMWNJbk4xWW0xcGRGd2lJSEp2YkdVOVhDSmlkWFIwYjI1Y0lpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0Z1luUnVMWE50SUdKMGJpMWtaV1poZFd4MElISmxiVzkyWlMxc2FXdGxYQ0lnWVhKcFlTMWxlSEJoYm1SbFpEMWNJblJ5ZFdWY0lpQmhjbWxoTFdOdmJuUnliMnh6UFZ3aWNtVnRiM1psVEdsclpWd2lJRzl1UTJ4cFkyczllM1JvYVhNdWNtVnRiM1psU1c1MFpYSmxjM1I5UGxKbGJXOTJaVHd2WW5WMGRHOXVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ1BDOWthWFkrTzF4eVhHNGdJQ0FnZlNCbGJITmxJSHRjY2x4dUlDQWdJQ0FnYUhSdGJDQTlJRHhrYVhZZ1kyeGhjM05PWVcxbFBYdGlZWE5sUkdsMlUzUjViR1Z6TG1wdmFXNG9KeUFuS1gwZ2FXUTlYQ0pzYVd0bFJHVjBZV2xzYzF3aVBqd3ZaR2wyUGp0Y2NseHVJQ0FnSUgxY2NseHVJQ0FnSUhKbGRIVnliaUFvWEhKY2JpQWdJQ0FnSUR4a2FYWStYSEpjYmlBZ0lDQWdJQ0FnZTJoMGJXeDlYSEpjYmlBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1RYbFFjbTltYVd4bFVtVnNZWFJsWkVsdWRHVnlaWE4wSUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHlYRzRnSUdGa1pFbHVkR1Z5WlhOME9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQzh2SUdSaGRHRXVZV1JrVW1Wc1lYUmxaRWx1ZEdWeVpYTjBLSFJvYVhNdWNISnZjSE11WTJGMFpXZHZjbmtzSUhSb2FYTXVjSEp2Y0hNdWNtVnNZWFJsWkVsdWRHVnlaWE4wS1R0Y2NseHVJQ0FnSUdSaGRHRXVZV1JrVW1Wc1lYUmxaRWx1ZEdWeVpYTjBLSFJvYVhNdWNISnZjSE11Y21Wc1lYUmxaRWx1ZEdWeVpYTjBLVHRjY2x4dUlDQWdJSEpsVW1WdVpHVnlLQ2s3WEhKY2JpQWdmU3hjY2x4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdjbVYwZFhKdUlDaGNjbHh1SUNBZ0lDQWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2lZblJ1SUdKMGJpMXpiU0JpZEc0dFpHVm1ZWFZzZEZ3aUlISmxaajFjSW1sdWRHVnlaWE4wVTNCaGJsd2lJSFJwZEd4bFBYdDBhR2x6TG5CeWIzQnpMbkpsYkdGMFpXUkpiblJsY21WemRIMGdhMlY1UFh0MGFHbHpMbkJ5YjNCekxuSmxiR0YwWldSSmJuUmxjbVZ6ZEgwZ2NtOXNaVDFjSW1KMWRIUnZibHdpSUc5dVEyeHBZMnM5ZTNSb2FYTXVZV1JrU1c1MFpYSmxjM1I5UGx4eVhHNGdJQ0FnSUNBZ0lIdGtZWFJoTG1OaGNHbDBZV3hwZW1Vb2RHaHBjeTV3Y205d2N5NXlaV3hoZEdWa1NXNTBaWEpsYzNRcGZWeHlYRzRnSUNBZ0lDQThMM053WVc0K1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1RYbFFjbTltYVd4bElEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh5WEc0Z0lHZGxkRWx1YVhScFlXeFRkR0YwWlRvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQnlaWFIxY200Z2UxeHlYRzRnSUNBZ0lDQXZMeUJqWVhSbFoyOXllVG9nVDJKcVpXTjBMbXRsZVhNb2MzUmhkR2xqUkdGMFlTbGJNRjBzWEhKY2JpQWdJQ0FnSUM4dklHbHVkR1Z5WlhOMGN6b2djM1JoZEdsalJHRjBZVnRQWW1wbFkzUXVhMlY1Y3loemRHRjBhV05FWVhSaEtWc3dYVjFjY2x4dUlDQWdJQ0FnYVc1MFpYSmxjM1J6T2lCa1lYUmhMbk4wWVhScFkwbHVkR1Z5WlhOMGMxeHlYRzRnSUNBZ2ZUdGNjbHh1SUNCOUxGeHlYRzRnSUdkbGRFTmhkR1ZuYjNKNVQyNURhR0Z1WjJVNklHWjFibU4wYVc5dUtHTmhkR1ZuYjNKNUtTQjdYSEpjYmlBZ0lDQmpiMjV6YjJ4bExteHZaeWhLVTA5T0xuTjBjbWx1WjJsbWVTaGtZWFJoTG5OMFlYUnBZMFJoZEdGYlkyRjBaV2R2Y25sZEtTazdYSEpjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0allYUmxaMjl5ZVRvZ1kyRjBaV2R2Y25rc1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwYm5SbGNtVnpkSE02SUdSaGRHRXVjM1JoZEdsalJHRjBZVnRqWVhSbFoyOXllVjE5S1R0Y2NseHVJQ0I5TEZ4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4WkdsMklISnZiR1U5WENKMFlXSndZVzVsYkZ3aUlHTnNZWE56VG1GdFpUMWNJblJoWWkxd1lXNWxJR1poWkdVZ1lXTjBhWFpsSUdsdVhDSWdhV1E5WENKd2NtOW1hV3hsWENJK1hISmNiaUFnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmpiMjUwWVdsdVpYSmNJajVjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0E4VFhsUWNtOW1hV3hsU0dWaFpHVnlJQzgrWEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0ptYjNKdExXaHZjbWw2YjI1MFlXeGNJajVjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUhzdktqeE5lVkJ5YjJacGJHVkRZWFJsWjI5eWFXVnpJR05oZEdWbmIzSnBaWE05ZTA5aWFtVmpkQzVyWlhsektHUmhkR0V1YzNSaGRHbGpSR0YwWVNsOUlHZGxkRU5oZEdWbmIzSjVUMjVEYUdGdVoyVTllM1JvYVhNdVoyVjBRMkYwWldkdmNubFBia05vWVc1blpYMGdMejRxTDMxY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEUxNVVISnZabWxzWlZCeWFYWmhZM2tnTHo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZXk4cVBFMTVVSEp2Wm1sc1pVbHVkR1Z5WlhOMGN5QmpZWFJsWjI5eWVUMTdkR2hwY3k1emRHRjBaUzVqWVhSbFoyOXllWDBnYVc1MFpYSmxjM1J6UFh0MGFHbHpMbk4wWVhSbExtbHVkR1Z5WlhOMGMzMGdjMlYwU1c1MFpYSmxjM1J6UFh0MGFHbHpMbk5sZEVsdWRHVnlaWE4wYzMwZ0x6NHFMMzFjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQRTE1VUhKdlptbHNaVWx1ZEdWeVpYTjBjeUJwYm5SbGNtVnpkSE05ZTNSb2FYTXVjM1JoZEdVdWFXNTBaWEpsYzNSemZTQnpaWFJKYm5SbGNtVnpkSE05ZTNSb2FYTXVjMlYwU1c1MFpYSmxjM1J6ZlNBdlBseHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ2s3WEhKY2JpQWdmVnh5WEc1OUtUdGNjbHh1WEhKY2JuWmhjaUJPYjNScFptbGpZWFJwYjI1eklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh5WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQnlaWFIxY200Z0tGeHlYRzRnSUNBZ0lDQThjMlZqZEdsdmJpQnliMnhsUFZ3aWRHRmljR0Z1Wld4Y0lpQmpiR0Z6YzA1aGJXVTlYQ0owWVdJdGNHRnVaU0JtWVdSbElHRmpkR2wyWlNCcGJsd2lJR2xrUFZ3aWJtOTBhV1pwWTJGMGFXOXVjMXdpUGx4eVhHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXVkR0ZwYm1WeVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBOGFHVmhaR1Z5SUdOc1lYTnpUbUZ0WlQxY0luQmhaMlV0YUdWaFpHVnlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHhvTVQ1T2IzUnBabWxqWVhScGIyNXpJRHh6YldGc2JENW1jbTl0UEM5emJXRnNiRDRnVzNOcGRHVXVZMjl0WFR3dmFERStYSEpjYmlBZ0lDQWdJQ0FnSUNBOEwyaGxZV1JsY2o1Y2NseHVJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2ljbTkzWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5c0xYaHpMVEV5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BIUmhZbXhsSUdOc1lYTnpUbUZ0WlQxY0luUmhZbXhsSUhSaFlteGxMVzV2ZEdsbWFXTmhkR2x2Ym5OY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHgwYUdWaFpENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhSeVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MGFDQmpiMnhUY0dGdVBWd2lNbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhBK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGTnBkR1V1WTI5dElHaGhjeUJ5WlhGMVpYTjBaV1FnZEc4Z1lXUmtJR1p2Ykd4dmQybHVaeUJwYm5SbGNtVnpkSE1nZEc4Z2VXOTFjaUJ3Y205bWFXeGxManhpY2lBdlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjMjFoYkd3K1UyVmxJRHhoSUdoeVpXWTlYQ0lqWENJK2MyVjBkR2x1WjNNOEwyRStJSFJ2SUdOb1lXNW5aU0IwYUdVZ1pHVm1ZWFZzZENCaVpXaGhkbWx2Y2lCbWIzSWdkR2hwY3lCM2FXNWtiM2N1UEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Y0Q1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNSb1BseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MGFENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHVZWFlnWTJ4aGMzTk9ZVzFsUFZ3aWRHRmliR1V0Wm1sc2RHVnlJSFJsZUhRdGNtbG5hSFJjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIVnNJR05zWVhOelRtRnRaVDFjSW14cGMzUXRhVzVzYVc1bFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cElHTnNZWE56VG1GdFpUMWNJblJsZUhRdGJYVjBaV1JjSWo1VGFHOTNPand2YkdrK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hwUGp4aElHaHlaV1k5WENJalhDSStVR1Z1WkdsdVp6d3ZZVDQ4TDJ4cFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhzYVQ0OFlTQm9jbVZtUFZ3aUkxd2lQa0ZqWTJWd2RHVmtQQzloUGp3dmJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBqeGhJR2h5WldZOVhDSWpYQ0krVW1WcVpXTjBaV1E4TDJFK1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJHa2dZMnhoYzNOT1lXMWxQVndpWVdOMGFYWmxYQ0krUEdFZ2FISmxaajFjSWlOY0lqNUJiR3c4TDJFK1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5MWJENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZibUYyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2ZEdnK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2ZEhJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM1JvWldGa1BseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSFJpYjJSNVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4ZEhJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhSb0lITmpiM0JsUFZ3aWNtOTNYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNCaGJpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0Z1luUnVJR0owYmkxemJTQmlkRzR0WkdWbVlYVnNkRndpUGxSbGJtNXBjend2YzNCaGJqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzUm9QbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDBaRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHgxYkNCamJHRnpjMDVoYldVOVhDSnNhWE4wTFdsdWJHbHVaVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOdFlXeHNQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1EyRjBaV2R2Y25rNklEeHpkSEp2Ym1jK1UzQnZjblJ6UEM5emRISnZibWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZOdmRYSmpaVG9nU1cxd2IzSjBaV1FnWm5KdmJTQThjM1J5YjI1blBrWmhZMlZpYjI5clBDOXpkSEp2Ym1jK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGSmxjWFZsYzNSbFpDQnZiaUJBUkdGMFpWUnBiV1V1VG05M1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmRXdytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBaRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThkR1FnWTJ4aGMzTk9ZVzFsUFZ3aWRHVjRkQzF5YVdkb2RGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmlkRzR0WjNKdmRYQmNJaUJ5YjJ4bFBWd2laM0p2ZFhCY0lpQmhjbWxoTFd4aFltVnNQVndpTGk0dVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhpZFhSMGIyNGdkSGx3WlQxY0ltSjFkSFJ2Ymx3aUlHTnNZWE56VG1GdFpUMWNJbUowYmlCaWRHNHRiR2x1YXlCaWRHNHRjM1ZqWTJWemMxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVJR05zWVhOelRtRnRaVDFjSW1aaElHWmhMV05vWldOclhDSStQQzl6Y0dGdVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbWhwWkdSbGJpMTRjMXdpUGtGd2NISnZkbVU4TDNOd1lXNCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WW5WMGRHOXVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WW5WMGRHOXVJSFI1Y0dVOVhDSmlkWFIwYjI1Y0lpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0Z1luUnVMV3hwYm1zZ1luUnVMV1JoYm1kbGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVJR05zWVhOelRtRnRaVDFjSW1aaElHWmhMWEpsYlc5MlpWd2lQand2YzNCaGJqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNCaGJpQmpiR0Z6YzA1aGJXVTlYQ0pvYVdSa1pXNHRlSE5jSWo1U1pXMXZkbVU4TDNOd1lXNCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WW5WMGRHOXVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5MFpENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5MGNqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhSeVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MGFDQnpZMjl3WlQxY0luSnZkMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpWW5SdUlHSjBiaTF6YlNCaWRHNHRaR1ZtWVhWc2RGd2lQbE5yYVdsdVp6d3ZjM0JoYmo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNSb1BseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MFpENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDFiQ0JqYkdGemMwNWhiV1U5WENKc2FYTjBMV2x1YkdsdVpWd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YkdrK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE50WVd4c1BseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUTJGMFpXZHZjbms2SUR4emRISnZibWMrVTNCdmNuUnpQQzl6ZEhKdmJtYytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRk52ZFhKalpUb2dTVzF3YjNKMFpXUWdabkp2YlNBOGMzUnliMjVuUGtaaFkyVmliMjlyUEM5emRISnZibWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZKbGNYVmxjM1JsWkNCdmJpQkFSR0YwWlZScGJXVXVUbTkzWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2ZFd3K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5MFpENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGRHUWdZMnhoYzNOT1lXMWxQVndpZEdWNGRDMXlhV2RvZEZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKaWRHNHRaM0p2ZFhCY0lpQnliMnhsUFZ3aVozSnZkWEJjSWlCaGNtbGhMV3hoWW1Wc1BWd2lMaTR1WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGlkWFIwYjI0Z2RIbHdaVDFjSW1KMWRIUnZibHdpSUdOc1lYTnpUbUZ0WlQxY0ltSjBiaUJpZEc0dGJHbHVheUJpZEc0dGMzVmpZMlZ6YzF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbVpoSUdaaExXTm9aV05yWENJK1BDOXpjR0Z1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltaHBaR1JsYmkxNGMxd2lQa0Z3Y0hKdmRtVThMM053WVc0K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZZblYwZEc5dVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThZblYwZEc5dUlIUjVjR1U5WENKaWRYUjBiMjVjSWlCamJHRnpjMDVoYldVOVhDSmlkRzRnWW5SdUxXeHBibXNnWW5SdUxXUmhibWRsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbVpoSUdaaExYSmxiVzkyWlZ3aVBqd3ZjM0JoYmo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM0JoYmlCamJHRnpjMDVoYldVOVhDSm9hV1JrWlc0dGVITmNJajVTWlcxdmRtVThMM053WVc0K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZZblYwZEc5dVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzkwWkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzkwY2o1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSFJ5UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHgwYUNCelkyOXdaVDFjSW5KdmQxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2lZblJ1SUdKMGJpQmlkRzR0YzIwZ1luUnVMV1JsWm1GMWJIUmNJajVYYVc1a2MzVnlabWx1Wnp3dmMzQmhiajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM1JvUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHgwWkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MWJDQmpiR0Z6YzA1aGJXVTlYQ0pzYVhOMExXbHViR2x1WlZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThiR2srWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITnRZV3hzUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdRMkYwWldkdmNuazZJRHh6ZEhKdmJtYytVM0J2Y25SelBDOXpkSEp2Ym1jK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGTnZkWEpqWlRvZ1NXMXdiM0owWldRZ1puSnZiU0E4YzNSeWIyNW5Qa1poWTJWaWIyOXJQQzl6ZEhKdmJtYytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRkpsY1hWbGMzUmxaQ0J2YmlCQVJHRjBaVlJwYldVdVRtOTNYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZkV3crWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzkwWkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4ZEdRZ1kyeGhjM05PWVcxbFBWd2lkR1Y0ZEMxeWFXZG9kRndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0dFozSnZkWEJjSWlCeWIyeGxQVndpWjNKdmRYQmNJaUJoY21saExXeGhZbVZzUFZ3aUxpNHVYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4aWRYUjBiMjRnZEhsd1pUMWNJbUoxZEhSdmJsd2lJR05zWVhOelRtRnRaVDFjSW1KMGJpQmlkRzR0YkdsdWF5QmlkRzR0YzNWalkyVnpjMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltWmhJR1poTFdOb1pXTnJYQ0krUEM5emNHRnVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVJR05zWVhOelRtRnRaVDFjSW1ocFpHUmxiaTE0YzF3aVBrRndjSEp2ZG1VOEwzTndZVzQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlluVjBkRzl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFluVjBkRzl1SUhSNWNHVTlYQ0ppZFhSMGIyNWNJaUJqYkdGemMwNWhiV1U5WENKaWRHNGdZblJ1TFd4cGJtc2dZblJ1TFdSaGJtZGxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltWmhJR1poTFhKbGJXOTJaVndpUGp3dmMzQmhiajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzQmhiaUJqYkdGemMwNWhiV1U5WENKb2FXUmtaVzR0ZUhOY0lqNVNaVzF2ZG1VOEwzTndZVzQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlluVjBkRzl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBaRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBjajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmRHSnZaSGsrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5MFlXSnNaVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4Ym1GMklHTnNZWE56VG1GdFpUMWNJblJsZUhRdGNtbG5hSFJjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDFiQ0JqYkdGemMwNWhiV1U5WENKd1lXZHBibUYwYVc5dVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c2FTQmpiR0Z6YzA1aGJXVTlYQ0prYVhOaFlteGxaRndpUGp4aElHRnlhV0V0YkdGaVpXdzlYQ0pRY21WMmFXOTFjMXdpSUdoeVpXWTlYQ0lqWENJK1BITndZVzRnWVhKcFlTMW9hV1JrWlc0OVhDSjBjblZsWENJK3dxc2dVSEpsZG1sdmRYTThMM053WVc0K1BDOWhQand2YkdrK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhzYVNCamJHRnpjMDVoYldVOVhDSmhZM1JwZG1WY0lqNDhZU0JvY21WbVBWd2lJMXdpUGpFZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aWMzSXRiMjVzZVZ3aVBpaGpkWEp5Wlc1MEtUd3ZjM0JoYmo0OEwyRStQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hwUGp4aElHaHlaV1k5WENJalhDSStNand2WVQ0OEwyeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJHaytQR0VnYUhKbFpqMWNJaU5jSWo0elBDOWhQand2YkdrK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhzYVQ0OFlTQm9jbVZtUFZ3aUkxd2lQalE4TDJFK1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQanhoSUdoeVpXWTlYQ0lqWENJK05Ud3ZZVDQ4TDJ4cFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YkdrK1BHRWdZWEpwWVMxc1lXSmxiRDFjSWs1bGVIUmNJaUJvY21WbVBWd2lJMXdpUGp4emNHRnVJR0Z5YVdFdGFHbGtaR1Z1UFZ3aWRISjFaVndpUGs1bGVIUWd3cnM4TDNOd1lXNCtQQzloUGp3dmJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNWc1BseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZibUYyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0E4TDNObFkzUnBiMjQrWEhKY2JpQWdJQ0FwTzF4eVhHNGdJSDFjY2x4dWZTazdYSEpjYmx4eVhHNTJZWElnU1cxd2IzSjBJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4YzJWamRHbHZiaUJ5YjJ4bFBWd2lkR0ZpY0dGdVpXeGNJaUJqYkdGemMwNWhiV1U5WENKMFlXSXRjR0Z1WlNCbVlXUmxJR0ZqZEdsMlpTQnBibHdpSUdsa1BWd2lhVzF3YjNKMFhDSStYSEpjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjI1MFlXbHVaWEpjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJRHhvWldGa1pYSWdZMnhoYzNOT1lXMWxQVndpY0dGblpTMW9aV0ZrWlhKY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHZ3pQaTR1TG5sdmRYSWdhVzUwWlhKbGMzUnpJR0ZqY205emN5QmhjSEJ6SUdGdVpDQmtaWFpwWTJWekxqd3ZhRE0rWEhKY2JpQWdJQ0FnSUNBZ0lDQThMMmhsWVdSbGNqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpY205M1hDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWGh6TFRZZ1kyOXNMV3huTFRSY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThjQ0JqYkdGemMwNWhiV1U5WENKc1pXRmtYQ0krUTI5dWJtVmpkQ0IzYVhSb0lFWmhZMlZpYjI5cklUd3ZjRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbkIxYkd3dGJHVm1kRndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBjbTl1Wno1TVlYTjBJSE41Ym1NNlBDOXpkSEp2Ym1jK0lESTFJR2x1ZEdWeVpYTjBjeUFvTlNCdVpYY3BQR0p5SUM4K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1J5YjI1blBreGhjM1FnYzNsdVkyVmtJRzl1T2p3dmMzUnliMjVuUGlCQVJHRjBaVlJwYldVdVRtOTNYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BHRWdhSEpsWmoxY0lpTmNJaUJqYkdGemMwNWhiV1U5WENKaWRHNGdZblJ1TFhOdElHSjBiaTFrWldaaGRXeDBJSEIxYkd3dGNtbG5hSFJjSWo1RGIyNXVaV04wUEM5aFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmpiMnd0ZUhNdE5pQmpiMnd0YkdjdE5DQmpiMnd0YkdjdGIyWm1jMlYwTFRGY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThjQ0JqYkdGemMwNWhiV1U5WENKc1pXRmtYQ0krU1cxd2IzSjBJSGx2ZFhJZ2NHbHVjeUJtY205dElGQnBiblJsY21WemRDRThMM0ErWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p3ZFd4c0xXeGxablJjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkSEp2Ym1jK1RHRnpkQ0J6ZVc1ak9qd3ZjM1J5YjI1blBpQXlOU0JwYm5SbGNtVnpkSE1nS0RVZ2JtVjNLVHhpY2lBdlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wY205dVp6NU1ZWE4wSUhONWJtTmxaQ0J2YmpvOEwzTjBjbTl1Wno0Z1FFUmhkR1ZVYVcxbExrNXZkMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGhJR2h5WldZOVhDSWpYQ0lnWTJ4aGMzTk9ZVzFsUFZ3aVluUnVJR0owYmkxemJTQmlkRzR0WkdWbVlYVnNkQ0J3ZFd4c0xYSnBaMmgwWENJK1NXMXdiM0owUEM5aFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQR2h5SUM4K1hISmNiaUFnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbkp2ZDF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1OdmJDMTRjeTB4TWlCamIyd3RiR2N0T1Z3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeG9NejVVY25rZ2VXOTFjaUJoY0hBaFBDOW9NejVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4Y0Q1TWFXdGxJR052Ym5SeWIyeHNhVzVuSUhSb1pTQjNaV0kvUHo4Z1YyVWdkR2h2ZFdkb2RDQnpieTRnVDNWeUlHNXBablI1SUdGd2NDQnNaWFJ6SUhsdmRTQjBZV3RsSUdsMElIUnZJSFJvWlNCdVpYaDBJR3hsZG1Wc0lHRnVaQ0J3ZFhSeklHRnNiQ0I1YjNWeUlHbHVkR1Z5Ym1WMExYZHBaR1VnY0hKbFptVnlaVzVqWlhNZ2FXNGdiMjVsSUdObGJuUnlZV3dnY0d4aFkyVWdjMjhnZVc5MUlHTmhiaUJ4ZFdsamEyeDVJR0Z1WkNCbFlYTnBiSGtnZG1sbGR5QmhibVFnWVdOalpYQjBJSGx2ZFhJZ2JtOTBhV1pwWTJGMGFXOXVjeUIzYVhSb0lHRWdabVYzSUhOMFpYQnpMand2Y0Q1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5CMWJHd3RiR1ZtZEZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR0VnYUhKbFpqMWNJaU5jSWlCamJHRnpjMDVoYldVOVhDSmlkRzRnWW5SdUxYTnRJR0owYmkxa1pXWmhkV3gwWENJK1pHOTNibXh2WVdRZ1ptOXlJR0Z1WkhKdmFXUThMMkUrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFlTQm9jbVZtUFZ3aUkxd2lJR05zWVhOelRtRnRaVDFjSW1KMGJpQmlkRzR0YzIwZ1luUnVMV1JsWm1GMWJIUmNJajVrYjNkdWJHOWhaQ0JtYjNJZ2FYQm9iMjVsUEM5aFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpY0hWc2JDMXlhV2RvZEZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdSMjkwSUdGdUlHRndjRDhnVG05M0lEeGhJR2h5WldZOVhDSWpYQ0lnWTJ4aGMzTk9ZVzFsUFZ3aVluUnVJR0owYmkxemJTQmlkRzR0WkdWbVlYVnNkRndpUGtkbGJtVnlZWFJsSUdFZ2MzbHVZeUJqYjJSbElUd3ZZVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ1BDOXpaV04wYVc5dVBseHlYRzRnSUNBZ0tUdGNjbHh1SUNCOVhISmNibjBwTzF4eVhHNWNjbHh1ZG1GeUlGTmxkSFJwYm1keklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh5WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQnlaWFIxY200Z0tGeHlYRzRnSUNBZ0lDQThjMlZqZEdsdmJpQnliMnhsUFZ3aWRHRmljR0Z1Wld4Y0lpQmpiR0Z6YzA1aGJXVTlYQ0owWVdJdGNHRnVaU0JtWVdSbElHRmpkR2wyWlNCcGJsd2lJR2xrUFZ3aWMyVjBkR2x1WjNOY0lqNWNjbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbU52Ym5SaGFXNWxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQR2hsWVdSbGNpQmpiR0Z6YzA1aGJXVTlYQ0p3WVdkbExXaGxZV1JsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOGFERStVMlYwZEdsdVozTWdQSE50WVd4c1BtOXVQQzl6YldGc2JENGdXM05wZEdVdVkyOXRYVHd2YURFK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4d1BsbHZkU0JoY21VZ2FXNGdZMjl1ZEhKdmJDRWdRMmhoYm1kbElIbHZkWElnYzJWMGRHbHVaM01nYUdWeVpTNDhMM0ErWEhKY2JpQWdJQ0FnSUNBZ0lDQThMMmhsWVdSbGNqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWm05eWJTMW9iM0pwZW05dWRHRnNYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2labTl5YlMxbmNtOTFjQ0JtYjNKdExXZHliM1Z3TFhOdFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hoWW1Wc0lHaDBiV3hHYjNJOVhDSndaWEp6YjI1aGJHbDZZWFJwYjI1Y0lpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGVITXROeUJqYjJ3dGMyMHROU0JqYjJ3dGJXUXROQ0JqYjJ3dGJHY3RNeUJqYjI1MGNtOXNMV3hoWW1Wc1hDSStVR1Z5YzI5dVlXeHBlbUYwYVc5dVBDOXNZV0psYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1OdmJDMTRjeTAxSUdOdmJDMXpiUzAzSUdOdmJDMXRaQzA0SUdOdmJDMXNaeTA1WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThhVzV3ZFhRZ2RIbHdaVDFjSW1Ob1pXTnJZbTk0WENJZ2JtRnRaVDFjSW5CbGNuTnZibUZzYVhwaGRHbHZibHdpSUdOc1lYTnpUbUZ0WlQxY0luTjNhWFJqYUZ3aUlDOCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThhSElnTHo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0ptYjNKdExXZHliM1Z3SUdadmNtMHRaM0p2ZFhBdGMyMWNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4YkdGaVpXd2dhSFJ0YkVadmNqMWNJbk52Y25ScGJtZGNJaUJqYkdGemMwNWhiV1U5WENKamIyd3RlSE10TnlCamIyd3RjMjB0TlNCamIyd3RiV1F0TkNCamIyd3RiR2N0TXlCamIyNTBjbTlzTFd4aFltVnNYQ0krVTI5eWRHbHVaend2YkdGaVpXdytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmpiMnd0ZUhNdE5TQmpiMnd0YzIwdE55QmpiMnd0YldRdE9DQmpiMnd0YkdjdE9Wd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhObGJHVmpkQ0JqYkdGemN6MWNJbk5sYkdWamRIQnBZMnRsY2x3aUlHbGtQVndpYzI5eWRHbHVaMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThiM0IwYVc5dVBsbHZkWElnYVc1MFpYSmxjM1J6UEM5dmNIUnBiMjQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHZjSFJwYjI0K1UybDBaU0JrWldaaGRXeDBQQzl2Y0hScGIyNCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNObGJHVmpkRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHhvY2lBdlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1admNtMHRaM0p2ZFhBZ1ptOXliUzFuY205MWNDMXpiVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c1lXSmxiQ0JvZEcxc1JtOXlQVndpWVhWMGIzTmhkbVZjSWlCamJHRnpjMDVoYldVOVhDSmpiMnd0ZUhNdE55QmpiMnd0YzIwdE5TQmpiMnd0YldRdE5DQmpiMnd0YkdjdE15QmpiMjUwY205c0xXeGhZbVZzWENJK1FYVjBiM05oZG1VOEwyeGhZbVZzUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5c0xYaHpMVFVnWTI5c0xYTnRMVGNnWTI5c0xXMWtMVGdnWTI5c0xXeG5MVGxjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHBibkIxZENCMGVYQmxQVndpWTJobFkydGliM2hjSWlCdVlXMWxQVndpWVhWMGIzTmhkbVZjSWlCamJHRnpjMDVoYldVOVhDSnpkMmwwWTJoY0lpQXZQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQR2h5SUM4K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWm05eWJTMW5jbTkxY0NCbWIzSnRMV2R5YjNWd0xYTnRYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4aFltVnNJR2gwYld4R2IzSTlYQ0prWld4bGRHVmNJaUJqYkdGemMwNWhiV1U5WENKamIyd3RlSE10TnlCamIyd3RjMjB0TlNCamIyd3RiV1F0TkNCamIyd3RiR2N0TXlCamIyNTBjbTlzTFd4aFltVnNYQ0krUkdWc1pYUmxJRzE1SUhCeWIyWnBiR1VnUEhOdFlXeHNQbUYwUEM5emJXRnNiRDRnUEdrK1czTnBkR1V1WTI5dFhUd3ZhVDQ4TDJ4aFltVnNQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMjlzTFhoekxUVWdZMjlzTFhOdExUY2dZMjlzTFcxa0xUZ2dZMjlzTFd4bkxUbGNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4aElHaHlaV1k5WENJalhDSWdZMnhoYzNOT1lXMWxQVndpWW5SdUlHSjBiaTF6YlNCaWRHNHRaR0Z1WjJWeVhDSStSR1ZzWlhSbFBDOWhQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBOEwzTmxZM1JwYjI0K1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1VISnBkbUZqZVNBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNjbHh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2NtVjBkWEp1SUNoY2NseHVJQ0FnSUNBZ1BITmxZM1JwYjI0Z2NtOXNaVDFjSW5SaFluQmhibVZzWENJZ1kyeGhjM05PWVcxbFBWd2lkR0ZpTFhCaGJtVWdabUZrWlNCaFkzUnBkbVVnYVc1Y0lpQnBaRDFjSW5CeWFYWmhZM2xjSWo1Y2NseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiblJoYVc1bGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BHaGxZV1JsY2lCamJHRnpjMDVoYldVOVhDSndZV2RsTFdobFlXUmxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4YURFK1VISnBkbUZqZVR3dmFERStYSEpjYmlBZ0lDQWdJQ0FnSUNBOEwyaGxZV1JsY2o1Y2NseHVJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2ljbTkzWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5c0xYaHpMVEV3WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BIQWdZMnhoYzNOT1lXMWxQVndpYkdWaFpGd2lQa3h2Y21WdElHbHdjM1Z0SUdSdmJHOXlJSE5wZENCaGJXVjBMQ0JqYjI1elpXTjBaWFIxY2lCaFpHbHdhWE5qYVc1bklHVnNhWFF1SUVsdWRHVm5aWElnYm1WaklHOWthVzh1SUZCeVlXVnpaVzUwSUd4cFltVnlieTRnVTJWa0lHTjFjbk4xY3lCaGJuUmxJR1JoY0dsaWRYTWdaR2xoYlM0Z1UyVmtJRzVwYzJrdUlFNTFiR3hoSUhGMWFYTWdjMlZ0SUdGMElHNXBZbWdnWld4bGJXVnVkSFZ0SUdsdGNHVnlaR2xsZEM0OEwzQStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEErVEc5eVpXMGdhWEJ6ZFcwZ1pHOXNiM0lnYzJsMElHRnRaWFFzSUdOdmJuTmxZM1JsZEhWeUlHRmthWEJwYzJOcGJtY2daV3hwZEM0Z1NXNTBaV2RsY2lCdVpXTWdiMlJwYnk0Z1VISmhaWE5sYm5RZ2JHbGlaWEp2TGlCVFpXUWdZM1Z5YzNWeklHRnVkR1VnWkdGd2FXSjFjeUJrYVdGdExpQlRaV1FnYm1semFTNGdUblZzYkdFZ2NYVnBjeUJ6WlcwZ1lYUWdibWxpYUNCbGJHVnRaVzUwZFcwZ2FXMXdaWEprYVdWMExqd3ZjRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdQQzl6WldOMGFXOXVQbHh5WEc0Z0lDQWdLVHRjY2x4dUlDQjlYSEpjYm4wcE8xeHlYRzVjY2x4dWRtRnlJRUZpYjNWMElEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh5WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQnlaWFIxY200Z0tGeHlYRzRnSUNBZ0lDQThjMlZqZEdsdmJpQnliMnhsUFZ3aWRHRmljR0Z1Wld4Y0lpQmpiR0Z6YzA1aGJXVTlYQ0owWVdJdGNHRnVaU0JtWVdSbElHRmpkR2wyWlNCcGJsd2lJR2xrUFZ3aVlXSnZkWFJjSWo1Y2NseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiblJoYVc1bGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BHaGxZV1JsY2lCamJHRnpjMDVoYldVOVhDSndZV2RsTFdobFlXUmxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4YVcxbklITnlZejFjSWk5cGJXRm5aWE12Ykc5bmJ5MTZhWFowWlhJdWNHNW5YQ0lnWVd4MFBWd2lYQ0lnTHo1Y2NseHVJQ0FnSUNBZ0lDQWdJRHd2YUdWaFpHVnlQbHh5WEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0E4TDNObFkzUnBiMjQrWEhKY2JpQWdJQ0FwTzF4eVhHNGdJSDFjY2x4dWZTazdYSEpjYmx4eVhHNXlaVkpsYm1SbGNpZ3BPMXh5WEc1Y2NseHVMeXBjY2x4dVBDRkVUME5VV1ZCRklHaDBiV3crWEhKY2JqeG9kRzFzUGx4eVhHNGdJRHhvWldGa1BseHlYRzRnSUNBZ1BHMWxkR0VnWTJoaGNuTmxkRDFjSW5WMFppMDRYQ0lnTHo1Y2NseHVJQ0FnSUR4dFpYUmhJRzVoYldVOVhDSjJhV1YzY0c5eWRGd2lJR052Ym5SbGJuUTlYQ0ozYVdSMGFEMWtaWFpwWTJVdGQybGtkR2dzSUdsdWFYUnBZV3d0YzJOaGJHVTlNUzR3WENJK1hISmNiaUFnSUNBOGRHbDBiR1UrUEM5MGFYUnNaVDVjY2x4dUlDQWdJRHhzYVc1cklISmxiRDFjSW5OMGVXeGxjMmhsWlhSY0lpQjBlWEJsUFZ3aWRHVjRkQzlqYzNOY0lpQm9jbVZtUFZ3aVEyOXVkR1Z1ZEM5MlpHNWhMbTFwYmk1amMzTmNJajVjY2x4dUlDQWdJRHh6WTNKcGNIUWdkSGx3WlQxY0luUmxlSFF2YW1GMllYTmpjbWx3ZEZ3aUlITnlZejFjSWxOamNtbHdkSE12Ylc5a1pYSnVhWHB5TFRJdU5pNHlMbXB6WENJK1BDOXpZM0pwY0hRK1hISmNiaUFnUEM5b1pXRmtQbHh5WEc0Z0lEeGliMlI1UGx4eVhHNWNjbHh1SUNBZ0lEd2hMUzBnZG1SdVlTQmhjSEFnTFMwK1hISmNiaUFnSUNBOGMyVmpkR2x2YmlCamJHRnpjejFjSW5aa2JtRmNJajVjY2x4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0luWmtibUV0WW05a2VWd2lQbHh5WEc1Y2NseHVYSFE4SVMwdElHTnZiblJoYVc1bGNpQXRMVDVjY2x4dVhIUThaR2wySUdOc1lYTnpQVndpWTI5dWRHRnBibVZ5WENJK1hISmNibHgwSUNBOFpHbDJJR05zWVhOelBWd2ljbTkzWENJK1hISmNibHh5WEc1Y2RDQWdJQ0E4SVMwdElITnBaR1ZpWVhJZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwK1hISmNibHgwSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0p6YVdSbFltRnlJR052YkMxNGN5MDBJR052YkMxemJTMHpJR052YkMxc1p5MHlYQ0krWEhKY2JseHlYRzVjZENBZ0lDQThMMlJwZGo0OElTMHRJQzl6YVdSbFltRnlJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzArWEhKY2JseHlYRzVjZENBZ0lDQThJUzB0SUcxaGFXNGdZMjl1ZEdWdWRDQXRMVDVjY2x4dVhIUWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0ltMWhhVzR0WTI5dWRHVnVkQ0JqYjJ3dGVITXRPQ0JqYjJ3dGVITXRiMlptYzJWMExUUWdZMjlzTFhOdExUa2dZMjlzTFhOdExXOW1abk5sZEMweklHTnZiQzFzWnkweE1DQmpiMnd0YkdjdGIyWm1jMlYwTFRKY0lqNWNjbHh1WEhRZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aWRHRmlMV052Ym5SbGJuUmNJajVjY2x4dVhISmNibHgwWEhROElTMHRJSE5sWTNScGIyNDZJRzE1SUhCeWIyWnBiR1VnTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0UGx4eVhHNWNjbHh1WEhSY2RDQWdJQ0E4TDJScGRqNDhJUzB0SUM5dGVTQndjbTltYVd4bElHWnZjbTBnTFMwK1hISmNibHh5WEc1Y2RGeDBJQ0E4TDJScGRqNWNjbHh1WEhSY2REd3ZjMlZqZEdsdmJqNDhJUzB0SUM5elpXTjBhVzl1T2lCdGVTQndjbTltYVd4bElDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFBseHlYRzVjY2x4dVhIUmNkRHdoTFMwZ2MyVmpkR2x2YmpvZ2JtOTBhV1pwWTJGMGFXOXVjeUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzArWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOElTMHRJQzl6WldOMGFXOXVPaUJ1YjNScFptbGpZWFJwYjI1eklDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFBseHlYRzVjY2x4dVhIUmNkRHdoTFMwZ2MyVmpkR2x2YmpvZ2FXMXdiM0owSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQ0V0TFNBdmMyVmpkR2x2YmpvZ2FXMXdiM0owSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwK1hISmNibHh5WEc1Y2RGeDBQQ0V0TFNCelpXTjBhVzl1T2lCelpYUjBhVzVuY3lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4SVMwdElITmxZM1JwYjI0NklITmxkSFJwYm1keklDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVDVjY2x4dVhISmNibHgwWEhROElTMHRJSE5sWTNScGIyNDZJSEJ5YVhaaFkza2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHdoTFMwZ0wzTmxZM1JwYjI0NklIQnlhWFpoWTNrZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVDVjY2x4dVhISmNibHgwWEhROElTMHRJSE5sWTNScGIyNDZJR0ZpYjNWMElDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4SVMwdElDOXpaV04wYVc5dU9pQmhZbTkxZENBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0UGx4eVhHNWNjbHh1WEhRZ0lDQWdJQ0E4TDJScGRqNWNjbHh1WEhRZ0lDQWdQQzlrYVhZK1BDRXRMU0F2YldGcGJpQmpiMjUwWlc1MElDMHRQbHh5WEc1Y2NseHVYSFFnSUR3dlpHbDJQbHh5WEc1Y2NseHVYSFFnSUR3aExTMGdZMnh2YzJVZ1lYQndJQzB0UGx4eVhHNWNkQ0FnUEdFZ2FISmxaajFjSWlOamJHOXpaVlprYm1GY0lpQmtZWFJoTFhSdloyZHNaVDFjSW5SdmIyeDBhWEJjSWlCMGFYUnNaVDFjSWtOc2FXTnJJSFJ2SUdOc2IzTmxYQ0lnWTJ4aGMzTTlYQ0pqYkc5elpWWmtibUZjSWo0OGMzQmhiaUJqYkdGemN6MWNJbVpoSUdaaExYQnZkMlZ5TFc5bVpsd2lQand2YzNCaGJqNDhMMkUrWEhKY2JseHlYRzVjZER3dlpHbDJQandoTFMwZ0wyTnZiblJoYVc1bGNpQXRMVDVjY2x4dVhISmNibHgwUENFdExTQnZjR1Z1SUdGd2NDQXRMVDVjY2x4dVhIUThZU0JvY21WbVBWd2lJMjl3Wlc1V1pHNWhYQ0lnWkdGMFlTMTBiMmRuYkdVOVhDSjBiMjlzZEdsd1hDSWdkR2wwYkdVOVhDSkRiR2xqYXlCMGJ5QnZjR1Z1SUZaRVRrRmNJaUJqYkdGemN6MWNJbUowYmlCaWRHNHRjMjBnWW5SdUxYQnlhVzFoY25rZ2IzQmxibFprYm1GY0lqNVBjR1Z1SUhaRVRrRThMMkUrWEhKY2JpQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdQQzl6WldOMGFXOXVQandoTFMwZ0wzWmtibUVnWVhCd0lDMHRQbHh5WEc1Y2NseHVJQ0FnSUR3aExTMGdWMlZpYzJsMFpTQndiR0ZqWldodmJHUmxjaUF0TFQ1Y2NseHVJQ0FnSUR4cGJXY2djM0pqUFZ3aVEyOXVkR1Z1ZEM5cGJXRm5aWE12ZEdsamEyVjBjSEp2TG5CdVoxd2lJR0ZzZEQxY0lsd2lJQzgrWEhKY2JseHlYRzRnSUNBZ1BDRXRMU0JUWTNKcGNIUnpJQzB0UGx4eVhHNGdJQ0FnUEhOamNtbHdkQ0IwZVhCbFBWd2lkR1Y0ZEM5cVlYWmhjMk55YVhCMFhDSWdjM0pqUFZ3aVUyTnlhWEIwY3k5aWRXNWtiR1Z6TDJweGRXVnllUzVxYzF3aVBqd3ZjMk55YVhCMFBseHlYRzRnSUNBZ1BITmpjbWx3ZENCMGVYQmxQVndpZEdWNGRDOXFZWFpoYzJOeWFYQjBYQ0lnYzNKalBWd2lVMk55YVhCMGN5OWlkVzVrYkdWekwySnZiM1J6ZEhKaGNDNXFjMXdpUGp3dmMyTnlhWEIwUGx4eVhHNGdJQ0FnUEhOamNtbHdkQ0IwZVhCbFBWd2lkR1Y0ZEM5cVlYWmhjMk55YVhCMFhDSWdjM0pqUFZ3aVUyTnlhWEIwY3k5aWRXNWtiR1Z6TDNaa2JtRXVhbk5jSWo0OEwzTmpjbWx3ZEQ1Y2NseHVYSEpjYmlBZ1BDOWliMlI1UGx4eVhHNDhMMmgwYld3K1hISmNiaW92WEhKY2JpSmRmUT09Il19
